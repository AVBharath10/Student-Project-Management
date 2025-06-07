// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { useNavigate, Outlet } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import styles from './Dashboard.module.scss';

function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('userId', '==', user.uid)
      );
      const projectsUnsubscribe = onSnapshot(projectsQuery, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
      });

      const teamsQuery = query(
        collection(db, 'teams'),
        where('members', 'array-contains', user.uid)
      );
      const teamsUnsubscribe = onSnapshot(teamsQuery, (snapshot) => {
        const teamsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeams(teamsData);
      });

      const tasksQuery = query(
        collection(db, 'tasks'),
        where('assignedTo', '==', user.uid)
      );
      const tasksUnsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);
      });

      return () => {
        projectsUnsubscribe();
        teamsUnsubscribe();
        tasksUnsubscribe();
      };
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      await addDoc(collection(db, 'projects'), {
        name: newProjectName,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: 0,
        teamMembers: [user.uid]
      });
      setNewProjectName('');
      setShowAddProjectModal(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const upcomingDeadlines = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = task.dueDate.toDate();
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).length;

  const teamMembersCount = new Set(
    teams.flatMap(team => team.members)
  ).size;

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>Studo</div>
        <nav className={styles.navMenu}>
          <button className={styles.active}>
            <i className="fas fa-home"></i> Dashboard
          </button>
          <button onClick={() => navigate('/dashboard/projects')}>
            <i className="fas fa-tasks"></i> Projects
          </button>
          <button onClick={() => navigate('/dashboard/calendar')}>
            <i className="fas fa-calendar-alt"></i> Calendar
          </button>
          <button onClick={() => navigate('/dashboard/teams')}>
            <i className="fas fa-users"></i> Teams
          </button>
          <button onClick={() => navigate('/dashboard/settings')}>
            <i className="fas fa-cog"></i> Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!</h1>
          <div className={styles.headerRight}>
            <div className={styles.searchBar}>
              <input type="text" placeholder="Search..." />
              <i className="fas fa-search"></i>
            </div>
            <div className={styles.profileIconContainer} onClick={toggleProfileDropdown}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className={styles.profileIcon} />
              ) : (
                <div className={styles.profileIcon}>
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
              {showProfileDropdown && (
                <div className={styles.profileDropdown}>
                  <div className={styles.profileInfo}>
                    <h3>{user?.displayName || user?.email?.split('@')[0]}</h3>
                    <p>{user?.email}</p>
                  </div>
                  <div className={styles.profileStats}>
                    <div className={styles.statItem}>
                      <span>Projects</span>
                      <strong>{projects.length}</strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Teams</span>
                      <strong>{teams.length}</strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Tasks</span>
                      <strong>{tasks.length}</strong>
                    </div>
                  </div>
                  <div className={styles.dropdownMenu}>
                    <button onClick={() => navigate('/profile')}>
                      <i className="fas fa-user"></i> View Profile
                    </button>
                    <button onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className={styles.contentGrid}>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <h3>Active Projects</h3>
              <p>{projects.length}</p>
              <i className="fas fa-folder-open"></i>
            </div>
            <div className={styles.statCard}>
              <h3>Upcoming Deadlines</h3>
              <p>{upcomingDeadlines}</p>
              <i className="fas fa-clock"></i>
            </div>
            <div className={styles.statCard}>
              <h3>Team Members</h3>
              <p>{teamMembersCount}</p>
              <i className="fas fa-users"></i>
            </div>
          </div>

          <div className={styles.projectsSection}>
            <div className={styles.sectionHeader}>
              <h2>Recent Projects</h2>
              <button 
                className={styles.addButton}
                onClick={() => setShowAddProjectModal(true)}
              >
                <i className="fas fa-plus"></i> Add Project
              </button>
            </div>
            
            <div className={styles.projectCards}>
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <h3>{project.name}</h3>
                  <p>Last updated {new Date(project.updatedAt?.seconds * 1000).toLocaleDateString()}</p>
                  <div className={styles.progressBar}>
                    <div style={{ width: `${project.progress || 0}%` }}></div>
                  </div>
                  <div className={styles.teamAvatars}>
                    {project.teamMembers?.slice(0, 3).map((memberId, index) => (
                      <div key={index} className={styles.avatar}>
                        {memberId === user.uid ? 
                          (user?.email?.charAt(0).toUpperCase()) : 
                          String.fromCharCode(65 + index)}
                      </div>
                    ))}
                    {project.teamMembers?.length > 3 && (
                      <div className={styles.avatarExtra}>+{project.teamMembers.length - 3}</div>
                    )}
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className={styles.noProjects}>
                  <p>You don't have any projects yet.</p>
                  <button 
                    className={styles.addButton}
                    onClick={() => setShowAddProjectModal(true)}
                  >
                    <i className="fas fa-plus"></i> Create your first project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Outlet /> {/* ✅ This allows nested routes to render inside Dashboard */}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Create New Project</h3>
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
            />
            <div className={styles.modalButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowAddProjectModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleAddProject}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
