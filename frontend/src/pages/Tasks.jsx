import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tighter">Debate Hall</h1>
      
      <TaskForm
        onTaskAdded={fetchTasks} 
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />
      
      <TaskList 
        tasks={tasks} 
        setTasks={setTasks} 
        setEditingTask={setEditingTask}
        userId={loggedInUserId} 
      />
    </div>
  );
};

export default Tasks;
