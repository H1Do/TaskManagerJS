export function saveTasks(tasks) {
  localStorage.clear();
  for (let i = 0; i < tasks.length; i++) {
    localStorage.setItem(i, JSON.stringify(tasks[i]));
  }
}

export function getTasks() {
  const tasks = [];
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.getItem(i)) {
      tasks.push(JSON.parse(localStorage.getItem(i)))
    }
  }
  return tasks;
}