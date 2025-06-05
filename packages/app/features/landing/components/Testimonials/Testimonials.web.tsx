import React from 'react'
import styles from './Testimonials.module.css'

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah M.',
      school: 'Harvard University',
      quote: 'The essay feedback I received was incredible. My consultant helped me find my authentic voice and tell my story in a way that really resonated with admissions officers.',
      service: 'Essay Review',
      rating: 5,
      avatar: 'SM'
    },
    {
      name: 'David L.',
      school: 'Stanford University',
      quote: 'The mock interview sessions completely transformed my confidence. I went from nervous wreck to feeling excited about interviews. Got into my dream school!',
      service: 'Mock Interview',
      rating: 5,
      avatar: 'DL'
    },
    {
      name: 'Maya P.',
      school: 'MIT',
      quote: 'My consultant helped me create a strategic application plan that highlighted my strengths. Their insider knowledge of the admissions process was invaluable.',
      service: 'Strategy Session',
      rating: 5,
      avatar: 'MP'
    }
  ]

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Success Stories</h2>
          <p className={styles.subtitle}>
            Real students, real results. See how Proofr helped them get into their dream schools.
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className={styles.testimonialCard}>
              <div className={styles.stars}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className={styles.star}>⭐</span>
                ))}
              </div>
              
              <blockquote className={styles.quote}>
                "{testimonial.quote}"
              </blockquote>

              <div className={styles.testimonialFooter}>
                <div className={styles.avatar}>{testimonial.avatar}</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{testimonial.name}</div>
                  <div className={styles.authorSchool}>{testimonial.school}</div>
                  <div className={styles.service}>{testimonial.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 