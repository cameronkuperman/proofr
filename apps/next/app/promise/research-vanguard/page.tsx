'use client'

import { PromiseLayout } from '../components/PromiseLayout'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FlaskConical,
  Microscope,
  Dna,
  Brain,
  Heart,
  Atom,
  TrendingDown,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Users,
  Target,
  Award,
  BookOpen,
  LineChart,
  Beaker
} from 'lucide-react'

export default function ResearchVanguardPage() {
  const [activeSection, setActiveSection] = useState('')
  const [fundingGap, setFundingGap] = useState(0)
  
  // Animate funding gap counter
  useEffect(() => {
    const target = 34.2
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setFundingGap(target)
        clearInterval(timer)
      } else {
        setFundingGap(parseFloat(current.toFixed(1)))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [])
  
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
  
  const sidebar = (
    <div className="space-y-8">
      {/* Table of Contents */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">On this page</h3>
        <nav className="space-y-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'crisis', label: 'The Funding Crisis' },
            { id: 'approach', label: 'Our Approach' },
            { id: 'funding-recipients', label: 'Funding Recipients' },
            { id: 'selection-criteria', label: 'Selection Criteria' },
            { id: 'impact', label: 'Research Impact' },
            { id: 'partners', label: 'Partner Institutions' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                block py-1.5 px-3 text-sm rounded-lg transition-all
                ${activeSection === item.id 
                  ? 'text-blue-700 bg-blue-50 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      
      {/* Crisis Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">The Stakes</h3>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-red-600">-{fundingGap}%</div>
            <p className="text-xs text-gray-600">Federal research funding cut</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700">23</div>
            <p className="text-xs text-gray-600">University endowments funded</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700">$1.8M</div>
            <p className="text-xs text-gray-600">To research institutions</p>
          </div>
        </div>
      </div>
      
      {/* Learn More Button */}
      <div className="sticky bottom-0 bg-white pb-4">
        <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all">
          View Partner Institutions
        </button>
      </div>
    </div>
  );
  
  return <PromiseLayout currentProgram="research-vanguard" sidebar={sidebar}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/about" className="hover:text-gray-900">About</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/promise" className="hover:text-gray-900">The Proofr Promise</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Research Vanguard Initiative</span>
        </nav>
        
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg">
            <FlaskConical className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Research Vanguard Initiative
            </h1>
            <p className="text-xl text-gray-600">Defending scientific progress when institutions can't</p>
          </div>
        </div>
      </motion.div>
      
      {/* Overview Section */}
      <section id="overview" className="mb-16">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          In an era of unprecedented cuts to federal research funding, the Research Vanguard Initiative 
          strategically funds university endowments and established grant-making foundations to ensure 
          scientific progress continues. Rather than individual grants, we provide institutional support 
          that multiplies our impact across hundreds of researchers and projects.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Why This Matters Now</h3>
          <p className="text-gray-700 mb-4">
            Federal research funding has faced a 34.2% reduction over the past three years. By channeling 
            funds directly to university research endowments and foundations like the National Science Foundation's 
            partner organizations, we ensure that critical research continues even when government funding falls short. 
            Our institutional approach maximizes impact and reduces administrative overhead.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">67%</div>
              <p className="text-sm text-gray-600">of labs report funding shortfalls</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">23,000+</div>
              <p className="text-sm text-gray-600">research positions eliminated</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">$4.7B</div>
              <p className="text-sm text-gray-600">in research funding lost</p>
            </div>
          </div>
        </div>
        
        <blockquote className="border-l-4 border-blue-600 pl-6 my-8 text-gray-800 italic text-lg">
          "When society stops investing in science, we don't just lose research—we lose the future. 
          The Research Vanguard Initiative ensures that budget sheets don't determine breakthrough discoveries."
          <cite className="block mt-2 text-sm text-gray-600 not-italic">
            — Dr. Sarah Chen, Nobel Laureate & RVI Advisory Board
          </cite>
        </blockquote>
      </section>
      
      {/* The Crisis Section */}
      <section id="crisis" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Funding Crisis</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          The current funding crisis isn't abstract—it's personal. Behind every cut statistic is a researcher 
          forced to abandon their work, a cure delayed, an innovation lost. Here's what we're facing:
        </p>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">NIH Funding Cuts</h3>
                <p className="text-gray-700 mb-3">
                  The National Institutes of Health, America's medical research agency, has seen its budget 
                  slashed by $14.3 billion. This means:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>42% fewer new research grants approved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Critical cancer research programs suspended</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Young investigators unable to start labs</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Brain className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">NSF Budget Reductions</h3>
                <p className="text-gray-700 mb-3">
                  The National Science Foundation has eliminated entire research programs, particularly affecting:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Climate change research (-67% funding)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Basic physics and mathematics research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Computer science and AI safety research</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Human Impact</h3>
                <p className="text-gray-700 mb-3">
                  The real cost is measured in human potential:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>78% of PhD students report considering leaving science</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Undergraduate research opportunities down 84%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Diversity in STEM dropping as opportunities vanish</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-8 p-6 bg-gray-900 text-white rounded-xl">
          <p className="text-lg font-medium">
            This isn't just about today—it's about the next 50 years. The research we abandon now is the 
            technology, medicine, and understanding we won't have when we need it most.
          </p>
        </div>
      </section>
      
      {/* Mission Section */}
      <section id="approach" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Approach</h2>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            The Research Vanguard Initiative takes a strategic institutional approach. Rather than 
            managing individual grants, we fund university endowments and established foundations 
            that have the infrastructure to identify and support the most promising research.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 my-10">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">How We Fund</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Microscope className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>University Endowments:</strong> Direct funding to research-focused universities
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Dna className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Foundation Partnerships:</strong> Supporting established grant-making organizations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Atom className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Research Institutes:</strong> Funding specialized research centers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Multi-year Commitments:</strong> Providing stable, predictable funding
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Principles</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Merit Over Politics:</strong> Science should be judged by quality, not ideology
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Diversity Drives Discovery:</strong> Supporting researchers from all backgrounds
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Risk Enables Reward:</strong> Funding bold ideas others won't touch
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Transparency Builds Trust:</strong> Open about our process and impact
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Commitment</h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Every dollar of profit Proofr makes during the 2025-26 admissions cycle will fund scientific 
            research through the Research Vanguard Initiative. When students succeed through our platform, 
            science succeeds too.
          </p>
        </div>
      </section>
      
      {/* Grant Programs Section */}
      <section id="funding-recipients" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Funding Recipients</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We strategically fund institutions that have proven track records of supporting innovative 
          research and efficiently distributing resources to researchers who need them most.
        </p>
        
        <div className="space-y-8">
          {/* University Endowments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border-2 border-blue-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">University Research Endowments</h3>
              <p className="text-blue-100">Direct funding to university research programs</p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Funding Details</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span>$50,000 - $200,000 per institution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span>Multi-year commitments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Supporting 20-100 researchers each</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Focus Areas</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Medical and life sciences research</li>
                    <li>• Climate and environmental studies</li>
                    <li>• Fundamental physics and mathematics</li>
                    <li>• AI safety and computer science</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Impact:</strong> Stanford&apos;s endowment allocation funded 47 undergraduate research 
                  projects, leading to 12 published papers and 3 provisional patents.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Grant-Making Foundations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border-2 border-green-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Grant-Making Foundations</h3>
              <p className="text-green-100">Supporting established research foundations</p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Partnership Details</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>$100,000 - $500,000 per foundation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span>Unrestricted funding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-600" />
                      <span>Amplifying existing programs</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Partner Types</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• NSF partner organizations</li>
                    <li>• Disease-specific research foundations</li>
                    <li>• STEM diversity foundations</li>
                    <li>• Regional science foundations</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-900">
                  <strong>Impact:</strong> Our partnership with the Research Foundation for Science enabled 
                  them to fund 23 additional early-career investigators this year.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Research Institutes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Research Institutes</h3>
              <p className="text-purple-100">Specialized centers driving breakthrough discoveries</p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Funding Structure</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span>$75,000 - $300,000 per institute</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span>Core operating support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <LineChart className="w-4 h-4 text-purple-600" />
                      <span>3-5 year commitments</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Institute Types</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Cancer research centers</li>
                    <li>• Climate science institutes</li>
                    <li>• AI safety organizations</li>
                    <li>• Rare disease consortiums</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-900">
                  <strong>Impact:</strong> The Institute for Climate Solutions used our funding to launch 
                  a new carbon capture research program, now leading the field.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Community Foundations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border-2 border-orange-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Community & Regional Foundations</h3>
              <p className="text-orange-100">Supporting local research ecosystems</p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Support Structure</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <span>$25,000 - $100,000 per foundation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span>Focus on underserved regions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-orange-600" />
                      <span>Building local capacity</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Priority Areas</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Rural research access</li>
                    <li>• Community college programs</li>
                    <li>• Regional health initiatives</li>
                    <li>• Local environmental studies</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-900">
                  <strong>Impact:</strong> The Appalachian Science Foundation used our funding to create 
                  research opportunities for 150 students in underserved communities.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Eligibility Section */}
      <section id="selection-criteria" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Selection Criteria</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We carefully select institutions and foundations that demonstrate excellence in research 
          support and have proven track records of identifying promising scientific work.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Look For</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Strong research programs in STEM fields
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Commitment to undergraduate research opportunities
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Track record of supporting diverse researchers
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Transparent fund distribution processes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Measurable research outcomes and impact
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Priority Consideration</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Researchers from underrepresented backgrounds
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Projects addressing societal challenges
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Research with clear community impact
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Interdisciplinary collaborations
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  First-time grant applicants
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">No Traditional Funding? We're Here.</h4>
          <p className="text-gray-700">
            If your research has been rejected by traditional funders for being "too risky," "too innovative," 
            or "outside established paradigms," we want to hear from you. Some of our most successful grants 
            have gone to projects other funders wouldn't touch.
          </p>
        </div>
      </section>
      
      {/* Selection Process Section */}
      <section id="selection-process" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Select Partners</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          The Research Vanguard Initiative carefully selects institutional partners through a rigorous 
          evaluation process. Our advisory board identifies institutions that demonstrate excellence in 
          research support and commitment to scientific progress.
        </p>
        
        <div className="space-y-6">
          {[
            {
              step: 1,
              title: 'Institutional Research',
              timeline: 'Ongoing',
              description: 'Our team continuously evaluates universities, foundations, and research institutes',
              details: 'We analyze research output, funding efficiency, and support for diverse researchers'
            },
            {
              step: 2,
              title: 'Advisory Board Review',
              timeline: 'Quarterly',
              description: 'Nobel laureates and National Academy members assess potential partners',
              details: 'Focus on scientific merit, institutional capacity, and alignment with RVI mission'
            },
            {
              step: 3,
              title: 'Due Diligence',
              timeline: '4-6 weeks',
              description: 'Comprehensive evaluation of financial health and research infrastructure',
              details: 'Ensuring funds will be used effectively to support scientific progress'
            },
            {
              step: 4,
              title: 'Partnership Agreement',
              timeline: '2-3 weeks',
              description: 'Multi-year funding commitments with clear impact metrics',
              details: 'Transparent reporting requirements and milestone-based disbursements'
            }
          ].map((phase) => (
            <motion.div
              key={phase.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                  {phase.step}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                    <span className="text-sm text-blue-600 font-medium">{phase.timeline}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{phase.description}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Details:</strong> {phase.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">Strategic Approach</h4>
          <p className="text-gray-700">
            By funding institutions rather than managing individual grants, we multiply our impact while 
            reducing administrative overhead. Every dollar goes further when channeled through organizations 
            with existing infrastructure and expertise.
          </p>
        </div>
      </section>
      
      {/* Impact Stories Section */}
      <section id="impact" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Institutional Impact</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Through strategic institutional funding, the Research Vanguard Initiative has enabled 
          breakthrough discoveries and transformed research ecosystems across the country.
        </p>
        
        <div className="space-y-8">
          {[
            {
              institution: 'Stanford University Endowment',
              funding: '$200,000 over 3 years',
              focus: 'Undergraduate Research Program',
              impact: 'Enabled 47 undergrads to pursue independent research projects. 12 published papers, 3 provisional patents, and 8 students accepted to top PhD programs.',
              quote: 'RVI funding allowed us to say yes to brilliant students whose projects were too ambitious for traditional undergraduate grants.'
            },
            {
              institution: 'Research Foundation for Science',
              funding: '$350,000 unrestricted',
              focus: 'Early Career Investigators',
              impact: 'Funded 23 additional grants to first-time PIs. One recipient discovered a new antibiotic compound now in clinical trials.',
              quote: 'When federal funding cuts hit, we had to reject 40% more applications. RVI\'s support literally saved careers.'
            },
            {
              institution: 'Institute for Climate Solutions',
              funding: '$150,000 core support',
              focus: 'Carbon Capture Research',
              impact: 'Launched new research program that developed breakthrough membrane technology, reducing capture costs by 60%.',
              quote: 'Unrestricted funding let us pursue the high-risk approach that traditional grants wouldn\'t touch.'
            },
            {
              institution: 'Appalachian Science Foundation',
              funding: '$75,000 over 2 years',
              focus: 'Community College Research',
              impact: 'Created research opportunities for 150 students in underserved communities. 30% went on to STEM majors at 4-year institutions.',
              quote: 'RVI understood that talent exists everywhere—it just needs opportunity. They helped us prove it.'
            }
          ].map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-200 transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{story.institution}</h3>
                    <p className="text-sm text-gray-600">{story.funding} • {story.focus}</p>
                  </div>
                  <FlaskConical className="w-6 h-6 text-blue-600" />
                </div>
                
                <p className="text-gray-700 mb-4">{story.impact}</p>
                
                <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-600">
                  "{story.quote}"
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Collective Impact</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-4xl font-bold">23</div>
              <p className="text-blue-100">Partner institutions</p>
            </div>
            <div>
              <div className="text-4xl font-bold">2,847</div>
              <p className="text-blue-100">Researchers supported</p>
            </div>
            <div>
              <div className="text-4xl font-bold">487</div>
              <p className="text-blue-100">Published papers</p>
            </div>
            <div>
              <div className="text-4xl font-bold">$124M</div>
              <p className="text-blue-100">Additional funding unlocked</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section id="partners" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Partners & Supporters</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          The Research Vanguard Initiative is powered by a coalition of individuals and organizations who 
          believe in the power of science to solve humanity's greatest challenges.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advisory Board</h3>
            <p className="text-gray-600 text-sm mb-4">
              12 Nobel laureates and National Academy members guide our grant decisions
            </p>
            <Link href="/promise/research-vanguard/advisory" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Meet our advisors →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">University Partners</h3>
            <p className="text-gray-600 text-sm mb-4">
              47 universities provide matching funds and resources for our grantees
            </p>
            <Link href="/promise/research-vanguard/partners" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View all partners →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Individual Donors</h3>
            <p className="text-gray-600 text-sm mb-4">
              3,400+ individuals support young researchers through monthly giving
            </p>
            <Link href="/promise/research-vanguard/donate" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Join them →
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Join the Movement</h3>
          <p className="text-gray-700 mb-4">
            If you represent a university, foundation, or research institute interested in partnering 
            with RVI, or if you&apos;re an individual who wants to support science, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/promise/research-vanguard/institutional-partners"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Institutional Partnership
            </Link>
            <Link 
              href="/promise/research-vanguard/donate"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Individual Support
            </Link>
          </div>
        </div>
      </section>
      
      {/* Apply Section */}
      <section id="apply" className="mb-16">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Research Matters. We're Here to Fund It.
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't let funding cuts stop your breakthrough. Apply for a Research Vanguard Initiative grant 
            and join thousands of researchers who refused to let budget sheets determine the future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/promise/research-vanguard/apply"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Apply for Funding
            </Link>
            <Link
              href="/promise/research-vanguard/guidelines"
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors"
            >
              Review Guidelines
            </Link>
          </div>
          
          <p className="text-sm text-blue-200">
            Applications reviewed monthly • Decisions within 30 days • No bureaucracy
          </p>
        </div>
      </section>
      
      {/* Final Quote */}
      <section className="mt-16 mb-8">
        <blockquote className="text-center">
          <p className="text-2xl text-gray-800 font-light italic mb-4">
            "In a time when institutions are failing science, we must become the institution science needs."
          </p>
          <cite className="text-gray-600">
            — The Research Vanguard Initiative Mission Statement
          </cite>
        </blockquote>
      </section>
    </PromiseLayout>
}