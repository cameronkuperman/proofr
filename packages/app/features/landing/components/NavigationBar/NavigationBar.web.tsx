import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import styles from './NavigationBar.module.css'

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <Link 
              href="/browse" 
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Consultants
            </Link>
            <Link 
              href="/how-it-works" 
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/become-consultant" 
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Become a Consultant
            </Link>
            <Link 
              href="/about" 
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className={styles.mobileAuthButtons}>
              <Link 
                href="/sign-in" 
                className={styles.mobileSignInButton}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/onboarding" 
                className={styles.mobileSignUpButton}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}