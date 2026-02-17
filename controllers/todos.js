import Todos from '../models/Todos.js';

const getTodo = (req, res) => {
  const { id } = req.params;
  res.send(`Testing GET /api/v1/todos/${id}`);
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todos.find();

    // Validate
    if (!todos.length) {
      console.log('No ToDos in the DB');
      res.status(200).json({
        data: {
          todos,
        },
      });
      return;
    }

    res.status(200).json({
      data: {
        todos,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err,
    });
  }
};

const createTodo = async (req, res) => {
  try {
    const newTodo = await Todos.create(req.body);
    res.status(201).json({
      message: 'Created',
      data: newTodo,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err,
    });
  }
};

const editTodo = (req, res) => {
  const { id } = req.params;
  res.send(`Testing PATCH /api/v1/todos/${id}`);
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todos.findByIdAndDelete(id);

    // Validate
    if (!deletedTodo) {
      res.status(200).send('No such Todo exist in DB');
      return;
    }

    res.status(200).json({
      message: 'Deleted',
      deletedTodo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err,
    });
  }
};

export { getTodo, getTodos, createTodo, editTodo, deleteTodo };
