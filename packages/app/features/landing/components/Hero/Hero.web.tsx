import React from 'react'
import { TextLink } from 'solito/link'
import { NavigationBar } from '../NavigationBar'
import styles from './Hero.module.css'

export function Hero() {
  const consultants = [
    {
      name: 'Ashley H.',
      university: 'Stanford University',
      year: "'26",
      service: 'Essay Reviews',
      price: 45,
      avatar: 'AH',
      color: 'stanford',
      description: 'Specialized in personal statements and supplemental essays. Helped 50+ students get into top schools.'
    },
    {
      name: 'Imane A.',
      university: 'MIT',
      year: "'25",
      service: 'Application Strategy',
      price: 60,
      avatar: 'IA',
      color: 'mit',
      description: 'Expert in STEM applications and research positioning. Published researcher with proven results.'
    },
    {
      name: 'Cameron K.',
      university: 'Duke University',
      year: "'24",
      service: 'Essay Reviews',
      price: 40,
      avatar: 'CK',
      color: 'duke',
      description: 'Founder & consultant. Specializes in leadership essays and scholarship applications.'
    },
    {
      name: 'Sean D.',
      university: 'Yale University',
      year: "'26",
      service: 'Essay Reviews',
      price: 50,
      avatar: 'SD',
      color: 'yale',
      description: 'English major with expertise in storytelling and narrative structure for college essays.'
    }
  ]

  return (
    <>
      <NavigationBar />
      <div className={styles.hero}>
        <div className={styles.container}>
          {/* Content Column */}
          <div className={styles.content}>
            {/* Logo Section - Bigger and Higher */}
            <div className={styles.logoSection}>
              <img 
                src="/images/proofr-logo.png"
                alt="Proofr Logo"
                className={styles.logo}
              />
              <h1 className={styles.logoText}>proofr</h1>
            </div>

            {/* Main Headline */}
            <div className={styles.headline}>
              <h2 className={styles.title}>
                Get Into Your 
                <span className={styles.gradient}> Dream School</span>
              </h2>
              <p className={styles.subtitle}>
                Connect with current students at Harvard, Stanford, MIT & top universities. 
                Get personalized admissions guidance at affordable prices.
              </p>
            </div>

            {/* Value Props */}
            <div className={styles.valueProps}>
              <div className={styles.valueProp}>
                <span className={styles.emoji}>📝</span>
                <span className={styles.valueText}>Essay Reviews</span>
              </div>
              <div className={styles.valueProp}>
                <span className={styles.emoji}>💬</span>
                <span className={styles.valueText}>Mock Interviews</span>
              </div>
              <div className={styles.valueProp}>
                <span className={styles.emoji}>🎯</span>
                <span className={styles.valueText}>Strategy Sessions</span>
              </div>
            </div>

            {/* CTAs */}
            <div className={styles.ctaSection}>
              <TextLink href="/browse">
                <button className={styles.primaryButton}>
                  Find a Consultant
                </button>
              </TextLink>
              
              <TextLink href="/become-consultant">
                <button className={styles.secondaryButton}>
                  Become a Consultant
                </button>
              </TextLink>
            </div>

            {/* Trust Signal */}
            <p className={styles.trustSignal}>
              Trusted by 10,000+ students • Featured consultants from 50+ top universities
            </p>
          </div>

          {/* Visual Column - Enhanced */}
          <div className={styles.visual}>
            <div className={styles.consultantGrid}>
              {consultants.map((consultant, index) => (
                <div key={consultant.name} className={`${styles.consultantCard} ${styles[`card${index + 1}`]}`}>
                  <div className={`${styles.avatar} ${styles[consultant.color]}`}>
                    {consultant.avatar}
                  </div>
                  <h4 className={styles.consultantName}>{consultant.name}</h4>
                  <p className={styles.consultantSchool}>
                    {consultant.university} {consultant.year}
                  </p>
                  <p className={styles.consultantService}>{consultant.service}</p>
                  <p className={styles.consultantDescription}>
                    {consultant.description}
                  </p>
                  <div className={styles.cardFooter}>
                    <p className={styles.consultantPrice}>From ${consultant.price}</p>
                    <button className={styles.viewProfileButton}>View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}