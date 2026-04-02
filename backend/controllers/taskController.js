
// config/taskController.js
const Task = require('../models/Task');

// CRUD read - Now finds ALL tasks for the community view
const getTasks = async (req, res) => {
  try {
    // Removed the { userId: req.user.id } filter so everyone can see everything
    const tasks = await Task.find(); 
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRUD add
const addTask = async (req, res) => {
  const { title, description, deadline } = req.body;
  try {
    const task = await Task.create({ 
      userId: req.user.id, 
      title, 
      description,
      deadline 
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRUD Update - Added ownership check
const updateTask = async (req, res) => {
  const { title, description, completed, deadline } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // 🛡️ SECURITY CHECK: Only the owner can update
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to edit this debate' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed ?? task.completed;
    task.deadline = deadline || task.deadline;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRUD Delete - Added ownership check
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // 🛡️ SECURITY CHECK: Only the owner can delete
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this debate' });
    }

    // Use deleteOne() if remove() gives you trouble in newer Mongoose versions
    await task.deleteOne(); 
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
