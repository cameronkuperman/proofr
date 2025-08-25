'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { NavigationBar } from 'app/features/landing/components/NavigationBar/NavigationBar'
import styles from './about.module.css'
import { 
  Search, 
  Globe, 
  GraduationCap, 
  Lightbulb, 
  DollarSign, 
  Users, 
  TrendingDown,
  CheckCircle,
  XCircle,
  Sparkles,
  Heart,
  BookOpen,
  Languages,
  ChevronDown,
  School,
  TreePine,
  Cpu,
  FlaskConical
} from 'lucide-react'

export default function AboutPage() {
  const [impactCount, setImpactCount] = useState({
    storiesTold: 0,
    moneySaved: 0,
    dreamsFunded: 0
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showESLToggle, setShowESLToggle] = useState(false)
  
  const { scrollYProgress } = useScroll()
  const priceOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const storyOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])

  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000
      const steps = 60
      const interval = duration / steps
      
      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        
        setImpactCount({
          storiesTold: Math.floor(10847 * progress),
          moneySaved: Math.floor(487 * progress),
          dreamsFunded: Math.floor(2341 * progress)
        })
        
        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, interval)
      
      return () => clearInterval(timer)
    }
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters()
      }
    })
    
    const counterElement = document.getElementById('impact-counter')
    if (counterElement) {
      observer.observe(counterElement)
    }
    
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 opacity-70" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
        
        {/* Floating particles and acceptance letters */}
        <div className="absolute inset-0">
          {/* Floating dots */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20"
              initial={{ 
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800
              }}
              animate={{ 
                y: -100,
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Floating acceptance letters */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`letter-${i}`}
              className="absolute w-12 h-16 bg-white rounded shadow-lg opacity-40"
              initial={{ 
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800,
                rotate: Math.random() * 360
              }}
              animate={{ 
                y: -100,
                rotate: Math.random() * 360
              }}
              transition={{
                duration: Math.random() * 30 + 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="p-2">
                <div className="h-1 bg-gray-300 mb-1 rounded"></div>
                <div className="h-1 bg-gray-300 mb-1 rounded w-3/4"></div>
                <div className="h-1 bg-gray-300 rounded w-1/2"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Price counter animation */}
          <motion.div
            className="absolute -top-20 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="text-9xl font-bold text-gray-200"
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              $$$
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent inline-block py-2 leading-tight"
              style={{ opacity: priceOpacity }}
            >
              College admissions shouldn&apos;t cost $50,000
            </motion.span>
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-5xl lg:text-6xl font-bold"
            style={{ opacity: storyOpacity }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent inline-block py-2 leading-tight">
              Every story deserves its shot
            </span>
          </motion.h2>
          
          {/* Animated price comparison */}
          <motion.div
            className="mt-8 flex justify-center items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-red-500 line-through"
                animate={{ scale: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                $50,000
              </motion.div>
              <p className="text-sm text-gray-500">Traditional</p>
            </div>
            <motion.div
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              →
            </motion.div>
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                $50+
              </motion.div>
              <p className="text-sm text-gray-500">Proofr</p>
            </div>
          </motion.div>
          
          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Link href="/sign-up" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all">
              Start Your Story
            </Link>
            <Link href="/consultant-dashboard" className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-full font-semibold text-lg hover:bg-purple-50 transform hover:scale-105 transition-all">
              Become a Consultant
            </Link>
          </motion.div>
          
          {/* Success stories ticker */}
          <motion.div
            className="mt-16 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="relative">
              <div className={`${styles.scrollContainer} flex space-x-8`}>
                {[
                  "🎉 Sarah got into Stanford!",
                  "💪 Ahmed saved $45,000",
                  "🌟 Maria's consultant spoke Portuguese",
                  "📚 James got into MIT",
                  "🎯 Priya found her perfect match",
                  "🚀 Carlos earned $5k as a consultant"
                ].map((story, i) => (
                  <div key={i} className="whitespace-nowrap text-gray-600 px-4 py-2 bg-white/50 rounded-full backdrop-blur-sm">
                    {story}
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  "🎉 Sarah got into Stanford!",
                  "💪 Ahmed saved $45,000",
                  "🌟 Maria's consultant spoke Portuguese",
                  "📚 James got into MIT",
                  "🎯 Priya found her perfect match",
                  "🚀 Carlos earned $5k as a consultant"
                ].map((story, i) => (
                  <div key={`dup-${i}`} className="whitespace-nowrap text-gray-600 px-4 py-2 bg-white/50 rounded-full backdrop-blur-sm">
                    {story}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </motion.div>
      </section>

      {/* The Problem We Saw - Bimodal Reality First */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* The bimodal reality - moved to top */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-24"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-10 leading-tight">The bimodal reality</h2>
            <div className="space-y-8">
              <p className="text-xl text-gray-800 leading-[1.8] font-normal">
                The college admissions process has become a <span className="font-bold text-gray-900 bg-red-50 px-2 py-0.5 rounded">$3 billion industry</span> that serves primarily the wealthy. We witnessed a disturbing bimodal distribution: those with means get in, those without struggle—regardless of merit.
              </p>
              <p className="text-lg text-gray-700 leading-[1.75] font-light">
                It's not about IQ or potential anymore. It's about whether your family can afford to turn your genuine thoughts into polished prose. Essays have become less about <span className="font-medium text-gray-900">substance</span> and more about who can pay for the <span className="font-medium text-gray-900">best packaging</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Numbers */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">The numbers don't lie</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { value: '$50,000', label: 'Average cost of traditional college consulting', icon: DollarSign },
              { value: '92%', label: 'Students priced out of quality guidance', icon: TrendingDown },
              { value: '1:100', label: 'Counselor to student ratio in public schools', icon: Users }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-200 to-pink-200 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity" />
                
                <div className="relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-gray-200 transition-all text-center shadow-sm hover:shadow-md">
                  <div className="mb-4">
                    <stat.icon className="w-10 h-10 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-5xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Story Section - Why We Built This */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">Why we built Proofr</h2>
            
            <div className="space-y-8">
              <p className="text-xl text-gray-800 leading-[1.8] font-normal">
                I watched my classmates write themselves into colleges without the proper stats. I saw families spend <span className="font-semibold text-gray-900 bg-yellow-50 px-1 py-0.5 rounded">$10,000 to $15,000</span> on consulting. And I saw a disturbing pattern emerge.
              </p>
              
              <p className="text-lg text-gray-700 leading-[1.75] font-light">
                When I needed help with my essays, I didn't turn to expensive consultants. I asked friends—<span className="font-medium text-gray-900">Christian at Cornell, Phong at Duke</span>. They helped me understand cultural fit, suggested word changes, caught errors. The substance was mine, but their perspective was invaluable.
              </p>
              
              <p className="text-lg text-gray-700 leading-[1.75] font-light">
                That's when it hit me: <span className="font-medium text-gray-900 italic">"Why should this kind of help cost a fortune?"</span>
              </p>
              
              <div className="pt-6 border-t border-gray-200">
                <p className="text-lg text-gray-600 leading-[1.75] font-light italic">
                  Everyone deserves access to the guidance that helped us succeed. That's why we built Proofr.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Old Way vs Our Way */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-200 via-purple-200 to-blue-200 rounded-3xl blur-3xl opacity-30" />
            
            <div className="relative backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-12 bg-gray-900/5 backdrop-blur-md">
                  <h3 className="text-2xl font-bold mb-6 text-gray-700 py-1">The Old Way</h3>
                  <ul className="space-y-6">
                    {[
                      { text: 'Exclusive firms', stat: 'Top 1% only' },
                      { text: '$50,000+ packages', stat: 'Avg cost' },
                      { text: 'Outdated advisors', stat: '10+ years ago' },
                      { text: 'One-size-fits-all', stat: 'No flexibility' }
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center">
                          <motion.div
                            animate={{ rotate: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          >
                            <XCircle className="w-5 h-5 text-red-500 mr-3" />
                          </motion.div>
                          <span className="text-gray-700">{item.text}</span>
                        </div>
                        <span className="text-xs text-gray-500">{item.stat}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="p-12 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md">
                  <h3 className="text-2xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent inline-block py-1 leading-tight">
                      Our Way
                    </span>
                  </h3>
                  <ul className="space-y-6">
                    {[
                      { text: 'Peer consultants', stat: 'Recent grads' },
                      { text: 'Starting at $50', stat: '99% cheaper' },
                      { text: 'Recent grads who get it', stat: '2023-2024' },
                      { text: 'Personalized matches', stat: 'AI-powered' }
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          </motion.div>
                          <span className="text-gray-700 font-medium">{item.text}</span>
                        </div>
                        <span className="text-xs text-purple-600 font-medium">{item.stat}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Solution - For Students and Consultants */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-8">For students</h3>
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-[1.75] font-light">
                  Access the same quality of guidance that got us into top schools—at a <span className="font-medium text-gray-900">fraction of the cost</span>. Connect with recent grads who understand your challenges and can help your authentic voice shine through.
                </p>
                <p className="text-lg text-gray-600 leading-[1.75] font-light italic">
                  Because your potential shouldn't be limited by your parent's bank account.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-8">For consultants</h3>
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-[1.75] font-light">
                  College students deserve better than <span className="font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">$16.50-$23.50/hour</span> work-study jobs with rigid schedules. On Proofr, consultants earn an average of <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">$75-$90/hour</span> on their own terms.
                </p>
                <p className="text-lg text-gray-600 leading-[1.75] font-light">
                  Control your schedule. Help students like you once were. Earn what you're actually worth.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Story, Our Mission - Interactive Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 via-purple-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent inline-block py-2 leading-tight">
                Your Story, Our Mission
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-[1.7] font-light">
              Type your dream school and watch the magic happen
            </p>
          </motion.div>
          
          {/* Interactive Story Builder with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Gradient background blob */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-3xl blur-3xl opacity-20" />
            
            <div className="relative backdrop-blur-xl bg-white/30 rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12 mb-16">
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type your dream school..."
                    value={searchQuery}
                    className="w-full px-6 py-4 text-xl bg-white/50 backdrop-blur-md border-2 border-white/40 rounded-full focus:border-purple-500/50 focus:outline-none transition-all focus:shadow-lg focus:shadow-purple-500/20"
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setIsSearching(true)
                      // Simulate search delay
                      setTimeout(() => {
                        if (e.target.value) {
                          setSearchResults([
                            { name: 'Sarah Chen', school: 'Harvard', specialty: 'Essays', price: '$75/hr', rating: 4.9 },
                            { name: 'Alex Rivera', school: 'Stanford', specialty: 'STEM Apps', price: '$90/hr', rating: 5.0 },
                            { name: 'Priya Patel', school: 'MIT', specialty: 'Tech Essays', price: '$85/hr', rating: 4.8 }
                          ])
                        } else {
                          setSearchResults([])
                        }
                        setIsSearching(false)
                      }, 500)
                    }}
                  />
                  
                  {/* Search icon */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Search className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
                
                {/* Search Results */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 space-y-3"
                    >
                      {searchResults.map((consultant, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/50 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">{consultant.name}</h4>
                              <p className="text-sm text-gray-600">{consultant.school} • {consultant.specialty}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-purple-600">{consultant.price}</p>
                              <p className="text-sm text-gray-500">⭐ {consultant.rating}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Loading state */}
                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 space-y-3"
                  >
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/20 rounded-2xl p-4 animate-pulse">
                        <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-white/30 rounded w-1/2"></div>
                      </div>
                    ))}
                  </motion.div>
                )}
              
              <motion.div 
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { name: 'Harvard', count: 47, color: 'from-red-400 to-red-600', icon: School },
                  { name: 'Stanford', count: 38, color: 'from-green-400 to-green-600', icon: TreePine },
                  { name: 'MIT', count: 52, color: 'from-blue-400 to-blue-600', icon: Cpu }
                ].map((school, index) => (
                  <motion.div
                    key={school.name}
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setSearchQuery(school.name)
                      setIsSearching(true)
                      setTimeout(() => {
                        setSearchResults([
                          { name: 'Sarah Chen', school: school.name, specialty: 'Essays', price: '$75/hr', rating: 4.9 },
                          { name: 'Alex Rivera', school: school.name, specialty: 'STEM Apps', price: '$90/hr', rating: 5.0 },
                          { name: 'Priya Patel', school: school.name, specialty: 'Tech Essays', price: '$85/hr', rating: 4.8 }
                        ])
                        setIsSearching(false)
                      }, 500)
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${school.color} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
                    
                    <div className="relative bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{school.name}</p>
                          <p className="text-sm text-gray-600">{school.count} consultants</p>
                        </div>
                        <motion.div
                          className="text-2xl"
                          animate={{ 
                            rotate: index === 1 ? [0, 360] : [0, -10, 10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <school.icon className="w-6 h-6 text-gray-700" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* ESL Toggle */}
              <motion.div 
                className="mt-8 flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Need help in another language?</span>
                  <button 
                    onClick={() => setShowESLToggle(!showESLToggle)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${showESLToggle ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-300'}`}
                  >
                    <motion.span 
                      className="inline-block h-6 w-6 rounded-full bg-white shadow-lg"
                      animate={{
                        x: showESLToggle ? 26 : 2
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </motion.div>
              
              <AnimatePresence>
                {showESLToggle && (
                  <motion.div
                    className="mt-4 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <Globe className="w-4 h-4" />
                      <span className="font-medium">Available in 100+ languages</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Spanish', 'Mandarin', 'Hindi', 'Arabic', 'Portuguese'].map((lang) => (
                        <motion.span
                          key={lang}
                          className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs text-gray-800 border border-white/30 font-medium"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {lang}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Counter */}
      <section id="impact-counter" className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Real Impact, Real People</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-6xl font-bold mb-4">{impactCount.storiesTold.toLocaleString()}</h3>
              <p className="text-xl">Stories Told</p>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-6xl font-bold mb-4">${impactCount.moneySaved}M</h3>
              <p className="text-xl">Money Saved</p>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-6xl font-bold mb-4">{impactCount.dreamsFunded.toLocaleString()}</h3>
              <p className="text-xl">Dreams Funded</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Story, Amplified */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent inline-block py-2 leading-tight">
                Your Story, Amplified
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-[1.8] font-light">
              Whether English is your second language, you&apos;re first-gen, or just need someone who gets it—we match you with consultants who&apos;ve walked your path.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "ESL Support",
                description: "Consultants who help articulate your story, no matter your native language",
                icon: Globe,
                gradient: "from-blue-400 to-cyan-400",
                stats: "127 languages"
              },
              {
                title: "First-Gen Focus",
                description: "Guides who understand the unique challenges of being first in your family",
                icon: GraduationCap,
                gradient: "from-purple-400 to-pink-400",
                stats: "2,341 first-gen"
              },
              {
                title: "Peer Perspective",
                description: "Recent grads who remember the stress and know what actually works",
                icon: Lightbulb,
                gradient: "from-yellow-400 to-orange-400",
                stats: "Avg 2023 grad"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
                whileHover={{ y: -5 }}
              >
                {/* Gradient glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity`} />
                
                {/* Glass card */}
                <div className="relative backdrop-blur-xl bg-white/70 rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all">
                  <motion.div 
                    className="text-5xl mb-4"
                    animate={{ 
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <feature.icon className="w-12 h-12 text-purple-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-sm font-semibold text-purple-600 mb-3">{feature.stats}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Proofr Promise */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-white px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-700 via-blue-700 to-pink-700 bg-clip-text text-transparent inline-block py-2 leading-tight">
                The Proofr Promise
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-4">No student left behind. Our scholarship programs ensure everyone gets their shot.</p>
            <motion.p 
              className="text-lg text-gray-700 font-medium max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
                Our 2025-26 Pledge:
              </span>{' '}
              Every dollar of profit Proofr makes this admissions cycle will fund these programs. 
              When you succeed, science succeeds. When you grow, communities grow.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Pinnacle Scholars",
                description: "Merit-based excellence for exceptional students",
                color: "from-purple-500 to-purple-600",
                funded: "847 students",
                icon: GraduationCap,
                href: "/promise/pinnacle-scholars"
              },
              {
                name: "Research Vanguard",
                description: "Defending scientific progress with research grants",
                color: "from-blue-500 to-blue-600",
                funded: "2,847 students",
                icon: FlaskConical,
                href: "/promise/research-vanguard"
              },
              {
                name: "Community Champions",
                description: "Supporting local leaders creating global change",
                color: "from-orange-500 to-orange-600",
                funded: "1,234 students",
                icon: Users,
                href: "/promise/community-champions"
              },
              {
                name: "Access Academy",
                description: "Free resources and guides for all students",
                color: "from-green-500 to-green-600",
                funded: "10,847 students",
                icon: BookOpen,
                href: "/promise/access-academy"
              }
            ].map((program, index) => (
              <Link href={program.href} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group h-full cursor-pointer"
                  whileHover={{ y: -5, rotate: 1 }}
                >
                  {/* Gradient glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${program.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
                  
                  {/* Glass card */}
                  <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <program.icon className="w-6 h-6 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {program.funded}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 bg-gradient-to-r ${program.color} bg-clip-text text-transparent`}>
                      {program.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex-grow">{program.description}</p>
                    
                    {/* Learn more text */}
                    <p className="text-xs text-gray-500 mt-3 group-hover:text-gray-700 transition-colors">
                      Learn more →
                    </p>
                    
                    {/* Hover effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-b-3xl"
                      style={{ backgroundImage: `linear-gradient(to right, ${program.color.split(' ')[1]}, ${program.color.split(' ')[3]})` }}
                    />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-10 leading-tight">The endgame</h2>
            <div className="space-y-8">
              <p className="text-xl text-gray-800 leading-[1.8] font-normal">
                We believe essays should matter less. They've become too easy to game, too dependent on polish over substance. Until that changes, we're here to <span className="font-semibold text-gray-900">level the playing field</span>.
              </p>
              <p className="text-lg text-gray-700 leading-[1.75] font-light">
                Our vision? A world where merit is measured by factors within your control—your <span className="font-medium text-gray-900">knowledge</span>, your <span className="font-medium text-gray-900">problem-solving</span>, your <span className="font-medium text-gray-900">potential</span>—not your family's ability to hire help.
              </p>
              <blockquote className="border-l-4 border-purple-600 pl-8 py-2 my-10 bg-purple-50 rounded-r-lg">
                <p className="text-xl text-gray-800 italic leading-[1.7] font-light">
                  "The best consultants aren't professionals in ivory towers. They're students who just walked this path and remember every step."
                </p>
              </blockquote>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Join the Movement */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent inline-block py-2 leading-tight">
                Ready to Change Your Story?
              </span>
            </h2>
            <p className="text-xl text-gray-700 mb-12 leading-[1.7] font-light">
              Join thousands of students and consultants building a more equitable future for college admissions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/sign-up" 
                className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Start Your Application
              </Link>
              <Link 
                href="/consultant-dashboard" 
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Become a Consultant
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}