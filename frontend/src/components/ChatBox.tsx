import { useState } from 'react';

const ChatBox = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: 'user', text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  try {
    const response = await fetch('http://localhost:5000/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input,
        history: messages.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
    } else {
      setMessages((prev) => [...prev, { sender: 'ai', text: '⚠️ Error from server: ' + data.error }]);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setMessages((prev) => [...prev, { sender: 'ai', text: '⚠️ Failed to connect to AI server.' }]);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
      <div className="h-64 overflow-y-scroll space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
            <p className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-100' : 'bg-gray-200'}`}>
              {msg.text}
            </p>
          </div>
        ))}
        {loading && <p className="text-left text-sm text-gray-400">AI is typing...</p>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 p-2 rounded"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-purple-700 text-white px-4 py-2 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
