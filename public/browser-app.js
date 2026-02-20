const todosDOM = document.querySelector('.todos');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const formAlertDOM = document.querySelector('.form-alert');

// Load todos: GET /api/todos
const showTodos = async () => {
  loadingDOM.style.visibility = 'visible';
  try {
    const response = await fetch('/api/v1/todos');

    if (!response.ok) {
      throw new Error(`API Error: ${json.message || 'Unknown error'}`);
    }

    const json = await response.json();
    const todos = json?.data?.todos || [];

    if (todos.length < 1) {
      todosDOM.innerHTML = `
        <div class="empty-list">
          <div class="empty-icon">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <h5>No tasks yet</h5>
          <p>Add your first task above to get started!</p>
        </div>`;
      loadingDOM.style.visibility = 'hidden';
      return;
    }
    const allTodos = todos
      .map((task, index) => {
        const { completed, _id: taskID, name } = task;
        return `
      <div class="single-task ${completed && 'task-completed'}" style="animation-delay: ${index * 0.05}s">
          <div class="task-content">
            <div class="task-checkbox ${completed && 'checked'}"></div>
            <h5>${name}</h5>
          </div>
          <span class="status-badge ${completed ? 'completed' : 'pending'}">
            ${completed ? '<i class="fas fa-check"></i> Done' : '<i class="fas fa-clock"></i> Pending'}
          </span>
        <div class="task-links">
          <!-- edit link -->
          <a href="task.html?id=${taskID}"  class="edit-link">
            <i class="fas fa-edit"></i>
          </a>
          <!-- delete btn -->
          <button type="button" class="delete-btn" data-id="${taskID}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>`;
      })
      .join('');
    todosDOM.innerHTML = allTodos;
  } catch (err) {
    console.error(err);
    todosDOM.innerHTML = `
      <div class="empty-list">
        <div class="empty-icon" style="color: var(--red-dark);">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h5>Something went wrong</h5>
        <p>Please try again later...</p>
      </div>`;
  }
  loadingDOM.style.visibility = 'hidden';
};

// create todo: POST /api/v1/todos
const createTodo = async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;

  try {
    await fetch('/api/v1/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    showTodos();
    taskInputDOM.value = '';
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add('text-success');
  } catch (err) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.innerHTML = `error, please try again`;
    console.error(err);
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
};

// delete todo: DELETE /api/todos/:id
const deleteTodo = async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains('delete-btn')) {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;
    try {
      await fetch(`/api/v1/todos/${id}`, { method: 'DELETE' });
      showTodos();
    } catch (err) {
      console.error(err);
    }
  }
  loadingDOM.style.visibility = 'hidden';
};

function initApp() {
  showTodos();
  formDOM.addEventListener('submit', createTodo);
  todosDOM.addEventListener('click', deleteTodo);
}

initApp();
