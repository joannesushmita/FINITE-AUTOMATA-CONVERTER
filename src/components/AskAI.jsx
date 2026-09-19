import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

export default function AskAI() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your Automata AI Lab Assistant. Ask me anything about Ardens Theorem, DFA to RegEx algorithms, state elimination, or NFA properties!'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: input }];
    setMessages(newMsgs);
    setInput('');

    setTimeout(() => {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: `In theory of computation, when applying Ardens theorem R = Q + RP, ensure P does not contain ε. For your query "${input}", state elimination reduces transitions by calculating R_in (R_loop)* R_out.`
        }
      ]);
    }, 600);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <div className="bg-[#161224] border border-[#9D7BFF]/30 p-4 rounded-t-2xl flex items-center gap-3">
        <Bot className="w-6 h-6 text-[#9D7BFF]" />
        <span className="font-mono font-extrabold text-white text-lg">Automata AI Assistant</span>
      </div>

      <div className="flex-1 bg-[#08060C] border-x border-[#9D7BFF]/20 p-4 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              m.sender === 'user' ? 'bg-[#9D7BFF] text-black' : 'bg-[#161224] border border-[#9D7BFF] text-[#9D7BFF]'
            }`}>
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`p-4 rounded-2xl max-w-lg font-mono text-sm leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-[#9D7BFF] text-black font-extrabold rounded-tr-none' 
                : 'bg-[#161224] text-white border border-[#9D7BFF]/30 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="bg-[#161224] border border-[#9D7BFF]/30 p-4 rounded-b-2xl flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about DFA to RegEx derivation..."
          className="flex-1 bg-[#08060C] border border-[#9D7BFF]/30 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#9D7BFF]"
        />
        <button
          type="submit"
          className="bg-[#9D7BFF] text-black font-bold p-3 rounded-xl hover:bg-[#8052FF] transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
