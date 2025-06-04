const inputDiv = document.getElementById("input");
inputDiv.style.flex = "1";
inputDiv.style.display = "flex";
inputDiv.style.gap = "10px";
const taskInput = document.getElementById("newTaskInput");
taskInput.style.flex = "1";
taskInput.style.padding = "10px";
taskInput.style.fontSize = "15px";
taskInput.style.border = "1px solid #ccc";
taskInput.style.borderRadius = "5px";

const addTaskBtn = document.getElementById("addtaskbtn");
addTaskBtn.style.padding = "0 14px";
addTaskBtn.style.fontSize = "20px";
addTaskBtn.style.cursor = "pointer";
addTaskBtn.style.background = "#0e82fe";
addTaskBtn.style.color = "white";
addTaskBtn.style.border = "none";
addTaskBtn.style.borderRadius = "5px";

const taskList = document.getElementById("tasklist");
taskList.style.display = "flex";
taskList.style.flexDirection = "column";
taskList.style.gap = "10px";

const allBtn = document.getElementById("allbtn");
const completedBtn = document.getElementById("completebtn");
const incompleteBtn = document.getElementById("incompletebtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.forEach((task) => {
  if (task.showDetails === undefined) {
    task.showDetails = false;
  }
});
let currentFilter = "all";

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") return;

  const now = new Date().toISOString();
  tasks.push({
    text,
    completed: false,
    createdAt: now,
    updatedAt: null,
    completedAt: null,
    deleted: false,
    deletedAt: null,
    history: [{ action: "Oluşturuldu", date: now }],
  });

  taskInput.value = "";
  saveAndRender();
});
function enableInlineEdit(taskElement, index) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[index].text;
  input.className = "inline-edit";
  taskElement.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => {
    const newText = input.value.trim();
    if (newText && newText !== tasks[index].text) {
      const now = new Date().toISOString();
      const previous = tasks[index].text;
      tasks[index].text = newText;
      tasks[index].updatedAt = now;
      tasks[index].history.push({
        action: "Güncellendi",
        date: now,
        previousText: previous,
      });
    }
    saveAndRender();
  });
}
function deleteTask(index) {
  const now = new Date().toISOString();
  tasks[index].deleted = true;
  tasks[index].deletedAt = now;
  tasks[index].history.push({ action: "Silindi", date: now });
  saveAndRender();
}
function toggleComplete(index) {
  const now = new Date().toISOString();
  tasks[index].completed = !tasks[index].completed;
  tasks[index].completedAt = tasks[index].completed ? now : null;
  tasks[index].history.push({
    action: tasks[index].completed ? "Tamamlandı" : "Tamamlanma kaldırıldı",
    date: now,
  });
  saveAndRender();
}
allBtn.addEventListener("click", () => {
  currentFilter = "all";
  setActive(allBtn);
  renderTasks();
});
completedBtn.addEventListener("click", () => {
  currentFilter = "completed";
  setActive(completedBtn);
  renderTasks();
});

incompleteBtn.addEventListener("click", () => {
  currentFilter = "incomplete";
  setActive(incompleteBtn);
  renderTasks();
});
function setActive(button) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}
function formatDate(isoStr) {
  const d = new Date(isoStr);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

function getLog(task) {
  if (task.completedAt)
    return {
      text: `Tamamlandı: ${formatDate(task.completedAt)}`,
      type: "completed",
    };
  if (task.updatedAt)
    return {
      text: `Güncellendi: ${formatDate(task.updatedAt)}`,
      type: "updated",
    };
  return {
    text: `Oluşturuldu: ${formatDate(task.createdAt)}`,
    type: "created",
  };
}
function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks.filter((task) => {
    if (currentFilter === "completed") {
      return task.completed && !task.deleted;
    }
    if (currentFilter === "incomplete") {
      return !task.completed && !task.deleted;
    }
    return !task.deleted;
  });

  filtered.forEach((task) => {
    const index = tasks.indexOf(task);
    const div = document.createElement("div");
    div.className = "task-item";
    if (task.completed) div.classList.add("completed");

    const taskText = document.createElement("strong");
    taskText.textContent = task.text;
    taskText.classList.add("task-text");
    taskText.addEventListener("click", () => enableInlineEdit(taskText, index));

    const textConteiner = document.createElement("div");
    textConteiner.className = "text-container";
    textConteiner.appendChild(taskText);

    const toggleDetailBtn = document.createElement("button");
    toggleDetailBtn.textContent = task.showDetails
      ? "Detayları Gizle"
      : "Detayları Göster";
    toggleDetailBtn.className = "toggle-detail-btn";
    toggleDetailBtn.onclick = () => {
      task.showDetails = !task.showDetails;
      saveAndRender();
    };
    div.appendChild(toggleDetailBtn);

    if (task.showDetails) {
      const logData = getLog(task);
      const log = document.createElement("div");
      log.textContent = logData.text;
      log.classList.add("log", logData.type);

      const historyList = document.createElement("ul");
      task.history?.forEach((entry) => {
        const li = document.createElement("li");
        let entryText = ` ${entry.action}: ${formatDate(entry.date)}`;
        if (entry.action === "Güncellendi" && entry.previousText) {
          entryText += ` | Önceki: "${entry.previousText}"`;
        }
        li.textContent = entryText;
        historyList.appendChild(li);
      });

      log.appendChild(historyList);
      div.appendChild(log);
    }

    const actions = document.createElement("div");
    actions.className = "actions";

    const completebtn = document.createElement("button");
    completebtn.textContent = "✅";
    completebtn.onclick = () => toggleComplete(index);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
      const newTaskText = div.querySelector("strong");
      enableInlineEdit(newTaskText, index);
    };
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteTask(index);

    actions.appendChild(completebtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(textConteiner);
    div.appendChild(actions);

    taskList.appendChild(div);
  });

  if (currentFilter === "all") {
    const deletedTasks = tasks
      .filter((task) => task.deleted)
      .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

    if (deletedTasks.length > 0) {
      const deleteHeader = document.createElement("h3");
      deleteHeader.textContent = "Silinen Görevler";
      deleteHeader.className = "deleted-header";
      taskList.appendChild(deleteHeader);
    }
    deletedTasks.forEach((task) => {
      const div = document.createElement("div");
      div.className = "task-item deleted";

      const taskText = document.createElement("span");
      taskText.textContent = task.text;

      const log = document.createElement("div");
      log.className = "log";
      log.textContent = `🗑️ Silindi: ${formatDate(task.deletedAt)}`;

      div.appendChild(taskText);
      div.appendChild(log);
      taskList.appendChild(div);
    });
  }
  function updateFilterButtonsState() {
    const hasVisibleTasks = tasks.some((task) => !task.deleted);

    [allBtn, completedBtn, incompleteBtn].forEach((btn) => {
      btn.disabled = !hasVisibleTasks;
    });
  }
  updateFilterButtonsState();
}
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}
renderTasks();
