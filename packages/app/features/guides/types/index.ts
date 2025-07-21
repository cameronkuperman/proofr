// Guide System Types

export enum GuideCategory {
  Essays = 'essays',
  Interviews = 'interviews',
  TestPrep = 'test_prep',
  Applications = 'applications',
  FinancialAid = 'financial_aid',
  Extracurriculars = 'extracurriculars',
  Research = 'research',
  International = 'international',
  Transfer = 'transfer',
  GapYear = 'gap_year',
  Other = 'other'
}

export enum GuideStatus {
  Draft = 'draft',
  PendingReview = 'pending_review',
  Published = 'published',
  Flagged = 'flagged',
  Archived = 'archived'
}

export enum GuideDifficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced'
}

export enum GuideRelationType {
  Prerequisite = 'prerequisite',
  NextStep = 'next_step',
  Related = 'related',
  Alternative = 'alternative'
}

export enum GuideLinkType {
  AuthorService = 'author_service',
  Recommended = 'recommended',
  Sponsored = 'sponsored'
}

// Main guide interface
export interface StudentGuide {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  description: string;
  category: GuideCategory;
  difficulty: GuideDifficulty;
  content: GuideContent;
  table_of_contents?: TableOfContents;
  read_time: number;
  word_count: number;
  status: GuideStatus;
  moderation_notes?: string;
  moderation_score?: number;
  reviewed_at?: string;
  published_at?: string;
  view_count: number;
  helpful_count: number;
  bookmark_count: number;
  share_count: number;
  avg_rating?: number;
  tags: string[];
  meta_description?: string;
  featured: boolean;
  featured_order?: number;
  version: number;
  last_major_update?: string;
  created_at: string;
  updated_at: string;
  search_vector?: any;
  
  // Relations
  author?: StudentProfile;
  sections?: GuideSection[];
  interactions?: GuideInteraction;
  resources?: GuideResource[];
}

// Content structure for guides
export interface GuideContent {
  sections: ContentSection[];
  summary?: string;
  prerequisites?: string[];
  learning_objectives?: string[];
  estimated_time?: number;
}

export interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'code' | 'example' | 'exercise' | 'tip' | 'warning';
  content: any; // Flexible content based on type
  caption?: string;
  order: number;
}

export interface TableOfContents {
  sections: TOCSection[];
}

export interface TOCSection {
  id: string;
  title: string;
  level: number;
  children?: TOCSection[];
}

// Guide sections for structured content
export interface GuideSection {
  id: string;
  guide_id: string;
  title: string;
  slug: string;
  order_index: number;
  content: GuideContent;
  parent_section_id?: string;
  depth: number;
  created_at: string;
  updated_at: string;
}

// User interactions with guides
export interface GuideInteraction {
  id: string;
  guide_id: string;
  user_id: string;
  viewed: boolean;
  viewed_at?: string;
  read_progress: number;
  bookmarked: boolean;
  bookmarked_at?: string;
  found_helpful?: boolean;
  rating?: number;
  rated_at?: string;
  personal_notes?: string;
  shared: boolean;
  shared_at?: string;
  share_medium?: string;
  created_at: string;
  updated_at: string;
}

// Comments on guides
export interface GuideComment {
  id: string;
  guide_id: string;
  user_id: string;
  content: string;
  is_question: boolean;
  parent_comment_id?: string;
  flagged: boolean;
  hidden: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  author?: User;
  replies?: GuideComment[];
}

// Downloadable resources
export interface GuideResource {
  id: string;
  guide_id: string;
  title: string;
  description?: string;
  resource_type: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  download_count: number;
  requires_account: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Related guides
export interface GuideRelation {
  id: string;
  from_guide_id: string;
  to_guide_id: string;
  relation_type: GuideRelationType;
  order_index: number;
  created_at: string;
  
  // Relations
  from_guide?: StudentGuide;
  to_guide?: StudentGuide;
}

// Links to consultant services
export interface GuideServiceLink {
  id: string;
  guide_id: string;
  service_id: string;
  consultant_id: string;
  link_text?: string;
  link_type: GuideLinkType;
  click_count: number;
  conversion_count: number;
  created_at: string;
  
  // Relations
  guide?: StudentGuide;
  service?: Service;
  consultant?: ConsultantProfile;
}

// Guide collections
export interface GuideCollection {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description?: string;
  is_official: boolean;
  is_learning_path: boolean;
  is_public: boolean;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  creator?: User;
  guides?: CollectionGuide[];
}

export interface CollectionGuide {
  id: string;
  collection_id: string;
  guide_id: string;
  order_index: number;
  added_at: string;
  
  // Relations
  collection?: GuideCollection;
  guide?: StudentGuide;
}

// Extended student profile with guide stats
export interface StudentProfile {
  id: string;
  name: string;
  bio?: string;
  current_school?: string;
  school_type?: 'high_school' | 'college';
  grade_level?: string;
  target_application_year?: number;
  preferred_colleges?: string[];
  interests?: string[];
  pain_points?: string[];
  budget_range?: [number, number];
  credit_balance: number;
  lifetime_credits_earned: number;
  onboarding_completed: boolean;
  onboarding_step?: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
  
  // Guide-related stats
  guides_published: number;
  guide_views_total: number;
  guide_helpful_total: number;
  is_guide_contributor: boolean;
}

// Extended consultant profile with guide capabilities
export interface ConsultantProfile {
  id: string;
  name: string;
  bio?: string;
  long_bio?: string;
  current_college?: string;
  colleges_attended?: any;
  major?: string;
  graduation_year?: number;
  verification_status: string;
  verified_at?: string;
  is_available: boolean;
  vacation_mode: boolean;
  rating?: number;
  total_reviews: number;
  total_bookings: number;
  total_earnings: number;
  response_time_hours?: number;
  timezone?: string;
  profile_views: number;
  last_active?: string;
  created_at: string;
  updated_at: string;
  
  // Guide-related
  guides_published: number;
  can_create_official_guides: boolean;
}

// Base user type
export interface User {
  id: string;
  email: string;
  user_type: 'student' | 'consultant';
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

// Service type (for guide-service links)
export interface Service {
  id: string;
  consultant_id: string;
  service_type: string;
  title: string;
  description: string;
  prices: number[];
  price_descriptions: string[];
  delivery_type: string;
  standard_turnaround_hours: number;
  is_active: boolean;
  total_bookings: number;
  avg_rating?: number;
  created_at: string;
  updated_at: string;
}

// Helper types for guide creation/editing
export interface CreateGuideInput {
  title: string;
  description: string;
  category: GuideCategory;
  difficulty: GuideDifficulty;
  content: GuideContent;
  tags: string[];
  meta_description?: string;
}

export interface UpdateGuideInput extends Partial<CreateGuideInput> {
  status?: GuideStatus;
}

// Filter types for browsing guides
export interface GuideFilters {
  category?: GuideCategory;
  difficulty?: GuideDifficulty;
  tags?: string[];
  author_id?: string;
  featured?: boolean;
  search?: string;
  sort_by?: 'popular' | 'recent' | 'highest_rated' | 'most_helpful';
  status?: GuideStatus;
}

// Analytics types
export interface GuideAnalytics {
  guide_id: string;
  period: 'day' | 'week' | 'month' | 'all_time';
  views: number;
  unique_viewers: number;
  avg_read_progress: number;
  bookmarks: number;
  shares: number;
  helpful_votes: number;
  ratings: {
    average: number;
    count: number;
    distribution: Record<number, number>;
  };
  top_referrers: Array<{
    source: string;
    count: number;
  }>;
  reader_demographics?: {
    grade_levels: Record<string, number>;
    schools: Record<string, number>;
  };
}