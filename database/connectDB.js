import { connect } from 'mongoose';

const connectDB = async (URL) => {
  try {
    if (!URL) throw new Error('DB_URL is not defined in environment variables');

    await connect(URL);
    console.log('Connected to DB successfully... :)');
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
