import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send Login Request
      const response = await axiosInstance.post('/api/auth/login', formData);
      console.log("Full Login Response:", response.data); // Helpful for debugging

      // 2. Save the Token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      /* 🛡️ THE SAFETY ID SEARCH:
         We check every possible place the ID could be hiding so it's never 'null'. */
      const retrievedId = 
        response.data.user?._id || 
        response.data.userId || 
        response.data.id || 
        response.data.user?.id;

      if (retrievedId) {
        localStorage.setItem('userId', retrievedId);
        console.log("Identity Confirmed! Saved User ID:", retrievedId);
      } else {
        console.warn("Backend didn't send an ID in the usual spots. Check console!");
      }

      // 3. Update Auth Context and Redirect
      login(response.data);
      navigate('/dashboard');

    } catch (error) {
      console.error("Login Error Details:", error.response?.data || error.message);
      
      // If the error is a 401, it's usually a wrong password.
      if (error.response?.status === 401) {
        alert('Invalid email or password. Please try again.');
      } else {
        alert('Login failed. The server might be having a moment.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4">
      <form onSubmit={handleSubmit} className="bg-slate-50 p-8 shadow-xl rounded-xl border border-slate-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800 tracking-tight">
          Debate Login
        </h1>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:outline-none transition"
          />
          
          <input
            type="password"
            placeholder="Password"
            required
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
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-slate-800 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
