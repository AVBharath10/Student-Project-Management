import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, doc, onSnapshot, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Projects.module.scss';

function Projects() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Fetch projects data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const projectsQuery = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      toast.warning("Please enter a project name");
      return;
    }
    
    setIsAddingProject(true);
    try {
      await addDoc(collection(db, 'projects'), {
        name: newProjectName.trim(),
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        progress: 0,
        teamMembers: [user.uid],
        lastUpdatedBy: user.uid
      });
      setNewProjectName('');
      setShowAddProjectModal(false);
      toast.success("Project created successfully!");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? All related data will be lost.')) {
      return;
    }

    setDeletingId(projectId);
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const navigateToProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your projects...</p>
      </div>
    );
  }

  return (
    <div className={styles.projectsContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1>My Projects</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddProjectModal(true)}
          disabled={!user}
        >
          <i className="fas fa-plus"></i> New Project
        </button>
      </div>

      {/* Projects List */}
      <div className={styles.projectsList}>
        {!user ? (
          <div className={styles.emptyState}>
            <p>Please sign in to view or create projects</p>
          </div>
        ) : projects.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You don't have any projects yet.</p>
            <button 
              className={styles.addButton}
              onClick={() => setShowAddProjectModal(true)}
            >
              <i className="fas fa-plus"></i> Create your first project
            </button>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div 
                className={styles.projectInfo}
                onClick={() => navigateToProject(project.id)}
              >
                <h3>{project.name}</h3>
                <p className={styles.projectMeta}>
                  Created on {project.createdAt?.toDate().toLocaleDateString()}
                  {project.updatedAt && (
                    <span> • Last updated: {project.updatedAt.toDate().toLocaleString()}</span>
                  )}
                </p>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div 
                      style={{ width: `${project.progress || 0}%` }}
                      className={project.progress === 100 ? styles.completed : ''}
                    ></div>
                  </div>
                  <span>{project.progress || 0}% complete</span>
                </div>
              </div>
              <div className={styles.projectActions}>
                <button 
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${project.id}/edit`);
                  }}
                  title="Edit project"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  disabled={deletingId === project.id}
                  title="Delete project"
                >
                  {deletingId === project.id ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-trash"></i>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddProjectModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Create New Project</h3>
            <div className={styles.modalContent}>
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                autoFocus
              />
              <div className={styles.modalButtons}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowAddProjectModal(false)}
                  disabled={isAddingProject}
                >
                  Cancel
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={handleAddProject}
                  disabled={!newProjectName.trim() || isAddingProject}
                >
                  {isAddingProject ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;