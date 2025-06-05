import React from 'react'
import { TextLink } from 'solito/link'
import styles from './ServicesGrid.module.css'

export function ServicesGrid() {
  const serviceCategories = [
    {
      title: 'Essay Specialists',
      icon: '📝',
      description: 'Current students who crafted winning personal statements and supplemental essays. Get authentic feedback from those who succeeded at your target schools.',
      consultantCount: '200+',
      rating: '4.9',
      href: '/services/essay-reviews'
    },
    {
      title: 'Interview Coaches',
      icon: '🎤',
      description: 'Students who aced admissions interviews at Harvard, Stanford, MIT and more. Practice with real questions and get insider tips.',
      consultantCount: '150+',
      rating: '4.8',
      href: '/services/mock-interviews'
    },
    {
      title: 'Strategy Experts',
      icon: '🎯',
      description: 'Holistic application strategists who navigated complex admissions landscapes. Get comprehensive guidance on school selection and timeline.',
      consultantCount: '100+',
      rating: '4.9',
      href: '/services/application-strategy'
    },
    {
      title: 'All-in-One Packages',
      icon: '🏆',
      description: 'Complete admissions support from application strategy to final submissions. Work with dedicated consultants for end-to-end guidance.',
      consultantCount: '50+',
      rating: '5.0',
      href: '/services/premium-packages',
      featured: true
    }
  ]

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Leverage Elite Student Expertise</h2>
          <p className={styles.subtitle}>
            We are the largest network of verified college students from top universities, 
            ready to help you succeed in admissions.
          </p>
        </div>

        <div className={styles.serviceGrid}>
          {serviceCategories.map((service) => (
            <TextLink key={service.title} href={service.href}>
              <div className={`${styles.serviceCard} ${service.featured ? styles.featuredCard : ''}`}>
                {service.featured && <div className={styles.premiumBadge}>Most Popular</div>}
                
                <div className={styles.serviceIcon}>
                  <div className={styles.iconWrapper}>
                    <span className={styles.icon}>{service.icon}</span>
                  </div>
                </div>

                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>

                <div className={styles.serviceStats}>
                  <span className={styles.consultantCount}>{service.consultantCount} Consultants</span>
                  <span className={styles.avgRating}>{service.rating} ⭐</span>
                </div>
              </div>
            </TextLink>
          ))}
        </div>
      </div>
    </section>
  )
} 