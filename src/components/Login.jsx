import { supabase } from '../supabaseClient';
import { useState } from 'react';

export default function Login() {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        });
        if (error) {
            console.error("Login error:", error.message);
            alert("Login failed: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="glass-panel max-w-md w-full p-8 md:p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/20 rotate-3 group-hover:rotate-6 transition-transform duration-500">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-3">Focus List</h1>
                    <p className="text-slate-400 mb-10 leading-relaxed font-light">
                        Cloud-synced distraction-free productivity.
                    </p>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                    >
                        {!loading ? (
                            <>
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                Continue with Google
                            </>
                        ) : (
                            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </button>

                    <p className="mt-8 text-xs text-slate-500 font-medium uppercase tracking-[0.2em]">
                        Stored securely by Supabase
                    </p>
                </div>
            </div>
        </div>
    );
}
