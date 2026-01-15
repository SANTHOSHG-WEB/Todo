import { useState } from 'react';

export default function TodoInput({ onAdd }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 group">
            <div className="relative">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full bg-slate-800 text-white rounded-xl px-5 py-4 pr-20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-black/20 border border-slate-700 transition-all placeholder:text-slate-500 text-lg"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all shadow-md hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!text.trim()}
                >
                    Add
                </button>
            </div>
        </form>
    );
}
