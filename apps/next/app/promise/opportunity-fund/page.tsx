'use client'

import { PromiseLayout } from '../components/PromiseLayout'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  DollarSign,
  Heart,
  Shield,
  Calculator,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  BookOpen,
  Sparkles,
  ChevronRight,
  CreditCard,
  Receipt,
  BarChart3,
  HandHeart
} from 'lucide-react'

export default function OpportunityFundPage() {
  const [activeSection, setActiveSection] = useState('')
  const [totalDistributed, setTotalDistributed] = useState(0)
  
  // Animate total distributed counter
  useEffect(() => {
    const target = 421000
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setTotalDistributed(target)
        clearInterval(timer)
      } else {
        setTotalDistributed(Math.floor(current))
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
            { id: 'philosophy', label: 'Breaking Financial Barriers' },
            { id: 'what-we-cover', label: 'What We Cover' },
            { id: 'eligibility', label: 'Who Qualifies' },
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'impact-stories', label: 'Student Stories' },
            { id: 'transparency', label: 'Fund Transparency' },
            { id: 'apply', label: 'Apply for Assistance' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                block py-1.5 px-3 text-sm rounded-lg transition-all
                ${activeSection === item.id 
                  ? 'text-green-700 bg-green-50 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      
      {/* Fund Stats */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Fund Impact</h3>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-green-700">
              ${totalDistributed.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">Total distributed</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">3,421</div>
            <p className="text-xs text-gray-600">Students supported</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">$123</div>
            <p className="text-xs text-gray-600">Average grant size</p>
          </div>
        </div>
      </div>
      
      {/* Quick Apply */}
      <div className="sticky bottom-0 bg-white pb-4">
        <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all">
          Apply for Assistance
        </button>
      </div>
    </div>
  );
  
  return <PromiseLayout currentProgram="opportunity-fund" sidebar={sidebar}>
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
          <span className="text-gray-900 font-medium">Opportunity Fund</span>
        </nav>
        
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Opportunity Fund
            </h1>
            <p className="text-xl text-gray-600">Direct cash assistance when you need it most</p>
          </div>
        </div>
      </motion.div>
      
      {/* Overview Section */}
      <section id="overview" className="mb-16">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The Opportunity Fund provides direct financial assistance to low-income students facing 
          immediate financial barriers in their college application journey. No lengthy applications, 
          no waiting months for approval—just quick, compassionate support when you need it most.
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How We&apos;re Different</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Direct Payments</h4>
              <p className="text-sm text-gray-600">
                Cash sent directly to you or paid to vendors on your behalf
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Quick Decisions</h4>
              <p className="text-sm text-gray-600">
                Most applications approved within 48-72 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">No Strings Attached</h4>
              <p className="text-sm text-gray-600">
                Grants, not loans. No repayment ever required
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-green-900 text-white rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-2">Emergency Fast Track</h4>
          <p className="text-green-100">
            Facing an urgent deadline? Our emergency track can approve and disburse funds within 
            24 hours for time-sensitive needs like application deadlines or test registrations.
          </p>
        </div>
      </section>
      
      {/* Philosophy Section */}
      <section id="philosophy" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Breaking Financial Barriers</h2>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            We know that for low-income families, even small costs can derail college dreams. A $75 
            application fee might mean choosing between applying to your dream school and putting 
            food on the table. A $200 test prep book could require months of saving.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-8">
            The Opportunity Fund exists because we believe that no student should have to choose 
            between basic needs and their educational future. We provide cash assistance quickly 
            and with dignity, trusting students to use funds for what they need most.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 my-10">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trust-Based Giving</h3>
              <p className="text-gray-700 mb-4">
                We trust you to know what you need. While we ask how you plan to use funds, we 
                don&apos;t require receipts or proof of purchase. Your word is enough.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">No invasive documentation required</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Simple self-certification process</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Respect for your privacy and dignity</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Holistic Support</h3>
              <p className="text-gray-700 mb-4">
                Money alone doesn&apos;t solve everything. Opportunity Fund recipients also get 
                access to all Proofr Promise programs and resources.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Automatic consideration for other programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Priority access to consultants</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Ongoing support through college</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <blockquote className="border-l-4 border-green-600 pl-6 my-8 text-gray-800 italic text-lg">
          &ldquo;Poverty is not a lack of character; it is a lack of cash. We provide cash because 
          we trust students to make the best decisions for their own lives.&rdquo;
          <cite className="block mt-2 text-sm text-gray-600 not-italic">
            — Sarah Chen, Opportunity Fund Director
          </cite>
        </blockquote>
      </section>
      
      {/* What We Cover Section */}
      <section id="what-we-cover" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Cover</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          The Opportunity Fund can help with any expense related to your college application journey. 
          Here are the most common uses:
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              category: 'Application Fees',
              icon: Receipt,
              items: [
                'College application fees ($50-100 each)',
                'CSS Profile fees ($25 + $16/school)',
                'Transcript sending fees',
                'Score report fees'
              ],
              typical: '$75-500'
            },
            {
              category: 'Test Costs',
              icon: Calculator,
              items: [
                'SAT/ACT registration ($60-85)',
                'AP exam fees ($95/exam)',
                'Test prep materials',
                'Transportation to test centers'
              ],
              typical: '$100-400'
            },
            {
              category: 'Technology Needs',
              icon: BookOpen,
              items: [
                'Laptop or tablet for applications',
                'Internet connectivity',
                'Printer access for forms',
                'Software subscriptions'
              ],
              typical: '$200-800'
            },
            {
              category: 'Interview Expenses',
              icon: Users,
              items: [
                'Professional clothing',
                'Transportation costs',
                'Overnight accommodation',
                'Meal expenses'
              ],
              typical: '$100-500'
            },
            {
              category: 'Documentation',
              icon: Shield,
              items: [
                'Document translation',
                'Notarization fees',
                'Credential evaluation',
                'Visa application fees'
              ],
              typical: '$50-300'
            },
            {
              category: 'Emergency Needs',
              icon: AlertCircle,
              items: [
                'Family crisis support',
                'Housing instability',
                'Food insecurity',
                'Medical emergencies'
              ],
              typical: 'Varies'
            }
          ].map((expense, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <expense.icon className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">{expense.category}</h3>
              </div>
              <ul className="space-y-2 mb-4">
                {expense.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-green-600">
                Typical grant: {expense.typical}
              </p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Not Sure If We Cover It?</h4>
          <p className="text-gray-700">
            If it&apos;s related to your education and you can&apos;t afford it, apply anyway. 
            We&apos;ve covered everything from graphing calculators to bus passes to campus visits. 
            Your education matters more than our categories.
          </p>
        </div>
      </section>
      
      {/* Eligibility Section */}
      <section id="eligibility" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Who Qualifies</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We use a simple, trust-based system. If you&apos;re facing financial barriers to your 
          college dreams, you likely qualify.
        </p>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Requirements</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-900">High school student or recent graduate</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Planning to apply to college within the next year
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-900">Financial need</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Family income typically under $60,000, but we consider all circumstances
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-900">Specific expense identified</span>
                  <p className="text-sm text-gray-600 mt-1">
                    You know what you need the money for and how it helps your college journey
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Priority Consideration</h3>
            <p className="text-gray-700 mb-4">
              While we try to help everyone, we give priority to:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">First-generation college students</span>
              </li>
              <li className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Students experiencing homelessness or foster care</span>
              </li>
              <li className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Undocumented students</span>
              </li>
              <li className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Students supporting family members</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2">Income Flexibility</h4>
            <p className="text-gray-700">
              Don&apos;t let the $60,000 guideline stop you from applying. We consider family size, 
              location, medical expenses, and other factors. A family of 6 making $80,000 in San 
              Francisco faces different challenges than a family of 2 making $40,000 in rural Kansas.
            </p>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We&apos;ve designed our process to be as simple and stress-free as possible. No essays 
          about overcoming adversity, no proving you&apos;re &ldquo;worthy&rdquo;—just tell us what you need.
        </p>
        
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Submit Simple Application',
              time: '10 minutes',
              description: 'Basic information, what you need, and a brief explanation of how it helps.',
              icon: BookOpen
            },
            {
              step: 2,
              title: 'Quick Review',
              time: '48-72 hours',
              description: 'Our team reviews your request. We may reach out if we need clarification.',
              icon: Users
            },
            {
              step: 3,
              title: 'Receive Decision',
              time: 'Email notification',
              description: 'You&apos;ll receive an approval with next steps or suggestions for other resources.',
              icon: CheckCircle
            },
            {
              step: 4,
              title: 'Get Your Funds',
              time: '2-5 business days',
              description: 'Money sent via Venmo, Zelle, check, or paid directly to vendors.',
              icon: DollarSign
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
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <phase.icon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Step {phase.step}: {phase.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{phase.time}</p>
                <p className="text-gray-700">{phase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Payment Methods</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Venmo or Zelle (fastest)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Direct deposit to bank account</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Paper check by mail</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Direct payment to vendors</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Grant Amounts</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Typical grant: $50-$300</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Maximum single grant: $1,000</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Can apply multiple times</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Emergency funds available</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Impact Stories Section */}
      <section id="impact-stories" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Student Stories</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Every grant represents a barrier removed, a dream kept alive. Here are some stories from 
          Opportunity Fund recipients.
        </p>
        
        <div className="space-y-6">
          {[
            {
              name: 'Jennifer M.',
              location: 'Rural Texas',
              amount: '$285',
              use: 'SAT registration and prep book',
              story: 'My parents work in agriculture and money is always tight, especially during off-season. The Opportunity Fund covered my SAT fees and a prep book.',
              outcome: 'Scored 1480, accepted to Rice University with full aid',
              quote: 'That $285 changed my entire future. Without it, I never would have taken the SAT.'
            },
            {
              name: 'Carlos R.',
              location: 'Los Angeles, CA',
              amount: '$450',
              use: 'Application fees for 6 schools',
              story: 'As an undocumented student, I don&apos;t qualify for fee waivers. My mom cleans houses and couldn&apos;t afford application fees.',
              outcome: 'Accepted to UCLA, UC Berkeley, and Stanford',
              quote: 'They didn&apos;t just give me money—they gave me dignity and hope.'
            },
            {
              name: 'Destiny K.',
              location: 'Detroit, MI',
              amount: '$175',
              use: 'Interview outfit and transportation',
              story: 'I got an interview at Northwestern but had nothing professional to wear and no way to get there. The fund covered both.',
              outcome: 'Full scholarship to Northwestern',
              quote: 'I walked into that interview feeling confident because I looked the part.'
            },
            {
              name: 'Ahmed S.',
              location: 'Minneapolis, MN',
              amount: '$320',
              use: 'Laptop repair and internet',
              story: 'My laptop died two weeks before applications were due. My family had just arrived as refugees and had no savings.',
              outcome: 'Submitted all applications on time, now at MIT',
              quote: 'They responded within 24 hours. I cried when the money came through.'
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
                    <p className="text-gray-600">{story.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{story.amount}</p>
                    <p className="text-sm text-gray-600">{story.use}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{story.story}</p>
                
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-green-900">Outcome:</p>
                  <p className="text-sm text-green-700">{story.outcome}</p>
                </div>
                
                <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-600">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Transparency Section */}
      <section id="transparency" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Fund Transparency</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We believe in complete transparency about how donations are used. Every dollar is tracked 
          and reported publicly.
        </p>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">2024 Fund Allocation</h3>
          <div className="space-y-4">
            {[
              { category: 'Direct Student Grants', percentage: 92, amount: '$387,320' },
              { category: 'Payment Processing Fees', percentage: 3, amount: '$12,630' },
              { category: 'Emergency Reserve', percentage: 3, amount: '$12,630' },
              { category: 'Administration', percentage: 2, amount: '$8,420' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
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
                <p className="text-sm text-gray-600 mt-1">{item.percentage}% of total funds</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center"
          >
            <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Average Grant Size</h4>
            <p className="text-3xl font-bold text-green-700">$123</p>
            <p className="text-sm text-gray-600 mt-1">Per student</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center"
          >
            <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Students Helped</h4>
            <p className="text-3xl font-bold text-green-700">3,421</p>
            <p className="text-sm text-gray-600 mt-1">This year</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center"
          >
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Success Rate</h4>
            <p className="text-3xl font-bold text-green-700">94%</p>
            <p className="text-sm text-gray-600 mt-1">College acceptance</p>
          </motion.div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-4">
            Want to see detailed financial reports and impact metrics?
          </p>
          <Link
            href="/promise/transparency"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            View Full Transparency Report
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      
      {/* Apply Section */}
      <section id="apply" className="mb-16">
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Apply?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl">
            Don&apos;t let financial barriers stop your college dreams. Apply today and get a 
            decision within 48-72 hours.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-700/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Regular Application</h4>
              <p className="text-green-100 text-sm mb-3">
                For planned expenses like application fees, test registration, or materials
              </p>
              <p className="text-xs text-green-200">Decision in 48-72 hours</p>
            </div>
            <div className="bg-green-700/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Emergency Fast Track</h4>
              <p className="text-green-100 text-sm mb-3">
                For urgent needs with deadlines in the next 48 hours
              </p>
              <p className="text-xs text-green-200">Decision in 24 hours</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/promise/opportunity-fund/apply"
              className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all text-center"
            >
              Start Application
            </Link>
            <Link
              href="/promise/opportunity-fund/emergency"
              className="px-8 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors text-center"
            >
              Emergency Application
            </Link>
          </div>
        </div>
      </section>
      
      {/* Support Section */}
      <section className="mb-16">
        <div className="bg-green-50 rounded-xl p-8 text-center">
          <HandHeart className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Funded by People Who Care
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            The Opportunity Fund is powered entirely by donations from individuals and organizations 
            who believe in education equity. Every dollar donated goes directly to students in need.
          </p>
          <Link
            href="/promise/donate"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Support the Fund
            <Heart className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PromiseLayout>
}