import React from 'react';
import { Sparkles, Cpu, BookOpen, MessageSquare, Home as HomeIcon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'converter', label: 'Converter', icon: Cpu },
    { id: 'practice', label: 'Practice', icon: BookOpen },
    { id: 'ask-ai', label: 'Ask AI', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#161224]/90 backdrop-blur-md border-b border-[#9D7BFF]/20 px-6 py-4 flex flex-wrap items-center justify-between shadow-xl">
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="p-2 bg-[#9D7BFF]/20 rounded-xl border border-[#9D7BFF] group-hover:scale-105 transition-transform">
          <Sparkles className="w-6 h-6 text-[#9D7BFF] animate-pulse" />
        </div>
        <span className="text-xl md:text-2xl font-extrabold tracking-wider text-white font-mono">
          ✦ AUTOMATA <span className="text-[#9D7BFF]">AI LAB</span>
        </span>
      </div>

      <nav className="flex items-center gap-1 sm:gap-2 mt-3 sm:mt-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm tracking-wide transition-all ${
                isActive
                  ? 'bg-[#9D7BFF] text-black shadow-lg shadow-[#9D7BFF]/30 scale-105'
                  : 'text-[#A392C9] hover:text-white hover:bg-[#161224] border border-transparent hover:border-[#9D7BFF]/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
