const Task = require('../models/Task');
const mongoose = require('mongoose'); // ⭐ Added this import to check ID formats

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find(); 
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addTask = async (req, res) => {
    const { title, description, deadline } = req.body;
    try {
        // ⭐ FIX: Check for empty or whitespace-only titles
        if (!title || title.trim().length === 0) {
            return res.status(400).json({ message: "Title is required" });
        }

        const task = await Task.create({ 
            userId: req.user.id, 
            title, 
            description,
            deadline 
        });
        res.status(201).json(task);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        // ⭐ FIX: Check if the ID string is actually a valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const { title, description, completed, deadline } = req.body;
        const task = await Task.findById(req.params.id);
        
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
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

const deleteTask = async (req, res) => {
    try {
        // ⭐ FIX: Check ID validity first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await task.deleteOne(); 
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getTaskById = async (req, res) => {
  try {
    // ⭐ THE FIX: Check if the ID is valid before doing anything else
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, getTaskById, addTask, updateTask, deleteTask };
