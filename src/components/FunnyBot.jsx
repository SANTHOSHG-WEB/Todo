import { useState, useEffect, useRef } from 'react';

const RESPONSES = [
    "Wow, another task? Productive aren't we?",
    "I'm judging you silently.",
    "Are you sure you want to do that?",
    "Maybe take a nap instead?",
    "I've seen better todo lists.",
    "Why are you telling me this?",
    "404: Motivation not found.",
    "I'm just a bot, don't ask me.",
    "That sounds boring.",
    "Do you ever stop working?",
    "Fine, I'll pretend to care.",
    "Have you tried turning it off and on again?",
    "I'd help, but I don't want to.",
    "Cool story, bro.",
];

export default function FunnyBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi, I'm the unhelpful assistant. What do you want?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue;
        setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
        setInputValue("");

        // Simulate bot thinking
        setTimeout(() => {
            const randomResponse = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
            setMessages(prev => [...prev, { text: randomResponse, sender: 'bot' }]);
        }, 1000 + Math.random() * 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-80 h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-indigo-600 p-4 flex justify-between items-center">
                        <span className="font-bold text-white">Sarcastic Bot 🤖</span>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Say something..."
                            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors"
                            disabled={!inputValue.trim()}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-700 text-slate-300' : 'bg-indigo-600 text-white animate-bounce-slow'
                    }`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <span className="text-2xl">🤖</span>
                )}
            </button>
        </div>
    );
}
