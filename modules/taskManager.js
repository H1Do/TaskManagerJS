import { saveTasks, getTasks } from './storage.js';

export function initializeTaskManager() {
  const taskList = document.querySelector('.task-list');
  const taskForm = document.forms['task-form'];

  const tasks = getTasks();
  createAllTaskElements(tasks, taskList);

  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    createNewTask(event.target, tasks, taskList);
  })

  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    saveTasks(tasks);
  })
}

function createNewTask(taskForm, tasks, taskList) {
  const descriptionElement = taskForm.elements['task-form-description'];
  const newTask = {
    description: descriptionElement.value,
    date: Date.now(),
    completed: false,
  }
  tasks.push(newTask);
  descriptionElement.value = '';
  
  createTaskElement(
    taskList,
    newTask,
    (task) => {
      tasks.splice(tasks.indexOf(task), 1);
    }
  )
}

function createAllTaskElements(tasks, taskList) {
  tasks.forEach((task) => {
    createTaskElement(taskList, task, (task) => {
      tasks.splice(tasks.indexOf(task), 1);
    })
  })
}

function createTaskElement(taskListElement, task, deleteCallback) {
  const taskElement = document.createElement('li');

  taskElement.className = 'task-item' + (task.completed ? ' task-completed' : '');

  const descriptionElement = document.createElement('p');
  const timeElement = document.createElement('time');
  const markButtonElement = document.createElement('button');
  const removeButtonElement = document.createElement('button');

  descriptionElement.className = 'task-description';
  timeElement.className = 'task-date';
  markButtonElement.className = 'task-mark';
  removeButtonElement.className = 'task-remove';

  descriptionElement.textContent = task.description;
  timeElement.dateTime = task.date;
  markButtonElement.textContent = 'Mark as completed';
  removeButtonElement.textContent = 'Remove task';

  markButtonElement.addEventListener('click', () => {
    task.completed = !task.completed;
    taskElement.classList.toggle('task-completed');
  });

  removeButtonElement.addEventListener('click', () => {
    deleteCallback(task);
    taskElement.remove();
  });

  taskElement.append(descriptionElement, timeElement, markButtonElement, removeButtonElement)
  taskListElement.append(taskElement);
}