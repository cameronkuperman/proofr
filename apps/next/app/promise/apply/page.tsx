'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { 
  GraduationCap,
  DollarSign,
  Users,
  ChevronRight,
  Calendar,
  Clock,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Sparkles,
  Info,
  Award,
  Camera,
  Link as LinkIcon
} from 'lucide-react'
import { NavigationBar } from 'app/features/landing/components/NavigationBar'

const programs = [
  {
    id: 'pinnacle-scholars',
    name: 'Pinnacle Scholars',
    icon: GraduationCap,
    color: 'purple',
    description: 'Merit-based support for high-achieving students',
    requirements: [
      'Official transcript',
      'SAT/ACT scores (optional)',
      'Two teacher recommendations',
      'Resume of activities & honors'
    ]
  },
  {
    id: 'opportunity-fund',
    name: 'Opportunity Fund',
    icon: DollarSign,
    color: 'green',
    description: 'Direct financial assistance for immediate needs',
    requirements: [
      'Financial information',
      'Specific expense documentation',
      'Brief explanation of need',
      'No essays required'
    ]
  },
  {
    id: 'community-champions',
    name: 'Community Champions',
    icon: Users,
    color: 'orange',
    description: 'Support for students making local impact',
    requirements: [
      'Documentation of community work',
      'Letters from organizations served',
      'Media coverage or photos',
      'Quantifiable impact metrics'
    ]
  }
]

export default function ApplyPage() {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  
  const toggleProgram = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(p => p !== programId)
        : [...prev, programId]
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Apply to Proofr Promise
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              One application, multiple opportunities. Apply to up to three programs that match 
              your achievements and needs.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Application Timeline */}
      <section className="py-12 bg-purple-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">2025 Application Cycle</h2>
            <span className="text-sm font-medium text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
              Applications Open
            </span>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { date: 'January 15', event: 'Applications Open', icon: Calendar },
              { date: 'March 15', event: 'Application Deadline', icon: Clock },
              { date: 'April 30', event: 'Decisions Released', icon: FileText },
              { date: 'May 15', event: 'Acceptance Deadline', icon: CheckCircle }
            ].map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-6 text-center"
              >
                <milestone.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-900">{milestone.date}</p>
                <p className="text-sm text-gray-600">{milestone.event}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 bg-purple-100 rounded-lg p-4 text-center">
            <p className="text-purple-800">
              <strong>Note:</strong> All decisions released on the same day. This happens after college 
              admissions decisions so you can plan accordingly.
            </p>
          </div>
        </div>
      </section>
      
      {/* Program Selection */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select which Proofr Promise programs you&apos;d like to apply to. You can apply to 
            multiple programs with one application.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {programs.map((program) => (
            <motion.div
              key={program.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleProgram(program.id)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all p-6 ${
                selectedPrograms.includes(program.id)
                  ? `border-${program.color}-500 bg-${program.color}-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {selectedPrograms.includes(program.id) && (
                <div className={`absolute top-4 right-4 w-6 h-6 bg-${program.color}-500 rounded-full flex items-center justify-center`}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
              
              <program.icon className={`w-12 h-12 text-${program.color}-600 mb-4`} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Requirements:</p>
                <ul className="space-y-1">
                  {program.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 bg-${program.color}-500 rounded-full mt-1.5 flex-shrink-0`} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        
        {selectedPrograms.length > 0 && (
          <div className="text-center">
            <Link
              href="#application-form"
              className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Continue to Application
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </section>
      
      {/* Application Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What You&apos;ll Need
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Common Requirements */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">All Applications</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Basic Information</p>
                    <p className="text-sm text-gray-600">Contact details, school info, demographics</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Academic History</p>
                    <p className="text-sm text-gray-600">GPA, class rank, course rigor</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Activities & Leadership</p>
                    <p className="text-sm text-gray-600">Extracurriculars, work, volunteer experience</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Essays */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Essay Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Personal Statement</p>
                    <p className="text-sm text-gray-600">500-750 words about your journey</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Program-Specific Essay</p>
                    <p className="text-sm text-gray-600">300-500 words per program selected</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Short Answers</p>
                    <p className="text-sm text-gray-600">5 questions, 150 words each</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Program-Specific Requirements */}
          <div className="mt-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Program-Specific Requirements</h3>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Pinnacle Scholars</h4>
                    <p className="text-sm text-gray-600">
                      Official transcript, standardized test scores (optional), 2 teacher recommendations, 
                      academic honors and awards list
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Opportunity Fund</h4>
                    <p className="text-sm text-gray-600">
                      FAFSA or tax information, specific expense breakdown, brief explanation of need 
                      (not a full essay)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Community Champions</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Verification required:</strong> Letters from organizations, media coverage, 
                      photos/videos of your work, quantifiable impact data (people served, funds raised, etc.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Essay Prompts */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Essay Prompts
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Statement</h3>
            <p className="text-gray-700 mb-4">Choose one of the following prompts (500-750 words):</p>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-gray-700">
                Describe a challenge you&apos;ve overcome and how it shaped your educational journey.
              </li>
              <li className="text-gray-700">
                Discuss a moment when you realized the power of education to change lives.
              </li>
              <li className="text-gray-700">
                Share how your background, identity, or experiences will contribute to a college community.
              </li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Program-Specific Essays</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pinnacle Scholars (300-500 words)</h4>
                <p className="text-gray-700">
                  How have you maximized the opportunities available to you, and how will you continue 
                  to do so in college?
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Opportunity Fund (300 words max)</h4>
                <p className="text-gray-700">
                  Briefly explain how the specific financial support you&apos;re requesting will help 
                  you achieve your educational goals.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Community Champions (300-500 words)</h4>
                <p className="text-gray-700">
                  Describe your most impactful community project and provide specific, verifiable 
                  details about its outcomes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Short Answer Questions</h3>
            <p className="text-gray-700 mb-4">Answer all five questions (150 words each):</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li className="text-gray-700">What does educational equity mean to you?</li>
              <li className="text-gray-700">Describe a time you helped someone else succeed.</li>
              <li className="text-gray-700">What&apos;s a belief you held that you later changed your mind about?</li>
              <li className="text-gray-700">How do you plan to give back to your community after college?</li>
              <li className="text-gray-700">What question do you wish we had asked, and how would you answer it?</li>
            </ol>
          </div>
        </div>
      </section>
      
      {/* Tips Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Application Tips
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6"
            >
              <Award className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Be Authentic</h3>
              <p className="text-gray-700">
                We want to hear YOUR story. Don&apos;t write what you think we want to hear—write 
                what&apos;s true to your experience.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6"
            >
              <Camera className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Provide Evidence</h3>
              <p className="text-gray-700">
                Especially for Community Champions—include photos, news articles, letters from 
                organizations. Verifiable impact matters.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6"
            >
              <Clock className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Early</h3>
              <p className="text-gray-700">
                Give yourself time to gather documents, request recommendations, and revise essays. 
                Don&apos;t wait until the deadline.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6"
            >
              <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Show Growth</h3>
              <p className="text-gray-700">
                We value trajectory as much as achievement. Show how you&apos;ve grown and what 
                you&apos;ve learned from challenges.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Important Information */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Important Information
        </h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">One Application Per Year</h4>
                <p className="text-gray-700">
                  You can apply to multiple programs, but only submit one application per year. 
                  Choose your programs carefully.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Reapplication Welcome</h4>
                <p className="text-gray-700">
                  Not selected this year? You can reapply next year. Many successful recipients 
                  applied more than once.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Post-Admission Decisions</h4>
                <p className="text-gray-700">
                  All decisions are released after college admission decisions, so you can make 
                  informed choices about your future.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Existing Proofr Users</h4>
                <p className="text-gray-700">
                  While not required, we give slight preference to students who have used Proofr&apos;s 
                  services, as we can better verify their journey and commitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Apply?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of students who have transformed their futures through the Proofr Promise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-purple-900 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all">
              Start Application
            </button>
            <Link
              href="/promise/apply/checklist"
              className="px-8 py-3 bg-purple-800 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Download Checklist
            </Link>
          </div>
          
          <p className="mt-8 text-purple-200">
            Questions? Email{' '}
            <a href="mailto:promise@proofr.com" className="underline">
              promise@proofr.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}