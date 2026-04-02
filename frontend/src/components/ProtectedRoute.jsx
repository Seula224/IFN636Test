import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If the AuthContext is still checking for a token, show a loading message
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-400 animate-pulse font-bold tracking-widest uppercase">
          Verifying Credentials...
        </div>
      </div>
    );
  }

  // If there's no user, kick them back to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, let them through to the debates!
  return children;
};

export default ProtectedRoute;