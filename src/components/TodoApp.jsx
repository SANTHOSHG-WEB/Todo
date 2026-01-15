import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';

const SPREADSHEET_ID = "1mwIZOsL1z-0eYWlr0TbnwR26zx-x279D-gLnRpWaYxA";
const SHEET_NAME = 'Sheet1';

export default function TodoApp({ token }) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTodos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:C`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const rows = response.data.values || [];
            // Assume Row 1 is header. Data starts row 2.
            // Map rows: [ID, Text, Completed]
            const parsedTodos = rows.slice(1).map((row, index) => ({
                id: row[0],
                text: row[1],
                completed: row[2] === 'TRUE',
                apiRowIndex: index + 1
            }));
            setTodos(parsedTodos);
            setError(null);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error?.message || err.message;
            setError(`Failed to load todos: ${msg}`);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchTodos();
    }, [token, fetchTodos]);

    const addTodo = async (text) => {
        const newId = Date.now().toString();
        // Optimistic update
        const tempTodo = { id: newId, text, completed: false, apiRowIndex: -1 };
        setTodos(prev => [...prev, tempTodo]);

        try {
            await axios.post(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:C:append?valueInputOption=USER_ENTERED`,
                { values: [[newId, text, "FALSE"]] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refetch to get correct row indices
            fetchTodos();
        } catch (err) {
            console.error(err);
            setError("Failed to add task.");
            setTodos(prev => prev.filter(t => t.id !== newId));
        }
    };

    const toggleTodo = async (id) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        // Optimistic
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

        try {
            // Row is 1-based for A1 notation. 
            // Header is row 1. Data starts row 2. 
            // apiRowIndex 1 (0-based) = Row 2 (0-based) which is Row 3 (1-based)? No.
            // Let's trace:
            // Rows: [Header, Item1, Item2]
            // Indices: 0, 1, 2
            // slice(1) -> [Item1, Item2]
            // Item1: index 0 in map. apiRowIndex = 0 + 1 = 1.
            // Item1 is at row 1 (0-based) in full sheet.
            // A1 Notation for Row 1 is "2". (Row 1 is "1").
            // So Row Number = apiRowIndex + 1.
            const rowNumber = todo.apiRowIndex + 1;

            await axios.put(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!C${rowNumber}?valueInputOption=USER_ENTERED`,
                { values: [[(!todo.completed).toString().toUpperCase()]] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error(err);
            setError("Failed to update task.");
            // Revert
            setTodos(todos.map(t => t.id === id ? { ...t, completed: todo.completed } : t));
        }
    };

    const deleteTodo = async (id) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        // Optimistic
        setTodos(todos.filter(t => t.id !== id));

        try {
            await axios.post(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
                {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: 0, // Assuming first sheet is 0
                                dimension: "ROWS",
                                startIndex: todo.apiRowIndex,
                                endIndex: todo.apiRowIndex + 1
                            }
                        }
                    }]
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Must refetch because all subsequent row indices have changed
            fetchTodos();
        } catch (err) {
            console.error(err);
            setError("Failed to delete task.");
            fetchTodos(); // Revert by fetching
        }
    };

    const activeCount = todos.filter(t => !t.completed).length;

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-12 relative z-10">
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3 animate-gradient-x">
                    Focus List
                </h1>
                <p className="text-slate-400 text-lg">
                    Synced with Google Sheets
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
