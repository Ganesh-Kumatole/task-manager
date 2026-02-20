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
      todosDOM.innerHTML = '<h5 class="empty-list">No todos in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }
    const allTodos = todos
      .map((task) => {
        const { completed, _id: taskID, name } = task;
        return `
      <div class="single-task ${completed && 'task-completed'}">
          <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
          
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
    todosDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
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
