import { Schema, model } from 'mongoose';

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLenght: [25, 'Length of Task <= 25'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'doing', 'completed'],
        message: '{PATH} cannot have {VALUE} as a value... :(',
      },
      required: true,
      lowercase: true,
      trim: true,
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{PATH} cannot have {VALUE} as a value... :(',
      },
      required: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: [
          'personal',
          'work',
          'finance',
          'study',
          'health',
          'chore',
          'family',
          'sports',
        ],
        message: '{PATH} cannot have {VALUE} as a value... :(',
      },
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model('Tasks', TaskSchema);
