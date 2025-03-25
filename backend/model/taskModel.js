const db = require('../db'); // Assuming your DB connection file is db.js

// Function to add a new task
const addTask = async (taskDetails) => {
    const {
        task_owner, task_name, task_description, start_date,
        due_date, reminder, assigned_to, priority, status
    } = taskDetails;

    const query = `
        INSERT INTO tasks (task_owner, task_name, task_description, start_date, due_date, reminder, assigned_to, priority, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [task_owner, task_name, task_description, start_date, due_date, reminder, assigned_to, priority, status];

    try {
        const [result] = await db.promise().query(query, values);
        return result.insertId; // Returns the inserted task's ID
    } catch (error) {
        throw new Error('Error inserting task into database: ' + error.message);
    }
};

// Function to get all tasks
const getAllTasks = async () => {
    const query = 'SELECT * FROM tasks ORDER BY created_at DESC';

    try {
        const [results] = await db.promise().query(query);
        return results; // Returns all tasks
    } catch (error) {
        throw new Error('Error fetching tasks from database: ' + error.message);
    }
};

// Function to get a specific task by its ID
const getTaskById = async (taskId) => {
    const query = 'SELECT * FROM tasks WHERE id = ?';

    try {
        const [results] = await db.promise().query(query, [taskId]);

        if (results.length > 0) {
            return results[0]; // Returns the task if found
        } else {
            return null; // Task not found
        }
    } catch (error) {
        throw new Error('Error fetching task by ID: ' + error.message);
    }
};

// Function to update a task
// Inside your taskModel.js file
const updateTask = async (taskId, taskDetails) => {
    const { task_owner, task_name, task_description, start_date, due_date, assigned_to, priority, status, reminder } = taskDetails;

    const query = `
        UPDATE tasks 
        SET task_owner = ?, task_name = ?, task_description = ?, start_date = ?, due_date = ?, assigned_to = ?, priority = ?, status = ?, reminder = ?
        WHERE id = ?
    `;

    const values = [task_owner, task_name, task_description, start_date, due_date, assigned_to, priority, status, reminder, taskId];

    try {
        const [result] = await db.promise().query(query, values);

        if (result.affectedRows === 0) {
            throw new Error('Task not found');
        }

        return { message: 'Task updated successfully' };
    } catch (error) {
        throw new Error('Error updating task: ' + error.message);
    }
};


// Function to delete a task
const deleteTask = async (taskId) => {
    const query = 'DELETE FROM tasks WHERE id = ?';

    try {
        const [result] = await db.promise().query(query, [taskId]);
        return result.affectedRows > 0; // Returns true if the task was deleted
    } catch (error) {
        throw new Error('Error deleting task from database: ' + error.message);
    }
};

module.exports = {
    addTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
