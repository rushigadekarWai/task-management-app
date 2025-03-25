const express = require('express');
const router = express.Router();
const taskModel = require('./model/taskModel'); // Assuming taskModel is in /backend/models
const { updateTask } = require('./model/taskModel');

// POST route to add a task
router.post('/tasks', async (req, res) => {
    const taskDetails = req.body;

    // Validate the incoming data
    if (!taskDetails.task_owner || !taskDetails.task_name || !taskDetails.task_description || !taskDetails.start_date ||
        !taskDetails.due_date || !taskDetails.assigned_to || !taskDetails.priority || !taskDetails.status) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    try {
        const taskId = await taskModel.addTask(taskDetails); // Use the model function
        res.status(201).send({ message: 'Task added successfully', taskId });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// GET route to fetch all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await taskModel.getAllTasks(); // Fetch tasks using the model function
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// GET route to fetch a specific task by ID
router.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const task = await taskModel.getTaskById(id); // Fetch a task using the model function
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).send({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// PUT route to update a task
// PUT request to update a task
// PUT route to update a task
router.put('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const taskDetails = req.body;

    try {
        const result = await updateTask(taskId, taskDetails);
        res.json(result); // Return success message
    } catch (error) {
        console.error(error); // Log error details
        res.status(500).json({ error: error.message }); // Send error response
    }
});







// DELETE route to delete a task
router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await taskModel.deleteTask(id); // Use the model function
        if (deleted) {
            res.status(200).send({ message: 'Task deleted successfully' });
        } else {
            res.status(404).send({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
