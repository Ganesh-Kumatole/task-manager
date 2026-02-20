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
cd 01-task-manager
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
http://localhost:3000/api/v1/todos
```

### Endpoints

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/v1/todos`     | Get all tasks           |
| GET    | `/api/v1/todos/:id` | Get a single task by ID |
| POST   | `/api/v1/todos`     | Create a new task       |
| PATCH  | `/api/v1/todos/:id` | Update a task           |
| DELETE | `/api/v1/todos/:id` | Delete a task           |

### Request/Response Examples

#### Create a Task

```bash
POST /api/v1/todos
Content-Type: application/json

{
  "name": "Complete project documentation",
  "completed": false
}
```

Response:

```json
{
  "message": "Created",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Complete project documentation",
    "completed": false
  }
}
```

#### Get All Tasks

```bash
GET /api/v1/todos
```

Response:

```json
{
  "data": {
    "todos": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Complete project documentation",
        "completed": false
      }
    ]
  }
}
```

#### Update a Task

```bash
PATCH /api/v1/todos/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "completed": true
}
```

#### Delete a Task

```bash
DELETE /api/v1/todos/507f1f77bcf86cd799439011
```

## Project Structure

```
01-task-manager/
├── controllers/
│   └── todos.js          # Business logic for todo operations
├── database/
│   └── connectDB.js      # MongoDB connection setup
├── models/
│   └── Todos.js          # Mongoose schema and model
├── public/
│   ├── browser-app.js    # Frontend JavaScript
│   ├── edit-task.js      # Edit task functionality
│   ├── main.css          # Custom styles
│   ├── normalize.css     # CSS reset
│   └── task.html         # Task edit page
├── routes/
│   └── todos.js          # API route definitions
├── .env                  # Environment variables (not in repo)
├── .gitignore
├── app.js                # Main application entry point
├── index.html            # Main page
├── package.json
└── README.md
```

## Data Model

### Todo Schema

```javascript
{
  name: {
    type: String,
    required: true,
    maxLength: 25
  },
  completed: {
    type: Boolean,
    default: false
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

- `200` - Success
- `201` - Created
- `500` - Internal Server Error

Error responses include:

```json
{
  "message": "Internal Server Error",
  "error": { ... }
}
```
