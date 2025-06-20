import React, { useState, FormEvent, useRef, useEffect } from 'react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<{ type: 'user' | 'gemini'; text: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for dynamic textarea height

  // Auto-scroll to the latest message whenever messages array changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Adjust textarea height on prompt change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [prompt]); // Re-adjust whenever prompt changes

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return; // Prevent sending empty messages

    const userMessage = prompt;
    setPrompt(''); // Clear input immediately
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: userMessage }]);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }), // Send the user's message
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong with the API call.');
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { type: 'gemini', text: data.text }]);
    } catch (err: any) {
      console.error('Frontend error:', err);
      setError(err.message || 'An unexpected error occurred.');
      setMessages((prevMessages) => [...prevMessages, { type: 'gemini', text: `Error: ${err.message || 'An unexpected error occurred.'}` }]); // Display error in chat
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans antialiased text-gray-800">
      <div className="flex flex-col w-full max-w-5xl h-[calc(100vh-2rem)] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-blue-700 text-white shadow-lg z-10 rounded-t-xl">
          <h1 className="text-3xl font-bold tracking-tight">Clinic AI Assistant</h1>
          {/* You can add a logo or user info here */}
          {/* <img src="/path/to/your/logo.png" alt="Clinic Logo" className="h-10 w-auto" /> */}
          <span className="text-sm opacity-80">Powered by Gemini</span>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xl text-center">
              <p className="mb-2">Hello! How can I assist you today?</p>
              <p className="text-base max-w-md">
                Ask me about common symptoms, medical terms, administrative queries, or generate drafts for patient communication.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-xl shadow-md transition-all duration-200 ease-in-out ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] p-4 rounded-xl shadow-md bg-white text-gray-500 border border-gray-200 rounded-bl-none">
                <span className="animate-pulse">AI is thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center mt-4">
              <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm border border-red-200 shadow-sm">
                Error: {error}
              </p>
            </div>
          )}

          <div ref={messagesEndRef} /> {/* For auto-scrolling */}
        </main>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-6 bg-gray-100 border-t border-gray-200 shadow-inner">
          <div className="flex items-end space-x-4">
            <textarea
              ref={textareaRef}
              rows={1} // Start with 1 row
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none overflow-hidden transition-all duration-200 ease-in-out"
              placeholder="Type your message here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              style={{ minHeight: '56px', maxHeight: '180px' }} // Adjusted min/max height
            ></textarea>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105
                ${
                  loading || !prompt.trim()
                    ? 'bg-blue-300 text-blue-100 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800 text-white shadow-lg'
                }`}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;