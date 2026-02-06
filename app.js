import express from 'express';
import todosRouter from './routes/todos.js';
const app = express();

// access environment variables
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

// parse JSON request body
app.use(express.json());

// requests handling
app.use('/api/v1/todos', todosRouter);

// listen for requests
app.listen(port, hostname, () => {
  console.log(
    `Server is listening for connections: http://${hostname}:${port}`,
  );
});
