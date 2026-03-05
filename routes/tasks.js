import { Router } from 'express';
import {
  getTask,
  getTasks,
  createTask,
  editTask,
  deleteTask,
} from '../controllers/tasks.js';
import asyncWrapper from '../utils/asyncWrapper.js';

// instantiating exclusive router
const tasksRouter = Router();

// /api/v1/tasks/
tasksRouter
  .route('/')
  .get(asyncWrapper(getTasks))
  .post(asyncWrapper(createTask));

// /api/v1/tasks/:id
tasksRouter
  .route('/:id')
  .get(asyncWrapper(getTask))
  .patch(asyncWrapper(editTask))
  .delete(asyncWrapper(deleteTask));

export default tasksRouter;
