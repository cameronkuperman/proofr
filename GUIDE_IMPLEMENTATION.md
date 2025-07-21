# Student Guide System - Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing the student guide system backend functionality, including API routes, database functions, and moderation workflows.

## Table of Contents
1. [Database Setup](#database-setup)
2. [Supabase Functions](#supabase-functions)
3. [API Routes](#api-routes)
4. [Moderation System](#moderation-system)
5. [Search Implementation](#search-implementation)
6. [Analytics & Metrics](#analytics-metrics)
7. [Testing](#testing)
8. [Production Checklist](#production-checklist)

## Database Setup

### 1. Run the Migration
```sql
-- Run the migration file: /supabase/migrations/20250115_student_guides.sql
-- This creates all necessary tables, indexes, and RLS policies
```

### 2. Enable Row Level Security
All guide tables have RLS enabled by default. The policies allow:
- Anyone to view published guides
- Authors to create and edit their own guides
- Users to manage their own interactions
- Authenticated users to comment

### 3. Create Storage Buckets (if needed for images/attachments)
```sql
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('guide-images', 'guide-images', true),
  ('guide-resources', 'guide-resources', true);
```

## Supabase Functions

### 1. Guide View Tracking
The migration already includes this function:
```sql
-- Function: increment_guide_view
-- Already created in migration
-- Usage: SELECT increment_guide_view('guide_id', 'user_id');
```

### 2. Guide Search Function
Create a search function for better performance:
```sql
CREATE OR REPLACE FUNCTION search_guides(search_query TEXT, limit_count INT DEFAULT 20)
RETURNS TABLE (
  id UUID,
  title VARCHAR(200),
  description TEXT,
  category guide_category,
  author_id UUID,
  view_count INTEGER,
  helpful_count INTEGER,
  avg_rating DECIMAL(3,2),
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sg.id,
    sg.title,
    sg.description,
    sg.category,
    sg.author_id,
    sg.view_count,
    sg.helpful_count,
    sg.avg_rating,
    ts_rank(sg.search_vector, plainto_tsquery('english', search_query)) AS rank
  FROM student_guides sg
  WHERE 
    sg.status = 'published' AND
    sg.search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, sg.view_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

### 3. Guide Recommendations
```sql
CREATE OR REPLACE FUNCTION get_recommended_guides(
  for_user_id UUID,
  limit_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(200),
  description TEXT,
  category guide_category,
  score REAL
) AS $$
BEGIN
  RETURN QUERY
  WITH user_interests AS (
    -- Get categories user has interacted with
    SELECT DISTINCT sg.category, COUNT(*) as interaction_count
    FROM guide_interactions gi
    JOIN student_guides sg ON gi.guide_id = sg.id
    WHERE gi.user_id = for_user_id
    GROUP BY sg.category
  )
  SELECT 
    sg.id,
    sg.title,
    sg.description,
    sg.category,
    (
      COALESCE(ui.interaction_count, 0) * 0.3 + -- User preference
      sg.helpful_count * 0.3 + -- Helpfulness
      sg.view_count * 0.001 + -- Popularity (scaled down)
      COALESCE(sg.avg_rating, 0) * 0.3 -- Rating
    ) AS score
  FROM student_guides sg
  LEFT JOIN user_interests ui ON sg.category = ui.category
  WHERE 
    sg.status = 'published' AND
    sg.id NOT IN (
      -- Exclude already viewed guides
      SELECT guide_id FROM guide_interactions 
      WHERE user_id = for_user_id AND viewed = true
    )
  ORDER BY score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

## API Routes

### 1. Guide CRUD Operations

#### Create Guide
```typescript
// POST /api/guides
export async function createGuide(req: Request) {
  const { user } = await requireAuth(req)
  const data = await req.json()
  
  // Basic validation
  if (!data.title || !data.content || !data.category) {
    return new Response('Missing required fields', { status: 400 })
  }
  
  // Create guide with pending status
  const { data: guide, error } = await supabase
    .from('student_guides')
    .insert({
      author_id: user.id,
      ...data,
      status: 'pending_review',
      moderation_score: 0 // Will be updated by moderation
    })
    .select()
    .single()
  
  if (error) {
    return new Response(error.message, { status: 500 })
  }
  
  // Trigger moderation (async)
  await triggerModeration(guide.id)
  
  return Response.json(guide)
}
```

#### Update Guide
```typescript
// PUT /api/guides/:id
export async function updateGuide(req: Request, { params }: { params: { id: string } }) {
  const { user } = await requireAuth(req)
  const data = await req.json()
  
  // Check ownership
  const { data: guide } = await supabase
    .from('student_guides')
    .select('author_id')
    .eq('id', params.id)
    .single()
  
  if (!guide || guide.author_id !== user.id) {
    return new Response('Unauthorized', { status: 403 })
  }
  
  // Update guide
  const { error } = await supabase
    .from('student_guides')
    .update({
      ...data,
      version: guide.version + 1,
      last_major_update: new Date().toISOString()
    })
    .eq('id', params.id)
  
  if (error) {
    return new Response(error.message, { status: 500 })
  }
  
  return new Response('Updated', { status: 200 })
}
```

#### Get Guide with Interactions
```typescript
// GET /api/guides/:id
export async function getGuide(req: Request, { params }: { params: { id: string } }) {
  const { user } = await getAuth(req)
  
  // Get guide with author info
  const { data: guide, error } = await supabase
    .from('student_guides')
    .select(`
      *,
      author:author_id(id, name, current_school),
      resources:guide_resources(*),
      service_links:guide_service_links(
        *,
        service:service_id(*),
        consultant:consultant_id(name, current_college)
      )
    `)
    .eq('id', params.id)
    .single()
  
  if (error || !guide) {
    return new Response('Guide not found', { status: 404 })
  }
  
  // Get user's interaction if logged in
  let interaction = null
  if (user) {
    const { data } = await supabase
      .from('guide_interactions')
      .select('*')
      .eq('guide_id', params.id)
      .eq('user_id', user.id)
      .single()
    
    interaction = data
  }
  
  return Response.json({ guide, interaction })
}
```

### 2. Search & Discovery

#### Search Guides
```typescript
// GET /api/guides/search?q=query&category=essays&difficulty=beginner
export async function searchGuides(req: Request) {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')
  const category = url.searchParams.get('category')
  const difficulty = url.searchParams.get('difficulty')
  const sort = url.searchParams.get('sort') || 'popular'
  
  let supabaseQuery = supabase
    .from('student_guides')
    .select('*')
    .eq('status', 'published')
  
  // Apply search
  if (query) {
    const { data: searchResults } = await supabase
      .rpc('search_guides', { search_query: query })
    
    const ids = searchResults?.map(r => r.id) || []
    supabaseQuery = supabaseQuery.in('id', ids)
  }
  
  // Apply filters
  if (category) {
    supabaseQuery = supabaseQuery.eq('category', category)
  }
  if (difficulty) {
    supabaseQuery = supabaseQuery.eq('difficulty', difficulty)
  }
  
  // Apply sorting
  switch (sort) {
    case 'recent':
      supabaseQuery = supabaseQuery.order('published_at', { ascending: false })
      break
    case 'highest_rated':
      supabaseQuery = supabaseQuery.order('avg_rating', { ascending: false })
      break
    default: // popular
      supabaseQuery = supabaseQuery.order('view_count', { ascending: false })
  }
  
  const { data: guides, error } = await supabaseQuery.limit(50)
  
  if (error) {
    return new Response(error.message, { status: 500 })
  }
  
  return Response.json(guides)
}
```

### 3. Interactions

#### Track Interaction
```typescript
// POST /api/guides/:id/interact
export async function trackInteraction(req: Request, { params }: { params: { id: string } }) {
  const { user } = await requireAuth(req)
  const { type, value } = await req.json()
  
  const updates: any = {}
  
  switch (type) {
    case 'bookmark':
      updates.bookmarked = value
      updates.bookmarked_at = value ? new Date().toISOString() : null
      break
    case 'helpful':
      updates.found_helpful = value
      break
    case 'rating':
      updates.rating = value
      updates.rated_at = new Date().toISOString()
      break
    case 'share':
      updates.shared = true
      updates.shared_at = new Date().toISOString()
      updates.share_medium = value
      break
  }
  
  const { error } = await supabase
    .from('guide_interactions')
    .upsert({
      guide_id: params.id,
      user_id: user.id,
      ...updates
    })
  
  if (error) {
    return new Response(error.message, { status: 500 })
  }
  
  return new Response('OK', { status: 200 })
}
```

### 4. Comments

#### Add Comment
```typescript
// POST /api/guides/:id/comments
export async function addComment(req: Request, { params }: { params: { id: string } }) {
  const { user } = await requireAuth(req)
  const { content, parent_comment_id } = await req.json()
  
  if (!content?.trim()) {
    return new Response('Content required', { status: 400 })
  }
  
  const { data: comment, error } = await supabase
    .from('guide_comments')
    .insert({
      guide_id: params.id,
      user_id: user.id,
      content: content.trim(),
      parent_comment_id,
      is_question: content.includes('?')
    })
    .select()
    .single()
  
  if (error) {
    return new Response(error.message, { status: 500 })
  }
  
  return Response.json(comment)
}
```

## Moderation System

### 1. Basic Content Moderation (without AI)
```typescript
// Simple moderation checks
export async function moderateGuide(guideId: string) {
  const { data: guide } = await supabase
    .from('student_guides')
    .select('title, description, content')
    .eq('id', guideId)
    .single()
  
  if (!guide) return
  
  let score = 1.0
  let notes: string[] = []
  
  // Check for profanity (basic list)
  const profanityList = ['badword1', 'badword2'] // Add actual list
  const text = `${guide.title} ${guide.description} ${JSON.stringify(guide.content)}`.toLowerCase()
  
  for (const word of profanityList) {
    if (text.includes(word)) {
      score -= 0.5
      notes.push(`Contains inappropriate language: ${word}`)
    }
  }
  
  // Check minimum length
  const wordCount = text.split(/\s+/).length
  if (wordCount < 100) {
    score -= 0.2
    notes.push('Content is too short (minimum 100 words)')
  }
  
  // Check for spam patterns
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const urls = text.match(urlPattern) || []
  if (urls.length > 5) {
    score -= 0.3
    notes.push('Too many external links')
  }
  
  // Update guide status based on score
  const status = score >= 0.7 ? 'published' : 'flagged'
  
  await supabase
    .from('student_guides')
    .update({
      moderation_score: score,
      moderation_notes: notes.join('; '),
      status,
      reviewed_at: new Date().toISOString(),
      published_at: status === 'published' ? new Date().toISOString() : null
    })
    .eq('id', guideId)
}
```

### 2. AI Moderation Integration (when ready)
```typescript
// AI moderation endpoint
export async function aiModerateGuide(guideId: string) {
  const { data: guide } = await supabase
    .from('student_guides')
    .select('*')
    .eq('id', guideId)
    .single()
  
  // Call your AI service (OpenAI, Anthropic, etc.)
  const response = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: `${guide.title}\n\n${guide.description}\n\n${JSON.stringify(guide.content)}`
    })
  })
  
  const moderation = await response.json()
  
  // Process results and update guide
  // ... implementation based on your AI service
}
```

## Search Implementation

### 1. Full-Text Search Setup
The migration already creates the necessary search infrastructure:
- `search_vector` column with tsvector
- GIN index for fast searching
- Trigger to maintain search vector

### 2. Advanced Search Features
```sql
-- Search with filters and ranking
CREATE OR REPLACE FUNCTION advanced_search_guides(
  search_query TEXT,
  filter_category guide_category DEFAULT NULL,
  filter_difficulty guide_difficulty DEFAULT NULL,
  filter_tags TEXT[] DEFAULT NULL,
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(200),
  description TEXT,
  category guide_category,
  difficulty guide_difficulty,
  tags TEXT[],
  author_name TEXT,
  view_count INTEGER,
  helpful_count INTEGER,
  avg_rating DECIMAL(3,2),
  published_at TIMESTAMPTZ,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sg.id,
    sg.title,
    sg.description,
    sg.category,
    sg.difficulty,
    sg.tags,
    s.name as author_name,
    sg.view_count,
    sg.helpful_count,
    sg.avg_rating,
    sg.published_at,
    ts_rank(sg.search_vector, query) AS rank
  FROM 
    student_guides sg
    JOIN students s ON sg.author_id = s.id,
    plainto_tsquery('english', search_query) query
  WHERE 
    sg.status = 'published' AND
    sg.search_vector @@ query AND
    (filter_category IS NULL OR sg.category = filter_category) AND
    (filter_difficulty IS NULL OR sg.difficulty = filter_difficulty) AND
    (filter_tags IS NULL OR sg.tags && filter_tags)
  ORDER BY 
    rank DESC,
    sg.helpful_count DESC,
    sg.published_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
```

## Analytics & Metrics

### 1. Guide Performance Dashboard
```sql
-- Get guide analytics for an author
CREATE OR REPLACE FUNCTION get_author_guide_analytics(author_user_id UUID)
RETURNS TABLE (
  total_guides INTEGER,
  total_views INTEGER,
  total_helpful INTEGER,
  avg_rating DECIMAL(3,2),
  top_performing_guide_id UUID,
  top_performing_guide_title VARCHAR(200),
  engagement_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_guides,
    SUM(view_count)::INTEGER as total_views,
    SUM(helpful_count)::INTEGER as total_helpful,
    AVG(avg_rating)::DECIMAL(3,2) as avg_rating,
    (
      SELECT id FROM student_guides 
      WHERE author_id = author_user_id 
      ORDER BY helpful_count DESC 
      LIMIT 1
    ) as top_performing_guide_id,
    (
      SELECT title FROM student_guides 
      WHERE author_id = author_user_id 
      ORDER BY helpful_count DESC 
      LIMIT 1
    ) as top_performing_guide_title,
    CASE 
      WHEN SUM(view_count) > 0 
      THEN (SUM(helpful_count)::DECIMAL / SUM(view_count) * 100)::DECIMAL(5,2)
      ELSE 0
    END as engagement_rate
  FROM student_guides
  WHERE author_id = author_user_id AND status = 'published';
END;
$$ LANGUAGE plpgsql;
```

### 2. Popular Topics Analysis
```sql
-- Analyze popular guide topics
CREATE OR REPLACE FUNCTION analyze_popular_topics(days_back INT DEFAULT 30)
RETURNS TABLE (
  tag TEXT,
  guide_count BIGINT,
  total_views BIGINT,
  avg_helpful_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    unnest(sg.tags) as tag,
    COUNT(DISTINCT sg.id) as guide_count,
    SUM(sg.view_count) as total_views,
    AVG(
      CASE 
        WHEN sg.view_count > 0 
        THEN (sg.helpful_count::DECIMAL / sg.view_count * 100)
        ELSE 0
      END
    )::DECIMAL(5,2) as avg_helpful_rate
  FROM student_guides sg
  WHERE 
    sg.status = 'published' AND
    sg.published_at >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY tag
  ORDER BY total_views DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;
```

## Testing

### 1. Test Data Generation
```sql
-- Generate test guides
INSERT INTO student_guides (
  author_id,
  title,
  slug,
  description,
  category,
  difficulty,
  content,
  tags,
  status,
  published_at,
  view_count,
  helpful_count,
  avg_rating
)
SELECT
  (SELECT id FROM students ORDER BY RANDOM() LIMIT 1),
  'Guide ' || generate_series,
  'guide-' || generate_series,
  'This is a test guide about ' || 
    CASE (generate_series % 5)
      WHEN 0 THEN 'essay writing'
      WHEN 1 THEN 'interview prep'
      WHEN 2 THEN 'test preparation'
      WHEN 3 THEN 'college applications'
      ELSE 'extracurriculars'
    END,
  CASE (generate_series % 5)
    WHEN 0 THEN 'essays'::guide_category
    WHEN 1 THEN 'interviews'::guide_category
    WHEN 2 THEN 'test_prep'::guide_category
    WHEN 3 THEN 'applications'::guide_category
    ELSE 'extracurriculars'::guide_category
  END,
  CASE (generate_series % 3)
    WHEN 0 THEN 'beginner'::guide_difficulty
    WHEN 1 THEN 'intermediate'::guide_difficulty
    ELSE 'advanced'::guide_difficulty
  END,
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object(
        'id', '1',
        'type', 'text',
        'content', 'Sample content for guide ' || generate_series,
        'order', 0
      )
    )
  ),
  ARRAY['test', 'sample', 'guide' || (generate_series % 10)],
  'published',
  NOW() - INTERVAL '1 day' * (generate_series % 30),
  (RANDOM() * 1000)::INTEGER,
  (RANDOM() * 100)::INTEGER,
  3.5 + (RANDOM() * 1.5)
FROM generate_series(1, 50);
```

### 2. Test Scenarios
```typescript
// Test guide creation
async function testGuideCreation() {
  const testGuide = {
    title: 'Test Guide',
    description: 'A test guide',
    category: 'essays',
    difficulty: 'beginner',
    content: {
      sections: [{
        id: '1',
        type: 'text',
        content: 'Test content',
        order: 0
      }]
    },
    tags: ['test']
  }
  
  // Test creation
  const response = await fetch('/api/guides', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer TOKEN'
    },
    body: JSON.stringify(testGuide)
  })
  
  assert(response.ok, 'Guide creation failed')
  const guide = await response.json()
  assert(guide.id, 'No guide ID returned')
  
  // Test retrieval
  const getResponse = await fetch(`/api/guides/${guide.id}`)
  assert(getResponse.ok, 'Guide retrieval failed')
  
  // Cleanup
  await supabase.from('student_guides').delete().eq('id', guide.id)
}
```

## Production Checklist

### 1. Security
- [ ] All RLS policies are properly configured
- [ ] API routes validate user permissions
- [ ] Input validation on all endpoints
- [ ] Rate limiting on creation endpoints
- [ ] CORS properly configured

### 2. Performance
- [ ] Database indexes are created
- [ ] Search queries are optimized
- [ ] Image uploads use CDN
- [ ] Pagination implemented for lists
- [ ] Caching strategy for popular guides

### 3. Monitoring
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Analytics tracking (views, interactions)
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Moderation queue monitoring

### 4. Backup & Recovery
- [ ] Database backups configured
- [ ] Guide versioning working
- [ ] Soft delete for sensitive data
- [ ] Recovery procedures documented

### 5. Documentation
- [ ] API documentation complete
- [ ] User guide for creators
- [ ] Moderation guidelines
- [ ] Terms of service updated
- [ ] Privacy policy updated

## Environment Variables
```env
# Required for full functionality
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Optional for AI moderation
OPENAI_API_KEY=your_openai_key

# Optional for advanced features
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_key
```

## Next Steps

1. **Implement AI Moderation**: When ready, integrate with OpenAI or Anthropic for content moderation
2. **Add Rich Media**: Support for images and videos in guides
3. **Gamification**: Add badges and achievements for guide creators
4. **Analytics Dashboard**: Build comprehensive analytics for guide authors
5. **Email Notifications**: Notify authors of comments and milestones
6. **Export Features**: Allow guides to be exported as PDF
7. **Translation**: Multi-language support for guides

## Support

For questions or issues:
- Check the error logs in Supabase dashboard
- Review RLS policies if getting permission errors
- Ensure all migrations have run successfully
- Check that environment variables are set correctly

Remember to test thoroughly in a staging environment before deploying to production!