import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/guides/[id] - Get a specific guide
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  try {
    // Get guide with related data
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
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404 }
      )
    }

    // Get user's interaction if logged in
    let interaction = null
    if (session?.user) {
      const { data } = await supabase
        .from('guide_interactions')
        .select('*')
        .eq('guide_id', params.id)
        .eq('user_id', session.user.id)
        .single()
      
      interaction = data
    }

    // Track view if user is logged in
    if (session?.user) {
      await supabase.rpc('increment_guide_view', {
        p_guide_id: params.id,
        p_user_id: session.user.id
      })
    }

    return NextResponse.json({ guide, interaction })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch guide' },
      { status: 500 }
    )
  }
}

// PUT /api/guides/[id] - Update a guide
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    // Check ownership
    const { data: guide } = await supabase
      .from('student_guides')
      .select('author_id, version')
      .eq('id', params.id)
      .single()
    
    if (!guide || guide.author_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const updateData = await request.json()

    // Update guide
    const { error } = await supabase
      .from('student_guides')
      .update({
        ...updateData,
        version: guide.version + 1,
        last_major_update: new Date().toISOString()
      })
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update guide' },
      { status: 500 }
    )
  }
}

// DELETE /api/guides/[id] - Delete a guide
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    // Check ownership
    const { data: guide } = await supabase
      .from('student_guides')
      .select('author_id')
      .eq('id', params.id)
      .single()
    
    if (!guide || guide.author_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete guide
    const { error } = await supabase
      .from('student_guides')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete guide' },
      { status: 500 }
    )
  }
}