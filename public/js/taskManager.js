document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("new-task-form");
    const taskList = document.getElementById("tasks");

    function loadTasks() {
        fetch("http://localhost:3000/tasks")
            .then(res => res.json())
            .then(tasks => {
                taskList.innerHTML = "";
                tasks.forEach(addTaskToUI);
            })
            .catch(err => console.error("Error loading tasks:", err));
    }

    function addTaskToUI(task) {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <strong>${task.title}</strong> - ${task.description} 
            <br>Due: ${task.dueDate} | Priority: ${task.priority}
            <button class="delete-task" data-id="${task.id}">Remove</button>
            <select>
            <option class="task-in-progress">To Do</option>
            <option class="task-To-Do">In Progress</option>
            <option class="task-Done">Done</option>
            </select>

        `;

        taskItem.querySelector(".delete-task").addEventListener("click", function () {
            deleteTask(task.id);
        });
        taskItem.querySelector(".task-in-progress").addEventListener("click", function(){
            changeTaskStatus(task.id,0);
        });
        taskItem.querySelector(".task-To-Do").addEventListener("click", function(){
            changeTaskStatus(task.id,1);
        });
        taskItem.querySelector(".task-Done").addEventListener("click", function(){
            changeTaskStatus(task.id,2);
        });

        taskList.appendChild(taskItem);
    }

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

    function deleteTask(id) {
        fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => loadTasks())
            .catch(err => console.error("Error deleting task:", err));
    }
    function deleteTask(id) {
        fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => loadTasks())
            .catch(err => console.error("Error deleting task:", err));
    }

    loadTasks();
});
