const taskIDDOM = document.querySelector('.task-edit-id');
const taskNameDOM = document.querySelector('.task-edit-name');
const taskCompletedDOM = document.querySelector('.task-edit-completed');
const editFormDOM = document.querySelector('.single-task-form');
const editBtnDOM = document.querySelector('.task-edit-btn');
const formAlertDOM = document.querySelector('.form-alert');
const params = window.location.search;
const id = new URLSearchParams(params).get('id');

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/todos/${id}`);
    const { _id: taskID, completed, name } = task;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    tempName = name;
    if (completed) {
      taskCompletedDOM.checked = true;
    }
  } catch (err) {
    console.log(err);
  }
};

const editTodo = async (e) => {
  editBtnDOM.textContent = 'Loading...';
  e.preventDefault();
  try {
    const taskName = taskNameDOM.value;
    const taskCompleted = taskCompletedDOM.checked;

    const {
      data: { updatedTask },
    } = await axios.patch(`/api/v1/todos/${id}`, {
      name: taskName,
      completed: taskCompleted,
    });

    const { _id: taskID, name, completed } = updatedTask;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    taskCompletedDOM.checked = completed;

    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `success, edited task`;
    formAlertDOM.classList.add('text-success');
  } catch (err) {
    console.error(err);
    formAlertDOM.style.display = 'block';
    formAlertDOM.innerHTML = `error, please try again`;
  }
  editBtnDOM.textContent = 'Edit';
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
};

function editTaskWrapper() {
  showTask(id);
  editFormDOM.addEventListener('submit', editTodo);
}

editTaskWrapper();
