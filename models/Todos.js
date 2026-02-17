import { Schema, model } from 'mongoose';

const TodoSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLenght: [25, 'Length of ToDo <= 25'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

export default model('Todos', TodoSchema);
