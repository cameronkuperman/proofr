import * as React from 'react'
import styles from './TrustSignals.module.css'

export function TrustSignals() {
  const universities = [
    { name: 'Harvard', logo: '/logos/harvard.svg', letter: 'H', color: '#a41e22' },
    { name: 'Stanford', logo: '/logos/stanford.svg', letter: 'S', color: '#8c1515' },
    { name: 'MIT', logo: '/logos/mit.svg', letter: 'M', color: '#750014' },
    { name: 'Yale', logo: '/logos/yale.svg', letter: 'Y', color: '#00356b' },
    { name: 'Princeton', logo: '/logos/princeton.svg', letter: 'P', color: '#e87722' },
    { name: 'Columbia', logo: '/logos/columbia.svg', letter: 'C', color: '#b9d9eb' },
    { name: 'UPenn', logo: '/logos/upenn.svg', letter: 'U', color: '#011f5b' },
    { name: 'Brown', logo: '/logos/brown.svg', letter: 'B', color: '#4e3629' },
    { name: 'Cornell', logo: '/logos/cornell.svg', letter: 'C', color: '#b31b1b' },
    { name: 'Dartmouth', logo: '/logos/dartmouth.svg', letter: 'D', color: '#00693e' },
    { name: 'Duke', logo: '/logos/duke.svg', letter: 'D', color: '#012169' },
    { name: 'Northwestern', logo: '/logos/northwestern.svg', letter: 'N', color: '#4e2a84' }
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
          {universities.map((university) => (
            <div key={university.name} className={styles.universityCard}>
              {university.logo ? (
                <img src={university.logo} alt={university.name + ' logo'} className={styles.universityImg} />
              ) : (
                <div 
                  className={styles.universityLogo}
                  style={{ backgroundColor: university.color }}
                >
                  {university.letter}
                </div>
              )}
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