import React from 'react'
import { supabase } from '../../../../../lib/supabase'
import { ConsultantProfile } from '../../../../../packages/app/features/consultants/components/ConsultantProfile.web'
import type { ConsultantWithServices } from '../../../../../packages/app/features/consultants/types/consultant.types'

export default async function ConsultantProfilePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Fetch consultant data server-side for SEO
  const { data: consultantData, error } = await supabase
    .from('active_consultants')
    .select(`
      *,
      services(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !consultantData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Consultant not found</h1>
          <a href="/browse" className="text-blue-600 hover:underline">
            Back to browse
          </a>
        </div>
      </div>
    )
  }

  const consultant = consultantData as ConsultantWithServices

  return <ConsultantProfile consultant={consultant} />
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data: consultant } = await supabase
    .from('consultants')
    .select('name, bio, current_college')
    .eq('id', params.id)
    .single()

  if (!consultant) {
    return {
      title: 'Consultant Not Found | Proofr',
    }
  }

  return {
    title: `${consultant.name} - ${consultant.current_college} | Proofr`,
    description: consultant.bio,
  }
}