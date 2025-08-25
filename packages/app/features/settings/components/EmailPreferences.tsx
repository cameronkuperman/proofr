import React, { useState, useEffect } from 'react';
import { View, Text, Switch, ScrollView, ActivityIndicator, Alert } from 'react-native';
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

  const preferenceList = userType === 'student' ? studentPreferences : consultantPreferences;

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
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
        Alert.alert('Error', 'Failed to load email preferences');
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
      Alert.alert('Error', 'Failed to load email preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: string) => {
    if (!userId) return;

    const newValue = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newValue }));

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
        Alert.alert('Error', 'Failed to save preference');
        // Revert the change
        setPreferences(prev => ({ ...prev, [key]: !newValue }));
      }
    } catch (error) {
      console.error('Error saving preference:', error);
      Alert.alert('Error', 'Failed to save preference');
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
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{categoryTitles[category]}</Text>
        {items.map(pref => (
          <View key={pref.key} style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>{pref.label}</Text>
              <Text style={styles.preferenceDescription}>{pref.description}</Text>
            </View>
            <Switch
              value={preferences[pref.key] ?? true}
              onValueChange={() => handleToggle(pref.key)}
              disabled={saving}
            />
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Email Notifications</Text>
        <Text style={styles.subtitle}>
          Choose which emails you'd like to receive
        </Text>
      </View>

      {Object.entries(groupedPreferences).map(([category, items]) =>
        renderCategory(category, items)
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can unsubscribe from individual emails using the link in each email.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  categoryContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingVertical: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 10,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 3,
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#666',
  },
  footer: {
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
} as const;