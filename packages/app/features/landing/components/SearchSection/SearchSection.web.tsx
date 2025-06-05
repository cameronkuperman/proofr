import React from 'react'
import { TextLink } from 'solito/link'
import styles from './SearchSection.module.css'

export function SearchSection() {
  const popularServices = [
    {
      title: 'Essay Reviews',
      icon: '📝',
      count: '200+',
      description: 'Personal statements & supplements',
      href: '/services/essay-review',
      color: '#3b82f6'
    },
    {
      title: 'Mock Interviews',
      icon: '🎤',
      count: '150+',
      description: 'Admission interview prep',
      href: '/services/mock-interview',
      color: '#10b981'
    },
    {
      title: 'Application Strategy',
      icon: '🎯',
      count: '100+',
      description: 'School selection & planning',
      href: '/services/application-strategy',
      color: '#f59e0b'
    },
    {
      title: 'Resume Reviews',
      icon: '📄',
      count: '80+',
      description: 'Activities & achievements',
      href: '/services/resume-review',
      color: '#8b5cf6'
    }
  ]

  return (
    <section className={styles.searchSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Popular Services</h2>
          <p className={styles.subtitle}>
            Get expert help from students who succeeded at your target schools
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {popularServices.map((service) => (
            <TextLink key={service.title} href={service.href}>
              <div className={styles.serviceCard} style={{ '--accent-color': service.color } as React.CSSProperties}>
                <div className={styles.serviceIcon}>
                  <span className={styles.icon}>{service.icon}</span>
                </div>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>
                  <div className={styles.serviceStats}>
                    <span className={styles.consultantCount}>{service.count} consultants</span>
                    <span className={styles.arrow}>→</span>
                  </div>
                </div>
              </div>
            </TextLink>
          ))}
        </div>

        <div className={styles.browseAll}>
          <TextLink href="/browse">
            <button className={styles.browseButton}>
              Browse All Services
            </button>
          </TextLink>
        </div>
      </div>
    </section>
  )
} 