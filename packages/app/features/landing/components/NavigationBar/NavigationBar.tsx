import * as React from 'react'
import { TextLink } from 'solito/link'
import styles from './NavigationBar.module.css'

export function NavigationBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <TextLink href="/">
          <div className={styles.logo}>
            <img 
              src="/images/proofr-logo.png"
              alt="Proofr Logo"
              className={styles.logoImage}
            />
            <span className={styles.logoText}>proofr</span>
          </div>
        </TextLink>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <TextLink href="/student-dashboard">
            <span className={styles.navLink}>Browse Consultants</span>
          </TextLink>
          <TextLink href="/how-it-works">
            <span className={styles.navLink}>How It Works</span>
          </TextLink>
          <TextLink href="/become-consultant">
            <span className={styles.navLink}>Become a Consultant</span>
          </TextLink>
          <TextLink href="/about">
            <span className={styles.navLink}>About</span>
          </TextLink>
        </div>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          <TextLink href="/sign-in">
            <div className={styles.signInButton}>
              Sign In
            </div>
          </TextLink>
          <TextLink href="/onboarding">
            <div className={styles.signUpButton}>
              Get Started
            </div>
          </TextLink>
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuButton}>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
      </div>
    </nav>
  )
}