import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ onTaskAdded, editingTask, setEditingTask }) => {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

  // If we are editing, fill the form with the existing debate data
  useEffect(() => {
    if (editingTask) {
      setTopic(editingTask.title);
      setDescription(editingTask.description);
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title: topic, description };
      
      if (editingTask) {
        await axiosInstance.put(`/api/tasks/${editingTask._id}`, payload);
        setEditingTask(null);
      } else {
        await axiosInstance.post('/api/tasks', payload);
      }

      onTaskAdded();
      setTopic('');
      setDescription('');
    } catch (error) {
      alert("Failed to save debate. Check backend!");
    }
  };

  return (
    <div className="bg-slate-100 p-8 rounded-2xl shadow-inner border border-slate-200 mb-10">
      <h2 className="text-slate-800 text-2xl font-bold mb-6 tracking-tight">
        {editingTask ? "📝 Edit Debate" : "🎙️ Start a New Debate"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Proposed Topic..." 
          className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 focus:outline-none transition"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <textarea 
          placeholder="Opening Argument..." 
          className="w-full p-4 bg-white border border-slate-300 rounded-xl h-32 focus:ring-2 focus:ring-slate-400 focus:outline-none transition"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-slate-800 text-white p-4 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-lg">
            {editingTask ? "Update Debate" : "Publish Debate"}
          </button>
          {editingTask && (
            <button onClick={() => setEditingTask(null)} className="bg-slate-300 text-slate-700 p-4 rounded-xl font-bold hover:bg-slate-400 transition">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;