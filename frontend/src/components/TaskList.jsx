import React from 'react';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks, setTasks, setEditingTask, userId }) => {

  const handleDelete = async (task) => {
    // 1. Detective Work: Look at your console (F12) to see these!
    console.log("Checking Ownership for Delete...");
    console.log("Task Owner ID (from DB):", task.userId || task.user);
    console.log("Your ID (from Browser):", userId);

    // 2. The flexible check
    const ownerId = task.userId || task.user;
    
    // We convert both to Strings to make sure "123" matches 123
    if (!ownerId || ownerId.toString() !== userId?.toString()) {
      alert("❌ Unauthorized: This isn't your debate to delete!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this debate?")) return;
    
    try {
      await axiosInstance.delete(`/api/tasks/${task._id}`);
      setTasks(tasks.filter((t) => t._id !== task._id));
    } catch (error) {
      alert('Failed to delete debate.');
    }
  };

  const handleEdit = (task) => {
    console.log("Checking Ownership for Edit...");
    const ownerId = task.userId || task.user;

    if (!ownerId || ownerId.toString() !== userId?.toString()) {
      alert("❌ Unauthorized: You don't own this debate!");
      return;
    }
    setEditingTask(task);
  };

  if (tasks.length === 0) {
    return <p className="text-center text-slate-400 italic mt-10">The debate hall is currently silent...</p>;
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{task.title}</h2>
              <p className="text-slate-600 mt-2 leading-relaxed">{task.description}</p>
            </div>

            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(task)}
                className="bg-slate-100 text-slate-600 p-2 px-4 rounded-lg hover:bg-slate-200 transition font-semibold text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task)}
                className="bg-slate-800 text-white p-2 px-4 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-xs text-slate-400 uppercase tracking-widest font-bold">
            Status: Active Discussion
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
