import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// POST /api/guides/[id]/interact - Track user interactions
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
    const { type, value } = await request.json()
    
    const updates: any = {
      guide_id: params.id,
      user_id: session.user.id
    }
    
    switch (type) {
      case 'bookmark':
        updates.bookmarked = value
        updates.bookmarked_at = value ? new Date().toISOString() : null
        break
      
      case 'helpful':
        updates.found_helpful = value
        break
      
      case 'rating':
        if (value < 1 || value > 5) {
          return NextResponse.json(
            { error: 'Rating must be between 1 and 5' },
            { status: 400 }
          )
        }
        updates.rating = value
        updates.rated_at = new Date().toISOString()
        break
      
      case 'share':
        updates.shared = true
        updates.shared_at = new Date().toISOString()
        updates.share_medium = value || 'unknown'
        break
      
      case 'progress':
        updates.read_progress = Math.min(Math.max(value, 0), 100)
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid interaction type' },
          { status: 400 }
        )
    }

    const { error } = await supabase
      .from('guide_interactions')
      .upsert(updates)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to track interaction' },
      { status: 500 }
    )
  }
}