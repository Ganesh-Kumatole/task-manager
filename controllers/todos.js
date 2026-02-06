const getTodo = (req, res) => {
  const { id } = req.params;
  res.send(`Testing GET /api/v1/todos/${id}`);
};

const getTodos = (req, res) => {
  res.send(`Testing GET /api/v1/todos`);
};

const createTodo = (req, res) => {
  res.send(`Testing POST /api/v1/todos`);
};

const editTodo = (req, res) => {
  const { id } = req.params;
  res.send(`Testing PATCH /api/v1/todos/${id}`);
};

const deleteTodo = (req, res) => {
  const { id } = req.params;
  res.send(`Testing DELETE /api/v1/todos/${id}`);
};

export { getTodo, getTodos, createTodo, editTodo, deleteTodo };
