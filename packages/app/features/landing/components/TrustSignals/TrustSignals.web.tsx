import React from 'react'
import styles from './TrustSignals.module.css'

export function TrustSignals() {
  const universities = [
    { name: 'Harvard', logo: 'H', color: '#a41e22' },
    { name: 'Stanford', logo: 'S', color: '#8c1515' },
    { name: 'MIT', logo: 'M', color: '#750014' },
    { name: 'Yale', logo: 'Y', color: '#00356b' },
    { name: 'Princeton', logo: 'P', color: '#e87722' },
    { name: 'Columbia', logo: 'C', color: '#b9d9eb' },
    { name: 'UPenn', logo: 'U', color: '#011f5b' },
    { name: 'Brown', logo: 'B', color: '#4e3629' },
    { name: 'Cornell', logo: 'C', color: '#b31b1b' },
    { name: 'Dartmouth', logo: 'D', color: '#00693e' },
    { name: 'Duke', logo: 'D', color: '#012169' },
    { name: 'Northwestern', logo: 'N', color: '#4e2a84' }
  ]

  return (
    <section className={styles.trustSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Trusted by Students From</h3>
          <p className={styles.subtitle}>
            Current students and recent graduates from top universities
          </p>
        </div>

        <div className={styles.universityGrid}>
          {universities.map((university, index) => (
            <div key={university.name} className={styles.universityCard}>
              <div 
                className={styles.universityLogo}
                style={{ backgroundColor: university.color }}
              >
                {university.logo}
              </div>
              <span className={styles.universityName}>{university.name}</span>
            </div>
          ))}
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Expert Consultants</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>10,000+</span>
            <span className={styles.statLabel}>Students Helped</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>94%</span>
            <span className={styles.statLabel}>Success Rate</span>
          </div>
        </div>
      </div>
    </section>
  )
} 