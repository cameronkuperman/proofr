'use client'

import { PromiseLayout } from '../components/PromiseLayout'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  GraduationCap, 
  Trophy, 
  Target, 
  Calculator,
  CheckCircle,
  Calendar,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

export default function PinnacleScholarsPage() {
  const [activeSection, setActiveSection] = useState('')
  const [scholarCount, setScholarCount] = useState(0)
  
  // Animate scholar counter
  useEffect(() => {
    const target = 847
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setScholarCount(target)
        clearInterval(timer)
      } else {
        setScholarCount(Math.floor(current))
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
            { id: 'philosophy', label: 'Our Philosophy' },
            { id: 'eligibility', label: 'Eligibility Criteria' },
            { id: 'selection-process', label: 'Selection Process' },
            { id: 'benefits', label: 'Scholar Benefits' },
            { id: 'success-stories', label: 'Success Stories' },
            { id: 'application', label: 'How to Apply' },
            { id: 'faq', label: 'Frequently Asked Questions' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                block py-1.5 px-3 text-sm rounded-lg transition-all
                ${activeSection === item.id 
                  ? 'text-purple-700 bg-purple-50 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      
      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Program Impact</h3>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-purple-700">{scholarCount}</div>
            <p className="text-xs text-gray-600">Scholars supported</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-700">98.7%</div>
            <p className="text-xs text-gray-600">College acceptance rate</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-700">$3.2M</div>
            <p className="text-xs text-gray-600">In scholarships awarded</p>
          </div>
        </div>
      </div>
      
      {/* Apply Button */}
      <div className="sticky bottom-0 bg-white pb-4">
        <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all">
          Check Your Eligibility
        </button>
      </div>
    </div>
  );
  
  return <PromiseLayout currentProgram="pinnacle-scholars" sidebar={sidebar}>
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
          <span className="text-gray-900 font-medium">Pinnacle Scholars</span>
        </nav>
        
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Pinnacle Scholars
            </h1>
            <p className="text-xl text-gray-600">Merit-based support for exceptional students</p>
          </div>
        </div>
      </motion.div>
      
      {/* Overview Section */}
      <section id="overview" className="mb-16">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The Pinnacle Scholars program recognizes and supports high-achieving students who demonstrate 
          exceptional academic performance, leadership potential, and a commitment to making a positive 
          impact on their communities. We believe that financial constraints should never limit the 
          potential of brilliant minds.
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Program Highlights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Elite Mentorship</h4>
              <p className="text-sm text-gray-600">
                One-on-one guidance from consultants at top 20 universities
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Comprehensive Support</h4>
              <p className="text-sm text-gray-600">
                Full access to all Proofr services worth $5,000+
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Proven Results</h4>
              <p className="text-sm text-gray-600">
                98.7% acceptance rate to top choice schools
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Philosophy Section */}
      <section id="philosophy" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Philosophy</h2>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            At Pinnacle Scholars, we believe that merit transcends socioeconomic boundaries. Too often, 
            brilliant students from modest backgrounds are overshadowed not by lack of ability, but by 
            lack of access to resources that affluent families take for granted.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-8">
            We exist to level that playing field. Our program identifies students who have already proven 
            their excellence despite limited resources, and provides them with the same advantages enjoyed 
            by their more privileged peers.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 my-10">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Merit, Not Wealth</h3>
              <p className="text-gray-700 mb-4">
                Your family&apos;s income should not determine your access to top universities. We evaluate 
                students based on their achievements relative to their opportunities.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Academic excellence in context</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Leadership despite limited resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Resilience and determination</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Beyond Admissions</h3>
              <p className="text-gray-700 mb-4">
                Our support extends beyond just getting you admitted. We prepare you to thrive once 
                you arrive on campus.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Academic preparation strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Financial aid maximization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Campus integration support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Eligibility Section */}
      <section id="eligibility" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Eligibility Criteria</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We look for students who have demonstrated exceptional achievement relative to their 
          circumstances. There&apos;s no single formula—we evaluate each applicant holistically.
        </p>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Academic Requirements</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Calculator className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-900">GPA of 3.7+ (unweighted)</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Or top 10% of your class. We consider grade inflation/deflation at your school.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-900">Rigorous Course Load</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Taking the most challenging courses available at your school.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-900">Standardized Test Scores</span>
                  <p className="text-sm text-gray-600 mt-1">
                    SAT 1450+ or ACT 32+ preferred, but we consider test-optional applicants.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Requirements</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Family income under $75,000 (automatic qualification)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Family income $75,000-$150,000 (considered with additional factors)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Special circumstances (medical bills, multiple siblings in college, etc.)
                </span>
              </li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2">Note on Eligibility</h4>
            <p className="text-gray-700">
              These are guidelines, not rigid requirements. We strongly encourage you to apply if you 
              believe you would benefit from our support. Many of our scholars didn&apos;t think they 
              qualified until they applied.
            </p>
          </div>
        </div>
      </section>
      
      {/* Selection Process Section */}
      <section id="selection-process" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Selection Process</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Our selection process is designed to identify students who will make the most of this 
          opportunity. We look beyond numbers to understand your story and potential.
        </p>
        
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Initial Application',
              timeline: '30 minutes',
              description: 'Submit basic information, transcripts, and a brief essay about your goals.',
              icon: Calendar
            },
            {
              step: 2,
              title: 'Comprehensive Review',
              timeline: '2-3 weeks',
              description: 'Our team evaluates your academic achievements in context of your opportunities.',
              icon: Users
            },
            {
              step: 3,
              title: 'Virtual Interview',
              timeline: '45 minutes',
              description: 'Semi-finalists participate in a conversational interview with program alumni.',
              icon: Award
            },
            {
              step: 4,
              title: 'Final Selection',
              timeline: '1 week',
              description: 'Selection committee makes final decisions based on holistic evaluation.',
              icon: Trophy
            }
          ].map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <phase.icon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Step {phase.step}: {phase.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{phase.timeline}</p>
                <p className="text-gray-700">{phase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
          <p className="text-gray-700">
            We run three selection cycles per year: Early (September), Regular (January), and Late (April). 
            Apply as early as possible for the best chance of selection.
          </p>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Scholar Benefits</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Pinnacle Scholars receive comprehensive support valued at over $5,000, designed to give you 
          every advantage in the college admissions process.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              category: 'Application Support',
              items: [
                'Unlimited essay reviews and editing',
                'School list optimization strategy',
                'Application timeline management',
                'Recommendation letter guidance'
              ],
              value: '$2,000'
            },
            {
              category: 'Test Preparation',
              items: [
                'Full SAT/ACT prep course access',
                'Unlimited practice tests',
                'One-on-one tutoring sessions',
                'Score improvement guarantee'
              ],
              value: '$1,500'
            },
            {
              category: 'Interview Coaching',
              items: [
                'Mock interviews with alumni',
                'Personalized feedback reports',
                'School-specific preparation',
                'Confidence building workshops'
              ],
              value: '$800'
            },
            {
              category: 'Ongoing Mentorship',
              items: [
                'Weekly check-ins with mentor',
                'College transition support',
                'Scholarship search assistance',
                'Career planning guidance'
              ],
              value: '$1,200'
            }
          ].map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{benefit.category}</h3>
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {benefit.value} value
                </span>
              </div>
              <ul className="space-y-2">
                {benefit.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 bg-purple-900 text-white rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-2">Lifetime Alumni Network</h4>
          <p className="text-purple-100">
            Join a community of 800+ Pinnacle Scholars alumni at top universities and companies. 
            This network provides ongoing mentorship, internship opportunities, and career connections 
            that last well beyond college admissions.
          </p>
        </div>
      </section>
      
      {/* Success Stories Section */}
      <section id="success-stories" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Success Stories</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Our scholars prove that with the right support, any student can reach the pinnacle of 
          academic achievement. Here are just a few of their stories.
        </p>
        
        <div className="space-y-6">
          {[
            {
              name: 'Maria Rodriguez',
              school: 'Stanford University',
              hometown: 'East Los Angeles, CA',
              story: 'First-generation college student from a single-parent household',
              quote: 'Pinnacle Scholars didn\'t just help me get into Stanford—they helped me believe I belonged there.',
              stats: 'GPA: 3.9 | SAT: 1480 | Now: CS Major, Google Intern'
            },
            {
              name: 'James Chen',
              school: 'MIT',
              hometown: 'Rural Mississippi',
              story: 'Son of immigrant restaurant workers, attended under-resourced high school',
              quote: 'My mentor understood my background and helped me tell my story authentically.',
              stats: 'GPA: 4.0 | ACT: 34 | Now: Aerospace Engineering, NASA Scholar'
            },
            {
              name: 'Aisha Patel',
              school: 'Yale University',
              hometown: 'Detroit, MI',
              story: 'Overcame health challenges while maintaining academic excellence',
              quote: 'The test prep alone saved my family thousands of dollars we didn\'t have.',
              stats: 'GPA: 3.8 | SAT: 1520 | Now: Pre-Med, Research Published'
            }
          ].map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-purple-600 font-medium">{story.school}</p>
                    <p className="text-sm text-gray-600">{story.hometown}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                </div>
                
                <p className="text-gray-700 mb-4">{story.story}</p>
                
                <blockquote className="border-l-4 border-purple-500 pl-4 mb-4">
                  <p className="italic text-gray-600">&ldquo;{story.quote}&rdquo;</p>
                </blockquote>
                
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {story.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/promise/pinnacle-scholars/alumni" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            Read more scholar stories
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      
      {/* Application Section */}
      <section id="application" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Apply</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Ready to join the ranks of Pinnacle Scholars? The application process is straightforward 
          and designed to showcase your achievements and potential.
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Application Requirements</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Official transcript</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Test scores (if available)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Financial information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">One teacher recommendation</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Essay Questions</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Your academic journey (500 words)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Biggest challenge overcome (300 words)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Future goals and impact (300 words)</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Pro tip:</strong> Start your application early! You can save your progress and 
              return later. Many successful applicants spend 2-3 weeks perfecting their essays.
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            {
              question: 'Is Pinnacle Scholars really free?',
              answer: 'Yes! Selected scholars receive all benefits at no cost. We are funded by alumni donations and partner organizations who believe in our mission.'
            },
            {
              question: 'Can international students apply?',
              answer: 'Yes! Pinnacle Scholars is open to international students who plan to apply to US universities. We have specific resources to help with the unique challenges international applicants face.'
            },
            {
              question: 'What if my GPA is slightly below 3.7?',
              answer: 'We evaluate applications holistically. If you have a compelling reason for your GPA (family responsibilities, health challenges, limited opportunities at your school), please explain in your application.'
            },
            {
              question: 'How competitive is the selection process?',
              answer: 'We typically accept 15-20% of applicants. However, we encourage all eligible students to apply—many of our scholars were surprised to be selected.'
            },
            {
              question: 'What\'s the time commitment?',
              answer: 'Scholars typically spend 2-4 hours per week working with their mentors and using program resources. The commitment is flexible around your schedule.'
            },
            {
              question: 'Can I reapply if I\'m not selected?',
              answer: 'Absolutely! Many of our current scholars applied more than once. We provide feedback to all finalists to help strengthen future applications.'
            }
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Reach Your Pinnacle?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Don&apos;t let financial barriers stop you from reaching your full potential. Join hundreds of 
            Pinnacle Scholars who are now thriving at top universities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/promise/pinnacle-scholars/apply"
              className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Start Your Application
            </Link>
            <Link
              href="/promise/pinnacle-scholars/info-session"
              className="px-8 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors"
            >
              Attend Info Session
            </Link>
          </div>
        </div>
      </section>
    </PromiseLayout>
}