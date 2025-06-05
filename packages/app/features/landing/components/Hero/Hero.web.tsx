import React from 'react'
import { TextLink } from 'solito/link'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        {/* Content Column */}
        <div className={styles.content}>
          {/* Logo */}
          <div className={styles.logoSection}>
            <img 
              src="/images/proofr-logo.png"
              alt="Proofr Logo"
              className={styles.logo}
            />
            <h2 className={styles.logoText}>proofr</h2>
          </div>

          {/* Main Headline */}
          <div className={styles.headline}>
            <h1 className={styles.title}>
              Get Into Your 
              <span className={styles.gradient}> Dream School</span>
            </h1>
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

        {/* Visual Column */}
        <div className={styles.visual}>
          <div className={styles.consultantGrid}>
            {/* Sample Consultant Cards */}
            <div className={`${styles.consultantCard} ${styles.card1}`}>
              <div className={`${styles.avatar} ${styles.harvard}`}>H</div>
              <h4 className={styles.consultantName}>Sarah Chen</h4>
              <p className={styles.consultantSchool}>Harvard '26</p>
              <p className={styles.consultantService}>Essay Reviews</p>
              <p className={styles.consultantPrice}>$25</p>
            </div>

            <div className={`${styles.consultantCard} ${styles.card2}`}>
              <div className={`${styles.avatar} ${styles.stanford}`}>S</div>
              <h4 className={styles.consultantName}>Marcus Kim</h4>
              <p className={styles.consultantSchool}>Stanford '25</p>
              <p className={styles.consultantService}>Mock Interviews</p>
              <p className={styles.consultantPrice}>$40</p>
            </div>

            <div className={`${styles.consultantCard} ${styles.card3}`}>
              <div className={`${styles.avatar} ${styles.mit}`}>M</div>
              <h4 className={styles.consultantName}>Emily Rodriguez</h4>
              <p className={styles.consultantSchool}>MIT '27</p>
              <p className={styles.consultantService}>App Strategy</p>
              <p className={styles.consultantPrice}>$60</p>
            </div>

            <div className={`${styles.consultantCard} ${styles.card4}`}>
              <div className={`${styles.avatar} ${styles.duke}`}>D</div>
              <h4 className={styles.consultantName}>Alex Thompson</h4>
              <p className={styles.consultantSchool}>Duke '26</p>
              <p className={styles.consultantService}>All Services</p>
              <p className={styles.consultantPrice}>$35</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}