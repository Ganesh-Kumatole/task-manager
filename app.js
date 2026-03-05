import { configDotenv } from 'dotenv';
configDotenv(); // load .env first

import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

import tasksRouter from './routes/tasks.js';
import connectDB from './database/connectDB.js';
import errorHandler from './middlewares/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// resolve root HTML
const rootMarkup = path.resolve(__dirname, 'index.html');

// define app instance
const app = express();

// access environment variables
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

// define middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use(
  '/vendor/fontawesome',
  express.static(
    path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free'),
  ),
);

// handle root route
app.get('/', (req, res) => res.sendFile(rootMarkup));

// handle /tasks route
app.use('/api/v1/tasks', tasksRouter);

// global error-handling middleware
app.use(errorHandler);

// initialize app
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
    process.exit(1);
  }
}

initApp();
