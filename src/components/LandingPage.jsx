import React from 'react';
import { ArrowRight, Brain, Zap, Target, Layers, Play } from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between p-6 md:p-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-[#9D7BFF]/5 blur-3xl -z-10 rounded-full"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161224] border border-[#9D7BFF]/40 mb-8 text-[#9D7BFF] font-mono text-sm font-bold">
          <Zap className="w-4 h-4" /> Theory of Computation Visual Engine
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-tight font-mono mb-6">
          Master automata. <br />
          <span className="text-[#9D7BFF] underline decoration-wavy decoration-[#9D7BFF]/40">Don't just memorize it.</span>
        </h1>

        <p className="text-lg md:text-2xl text-[#A392C9] max-w-2xl font-medium leading-relaxed mb-10">
          Convert, visualize, simulate, and practice finite automata with step-by-step conversion engines built for projection visibility.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab('converter')}
            className="flex items-center justify-center gap-3 bg-[#9D7BFF] text-black font-extrabold text-lg px-8 py-4 rounded-xl hover:bg-[#8052FF] transition-all transform hover:-translate-y-1 shadow-xl shadow-[#9D7BFF]/25"
          >
            <Play className="w-5 h-5 fill-black" />
            START CONVERTING
          </button>
          
          <button
            onClick={() => setActiveTab('practice')}
            className="flex items-center justify-center gap-3 bg-[#161224] text-white border-2 border-[#9D7BFF]/50 font-extrabold text-lg px-8 py-4 rounded-xl hover:border-[#9D7BFF] hover:bg-[#1f1a33] transition-all transform hover:-translate-y-1"
          >
            <Brain className="w-5 h-5 text-[#9D7BFF]" />
            PRACTICE WITH AI
          </button>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid md:grid-cols-3 gap-6 py-10">
        <div className="bg-[#161224] p-6 rounded-2xl border border-[#9D7BFF]/20 hover:border-[#9D7BFF]/60 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#FF4D4D]/20 border border-[#FF4D4D] flex items-center justify-center mb-4">
            <Layers className="w-6 h-6 text-[#FF4D4D]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-mono">Arden's Theorem</h3>
          <p className="text-[#A392C9] text-sm leading-relaxed">
            Solve system algebraic equations directly ($R = Q + RP \implies R = QP^*$) with dynamic step-by-step substitution logs.
          </p>
        </div>

        <div className="bg-[#161224] p-6 rounded-2xl border border-[#9D7BFF]/20 hover:border-[#9D7BFF]/60 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#9D7BFF]/20 border border-[#9D7BFF] flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-[#9D7BFF]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-mono">State Elimination</h3>
          <p className="text-[#A392C9] text-sm leading-relaxed">
            Convert standard DFAs to Generalized NFA (GNFA) and eliminate states interactively until only regular expressions remain.
          </p>
        </div>

        <div className="bg-[#161224] p-6 rounded-2xl border border-[#9D7BFF]/20 hover:border-[#9D7BFF]/60 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#00E676]/20 border border-[#00E676] flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-[#00E676]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-mono">High-Contrast Projection</h3>
          <p className="text-[#A392C9] text-sm leading-relaxed">
            Engineered with heavy typography, bold contrast ratios, and color-coded state borders designed for dull classroom projectors.
          </p>
        </div>
      </section>
    </div>
  );
}
