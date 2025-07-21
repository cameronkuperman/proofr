-- Migration: Add Student Guides System
-- Description: Enables students to create and share guides with the community

-- Guide categories enum
CREATE TYPE guide_category AS ENUM (
  'essays',
  'interviews', 
  'test_prep',
  'applications',
  'financial_aid',
  'extracurriculars',
  'research',
  'international',
  'transfer',
  'gap_year',
  'other'
);

-- Guide status enum
CREATE TYPE guide_status AS ENUM (
  'draft',
  'pending_review',
  'published',
  'flagged',
  'archived'
);

-- Guide difficulty level
CREATE TYPE guide_difficulty AS ENUM (
  'beginner',
  'intermediate', 
  'advanced'
);

-- Main guides table
CREATE TABLE student_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Basic info
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category guide_category NOT NULL,
  difficulty guide_difficulty DEFAULT 'beginner',
  
  -- Content (structured as JSON for flexibility)
  content JSONB NOT NULL, -- Will store sections, text, images, examples, exercises
  table_of_contents JSONB, -- Auto-generated from content structure
  
  -- Metadata
  read_time INTEGER NOT NULL DEFAULT 5, -- in minutes
  word_count INTEGER NOT NULL DEFAULT 0,
  
  -- Status and moderation
  status guide_status NOT NULL DEFAULT 'draft',
  moderation_notes TEXT,
  moderation_score DECIMAL(3,2), -- AI moderation score 0-1
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  
  -- Engagement metrics
  view_count INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  bookmark_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  avg_rating DECIMAL(3,2),
  
  -- SEO and discovery
  tags TEXT[], -- Array of tags for search
  meta_description VARCHAR(160), -- For SEO
  featured BOOLEAN DEFAULT FALSE,
  featured_order INTEGER,
  
  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,
  last_major_update TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Guide sections for better content organization
CREATE TABLE guide_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
  
  -- Section info
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) NOT NULL,
  order_index INTEGER NOT NULL,
  
  -- Content
  content JSONB NOT NULL, -- Rich text, images, code blocks, etc.
  
  -- Navigation
  parent_section_id UUID REFERENCES guide_sections(id) ON DELETE CASCADE,
  depth INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(guide_id, slug)
);

-- User interactions with guides
CREATE TABLE guide_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Interaction types
  viewed BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMPTZ,
  read_progress DECIMAL(5,2) DEFAULT 0, -- Percentage completed
  
  bookmarked BOOLEAN DEFAULT FALSE,
  bookmarked_at TIMESTAMPTZ,
  
  found_helpful BOOLEAN,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  rated_at TIMESTAMPTZ,
  
  -- User notes (private)
  personal_notes TEXT,
  
  -- Sharing
  shared BOOLEAN DEFAULT FALSE,
  shared_at TIMESTAMPTZ,
  share_medium VARCHAR(50), -- 'twitter', 'facebook', 'link', etc.
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(guide_id, user_id)
);

-- Comments/feedback on guides
CREATE TABLE guide_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Comment content
  content TEXT NOT NULL,
  is_question BOOLEAN DEFAULT FALSE,
  
  -- Threading
  parent_comment_id UUID REFERENCES guide_comments(id) ON DELETE CASCADE,
  
  -- Moderation
  flagged BOOLEAN DEFAULT FALSE,
  hidden BOOLEAN DEFAULT FALSE,
  
  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Guide attachments/resources
CREATE TABLE guide_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
  
  -- Resource info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  resource_type VARCHAR(50) NOT NULL, -- 'template', 'checklist', 'worksheet', 'example', etc.
  
  -- File info
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER, -- in bytes
  mime_type VARCHAR(100),
  
  -- Access
  download_count INTEGER DEFAULT 0,
  requires_account BOOLEAN DEFAULT FALSE,
  
  -- Order
  order_index INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Related guides and learning paths
CREATE TABLE guide_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
  to_guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
  
  relation_type VARCHAR(50) NOT NULL, -- 'prerequisite', 'next_step', 'related', 'alternative'
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(from_guide_id, to_guide_id, relation_type)
);

-- Link guides to consultant services
CREATE TABLE guide_service_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES consultants(id) ON DELETE CASCADE,
  
  -- Link context
  link_text VARCHAR(200), -- e.g., "Get personalized help with your essays"
  link_type VARCHAR(50) NOT NULL, -- 'author_service', 'recommended', 'sponsored'
  
  -- Performance
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(guide_id, service_id)
);

-- Guide collections/series
CREATE TABLE guide_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Collection info
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  description TEXT,
  
  -- Type
  is_official BOOLEAN DEFAULT FALSE, -- Proofr-curated collections
  is_learning_path BOOLEAN DEFAULT FALSE, -- Sequential learning
  
  -- Visibility
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Metrics
  subscriber_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Guides in collections
CREATE TABLE collection_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES guide_collections(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
  
  order_index INTEGER NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(collection_id, guide_id)
);

-- Indexes for performance
CREATE INDEX idx_guides_author ON student_guides(author_id);
CREATE INDEX idx_guides_status ON student_guides(status);
CREATE INDEX idx_guides_category ON student_guides(category);
CREATE INDEX idx_guides_published ON student_guides(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_guides_featured ON student_guides(featured_order) WHERE featured = true;
-- Add search vector column
ALTER TABLE student_guides ADD COLUMN search_vector tsvector;

-- Create index on search vector
CREATE INDEX idx_guides_search ON student_guides USING gin(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_guide_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    NEW.title || ' ' || 
    NEW.description || ' ' || 
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain search vector
CREATE TRIGGER update_guide_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description, tags ON student_guides
FOR EACH ROW EXECUTE FUNCTION update_guide_search_vector();
CREATE INDEX idx_guide_interactions_user ON guide_interactions(user_id);
CREATE INDEX idx_guide_interactions_guide ON guide_interactions(guide_id);
CREATE INDEX idx_guide_comments_guide ON guide_comments(guide_id);
CREATE INDEX idx_guide_resources_guide ON guide_resources(guide_id);

-- Update students table to track guide contributions
ALTER TABLE students 
ADD COLUMN guides_published INTEGER DEFAULT 0,
ADD COLUMN guide_views_total INTEGER DEFAULT 0,
ADD COLUMN guide_helpful_total INTEGER DEFAULT 0,
ADD COLUMN is_guide_contributor BOOLEAN DEFAULT FALSE;

-- Update consultants table to allow guide creation
ALTER TABLE consultants
ADD COLUMN guides_published INTEGER DEFAULT 0,
ADD COLUMN can_create_official_guides BOOLEAN DEFAULT FALSE;

-- RLS Policies
ALTER TABLE student_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_service_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_guides ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_guides
CREATE POLICY "Anyone can view published guides" ON student_guides
  FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authors can create guides" ON student_guides
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own guides" ON student_guides
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own drafts" ON student_guides
  FOR DELETE USING (auth.uid() = author_id AND status = 'draft');

-- RLS for guide_interactions
CREATE POLICY "Users can view own interactions" ON guide_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own interactions" ON guide_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions" ON guide_interactions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS for guide_comments
CREATE POLICY "Anyone can view non-hidden comments" ON guide_comments
  FOR SELECT USING (hidden = false OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can comment" ON guide_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON guide_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION increment_guide_view(p_guide_id UUID, p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Increment guide view count
  UPDATE student_guides 
  SET view_count = view_count + 1 
  WHERE id = p_guide_id;
  
  -- Record user interaction
  INSERT INTO guide_interactions (guide_id, user_id, viewed, viewed_at)
  VALUES (p_guide_id, p_user_id, true, now())
  ON CONFLICT (guide_id, user_id) 
  DO UPDATE SET 
    viewed = true,
    viewed_at = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_guide_metrics()
RETURNS trigger AS $$
BEGIN
  -- Update guide metrics when interactions change
  UPDATE student_guides g
  SET 
    helpful_count = (
      SELECT COUNT(*) FROM guide_interactions 
      WHERE guide_id = NEW.guide_id AND found_helpful = true
    ),
    bookmark_count = (
      SELECT COUNT(*) FROM guide_interactions 
      WHERE guide_id = NEW.guide_id AND bookmarked = true
    ),
    avg_rating = (
      SELECT AVG(rating)::decimal(3,2) FROM guide_interactions 
      WHERE guide_id = NEW.guide_id AND rating IS NOT NULL
    )
  WHERE id = NEW.guide_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guide_metrics
AFTER INSERT OR UPDATE ON guide_interactions
FOR EACH ROW EXECUTE FUNCTION calculate_guide_metrics();

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_guide_slug()
RETURNS trigger AS $$
BEGIN
  NEW.slug = lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  NEW.slug = trim(both '-' from NEW.slug);
  
  -- Add random suffix if slug exists
  WHILE EXISTS (SELECT 1 FROM student_guides WHERE slug = NEW.slug AND id != NEW.id) LOOP
    NEW.slug = NEW.slug || '-' || substring(gen_random_uuid()::text, 1, 6);
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_guide_slug_trigger
BEFORE INSERT OR UPDATE OF title ON student_guides
FOR EACH ROW EXECUTE FUNCTION generate_guide_slug();

-- Update author stats when guide is published
CREATE OR REPLACE FUNCTION update_author_guide_stats()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    UPDATE students 
    SET 
      guides_published = guides_published + 1,
      is_guide_contributor = true
    WHERE user_id = NEW.author_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_author_stats_on_publish
AFTER INSERT OR UPDATE ON student_guides
FOR EACH ROW EXECUTE FUNCTION update_author_guide_stats();