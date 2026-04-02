import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks'; // We keep the import the same
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-slate-50"> {/* Monotone Background */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 🚀 Changed /tasks to /dashboard below */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Tasks /></ProtectedRoute>} 
          />
          
          <Route 
            path="/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />
          
          {/* 🏠 Redirect base URL to /dashboard instead of /tasks */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
