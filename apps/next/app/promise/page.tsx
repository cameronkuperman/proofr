'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  GraduationCap, 
  FlaskConical, 
  BookOpen, 
  Users,
  DollarSign,
  ChevronRight,
  Heart,
  Target,
  Shield,
  BarChart3,
  Globe,
  Sparkles
} from 'lucide-react'
import { NavigationBar } from 'app/features/landing/components/NavigationBar'

const programs = [
  {
    id: 'pinnacle-scholars',
    title: 'Pinnacle Scholars',
    subtitle: 'Merit-based excellence program',
    description: 'Supporting high-achieving students with comprehensive college consulting services worth $5,000+',
    icon: GraduationCap,
    color: 'purple',
    gradient: 'from-purple-600 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    stats: '847 scholars supported',
    href: '/promise/pinnacle-scholars'
  },
  {
    id: 'opportunity-fund',
    title: 'Opportunity Fund',
    subtitle: 'Direct financial assistance',
    description: 'Cash grants for low-income students to cover application fees, test prep, and essential resources',
    icon: DollarSign,
    color: 'green',
    gradient: 'from-green-600 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    stats: '$421K distributed',
    href: '/promise/opportunity-fund'
  },
  {
    id: 'research-vanguard',
    title: 'Research Vanguard Initiative',
    subtitle: 'Defending scientific progress',
    description: 'Strategic funding to university endowments and research foundations to support STEM research',
    icon: FlaskConical,
    color: 'blue',
    gradient: 'from-blue-600 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    stats: '23 institutions funded',
    href: '/promise/research-vanguard'
  },
  {
    id: 'access-academy',
    title: 'Access Academy',
    subtitle: 'Free resources for all',
    description: 'Comprehensive guides, tools, and peer advice available to every student, regardless of ability to pay',
    icon: BookOpen,
    color: 'teal',
    gradient: 'from-teal-600 to-cyan-600',
    bgGradient: 'from-teal-50 to-cyan-50',
    stats: '50K+ students helped',
    href: '/promise/access-academy'
  },
  {
    id: 'community-champions',
    title: 'Community Champions',
    subtitle: 'Local leaders, global impact',
    description: 'Supporting students who are already making a difference in their communities',
    icon: Users,
    color: 'orange',
    gradient: 'from-orange-600 to-amber-600',
    bgGradient: 'from-orange-50 to-amber-50',
    stats: '1,234 champions',
    href: '/promise/community-champions'
  }
]

export default function ProofrPromisePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
              The Proofr Promise
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
              Our commitment to making elite college admissions accessible to every deserving student, 
              regardless of their financial circumstances.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/promise/apply" 
                className="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Apply Now
              </Link>
              <Link 
                href="/promise/transparency" 
                className="px-8 py-4 bg-purple-800 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
              >
                View Transparency Report
              </Link>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-4 gap-8 mt-16"
          >
            {[
              { number: '12,847', label: 'Students Supported' },
              { number: '$8.3M', label: 'In Aid Distributed' },
              { number: '487', label: 'Partner Organizations' },
              { number: '98.7%', label: 'Success Rate' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Education Equity Through Action
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We believe that a student&apos;s potential should never be limited by their family&apos;s 
              income. The Proofr Promise is our commitment to breaking down financial barriers that 
              prevent talented students from accessing the college admissions support they deserve.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Through five targeted programs, we provide everything from direct financial assistance 
              to comprehensive consulting services, ensuring that every student has the tools they 
              need to succeed.
            </p>
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">100% Transparent</h3>
                <p className="text-gray-600">Every dollar tracked and reported publicly</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Core Values</h3>
            <div className="space-y-4">
              {[
                { icon: Heart, title: 'Accessibility', desc: 'No student turned away for inability to pay' },
                { icon: Target, title: 'Excellence', desc: 'High-quality support that rivals paid services' },
                { icon: Globe, title: 'Inclusivity', desc: 'Programs for every background and situation' },
                { icon: BarChart3, title: 'Accountability', desc: 'Transparent reporting and measurable impact' }
              ].map((value, i) => (
                <div key={i} className="flex gap-4">
                  <value.icon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{value.title}</h4>
                    <p className="text-gray-600 text-sm">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Programs Grid */}
      <section id="programs" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Five Programs, One Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each program addresses a specific barrier that prevents talented students from 
              reaching their full potential.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, i) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={program.href}
                  className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-xl transition-all h-full"
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${program.bgGradient} mb-4`}>
                    <program.icon className={`w-6 h-6 text-${program.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{program.title}</h3>
                  <p className={`text-sm font-medium text-${program.color}-600 mb-3`}>{program.subtitle}</p>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-medium text-gray-500">{program.stats}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Impact, Real Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Behind every number is a student whose life has been transformed by the Proofr Promise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I never thought Harvard was possible for someone like me. The Opportunity Fund covered my application fees and the Pinnacle Scholars program guided me every step of the way.",
                author: "Maria S.",
                details: "First-gen student, Harvard &apos;28",
                gradient: "from-purple-600 to-indigo-600"
              },
              {
                quote: "When federal funding was cut, RVI stepped in to fund our research endowment. This allowed us to support 47 undergraduate researchers who otherwise would have lost their opportunities.",
                author: "Dr. James Chen",
                details: "Stanford Research Director",
                gradient: "from-blue-600 to-cyan-600"
              },
              {
                quote: "As a Community Champion, I got support not just for college apps but for scaling my nonprofit. Proofr understood that my community work was my strength.",
                author: "Aisha P.",
                details: "Community Champion, Yale &apos;27",
                gradient: "from-orange-600 to-amber-600"
              }
            ].map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${story.gradient} mb-4`} />
                <blockquote className="text-gray-700 mb-4">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-gray-900">{story.author}</p>
                  <p className="text-sm text-gray-600">{story.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How to Apply */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Apply?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            All Proofr Promise programs are open for applications year-round. We review applications 
            on a rolling basis to ensure timely support.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { step: '1', title: 'Choose Your Program', desc: 'Select the program that best fits your needs and situation' },
              { step: '2', title: 'Submit Application', desc: 'Complete a simple application with basic information and essays' },
              { step: '3', title: 'Get Support', desc: 'Receive a decision within 2-3 weeks and start your journey' }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white text-purple-900 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-purple-200">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <Link
            href="/promise/apply"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Start Your Application
            <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-4">
            Want to support the Proofr Promise? Learn how you can help us reach more students.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/promise/donate"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Make a Donation
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/promise/partner"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Become a Partner
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/promise/transparency"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View Our Transparency Report
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}