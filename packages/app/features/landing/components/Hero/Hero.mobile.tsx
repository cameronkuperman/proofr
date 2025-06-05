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
                <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
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