const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const TASKS_FILE = "tasks.json";

app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Load tasks
app.get("/tasks", (req, res) => {
    fs.readFile(TASKS_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error reading tasks file" });
        res.json(JSON.parse(data || "[]"));
    });
});

// Add task
app.post("/tasks", (req, res) => {
    fs.readFile(TASKS_FILE, "utf8", (err, data) => {
        const tasks = err ? [] : JSON.parse(data || "[]");
        const newTask = { id: Date.now(), ...req.body };
        tasks.push(newTask);

        fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error saving task" });
            res.json(newTask);
        });
    });
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
    fs.readFile(TASKS_FILE, "utf8", (err, data) => {
        let tasks = err ? [] : JSON.parse(data || "[]");
        tasks = tasks.filter(task => task.id !== parseInt(req.params.id));

        fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error deleting task" });
            res.json({ success: true });
        });
    });
});

// Serve index.html as default
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
