import * as React from 'react'
import Link from 'next/link'
import styles from './NavigationBar.module.css'

export function NavigationBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <>
            <img 
              src="/images/proofr-logo.png"
              alt="Proofr Logo"
              className={styles.logoImage}
            />
            <span className={styles.logoText}>proofr</span>
          </>
        </Link>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <Link href="/browse" className={styles.navLink}>
            Browse Consultants
          </Link>
          <Link href="/how-it-works" className={styles.navLink}>
            How It Works
          </Link>
          <Link href="/become-consultant" className={styles.navLink}>
            Become a Consultant
          </Link>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          <Link href="/sign-in" className={styles.signInButton}>
            Sign In
          </Link>
          <Link href="/onboarding" className={styles.signUpButton}>
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuButton}>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
      </div>
    </nav>
  );
}