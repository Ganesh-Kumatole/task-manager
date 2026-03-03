import Tasks from '../models/Tasks.js';
import buildFilterObj from '../utils/helpers.js';

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskInfo = await Tasks.findById(id);
    res.status(200).json({
      task: taskInfo,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err,
    });
  }
};

const getTasks = async (req, res) => {
  try {
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
      console.log('No Tasks in the DB');
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
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const newTask = await Tasks.create(req.body);
    res.status(201).json({
      message: 'Created',
      data: newTask,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err,
    });
  }
};

const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Tasks.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Task updated successfully',
      updatedTask: task,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Tasks.findByIdAndDelete(id);

    // Validate
    if (!deletedTask) {
      res.status(200).send('No such Task exist in DB');
      return;
    }

    res.status(200).json({
      message: 'Deleted',
      deletedTask,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err,
    });
  }
};

export { getTask, getTasks, createTask, editTask, deleteTask };
