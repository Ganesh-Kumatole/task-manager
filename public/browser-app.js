const todosDOM = document.querySelector('.todos');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const formAlertDOM = document.querySelector('.form-alert');

// Load todos: GET /api/todos
const showTodos = async () => {
  loadingDOM.style.visibility = 'visible';
  try {
    const {
      data: {
        data: { todos },
      },
    } = await axios.get('/api/v1/todos');

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
  } catch (error) {
    console.error(error);
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
    await axios.post('/api/v1/todos', { name });
    showTodos();
    taskInputDOM.value = '';
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add('text-success');
  } catch (error) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.innerHTML = `error, please try again`;
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
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/todos/${id}`);
      showTodos();
    } catch (error) {
      console.log(error);
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
