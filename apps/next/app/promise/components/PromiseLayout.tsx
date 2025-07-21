'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, ReactNode } from 'react'
import { 
  ChevronLeft, 
  GraduationCap, 
  FlaskConical, 
  BookOpen, 
  Users,
  DollarSign,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

interface PromiseLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  currentProgram: 'pinnacle-scholars' | 'opportunity-fund' | 'research-vanguard' | 'access-academy' | 'community-champions'
}

interface NavItem {
  href: string
  title: string
  subtitle: string
  icon: any
  color: string
  gradient: string
}

const navItems: NavItem[] = [
  {
    href: '/promise/pinnacle-scholars',
    title: 'Pinnacle Scholars',
    subtitle: 'Merit-based excellence',
    icon: GraduationCap,
    color: 'purple',
    gradient: 'from-purple-600 to-indigo-600'
  },
  {
    href: '/promise/opportunity-fund',
    title: 'Opportunity Fund',
    subtitle: 'Direct financial assistance',
    icon: DollarSign,
    color: 'green',
    gradient: 'from-green-600 to-emerald-600'
  },
  {
    href: '/promise/research-vanguard',
    title: 'Research Vanguard Initiative',
    subtitle: 'Defending scientific progress',
    icon: FlaskConical,
    color: 'blue',
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    href: '/promise/access-academy',
    title: 'Access Academy',
    subtitle: 'Free resources for all',
    icon: BookOpen,
    color: 'teal',
    gradient: 'from-teal-600 to-cyan-600'
  },
  {
    href: '/promise/community-champions',
    title: 'Community Champions',
    subtitle: 'Local impact, global change',
    icon: Users,
    color: 'orange',
    gradient: 'from-orange-600 to-amber-600'
  }
]

export function PromiseLayout({ children, sidebar, currentProgram }: PromiseLayoutProps) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [donationAmount, setDonationAmount] = useState(487000)
  
  // Animate donation counter
  useEffect(() => {
    const interval = setInterval(() => {
      setDonationAmount(prev => prev + Math.floor(Math.random() * 100))
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  
  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const currentNav = navItems.find(item => item.href === pathname)
  
  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div 
          className={`h-full bg-gradient-to-r ${currentNav?.gradient || 'from-purple-600 to-blue-600'}`}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/about" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to About</span>
          </Link>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className="flex relative">
        {/* Left Navigation Rail */}
        <aside className={`
          fixed top-0 left-0 h-screen w-[280px] bg-gray-50 border-r border-gray-200 
          overflow-y-auto z-30 transform transition-transform lg:translate-x-0
          ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6">
            {/* Logo/Home */}
            <Link href="/about" className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to About</span>
            </Link>
            
            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      block p-3 rounded-lg transition-all group
                      ${isActive 
                        ? 'bg-white shadow-sm border border-gray-200' 
                        : 'hover:bg-white hover:shadow-sm hover:border hover:border-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-lg transition-colors
                        ${isActive 
                          ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                        }
                      `}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </nav>
            
            {/* Profit Pledge */}
            <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">2025-26 Profit Pledge</h4>
              <motion.div 
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                key={donationAmount}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ${donationAmount.toLocaleString()}
              </motion.div>
              <p className="text-xs text-gray-600 mt-1">donated this admissions cycle</p>
              <Link 
                href="/promise/transparency" 
                className="text-xs text-purple-600 hover:text-purple-700 font-medium mt-2 inline-flex items-center gap-1"
              >
                View transparency report
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-[280px]">
          <div className="max-w-[1440px] mx-auto flex">
            {/* Article Content */}
            <article className="flex-1 max-w-[720px] px-6 lg:px-12 py-12 lg:py-16">
              {children}
            </article>
            
            {/* Right Sidebar */}
            {sidebar && (
              <aside className="hidden xl:block w-[320px] px-6 py-12 lg:py-16">
                <div className="sticky top-20">
                  {sidebar}
                </div>
              </aside>
            )}
          </div>
        </main>
      </div>
      
      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)}
            className="lg:hidden fixed inset-0 bg-black z-20"
          />
        )}
      </AnimatePresence>
    </div>
  )
}