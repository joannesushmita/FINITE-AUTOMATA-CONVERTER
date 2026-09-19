import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ConverterCanvas from './components/ConverterCanvas';
import PracticeHub from './components/PracticeHub';
import AskAI from './components/AskAI';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#0D0B14] text-white flex flex-col font-sans selection:bg-[#9D7BFF] selection:text-black">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === 'home' && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === 'converter' && <ConverterCanvas setActiveTab={setActiveTab} />}
        {activeTab === 'practice' && <PracticeHub setActiveTab={setActiveTab} />}
        {activeTab === 'ask-ai' && <AskAI />}
      </main>
    </div>
  );
}
