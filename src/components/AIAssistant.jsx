import { useState, useEffect, useRef } from 'react';

export default function AIAssistant({ todos, user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: `Hello ${user?.full_name || 'there'}! I am your Focus AI. How can I assist with your tasks today?`, sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const analyzeTasks = (query) => {
        const q = query.toLowerCase();
        const activeTasks = todos.filter(t => !t.completed);
        const completedTasks = todos.filter(t => t.completed);

        if (q.includes("next") || q.includes("do first") || q.includes("what should i do")) {
            if (activeTasks.length === 0) return "You're all caught up! No pending tasks in your Focus List.";
            return `Based on your list, your next priority should be: "${activeTasks[0].text}". You have ${activeTasks.length} active tasks in total.`;
        }

        if (q.includes("how many") || q.includes("status") || q.includes("summary")) {
            return `Project Summary: You have ${todos.length} total tasks. ${activeTasks.length} are pending and ${completedTasks.length} are completed. Completion rate: ${todos.length > 0 ? Math.round((completedTasks.length / todos.length) * 100) : 0}%.`;
        }

        if (q.includes("help") || q.includes("organize")) {
            return "I can help you prioritize! Use keywords like 'next', 'summary', or ask about specific tasks. I analyze your Supabase database in real-time.";
        }

        if (activeTasks.some(t => q.includes(t.text.toLowerCase()))) {
            const task = activeTasks.find(t => q.includes(t.text.toLowerCase()));
            return `Yes, the task "${task.text}" is currently on your pending list. It was created at ${task.time}.`;
        }

        return "I'm analyzing your Focus List... I can provide summaries or help you identify your next task. Try asking 'What should I do next?'";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue;
        setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
        setInputValue("");
        setIsTyping(true);

        // Professional AI response simulation (Local RAG)
        setTimeout(() => {
            const botResponse = analyzeTasks(userText);
            setIsTyping(false);
            setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
        }, 1200);
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end max-w-[calc(100vw-2rem)] font-sans">
            {isOpen && (
                <div className="mb-4 w-72 sm:w-80 h-[28rem] max-h-[70vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500 ring-1 ring-white/10">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white text-sm tracking-tight">Focus AI</span>
                                <span className="text-[10px] text-indigo-100 font-medium opacity-80 uppercase tracking-widest">RAG Optimized</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-900/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-4 bg-slate-800/50 backdrop-blur-md border-t border-slate-700/50 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about your tasks..."
                            className="flex-1 bg-slate-900/80 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:grayscale"
                            disabled={!inputValue.trim() || isTyping}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden ${isOpen ? 'bg-slate-800 rotate-90 ring-1 ring-slate-700' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:shadow-indigo-500/40'
                    }`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                        <svg className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </>
                )}
            </button>
        </div>
    );
}
