import { Router } from 'express';
import {
  getTodo,
  getTodos,
  createTodo,
  editTodo,
  deleteTodo,
} from '../controllers/todos.js';

// instantiating exclusive router
const todosRouter = Router();

// /api/v1/todos/
todosRouter.route('/').get(getTodos).post(createTodo);

// /api/v1/todos/:id
todosRouter.route('/:id').get(getTodo).patch(editTodo).delete(deleteTodo);

export default todosRouter;
