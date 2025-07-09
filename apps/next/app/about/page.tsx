'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { NavigationBar } from 'app/features/landing/components/NavigationBar/NavigationBar'
import styles from './about.module.css'

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
              className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              style={{ opacity: priceOpacity }}
            >
              College admissions shouldn't cost $50,000
            </motion.span>
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent"
            style={{ opacity: storyOpacity }}
          >
            Every story deserves its shot
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
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {[
              { value: '$50,000', label: 'Average cost of traditional college consulting', icon: '💸' },
              { value: '92%', label: 'Students priced out of quality guidance', icon: '📊' },
              { value: '1:100', label: 'Counselor to student ratio in public schools', icon: '👥' }
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
                
                <div className="relative backdrop-blur-sm bg-white/90 rounded-3xl p-8 border border-gray-200 hover:border-red-200 transition-all text-center">
                  <motion.div 
                    className="text-4xl mb-4 opacity-20"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.h3 
                    className="text-5xl font-bold text-red-500 mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive comparison with glassmorphism */}
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
                  <h3 className="text-2xl font-bold mb-6 text-gray-700">The Old Way</h3>
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
                          <motion.span 
                            className="text-red-500 mr-3 text-xl"
                            animate={{ rotate: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          >
                            ✗
                          </motion.span>
                          <span className="text-gray-700">{item.text}</span>
                        </div>
                        <span className="text-xs text-gray-500">{item.stat}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="p-12 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md">
                  <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Our Way</h3>
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
                          <motion.span 
                            className="text-green-500 mr-3 text-xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          >
                            ✓
                          </motion.span>
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

      {/* Impact Counter with glassmorphism */}
      <section id="impact-counter" className="relative py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        {/* Floating shapes */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
          animate={{ 
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        
        <div className="relative max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Real Impact, Real People
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: impactCount.storiesTold, label: 'Stories Told', icon: '📝', color: 'from-purple-400 to-purple-600' },
              { value: `$${impactCount.moneySaved}M`, label: 'Money Saved', icon: '💰', color: 'from-green-400 to-green-600' },
              { value: impactCount.dreamsFunded, label: 'Dreams Funded', icon: '🌟', color: 'from-blue-400 to-blue-600' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                {/* Glass card */}
                <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all text-center">
                  {/* Icon background */}
                  <motion.div
                    className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl opacity-20`}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <h3 className="text-5xl font-bold mb-2 text-white">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </h3>
                  <p className="text-lg text-white/80">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Story, Our Mission - Interactive Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white via-purple-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Story, Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
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
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
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
                  { name: 'Harvard', count: 47, color: 'from-red-400 to-red-600', emoji: '🏛️' },
                  { name: 'Stanford', count: 38, color: 'from-green-400 to-green-600', emoji: '🌲' },
                  { name: 'MIT', count: 52, color: 'from-blue-400 to-blue-600', emoji: '🤖' }
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
                          {school.emoji}
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
                    <p className="text-center text-sm text-gray-600">
                      🌍 Available in 100+ languages
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Spanish', 'Mandarin', 'Hindi', 'Arabic', 'Portuguese'].map((lang) => (
                        <motion.span
                          key={lang}
                          className="px-3 py-1 bg-white/40 backdrop-blur-sm rounded-full text-xs text-gray-700 border border-white/20"
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
          </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Story, Amplified</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether English is your second language, you're first-gen, or just need someone who gets it - 
              we match you with consultants who've walked your path.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "ESL Support",
                description: "Consultants who help articulate your story, no matter your native language",
                icon: "🌍",
                gradient: "from-blue-400 to-cyan-400",
                stats: "127 languages"
              },
              {
                title: "First-Gen Focus",
                description: "Guides who understand the unique challenges of being first in your family",
                icon: "🎓",
                gradient: "from-purple-400 to-pink-400",
                stats: "2,341 first-gen"
              },
              {
                title: "Peer Perspective",
                description: "Recent grads who remember the stress and know what actually works",
                icon: "💡",
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
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-sm font-medium text-purple-600 mb-3">{feature.stats}</p>
                  <p className="text-gray-600">{feature.description}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Proofr Promise</h2>
            <p className="text-xl text-gray-600">No student left behind. Our scholarship programs ensure everyone gets their shot.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Dream Makers Initiative",
                description: "Full scholarships for exceptional students with financial need",
                color: "from-purple-500 to-purple-600",
                funded: "342 students",
                icon: "🎆"
              },
              {
                name: "First Flight Fund",
                description: "Supporting first-generation college applicants",
                color: "from-blue-500 to-blue-600",
                funded: "567 students",
                icon: "🕊️"
              },
              {
                name: "Bridge Builders",
                description: "ESL and international student support",
                color: "from-pink-500 to-pink-600",
                funded: "893 students",
                icon: "🌉"
              },
              {
                name: "Access Academy",
                description: "Free workshops and resources for all",
                color: "from-green-500 to-green-600",
                funded: "2,341 students",
                icon: "🏛️"
              }
            ].map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
                whileHover={{ y: -5, rotate: 1 }}
              >
                {/* Gradient glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
                
                {/* Glass card */}
                <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <motion.div 
                      className="text-3xl"
                      animate={{ 
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    >
                      {program.icon}
                    </motion.div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {program.funded}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold mb-2 bg-gradient-to-r ${program.color} bg-clip-text text-transparent`}>
                    {program.name}
                  </h3>
                  <p className="text-sm text-gray-600">{program.description}</p>
                  
                  {/* Hover effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-b-3xl"
                    style={{ backgroundImage: `linear-gradient(to right, ${program.color.split(' ')[1]}, ${program.color.split(' ')[3]})` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Movement */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Change Your Story?</h2>
            <p className="text-xl text-gray-600 mb-12">
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