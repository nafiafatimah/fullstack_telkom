import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('jwt_token')
  );

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <Dashboard 
      onLogout={() => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }} 
    />
  );
}