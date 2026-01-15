export default function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <div className={`group flex items-center justify-between p-4 mb-3 rounded-xl border transition-all duration-300 ${todo.completed
                ? 'bg-slate-900/40 border-slate-800/50 opacity-60'
                : 'bg-slate-800 border-slate-700 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5'
            }`}>
            <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <button
                    onClick={() => onToggle(todo.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${todo.completed
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent shadow-sm'
                            : 'border-slate-500 hover:border-indigo-400 bg-transparent'
                        }`}
                >
                    {todo.completed && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
                <span className={`text-lg truncate transition-all duration-300 select-none cursor-pointer ${todo.completed
                        ? 'line-through text-slate-500'
                        : 'text-slate-200'
                    }`} onClick={() => onToggle(todo.id)}>
                    {todo.text}
                </span>
            </div>
            <button
                onClick={() => onDelete(todo.id)}
                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all p-2 rounded-lg hover:bg-red-500/10 ml-2"
                aria-label="Delete task"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
}
