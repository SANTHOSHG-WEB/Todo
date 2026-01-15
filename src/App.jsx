import { useState, useEffect } from 'react';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';
import TodoApp from './components/TodoApp';
import Login from './components/Login';
import FunnyBot from './components/FunnyBot';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('google_token');
    if (savedToken) {
      const tokenData = JSON.parse(savedToken);
      fetchUserProfile(tokenData.access_token);
    }
  }, []);

  const handleLogin = (response) => {
    sessionStorage.setItem('google_token', JSON.stringify(response));
    fetchUserProfile(response.access_token);
  };

  const fetchUserProfile = async (accessToken) => {
    try {
      const res = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userData = { ...res.data, access_token: accessToken };
      setUser(userData);
      logActivity(userData, 'LOGIN', accessToken);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const logActivity = async (userData, type, token) => {
    try {
      const timestamp = new Date().toLocaleString();
      await axios.post(
        `https://sheets.googleapis.com/v4/spreadsheets/1mwIZOsL1z-0eYWlr0TbnwR26zx-x279D-gLnRpWaYxA/values/Logins!A:D:append?valueInputOption=USER_ENTERED`,
        { values: [[userData.email, userData.name, type, timestamp]] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(`Failed to log ${type}:`, err);
    }
  };

  const handleLogout = () => {
    if (user) logActivity(user, 'LOGOUT', user.access_token);
    googleLogout();
    setUser(null);
    sessionStorage.removeItem('google_token');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-slate-950 to-slate-950 -z-10"></div>

      {user ? (
        <div className="relative pt-20 md:pt-0">
          <header className="absolute top-4 left-4 right-4 md:top-8 md:right-8 md:left-auto flex items-center justify-between md:justify-end gap-4 z-50">
            {user.picture && (
              <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-md p-1.5 pl-3 rounded-full border border-slate-700/50">
                <span className="text-xs md:text-sm font-medium text-slate-200 hidden sm:block">{user.name}</span>
                <img src={user.picture} alt="Profile" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-600" />
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-xs md:text-sm text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 hover:bg-slate-700/50"
            >
              Sign out
            </button>
          </header>
          <TodoApp token={user.access_token} />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <FunnyBot />
    </div>
  );
}

export default App;
