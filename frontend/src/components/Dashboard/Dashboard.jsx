// src/Dashboard/Dashboard.jsx
import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';

function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>Studo</div>
        <nav className={styles.navMenu}>
          <button className={styles.active}>
            <i className="fas fa-home"></i> Dashboard
          </button>
          <button>
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

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!</h1>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search..." />
            <i className="fas fa-search"></i>
          </div>
        </header>

        <div className={styles.contentGrid}>
          {/* Stats Cards */}
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <h3>Active Projects</h3>
              <p>5</p>
              <i className="fas fa-folder-open"></i>
            </div>
            <div className={styles.statCard}>
              <h3>Upcoming Deadlines</h3>
              <p>3</p>
              <i className="fas fa-clock"></i>
            </div>
            <div className={styles.statCard}>
              <h3>Team Members</h3>
              <p>8</p>
              <i className="fas fa-users"></i>
            </div>
          </div>

          {/* Recent Projects */}
          <div className={styles.projectsSection}>
            <h2>Recent Projects</h2>
            <div className={styles.projectCards}>
              {[1, 2, 3].map((project) => (
                <div key={project} className={styles.projectCard}>
                  <h3>Project {project}</h3>
                  <p>Last updated 2 days ago</p>
                  <div className={styles.progressBar}>
                    <div style={{ width: `${project * 30}%` }}></div>
                  </div>
                  <div className={styles.teamAvatars}>
                    {[1, 2, 3].map((avatar) => (
                      <div key={avatar} className={styles.avatar}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sidebar */}
      <div className={styles.profileSidebar}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" />
            ) : (
              <span>{user?.email?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <h3>{user?.displayName || user?.email?.split('@')[0]}</h3>
          <p>{user?.email}</p>
        </div>

        <div className={styles.profileStats}>
          <div className={styles.statItem}>
            <span>Projects</span>
            <strong>5</strong>
          </div>
          <div className={styles.statItem}>
            <span>Teams</span>
            <strong>3</strong>
          </div>
          <div className={styles.statItem}>
            <span>Tasks</span>
            <strong>12</strong>
          </div>
        </div>

        <div className={styles.upcomingTasks}>
          <h4>Upcoming Tasks</h4>
          <ul>
            <li>Complete project proposal</li>
            <li>Team meeting at 3PM</li>
            <li>Review design mockups</li>
          </ul>
        </div>

        <button onClick={handleLogout} className={styles.logoutButton}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;