import express from 'express';
import path from 'path';
import todosRouter from './routes/todos.js';
import connectDB from './database/connectDB.js';

const __dirname = import.meta.dirname;
const rootMarkup = path.resolve(__dirname, 'index.html');

const app = express();

// access environment variables
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

// parse JSON request body & serve static files
app.use(express.json());
app.use(express.static('public'));
app.use(
  '/vendor/fontawesome',
  express.static(
    path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free'),
  ),
);

// serving root markup: GET /
app.get('/', (req, res) => res.status(200).sendFile(rootMarkup));

// requests handling
app.use('/api/v1/todos', todosRouter);

// start server & connect DB
async function initApp() {
  try {
    await connectDB(process.env.DB_URL);
    app.listen(port, hostname, () => {
      console.log(
        `Server is listening for connections: http://${hostname}:${port}`,
      );
    });
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

initApp();
