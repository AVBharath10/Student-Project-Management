// src/pages/Landing/Landing.jsx
import { motion } from 'framer-motion';
import styles from './Landing.module.scss';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/dashboard'); // Redirect if already logged in
    }
  }, []);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={styles.header}>
        <h1 className={styles.logo}>Studo</h1>
      </header>

      <main className={styles.hero}>
        <div className={styles.content}>
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className={styles.title}
          >
            Collaborate. Manage. Succeed.
          </motion.h1>
          <p className={styles.subtitle}>
            The ultimate academic project management tool for student teams
          </p>

          <div className={styles.ctaContainer}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup" className={styles.primaryButton}>
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className={styles.secondaryButton}>
                I already have an account
              </Link>
            </motion.div>
          </div>
        </div>

        <div className={styles.illustration}>
          {/* Add your illustration or image here */}
        </div>
      </main>
    </motion.div>
  );
}