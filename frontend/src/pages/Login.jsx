import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      
      /* 🛡️ THE SAFETY SAVE: 
         Ensure the token is stored exactly as 'token' so axiosConfig can find it. */
      localStorage.setItem('token', response.data.token); 
      
      login(response.data);
      navigate('/tasks');
    } catch (error) {
      console.error("Login Error:", error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4">
      {/* Updated to Slate/Grey monotone theme */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-8 shadow-xl rounded-xl border border-slate-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800 tracking-tight">
          Debate Login
        </h1>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:outline-none transition"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:outline-none transition"
          />
          
          <button 
            type="submit" 
            className="w-full bg-slate-800 text-white p-3 rounded-lg font-bold hover:bg-slate-700 active:bg-slate-900 transition-all shadow-md mt-2"
          >
            Sign In
          </button>
        </div>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <span className="text-slate-800 font-semibold cursor-pointer hover:underline">Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;