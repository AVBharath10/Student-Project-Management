// src/Layout/Layout.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import styles from './Layout.module.scss';

function Layout({ children }) {
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>Studo</div>
        <nav className={styles.navMenu}>
          <button onClick={() => navigate('/dashboard')}>
            <i className="fas fa-home"></i> Dashboard
          </button>
          <button onClick={() => navigate('/projects')}>
            <i className="fas fa-tasks"></i> Projects
          </button>
          <button>
            <i className="fas fa-calendar-alt"></i> Calendar
          </button>
          <button>
            <i className="fas fa-users"></i> Teams
          </button>
          <button>
            <i className="fas fa-cog"></i> Settings
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}

export default Layout;