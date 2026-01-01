const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const toggleDark = document.getElementById("toggleDark");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let draggedIndex = null;

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.index = index;
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <strong>${task.text}</strong><br>
      <small>Due: ${task.date || "No date"}</small>
      <div class="task-actions">
        <button onclick="toggleComplete(${index})">✔</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);
    li.addEventListener("dragend", dragEnd);

    taskList.appendChild(li);
  });
}

// Add task
addBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;

  tasks.push({
    text: taskInput.value,
    date: dateInput.value,
    completed: false
  });

  taskInput.value = "";
  dateInput.value = "";
  saveTasks();
  renderTasks();
});

// Task actions
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Drag & Drop
function dragStart() {
  draggedIndex = Number(this.dataset.index);
  this.classList.add("dragging");
}

function dragOver(e) {
  e.preventDefault();
  this.classList.add("over");
}

function drop() {
  const targetIndex = Number(this.dataset.index);
  this.classList.remove("over");

  if (draggedIndex === null || draggedIndex === targetIndex) return;

  const draggedTask = tasks.splice(draggedIndex, 1)[0];
  tasks.splice(targetIndex, 0, draggedTask);

  saveTasks();
  renderTasks();
}

function dragEnd() {
  this.classList.remove("dragging");
  document.querySelectorAll("li").forEach(li => li.classList.remove("over"));
  draggedIndex = null;
}



// Initial load
renderTasks();
