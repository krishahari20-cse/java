const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

renderTasks();

// Add Task
addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();

    if (text === "") return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";
});

// Event Delegation
taskList.addEventListener("click", (e) => {

    const id = Number(e.target.closest("li").dataset.id);

    // Delete
    if (e.target.classList.contains("delete")) {
        tasks = tasks.filter(task => task.id !== id);
    }

    // Edit
    if (e.target.classList.contains("edit")) {
        const task = tasks.find(task => task.id === id);

        const updatedText = prompt("Edit Task", task.text);

        if (updatedText !== null && updatedText.trim() !== "") {
            task.text = updatedText.trim();
        }
    }

    // Complete
    if (e.target.classList.contains("task-text")) {
        const task = tasks.find(task => task.id === id);
        task.completed = !task.completed;
    }

    saveTasks();
    renderTasks();
});

// Filters
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        document
            .querySelector(".filter-btn.active")
            .classList.remove("active");

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
