// src/Dashboard/Teams.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';

function Teams() {
  const navigate = useNavigate();
  
  // Mock teams data
  const teams = [
    { id: 1, name: 'Frontend Developers', members: 5, projects: 3 },
    { id: 2, name: 'Design Team', members: 3, projects: 2 },
    { id: 3, name: 'Backend Team', members: 4, projects: 4 },
  ];

  return (
    <div className={styles.teamsSection}>
      <div className={styles.sectionHeader}>
        <h2>Your Teams</h2>
        <button 
          className={styles.addButton}
          onClick={() => navigate('/teams/create')}
        >
          <i className="fas fa-plus"></i> Create Team
        </button>
      </div>
      
      <div className={styles.teamGrid}>
        {teams.map(team => (
          <div key={team.id} className={styles.teamCard}>
            <div className={styles.teamHeader}>
              <div className={styles.teamAvatar}>
                {team.name.charAt(0)}
              </div>
              <h3>{team.name}</h3>
            </div>
            <div className={styles.teamStats}>
              <div className={styles.statItem}>
                <i className="fas fa-users"></i>
                <span>{team.members} members</span>
              </div>
              <div className={styles.statItem}>
                <i className="fas fa-tasks"></i>
                <span>{team.projects} projects</span>
              </div>
            </div>
            <div className={styles.teamActions}>
              <button 
                className={styles.viewButton}
                onClick={() => navigate(`/teams/${team.id}`)}
              >
                View Team
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;