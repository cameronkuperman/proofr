import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/guides/[id]/comments - Get comments for a guide
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: comments, error } = await supabase
      .from('guide_comments')
      .select(`
        *,
        author:user_id(id, email),
        replies:guide_comments!parent_comment_id(
          *,
          author:user_id(id, email)
        )
      `)
      .eq('guide_id', params.id)
      .is('parent_comment_id', null)
      .eq('hidden', false)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ comments })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/guides/[id]/comments - Add a comment
export async function POST(
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
    const { content, parent_comment_id } = await request.json()
    
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // Basic profanity check (expand this list in production)
    const profanityList = ['spam', 'abuse'] // Add actual profanity list
    const lowerContent = content.toLowerCase()
    for (const word of profanityList) {
      if (lowerContent.includes(word)) {
        return NextResponse.json(
          { error: 'Comment contains inappropriate content' },
          { status: 400 }
        )
      }
    }

    const { data: comment, error } = await supabase
      .from('guide_comments')
      .insert({
        guide_id: params.id,
        user_id: session.user.id,
        content: content.trim(),
        parent_comment_id,
        is_question: content.includes('?')
      })
      .select(`
        *,
        author:user_id(id, email)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create comment' },
      { status: 500 }
    )
  }
}