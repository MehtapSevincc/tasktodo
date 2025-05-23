const pencilIcon=document.querySelector(".fa-pencil");
const inputDiv= document.getElementById("input");
const taskInput= document.getElementById("newTaskInput");
const addTaskBtn =document.getElementById("addtaskbtn");
const taskList =document.getElementById("tasklist");

const allBtn= document.getElementById("allbtn");
const completedBtn =document.getElementById("completebtn");
const incompleteBtn=document.getElementById("incompletebtn");

let tasks =JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter ="all";
pencilIcon.addEventListener("click",() =>{
  inputDiv.classList.toggle("hidden");
  taskInput.focus();
});
 
addTaskBtn.addEventListener("click",() => {
const text = taskInput.value.trim();
if (text === "") return;

const now = new Date().toISOString();
tasks.push ({
  text,
  completed :false,
  createdAt: now,
  updateAt: null,
  completedAt:null
});

taskInput.value ="";
saveAndRender();
});


