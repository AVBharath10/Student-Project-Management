// src/Dashboard/Settings.jsx
import React, { useState } from 'react';
import styles from './Dashboard.module.scss';

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    notifications: true,
    theme: 'dark',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <div className={styles.settingsSection}>
      <h2>Settings</h2>
      
      <div className={styles.settingsTabs}>
        <button 
          className={activeTab === 'profile' ? styles.active : ''}
          onClick={() => setActiveTab('profile')}
        >
          <i className="fas fa-user"></i> Profile
        </button>
        <button 
          className={activeTab === 'account' ? styles.active : ''}
          onClick={() => setActiveTab('account')}
        >
          <i className="fas fa-cog"></i> Account
        </button>
        <button 
          className={activeTab === 'notifications' ? styles.active : ''}
          onClick={() => setActiveTab('notifications')}
        >
          <i className="fas fa-bell"></i> Notifications
        </button>
      </div>
      
      <div className={styles.settingsContent}>
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Display Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Profile Picture</label>
              <div className={styles.avatarUpload}>
                <div className={styles.avatarPreview}>
                  <i className="fas fa-user"></i>
                </div>
                <button type="button" className={styles.uploadButton}>
                  Change Photo
                </button>
              </div>
            </div>
            
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </form>
        )}
        
        {activeTab === 'account' && (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Theme Preference</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Language</label>
              <select>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            
            <button type="submit" className={styles.saveButton}>
              Save Preferences
            </button>
          </form>
        )}
        
        {activeTab === 'notifications' && (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
                <span>Enable Notifications</span>
              </label>
            </div>
            
            <div className={styles.formGroup}>
              <label>Email Notifications</label>
              <div className={styles.checkboxGroup}>
                <label>
                  <input type="checkbox" /> Project Updates
                </label>
                <label>
                  <input type="checkbox" /> Task Assignments
                </label>
                <label>
                  <input type="checkbox" /> Team Messages
                </label>
              </div>
            </div>
            
            <button type="submit" className={styles.saveButton}>
              Save Notification Settings
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Settings;