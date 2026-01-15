import { useGoogleLogin } from '@react-oauth/google';

export default function Login({ onLogin }) {
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => onLogin(codeResponse),
        scope: 'email profile https://www.googleapis.com/auth/spreadsheets',
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-8">
                Focus List
            </h1>
            <div className="glass-panel p-10 rounded-3xl max-w-md w-full flex flex-col items-center gap-6">
                <p className="text-slate-300 text-lg">
                    Sign in to sync your tasks with Google Sheets.
                </p>
                <button
                    onClick={() => login()}
                    className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Sign in with Google
                </button>
                <p className="text-xs text-slate-500 mt-4">
                    Requires a Google Cloud Project with Sheets API enabled.
                </p>
            </div>
        </div>
    );
}
