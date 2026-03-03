// DOM Elements
const tasksDOM = document.querySelector('.tasks');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const taskCategoryDOM = document.getElementById('task-category');
const taskPriorityDOM = document.getElementById('task-priority');
const formAlertDOM = document.querySelector('.form-alert');

// Search, Filter & Sort DOM Elements
const searchInputDOM = document.getElementById('search-input');
const statusFilterDOM = document.getElementById('status-filter');
const categoryFilterDOM = document.getElementById('category-filter');
const priorityFilterDOM = document.getElementById('priority-filter');
const sortFieldDOM = document.getElementById('sort-field');
const sortOrderDOM = document.getElementById('sort-order');
const itemsPerPageDOM = document.getElementById('items-per-page');
const paginationTextDOM = document.getElementById('pagination-text');
const pageNumbersDOM = document.getElementById('page-numbers');

// Pagination Buttons
const firstPageBtn = document.getElementById('first-page');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const lastPageBtn = document.getElementById('last-page');

// State Management
let currentPage = 1;
let itemsPerPage = 5;
let totalTasks = 0;
let totalPages = 0;

// State object for query parameters
const state = {
  search: '',
  status: 'all',
  category: 'all',
  priority: 'all',
  sortField: 'createdAt',
  sortOrder: 'desc',
};

// Build query string from state
function buildQueryString() {
  const params = new URLSearchParams();

  // Add filters
  if (state.search) params.append('search', state.search);
  if (state.status !== 'all') params.append('status', state.status);
  if (state.category !== 'all') params.append('category', state.category);
  if (state.priority !== 'all') params.append('priority', state.priority);

  // Add sorting
  const sortPrefix = state.sortOrder === 'desc' ? '-' : '';
  params.append('sort', `${sortPrefix}${state.sortField}`);

  // Add pagination
  params.append('page', currentPage);
  params.append('limit', itemsPerPage);

  return params.toString();
}

// Debounce function for search
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Format date nicely
function formatDate(dateString) {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format priority with color
function getPriorityBadge(priority) {
  const colors = {
    high: { bg: '#fecaca', color: '#dc2626' },
    medium: { bg: '#fef08a', color: '#ca8a04' },
    low: { bg: '#bbf7d0', color: '#16a34a' },
  };
  const c = colors[priority];
  return `<span class="priority-badge" style="background: ${c.bg}; color: ${c.color};">${priority}</span>`;
}

// Format status for display
function getStatusDisplay(status) {
  if (status === 'completed') {
    return {
      class: 'completed',
      text: '<i class="fas fa-check"></i> Done',
      value: 'completed',
    };
  }
  if (status === 'doing') {
    return {
      class: 'in-progress',
      text: '<i class="fas fa-spinner"></i> Doing',
      value: 'doing',
    };
  }
  return {
    class: 'pending',
    text: '<i class="fas fa-clock"></i> Pending',
    value: 'pending',
  };
}

// Get category badge
function getCategoryBadge(category) {
  if (!category || category === 'all') return '';
  return `<span class="category-badge">${category}</span>`;
}

// Calculate total pages
function calculateTotalPages() {
  return Math.ceil(totalTasks / itemsPerPage);
}

// Update pagination UI
function updatePaginationUI() {
  totalPages = calculateTotalPages();
  const startIndex = totalTasks > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, totalTasks);

  // Update info text
  paginationTextDOM.textContent = totalTasks
    ? `Showing ${startIndex}-${endIndex} of ${totalTasks} tasks`
    : 'No tasks found';

  // Update page numbers
  pageNumbersDOM.innerHTML = '';

  if (totalPages <= 7) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => goToPage(i));
      pageNumbersDOM.appendChild(pageBtn);
    }
  } else {
    // Show limited pages with ellipsis
    const showPages = [1];

    if (currentPage > 3) showPages.push('...');

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages - 1);
      i++
    ) {
      showPages.push(i);
    }

    if (currentPage < totalPages - 2) showPages.push('...');

    showPages.push(totalPages);

    showPages.forEach((page) => {
      if (page === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        pageNumbersDOM.appendChild(ellipsis);
      } else {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${page === currentPage ? 'active' : ''}`;
        pageBtn.textContent = page;
        pageBtn.addEventListener('click', () => goToPage(page));
        pageNumbersDOM.appendChild(pageBtn);
      }
    });
  }

  // Update button states
  firstPageBtn.disabled = currentPage === 1;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
  lastPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Go to specific page
function goToPage(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    showTasks();
  }
}

// Reset to first page
function resetToFirstPage() {
  currentPage = 1;
}

// Render tasks to DOM
function renderTasks(tasks) {
  if (!tasks || tasks.length === 0) {
    if (
      totalTasks === 0 &&
      (state.search ||
        state.status !== 'all' ||
        state.category !== 'all' ||
        state.priority !== 'all')
    ) {
      tasksDOM.innerHTML = `
        <div class="empty-list">
          <div class="empty-icon">
            <i class="fas fa-search"></i>
          </div>
          <h5>No tasks found</h5>
          <p>Try adjusting your filters or search term</p>
        </div>`;
    } else {
      tasksDOM.innerHTML = `
        <div class="empty-list">
          <div class="empty-icon">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <h5>No tasks yet</h5>
          <p>Add your first task above to get started!</p>
        </div>`;
    }
    return;
  }

  const allTodos = tasks
    .map((task, index) => {
      const {
        _id: taskID,
        name,
        description,
        status,
        category,
        priority,
        dueDate,
      } = task;

      const statusDisplay = getStatusDisplay(status);

      return `
      <div class="single-task ${status === 'completed' ? 'task-completed' : ''}" style="animation-delay: ${index * 0.05}s">
        <div class="task-main">
          <div class="task-content">
            <div class="task-checkbox ${status === 'completed' ? 'checked' : ''}"></div>
            <div class="task-info">
              <h5>${name}</h5>
              ${description ? `<p class="task-description">${description}</p>` : ''}
              <div class="task-meta">
                ${getCategoryBadge(category)}
                <span class="status-badge ${statusDisplay.class}">${statusDisplay.text}</span>
                ${getPriorityBadge(priority)}
                ${dueDate ? `<span class="due-date"><i class="fas fa-calendar-alt"></i> ${formatDate(dueDate)}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
        <div class="task-links">
          <a href="task.html?id=${taskID}" class="edit-link" title="Edit Task">
            <i class="fas fa-edit"></i>
          </a>
          <button type="button" class="delete-btn" data-id="${taskID}" title="Delete Task">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>`;
    })
    .join('');

  tasksDOM.innerHTML = allTodos;
}

// Load tasks from backend with query parameters
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible';
  try {
    const queryString = buildQueryString();
    const response = await fetch(`/api/v1/tasks?${queryString}`);
    console.log(`API endpoint: /api/v1/tasks?${queryString}`);

    if (!response.ok) {
      const json = await response.json();
      throw new Error(`API Error: ${json.message || 'Unknown error'}`);
    }

    const json = await response.json();
    const tasks = json?.data?.tasks || [];

    // Extract pagination metadata from response
    // Backend should return: { data: { tasks: [...], totalTasks, currentPage, totalPages } }
    totalTasks = json?.data?.totalTasks || tasks.length;
    totalPages = json?.data?.totalPages || calculateTotalPages();

    // Update pagination UI
    updatePaginationUI();

    // Render tasks
    renderTasks(tasks);
  } catch (err) {
    console.error(err);
    tasksDOM.innerHTML = `
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

// create task: POST /api/v1/tasks
const createTask = async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;
  const category = taskCategoryDOM.value;
  const priority = taskPriorityDOM.value;

  if (!name.trim()) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Please enter a task name';
    formAlertDOM.classList.add('text-danger');
    setTimeout(() => {
      formAlertDOM.style.display = 'none';
      formAlertDOM.classList.remove('text-danger');
    }, 3000);
    return;
  }

  try {
    const taskData = { name };
    if (category) taskData.category = category;
    if (priority) taskData.priority = priority;

    await fetch('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    showTasks();
    taskInputDOM.value = '';
    taskCategoryDOM.value = '';
    taskPriorityDOM.value = 'medium';
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'success, task added';
    formAlertDOM.classList.add('text-success');
  } catch (err) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.innerHTML = 'error, please try again';
    console.error(err);
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
};

// delete task: DELETE /api/v1/tasks/:id
const deleteTask = async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains('delete-btn')) {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;
    try {
      await fetch(`/api/v1/tasks/${id}`, { method: 'DELETE' });
      showTasks();
    } catch (err) {
      console.error(err);
    }
  }
  loadingDOM.style.visibility = 'hidden';
};

// Filter change handlers
const handleFilterChange = () => {
  state.search = searchInputDOM.value;
  state.status = statusFilterDOM.value;
  state.category = categoryFilterDOM.value;
  state.priority = priorityFilterDOM.value;
  state.sortField = sortFieldDOM.value;
  state.sortOrder = sortOrderDOM.value;
  resetToFirstPage();
  showTasks();
};

// Debounced search handler
const debouncedSearch = debounce(() => {
  handleFilterChange();
}, 300);

// Event Listeners
function initEventListeners() {
  // Form submission
  formDOM.addEventListener('submit', createTask);

  // Delete task
  tasksDOM.addEventListener('click', deleteTask);

  // Search input
  searchInputDOM.addEventListener('input', debouncedSearch);

  // Filter dropdowns
  statusFilterDOM.addEventListener('change', handleFilterChange);
  categoryFilterDOM.addEventListener('change', handleFilterChange);
  priorityFilterDOM.addEventListener('change', handleFilterChange);
  sortFieldDOM.addEventListener('change', handleFilterChange);
  sortOrderDOM.addEventListener('change', handleFilterChange);

  // Items per page
  itemsPerPageDOM.addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    resetToFirstPage();
    showTasks();
  });

  // Pagination buttons
  firstPageBtn.addEventListener('click', () => goToPage(1));
  prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
  lastPageBtn.addEventListener('click', () => goToPage(totalPages));
}

// Initialize app
function initApp() {
  initEventListeners();
  showTasks();
}

initApp();
