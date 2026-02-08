import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error('DB_URL is not defined in environment variables');
    }
    const connectionInfo = await connect(process.env.DB_URL);
    console.log('Connected to DB successfully... :)');
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
