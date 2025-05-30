Collaborative Project Management Tool for Students
📝 Project Overview
A full-stack web application designed specifically for students to efficiently manage group projects and academic assignments in one centralized platform. This tool solves the fragmentation of using multiple disconnected apps (WhatsApp, Trello, Google Docs) by providing all essential collaboration features in one place.

✨ Key Features
Project Workspaces: Create and organize projects with team members

Task Management: Assign, track, and visualize tasks (Kanban/Gantt views)

Team Communication: Built-in comments and messaging

Document Sharing: Secure file uploads with version control

Timeline Tracking: Calendar integration with deadline reminders

User Roles: Student members and optional faculty supervisors

🛠 Tech Stack
Frontend
React (TypeScript) - Core framework

SCSS (48.6%) - Styling and theming

JavaScript (47.3%) - Application logic

Redux Toolkit - State management

React Router - Navigation

Axios - API communication

Backend
Node.js with Express - API server

MongoDB (with Mongoose) - Database

Firebase Authentication - User management

Cloud Storage (Firebase Storage/AWS S3) - File storage

Socket.IO - Real-time features

🚀 Getting Started
Prerequisites
Node.js (v16+)

MongoDB Atlas account or local instance

Firebase project for authentication

Installation
Clone the repository:

bash
git clone https://github.com/AVBharath10/student-collab-tool.git
cd student-collab-tool
Install dependencies for both frontend and backend:

bash
cd frontend && npm install
cd ../backend && npm install
Set up environment variables:

Create .env files in both frontend and backend directories

Add required Firebase/MongoDB credentials

Run the development servers:

bash
# In frontend directory
npm start

# In backend directory
npm run dev
🌟 Why This Stack?
React: Provides excellent component reusability and state management

SCSS: Enables maintainable and scalable styling

Firebase: Quick authentication implementation with security

Socket.IO: Enables real-time collaboration features

Advanced analytics dashboards

🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request with your improvements.
