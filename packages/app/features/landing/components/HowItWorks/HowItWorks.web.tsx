import React from 'react'
import { TextLink } from 'solito/link'
import styles from './HowItWorks.module.css'

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Browse & Choose',
      description: 'Search through hundreds of verified consultants from top universities. Filter by school, specialty, and price to find your perfect match.',
      icon: '🔍',
      color: 'blue'
    },
    {
      number: '2',
      title: 'Book & Connect',
      description: 'Schedule a session that fits your timeline. Connect instantly via video call and start working on your application materials.',
      icon: '📅',
      color: 'green'
    },
    {
      number: '3',
      title: 'Get Results',
      description: 'Receive personalized feedback, actionable insights, and the confidence you need to submit your best application.',
      icon: '🎯',
      color: 'purple'
    }
  ]

  return (
    <section className={styles.howItWorksSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>How Proofr Works</h2>
          <p className={styles.subtitle}>
            Get personalized college admissions help from students who've been through the process at your target schools
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              {index < steps.length - 1 && <div className={styles.connector}>→</div>}
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <TextLink href="/browse">
            <button className={styles.ctaButton}>Get Started Today</button>
          </TextLink>
        </div>
      </div>
    </section>
  )
} 