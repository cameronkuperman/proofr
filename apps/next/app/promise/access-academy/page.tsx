'use client'

import { PromiseLayout } from '../components/PromiseLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen,
  FileText,
  Download,
  Search,
  Filter,
  Clock,
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  Lock,
  Unlock,
  GraduationCap,
  PenTool,
  MessageSquare,
  Target,
  Lightbulb,
  Heart,
  Globe,
  Award,
  BarChart,
  Zap,
  BookMarked,
  Plus,
  Send,
  X
} from 'lucide-react'

// Mock guide data - in real app would come from database
const guides = [
  // Essays
  {
    id: 1,
    category: 'Essays',
    title: 'The Perfect Personal Statement',
    description: 'Step-by-step guide to crafting a compelling personal narrative',
    readTime: '12 min',
    downloads: 3421,
    rating: 4.9,
    icon: PenTool,
    topics: ['Structure', 'Voice', 'Common mistakes', 'Examples'],
    premium: false
  },
  {
    id: 2,
    category: 'Essays',
    title: 'Supplemental Essays That Stand Out',
    description: 'How to tackle "Why Us?" and other common supplementals',
    readTime: '15 min',
    downloads: 2847,
    rating: 4.8,
    icon: FileText,
    topics: ['Research tips', 'Authenticity', 'Word limits', 'Templates'],
    premium: false
  },
  {
    id: 3,
    category: 'Essays',
    title: 'Writing About Challenges & Adversity',
    description: 'Turn difficult experiences into powerful narratives',
    readTime: '18 min',
    downloads: 1923,
    rating: 4.9,
    icon: Heart,
    topics: ['Sensitivity', 'Growth focus', 'Balance', 'Examples'],
    premium: false
  },
  // Interviews
  {
    id: 4,
    category: 'Interviews',
    title: 'Alumni Interview Mastery',
    description: 'Everything you need to ace your alumni interviews',
    readTime: '20 min',
    downloads: 2134,
    rating: 4.7,
    icon: MessageSquare,
    topics: ['Common questions', 'Body language', 'Follow-up', 'Virtual tips'],
    premium: false
  },
  {
    id: 5,
    category: 'Interviews',
    title: 'Scholarship Interview Preparation',
    description: 'Stand out in competitive scholarship interviews',
    readTime: '16 min',
    downloads: 1567,
    rating: 4.8,
    icon: Award,
    topics: ['Research', 'STAR method', 'Mock practice', 'Attire'],
    premium: false
  },
  // Test Prep
  {
    id: 6,
    category: 'Test Prep',
    title: 'SAT Math: Concepts to Calculations',
    description: 'Master every SAT math topic with clear explanations',
    readTime: '45 min',
    downloads: 4521,
    rating: 4.6,
    icon: BarChart,
    topics: ['Algebra', 'Geometry', 'Statistics', 'Practice problems'],
    premium: false
  },
  {
    id: 7,
    category: 'Test Prep',
    title: 'ACT Science: Speed & Strategy',
    description: 'Decode the ACT Science section without memorization',
    readTime: '22 min',
    downloads: 2341,
    rating: 4.7,
    icon: Zap,
    topics: ['Graph reading', 'Time management', 'Question types', 'Practice'],
    premium: false
  },
  // Applications
  {
    id: 8,
    category: 'Applications',
    title: 'Building Your College List',
    description: 'Find schools that fit academically, socially, and financially',
    readTime: '25 min',
    downloads: 5234,
    rating: 4.9,
    icon: Target,
    topics: ['Safety/Match/Reach', 'Research tools', 'Fit factors', 'Spreadsheet template'],
    premium: false
  },
  {
    id: 9,
    category: 'Applications',
    title: 'Activities List That Tells Your Story',
    description: 'Make your extracurriculars shine in 150 characters',
    readTime: '14 min',
    downloads: 3876,
    rating: 4.8,
    icon: Star,
    topics: ['Descriptions', 'Order strategy', 'Impact focus', 'Examples'],
    premium: false
  },
  {
    id: 10,
    category: 'Applications',
    title: 'International Student Guide',
    description: 'Navigate the US application process from abroad',
    readTime: '30 min',
    downloads: 1234,
    rating: 4.9,
    icon: Globe,
    topics: ['Visa process', 'Financial docs', 'Credential evaluation', 'Timeline'],
    premium: false
  }
]

const categories = ['All', 'Essays', 'Interviews', 'Test Prep', 'Applications']

export default function AccessAcademyPage() {
  const [activeSection, setActiveSection] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGuide, setSelectedGuide] = useState<typeof guides[0] | null>(null)
  const [bookmarkedGuides, setBookmarkedGuides] = useState<number[]>([])
  const [guidesAccessed, setGuidesAccessed] = useState(0)
  const [showContributeModal, setShowContributeModal] = useState(false)
  
  // Animate guides accessed counter
  useEffect(() => {
    const target = 10847
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setGuidesAccessed(target)
        clearInterval(timer)
      } else {
        setGuidesAccessed(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [])
  
  // Filter guides based on category and search
  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  // Track active section for sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    
    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))
    
    return () => observer.disconnect()
  }, [])
  
  // Custom sidebar for split layout
  const sidebar = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#F0F0F0]">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Guide Library</h3>
        <p className="text-sm text-gray-600">Browse our collection of resources</p>
      </div>
      
      {/* Search and Filter */}
      <div className="p-6 border-b border-[#F0F0F0] bg-[#FAFAF9]">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#E5E5E5]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Guides List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredGuides.map((guide) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl border ${
                selectedGuide?.id === guide.id 
                  ? 'border-green-500 shadow-lg' 
                  : 'border-[#E5E5E5] hover:border-gray-300 hover:shadow-md'
              } p-5 cursor-pointer transition-all`}
              onClick={() => setSelectedGuide(guide)}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg ${
                  guide.category === 'Essays' ? 'bg-blue-50' :
                  guide.category === 'Interviews' ? 'bg-purple-50' :
                  guide.category === 'Test Prep' ? 'bg-orange-50' :
                  'bg-green-50'
                }`}>
                  <guide.icon className={`w-5 h-5 ${
                    guide.category === 'Essays' ? 'text-blue-600' :
                    guide.category === 'Interviews' ? 'text-purple-600' :
                    guide.category === 'Test Prep' ? 'text-orange-600' :
                    'text-green-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{guide.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{guide.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {guide.downloads.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      {guide.rating}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setBookmarkedGuides(prev => 
                      prev.includes(guide.id) 
                        ? prev.filter(id => id !== guide.id)
                        : [...prev, guide.id]
                    )
                  }}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookMarked className={`w-4 h-4 ${
                    bookmarkedGuides.includes(guide.id) 
                      ? 'text-green-600 fill-current' 
                      : 'text-gray-400'
                  }`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Contribute Button */}
        <div className="p-4 border-t border-[#F0F0F0]">
          <button
            onClick={() => setShowContributeModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            Share Your Knowledge
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Help others by contributing a guide
          </p>
        </div>
      </div>
      
      {/* Stats Footer */}
      <div className="p-4 border-t border-[#F0F0F0] bg-[#FAFAF9]">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{filteredGuides.length} guides available</span>
          <span>{bookmarkedGuides.length} bookmarked</span>
        </div>
      </div>
    </div>
  );
  
  return <PromiseLayout currentProgram="access-academy" sidebar={null}>
      <div className="flex min-h-screen" style={{ marginLeft: '-3rem', marginRight: '-3rem' }}>
        {/* Main Content Area */}
        <div className="flex-1 bg-[#FAFAF9]" style={{ minWidth: '800px' }}>
          <div className="w-full px-8 py-12 lg:px-12 xl:px-16 2xl:px-20" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/promise" className="hover:text-gray-900 transition-colors">The Proofr Promise</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Access Academy</span>
              </nav>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    Access Academy
                  </h1>
                  <p className="text-xl text-gray-600">Free resources and guides for all students</p>
                </div>
              </div>
            </motion.div>
            
            {/* Overview Section */}
            <section id="overview" className="mb-16">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Knowledge should be free. That's why we've compiled everything we know about college 
                admissions into comprehensive guides available to every student, everywhere, at no cost. 
                These aren't generic tips—they're the exact strategies that helped us and thousands of 
                other students get into top schools.
              </p>
              
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">By the Numbers</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700">{guidesAccessed.toLocaleString()}</div>
                    <p className="text-sm text-gray-600 mt-1">Students helped</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700">147</div>
                    <p className="text-sm text-gray-600 mt-1">Comprehensive guides</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700">4.8</div>
                    <p className="text-sm text-gray-600 mt-1">Average rating</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700">Free</div>
                    <p className="text-sm text-gray-600 mt-1">Forever</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Philosophy Section */}
            <section id="philosophy" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Open Access Philosophy</h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  The college admissions process has become an information game where those with insider 
                  knowledge win. We're changing that by making all our knowledge freely available. No 
                  paywalls, no premium tiers, no gatekeeping.
                </p>
                
                <blockquote className="border-l-4 border-green-600 pl-6 my-8 text-gray-800 italic bg-white rounded-r-lg py-4 pr-6">
                  "Information wants to be free. When we share what we know, we lift entire communities. 
                  That's how real change happens—not through exclusivity, but through radical openness."
                </blockquote>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Every guide in Access Academy was written by students who successfully navigated the 
                  admissions process and consultants from top universities. We update them constantly based 
                  on feedback and changing trends.
                </p>
              </div>
            </section>
            
            {/* What's Included Section */}
            <section id="whats-included" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Included</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <PenTool className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Essay Guides</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Personal statement frameworks</li>
                    <li>• Supplemental essay strategies</li>
                    <li>• Topic brainstorming exercises</li>
                    <li>• Editing checklists</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Interview Prep</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Common questions database</li>
                    <li>• Mock interview guides</li>
                    <li>• Body language tips</li>
                    <li>• Virtual interview setup</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart className="w-6 h-6 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Test Prep</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• SAT/ACT strategy guides</li>
                    <li>• Practice problem sets</li>
                    <li>• Time management techniques</li>
                    <li>• Test anxiety resources</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Application Strategy</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• School selection tools</li>
                    <li>• Timeline templates</li>
                    <li>• Financial aid guides</li>
                    <li>• Demonstrated interest tracking</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-2">Plus Specialized Resources</h4>
                <p className="text-green-50">
                  First-generation guides, international student resources, transfer application help, 
                  gap year planning, and guides in 12 languages.
                </p>
              </div>
            </section>
            
            {/* How It Works Section */}
            <section id="how-it-works" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How Access Academy Works</h2>
              
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Browse or Search',
                    description: 'Use the guide browser on the right to find resources by category or search for specific topics.',
                    icon: Search
                  },
                  {
                    step: 2,
                    title: 'Read & Learn',
                    description: 'Each guide includes step-by-step instructions, examples, and actionable templates.',
                    icon: BookOpen
                  },
                  {
                    step: 3,
                    title: 'Download & Save',
                    description: 'Save guides for offline access, bookmark favorites, and download templates.',
                    icon: Download
                  },
                  {
                    step: 4,
                    title: 'Apply & Succeed',
                    description: 'Use what you\'ve learned in your actual applications with confidence.',
                    icon: GraduationCap
                  }
                ].map((step) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {step.step}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <step.icon className="w-6 h-6 text-green-600" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
            
            {/* Community Contributions Section */}
            <section id="community" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Built by Students, For Students</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Access Academy isn't just a resource library—it's a living, breathing community project. 
                Every guide is peer-reviewed, tested by real students, and updated based on outcomes.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">234 Contributors</h3>
                  <p className="text-sm text-gray-600">
                    Students and consultants who share their knowledge
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Weekly Updates</h3>
                  <p className="text-sm text-gray-600">
                    Fresh content based on current admissions trends
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">12 Languages</h3>
                  <p className="text-sm text-gray-600">
                    Making knowledge accessible globally
                  </p>
                </motion.div>
              </div>
              
              <div className="mt-8 bg-white rounded-xl p-6 border border-[#E5E5E5]">
                <h4 className="font-semibold text-gray-900 mb-2">Want to Contribute?</h4>
                <p className="text-gray-700 mb-4">
                  If you've successfully navigated college admissions and want to help others, we'd love 
                  your contributions. Share a guide, translate content, or review submissions.
                </p>
                <button
                  onClick={() => setShowContributeModal(true)}
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                >
                  Learn about contributing
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
            
            {/* Impact Stories */}
            <section id="impact" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Real Impact, Real Students</h2>
              
              <div className="space-y-6">
                {[
                  {
                    name: 'Jennifer Liu',
                    school: 'Accepted to Yale',
                    quote: 'The personal statement guide helped me find my authentic voice. I went from generic to genuine.',
                    guide: 'The Perfect Personal Statement'
                  },
                  {
                    name: 'Carlos Rodriguez',
                    school: 'Full ride to Duke',
                    quote: 'As a first-gen student, I had no idea how to approach interviews. These guides gave me confidence.',
                    guide: 'Alumni Interview Mastery'
                  },
                  {
                    name: 'Amara Johnson',
                    school: 'Accepted to 7 schools',
                    quote: 'The school selection guide helped me find schools I\'d never heard of but were perfect fits.',
                    guide: 'Building Your College List'
                  }
                ].map((story, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{story.name}</h4>
                        <p className="text-sm text-gray-600">{story.school}</p>
                      </div>
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <blockquote className="text-gray-700 italic mb-2">"{story.quote}"</blockquote>
                    <p className="text-sm text-green-600">Used: {story.guide}</p>
                  </motion.div>
                ))}
              </div>
            </section>
            
            {/* Call to Action */}
            <section className="mb-16">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Start Learning Today
                </h3>
                <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                  Everything you need to succeed is in the guide browser to the right. No sign-up required, 
                  no payment needed. Just click, learn, and apply.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setSelectedCategory('Essays')}
                    className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Start with Essays
                  </button>
                  <Link
                    href="/promise/access-academy/testimonials"
                    className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
                  >
                    Success Stories
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        {/* Right Panel - Guide Browser */}
        <div className="w-[400px] xl:w-[450px] bg-white border-l border-[#E5E5E5] h-screen sticky top-0 flex flex-col shadow-sm flex-shrink-0">
          {sidebar}
        </div>
      </div>
      
      {/* Selected Guide Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedGuide.title}</h3>
                    <p className="text-gray-600">{selectedGuide.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedGuide.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {selectedGuide.downloads.toLocaleString()} downloads
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {selectedGuide.rating} rating
                  </span>
                </div>
                
                <div className="prose prose-green max-w-none">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">What you'll learn:</h4>
                  <ul className="space-y-2 mb-6">
                    {selectedGuide.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <p className="text-center text-gray-700 mb-4">
                      This is a preview. Click below to access the full guide and downloadable resources.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link
                        href={`/promise/access-academy/guides/${selectedGuide.id}`}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Read Full Guide
                      </Link>
                      <button
                        className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Contribute Modal */}
      <AnimatePresence>
        {showContributeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContributeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Knowledge</h3>
                    <p className="text-gray-600">Help thousands of students by contributing a guide</p>
                  </div>
                  <button
                    onClick={() => setShowContributeModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guide Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., How to Write Compelling Supplemental Essays"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Essays</option>
                      <option>Interviews</option>
                      <option>Test Prep</option>
                      <option>Applications</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brief Description
                    </label>
                    <textarea
                      placeholder="What will students learn from your guide?"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Background
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Accepted to Harvard, Yale, Princeton"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• We'll review your submission within 48 hours</li>
                      <li>• If approved, we'll work with you to develop the full guide</li>
                      <li>• You'll be credited as the author and help thousands of students</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Contribution
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContributeModal(false)}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PromiseLayout>
}