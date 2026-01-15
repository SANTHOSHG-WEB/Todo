import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';

export default function TodoApp({ token, userEmail }) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .eq('user_email', userEmail)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setTodos(data || []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to load your tasks from database.");
        } finally {
            setLoading(false);
        }
    }, [userEmail]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const addTodo = async (text) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newTempId = Date.now().toString();

        // Optimistic update
        const tempTodo = { id: newTempId, text, completed: false, time: timestamp, user_email: userEmail };
        setTodos(prev => [...prev, tempTodo]);

        try {
            const { data, error } = await supabase
                .from('todos')
                .insert([{ text, completed: false, time: timestamp, user_email: userEmail }])
                .select();

            if (error) throw error;
            // Replace temp todo with real one from DB
            setTodos(prev => prev.map(t => t.id === newTempId ? data[0] : t));
        } catch (err) {
            console.error("Add error:", err);
            setTodos(prev => prev.filter(t => t.id !== newTempId));
            setError("Failed to save task.");
        }
    };

    const toggleTodo = async (id) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        const newStatus = !todo.completed;

        // Optimistic
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: newStatus } : t));

        try {
            const { error } = await supabase
                .from('todos')
                .update({ completed: newStatus })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error("Update error:", err);
            setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: todo.completed } : t));
        }
    };

    const deleteTodo = async (id) => {
        // Optimistic
        setTodos(prev => prev.filter(t => t.id !== id));

        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error("Delete error:", err);
            fetchTodos(); // Revert
        }
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
