import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import TodoApp from './components/TodoApp';
import Login from './components/Login';
import FunnyBot from './components/FunnyBot';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const user = session?.user;
  const userMetadata = user?.user_metadata;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-slate-950 to-slate-950 -z-10"></div>

      {session ? (
        <div className="relative pt-20 md:pt-0">
          <header className="absolute top-4 left-4 right-4 md:top-8 md:right-8 md:left-auto flex items-center justify-between md:justify-end gap-4 z-50">
            {userMetadata?.avatar_url && (
              <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-md p-1.5 pl-3 rounded-full border border-slate-700/50">
                <span className="text-xs md:text-sm font-medium text-slate-200 hidden sm:block">{userMetadata.full_name}</span>
                <img src={userMetadata.avatar_url} alt="Profile" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-600" />
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-xs md:text-sm text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 hover:bg-slate-700/50"
            >
              Sign out
            </button>
          </header>
          <TodoApp userId={user.id} userEmail={user.email} />
        </div>
      ) : (
        <Login />
      )}
      <FunnyBot />
    </div>
  );
}

export default App;
