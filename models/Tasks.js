import { Schema, model } from 'mongoose';

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLenght: [25, 'Length of Task <= 25'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

export default model('Tasks', TaskSchema);
