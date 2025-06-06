import React from 'react'
import { TextLink } from 'solito/link'
import { NavigationBar } from '../NavigationBar'
import styles from './Hero.mobile.module.css'

export function Hero() {
  return (
    <>
      <NavigationBar />
      <div className={styles.hero}>
        {/* Mobile-Optimized Video Background */}
        <div className={styles.videoBackground}>
          <div className={styles.videoPlaceholder}>
            <div className={styles.videoIcon}>🎬</div>
            <p className={styles.videoDescription}>
              Hero video optimized for mobile: Quick 15-second story of success
            </p>
          </div>
        </div>

        <div className={styles.container}>
          {/* Mobile-First Logo Section */}
          <div className={styles.logoSection}>
            <img 
              src="/images/proofr-logo.png"
              alt="Proofr Logo"
              className={styles.logo}
            />
            <h1 className={styles.logoText}>proofr</h1>
          </div>

          {/* Authority Badge - Mobile Sized */}
          <div className={styles.authorityBadge}>
            <span className={styles.eliteLabel}>Elite Network</span>
            <span className={styles.eliteStats}>500+ Top Students</span>
          </div>

          {/* Mobile Headline - Shorter */}
          <div className={styles.headline}>
            <h2 className={styles.title}>
              Get Into Your 
              <span className={styles.gradient}> Dream School</span>
            </h2>
            <p className={styles.subtitle}>
              Connect with verified students from Harvard, Stanford, MIT. 
              Get personalized admissions guidance.
            </p>
          </div>

          {/* Fiverr-Inspired Dual CTAs */}
          <div className={styles.mainCtaSection}>
            <TextLink href="/browse">
              <button className={styles.primaryCta}>
                <div className={styles.ctaIcon}>🔍</div>
                <div className={styles.ctaContent}>
                  <span className={styles.ctaTitle}>Find a Consultant</span>
                  <span className={styles.ctaSubtext}>Browse top students</span>
                </div>
              </button>
            </TextLink>
            
            <TextLink href="/become-consultant">
              <button className={styles.secondaryCta}>
                <div className={styles.ctaIcon}>💼</div>
                <div className={styles.ctaContent}>
                  <span className={styles.ctaTitle}>Earn as Consultant</span>
                  <span className={styles.ctaSubtext}>$50+ per session</span>
                </div>
              </button>
            </TextLink>
          </div>

          {/* Mobile-Optimized Trust Stats */}
          <div className={styles.trustSection}>
            <div className={styles.trustStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>94%</span>
                <span className={styles.statLabel}>Success Rate</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>10K+</span>
                <span className={styles.statLabel}>Students</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>$45</span>
                <span className={styles.statLabel}>Avg. Price</span>
              </div>
            </div>
          </div>

          {/* Quick Auth Section - Modern & Minimal */}
          <div className={styles.quickAuthSection}>
            <p className={styles.authPrompt}>Join thousands of students</p>
            <div className={styles.socialAuth}>
              <button className={styles.googleAuth}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                  alt="Google"
                  className={styles.googleIcon}
                  width="20" 
                  height="20"
                />
                <span>Continue with Google</span>
              </button>
              <button className={styles.xAuth}>
                <svg className={styles.xIcon} viewBox="0 0 24 24" width="18" height="18" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Continue with X</span>
              </button>
            </div>
            <div className={styles.authDivider}>
              <span>OR</span>
            </div>
            <TextLink href="/signup">
              <button className={styles.emailAuth}>
                Sign up with Email
              </button>
            </TextLink>
            <p className={styles.loginPrompt}>
              Already have an account? <TextLink href="/login" className={styles.loginLink}>Log in</TextLink>
            </p>
          </div>

          {/* Featured Consultant Preview - Mobile Card */}
          <div className={styles.featuredPreview}>
            <h3 className={styles.previewTitle}>Top Consultant</h3>
            <div className={styles.consultantCard}>
              <div className={styles.consultantImage}>
                <div className={styles.avatar}>AH</div>
                <div className={styles.universityBadge}>Stanford '26</div>
              </div>
              <div className={styles.consultantInfo}>
                <h4 className={styles.consultantName}>Ashley H.</h4>
                <p className={styles.consultantBio}>
                  "Helped 50+ students with essays"
                </p>
                <div className={styles.consultantMeta}>
                  <span className={styles.rating}>5.0 ⭐</span>
                  <span className={styles.price}>From $45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}