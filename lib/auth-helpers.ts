import { supabase } from './supabase'

export type UserType = 'student' | 'consultant'

interface SignUpData {
  email: string
  password: string
  userType: UserType
  firstName: string
  lastName: string
}

interface ConsultantData {
  name: string
  current_college?: string
  major?: string
  graduation_year?: number
  edu_email?: string
}

interface StudentData {
  name: string
  current_school?: string
  school_type?: 'high-school' | 'college'
  grade_level?: string
}

// Sign up with email
export async function signUpWithEmail(data: SignUpData) {
  const { email, password, userType, firstName, lastName } = data

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          first_name: firstName,
          last_name: lastName,
        }
      }
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('No user data returned')

    // 2. Create user profile in public.users
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        user_type: userType,
        auth_provider: ['email'],
      })

    if (userError) throw userError

    // 3. Create type-specific profile
    const fullName = `${firstName} ${lastName}`
    const profileData = userType === 'student' 
      ? { id: authData.user.id, name: fullName }
      : { 
          id: authData.user.id, 
          name: fullName, 
          verification_status: 'pending',
          is_available: true  // Consultants can start working immediately!
        }

    const { error: profileError } = await supabase
      .from(userType === 'student' ? 'students' : 'consultants')
      .insert(profileData)

    if (profileError) throw profileError

    return { user: authData.user, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { user: null, error }
  }
}

// Sign up with Google
export async function signUpWithGoogle(userType: UserType) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?type=${userType}`,
      queryParams: {
        prompt: 'select_account'
      }
    }
  })

  if (error) throw error
  return data
}

// Sign in with email
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Update last login
  if (data.user) {
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id)
  }

  return data
}

// Sign in with Google (for existing users)
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: 'select_account'
      }
    }
  })

  if (error) throw error
  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current user with profile
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get user profile
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!userData) return null

  // Get type-specific profile
  const table = userData.user_type === 'student' ? 'students' : 'consultants'
  const { data: profile } = await supabase
    .from(table)
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    ...user,
    userType: userData.user_type,
    profile,
  }
}

// Update consultant profile
export async function updateConsultantProfile(id: string, data: Partial<ConsultantData>) {
  const { data: result, error } = await supabase
    .from('consultants')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return result
}

// Update student profile
export async function updateStudentProfile(id: string, data: Partial<StudentData>) {
  const { data: result, error } = await supabase
    .from('students')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return result
}

// Submit consultant for verification
export async function submitConsultantVerification(consultantId: string, data: {
  edu_email: string
  university_name: string
  document_type?: string
  document_url?: string
}) {
  // Check if edu email domain matches university (for auto-verification)
  const emailDomain = data.edu_email.split('@')[1].toLowerCase()
  const universityDomains: Record<string, string[]> = {
    'Harvard University': ['harvard.edu'],
    'Stanford University': ['stanford.edu'],
    'MIT': ['mit.edu'],
    'Yale University': ['yale.edu'],
    'Princeton University': ['princeton.edu'],
    'Columbia University': ['columbia.edu'],
    'University of Pennsylvania': ['upenn.edu'],
    'Brown University': ['brown.edu'],
    'Cornell University': ['cornell.edu'],
    'Dartmouth College': ['dartmouth.edu'],
    'University of Chicago': ['uchicago.edu'],
    'Duke University': ['duke.edu'],
    'Northwestern University': ['northwestern.edu'],
    'Johns Hopkins University': ['jhu.edu'],
    'Caltech': ['caltech.edu'],
    'Vanderbilt University': ['vanderbilt.edu'],
    'Rice University': ['rice.edu'],
    'Washington University in St. Louis': ['wustl.edu'],
    'Emory University': ['emory.edu'],
    'Georgetown University': ['georgetown.edu'],
    'UC Berkeley': ['berkeley.edu'],
    'UCLA': ['ucla.edu'],
    'University of Michigan': ['umich.edu'],
    'Carnegie Mellon University': ['cmu.edu'],
    'New York University': ['nyu.edu'],
    'University of Virginia': ['virginia.edu'],
    'University of North Carolina': ['unc.edu'],
    'Boston University': ['bu.edu'],
    'Georgia Tech': ['gatech.edu'],
    // Add more universities as needed
  }

  const matchedDomains = universityDomains[data.university_name] || []
  const autoVerifyEligible = matchedDomains.includes(emailDomain)

  // Create verification request
  const { error: queueError } = await supabase
    .from('verification_queue')
    .insert({
      consultant_id: consultantId,
      edu_email: data.edu_email,
      university_name: data.university_name,
      document_type: data.document_type,
      document_url: data.document_url,
      auto_verify_eligible: autoVerifyEligible,
    })

  if (queueError) throw queueError

  // If eligible for auto-verification, update consultant status
  if (autoVerifyEligible) {
    const { error: updateError } = await supabase
      .from('consultants')
      .update({
        verification_status: 'approved',
        verified_at: new Date().toISOString(),
        edu_email: data.edu_email,
        auto_verified: true,
      })
      .eq('id', consultantId)

    if (updateError) throw updateError
  }

  return { autoVerified: autoVerifyEligible }
}

// Check if user exists
export async function checkUserExists(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error
  }

  return data
}