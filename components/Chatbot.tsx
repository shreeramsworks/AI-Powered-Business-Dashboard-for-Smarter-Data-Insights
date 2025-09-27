import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { MessageSquare, Send } from '../constants';

const WEBHOOK_URL = 'https://adapted-mentally-chimp.ngrok-free.app/webhook/sheetaccess';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { from: 'bot', text: "Hello! How can I help you analyze your data today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = { from: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputValue }),
            });

            if (!response.ok) {
                throw new Error(`Webhook failed with status: ${response.status}`);
            }
            
            const responseBody = await response.text();
            console.log('Raw webhook response:', responseBody); // For debugging
            
            let botText;
            let found = false;

            try {
                const data = JSON.parse(responseBody);
                
                // Case 1: n8n format `[{"output": "..."}]`
                if (Array.isArray(data) && data.length > 0 && data[0] && typeof data[0].output === 'string') {
                    botText = data[0].output;
                    found = true;
                }
                // Case 2: Object format `{"output": "..."}` or similar
                else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                    if (typeof data.output === 'string') {
                        botText = data.output;
                        found = true;
                    } else if (typeof data.response === 'string') {
                        botText = data.response;
                        found = true;
                    } else if (typeof data.text === 'string') {
                        botText = data.text;
                        found = true;
                    } else if (typeof data.message === 'string') {
                        botText = data.message;
                        found = true;
                    }
                }
                // Case 3: Simple JSON string `"..."`
                else if (typeof data === 'string') {
                    botText = data;
                    found = true;
                }

                if (!found) {
                    // It's valid JSON, but in an unknown structure. Show it for debugging.
                    botText = `Received unhandled data: ${JSON.stringify(data)}`;
                }

            } catch (error) {
                // Not valid JSON, so treat as plain text.
                botText = responseBody.trim();
            }
            
            if (!botText || !botText.trim()) {
                 botText = "Sorry, I couldn't understand the response.";
            }

            const botMessage: Message = { from: 'bot', text: botText };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('Error contacting webhook:', error);
            const errorMessage: Message = { from: 'error', text: "Sorry, I'm having trouble connecting to the server. The webhook might be offline." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-4 sm:right-6 lg:right-8 w-[90vw] max-w-md h-[70vh] max-h-[600px] flex flex-col bg-slate-900/50 backdrop-blur-xl border border-cyan-400/30 rounded-lg shadow-2xl shadow-cyan-500/10 transition-all duration-300 ease-in-out z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-cyan-400/20">
                    <h2 className="font-orbitron text-lg text-cyan-300">AI Assistant</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </header>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg ${msg.from === 'user' ? 'bg-cyan-600/70 text-white rounded-br-none' : msg.from === 'bot' ? 'bg-slate-700/80 text-gray-200 rounded-bl-none' : 'bg-red-500/70 text-white rounded-bl-none'}`}>
                                <p className="text-sm break-words">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-slate-700/80 text-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-cyan-300 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-cyan-300 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-cyan-300 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-cyan-400/20">
                    <div className="flex items-center bg-slate-800/50 border border-slate-600 rounded-lg focus-within:border-cyan-400 transition-colors">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about your data..."
                            className="w-full bg-transparent p-2 text-gray-200 placeholder-gray-500 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button type="submit" className="p-2 text-cyan-400 hover:text-cyan-200 disabled:text-gray-600 transition-colors" disabled={isLoading || !inputValue.trim()}>
                            <Send />
                        </button>
                    </div>
                </form>
            </div>
            
            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 sm:right-6 lg:right-8 w-16 h-16 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 transform transition-all duration-300 hover:scale-110 z-50"
                aria-label="Toggle Chatbot"
            >
                <MessageSquare />
            </button>
        </>
    );
};

export default Chatbot;