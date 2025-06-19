"use client"

import { useState } from 'react'
import { ThemeProvider } from './ThemeProvider'
import Sidebar from './Sidebar'
import DashboardMain from './DashboardMain'
import GigPipeline from './GigPipeline'
import ProfileStudio from './ProfileStudio'
import Messages from './Messages'
import Analytics from './Analytics'

export default function ConsultantDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardMain />
      case 'gigs':
        return <GigPipeline />
      case 'profile':
        return <ProfileStudio />
      case 'messages':
        return <Messages />
      case 'analytics':
        return <Analytics />
      default:
        return <DashboardMain />
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  )
} 