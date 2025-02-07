document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("new-task-form");
    const taskList = document.getElementById("tasks");

    // Load tasks from server
    function loadTasks() {
        fetch("http://localhost:3000/tasks")
            .then(res => res.json())
            .then(tasks => {
                taskList.innerHTML = ""; // Clear list
                tasks.forEach(addTaskToUI);
            })
            .catch(err => console.error("Error loading tasks:", err));
    }

    // Add task to UI
    function addTaskToUI(task) {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <strong>${task.title}</strong> - ${task.description} 
            <br>Due: ${task.dueDate} | Priority: ${task.priority}
            <button class="delete-task" data-id="${task.id}">Remove</button>
        `;

        taskItem.querySelector(".delete-task").addEventListener("click", function () {
            deleteTask(task.id);
        });

        taskList.appendChild(taskItem);
    }

    // Add a new task
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newTask = {
            title: document.getElementById("task-title").value,
            description: document.getElementById("task-desc").value,
            dueDate: document.getElementById("task-due").value,
            priority: document.getElementById("task-priority").value
        };

        fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask)
        })
        .then(res => res.json())
        .then(task => addTaskToUI(task))
        .catch(err => console.error("Error adding task:", err));

        taskForm.reset();
    });

    // Delete task
    function deleteTask(id) {
        fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => loadTasks())
            .catch(err => console.error("Error deleting task:", err));
    }

    loadTasks();
});
