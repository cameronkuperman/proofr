import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/guides - Search and list guides
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  
  const query = searchParams.get('q')
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  const sort = searchParams.get('sort') || 'popular'
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    let supabaseQuery = supabase
      .from('student_guides')
      .select(`
        *,
        author:author_id(id, name, current_school)
      `)
      .eq('status', 'published')

    // Apply filters
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category)
    }
    if (difficulty) {
      supabaseQuery = supabaseQuery.eq('difficulty', difficulty)
    }

    // Apply search using the search function
    if (query) {
      const { data: searchResults, error: searchError } = await supabase
        .rpc('search_guides', { 
          search_query: query,
          limit_count: limit 
        })
      
      if (searchError) throw searchError
      
      return NextResponse.json({ guides: searchResults })
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

    // Apply pagination
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1)

    const { data: guides, error } = await supabaseQuery

    if (error) throw error

    return NextResponse.json({ guides })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch guides' },
      { status: 500 }
    )
  }
}

// POST /api/guides - Create a new guide
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.description || !data.category || !data.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create guide with pending status
    const { data: guide, error } = await supabase
      .from('student_guides')
      .insert({
        author_id: session.user.id,
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty || 'beginner',
        content: data.content,
        tags: data.tags || [],
        meta_description: data.meta_description,
        status: 'pending_review',
        moderation_score: 0.95 // Placeholder - would be calculated by moderation
      })
      .select()
      .single()

    if (error) throw error

    // In production, trigger moderation here
    // await triggerModeration(guide.id)

    return NextResponse.json({ guide }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create guide' },
      { status: 500 }
    )
  }
}