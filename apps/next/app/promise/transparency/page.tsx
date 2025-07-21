'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { 
  BarChart3,
  DollarSign,
  Users,
  TrendingUp,
  Shield,
  Download,
  ChevronRight,
  FileText,
  Globe,
  Heart,
  Target,
  PieChart,
  Calendar,
  CheckCircle,
  Award
} from 'lucide-react'
import { NavigationBar } from 'app/features/landing/components/NavigationBar'

export default function TransparencyReportPage() {
  const [selectedYear, setSelectedYear] = useState('2024')
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transparency Report
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Complete financial transparency is core to the Proofr Promise. Every dollar tracked, 
              every impact measured, every decision documented.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Full Report
              </button>
              <Link 
                href="/promise" 
                className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all"
              >
                Learn About Our Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Year Selector */}
      <section className="py-8 border-b border-gray-200 sticky top-16 bg-white z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Viewing Report For:</h2>
            <div className="flex gap-2">
              {['2024', '2023', '2022', '2021'].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedYear === year 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Metrics */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{selectedYear} Impact at a Glance</h2>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { 
              label: 'Total Raised', 
              value: '$8,347,291', 
              change: '+23%', 
              icon: DollarSign,
              color: 'green' 
            },
            { 
              label: 'Students Supported', 
              value: '12,847', 
              change: '+31%', 
              icon: Users,
              color: 'blue' 
            },
            { 
              label: 'Program Efficiency', 
              value: '91.3%', 
              change: '+2.1%', 
              icon: Target,
              color: 'purple' 
            },
            { 
              label: 'College Acceptance Rate', 
              value: '98.7%', 
              change: '+0.9%', 
              icon: Award,
              color: 'orange' 
            }
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`w-8 h-8 text-${metric.color}-600`} />
                <span className={`text-sm font-medium text-${metric.color}-600`}>
                  {metric.change} vs {parseInt(selectedYear) - 1}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-gray-600">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Financial Breakdown */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Financial Breakdown</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Revenue Sources */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Revenue Sources</h3>
              <div className="space-y-4">
                {[
                  { source: 'Individual Donations', amount: '$3,123,456', percentage: 37.4 },
                  { source: 'Corporate Partnerships', amount: '$2,456,789', percentage: 29.4 },
                  { source: 'Foundation Grants', amount: '$1,987,654', percentage: 23.8 },
                  { source: 'Consultant Contributions', amount: '$567,890', percentage: 6.8 },
                  { source: 'Investment Income', amount: '$211,502', percentage: 2.6 }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">{item.source}</span>
                      <span className="font-medium text-gray-900">{item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="bg-purple-600 h-2 rounded-full"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.percentage}%</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total Revenue</span>
                  <span className="font-bold text-gray-900">$8,347,291</span>
                </div>
              </div>
            </div>
            
            {/* Expense Categories */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Expense Categories</h3>
              <div className="space-y-4">
                {[
                  { category: 'Direct Student Support', amount: '$7,123,456', percentage: 85.3 },
                  { category: 'Program Operations', amount: '$567,890', percentage: 6.8 },
                  { category: 'Technology & Infrastructure', amount: '$345,678', percentage: 4.1 },
                  { category: 'Fundraising', amount: '$234,567', percentage: 2.8 },
                  { category: 'Administration', amount: '$75,700', percentage: 0.9 }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">{item.category}</span>
                      <span className="font-medium text-gray-900">{item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="bg-green-600 h-2 rounded-full"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.percentage}%</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total Expenses</span>
                  <span className="font-bold text-gray-900">$8,347,291</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Program Breakdown */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Program Impact</h2>
        
        <div className="space-y-6">
          {[
            {
              program: 'Pinnacle Scholars',
              students: 847,
              funding: '$2,541,000',
              avgSupport: '$3,000',
              outcomes: '98.7% college acceptance rate',
              color: 'purple',
              icon: Award
            },
            {
              program: 'Opportunity Fund',
              students: 3421,
              funding: '$421,000',
              avgSupport: '$123',
              outcomes: '94% on-time application submission',
              color: 'green',
              icon: DollarSign
            },
            {
              program: 'Research Vanguard',
              students: 156,
              funding: '$1,248,000',
              avgSupport: '$8,000',
              outcomes: '89% pursuing STEM majors',
              color: 'blue',
              icon: Target
            },
            {
              program: 'Access Academy',
              students: 7189,
              funding: '$892,456',
              avgSupport: '$124',
              outcomes: '50,000+ resources accessed',
              color: 'teal',
              icon: Globe
            },
            {
              program: 'Community Champions',
              students: 1234,
              funding: '$2,021,000',
              avgSupport: '$1,638',
              outcomes: '2.3M community members impacted',
              color: 'orange',
              icon: Users
            }
          ].map((program, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-${program.color}-100 rounded-lg`}>
                    <program.icon className={`w-6 h-6 text-${program.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{program.program}</h3>
                    <p className="text-gray-600">{program.students.toLocaleString()} students supported</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{program.funding}</p>
                  <p className="text-sm text-gray-600">{program.avgSupport} per student</p>
                </div>
              </div>
              <div className={`bg-${program.color}-50 rounded-lg p-4`}>
                <p className="text-sm font-medium text-gray-900">Key Outcome:</p>
                <p className={`text-${program.color}-700 font-semibold`}>{program.outcomes}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Demographics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Student Demographics</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Economic Background</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Low Income (&lt;$30K)</span>
                  <span className="font-medium">62%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Lower Middle ($30-60K)</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Middle Income ($60-100K)</span>
                  <span className="font-medium">10%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">First-Gen Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">First Generation</span>
                  <span className="font-medium">73%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Parents Some College</span>
                  <span className="font-medium">19%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Parents College Grad</span>
                  <span className="font-medium">8%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Rural</span>
                  <span className="font-medium">34%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Suburban</span>
                  <span className="font-medium">41%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Urban</span>
                  <span className="font-medium">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Accountability */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Accountability & Governance</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Board Oversight</h3>
            <p className="text-gray-700 mb-6">
              The Proofr Promise is overseen by an independent board of directors comprising education 
              leaders, financial experts, and program alumni. The board meets quarterly to review 
              financial performance and program impact.
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Board Composition</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 3 Education Leaders</li>
                <li>• 2 Financial Experts</li>
                <li>• 2 Program Alumni</li>
                <li>• 2 Community Representatives</li>
                <li>• 1 Student Representative</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">External Audits</h3>
            <p className="text-gray-700 mb-6">
              Our finances are audited annually by Grant Thornton LLP. All audit reports are 
              publicly available and can be downloaded from this page.
            </p>
            <div className="space-y-3">
              {[
                { year: '2024', status: 'Clean Opinion', auditor: 'Grant Thornton LLP' },
                { year: '2023', status: 'Clean Opinion', auditor: 'Grant Thornton LLP' },
                { year: '2022', status: 'Clean Opinion', auditor: 'Grant Thornton LLP' }
              ].map((audit, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <span className="font-medium text-gray-900">{audit.year} Audit</span>
                    <span className="text-sm text-gray-600 ml-2">• {audit.status}</span>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                    Download <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Future Goals */}
      <section className="py-16 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">{parseInt(selectedYear) + 1} Goals</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { metric: 'Students to Support', target: '20,000+', icon: Users },
              { metric: 'Funds to Raise', target: '$12M', icon: DollarSign },
              { metric: 'New Partnerships', target: '100+', icon: Heart },
              { metric: 'Program Efficiency', target: '93%', icon: Target }
            ].map((goal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-purple-800 rounded-xl p-6 text-center"
              >
                <goal.icon className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">{goal.target}</p>
                <p className="text-purple-300">{goal.metric}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Download Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Download Complete Reports
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Access detailed financial statements, impact assessments, and governance documents. 
            All reports are available in PDF format for complete transparency.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              {selectedYear} Annual Report
            </button>
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Financial Statements
            </button>
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Audit Reports
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <section className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about our transparency report? We&apos;re here to help.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/promise/contact"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Contact Us
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/promise"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Learn About Our Programs
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/promise/donate"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Support Our Mission
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}