'use client'

import { PromiseLayout } from '../components/PromiseLayout'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users,
  Heart,
  Globe,
  Sparkles,
  Target,
  Award,
  HandHeart,
  Building,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  MapPin,
  Megaphone,
  Rocket,
  TreePine,
  BookOpen
} from 'lucide-react'

export default function CommunityChampionsPage() {
  const [activeSection, setActiveSection] = useState('')
  const [championsCount, setChampionsCount] = useState(0)
  
  // Animate champions counter
  useEffect(() => {
    const target = 1234
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setChampionsCount(target)
        clearInterval(timer)
      } else {
        setChampionsCount(Math.floor(current))
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
            { id: 'philosophy', label: 'Local Roots, Global Impact' },
            { id: 'pathways', label: 'Champion Pathways' },
            { id: 'support', label: 'What We Provide' },
            { id: 'impact-stories', label: 'Community Impact' },
            { id: 'eligibility', label: 'Who Can Apply' },
            { id: 'partners', label: 'Community Partners' },
            { id: 'apply', label: 'Become a Champion' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                block py-1.5 px-3 text-sm rounded-lg transition-all
                ${activeSection === item.id 
                  ? 'text-orange-700 bg-orange-50 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      
      {/* Impact Stats */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Community Impact</h3>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-orange-700">{championsCount}</div>
            <p className="text-xs text-gray-600">Champions supported</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-700">487</div>
            <p className="text-xs text-gray-600">Communities transformed</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-700">2.3M</div>
            <p className="text-xs text-gray-600">Lives impacted</p>
          </div>
        </div>
      </div>
      
      {/* Apply Button */}
      <div className="sticky bottom-0 bg-white pb-4">
        <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all">
          Apply to Be a Champion
        </button>
      </div>
    </div>
  );
  
  return <PromiseLayout currentProgram="community-champions" sidebar={sidebar}>
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
          <span className="text-gray-900 font-medium">Community Champions</span>
        </nav>
        
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Community Champions
            </h1>
            <p className="text-xl text-gray-600">Supporting local leaders creating global change</p>
          </div>
        </div>
      </motion.div>
      
      {/* Overview Section */}
      <section id="overview" className="mb-16">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The Community Champions program recognizes a fundamental truth: the most transformative change 
          often starts in our own backyards. We support students who are already making a difference in 
          their communities, providing them with the resources to amplify their impact while pursuing 
          higher education.
        </p>
        
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">What Makes a Community Champion?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Local Impact</h4>
              <p className="text-sm text-gray-600">
                Creating tangible change in their immediate community
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Scalable Solutions</h4>
              <p className="text-sm text-gray-600">
                Ideas that can grow beyond their origin
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Service Heart</h4>
              <p className="text-sm text-gray-600">
                Genuine commitment to helping others succeed
              </p>
            </div>
          </div>
        </div>
        
        <blockquote className="border-l-4 border-orange-600 pl-6 my-8 text-gray-800 italic text-lg">
          "We don't need to wait for tomorrow's leaders. They're already here, in our communities, 
          solving problems with creativity and compassion. We just need to give them the tools to soar."
          <cite className="block mt-2 text-sm text-gray-600 not-italic">
            — Maya Patel, Community Champions Founder
          </cite>
        </blockquote>
      </section>
      
      {/* Philosophy Section */}
      <section id="philosophy" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Local Roots, Global Impact</h2>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            Too often, we look to distant capitals and ivory towers for solutions to our problems. But the 
            most innovative answers frequently come from young people who deeply understand their community's 
            challenges because they live them every day.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-8">
            Community Champions are students who have already demonstrated the courage to act, the wisdom 
            to listen, and the persistence to create lasting change. They're tutoring kids in library 
            basements, organizing food drives in parking lots, building apps to connect neighbors, and 
            turning abandoned lots into gardens.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 my-10">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">The Multiplier Effect</h3>
              <p className="text-gray-700 mb-4">
                When we support one Community Champion, we're not just helping one student—we're investing 
                in an entire community's future. Our Champions:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Create programs that outlast their involvement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Inspire others to take action</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Return to serve their communities after college</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Beyond Charity</h3>
              <p className="text-gray-700 mb-4">
                This isn't about charity—it's about recognizing that community leaders deserve the same 
                opportunities as any other high achiever. We provide:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Recognition for community service as excellence</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Resources to scale their impact</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Networks to share solutions globally</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pathways Section */}
      <section id="pathways" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Champion Pathways</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We recognize that community leadership takes many forms. Our program supports Champions across 
          diverse pathways, each making unique contributions to their communities.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: 'Education Innovators',
              icon: BookOpen,
              examples: [
                'After-school tutoring programs',
                'Literacy initiatives',
                'STEM workshops for underserved youth',
                'College prep for first-gen students'
              ],
              color: 'blue'
            },
            {
              title: 'Health & Wellness Leaders',
              icon: Heart,
              examples: [
                'Mental health awareness campaigns',
                'Community fitness programs',
                'Nutrition education initiatives',
                'Healthcare access advocacy'
              ],
              color: 'red'
            },
            {
              title: 'Environmental Champions',
              icon: TreePine,
              examples: [
                'Community gardens and urban farming',
                'Recycling and waste reduction',
                'Climate action organizing',
                'Green space development'
              ],
              color: 'green'
            },
            {
              title: 'Social Entrepreneurs',
              icon: Lightbulb,
              examples: [
                'Youth employment programs',
                'Small business incubators',
                'Social justice initiatives',
                'Technology for good projects'
              ],
              color: 'purple'
            },
            {
              title: 'Cultural Bridge Builders',
              icon: Globe,
              examples: [
                'Language exchange programs',
                'Cultural celebration organizing',
                'Immigrant support services',
                'Interfaith dialogue initiatives'
              ],
              color: 'indigo'
            },
            {
              title: 'Crisis Response Leaders',
              icon: HandHeart,
              examples: [
                'Disaster relief coordination',
                'Food security programs',
                'Housing assistance initiatives',
                'Emergency support networks'
              ],
              color: 'orange'
            }
          ].map((pathway, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-xl border-2 border-${pathway.color}-200 p-6 hover:border-${pathway.color}-300 transition-all`}
            >
              <div className={`flex items-center gap-3 mb-4`}>
                <div className={`p-2 bg-${pathway.color}-100 rounded-lg`}>
                  <pathway.icon className={`w-6 h-6 text-${pathway.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{pathway.title}</h3>
              </div>
              <ul className="space-y-2">
                {pathway.examples.map((example, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <div className={`w-1.5 h-1.5 bg-${pathway.color}-500 rounded-full mt-1.5 flex-shrink-0`} />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Support Section */}
      <section id="support" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Provide</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Community Champions receive comprehensive support designed to help them balance their community 
          work with academic excellence and personal growth.
        </p>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Core Support Package</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Academic Support</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Award className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Full college consulting services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Essay help that highlights community impact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Interview prep for service-focused questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Scholarship search assistance</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Leadership Development</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Monthly leadership workshops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Project management training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Public speaking coaching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Grant writing skills</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 p-6 text-center"
            >
              <Megaphone className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Platform Amplification</h4>
              <p className="text-sm text-gray-600">
                Share your story and solutions with our network of 50,000+ supporters
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 text-center"
            >
              <Building className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Organizational Support</h4>
              <p className="text-sm text-gray-600">
                Help structuring, funding, and scaling your community initiatives
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-6 text-center"
            >
              <Users className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Peer Network</h4>
              <p className="text-sm text-gray-600">
                Connect with Champions nationwide to share ideas and collaborate
              </p>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-8 bg-orange-900 text-white rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-2">The Champion Fund</h4>
          <p className="text-orange-100">
            Each Champion receives $1,000-$5,000 in project funding to invest directly in their community 
            initiatives. Because sometimes all a great idea needs is a little fuel to take off.
          </p>
        </div>
      </section>
      
      {/* Impact Stories Section */}
      <section id="impact-stories" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Community Impact</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Our Champions aren't waiting for someday—they're creating change today. Here are just a few 
          examples of how young leaders are transforming their communities.
        </p>
        
        <div className="space-y-8">
          {[
            {
              name: 'Jamal Washington',
              location: 'Detroit, Michigan',
              project: 'Code Warriors',
              description: 'Started a free coding bootcamp in his neighborhood library, teaching programming to 200+ youth',
              impact: 'Program graduates have earned over $2M in tech salaries, with 90% staying in Detroit',
              quote: 'I learned to code from YouTube. Now my students are building apps that solve real problems in our community.',
              funding: '$3,500 Champion Fund'
            },
            {
              name: 'Ana Martinez',
              location: 'Brownsville, Texas',
              project: 'Puentes de Salud (Health Bridges)',
              description: 'Created a network of bilingual health advocates helping immigrant families navigate healthcare',
              impact: 'Connected 1,500+ families to healthcare, preventing an estimated $3M in emergency room costs',
              quote: 'My abuela almost died because she couldn\'t explain her symptoms in English. No family should face that.',
              funding: '$4,200 Champion Fund'
            },
            {
              name: 'Tyler Chen',
              location: 'Rural Montana',
              project: 'Prairie Innovation Lab',
              description: 'Converted an abandoned grain silo into a makerspace for rural youth to explore STEM',
              impact: '87% of participants now planning STEM careers, 12 provisional patents filed by students',
              quote: 'People think innovation only happens in cities. We\'re proving them wrong, one project at a time.',
              funding: '$5,000 Champion Fund'
            },
            {
              name: 'Fatima Al-Ahmad',
              location: 'Minneapolis, Minnesota',
              project: 'Stories of Home',
              description: 'Documentary project preserving refugee stories and promoting cultural understanding',
              impact: 'Films viewed 500K+ times, used in 200+ schools for cultural education',
              quote: 'When people hear our stories, fear transforms into friendship. That\'s how we build community.',
              funding: '$2,800 Champion Fund'
            }
          ].map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-200 transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {story.location}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {story.funding}
                  </span>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{story.project}</h4>
                <p className="text-gray-700 mb-3">{story.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">Impact:</p>
                  <p className="text-sm text-gray-700">{story.impact}</p>
                </div>
                
                <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-600">
                  "{story.quote}"
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/promise/community-champions/stories" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            Explore more Champion stories
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      
      {/* Eligibility Section */}
      <section id="eligibility" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Who Can Apply</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We look for students who are already making a difference, regardless of scale. If you're creating 
          positive change in your community and planning to continue that work through college, you belong here.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Requirements</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  High school junior or senior planning to attend college
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Demonstrated history of community service (6+ months)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Clear vision for continuing community work
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Letters of support from community members
                </span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Value</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Genuine commitment over resume building
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Creative solutions to local challenges
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Ability to inspire and mobilize others
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Understanding of systemic issues
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-orange-50 rounded-xl p-6 border border-orange-200">
          <h4 className="font-semibold text-gray-900 mb-2">No Minimum Hours Required</h4>
          <p className="text-gray-700">
            We don't count hours—we count impact. Whether you've organized one transformative project or 
            volunteer every week, we want to hear how you've made a difference.
          </p>
        </div>
      </section>
      
      {/* Partners Section */}
      <section id="partners" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Community Partners</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          We work with organizations across the country who share our belief that young people are not 
          future leaders—they're leaders right now.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              type: 'Local Organizations',
              count: '234',
              examples: ['Boys & Girls Clubs', 'Local libraries', 'Community centers', 'Faith organizations']
            },
            {
              type: 'National Networks',
              count: '47',
              examples: ['United Way', 'Habitat for Humanity', 'Points of Light', 'Youth Service America']
            },
            {
              type: 'Funding Partners',
              count: '89',
              examples: ['Community foundations', 'Corporate sponsors', 'Individual donors', 'Alumni network']
            }
          ].map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{partner.type}</h3>
              <p className="text-3xl font-bold text-orange-600 mb-3">{partner.count}</p>
              <ul className="space-y-1">
                {partner.examples.map((example, j) => (
                  <li key={j} className="text-sm text-gray-600">• {example}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-700 mb-4">
            Want to nominate a Community Champion or partner with us?
          </p>
          <Link
            href="/promise/community-champions/partner"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Become a Partner
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      
      {/* Apply Section */}
      <section id="apply" className="mb-16">
        <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Community Needs You. We're Here to Help.
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Don't let college applications distract from your community work. Apply to be a Community 
            Champion and get the support you need to do both.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/promise/community-champions/apply"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Apply Now
            </Link>
            <Link
              href="/promise/community-champions/info-session"
              className="px-8 py-4 bg-orange-700 text-white rounded-lg font-semibold text-lg hover:bg-orange-800 transition-colors"
            >
              Join Info Session
            </Link>
          </div>
          
          <p className="text-sm text-orange-200">
            Rolling admissions • Apply anytime • Decisions within 3 weeks
          </p>
        </div>
      </section>
      
      {/* Final Quote */}
      <section className="mt-16 mb-8">
        <blockquote className="text-center">
          <p className="text-2xl text-gray-800 font-light italic mb-4">
            "The best time to plant a tree was 20 years ago. The second best time is now. 
            <br />Our Champions aren't waiting—they're planting forests."
          </p>
          <cite className="text-gray-600">
            — Community Champions Motto
          </cite>
        </blockquote>
      </section>
    </PromiseLayout>
}