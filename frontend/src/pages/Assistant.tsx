// src/pages/Assistant.tsx
import ChatBox from '../components/ChatBox';

const Assistant = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Virtual Health Assistant</h1>
      <ChatBox />
    </div>
  );
};

export default Assistant;
