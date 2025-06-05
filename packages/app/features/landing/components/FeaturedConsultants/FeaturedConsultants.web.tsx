import React from 'react'
import { TextLink } from 'solito/link'
import styles from './FeaturedConsultants.module.css'

export function FeaturedConsultants() {
  const consultants = [
    {
      name: 'Ashley H.',
      university: 'Stanford',
      graduationYear: "'26",
      avatar: 'AH',
      specialty: 'Essay Reviews',
      sessions: '150+',
      rating: '5.0',
      reviews: 47,
      price: '$45',
      bio: 'I helped 50+ students craft compelling personal statements. My approach focuses on authentic storytelling that showcases your unique perspective.',
      color: '#8c1515'
    },
    {
      name: 'Imane A.',
      university: 'MIT',
      graduationYear: "'25",
      avatar: 'IA',
      specialty: 'Mock Interviews',
      sessions: '120+',
      rating: '4.9',
      reviews: 38,
      price: '$50',
      bio: 'Former admissions interviewer who knows what top schools are looking for. I help students shine in their interviews with confidence.',
      color: '#750014'
    },
    {
      name: 'Cameron K.',
      university: 'Duke',
      graduationYear: "'24",
      avatar: 'CK',
      specialty: 'Application Strategy',
      sessions: '200+',
      rating: '4.8',
      reviews: 52,
      price: '$55',
      bio: 'Comprehensive admissions strategist who helped students get into 8 Ivy League schools. I focus on building compelling narratives.',
      color: '#012169'
    }
  ]

  return (
    <section className={styles.featuredSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Meet Our Top Consultants</h2>
          <p className={styles.subtitle}>
            Real students with proven track records at the schools you want to attend
          </p>
        </div>

        <div className={styles.consultantsGrid}>
          {consultants.map((consultant) => (
            <div key={consultant.name} className={styles.consultantCard}>
              <div className={styles.consultantHeader}>
                <div 
                  className={styles.avatar}
                  style={{ backgroundColor: consultant.color }}
                >
                  {consultant.avatar}
                </div>
                <div className={styles.consultantInfo}>
                  <h3 className={styles.consultantName}>{consultant.name}</h3>
                  <div className={styles.universityBadge}>
                    <span className={styles.universityName}>{consultant.university}</span>
                    <span className={styles.graduationYear}>{consultant.graduationYear}</span>
                  </div>
                </div>
              </div>

              <p className={styles.consultantBio}>{consultant.bio}</p>

              <div className={styles.consultantSpecs}>
                <span className={styles.specialty}>{consultant.specialty}</span>
                <span className={styles.sessions}>{consultant.sessions} Sessions</span>
                <span className={styles.rating}>{consultant.rating} ⭐ ({consultant.reviews})</span>
              </div>

              <div className={styles.pricing}>
                <span className={styles.price}>From {consultant.price}</span>
                <TextLink href={`/consultant/${consultant.name.toLowerCase().replace(' ', '-')}`}>
                  <button className={styles.viewProfileBtn}>View Profile</button>
                </TextLink>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.browseAll}>
          <TextLink href="/browse-consultants">
            <button className={styles.browseAllBtn}>
              Browse All Consultants
            </button>
          </TextLink>
        </div>
      </div>
    </section>
  )
} 