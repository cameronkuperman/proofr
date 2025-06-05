import * as React from 'react'
import { Hero } from '../components/Hero/Hero.web'

export function LandingScreen() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Hero />
    </div>
  )
}