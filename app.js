import express from 'express';
import todosRouter from './routes/todos.js';
import connectDB from './database/connectDB.js';

const app = express();

// access environment variables
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

// parse JSON request body
app.use(express.json());

// requests handling
app.use('/api/v1/todos', todosRouter);

// start server & connect DB
function initApp() {
  try {
    app.listen(port, hostname, () => {
      console.log(
        `Server is listening for connections: http://${hostname}:${port}`,
      );
    });
    connectDB();
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

initApp();
