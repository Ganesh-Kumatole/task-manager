import Tasks from '../models/Tasks.js';
import buildFilterObj from '../utils/helpers.js';

const getTask = async (req, res) => {
  const { id } = req.params;
  const task = await Tasks.findById(id);

  res.status(200).json({
    success: true,
    task,
  });
};

const getTasks = async (req, res) => {
  const filter = buildFilterObj(req.query);
  const sortBy = req.query.sort;
  const { page: currentPage, limit: limitValue } = req.query;

  const totalTasks = await Tasks.find(filter).sort(sortBy).countDocuments();
  const tasks = await Tasks.find(filter)
    .sort(sortBy)
    .skip(limitValue * (+currentPage - 1))
    .limit(limitValue);

  const totalPages = Math.ceil(totalTasks / limitValue);

  // Validate
  if (!tasks.length) {
    res.status(200).json({
      data: {
        tasks,
        totalTasks,
        currentPage: Number(currentPage),
        totalPages,
      },
    });
    return;
  }

  res.status(200).json({
    data: {
      tasks,
      totalTasks,
      currentPage: Number(currentPage),
      totalPages,
    },
  });
};

const createTask = async (req, res) => {
  const newTask = await Tasks.create(req.body);
  res.status(201).json({
    message: 'Created',
    data: newTask,
  });
};

const editTask = async (req, res) => {
  const { id } = req.params;
  const task = await Tasks.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: 'Task updated successfully',
    updatedTask: task,
  });
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const deletedTask = await Tasks.findByIdAndDelete(id);
  res.status(200).json({
    message: 'Deleted',
    deletedTask,
  });
};

export { getTask, getTasks, createTask, editTask, deleteTask };
