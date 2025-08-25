import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';

interface EmailPreference {
  key: string;
  label: string;
  description: string;
  category: 'bookings' | 'messages' | 'account' | 'marketing';
}

const studentPreferences: EmailPreference[] = [
  {
    key: 'booking_confirmations',
    label: 'Booking Confirmations',
    description: 'Receive confirmation when you book a service',
    category: 'bookings'
  },
  {
    key: 'booking_status_updates',
    label: 'Booking Status Updates',
    description: 'Get notified when consultants accept or decline your bookings',
    category: 'bookings'
  },
  {
    key: 'service_completions',
    label: 'Service Completions',
    description: 'Know when your service is ready',
    category: 'bookings'
  },
  {
    key: 'new_messages',
    label: 'New Messages',
    description: 'Get notified when you receive a message',
    category: 'messages'
  },
  {
    key: 'waitlist_updates',
    label: 'Waitlist Updates',
    description: 'Know when a spot opens up on your waitlist',
    category: 'bookings'
  },
  {
    key: 'credits_earned',
    label: 'Credits Earned',
    description: 'Get notified when you earn cashback credits',
    category: 'account'
  },
  {
    key: 'weekly_digest',
    label: 'Weekly Digest',
    description: 'Receive a weekly summary of your activity',
    category: 'marketing'
  },
  {
    key: 'marketing_emails',
    label: 'Promotional Emails',
    description: 'Receive updates about new features and promotions',
    category: 'marketing'
  }
];

const consultantPreferences: EmailPreference[] = [
  {
    key: 'new_booking_requests',
    label: 'New Booking Requests',
    description: 'Get notified when students book your services',
    category: 'bookings'
  },
  {
    key: 'new_messages',
    label: 'New Messages',
    description: 'Get notified when you receive a message',
    category: 'messages'
  },
  {
    key: 'payment_updates',
    label: 'Payment Updates',
    description: 'Receive notifications about your earnings',
    category: 'account'
  },
  {
    key: 'profile_updates',
    label: 'Profile Updates',
    description: 'Get notified about profile verification and changes',
    category: 'account'
  },
  {
    key: 'review_notifications',
    label: 'New Reviews',
    description: 'Know when students leave reviews',
    category: 'bookings'
  },
  {
    key: 'weekly_digest',
    label: 'Weekly Digest',
    description: 'Receive a weekly summary of your performance',
    category: 'marketing'
  },
  {
    key: 'marketing_emails',
    label: 'Promotional Emails',
    description: 'Receive updates about new features and opportunities',
    category: 'marketing'
  }
];

export function EmailPreferences({ userType }: { userType: 'student' | 'consultant' }) {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const preferenceList = userType === 'student' ? studentPreferences : consultantPreferences;

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      
      setUserId(user.id);

      // Load preferences from database
      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        setPreferences(data);
      } else {
        // Set default preferences
        const defaults: Record<string, boolean> = {};
        preferenceList.forEach(pref => {
          defaults[pref.key] = pref.category !== 'marketing';
        });
        setPreferences(defaults);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: string) => {
    if (!userId) return;

    const newValue = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newValue }));
    setSaveMessage(null);

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('email_preferences')
        .upsert({
          user_id: userId,
          [key]: newValue,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving preference:', error);
        setSaveMessage('Failed to save preference');
        // Revert the change
        setPreferences(prev => ({ ...prev, [key]: !newValue }));
      } else {
        setSaveMessage('Preference saved');
        setTimeout(() => setSaveMessage(null), 2000);
      }
    } catch (error) {
      console.error('Error saving preference:', error);
      setSaveMessage('Failed to save preference');
      // Revert the change
      setPreferences(prev => ({ ...prev, [key]: !newValue }));
    } finally {
      setSaving(false);
    }
  };

  const renderCategory = (category: string, items: EmailPreference[]) => {
    const categoryTitles: Record<string, string> = {
      bookings: 'Bookings & Services',
      messages: 'Messages',
      account: 'Account',
      marketing: 'Marketing'
    };

    return (
      <div key={category} className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 px-1">
          {categoryTitles[category]}
        </h3>
        <div className="bg-white rounded-lg border border-gray-200">
          {items.map((pref, index) => (
            <div
              key={pref.key}
              className={`flex items-center justify-between p-4 ${
                index < items.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex-1 mr-4">
                <label htmlFor={pref.key} className="block text-sm font-medium text-gray-900">
                  {pref.label}
                </label>
                <p className="text-sm text-gray-500 mt-1">{pref.description}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={pref.key}
                  checked={preferences[pref.key] ?? true}
                  onChange={() => handleToggle(pref.key)}
                  disabled={saving}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  // Group preferences by category
  const groupedPreferences = preferenceList.reduce((acc, pref) => {
    if (!acc[pref.category]) {
      acc[pref.category] = [];
    }
    acc[pref.category].push(pref);
    return acc;
  }, {} as Record<string, EmailPreference[]>);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Email Notifications</h2>
        <p className="mt-2 text-gray-600">
          Choose which emails you'd like to receive from Proofr
        </p>
      </div>

      {saveMessage && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          saveMessage.includes('Failed') 
            ? 'bg-red-50 text-red-800' 
            : 'bg-green-50 text-green-800'
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedPreferences).map(([category, items]) =>
          renderCategory(category, items)
        )}
      </div>

      <div className="mt-12 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 text-center">
          You can unsubscribe from individual emails using the link provided in each email.
          Your preferences are saved automatically.
        </p>
      </div>
    </div>
  );
}