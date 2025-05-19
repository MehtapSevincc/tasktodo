// DOM element references
const addTaskBtn = document.getElementById('addTaskBtn');
const newTaskInput = document.getElementById('newTaskInput');
const taskList = document.getElementById('taskList');
const allBtn = document.getElementById('allBtn');
const completedBtn = document.getElementById('completedBtn');
const incompleteBtn = document.getElementById('incompleteBtn');

// Task array from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to render tasks
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
  });

  filteredTasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    if (task.completed) taskElement.classList.add('complete');

    taskElement.innerHTML = `
      <span>${task.name} - ${task.timeAdded} - ${task.timeUpdated}</span>
      <div>
        <button class="complete-btn ${task.completed ? 'complete' : ''}" onclick="toggleComplete(${task.id})">✓</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    taskList.appendChild(taskElement);
  });
}

// Add a new task
addTaskBtn.addEventListener('click', () => {
  const taskName = newTaskInput.value.trim();
  if (!taskName) return;

  const newTask = {
    id: Date.now(),
    name: taskName,
    completed: false,
    timeAdded: new Date().toLocaleTimeString(),
    timeUpdated: new Date().toLocaleTimeString(),
  };

  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  newTaskInput.value = '';
  renderTasks();
});

// Toggle task completion
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  task.timeUpdated = new Date().toLocaleTimeString();
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Filter tasks
allBtn.addEventListener('click', () => renderTasks('all'));
completedBtn.addEventListener('click', () => renderTasks('completed'));
incompleteBtn.addEventListener('click', () => renderTasks('incomplete'));

// Initial render
renderTasks();
