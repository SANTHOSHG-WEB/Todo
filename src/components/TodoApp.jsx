import { useState, useEffect } from 'react';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';

export default function TodoApp({ token }) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('todo_focus_list');
            if (saved) {
                setTodos(JSON.parse(saved));
            }
        } catch (err) {
            console.error("Load error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem('todo_focus_list', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (text) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newTodo = {
            id: Date.now().toString(),
            text,
            completed: false,
            time: timestamp
        };
        setTodos(prev => [...prev, newTodo]);
    };

    const toggleTodo = (id) => {
        setTodos(prev => prev.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const deleteTodo = (id) => {
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    const activeCount = todos.filter(t => !t.completed).length;

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-12 relative z-10">
            <header className="mb-8 md:mb-10 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3 animate-gradient-x tracking-tight">
                    Focus List
                </h1>
                <p className="text-slate-500 text-sm md:text-lg font-medium tracking-wide uppercase">
                    Your Personal Focus List
                </p>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-center text-sm">
                    {error}
                </div>
            )}

            <section className="glass-panel rounded-3xl p-6 md:p-8 mb-8 shadow-2xl shadow-indigo-500/10">
                <TodoInput onAdd={addTodo} />

                <div className="mt-8 space-y-1">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500 animate-pulse">
                            Loading tasks...
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <p className="text-lg">No tasks found</p>
                            <p className="text-sm opacity-70 mt-1">Check your Sheet or add a task!</p>
                        </div>
                    ) : (
                        todos.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                            />
                        ))
                    )}
                </div>
            </section>

            <footer className="flex justify-center text-slate-500 text-sm font-medium">
                <p>{activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining</p>
            </footer>
        </div>
    );
}
