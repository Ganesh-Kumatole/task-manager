# Task Manager

A simple and efficient task manager application built with Node.js, Express, and MongoDB. This full-stack application allows users to create, read, update, and delete tasks with a clean web interface.

## Features

- ✅ Create new tasks
- 📋 View all tasks
- ✏️ Edit existing tasks
- 🗑️ Delete tasks
- ✔️ Mark tasks as completed/incomplete
- 🎨 Clean and responsive UI
- 🔄 RESTful API architecture

## Tech Stack

**Backend:**

- Node.js
- Express.js v5.2.1
- MongoDB with Mongoose v9.1.6
- CORS enabled

**Frontend:**

- Vanilla JavaScript
- HTML5/CSS3
- Font Awesome icons

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task-manager
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
HOSTNAME=localhost
DB_URL=mongodb://localhost:27017/task-manager
```

For MongoDB Atlas, use:

```env
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-manager
```

## Usage

### Development Mode

Run with auto-reload using nodemon:

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start at `http://localhost:3000`

## API Endpoints

### Base URL

```
http://localhost:3000/api/v1/tasks
```

### Endpoints

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/v1/tasks`     | Get all tasks           |
| GET    | `/api/v1/tasks/:id` | Get a single task by ID |
| POST   | `/api/v1/tasks`     | Create a new task       |
| PATCH  | `/api/v1/tasks/:id` | Update a task           |
| DELETE | `/api/v1/tasks/:id` | Delete a task           |

### Request/Response Examples

#### Create a Task

```bash
POST /api/v1/tasks
Content-Type: application/json

{
  "name": "Complete project documentation",
  "description": "Write comprehensive docs for the task manager",
  "status": "pending",
  "priority": "high",
  "category": "work",
  "dueDate": "2026-03-15"
}
```

Response:

```json
{
  "message": "Created",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Complete project documentation",
    "description": "Write comprehensive docs for the task manager",
    "status": "pending",
    "priority": "high",
    "category": "work",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "createdAt": "2026-03-05T10:30:45.123Z",
    "updatedAt": "2026-03-05T10:30:45.123Z"
  }
}
```

#### Get All Tasks with Filtering & Pagination

```bash
GET /api/v1/tasks?page=1&limit=10&status=pending&priority=high&category=work&sort=-dueDate
```

Response:

```json
{
  "data": {
    "tasks": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Complete project documentation",
        "description": "Write comprehensive docs for the task manager",
        "status": "pending",
        "priority": "high",
        "category": "work",
        "dueDate": "2026-03-15T00:00:00.000Z",
        "createdAt": "2026-03-05T10:30:45.123Z",
        "updatedAt": "2026-03-05T10:30:45.123Z"
      }
    ],
    "totalTasks": 5,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

**Query Parameters:**

- `page` (number) - Page number for pagination (default: 1)
- `limit` (number) - Number of tasks per page (default: 10)
- `status` (string) - Filter by status: `pending`, `doing`, `completed`
- `priority` (string) - Filter by priority: `low`, `medium`, `high`
- `category` (string) - Filter by category
- `search` (string) - Search tasks by name (case-insensitive)
- `sort` (string) - Sort field (prefix with `-` for descending, e.g., `-dueDate`)

#### Get a Single Task

```bash
GET /api/v1/tasks/507f1f77bcf86cd799439011
```

Response:

```json
{
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Complete project documentation",
    "description": "Write comprehensive docs for the task manager",
    "status": "pending",
    "priority": "high",
    "category": "work",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "createdAt": "2026-03-05T10:30:45.123Z",
    "updatedAt": "2026-03-05T10:30:45.123Z"
  }
}
```

#### Update a Task

```bash
PATCH /api/v1/tasks/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "status": "doing",
  "priority": "medium"
}
```

Response:

```json
{
  "message": "Task updated successfully",
  "updatedTask": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Complete project documentation",
    "description": "Write comprehensive docs for the task manager",
    "status": "doing",
    "priority": "medium",
    "category": "work",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "createdAt": "2026-03-05T10:30:45.123Z",
    "updatedAt": "2026-03-05T10:30:50.456Z"
  }
}
```

#### Delete a Task

```bash
DELETE /api/v1/tasks/507f1f77bcf86cd799439011
```

Response:

```json
{
  "message": "Deleted",
  "deletedTask": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Complete project documentation",
    "description": "Write comprehensive docs for the task manager",
    "status": "doing",
    "priority": "medium",
    "category": "work",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "createdAt": "2026-03-05T10:30:45.123Z",
    "updatedAt": "2026-03-05T10:30:50.456Z"
  }
}
```

## Project Structure

```
01-task-manager/
├── controllers/
│   └── tasks.js          # Business logic for task operations
├── database/
│   └── connectDB.js      # MongoDB connection setup
├── models/
│   └── Tasks.js          # Mongoose schema and model
├── public/
│   ├── browser-app.js    # Frontend JavaScript
│   ├── edit-task.js      # Edit task functionality
│   ├── main.css          # Custom styles
│   ├── normalize.css     # CSS reset
│   └── task.html         # Task edit page
├── routes/
│   └── tasks.js          # API route definitions
├── utils/
│   └── helpers.js        # Utility functions for filtering
├── .env                  # Environment variables (not in repo)
├── .gitignore
├── app.js                # Main application entry point
├── index.html            # Main page
├── package.json
└── README.md
```

## Data Model

### Task Schema

```javascript
{
  name: {
    type: String,
    required: true,
    maxLength: 25
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'doing', 'completed'],
    required: true,
    default: 'pending',
    lowercase: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
    lowercase: true
  },
  category: {
    type: String,
    enum: ['personal', 'work', 'finance', 'study', 'health', 'chore', 'family', 'sports', 'others'],
    required: true,
    lowercase: true
  },
  dueDate: {
    type: Date,
    validate: {
      validator: (date) => date >= new Date().setHours(0, 0, 0, 0),
      message: 'Due date must be in the future'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

## Environment Variables

| Variable   | Description               | Default   |
| ---------- | ------------------------- | --------- |
| `PORT`     | Server port               | 3000      |
| `HOSTNAME` | Server hostname           | localhost |
| `DB_URL`   | MongoDB connection string | Required  |

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success (GET, PATCH, DELETE)
- `201` - Created (POST)
- `500` - Internal Server Error

Error responses include a message and optional error details (in development mode):

```json
{
  "message": "Internal Server Error",
  "error": {
    "message": "Tasks.find is not a function",
    "name": "TypeError"
  }
}
```

**Note:** In production, detailed error information is not exposed to clients for security reasons. Check server logs for debugging.
