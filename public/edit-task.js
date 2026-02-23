// DOM Elements
const taskIDDOM = document.querySelector('.task-edit-id');
const taskNameDOM = document.querySelector('.task-edit-name');
const taskDescriptionDOM = document.querySelector('.task-edit-description');
const taskStatusDOM = document.querySelector('.task-edit-status');
const taskCategoryDOM = document.querySelector('.task-edit-category');
const taskPriorityDOM = document.querySelector('.task-edit-priority');
const taskDueDateDOM = document.querySelector('.task-edit-dueDate');
const taskCompletedDOM = document.querySelector('.task-edit-completed');
const editFormDOM = document.querySelector('.single-task-form');
const editBtnDOM = document.querySelector('.task-edit-btn');
const formAlertDOM = document.querySelector('.form-alert');

// Get task ID from URL
const params = window.location.search;
const id = new URLSearchParams(params).get('id');

// Show task: GET /api/v1/tasks/:id
const showTask = async () => {
  try {
    const response = await fetch(`/api/v1/tasks/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    const json = await response.json();
    const { task } = json;

    // Extract all fields from task
    const {
      _id: taskID,
      completed,
      name,
      description,
      status,
      category,
      priority,
      dueDate,
    } = task;

    // Populate form fields
    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name || '';
    taskDescriptionDOM.value = description || '';
    taskStatusDOM.value = status || 'incomplete';
    taskCategoryDOM.value = category || '';
    taskPriorityDOM.value = priority || 'medium';
    taskDueDateDOM.value = dueDate ? dueDate.split('T')[0] : '';
    taskCompletedDOM.checked = completed || false;
  } catch (err) {
    console.error(err);
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Error loading task';
    formAlertDOM.classList.add('text-danger');
  }
};

// Edit task: PATCH /api/v1/tasks/:id
const editTask = async (e) => {
  editBtnDOM.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  e.preventDefault();

  try {
    // Build update object with all fields
    const updateData = {
      name: taskNameDOM.value,
      description: taskDescriptionDOM.value || undefined,
      status: taskStatusDOM.value,
      category: taskCategoryDOM.value || undefined,
      priority: taskPriorityDOM.value,
      dueDate: taskDueDateDOM.value || undefined,
      completed: taskCompletedDOM.checked,
    };

    const response = await fetch(`/api/v1/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const json = await response.json();
    const { updatedTask } = json;

    // Update UI with returned data
    const {
      _id: taskID,
      name,
      completed,
      description,
      status,
      category,
      priority,
      dueDate,
    } = updatedTask;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    taskDescriptionDOM.value = description || '';
    taskStatusDOM.value = status;
    taskCategoryDOM.value = category || '';
    taskPriorityDOM.value = priority || 'medium';
    taskDueDateDOM.value = dueDate ? dueDate.split('T')[0] : '';
    taskCompletedDOM.checked = completed;

    // Show success message
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Success! Task updated successfully.';
    formAlertDOM.classList.remove('text-danger');
    formAlertDOM.classList.add('text-success');
  } catch (err) {
    console.error(err);
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Error, please try again';
    formAlertDOM.classList.remove('text-success');
    formAlertDOM.classList.add('text-danger');
  }

  editBtnDOM.innerHTML = '<i class="fas fa-save"></i> Save Changes';

  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success', 'text-danger');
  }, 3000);
};

// Initialize
function editTaskWrapper() {
  if (!id) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'No task ID provided';
    formAlertDOM.classList.add('text-danger');
    return;
  }

  showTask(id);
  editFormDOM.addEventListener('submit', editTask);
}

editTaskWrapper();
