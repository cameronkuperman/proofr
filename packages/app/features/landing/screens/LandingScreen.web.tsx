import React from 'react'
import { Hero } from '../components/Hero/Hero.web'

export function LandingScreen() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Hero />
      {/* We'll add other sections here later */}
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>More sections coming soon...</h2>
        <p style={{ color: '#64748b' }}>Trust Bar, How It Works, Consultant Profiles, Testimonials, and CTA sections will be added next.</p>
      </div>
    </div>
  )
}