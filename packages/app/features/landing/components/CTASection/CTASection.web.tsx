import React from 'react'
import { TextLink } from 'solito/link'
import styles from './CTASection.module.css'

export function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Ready to Get Into Your Dream School?</h2>
          <p className={styles.subtitle}>
            Join thousands of students who have successfully navigated college admissions 
            with personalized guidance from current students at top universities.
          </p>

          <div className={styles.valueProps}>
            <div className={styles.valueProp}>
              <span className={styles.icon}>⚡</span>
              <div>
                <h4 className={styles.propTitle}>Get Started Today</h4>
                <p className={styles.propDescription}>Browse consultants and book instantly</p>
              </div>
            </div>
            <div className={styles.valueProp}>
              <span className={styles.icon}>💰</span>
              <div>
                <h4 className={styles.propTitle}>Affordable Pricing</h4>
                <p className={styles.propDescription}>Starting at just $25 per session</p>
              </div>
            </div>
            <div className={styles.valueProp}>
              <span className={styles.icon}>🎯</span>
              <div>
                <h4 className={styles.propTitle}>Proven Results</h4>
                <p className={styles.propDescription}>94% acceptance rate to top schools</p>
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <TextLink href="/browse-consultants">
              <button className={styles.primaryButton}>Find Your Consultant</button>
            </TextLink>
            <TextLink href="/become-consultant">
              <button className={styles.secondaryButton}>Become a Consultant</button>
            </TextLink>
          </div>

          <p className={styles.trustSignal}>
            🔒 Secure payments • 💬 24/7 support • ⭐ Money-back guarantee
          </p>
        </div>
      </div>
    </section>
  )
} 