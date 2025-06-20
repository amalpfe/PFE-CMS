import { motion } from "framer-motion";
import Banner from "../components/Banner";
import Header from "../components/Header";
import Speciality from "../components/Speciality";
import { useState, useEffect, useRef, FormEvent } from "react";
import { FiMessageCircle } from "react-icons/fi";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Home = () => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<{ type: 'user' | 'gemini'; text: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

    useEffect(() => {
    if (showAssistant && messages.length === 0) {
      setMessages([
        {
          type: 'gemini',
          text: "Welcome! What symptoms are you experiencing today?",
        },
      ]);
    }
  }, [showAssistant]);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt('');
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API error.');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { type: 'gemini', text: data.text }]);
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
      setMessages((prev) => [...prev, { type: 'gemini', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-12 relative pb-24">
      <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
        <Header />
      </motion.section>

      <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
        <Speciality />
      </motion.section>

      <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
        <Banner />
      </motion.section>

      <button
        onClick={() => setShowAssistant(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50"
        title="Ask AI Assistant"
      >
        <FiMessageCircle className="text-2xl" />
      </button>

      {showAssistant && (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center">

          <div className="w-full max-w-5xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 bg-purple-600 text-white rounded-t-xl">
              <h1 className="text-2xl font-bold">Clinic AI Assistant</h1>
              <button onClick={() => setShowAssistant(false)} className="text-white font-bold text-xl">&times;</button>
            </div>
            <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500">
                  <p>Hello! How can I assist you today?</p>
                  <p className="text-sm">Ask me about symptoms, medical questions, or communication help.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-xl shadow-sm ${msg.type === 'user' ?  'bg-purple-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-gray-500">AI is thinking...</div>}
              {error && <div className="text-red-600 text-sm">Error: {error}</div>}
              <div ref={messagesEndRef} />
            </main>
            <form onSubmit={handleSubmit} className="p-4 bg-gray-100 border-t border-gray-200">
              <div className="flex items-end gap-3">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={1}
                  placeholder="Type your message..."
                  className="flex-1 resize-none p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className={`px-6 py-2 rounded-lg text-white font-medium ${loading || !prompt.trim() ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                  {loading ? '...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;