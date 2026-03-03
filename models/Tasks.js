import { Schema, model } from 'mongoose';

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLenght: [25, 'Length of Task <= 25'],
    },
    description: {
      type: String,
      trim: true,
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
          'others',
        ],
        message: '{PATH} cannot have {VALUE} as a value... :(',
      },
      required: true,
      lowercase: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (enteredDate) => {
          if (!enteredDate) return true;

          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          return enteredDate >= currentDate;
        },
        message: 'Please enter a valid due-date!',
      },
    },
  },
  {
    timestamps: true,
  },
);

export default model('Tasks', TaskSchema);
