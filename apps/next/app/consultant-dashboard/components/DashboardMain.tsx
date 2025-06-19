"use client"

import { useState } from 'react'

/*
SUPABASE INTEGRATION TODO:
=====================================

1. CONSULTANT STATS TABLE:
   - Table: consultant_stats
   - Fields: consultant_id, active_gigs, completed_this_week, total_earnings, avg_rating, response_time_hours, client_satisfaction_percent
   - Real-time subscription for live updates
   - Query: SELECT * FROM consultant_stats WHERE consultant_id = $1

2. URGENT TASKS TABLE:  
   - Table: consultant_tasks
   - Fields: id, consultant_id, title, client_name, deadline, priority, task_type, payment_amount, status
   - Query: SELECT * FROM consultant_tasks WHERE consultant_id = $1 AND status = 'urgent' ORDER BY deadline ASC
   - Real-time subscription for new urgent tasks

3. GIG REQUESTS TABLE:
   - Table: gig_requests  
   - Fields: id, client_name, service_type, target_university, budget, compatibility_score, created_at, status
   - Query: SELECT * FROM gig_requests WHERE status = 'pending' AND target_consultant_id = $1 ORDER BY created_at DESC
   - Real-time subscription for new requests

4. REAL-TIME SUBSCRIPTIONS:
   - Set up Supabase real-time subscriptions for:
     * New gig requests: supabase.channel('gig_requests').on('postgres_changes', {event: 'INSERT'})
     * Task updates: supabase.channel('consultant_tasks').on('postgres_changes', {event: '*'})
     * Stats updates: supabase.channel('consultant_stats').on('postgres_changes', {event: 'UPDATE'})

5. API FUNCTIONS TO CREATE:
   - fetchConsultantStats(consultantId): Promise<ConsultantStats>
   - fetchUrgentTasks(consultantId): Promise<Task[]>
   - fetchGigRequests(consultantId): Promise<GigRequest[]>
   - acceptGigRequest(requestId): Promise<void>
   - declineGigRequest(requestId): Promise<void>
*/

// Professional Chart Component for Earnings
const EarningsChart = ({ data, timeframe }: { data: number[], timeframe: string }) => {
  const maxValue = Math.max(...data)
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: 100 - (value / maxValue) * 80
  }))
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')

  return (
    <div className="relative h-48 w-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="earningsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00bcd4" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="url(#earningsGradient)"
        />
        <path
          d={pathData}
          fill="none"
          stroke="#00bcd4"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="0.8"
            fill="#00bcd4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="absolute bottom-2 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
        {timeframe === 'week' ? 
          ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>) :
          timeframe === 'month' ?
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => <span key={month}>{month}</span>) :
          ['2023', 'Q2', 'Q3', 'Q4', '2024', 'Q2', 'Q3', 'Q4', '2025', 'Q2', 'Q3', 'Q4'].map(period => <span key={period}>{period}</span>)
        }
      </div>
    </div>
  )
}

// Professional Performance Indicator
const PerformanceIndicator = ({ percentage, label, comparison }: { percentage: number, label: string, comparison: string }) => {
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a1f3a" />
              <stop offset="100%" stopColor="#00bcd4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold bg-gradient-to-r from-proofr-navy to-proofr-cyan bg-clip-text text-transparent">{percentage}%</span>
        </div>
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-proofr-cyan dark:text-proofr-cyan font-medium">{comparison}</p>
      </div>
    </div>
  )
}

export default function DashboardMain() {
  const [timeframe, setTimeframe] = useState('week')
  const [showQuickActions, setShowQuickActions] = useState(false)

  // TODO: Replace with actual Supabase data fetching
  const [stats] = useState({
    activeGigs: 12,
    completedThisWeek: 8,
    totalEarnings: 2840,
    totalEarningsThisMonth: 4250,
    avgRating: 4.9,
    responseTime: '2h',
    clientSatisfaction: 98,
    profileViews: 324,
    proposalsSent: 18,
    hireRate: 67
  })

  const [earningsData] = useState({
    week: [320, 450, 280, 680, 890, 1240, 780],
    month: [2840, 3200, 2950, 4100, 3800, 4250, 4890, 5100, 4750, 5200, 4950, 5300],
    year: [28400, 32000, 29500, 41000, 38000, 42500, 48900, 51000, 47500, 52000, 49500, 53000]
  })

  const [urgentTasks] = useState([
    {
      id: 1,
      title: 'Harvard Application Essay Review',
      client: 'Sarah M.',
      deadline: '2 hours',
      priority: 'high',
      type: 'Essay Review',
      payment: 150,
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Stanford Supplemental Essays',
      client: 'Mike K.',
      deadline: '6 hours',
      priority: 'high',
      type: 'Essay Review',
      payment: 200,
      status: 'Pending'
    },
    {
      id: 3,
      title: 'Interview Prep Session',
      client: 'Emma L.',
      deadline: '1 day',
      priority: 'medium',
      type: 'Interview Prep',
      payment: 100,
      status: 'Scheduled'
    }
  ])

  const [newRequests] = useState([
    {
      id: 1,
      client: 'Alex Chen',
      service: 'Personal Statement Review',
      university: 'MIT',
      budget: 175,
      compatibility: 95,
      timePosted: '5 min ago'
    },
    {
      id: 2,
      client: 'Maria Rodriguez',
      service: 'Application Strategy',
      university: 'Stanford',
      budget: 300,
      compatibility: 88,
      timePosted: '12 min ago'
    }
  ])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Professional Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Welcome back, John Doe</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                         <select 
               value={timeframe} 
               onChange={(e) => setTimeframe(e.target.value)}
               className="px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-proofr-cyan bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white shadow-lg"
             >
               <option value="week">Last 7 days</option>
               <option value="month">Last 12 months</option>
               <option value="year">Last 12 months (quarterly)</option>
             </select>
            <button className="px-4 py-2 bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm font-medium backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="px-6 py-3 bg-gradient-to-r from-proofr-navy to-proofr-cyan text-white rounded-xl hover:shadow-xl hover:shadow-proofr-cyan/25 transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/20"
              >
                Quick Task
              </button>
              {showQuickActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-10">
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-2">Create New Gig</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-2">Schedule Call</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-2">Export Data</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-2">Generate Report</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-8 py-8 max-w-7xl mx-auto space-y-8">
        
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Total Earnings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Earnings</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-proofr-navy to-proofr-cyan bg-clip-text text-transparent">
                    ${stats.totalEarningsThisMonth}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold">
                      +15.3%
                    </div>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-proofr-navy to-proofr-cyan rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Active Projects</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-proofr-navy to-proofr-cyan bg-clip-text text-transparent">
                    {stats.activeGigs}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full px-3 py-1 text-xs font-semibold">
                      +2 this week
                    </div>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-proofr-cyan to-proofr-navy rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Client Rating */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Client Rating</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-proofr-navy to-proofr-cyan bg-clip-text text-transparent">
                    {stats.avgRating}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full px-3 py-1 text-xs font-semibold">
                      Top 8%
                    </div>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-proofr-navy to-proofr-cyan rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Response Time</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-proofr-navy to-proofr-cyan bg-clip-text text-transparent">
                    {stats.responseTime}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold">
                      Faster than 89%
                    </div>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-proofr-cyan to-proofr-navy rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earnings Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div>
              <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
                    Earnings Overview
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setTimeframe('week')}
                      className={`px-4 py-2 text-sm rounded-xl transition-colors ${
                        timeframe === 'week' ? 'bg-gradient-to-r from-proofr-navy to-proofr-cyan text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Week
                    </button>
                    <button 
                      onClick={() => setTimeframe('month')}
                      className={`px-4 py-2 text-sm rounded-xl transition-colors ${
                        timeframe === 'month' ? 'bg-gradient-to-r from-proofr-navy to-proofr-cyan text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Month
                    </button>
                    <button 
                      onClick={() => setTimeframe('year')}
                      className={`px-4 py-2 text-sm rounded-xl transition-colors ${
                        timeframe === 'year' ? 'bg-gradient-to-r from-proofr-navy to-proofr-cyan text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Year
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <p className="text-3xl font-bold bg-gradient-to-r from-proofr-navy to-proofr-cyan bg-clip-text text-transparent">
                    ${earningsData[timeframe as keyof typeof earningsData].reduce((a, b) => a + b, 0).toLocaleString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {timeframe === 'week' ? 'Last 7 days' : 
                     timeframe === 'month' ? 'Last 12 months' : 
                     'Last 12 months (quarterly)'}
                  </p>
                </div>
                <EarningsChart 
                  data={earningsData[timeframe as keyof typeof earningsData]} 
                  timeframe={timeframe} 
                />
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div>
              <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
                  Performance Metrics
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <PerformanceIndicator 
                  percentage={stats.hireRate} 
                  label="Hire Rate" 
                  comparison="Better than 65% of consultants"
                />
                <PerformanceIndicator 
                  percentage={stats.clientSatisfaction} 
                  label="Client Satisfaction" 
                  comparison="Top 5% of consultants"
                />
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100/50 dark:border-gray-700/50">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/20 dark:border-blue-700/20">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.profileViews}</p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Views</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/20 dark:border-green-700/20">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.proposalsSent}</p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Proposals Sent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
          <div>
            <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
                  Active Projects
                </h2>
                <button className="text-sm text-proofr-cyan hover:text-proofr-navy dark:hover:text-proofr-cyan/80 transition-colors font-medium">
                  View All Projects
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {urgentTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 shadow-sm ${
                            task.priority === 'high' ? 'bg-gradient-to-r from-proofr-coral to-red-500' : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                          }`}></div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{task.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{task.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{task.deadline}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold bg-gradient-to-r from-proofr-navy to-proofr-cyan bg-clip-text text-transparent">${task.payment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
          <div>
            <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
                  Pending Requests
                </h2>
                <span className="text-sm bg-gradient-to-r from-proofr-coral to-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                  {newRequests.length} new
                </span>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:border-proofr-cyan dark:hover:border-proofr-cyan transition-all duration-300 bg-gray-50 dark:bg-gray-900 hover:shadow-md">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{request.service}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">by {request.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-proofr-navy to-proofr-cyan bg-clip-text text-transparent">${request.budget}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{request.timePosted}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full font-medium">
                          {request.university}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Match:</span>
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">{request.compatibility}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                          Decline
                        </button>
                        <button className="px-4 py-2 text-xs bg-gradient-to-r from-proofr-navy to-proofr-cyan text-white rounded-xl hover:shadow-lg hover:shadow-proofr-cyan/25 transition-all duration-300 font-medium">
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-proofr-navy via-proofr-cyan to-indigo-600 rounded-3xl p-10 text-white border border-white/20 shadow-2xl shadow-proofr-navy/30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-proofr-coral/20 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Maximize Your Earnings
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">College application season is approaching. Optimize your profile and availability to capture peak demand.</p>
              </div>
              <div className="mt-8 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold border border-white/20 hover:scale-105">
                  Update Profile
                </button>
                <button className="px-8 py-4 bg-white text-proofr-navy rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:scale-105">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 