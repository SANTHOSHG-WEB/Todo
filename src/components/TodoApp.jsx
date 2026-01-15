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
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:D`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const rows = response.data.values || [];
            const parsedTodos = rows.slice(1).map((row, index) => ({
                id: row[0],
                text: row[1],
                completed: row[2] === 'TRUE',
                time: row[3] || '',
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
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // Optimistic update
        const tempTodo = { id: newId, text, completed: false, time: timestamp, apiRowIndex: -1 };
        setTodos(prev => [...prev, tempTodo]);

        try {
            await axios.post(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:D:append?valueInputOption=USER_ENTERED`,
                { values: [[newId, text, "FALSE", timestamp]] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
        const newStatus = !todo.completed;
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: newStatus } : t));

        try {
            const rowNumber = todo.apiRowIndex + 1;
            await axios.put(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!C${rowNumber}?valueInputOption=USER_ENTERED`,
                { values: [[newStatus.toString().toUpperCase()]] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error(err);
            setError("Failed to update status.");
            setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: todo.completed } : t));
        }
    };

    const deleteTodo = async (id) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        setTodos(prev => prev.filter(t => t.id !== id));

        try {
            await axios.post(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
                {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: 0,
                                dimension: "ROWS",
                                startIndex: todo.apiRowIndex,
                                endIndex: todo.apiRowIndex + 1
                            }
                        }
                    }]
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTodos();
        } catch (err) {
            console.error(err);
            setError("Failed to delete task.");
            fetchTodos();
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
                    Stored in Shared Spreadsheet
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
