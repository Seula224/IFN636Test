import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    /* Changed bg-blue-600 to bg-slate-900 for a deep, professional monotone look */
    <nav className="bg-slate-900 text-gray-100 p-4 flex justify-between items-center shadow-lg">
      {/* Renamed Brand to Online Debate Platform */}
      <Link to="/" className="text-2xl font-bold tracking-tight hover:text-gray-400 transition">
        Online Debate Platform
      </Link>
      
      <div className="flex items-center">
        {user ? (
          <>
            {/* Renamed Tasks to Debates and added hover effect */}
            <Link to="/tasks" className="mr-6 hover:text-gray-400 transition">Debates</Link>
            <Link to="/profile" className="mr-6 hover:text-gray-400 transition">Profile</Link>
            <button
              onClick={handleLogout}
              /* Changed red-500 to a medium grey (slate-600) to keep it monotone */
              className="bg-slate-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-500 transition shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-6 hover:text-gray-400 transition">Login</Link>
            <Link
              to="/register"
              className="bg-zinc-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-600 transition shadow-sm"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;