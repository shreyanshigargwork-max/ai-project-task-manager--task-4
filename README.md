# AI Project & Task Manager

An AI-powered full-stack project and task management platform developed as part of the Innovation Hacks Full Stack Development Internship.

## Features

- User registration and login
- JWT-based authentication
- Protected application routes
- Project creation, editing, deletion and status management
- Task creation, editing and deletion
- Task status and priority management
- Task due dates
- Task search and filtering
- Dashboard with project and task statistics
- AI-assisted task suggestions
- Add suggested AI tasks directly to the task list

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- bcryptjs

### AI Feature
- Local rule-based task suggestion engine

## Project Structure

```text
ai-project-task-manager/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   └── package.json
│
└── README.md