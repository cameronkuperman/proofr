"use client"

import { useState } from 'react'

/*
SUPABASE INTEGRATION TODO:
=====================================

1. ANALYTICS TABLES:
   - consultant_revenue_daily: daily earnings tracking
   - consultant_performance_metrics: response times, ratings, completion rates
   - client_interactions: proposal sent, accepted, completed timeline
   - consultant_benchmarks: industry comparison data
   - consultant_goals: personal targets and achievements

2. REAL-TIME ANALYTICS:
   - Revenue forecasting based on historical data
   - Performance trending over time periods
   - Client acquisition funnel metrics
   - Geographic distribution of clients
   - Service type performance analytics
*/

// Beautiful Revenue Chart with Forecasting
const RevenueChart = ({ data, forecast, timeframe }: { data: number[], forecast: number[], timeframe: string }) => {
  const allData = [...data, ...forecast]
  const maxValue = Math.max(...allData)
  const dataPoints = data.map((value, index) => ({
    x: (index / (data.length - 1)) * 60,
    y: 100 - (value / maxValue) * 80
  }))
  
  const forecastPoints = forecast.map((value, index) => ({
    x: 60 + ((index + 1) / forecast.length) * 40,
    y: 100 - (value / maxValue) * 80
  }))

  const allPoints = [...dataPoints, ...forecastPoints]
  const dataPath = dataPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')
  
  const forecastPath = forecastPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')

  return (
    <div className="relative h-80 w-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00bcd4" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.05"/>
          </linearGradient>
          <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        
        {/* Historical Data Area */}
        <path
          d={`${dataPath} L 60 100 L 0 100 Z`}
          fill="url(#revenueGradient)"
        />
        
        {/* Forecast Area */}
        <path
          d={`M 60 ${dataPoints[dataPoints.length - 1]?.y || 50} ${forecastPath} L 100 100 L 60 100 Z`}
          fill="url(#forecastGradient)"
        />
        
        {/* Historical Line */}
        <path
          d={dataPath}
          fill="none"
          stroke="#00bcd4"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Forecast Line */}
        <path
          d={`M 60 ${dataPoints[dataPoints.length - 1]?.y || 50} ${forecastPath}`}
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="0.6"
          strokeDasharray="2,2"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Data Points */}
        {dataPoints.map((point, index) => (
          <circle
            key={`data-${index}`}
            cx={point.x}
            cy={point.y}
            r="1"
            fill="#00bcd4"
            vectorEffect="non-scaling-stroke"
            className="hover:r-2 transition-all duration-200"
          />
        ))}
        
        {/* Forecast Points */}
        {forecastPoints.map((point, index) => (
          <circle
            key={`forecast-${index}`}
            cx={point.x}
            cy={point.y}
            r="1"
            fill="#ff6b6b"
            vectorEffect="non-scaling-stroke"
            className="hover:r-2 transition-all duration-200"
          />
        ))}
      </svg>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 flex items-center space-x-4 text-xs bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-proofr-cyan rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-300 font-medium">Historical</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-proofr-coral border-dashed rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-300 font-medium">Forecast</span>
        </div>
      </div>
    </div>
  )
}

// Conversion Funnel Visualization
const ConversionFunnel = ({ data }: { data: { label: string, value: number, percentage: number }[] }) => {
  return (
    <div className="space-y-6">
      {data.map((item, index) => (
        <div key={item.label} className="relative group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold text-gray-900 dark:text-white">{item.value.toLocaleString()}</span>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                index === 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                index === 1 ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' :
                index === 2 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
              }`}>
                {item.percentage}%
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ease-out shadow-lg ${
                  index === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                  index === 1 ? 'bg-gradient-to-r from-proofr-cyan to-cyan-600' :
                  index === 2 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  'bg-gradient-to-r from-proofr-coral to-orange-600'
                }`}
                style={{ width: `${item.percentage}%` }}
              >
                <div className="h-full rounded-full bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Performance Radar Chart
const PerformanceRadar = ({ data }: { data: { label: string, value: number, benchmark: number }[] }) => {
  const radius = 40
  const centerX = 50
  const centerY = 50
  
  const points = data.map((item, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2
    const x = centerX + Math.cos(angle) * (radius * item.value / 100)
    const y = centerY + Math.sin(angle) * (radius * item.value / 100)
    return { x, y, label: item.label, value: item.value }
  })
  
  const benchmarkPoints = data.map((item, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2
    const x = centerX + Math.cos(angle) * (radius * item.benchmark / 100)
    const y = centerY + Math.sin(angle) * (radius * item.benchmark / 100)
    return { x, y }
  })

  return (
    <div className="relative h-64 w-full">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="radarGradient">
            <stop offset="0%" stopColor="#00bcd4" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.1"/>
          </radialGradient>
        </defs>
        
        {/* Grid circles */}
        {[20, 40, 60, 80, 100].map((percentage) => (
          <circle
            key={percentage}
            cx={centerX}
            cy={centerY}
            r={radius * percentage / 100}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Grid lines */}
        {data.map((_, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          )
        })}
        
        {/* Benchmark area */}
        <polygon
          points={benchmarkPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#d1d5db"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        
        {/* Performance area */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="url(#radarGradient)"
          stroke="#00bcd4"
          strokeWidth="1.5"
        />
        
        {/* Performance points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="1.5"
            fill="#00bcd4"
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div className="absolute inset-0 flex items-center justify-center">
        {data.map((item, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2
          const labelRadius = radius * 1.2
          const x = 50 + Math.cos(angle) * labelRadius
          const y = 50 + Math.sin(angle) * labelRadius
          return (
            <div
              key={item.label}
              className="absolute text-xs font-medium text-gray-600 text-center transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
                width: '60px'
              }}
            >
              {item.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Mock data - TODO: Replace with Supabase real-time data
  const [analytics] = useState({
    revenue: {
      current: [2840, 3200, 2950, 4100, 3800, 4250, 4890, 5100, 4750, 5200, 4950, 5300],
      forecast: [5500, 5800, 6100, 6400],
      growth: 18.5,
      trend: 'up'
    },
    clients: {
      total: 127,
      new: 23,
      retained: 104,
      satisfaction: 4.8
    },
    performance: [
      { label: 'Response Speed', value: 92, benchmark: 75 },
      { label: 'Quality Score', value: 96, benchmark: 85 },
      { label: 'Client Retention', value: 89, benchmark: 70 },
      { label: 'Communication', value: 94, benchmark: 80 },
      { label: 'Expertise', value: 91, benchmark: 82 },
      { label: 'Reliability', value: 97, benchmark: 88 }
    ],
    funnel: [
      { label: 'Profile Views', value: 1248, percentage: 100 },
      { label: 'Service Inquiries', value: 312, percentage: 25 },
      { label: 'Proposals Sent', value: 156, percentage: 50 },
      { label: 'Projects Won', value: 78, percentage: 50 }
    ],
    goals: [
      { label: 'Monthly Revenue', current: 5300, target: 6000, percentage: 88 },
      { label: 'Client Satisfaction', current: 4.8, target: 4.9, percentage: 98 },
      { label: 'Response Time', current: 2.1, target: 2.0, percentage: 95 }
    ]
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
                Performance Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Deep insights into your consulting performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-proofr-cyan bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white shadow-lg"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 12 months</option>
                <option value="year">Last 3 years</option>
              </select>
              <button className="px-6 py-3 bg-gradient-to-r from-proofr-navy to-proofr-cyan text-white rounded-xl hover:shadow-xl hover:shadow-proofr-cyan/25 transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/20">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-7xl mx-auto space-y-8">
        
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-proofr-cyan/10 dark:bg-proofr-cyan/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-proofr-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">+{analytics.revenue.growth}%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  ${analytics.revenue.current.reduce((a, b) => a + b, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Active Clients */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">+{analytics.clients.new} new</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Clients</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {analytics.clients.total}
                </p>
              </div>
            </div>
          </div>

          {/* Satisfaction Score */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Top 8%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {analytics.clients.satisfaction}/5.0
                </p>
              </div>
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Above avg</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">78%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Forecasting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-white/20 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-proofr-cyan/5 opacity-50"></div>
            <div className="relative z-10">
              <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
                      Revenue Forecast
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered predictions</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      94% Accuracy
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <RevenueChart 
                  data={analytics.revenue.current} 
                  forecast={analytics.revenue.forecast}
                  timeframe={timeframe}
                />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="group p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/20 dark:border-blue-700/20 hover:shadow-lg transition-all duration-300">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Next Month</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.revenue.forecast[0]?.toLocaleString()}</p>
                  </div>
                  <div className="group p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/20 dark:border-green-700/20 hover:shadow-lg transition-all duration-300">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Growth Rate</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">+{analytics.revenue.growth}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-white/20 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-50"></div>
            <div className="relative z-10">
              <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
                  Performance Radar
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">vs Industry benchmarks</p>
              </div>
              <div className="p-8">
                <PerformanceRadar data={analytics.performance} />
                <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-proofr-cyan rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Your Performance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-gray-400 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Industry Average</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Acquisition & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-white/20 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-50"></div>
            <div className="relative z-10">
              <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
                  Client Acquisition Funnel
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Conversion pipeline analysis</p>
              </div>
              <div className="p-8">
                <ConversionFunnel data={analytics.funnel} />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-white/20 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-50"></div>
            <div className="relative z-10">
              <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-proofr-navy to-proofr-cyan bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-proofr-cyan">
                  Goal Progress
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Track your key targets</p>
              </div>
              <div className="p-8 space-y-8">
                {analytics.goals.map((goal, index) => (
                  <div key={goal.label} className="group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900 dark:text-white text-lg">{goal.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{goal.current} / {goal.target}</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          goal.percentage >= 95 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          goal.percentage >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {goal.percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
                        <div 
                          className={`h-4 rounded-full transition-all duration-1000 ease-out shadow-lg ${
                            goal.percentage >= 95 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            goal.percentage >= 80 ? 'bg-gradient-to-r from-proofr-cyan to-blue-500' :
                            'bg-gradient-to-r from-orange-400 to-red-500'
                          }`}
                          style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                        >
                          <div className="h-full rounded-full bg-gradient-to-r from-white/20 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="relative overflow-hidden bg-gradient-to-br from-proofr-navy via-proofr-cyan to-indigo-600 rounded-3xl p-10 text-white border border-white/20 shadow-2xl shadow-proofr-navy/30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-proofr-coral/20 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  AI-Powered Insights
                </h3>
                <p className="text-white/80 text-lg">Strategic recommendations tailored for you</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white/90">Live Analysis</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-white">Revenue Opportunity</h4>
                    <p className="text-white/90 leading-relaxed">Your response time is 40% faster than average. Consider increasing rates by 15-20% to maximize revenue potential.</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-white">Client Retention</h4>
                    <p className="text-white/90 leading-relaxed">89% client retention rate! Focus on upselling additional services to existing satisfied clients.</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-white">Peak Performance</h4>
                    <p className="text-white/90 leading-relaxed">Tuesday-Thursday are your highest conversion days. Schedule important client calls during these periods.</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-white">Growth Strategy</h4>
                    <p className="text-white/90 leading-relaxed">Application season approaching. Increase availability by 30% to capture peak demand in Q4.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 