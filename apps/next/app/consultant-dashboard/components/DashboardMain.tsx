"use client"

import { useState, useEffect } from 'react'
import { useConsultantData } from '../../../../../lib/hooks/useConsultantData'
import { supabase } from '../../../../../lib/supabase'
import { LogoutButton } from '../../../../../lib/components/LogoutButton'

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-2xl h-32"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-gray-200 rounded-2xl h-96"></div>
      <div className="bg-gray-200 rounded-2xl h-96"></div>
    </div>
  </div>
)

// Error component
const DashboardError = ({ error, onRetry }: { error: Error, onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
    <p className="text-gray-600 mb-4">{error.message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-proofr-cyan text-white rounded-lg hover:bg-cyan-600 transition-colors"
    >
      Try Again
    </button>
  </div>
)

// Professional Chart Component for Earnings
const EarningsChart = ({ data, timeframe }: { data: number[], timeframe: string }) => {
  const maxValue = Math.max(...data, 1) // Prevent division by zero
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
          ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, data.length).map(day => <span key={day}>{day}</span>) :
          timeframe === 'month' ?
          ['Week 1', 'Week 2', 'Week 3', 'Week 4'].slice(0, data.length).map(week => <span key={week}>{week}</span>) :
          ['Q1', 'Q2', 'Q3', 'Q4'].slice(0, data.length).map(quarter => <span key={quarter}>{quarter}</span>)
        }
      </div>
    </div>
  )
}

// Professional Performance Indicator
const PerformanceIndicator = ({ percentage, label }: { percentage: number, label: string }) => {
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="#00bcd4"
          strokeWidth="10"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardMain() {
  const { profile, stats, loading, error, refetch } = useConsultantData()
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [earningsData, setEarningsData] = useState({
    week: [0, 0, 0, 0, 0, 0, 0],
    month: [0, 0, 0, 0],
    year: [0, 0, 0, 0]
  })
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week')

  // Fetch recent bookings
  useEffect(() => {
    if (!profile?.id) return

    const fetchRecentBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          students (name),
          services (title)
        `)
        .eq('consultant_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (!error && data) {
        setRecentBookings(data)
      }
    }

    fetchRecentBookings()

    // Subscribe to new bookings
    const subscription = supabase
      .channel('recent-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `consultant_id=eq.${profile.id}`
        },
        () => {
          fetchRecentBookings()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [profile?.id])

  // Fetch earnings data
  useEffect(() => {
    if (!profile?.id) return

    const fetchEarningsData = async () => {
      const now = new Date()
      
      // Week data
      const weekData = await Promise.all(
        [...Array(7)].map(async (_, i) => {
          const date = new Date(now)
          date.setDate(now.getDate() - (6 - i))
          const startOfDay = new Date(date.setHours(0, 0, 0, 0))
          const endOfDay = new Date(date.setHours(23, 59, 59, 999))
          
          const { data } = await supabase
            .from('bookings')
            .select('final_price')
            .eq('consultant_id', profile.id)
            .eq('status', 'completed')
            .gte('completed_at', startOfDay.toISOString())
            .lte('completed_at', endOfDay.toISOString())
          
          return data?.reduce((sum, b) => sum + (b.final_price || 0), 0) || 0
        })
      )

      setEarningsData(prev => ({ ...prev, week: weekData }))
    }

    fetchEarningsData()
  }, [profile?.id])

  if (loading) return <DashboardSkeleton />
  if (error) return <DashboardError error={error} onRetry={refetch} />
  if (!profile || !stats) return null

  const quickStats = [
    {
      title: "Today's Earnings",
      value: `$${stats.todayEarnings.toFixed(2)}`,
      change: '+12%',
      positive: true,
      icon: '💰'
    },
    {
      title: 'Active Clients',
      value: stats.activeClients.toString(),
      change: `${stats.pendingBookings} pending`,
      positive: true,
      icon: '👥'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      change: `${stats.totalReviews} reviews`,
      positive: true,
      icon: '⭐'
    },
    {
      title: 'Response Time',
      value: `${stats.responseTime}h`,
      change: 'avg',
      positive: stats.responseTime <= 24,
      icon: '⏱️'
    }
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {profile.name}! 👋
          </h1>
          <p className="text-gray-600">
            {profile.vacation_mode 
              ? "You're currently in vacation mode. Your profile is hidden from students."
              : "Here's your performance overview for today."}
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Earnings Overview</h2>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-proofr-cyan text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-3xl font-bold text-gray-800">
              ${selectedTimeframe === 'week' 
                ? earningsData.week.reduce((a, b) => a + b, 0).toFixed(2)
                : selectedTimeframe === 'month'
                ? stats.monthlyEarnings.toFixed(2)
                : stats.totalEarnings.toFixed(2)
              }
            </div>
            <p className="text-sm text-gray-500">
              Total earnings this {selectedTimeframe}
            </p>
          </div>
          
          <EarningsChart data={earningsData[selectedTimeframe]} timeframe={selectedTimeframe} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {booking.students?.name || 'Student'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.services?.title || 'Service'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ${booking.final_price}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent bookings</p>
            )}
          </div>
          
          {recentBookings.length > 0 && (
            <button className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              View All Bookings
            </button>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Performance Metrics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <PerformanceIndicator 
              percentage={Math.min(100, (stats.completedBookings / Math.max(1, stats.completedBookings + stats.pendingBookings)) * 100)}
              label="Completion Rate"
            />
          </div>
          <div className="flex flex-col items-center">
            <PerformanceIndicator 
              percentage={Math.min(100, (stats.averageRating / 5) * 100)}
              label="Satisfaction"
            />
          </div>
          <div className="flex flex-col items-center">
            <PerformanceIndicator 
              percentage={Math.min(100, 100 - (stats.responseTime / 48) * 100)}
              label="Response Speed"
            />
          </div>
          <div className="flex flex-col items-center">
            <PerformanceIndicator 
              percentage={profile.is_available ? 100 : 0}
              label="Availability"
            />
          </div>
        </div>
      </div>
    </div>
  )
}