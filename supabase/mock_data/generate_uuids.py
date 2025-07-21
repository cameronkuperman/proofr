#!/usr/bin/env python3
import csv
import uuid
from datetime import datetime, timedelta
import random
import json

# Generate UUIDs for all entities
consultant_uuids = {
    'c1111111-1111-1111-1111-111111111111': str(uuid.uuid4()),  # Sarah Chen
    'c1111111-1111-1111-1111-111111111112': str(uuid.uuid4()),  # James Wilson
    'c1111111-1111-1111-1111-111111111113': str(uuid.uuid4()),  # Priya Sharma
    'c2222222-2222-2222-2222-222222222221': str(uuid.uuid4()),  # Michael Johnson
    'c2222222-2222-2222-2222-222222222222': str(uuid.uuid4()),  # Lisa Wang
    'c3333333-3333-3333-3333-333333333331': str(uuid.uuid4()),  # Emily Patel
    'c3333333-3333-3333-3333-333333333332': str(uuid.uuid4()),  # Alex Rodriguez
    'c4444444-4444-4444-4444-444444444441': str(uuid.uuid4()),  # David Kim
    'c4444444-4444-4444-4444-444444444442': str(uuid.uuid4()),  # Sophie Martinez
    'c5555555-5555-5555-5555-555555555551': str(uuid.uuid4()),  # Ryan Thomas
    'c5555555-5555-5555-5555-555555555552': str(uuid.uuid4()),  # Nina Patel
    'c6666666-6666-6666-6666-666666666661': str(uuid.uuid4()),  # Marcus Lee
    'c6666666-6666-6666-6666-666666666662': str(uuid.uuid4()),  # Jessica Brown
    'c7777777-7777-7777-7777-777777777771': str(uuid.uuid4()),  # Kevin Zhou
    'c8888888-8888-8888-8888-888888888881': str(uuid.uuid4()),  # Amanda Davis
}

# Build student UUID patterns
student_patterns = [
    's0000000-0000-0000-0000-00000000000',
    's1111111-1111-1111-1111-11111111111',
    's2222222-2222-2222-2222-22222222222',
    's3333333-3333-3333-3333-33333333333',
    's4444444-4444-4444-4444-44444444444',
    's5555555-5555-5555-5555-55555555555',
    's6666666-6666-6666-6666-66666666666',
    's7777777-7777-7777-7777-77777777777',
    's8888888-8888-8888-8888-88888888888',
    's9999999-9999-9999-9999-99999999999'
]

student_uuids = {}
for i in range(50):
    pattern_idx = i // 5  # 5 students per pattern
    last_digit = i % 5
    old_id = student_patterns[pattern_idx] + str(last_digit)
    student_uuids[old_id] = str(uuid.uuid4())

# Generate service UUIDs
service_uuids = {}
service_map = {}  # Maps consultant_id to list of service uuids

# Generate booking UUIDs  
booking_uuids = {}

# Generate interaction UUIDs
interaction_uuids = {}

# Generate waitlist UUIDs
waitlist_uuids = {}

# Generate group session UUIDs
group_session_uuids = {}

def update_users_csv():
    users = []
    
    # Add consultants
    consultants_data = [
        ('c1111111-1111-1111-1111-111111111111', 'sarah.chen@harvard.edu'),
        ('c1111111-1111-1111-1111-111111111112', 'james.wilson@harvard.edu'),
        ('c1111111-1111-1111-1111-111111111113', 'priya.sharma@harvard.edu'),
        ('c2222222-2222-2222-2222-222222222221', 'michael.johnson@stanford.edu'),
        ('c2222222-2222-2222-2222-222222222222', 'lisa.wang@stanford.edu'),
        ('c3333333-3333-3333-3333-333333333331', 'emily.patel@mit.edu'),
        ('c3333333-3333-3333-3333-333333333332', 'alex.rodriguez@mit.edu'),
        ('c4444444-4444-4444-4444-444444444441', 'david.kim@yale.edu'),
        ('c4444444-4444-4444-4444-444444444442', 'sophie.martinez@yale.edu'),
        ('c5555555-5555-5555-5555-555555555551', 'ryan.thomas@princeton.edu'),
        ('c5555555-5555-5555-5555-555555555552', 'nina.patel@princeton.edu'),
        ('c6666666-6666-6666-6666-666666666661', 'marcus.lee@columbia.edu'),
        ('c6666666-6666-6666-6666-666666666662', 'jessica.brown@columbia.edu'),
        ('c7777777-7777-7777-7777-777777777771', 'kevin.zhou@upenn.edu'),
        ('c8888888-8888-8888-8888-888888888881', 'amanda.davis@brown.edu'),
    ]
    
    for i, (old_id, email) in enumerate(consultants_data):
        new_id = consultant_uuids[old_id]
        created = datetime.now() - timedelta(days=50-i)
        last_login = datetime.now() - timedelta(hours=random.randint(1, 48))
        users.append({
            'id': new_id,
            'email': email,
            'phone': '',
            'user_type': 'consultant',
            'profile_image_url': '',
            'auth_provider': '{email}',
            'is_active': 'true',
            'last_login': last_login.isoformat() + 'Z',
            'created_at': created.isoformat() + 'Z',
            'updated_at': created.isoformat() + 'Z'
        })
    
    # Add students
    student_emails = [
        'alex.thompson@gmail.com', 'emma.wilson@gmail.com', 'daniel.martinez@gmail.com',
        'sophia.lee@gmail.com', 'noah.chen@gmail.com', 'olivia.brown@yahoo.com',
        'liam.davis@hotmail.com', 'ava.garcia@gmail.com', 'ethan.rodriguez@gmail.com',
        'isabella.kim@gmail.com', 'mason.taylor@gmail.com', 'mia.anderson@gmail.com',
        'lucas.thomas@gmail.com', 'charlotte.jackson@gmail.com', 'aiden.white@gmail.com',
        'amelia.harris@gmail.com', 'henry.martin@gmail.com', 'evelyn.thompson@gmail.com',
        'benjamin.clark@gmail.com', 'harper.lewis@gmail.com', 'jack.robinson@gmail.com',
        'luna.walker@gmail.com', 'sebastian.young@gmail.com', 'ellie.allen@gmail.com',
        'owen.king@gmail.com', 'grace.wright@gmail.com', 'leo.scott@gmail.com',
        'zoe.green@gmail.com', 'nathan.baker@gmail.com', 'lily.adams@gmail.com',
        'dylan.nelson@gmail.com', 'chloe.carter@gmail.com', 'ryan.mitchell@gmail.com',
        'hazel.perez@gmail.com', 'luke.roberts@gmail.com', 'aurora.turner@gmail.com',
        'mateo.phillips@gmail.com', 'nora.campbell@gmail.com', 'asher.parker@gmail.com',
        'violet.evans@gmail.com', 'theo.edwards@gmail.com', 'stella.collins@gmail.com',
        'ezra.stewart@gmail.com', 'ivy.sanchez@gmail.com', 'kai.morris@gmail.com',
        'elena.rogers@gmail.com', 'miles.reed@gmail.com', 'maya.cook@gmail.com',
        'felix.morgan@gmail.com', 'claire.bell@gmail.com'
    ]
    
    for i, email in enumerate(student_emails):
        old_id = f's{str(i//10)*7}-{str(i//10)*4}-{str(i//10)*4}-{str(i//10)*4}-{str(i//10)*12}{i%10}'
        new_id = student_uuids[old_id]
        created = datetime.now() - timedelta(days=50-i)
        last_login = datetime.now() - timedelta(hours=random.randint(1, 120))
        users.append({
            'id': new_id,
            'email': email,
            'phone': '',
            'user_type': 'student',
            'profile_image_url': '',
            'auth_provider': '{email}',
            'is_active': 'true',
            'last_login': last_login.isoformat() + 'Z',
            'created_at': created.isoformat() + 'Z',
            'updated_at': created.isoformat() + 'Z'
        })
    
    # Write CSV
    with open('users.csv', 'w', newline='') as f:
        fieldnames = ['id', 'email', 'phone', 'user_type', 'profile_image_url', 
                     'auth_provider', 'is_active', 'last_login', 'created_at', 'updated_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(users)

def update_consultants_csv():
    consultants = []
    
    consultant_data = [
        {
            'old_id': 'c1111111-1111-1111-1111-111111111111',
            'name': 'Sarah Chen',
            'bio': 'Harvard senior specializing in college essay reviews and interview prep. 95% acceptance rate to top schools.',
            'long_bio': 'Hi! I\'m Sarah, a senior at Harvard studying Economics with a minor in Creative Writing. I\'ve helped over 120 students get into their dream schools, including Ivy League universities. My specialty is helping students craft compelling personal narratives that stand out. I was an admissions ambassador and have insider knowledge of what top schools look for.',
            'current_college': 'Harvard University',
            'major': 'Economics',
            'graduation_year': 2025,
            'rating': 4.92,
            'total_reviews': 68,
            'total_bookings': 142,
            'total_earnings': 12800.50,
            'response_time_hours': 2.5,
            'profile_views': 3450
        },
        {
            'old_id': 'c2222222-2222-2222-2222-222222222221',
            'name': 'Michael Johnson',
            'bio': 'Stanford CS student offering technical interview prep and resume reviews. Ex-Google intern.',
            'long_bio': 'I\'m a Computer Science major at Stanford with internship experience at Google and Meta. I specialize in helping students prepare for technical interviews and optimize their resumes for tech companies. I\'ve successfully coached 80+ students into top tech programs. My approach combines algorithmic thinking with soft skills development.',
            'current_college': 'Stanford University',
            'major': 'Computer Science', 
            'graduation_year': 2024,
            'rating': 4.88,
            'total_reviews': 52,
            'total_bookings': 98,
            'total_earnings': 10250.00,
            'response_time_hours': 3.0,
            'profile_views': 2890
        },
        {
            'old_id': 'c3333333-3333-3333-3333-333333333331',
            'name': 'Emily Patel',
            'bio': 'MIT Engineering student helping with STEM applications and test prep. Perfect SAT scorer.',
            'long_bio': 'As an MIT Mechanical Engineering student with perfect SAT scores, I help students excel in standardized tests and craft compelling STEM applications. I\'ve tutored 150+ students with an average SAT score increase of 180 points. I also provide guidance on research opportunities and science competitions.',
            'current_college': 'MIT',
            'major': 'Mechanical Engineering',
            'graduation_year': 2026,
            'rating': 4.95,
            'total_reviews': 89,
            'total_bookings': 156,
            'total_earnings': 15600.75,
            'response_time_hours': 1.8,
            'profile_views': 4120
        },
        {
            'old_id': 'c4444444-4444-4444-4444-444444444441',
            'name': 'David Kim',
            'bio': 'Yale humanities student offering comprehensive application support. Former admissions reader.',
            'long_bio': 'Yale English major and debate team captain. I specialize in helping students develop their writing voice and present compelling arguments in their applications. Former admissions committee reader with insider knowledge of what top schools look for. I\'ve helped 60+ students gain admission to Ivy League schools.',
            'current_college': 'Yale University',
            'major': 'English Literature',
            'graduation_year': 2025,
            'rating': 4.75,
            'total_reviews': 38,
            'total_bookings': 72,
            'total_earnings': 7560.00,
            'response_time_hours': 4.5,
            'profile_views': 1980,
            'vacation_mode': True,
            'vacation_message': 'Taking a break for finals. Back on January 20th!'
        },
        {
            'old_id': 'c5555555-5555-5555-5555-555555555551',
            'name': 'Ryan Thomas',
            'bio': 'Princeton pre-med student. Expert in medical school applications and MCAT prep.',
            'long_bio': 'As a Princeton molecular biology major with a 524 MCAT score, I help pre-med students navigate the complex medical school application process. From MCAT prep to interview coaching, I provide comprehensive support. I\'ve helped 40+ students get into top medical schools including Johns Hopkins and Harvard Med.',
            'current_college': 'Princeton University',
            'major': 'Molecular Biology',
            'graduation_year': 2025,
            'rating': 4.82,
            'total_reviews': 29,
            'total_bookings': 58,
            'total_earnings': 6380.25,
            'response_time_hours': 2.2,
            'profile_views': 1650
        },
        {
            'old_id': 'c1111111-1111-1111-1111-111111111112',
            'name': 'James Wilson',
            'bio': 'Harvard Business student. Specializing in MBA applications and business school prep.',
            'long_bio': 'Harvard Business School student with experience at McKinsey and Goldman Sachs. I help students craft compelling business school applications and prepare for case interviews. My students have been admitted to HBS, Wharton, Stanford GSB, and other top programs.',
            'current_college': 'Harvard University',
            'major': 'Business Administration',
            'graduation_year': 2026,
            'rating': 4.70,
            'total_reviews': 22,
            'total_bookings': 45,
            'total_earnings': 5850.00,
            'response_time_hours': 3.5,
            'profile_views': 1230,
            'colleges_attended': '[{"school": "University of Pennsylvania", "degree": "BA Economics", "year": 2022}]'
        },
        {
            'old_id': 'c2222222-2222-2222-2222-222222222222',
            'name': 'Lisa Wang',
            'bio': 'Stanford Engineering PhD student. Research mentorship and grad school applications.',
            'long_bio': 'PhD candidate in Electrical Engineering at Stanford. I help students find research opportunities, write strong research proposals, and apply to graduate programs. Published in Nature and IEEE with 10+ papers. Former Intel and Apple research intern.',
            'current_college': 'Stanford University',
            'major': 'Electrical Engineering',
            'graduation_year': 2028,
            'rating': 4.85,
            'total_reviews': 18,
            'total_bookings': 32,
            'total_earnings': 4160.50,
            'response_time_hours': 2.8,
            'profile_views': 980,
            'colleges_attended': '[{"school": "UC Berkeley", "degree": "BS EECS", "year": 2022}]'
        },
        {
            'old_id': 'c3333333-3333-3333-3333-333333333332',
            'name': 'Alex Rodriguez',
            'bio': 'MIT CS student. Competitive programming coach and CS application specialist.',
            'long_bio': 'MIT Computer Science major with IOI Gold medal. I help students prepare for competitive programming, build impressive CS portfolios, and apply to top engineering programs. My students have won national competitions and gained admission to MIT, Caltech, and CMU.',
            'current_college': 'MIT',
            'major': 'Computer Science',
            'graduation_year': 2026,
            'rating': 4.78,
            'total_reviews': 15,
            'total_bookings': 28,
            'total_earnings': 3640.00,
            'response_time_hours': 3.2,
            'profile_views': 850
        },
        {
            'old_id': 'c1111111-1111-1111-1111-111111111113',
            'name': 'Priya Sharma',
            'bio': 'Harvard pre-law student. Law school applications and LSAT tutoring specialist.',
            'long_bio': 'Harvard Government major with a 175 LSAT score. I help aspiring lawyers craft compelling personal statements, prepare for the LSAT, and navigate law school applications. Mock interview specialist with experience on Harvard Law Review.',
            'current_college': 'Harvard University',
            'major': 'Government',
            'graduation_year': 2025,
            'rating': 4.88,
            'total_reviews': 25,
            'total_bookings': 48,
            'total_earnings': 5280.75,
            'response_time_hours': 2.0,
            'profile_views': 1420
        },
        {
            'old_id': 'c4444444-4444-4444-4444-444444444442',
            'name': 'Sophie Martinez',
            'bio': 'Yale Art History major. Liberal arts applications and portfolio reviews.',
            'long_bio': 'Yale Art History and Studio Art double major. I help students with liberal arts applications, art portfolios, and creative supplements. Former Yale Art Gallery intern and published art critic.',
            'current_college': 'Yale University',
            'major': 'Art History',
            'graduation_year': 2026,
            'rating': 4.65,
            'total_reviews': 8,
            'total_bookings': 15,
            'total_earnings': 1650.00,
            'response_time_hours': 4.0,
            'profile_views': 420
        },
        {
            'old_id': 'c5555555-5555-5555-5555-555555555552',
            'name': 'Nina Patel',
            'bio': 'Princeton Public Policy student. Non-profit and social impact applications.',
            'long_bio': 'Princeton School of Public and International Affairs student. I help students interested in social impact careers with applications to policy programs, non-profits, and international organizations. Former UN intern.',
            'current_college': 'Princeton University',
            'major': 'Public Policy',
            'graduation_year': 2025,
            'rating': 4.72,
            'total_reviews': 6,
            'total_bookings': 12,
            'total_earnings': 1320.25,
            'response_time_hours': 3.8,
            'profile_views': 340
        },
        {
            'old_id': 'c6666666-6666-6666-6666-666666666661',
            'name': 'Marcus Lee',
            'bio': 'Columbia Journalism student. Writing workshops and journalism applications.',
            'long_bio': 'Columbia Journalism School graduate student. Former editor at The Columbia Spectator. I help students improve their writing, prepare journalism portfolios, and apply to communications programs.',
            'current_college': 'Columbia University',
            'major': 'Journalism',
            'graduation_year': 2025,
            'rating': 4.80,
            'total_reviews': 12,
            'total_bookings': 22,
            'total_earnings': 2420.50,
            'response_time_hours': 2.5,
            'profile_views': 680,
            'colleges_attended': '[{"school": "Northwestern University", "degree": "BA Journalism", "year": 2023}]'
        },
        {
            'old_id': 'c6666666-6666-6666-6666-666666666662',
            'name': 'Jessica Brown',
            'bio': 'Columbia Finance student. Investment banking prep and finance applications.',
            'long_bio': 'Columbia Business School student with experience at J.P. Morgan. I help students break into finance through resume reviews, technical prep, and networking strategies.',
            'current_college': 'Columbia University',
            'major': 'Finance',
            'graduation_year': 2025,
            'rating': 4.68,
            'total_reviews': 4,
            'total_bookings': 8,
            'total_earnings': 960.00,
            'response_time_hours': 5.0,
            'profile_views': 220
        },
        {
            'old_id': 'c7777777-7777-7777-7777-777777777771',
            'name': 'Kevin Zhou',
            'bio': 'UPenn Wharton student. Business school prep and entrepreneurship coaching.',
            'long_bio': 'Wharton undergraduate with startup experience. I help students with business school applications, startup pitches, and entrepreneurship competitions. Founded a Y Combinator-backed startup.',
            'current_college': 'University of Pennsylvania',
            'major': 'Business',
            'graduation_year': 2025,
            'rating': 4.76,
            'total_reviews': 10,
            'total_bookings': 18,
            'total_earnings': 2160.75,
            'response_time_hours': 3.0,
            'profile_views': 520
        },
        {
            'old_id': 'c8888888-8888-8888-8888-888888888881',
            'name': 'Amanda Davis',
            'bio': 'Brown Creative Writing MFA. Personal essay coaching and creative supplements.',
            'long_bio': 'Brown University MFA candidate in Creative Writing. Published author and workshop leader. I help students find their authentic voice and craft memorable personal essays.',
            'current_college': 'Brown University',
            'major': 'Creative Writing',
            'graduation_year': 2026,
            'rating': 4.90,
            'total_reviews': 2,
            'total_bookings': 3,
            'total_earnings': 330.00,
            'response_time_hours': 2.0,
            'profile_views': 95,
            'colleges_attended': '[{"school": "Vassar College", "degree": "BA English", "year": 2023}]'
        }
    ]
    
    for i, data in enumerate(consultant_data):
        new_id = consultant_uuids[data['old_id']]
        created = datetime.now() - timedelta(days=50-i)
        verified = created + timedelta(days=1)
        last_active = datetime.now() - timedelta(hours=random.randint(1, 48))
        
        consultant = {
            'id': new_id,
            'name': data['name'],
            'bio': data['bio'],
            'long_bio': data['long_bio'],
            'current_college': data['current_college'],
            'colleges_attended': data.get('colleges_attended', '[]'),
            'major': data['major'],
            'graduation_year': data['graduation_year'],
            'verification_status': 'approved',
            'verified_at': verified.isoformat() + 'Z',
            'verified_by': '',
            'verification_method': 'edu_email',
            'edu_email': data['name'].lower().replace(' ', '.') + '@' + data['current_college'].lower().replace(' ', '').replace('university', '') + '.edu',
            'auto_verified': 'true',
            'is_available': 'false' if data.get('vacation_mode') else 'true',
            'vacation_mode': 'true' if data.get('vacation_mode') else 'false',
            'vacation_message': data.get('vacation_message', ''),
            'services_preview': '{}',
            'supports_rush_delivery': 'true',
            'rush_multipliers': '{"1.5x": 24, "2x": 12, "3x": 6}',
            'rating': data['rating'],
            'total_reviews': data['total_reviews'],
            'total_bookings': data['total_bookings'],
            'total_earnings': data['total_earnings'],
            'response_time_hours': data['response_time_hours'],
            'timezone': 'America/New_York' if 'Columbia' in data['current_college'] or 'Harvard' in data['current_college'] else 'America/Los_Angeles' if 'Stanford' in data['current_college'] else 'America/New_York',
            'calendly_url': '',
            'profile_views': data['profile_views'],
            'last_active': last_active.isoformat() + 'Z',
            'metadata': '{}',
            'created_at': created.isoformat() + 'Z',
            'updated_at': created.isoformat() + 'Z'
        }
        consultants.append(consultant)
    
    # Write CSV
    with open('consultants.csv', 'w', newline='') as f:
        fieldnames = ['id', 'name', 'bio', 'long_bio', 'current_college', 'colleges_attended', 
                     'major', 'graduation_year', 'verification_status', 'verified_at', 'verified_by',
                     'verification_method', 'edu_email', 'auto_verified', 'is_available', 
                     'vacation_mode', 'vacation_message', 'services_preview', 'supports_rush_delivery',
                     'rush_multipliers', 'rating', 'total_reviews', 'total_bookings', 'total_earnings',
                     'response_time_hours', 'timezone', 'calendly_url', 'profile_views', 'last_active',
                     'metadata', 'created_at', 'updated_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(consultants)

def update_students_csv():
    students = []
    
    # First 10 students with detailed profiles
    detailed_students = [
        {
            'name': 'Alex Thompson',
            'bio': 'Aspiring computer scientist looking to get into top tech programs',
            'current_school': 'Thomas Jefferson High School',
            'school_type': 'high-school',
            'grade_level': 'senior',
            'target_application_year': 2025,
            'preferred_colleges': '{MIT,Stanford,"Carnegie Mellon","UC Berkeley"}',
            'interests': '{"Computer Science","AI/ML",Robotics}',
            'pain_points': '{"Technical interview prep","Research experience"}',
            'budget_range': '[50,150]',
            'credit_balance': 25.60,
            'lifetime_credits_earned': 156.40
        },
        {
            'name': 'Emma Wilson',
            'bio': 'Pre-med student aiming for top medical schools',
            'current_school': 'Phillips Exeter Academy',
            'school_type': 'high-school',
            'grade_level': 'senior',
            'target_application_year': 2025,
            'preferred_colleges': '{Harvard,"Johns Hopkins",Stanford,Yale}',
            'interests': '{Medicine,Biology,"Public Health"}',
            'pain_points': '{"MCAT prep","Research opportunities"}',
            'budget_range': '[75,200]',
            'credit_balance': 48.75,
            'lifetime_credits_earned': 234.80
        },
        {
            'name': 'Daniel Martinez',
            'bio': 'Business-focused student interested in entrepreneurship',
            'current_school': 'Stuyvesant High School',
            'school_type': 'high-school',
            'grade_level': 'senior',
            'target_application_year': 2025,
            'preferred_colleges': '{Wharton,Harvard,Stanford,"MIT Sloan"}',
            'interests': '{Business,Entrepreneurship,Finance}',
            'pain_points': '{"Business plan development","Leadership experience"}',
            'budget_range': '[40,120]',
            'credit_balance': 15.20,
            'lifetime_credits_earned': 98.60
        },
        {
            'name': 'Sophia Lee',
            'bio': 'Creative writer pursuing English and journalism programs',
            'current_school': 'Bronx Science',
            'school_type': 'high-school',
            'grade_level': 'senior',
            'target_application_year': 2025,
            'preferred_colleges': '{Yale,Columbia,Brown,Northwestern}',
            'interests': '{"Creative Writing",Journalism,Literature}',
            'pain_points': '{"Portfolio development","Essay crafting"}',
            'budget_range': '[30,80]',
            'credit_balance': 22.40,
            'lifetime_credits_earned': 142.30
        },
        {
            'name': 'Noah Chen',
            'bio': 'Engineering student focused on aerospace and robotics',
            'current_school': 'Troy High School',
            'school_type': 'high-school',
            'grade_level': 'senior',
            'target_application_year': 2025,
            'preferred_colleges': '{MIT,Caltech,Stanford,"Georgia Tech"}',
            'interests': '{"Aerospace Engineering",Robotics,Physics}',
            'pain_points': '{"Research experience","Competition prep"}',
            'budget_range': '[60,180]',
            'credit_balance': 38.90,
            'lifetime_credits_earned': 189.50
        },
        {
            'name': 'Olivia Brown',
            'bio': 'Liberal arts student exploring humanities programs',
            'current_school': 'Horace Mann School',
            'school_type': 'high-school',
            'grade_level': 'senior',
            'target_application_year': 2025,
            'preferred_colleges': '{Harvard,Yale,Princeton,Brown}',
            'interests': '{History,Philosophy,"Political Science"}',
            'pain_points': '{"Essay help","Interview prep"}',
            'budget_range': '[40,100]',
            'credit_balance': 12.80,
            'lifetime_credits_earned': 78.40
        },
        {
            'name': 'Liam Davis',
            'bio': 'Aspiring lawyer looking at pre-law programs',
            'current_school': 'Boston Latin School',
            'school_type': 'high-school',
            'grade_level': 'senior',
            'target_application_year': 2025,
            'preferred_colleges': '{Harvard,Yale,Columbia,NYU}',
            'interests': '{Pre-law,"Political Science",Philosophy}',
            'pain_points': '{"LSAT prep","Debate coaching"}',
            'budget_range': '[50,150]',
            'credit_balance': 8.60,
            'lifetime_credits_earned': 52.30
        },
        {
            'name': 'Ava Garcia',
            'bio': 'Art student building portfolio for design schools',
            'current_school': 'LaGuardia High School',
            'school_type': 'high-school',
            'grade_level': 'senior',
            'target_application_year': 2025,
            'preferred_colleges': '{RISD,Parsons,Yale,"Cooper Union"}',
            'interests': '{"Fine Arts",Design,Architecture}',
            'pain_points': '{"Portfolio review","Creative supplements"}',
            'budget_range': '[35,90]',
            'credit_balance': 6.40,
            'lifetime_credits_earned': 38.20
        },
        {
            'name': 'Mason Taylor',
            'bio': 'High school junior starting college prep early',
            'current_school': 'Lincoln High School',
            'school_type': 'high-school',
            'grade_level': 'junior',
            'target_application_year': 2026,
            'preferred_colleges': '{Stanford,"UC Berkeley",UCLA}',
            'interests': '{"Computer Science","Data Science"}',
            'pain_points': '{"Early planning","Course selection"}',
            'budget_range': '[30,80]',
            'credit_balance': 3.20,
            'lifetime_credits_earned': 12.40
        },
        {
            'name': 'Mia Anderson',
            'bio': 'Transfer student from community college',
            'current_school': 'Santa Monica College',
            'school_type': 'college',
            'grade_level': 'transfer',
            'target_application_year': 2025,
            'preferred_colleges': '{"UC Berkeley",UCLA,USC,Stanford}',
            'interests': '{Psychology,Neuroscience}',
            'pain_points': '{"Transfer essays","GPA improvement"}',
            'budget_range': '[40,100]',
            'credit_balance': 2.80,
            'lifetime_credits_earned': 8.90
        }
    ]
    
    # First add detailed students
    for i, data in enumerate(detailed_students):
        old_id = f's{str(i//10)*7}-{str(i//10)*4}-{str(i//10)*4}-{str(i//10)*4}-{str(i//10)*12}{i%10}'
        new_id = student_uuids[old_id]
        created = datetime.now() - timedelta(days=50-i)
        
        student = {
            'id': new_id,
            'name': data['name'],
            'bio': data['bio'],
            'current_school': data['current_school'],
            'school_type': data['school_type'],
            'grade_level': data['grade_level'],
            'target_application_year': data['target_application_year'],
            'preferred_colleges': data['preferred_colleges'],
            'interests': data['interests'],
            'pain_points': data['pain_points'],
            'budget_range': data['budget_range'],
            'credit_balance': data['credit_balance'],
            'lifetime_credits_earned': data['lifetime_credits_earned'],
            'onboarding_completed': 'true',
            'onboarding_step': 0,
            'metadata': '{}',
            'created_at': created.isoformat() + 'Z',
            'updated_at': created.isoformat() + 'Z'
        }
        students.append(student)
    
    # Add remaining 40 students with basic profiles
    names = ['Lucas Thomas', 'Charlotte Jackson', 'Aiden White', 'Amelia Harris', 'Henry Martin',
             'Evelyn Thompson', 'Benjamin Clark', 'Harper Lewis', 'Jack Robinson', 'Luna Walker',
             'Sebastian Young', 'Ellie Allen', 'Owen King', 'Grace Wright', 'Leo Scott',
             'Zoe Green', 'Nathan Baker', 'Lily Adams', 'Dylan Nelson', 'Chloe Carter',
             'Ryan Mitchell', 'Hazel Perez', 'Luke Roberts', 'Aurora Turner', 'Mateo Phillips',
             'Nora Campbell', 'Asher Parker', 'Violet Evans', 'Theo Edwards', 'Stella Collins',
             'Ezra Stewart', 'Ivy Sanchez', 'Kai Morris', 'Elena Rogers', 'Miles Reed',
             'Maya Cook', 'Felix Morgan', 'Claire Bell', 'Jackson White', 'Isabella Chen']
    
    for i in range(10, 50):
        old_id = f's{str(i//10)*7}-{str(i//10)*4}-{str(i//10)*4}-{str(i//10)*4}-{str(i//10)*12}{i%10}'
        new_id = student_uuids[old_id]
        created = datetime.now() - timedelta(days=50-i)
        
        student = {
            'id': new_id,
            'name': names[i-10] if i-10 < len(names) else f'Student {i}',
            'bio': 'High school student preparing for college applications',
            'current_school': 'Regional High School',
            'school_type': 'high-school',
            'grade_level': 'senior',
            'target_application_year': 2025,
            'preferred_colleges': '{"State Universities"}',
            'interests': '{"General Studies"}',
            'pain_points': '{}',
            'budget_range': '[30,80]',
            'credit_balance': round(random.uniform(0, 10), 2),
            'lifetime_credits_earned': round(random.uniform(0, 50), 2),
            'onboarding_completed': 'true',
            'onboarding_step': 0,
            'metadata': '{}',
            'created_at': created.isoformat() + 'Z',
            'updated_at': created.isoformat() + 'Z'
        }
        students.append(student)
    
    # Write CSV
    with open('students.csv', 'w', newline='') as f:
        fieldnames = ['id', 'name', 'bio', 'current_school', 'school_type', 'grade_level',
                     'target_application_year', 'preferred_colleges', 'interests', 'pain_points',
                     'budget_range', 'credit_balance', 'lifetime_credits_earned', 
                     'onboarding_completed', 'onboarding_step', 'metadata', 'created_at', 'updated_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(students)

def update_services_csv():
    services = []
    
    # Define services for each consultant
    services_data = [
        # Sarah Chen's services
        {
            'consultant_old_id': 'c1111111-1111-1111-1111-111111111111',
            'services': [
                {
                    'service_type': 'essay_review',
                    'title': 'Comprehensive Essay Review',
                    'description': 'In-depth review of your college essays with line-by-line feedback, structural suggestions, and content recommendations',
                    'prices': '{45,75,120}',
                    'price_descriptions': '{"Single Essay","2-3 Essays","Full Application"}',
                    'delivery_type': 'async',
                    'standard_turnaround_hours': 48,
                    'total_bookings': 68,
                    'avg_rating': 4.93
                },
                {
                    'service_type': 'mock_interview',
                    'title': 'Elite College Interview Prep',
                    'description': '1-hour mock interview with Harvard interviewer experience',
                    'prices': '{85}',
                    'price_descriptions': '{"60 Minutes"}',
                    'delivery_type': 'scheduled',
                    'duration_minutes': 60,
                    'rush_available': False,
                    'total_bookings': 42,
                    'avg_rating': 4.90
                },
                {
                    'service_type': 'application_strategy',
                    'title': 'Full Application Strategy Session',
                    'description': 'Comprehensive review of your entire application strategy',
                    'prices': '{150}',
                    'price_descriptions': '{"90 Minutes"}',
                    'delivery_type': 'scheduled',
                    'duration_minutes': 90,
                    'rush_available': False,
                    'total_bookings': 22,
                    'avg_rating': 4.95
                },
                {
                    'service_type': 'school_list_help',
                    'title': 'School Selection Consultation',
                    'description': 'Personalized school list based on your profile and goals',
                    'prices': '{65}',
                    'price_descriptions': '{"Standard"}',
                    'delivery_type': 'async',
                    'standard_turnaround_hours': 24,
                    'total_bookings': 10,
                    'avg_rating': 4.88
                }
            ]
        },
        # Michael Johnson's services
        {
            'consultant_old_id': 'c2222222-2222-2222-2222-222222222221',
            'services': [
                {
                    'service_type': 'resume_help',
                    'title': 'Tech Resume Optimization',
                    'description': 'ATS-optimized resume for FAANG and tech companies',
                    'prices': '{40,65}',
                    'price_descriptions': '{"Review Only","Full Rewrite"}',
                    'delivery_type': 'async',
                    'standard_turnaround_hours': 24,
                    'total_bookings': 45,
                    'avg_rating': 4.87
                },
                {
                    'service_type': 'mock_interview',
                    'title': 'Technical Interview Coaching',
                    'description': 'Leetcode-style interview with ex-Google intern',
                    'prices': '{95,140}',
                    'price_descriptions': '{"1 Hour","1.5 Hours"}',
                    'delivery_type': 'scheduled',
                    'duration_minutes': 60,
                    'rush_available': False,
                    'allows_group_sessions': True,
                    'max_group_size': 4,
                    'total_bookings': 38,
                    'avg_rating': 4.89
                },
                {
                    'service_type': 'coding_help',
                    'title': 'CS Project Review',
                    'description': 'Portfolio and GitHub profile optimization',
                    'prices': '{55}',
                    'price_descriptions': '{"Standard"}',
                    'delivery_type': 'async',
                    'standard_turnaround_hours': 48,
                    'total_bookings': 15,
                    'avg_rating': 4.85
                }
            ]
        },
        # Emily Patel's services
        {
            'consultant_old_id': 'c3333333-3333-3333-3333-333333333331',
            'services': [
                {
                    'service_type': 'sat_tutoring',
                    'title': 'SAT Math Intensive',
                    'description': 'Personalized SAT math prep from perfect scorer',
                    'prices': '{65,95}',
                    'price_descriptions': '{"1 Hour","1.5 Hours"}',
                    'delivery_type': 'scheduled',
                    'duration_minutes': 60,
                    'rush_available': False,
                    'allows_group_sessions': True,
                    'max_group_size': 6,
                    'total_bookings': 78,
                    'avg_rating': 4.96
                },
                {
                    'service_type': 'sat_tutoring',
                    'title': 'SAT Full Test Strategy',
                    'description': 'Complete SAT strategy session with practice test review',
                    'prices': '{120}',
                    'price_descriptions': '{"2 Hours"}',
                    'delivery_type': 'scheduled',
                    'duration_minutes': 120,
                    'rush_available': False,
                    'total_bookings': 32,
                    'avg_rating': 4.94
                },
                {
                    'service_type': 'application_help',
                    'title': 'STEM Application Review',
                    'description': 'MIT student reviews your STEM applications',
                    'prices': '{50,80}',
                    'price_descriptions': '{"Single School","Multiple Schools"}',
                    'delivery_type': 'async',
                    'standard_turnaround_hours': 72,
                    'total_bookings': 28,
                    'avg_rating': 4.93
                },
                {
                    'service_type': 'essay_review',
                    'title': 'STEM Essay Excellence',
                    'description': 'Technical essay review for engineering applicants',
                    'prices': '{40,65}',
                    'price_descriptions': '{"Quick Review","Deep Dive"}',
                    'delivery_type': 'async',
                    'standard_turnaround_hours': 48,
                    'total_bookings': 18,
                    'avg_rating': 4.97
                }
            ]
        }
    ]
    
    # Add more consultants' services
    more_services = [
        # David Kim (Yale)
        {
            'consultant_old_id': 'c4444444-4444-4444-4444-444444444441',
            'services': [
                {
                    'service_type': 'essay_review',
                    'title': 'Literary Essay Analysis',
                    'description': 'Yale English major perfects your essays',
                    'prices': '{55,85,120}',
                    'price_descriptions': '{"Basic","Standard","Premium"}',
                    'delivery_type': 'async',
                    'standard_turnaround_hours': 48,
                    'total_bookings': 52,
                    'avg_rating': 4.76,
                    'is_active': False  # He's on vacation
                },
                {
                    'service_type': 'school_specific_advice',
                    'title': 'Ivy League Insider Tips',
                    'description': 'Former admissions reader shares secrets',
                    'prices': '{75}',
                    'price_descriptions': '{"60 Minutes"}',
                    'delivery_type': 'scheduled',
                    'duration_minutes': 60,
                    'rush_available': False,
                    'total_bookings': 20,
                    'avg_rating': 4.73,
                    'is_active': False
                }
            ]
        },
        # Ryan Thomas (Princeton Pre-med)
        {
            'consultant_old_id': 'c5555555-5555-5555-5555-555555555551',
            'services': [
                {
                    'service_type': 'test_prep',
                    'title': 'MCAT Comprehensive Prep',
                    'description': '524 scorer teaches MCAT strategy',
                    'prices': '{85,125}',
                    'price_descriptions': '{"2 Hours","3 Hours"}',
                    'delivery_type': 'scheduled',
                    'duration_minutes': 120,
                    'rush_available': False,
                    'allows_group_sessions': True,
                    'max_group_size': 3,
                    'total_bookings': 32,
                    'avg_rating': 4.84
                },
                {
                    'service_type': 'application_help',
                    'title': 'Medical School Application Review',
                    'description': 'Complete med school application guidance',
                    'prices': '{65,95}',
                    'price_descriptions': '{"Primary App","Primary + Secondaries"}',
                    'delivery_type': 'async',
                    'standard_turnaround_hours': 72,
                    'total_bookings': 18,
                    'avg_rating': 4.81
                },
                {
                    'service_type': 'mock_interview',
                    'title': 'Medical School Interview Prep',
                    'description': 'MMI and traditional interview practice',
                    'prices': '{90}',
                    'price_descriptions': '{"90 Minutes"}',
                    'delivery_type': 'scheduled',
                    'duration_minutes': 90,
                    'rush_available': False,
                    'total_bookings': 8,
                    'avg_rating': 4.78
                }
            ]
        }
    ]
    
    all_services_data = services_data + more_services
    
    # Add remaining consultants with basic services
    remaining_consultants = [
        ('c1111111-1111-1111-1111-111111111112', 'resume_help', 'MBA Resume Perfection', 75, 28, 4.71),
        ('c1111111-1111-1111-1111-111111111112', 'mock_interview', 'Case Interview Mastery', 120, 17, 4.69),
        ('c2222222-2222-2222-2222-222222222222', 'research_help', 'Research Proposal Writing', 85, 18, 4.86),
        ('c2222222-2222-2222-2222-222222222222', 'application_help', 'Graduate School Applications', 70, 14, 4.83),
        ('c3333333-3333-3333-3333-333333333332', 'coding_help', 'Competitive Programming Coaching', 80, 16, 4.79),
        ('c3333333-3333-3333-3333-333333333332', 'project_help', 'CS Portfolio Development', 65, 12, 4.77),
        ('c1111111-1111-1111-1111-111111111113', 'test_prep', 'LSAT Logic Games Mastery', 70, 28, 4.89),
        ('c1111111-1111-1111-1111-111111111113', 'essay_review', 'Law School Personal Statement', 60, 15, 4.87),
        ('c1111111-1111-1111-1111-111111111113', 'mock_interview', 'Law School Interview Prep', 75, 5, 4.85),
        ('c4444444-4444-4444-4444-444444444442', 'portfolio_review', 'Art Portfolio Review', 45, 10, 4.66),
        ('c5555555-5555-5555-5555-555555555552', 'application_help', 'Public Policy Applications', 55, 8, 4.73),
        ('c6666666-6666-6666-6666-666666666661', 'writing_help', 'Journalism Writing Workshop', 40, 15, 4.81),
        ('c6666666-6666-6666-6666-666666666662', 'interview_prep', 'Investment Banking Interview Prep', 110, 5, 4.68),
        ('c7777777-7777-7777-7777-777777777771', 'business_help', 'Startup Pitch Deck Review', 95, 12, 4.77),
        ('c8888888-8888-8888-8888-888888888881', 'essay_review', 'Creative Writing Excellence', 50, 2, 4.90)
    ]
    
    # Process all services
    for data in all_services_data:
        consultant_new_id = consultant_uuids[data['consultant_old_id']]
        
        for i, service in enumerate(data['services']):
            service_id = str(uuid.uuid4())
            service_uuids[f"{data['consultant_old_id']}-{i}"] = service_id
            
            if data['consultant_old_id'] not in service_map:
                service_map[data['consultant_old_id']] = []
            service_map[data['consultant_old_id']].append(service_id)
            
            created = datetime.now() - timedelta(days=45-i)
            
            service_obj = {
                'id': service_id,
                'consultant_id': consultant_new_id,
                'service_type': service['service_type'],
                'title': service['title'],
                'description': service['description'],
                'prices': service['prices'],
                'price_descriptions': service['price_descriptions'],
                'delivery_type': service['delivery_type'],
                'standard_turnaround_hours': service.get('standard_turnaround_hours', ''),
                'duration_minutes': service.get('duration_minutes', ''),
                'rush_available': 'true' if service.get('rush_available', True) else 'false',
                'rush_turnarounds': '{"1.5x": 24, "2x": 12, "3x": 6}' if service.get('rush_available', True) else '{}',
                'max_active_orders': 5,
                'is_active': 'false' if service.get('is_active') == False else 'true',
                'allows_group_sessions': 'true' if service.get('allows_group_sessions') else 'false',
                'max_group_size': service.get('max_group_size', 1),
                'total_bookings': service['total_bookings'],
                'avg_rating': service['avg_rating'],
                'metadata': '{}',
                'created_at': created.isoformat() + 'Z',
                'updated_at': created.isoformat() + 'Z'
            }
            services.append(service_obj)
    
    # Add remaining services
    for i, (consultant_old_id, service_type, title, base_price, bookings, rating) in enumerate(remaining_consultants):
        service_id = str(uuid.uuid4())
        consultant_new_id = consultant_uuids[consultant_old_id]
        
        if consultant_old_id not in service_map:
            service_map[consultant_old_id] = []
        service_map[consultant_old_id].append(service_id)
        
        created = datetime.now() - timedelta(days=40-i)
        
        service_obj = {
            'id': service_id,
            'consultant_id': consultant_new_id,
            'service_type': service_type,
            'title': title,
            'description': f'{title} service description',
            'prices': f'{{{base_price}}}',
            'price_descriptions': '{"Standard"}',
            'delivery_type': 'scheduled' if 'interview' in title.lower() or 'coaching' in title.lower() else 'async',
            'standard_turnaround_hours': 48 if 'async' in service_obj.get('delivery_type', 'async') else '',
            'duration_minutes': 60 if 'scheduled' in service_obj.get('delivery_type', 'async') else '',
            'rush_available': 'true' if 'async' in service_obj.get('delivery_type', 'async') else 'false',
            'rush_turnarounds': '{"1.5x": 24, "2x": 12, "3x": 6}' if 'async' in service_obj.get('delivery_type', 'async') else '{}',
            'max_active_orders': 5,
            'is_active': 'true',
            'allows_group_sessions': 'true' if 'workshop' in title.lower() or 'coaching' in title.lower() else 'false',
            'max_group_size': 8 if 'workshop' in title.lower() else 4 if 'coaching' in title.lower() else 1,
            'total_bookings': bookings,
            'avg_rating': rating,
            'metadata': '{}',
            'created_at': created.isoformat() + 'Z',
            'updated_at': created.isoformat() + 'Z'
        }
        services.append(service_obj)
    
    # Write CSV
    with open('services.csv', 'w', newline='') as f:
        fieldnames = ['id', 'consultant_id', 'service_type', 'title', 'description', 'prices',
                     'price_descriptions', 'delivery_type', 'standard_turnaround_hours',
                     'duration_minutes', 'rush_available', 'rush_turnarounds', 'max_active_orders',
                     'is_active', 'allows_group_sessions', 'max_group_size', 'total_bookings',
                     'avg_rating', 'metadata', 'created_at', 'updated_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(services)

def update_bookings_csv():
    bookings = []
    
    # Sample bookings
    booking_templates = [
        {
            'student_idx': 0,  # Alex Thompson
            'consultant_old_id': 'c1111111-1111-1111-1111-111111111111',  # Sarah Chen
            'service_idx': 0,  # Essay Review
            'price_tier': '2-3 Essays',
            'base_price': 75.00,
            'prompt_text': 'Please review my Common App essay about overcoming challenges',
            'essay_text': 'When I was fifteen, I discovered that failure could be my greatest teacher...',
            'requirements_text': 'Focus on narrative structure and emotional impact. This is for Harvard.',
            'status': 'completed',
            'rating': 5,
            'review_text': "Sarah's feedback was incredible! She helped me completely restructure my essay and find my authentic voice."
        },
        {
            'student_idx': 1,  # Emma Wilson
            'consultant_old_id': 'c3333333-3333-3333-3333-333333333331',  # Emily Patel
            'service_idx': 0,  # SAT Math
            'price_tier': '1.5 Hours',
            'base_price': 95.00,
            'rush_multiplier': 1.5,
            'prompt_text': 'Need urgent SAT math help for test next week',
            'requirements_text': 'Focus on geometry and advanced algebra. Current score: 680',
            'is_rush': True,
            'status': 'completed',
            'rating': 5,
            'review_text': 'Emily is amazing! My score went up 80 points.'
        }
    ]
    
    # Generate more bookings
    for i in range(50):
        booking_id = str(uuid.uuid4())
        booking_uuids[f'b{i}'] = booking_id
        
        # Randomly select student and consultant
        student_idx = i % 10
        student_old_id = f's{str(student_idx//10)*7}-{str(student_idx//10)*4}-{str(student_idx//10)*4}-{str(student_idx//10)*4}-{str(student_idx//10)*12}{student_idx%10}'
        student_new_id = student_uuids[student_old_id]
        
        consultant_old_id = list(consultant_uuids.keys())[i % len(consultant_uuids)]
        consultant_new_id = consultant_uuids[consultant_old_id]
        
        # Get a service for this consultant
        if consultant_old_id in service_map and service_map[consultant_old_id]:
            service_id = service_map[consultant_old_id][0]
        else:
            continue
        
        created = datetime.now() - timedelta(days=40-i)
        
        # Determine status
        if i < 20:
            status = 'completed'
            completed_at = created + timedelta(days=2)
            delivered_at = created + timedelta(days=1)
            rating = random.choice([4, 5, 5, 5])
            review_text = random.choice([
                'Great experience working with this consultant!',
                'Excellent feedback and very helpful.',
                'Transformed my application completely!',
                'Worth every penny. Highly recommend!'
            ])
            reviewed_at = completed_at + timedelta(hours=12)
        elif i < 25:
            status = 'in_progress'
            completed_at = ''
            delivered_at = ''
            rating = ''
            review_text = ''
            reviewed_at = ''
        elif i < 30:
            status = 'confirmed'
            completed_at = ''
            delivered_at = ''
            rating = ''
            review_text = ''
            reviewed_at = ''
        else:
            status = 'pending'
            completed_at = ''
            delivered_at = ''
            rating = ''
            review_text = ''
            reviewed_at = ''
        
        base_price = random.choice([45, 60, 75, 85, 95, 120])
        rush_multiplier = 1.5 if random.random() < 0.15 else 1
        final_price = base_price * rush_multiplier
        credits_earned = final_price * 0.02
        
        booking = {
            'id': booking_id,
            'student_id': student_new_id,
            'consultant_id': consultant_new_id,
            'service_id': service_id,
            'base_price': base_price,
            'price_tier': '',
            'rush_multiplier': rush_multiplier,
            'discount_code': '',
            'discount_amount': '',
            'final_price': final_price,
            'prompt_text': 'Booking request for service',
            'essay_text': '',
            'requirements_text': '',
            'google_doc_link': '',
            'uploaded_files': '{}',
            'is_rush': 'true' if rush_multiplier > 1 else 'false',
            'promised_delivery_at': (created + timedelta(days=2)).isoformat() + 'Z' if status in ['completed', 'in_progress'] else '',
            'delivered_at': delivered_at.isoformat() + 'Z' if delivered_at else '',
            'deliverables': '{}',
            'scheduled_at': '',
            'calendly_event_url': '',
            'meeting_link': '',
            'status': status,
            'completed_at': completed_at.isoformat() + 'Z' if completed_at else '',
            'cancelled_at': '',
            'cancelled_by': '',
            'cancellation_reason': '',
            'credits_earned': credits_earned if status == 'completed' else 0,
            'rating': rating,
            'review_text': review_text,
            'reviewed_at': reviewed_at.isoformat() + 'Z' if reviewed_at else '',
            'is_group_session': 'false',
            'max_participants': 1,
            'current_participants': 1,
            'refund_requested': 'false',
            'refund_reason': '',
            'refund_status': '',
            'refund_amount': '',
            'refunded_at': '',
            'metadata': '{}',
            'created_at': created.isoformat() + 'Z',
            'updated_at': created.isoformat() + 'Z'
        }
        bookings.append(booking)
    
    # Add group session bookings
    group_bookings = [
        {
            'student_idx': 40,
            'consultant_old_id': 'c2222222-2222-2222-2222-222222222221',  # Michael Johnson
            'service_type': 'Technical Interview Coaching',
            'is_group': True,
            'max_participants': 4,
            'current_participants': 3
        },
        {
            'student_idx': 41,
            'consultant_old_id': 'c3333333-3333-3333-3333-333333333331',  # Emily Patel
            'service_type': 'SAT Math Intensive',
            'is_group': True,
            'max_participants': 6,
            'current_participants': 5
        },
        {
            'student_idx': 42,
            'consultant_old_id': 'c6666666-6666-6666-6666-666666666661',  # Marcus Lee
            'service_type': 'Journalism Writing Workshop',
            'is_group': True,
            'max_participants': 8,
            'current_participants': 6
        }
    ]
    
    for i, group in enumerate(group_bookings):
        booking_id = str(uuid.uuid4())
        booking_uuids[f'bg{i}'] = booking_id
        
        student_old_id = f's{str(group["student_idx"]//10)*7}-{str(group["student_idx"]//10)*4}-{str(group["student_idx"]//10)*4}-{str(group["student_idx"]//10)*4}-{str(group["student_idx"]//10)*12}{group["student_idx"]%10}'
        student_new_id = student_uuids[student_old_id]
        consultant_new_id = consultant_uuids[group['consultant_old_id']]
        
        if group['consultant_old_id'] in service_map:
            service_id = service_map[group['consultant_old_id']][0]
        else:
            continue
        
        created = datetime.now() - timedelta(days=10-i)
        scheduled = datetime.now() + timedelta(days=2+i)
        
        booking = {
            'id': booking_id,
            'student_id': student_new_id,
            'consultant_id': consultant_new_id,
            'service_id': service_id,
            'base_price': random.choice([40, 65, 95]),
            'price_tier': '',
            'rush_multiplier': 1,
            'discount_code': '',
            'discount_amount': '',
            'final_price': random.choice([40, 65, 95]),
            'prompt_text': f'{group["service_type"]} group session',
            'essay_text': '',
            'requirements_text': '',
            'google_doc_link': '',
            'uploaded_files': '{}',
            'is_rush': 'false',
            'promised_delivery_at': '',
            'delivered_at': '',
            'deliverables': '{}',
            'scheduled_at': scheduled.isoformat() + 'Z',
            'calendly_event_url': '',
            'meeting_link': '',
            'status': 'confirmed',
            'completed_at': '',
            'cancelled_at': '',
            'cancelled_by': '',
            'cancellation_reason': '',
            'credits_earned': 0,
            'rating': '',
            'review_text': '',
            'reviewed_at': '',
            'is_group_session': 'true',
            'max_participants': group['max_participants'],
            'current_participants': group['current_participants'],
            'refund_requested': 'false',
            'refund_reason': '',
            'refund_status': '',
            'refund_amount': '',
            'refunded_at': '',
            'metadata': '{}',
            'created_at': created.isoformat() + 'Z',
            'updated_at': created.isoformat() + 'Z'
        }
        bookings.append(booking)
    
    # Write CSV
    with open('bookings.csv', 'w', newline='') as f:
        fieldnames = ['id', 'student_id', 'consultant_id', 'service_id', 'base_price', 'price_tier',
                     'rush_multiplier', 'discount_code', 'discount_amount', 'final_price',
                     'prompt_text', 'essay_text', 'requirements_text', 'google_doc_link',
                     'uploaded_files', 'is_rush', 'promised_delivery_at', 'delivered_at',
                     'deliverables', 'scheduled_at', 'calendly_event_url', 'meeting_link',
                     'status', 'completed_at', 'cancelled_at', 'cancelled_by', 
                     'cancellation_reason', 'credits_earned', 'rating', 'review_text',
                     'reviewed_at', 'is_group_session', 'max_participants', 
                     'current_participants', 'refund_requested', 'refund_reason',
                     'refund_status', 'refund_amount', 'refunded_at', 'metadata',
                     'created_at', 'updated_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(bookings)

def update_user_interactions_csv():
    interactions = []
    
    # Generate interactions based on bookings and browsing patterns
    for i in range(100):
        interaction_id = str(uuid.uuid4())
        interaction_uuids[f'ui{i}'] = interaction_id
        
        student_idx = i % 20
        student_old_id = f's{str(student_idx//10)*7}-{str(student_idx//10)*4}-{str(student_idx//10)*4}-{str(student_idx//10)*4}-{str(student_idx//10)*12}{student_idx%10}'
        student_new_id = student_uuids[student_old_id]
        
        created = datetime.now() - timedelta(days=45-i//2)
        
        if i % 5 == 0:
            # Search interaction
            interaction = {
                'id': interaction_id,
                'student_id': student_new_id,
                'consultant_id': '',
                'interaction_type': 'search',
                'service_type': random.choice(['essay_review', 'mock_interview', 'test_prep', 'application_help']),
                'rating': '',
                'session_id': f'sess_{i:03d}',
                'created_at': created.isoformat() + 'Z'
            }
        else:
            # View or booking interaction
            consultant_old_id = list(consultant_uuids.keys())[i % len(consultant_uuids)]
            consultant_new_id = consultant_uuids[consultant_old_id]
            
            interaction_type = random.choice(['view_profile', 'view_service', 'booking_created', 'booking_completed'])
            
            interaction = {
                'id': interaction_id,
                'student_id': student_new_id,
                'consultant_id': consultant_new_id,
                'interaction_type': interaction_type,
                'service_type': random.choice(['', 'essay_review', 'mock_interview']) if 'view' in interaction_type else '',
                'rating': random.choice([4, 5]) if interaction_type == 'booking_completed' else '',
                'session_id': f'sess_{i//10:03d}',
                'created_at': created.isoformat() + 'Z'
            }
        
        interactions.append(interaction)
    
    # Write CSV
    with open('user_interactions.csv', 'w', newline='') as f:
        fieldnames = ['id', 'student_id', 'consultant_id', 'interaction_type', 
                     'service_type', 'rating', 'session_id', 'created_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(interactions)

def update_waitlist_csv():
    waitlists = []
    
    # David Kim is on vacation, so he has a waitlist
    david_old_id = 'c4444444-4444-4444-4444-444444444441'
    david_new_id = consultant_uuids[david_old_id]
    
    waitlist_students = [
        ('s5555555-5555-5555-5555-555555555551', 1),
        ('s5555555-5555-5555-5555-555555555552', 2),
        ('s5555555-5555-5555-5555-555555555553', 3)
    ]
    
    for i, (student_old_id, position) in enumerate(waitlist_students):
        waitlist_id = str(uuid.uuid4())
        student_new_id = student_uuids[student_old_id]
        
        if david_old_id in service_map:
            service_id = service_map[david_old_id][0]
        else:
            service_id = ''
        
        created = datetime.now() - timedelta(days=3-i)
        expires = created + timedelta(days=7)
        
        waitlist = {
            'id': waitlist_id,
            'consultant_id': david_new_id,
            'student_id': student_new_id,
            'service_id': service_id,
            'position': position,
            'notified': 'false',
            'notified_at': '',
            'expires_at': expires.isoformat() + 'Z',
            'created_at': created.isoformat() + 'Z'
        }
        waitlists.append(waitlist)
    
    # Add waitlists for popular consultants
    popular_consultants = [
        ('c1111111-1111-1111-1111-111111111111', 's6666666-6666-6666-6666-666666666661'),
        ('c1111111-1111-1111-1111-111111111111', 's6666666-6666-6666-6666-666666666662'),
        ('c3333333-3333-3333-3333-333333333331', 's6666666-6666-6666-6666-666666666663'),
        ('c3333333-3333-3333-3333-333333333331', 's6666666-6666-6666-6666-666666666664')
    ]
    
    for i, (consultant_old_id, student_old_id) in enumerate(popular_consultants):
        waitlist_id = str(uuid.uuid4())
        consultant_new_id = consultant_uuids[consultant_old_id]
        student_new_id = student_uuids[student_old_id]
        
        if consultant_old_id in service_map:
            service_id = service_map[consultant_old_id][0]
        else:
            service_id = ''
        
        created = datetime.now() - timedelta(days=4-i//2)
        expires = created + timedelta(days=7)
        
        waitlist = {
            'id': waitlist_id,
            'consultant_id': consultant_new_id,
            'student_id': student_new_id,
            'service_id': service_id,
            'position': (i % 2) + 1,
            'notified': 'true' if i % 2 == 0 else 'false',
            'notified_at': (created + timedelta(hours=12)).isoformat() + 'Z' if i % 2 == 0 else '',
            'expires_at': expires.isoformat() + 'Z',
            'created_at': created.isoformat() + 'Z'
        }
        waitlists.append(waitlist)
    
    # Write CSV
    with open('consultant_waitlist.csv', 'w', newline='') as f:
        fieldnames = ['id', 'consultant_id', 'student_id', 'service_id', 'position',
                     'notified', 'notified_at', 'expires_at', 'created_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(waitlists)

def update_group_participants_csv():
    participants = []
    
    # Get group booking IDs
    group_booking_ids = [booking_uuids[f'bg{i}'] for i in range(3)]
    
    # Participants for each group
    participant_students = [
        # Technical interview group (3 participants)
        [40, 43, 44],
        # SAT Math group (5 participants)
        [41, 45, 46, 47, 48],
        # Journalism workshop (6 participants)
        [42, 49, 30, 31, 32, 33]
    ]
    
    for booking_idx, student_indices in enumerate(participant_students):
        booking_id = group_booking_ids[booking_idx]
        
        for student_idx in student_indices:
            participant_id = str(uuid.uuid4())
            student_old_id = f's{str(student_idx//10)*7}-{str(student_idx//10)*4}-{str(student_idx//10)*4}-{str(student_idx//10)*4}-{str(student_idx//10)*12}{student_idx%10}'
            student_new_id = student_uuids[student_old_id]
            
            joined = datetime.now() - timedelta(days=5-booking_idx, hours=student_idx%24)
            
            participant = {
                'id': participant_id,
                'booking_id': booking_id,
                'student_id': student_new_id,
                'joined_at': joined.isoformat() + 'Z'
            }
            participants.append(participant)
    
    # Write CSV
    with open('group_session_participants.csv', 'w', newline='') as f:
        fieldnames = ['id', 'booking_id', 'student_id', 'joined_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(participants)

def create_empty_csvs():
    # Discount codes
    with open('discount_codes.csv', 'w', newline='') as f:
        fieldnames = ['id', 'code', 'description', 'discount_type', 'discount_value',
                     'minimum_purchase', 'maximum_discount', 'valid_from', 'valid_until',
                     'max_uses', 'used_count', 'max_uses_per_user', 'consultant_id',
                     'specific_services', 'created_by', 'is_active', 'created_at', 'updated_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
    
    # Discount usage
    with open('discount_usage.csv', 'w', newline='') as f:
        fieldnames = ['id', 'discount_code_id', 'booking_id', 'user_id', 
                     'discount_applied', 'created_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
    
    # Verification queue
    with open('verification_queue.csv', 'w', newline='') as f:
        fieldnames = ['id', 'consultant_id', 'edu_email', 'university_name',
                     'document_type', 'document_url', 'auto_verify_eligible',
                     'status', 'reviewed_by', 'reviewed_at', 'admin_notes', 'created_at']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

# Save UUID mappings for reference
def save_uuid_mappings():
    mappings = {
        'consultants': consultant_uuids,
        'students': student_uuids,
        'services': service_uuids,
        'bookings': booking_uuids,
        'interactions': interaction_uuids,
        'waitlists': waitlist_uuids,
        'group_sessions': group_session_uuids
    }
    
    with open('uuid_mappings.json', 'w') as f:
        json.dump(mappings, f, indent=2)

# Execute all updates
if __name__ == '__main__':
    print("Generating proper UUIDs and updating all CSV files...")
    
    update_users_csv()
    print("✓ Users CSV updated")
    
    update_consultants_csv()
    print("✓ Consultants CSV updated")
    
    update_students_csv()
    print("✓ Students CSV updated")
    
    update_services_csv()
    print("✓ Services CSV updated")
    
    update_bookings_csv()
    print("✓ Bookings CSV updated")
    
    update_user_interactions_csv()
    print("✓ User interactions CSV updated")
    
    update_waitlist_csv()
    print("✓ Waitlist CSV updated")
    
    update_group_participants_csv()
    print("✓ Group participants CSV updated")
    
    create_empty_csvs()
    print("✓ Empty CSV files created")
    
    save_uuid_mappings()
    print("✓ UUID mappings saved")
    
    print("\nAll CSV files have been updated with proper UUIDs!")