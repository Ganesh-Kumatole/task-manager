import { Router } from 'express';
import {
  getTask,
  getTasks,
  createTask,
  editTask,
  deleteTask,
} from '../controllers/tasks.js';

// instantiating exclusive router
const tasksRouter = Router();

// /api/v1/tasks/
tasksRouter.route('/').get(getTasks).post(createTask);

// /api/v1/tasks/:id
tasksRouter.route('/:id').get(getTask).patch(editTask).delete(deleteTask);

export default tasksRouter;
