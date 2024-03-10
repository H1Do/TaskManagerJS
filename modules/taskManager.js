import { saveTasks, getTasks } from './storage.js';

const markSvgImage = `
                      <svg width="20" viewBox="0 0 1024 1024" fill="#000000" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M824.8 1003.2H203.2c-12.8 0-25.6-2.4-37.6-7.2-11.2-4.8-21.6-12-30.4-20.8-8.8-8.8-16-19.2-20.8-30.4-4.8-12-7.2-24-7.2-37.6V260c0-12.8 2.4-25.6 7.2-37.6 4.8-11.2 12-21.6 20.8-30.4 8.8-8.8 19.2-16 30.4-20.8 12-4.8 24-7.2 37.6-7.2h94.4v48H203.2c-26.4 0-48 21.6-48 48v647.2c0 26.4 21.6 48 48 48h621.6c26.4 0 48-21.6 48-48V260c0-26.4-21.6-48-48-48H730.4v-48H824c12.8 0 25.6 2.4 37.6 7.2 11.2 4.8 21.6 12 30.4 20.8 8.8 8.8 16 19.2 20.8 30.4 4.8 12 7.2 24 7.2 37.6v647.2c0 12.8-2.4 25.6-7.2 37.6-4.8 11.2-12 21.6-20.8 30.4-8.8 8.8-19.2 16-30.4 20.8-11.2 4.8-24 7.2-36.8 7.2z" fill="" />
                        <path d="M752.8 308H274.4V152.8c0-32.8 26.4-60 60-60h61.6c22.4-44 67.2-72.8 117.6-72.8 50.4 0 95.2 28.8 117.6 72.8h61.6c32.8 0 60 26.4 60 60v155.2m-430.4-48h382.4V152.8c0-6.4-5.6-12-12-12H598.4l-5.6-16c-12-33.6-43.2-56-79.2-56s-67.2 22.4-79.2 56l-5.6 16H334.4c-6.4 0-12 5.6-12 12v107.2zM432.8 792c-6.4 0-12-2.4-16.8-7.2L252.8 621.6c-4.8-4.8-7.2-10.4-7.2-16.8s2.4-12 7.2-16.8c4.8-4.8 10.4-7.2 16.8-7.2s12 2.4 16.8 7.2L418.4 720c4 4 8.8 5.6 13.6 5.6s10.4-1.6 13.6-5.6l295.2-295.2c4.8-4.8 10.4-7.2 16.8-7.2s12 2.4 16.8 7.2c9.6 9.6 9.6 24 0 33.6L449.6 784.8c-4.8 4-11.2 7.2-16.8 7.2z" fill="#000" />
                      </svg>
                      `;
const removeSvgImage = `
                      <svg fill="#000000" width="20" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                      viewBox="0 0 492.308 492.308" xml:space="preserve">
                        <path d="M246.154,0C110.423,0,0,110.423,0,246.154s110.423,246.154,246.154,246.154s246.154-110.423,246.154-246.154
                        S381.885,0,246.154,0z M246.154,472.615c-124.87,0-226.462-101.591-226.462-226.462S121.284,19.692,246.154,19.692
                        s226.462,101.591,226.462,226.462S371.024,472.615,246.154,472.615z"/>
                        <rect x="105.029" y="236.308" width="282.26" height="19.692"/>
                      </svg>
                      `;
const editSvgImage = `
                      <svg width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill=none stroke="#000" stroke-width="1" stroke-linecap="round" stroke-linejoin="miter">
                      <polygon points="18 2 22 6 11 17 7 17 7 13 18 2"></polygon>
                      <polyline points="21 14 21 22 2 22 2 3 10 3"></polyline>
                      </svg>
                     `;
const completeSvgImage = `
                      <svg fill="#000000" width="20" height="20" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                          <path d="M960 1807.059c-467.125 0-847.059-379.934-847.059-847.059 0-467.125 379.934-847.059 847.059-847.059 467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059M960 0C430.645 0 0 430.645 0 960s430.645 960 960 960 960-430.645 960-960S1489.355 0 960 0M854.344 1157.975 583.059 886.69l-79.85 79.85 351.135 351.133L1454.4 717.617l-79.85-79.85-520.206 520.208Z" fill-rule="evenodd"/>
                      </svg>
                      `

export function initializeTaskManager() {
  const taskList = document.querySelector('.task-list');
  const taskForm = document.forms['task-form'];
  const tasks = getTasks();

  renderAllTasks(tasks, taskList);

  taskForm.addEventListener('submit', handleTaskFormSubmit.bind(null, tasks, taskList));

  window.addEventListener('beforeunload', () => { saveTasks(tasks) });
}

function handleTaskFormSubmit(tasks, taskList, event) {
  event.preventDefault();

  const descriptionElement = event.target.elements['task-form-description'];
  const selectElement = event.target.elements['task-form-scope'];
  const newTask = {
    description: descriptionElement.value,
    date: Date.now(),
    completed: false,
    scope: selectElement.value,
  }

  tasks.push(newTask);
  renderAllTasks(tasks, taskList);
}

function handleTaskDelete(tasks, taskToDetete) {
  const index = tasks.indexOf(taskToDetete);
  if (index != -1) {
    tasks.splice(index, 1);
  }
}

function renderAllTasks(tasks, taskList) {
  tasks.sort((firstTask, secondTask) => (firstTask.scope).localeCompare(secondTask.scope));

  taskList.innerHTML = '';
  tasks.forEach((task) => {
    taskList.append(createTaskElement(task, handleTaskDelete.bind(null, tasks, task)))
  });
}

function createTaskElement(task, deleteCallback) {
  const taskElement = document.createElement('li');
  taskElement.classList.add('task-item');
  if (task.completed) {
    taskElement.classList.add('task-completed');
  }

  const descriptionElement = document.createElement('div');
  descriptionElement.className = 'task-description';
  descriptionElement.textContent = task.description;

  const scopeElement = document.createElement('div');
  scopeElement.className = `task-scope task-scope-${task.scope}`;
  scopeElement.textContent = `#${task.scope}`;

  const timeElement = document.createElement('time');
  timeElement.className = 'task-date';
  timeElement.dateTime = new Date(task.date).toISOString();
  timeElement.textContent = new Date(task.date).toLocaleDateString();

  const buttonsElement = document.createElement('div');
  buttonsElement.className = 'task-buttons';

  const markButtonElement = document.createElement('button');
  markButtonElement.className = 'task-mark';
  markButtonElement.innerHTML = markSvgImage;
  markButtonElement.addEventListener('click', () => {
    task.completed = !task.completed;
    taskElement.classList.toggle('task-completed');
  });

  const removeButtonElement = document.createElement('button');
  removeButtonElement.className = 'task-remove';
  removeButtonElement.innerHTML = removeSvgImage;
  removeButtonElement.addEventListener('click', () => {
    deleteCallback(task);
    taskElement.remove();
  });

  const editFormElement = document.createElement('form');
  editFormElement.className = 'task-item-edit';

  const editAreaElement = document.createElement('input');
  editAreaElement.className = 'task-item-edit-description';
  editAreaElement.maxLength = 200;

  const completeEditButtonElement = document.createElement('button');
  completeEditButtonElement.className = 'task-item-edit-button';

  completeEditButtonElement.innerHTML = completeSvgImage;
  editFormElement.append(editAreaElement, completeEditButtonElement);

  const editButtonElement = document.createElement('button');
  editButtonElement.className = 'task-edit';
  editButtonElement.innerHTML = editSvgImage;
  editButtonElement.addEventListener('click', () => {
    descriptionElement.replaceWith(editFormElement);
    editAreaElement.value = descriptionElement.textContent;
    editButtonElement.hidden = true;
    const wasCompleted = taskElement.classList.contains('task-completed');
    taskElement.classList.remove('task-completed')

    editFormElement.addEventListener('submit', (event) => {
      event.preventDefault();

      if (editAreaElement.value === '') {
        taskElement.remove();
        deleteCallback(task);
      }

      editFormElement.replaceWith(descriptionElement);
      descriptionElement.textContent = editAreaElement.value;
      task.description = editAreaElement.value;
      editButtonElement.hidden = false;
      if (wasCompleted) {
        taskElement.classList.add('task-completed');
      }
    })
  });

  buttonsElement.append(editButtonElement, markButtonElement, removeButtonElement);
  taskElement.append(descriptionElement, scopeElement, timeElement, buttonsElement)

  return taskElement;
}