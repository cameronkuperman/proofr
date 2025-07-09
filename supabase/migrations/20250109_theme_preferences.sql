-- Create user theme preferences table
CREATE TABLE IF NOT EXISTS user_theme_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Theme basics
  theme_mode TEXT DEFAULT 'system' CHECK (theme_mode IN ('light', 'dark', 'system')),
  high_contrast BOOLEAN DEFAULT false,
  reduce_motion BOOLEAN DEFAULT false,
  
  -- Color preferences
  primary_color TEXT DEFAULT '#10B981',
  accent_color TEXT DEFAULT '#DC2626',
  university_color TEXT, -- Their school color for personalization
  
  -- Advanced preferences
  color_blind_mode TEXT CHECK (color_blind_mode IN (NULL, 'protanopia', 'deuteranopia', 'tritanopia')),
  theme_schedule JSONB DEFAULT '{"enabled": false, "light_start": "06:00", "dark_start": "18:00"}'::jsonb,
  
  -- UI preferences
  density TEXT DEFAULT 'comfortable' CHECK (density IN ('compact', 'comfortable', 'spacious')),
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  
  -- Sync settings
  sync_across_devices BOOLEAN DEFAULT true,
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one preference per user
  UNIQUE(user_id)
);

-- Create index for faster queries
CREATE INDEX idx_user_theme_preferences_user_id ON user_theme_preferences(user_id);

-- Real-time sync function
CREATE OR REPLACE FUNCTION sync_theme_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the updated_at timestamp
  NEW.updated_at = NOW();
  NEW.last_synced = NOW();
  
  -- Notify all user's devices of theme change
  PERFORM pg_notify(
    'theme_sync_' || NEW.user_id::text,
    json_build_object(
      'theme_mode', NEW.theme_mode,
      'primary_color', NEW.primary_color,
      'accent_color', NEW.accent_color,
      'high_contrast', NEW.high_contrast
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for syncing theme changes
CREATE TRIGGER theme_preferences_sync
BEFORE UPDATE ON user_theme_preferences
FOR EACH ROW
WHEN (NEW.sync_across_devices = true)
EXECUTE FUNCTION sync_theme_preferences();

-- Enable RLS
ALTER TABLE user_theme_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own theme preferences"
  ON user_theme_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own theme preferences"
  ON user_theme_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own theme preferences"
  ON user_theme_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own theme preferences"
  ON user_theme_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Create default theme preferences for existing users
INSERT INTO user_theme_preferences (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_theme_preferences)
ON CONFLICT (user_id) DO NOTHING;