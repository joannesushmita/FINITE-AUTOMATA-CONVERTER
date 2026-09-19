import React, { useState, useRef } from 'react';
import { Plus, Play, ChevronLeft, ChevronRight, X, RotateCcw, Info, ArrowRight } from 'lucide-react';

export default function ConverterCanvas({ setActiveTab }) {
  const [states, setStates] = useState([
    { id: 'q0', type: 'start', x: 150, y: 220, label: 'q0' },
    { id: 'q1', type: 'accept', x: 450, y: 220, label: 'q1' }
  ]);
  
  const [transitions, setTransitions] = useState([
    { id: 't1', from: 'q0', to: 'q0', label: '0' },
    { id: 't2', from: 'q0', to: 'q1', label: '1' },
    { id: 't3', from: 'q1', to: 'q1', label: '0,1' }
  ]);

  const [selectedAnchor, setSelectedAnchor] = useState(null); // { stateId, anchorDir }
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null); // 'arden' or 'elimination'
  const [activeSlide, setActiveSlide] = useState(0);

  const canvasRef = useRef(null);

  // Add state helper
  const addState = (type) => {
    const nextId = `q${states.length}`;
    const newX = 100 + (states.length * 120) % 600;
    const newY = 150 + Math.floor(states.length / 5) * 100;
    setStates([...states, { id: nextId, type, x: newX, y: newY, label: nextId }]);
  };

  const handleAnchorClick = (stateId, dir, event) => {
    event.stopPropagation();
    if (!selectedAnchor) {
      setSelectedAnchor({ stateId, dir });
    } else {
      if (selectedAnchor.stateId === stateId) {
        // Self loop
        const symbol = prompt("Enter transition symbol(s) (e.g. 0 or a,b):", "0");
        if (symbol) {
          setTransitions([...transitions, {
            id: `t_${Date.now()}`,
            from: stateId,
            to: stateId,
            label: symbol
          }]);
        }
      } else {
        // Directed edge
        const symbol = prompt("Enter transition symbol(s) (e.g. 1 or b):", "1");
        if (symbol) {
          setTransitions([...transitions, {
            id: `t_${Date.now()}`,
            from: selectedAnchor.stateId,
            to: stateId,
            label: symbol
          }]);
        }
      }
      setSelectedAnchor(null);
    }
  };

  const clearCanvas = () => {
    setStates([]);
    setTransitions([]);
    setSelectedAnchor(null);
  };

  // Preset example loading
  const loadExample = () => {
    setStates([
      { id: 'q0', type: 'start', x: 180, y: 220, label: 'q0' },
      { id: 'q1', type: 'intermediate', x: 420, y: 220, label: 'q1' },
      { id: 'q2', type: 'accept', x: 660, y: 220, label: 'q2' }
    ]);
    setTransitions([
      { id: 't1', from: 'q0', to: 'q0', label: '0' },
      { id: 't2', from: 'q0', to: 'q1', label: '1' },
      { id: 't3', from: 'q1', to: 'q2', label: '0' },
      { id: 't4', from: 'q1', to: 'q0', label: '1' },
      { id: 't5', from: 'q2', to: 'q2', label: '0,1' }
    ]);
  };

  // Dummy slide deck generator for chosen methods
  const ardenSlides = [
    {
      title: "Slide 1: Formulate Initial System Equations",
      equations: [
        "q0 = ε + q0·0 + q1·1",
        "q1 = q0·1",
        "q2 = q1·0 + q2·(0+1)"
      ],
      description: "Step 1: Write equation for each state q_i = ∑ (q_j · symbol) + (ε if start state)."
    },
    {
      title: "Slide 2: Substitute State q1 into q0 Equation",
      equations: [
        "q0 = ε + q0·0 + (q0·1)·1",
        "q0 = ε + q0·(0 + 11)"
      ],
      description: "Apply substitution. Notice q0 is now in the form R = Q + RP where Q = ε, P = (0 + 11)."
    },
    {
      title: "Slide 3: Apply Ardens Theorem (R = Q + RP => R = QP*)",
      equations: [
        "Ardens Rule: R = Q + RP  ==>  R = Q P*",
        "q0 = ε · (0 + 11)*",
        "q0 = (0 + 11)*"
      ],
      description: "Solving equation for q0 yields expression for paths starting at q0."
    },
    {
      title: "Slide 4: Solve Final Accepting State q2",
      equations: [
        "q1 = (0 + 11)* · 1",
        "q2 = (0 + 11)* · 1 · 0 + q2·(0 + 1)",
        "q2 = [(0 + 11)* · 1 · 0] · (0 + 1)*"
      ],
      description: "Final Regular Expression representing language accepted by the final state q2."
    }
  ];

  const eliminationSlides = [
    {
      title: "Slide 1: Create Initial GNFA",
      equations: [
        "Add Start State (q_start) -> q0 with ε",
        "Add Final State q2 -> (q_final) with ε"
      ],
      description: "Convert existing DFA into a Generalized Non-Deterministic Finite Automaton (GNFA)."
    },
    {
      title: "Slide 2: Eliminate Intermediate State q1",
      equations: [
        "Incoming to q1: (q0, 1)",
        "Outgoing from q1: (q2, 0), (q0, 1)",
        "New Edge q0 -> q2 label = 1 · 0 = 10",
        "New Edge q0 -> q0 label = 0 + 11"
      ],
      description: "State q1 is removed. Direct transitions are updated using path concatenation $R_{in} R_{loop}^* R_{out}$."
    },
    {
      title: "Slide 3: Final State Elimination (q0)",
      equations: [
        "q_start -> q_final Label = (0 + 11)* · 10 · (0 + 1)*"
      ],
      description: "Single remaining transition between q_start and q_final gives the complete Regular Expression."
    }
  ];

  const currentSlides = selectedMethod === 'arden' ? ardenSlides : eliminationSlides;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Control Bar & Header */}
      <div className="bg-[#161224] border border-[#9D7BFF]/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-white font-mono font-extrabold text-sm mr-2 uppercase tracking-wider">
            Add Node:
          </span>
          <button
            onClick={() => addState('start')}
            className="px-3 py-1.5 rounded-lg border-2 border-[#FF4D4D] bg-[#FF4D4D]/10 text-white font-bold text-xs hover:bg-[#FF4D4D]/30 transition"
          >
            + Start State
          </button>
          <button
            onClick={() => addState('intermediate')}
            className="px-3 py-1.5 rounded-lg border-2 border-[#9D7BFF] bg-[#9D7BFF]/10 text-white font-bold text-xs hover:bg-[#9D7BFF]/30 transition"
          >
            + Intermediate State
          </button>
          <button
            onClick={() => addState('dead')}
            className="px-3 py-1.5 rounded-lg border-2 border-[#990000] bg-[#990000]/10 text-white font-bold text-xs hover:bg-[#990000]/30 transition"
          >
            + Dead State
          </button>
          <button
            onClick={() => addState('accept')}
            className="px-3 py-1.5 rounded-lg border-2 border-[#00E676] bg-[#00E676]/10 text-white font-bold text-xs hover:bg-[#00E676]/30 transition"
          >
            + Final State
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadExample}
            className="px-3 py-1.5 rounded-lg bg-[#161224] border border-[#9D7BFF]/40 text-[#9D7BFF] font-bold text-xs hover:bg-[#9D7BFF]/10 transition flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" /> Preset Example
          </button>
          <button
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800 text-red-300 font-bold text-xs hover:bg-red-900/60 transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Main Drawing Canvas */}
      <div 
        ref={canvasRef}
        className="w-full h-[450px] bg-[#08060C] border-2 border-[#9D7BFF]/30 rounded-2xl relative overflow-hidden shadow-inner flex flex-col justify-between p-4"
      >
        <div className="absolute top-3 left-4 text-xs font-mono text-[#A392C9] bg-[#161224]/80 px-3 py-1 rounded-full border border-[#9D7BFF]/20">
          {selectedAnchor 
            ? `Click another anchor (or same for self-loop) to draw transition from ${selectedAnchor.stateId}` 
            : 'Click on state anchor dots (N, S, E, W) to connect states with transitions.'}
        </div>

        {/* Render SVG Transition Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9D7BFF" />
            </marker>
          </defs>

          {transitions.map((t) => {
            const fromNode = states.find(s => s.id === t.from);
            const toNode = states.find(s => s.id === t.to);

            if (!fromNode || !toNode) return null;

            if (fromNode.id === toNode.id) {
              // Self Loop
              return (
                <g key={t.id}>
                  <path
                    d={`M ${fromNode.x} ${fromNode.y - 32} C ${fromNode.x - 30} ${fromNode.y - 80}, ${fromNode.x + 30} ${fromNode.y - 80}, ${fromNode.x} ${fromNode.y - 32}`}
                    fill="none"
                    stroke="#9D7BFF"
                    strokeWidth="3"
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x={fromNode.x}
                    y={fromNode.y - 85}
                    fill="#FFFFFF"
                    fontSize="14"
                    fontWeight="800"
                    fontFamily="Roboto Mono"
                    textAnchor="middle"
                  >
                    {t.label}
                  </text>
                </g>
              );
            }

            // Line between nodes
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2 - 15;

            return (
              <g key={t.id}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#9D7BFF"
                  strokeWidth="3"
                  markerEnd="url(#arrow)"
                />
                <rect
                  x={midX - 12}
                  y={midY - 12}
                  width="24"
                  height="20"
                  fill="#161224"
                  rx="4"
                  stroke="#9D7BFF"
                  strokeWidth="1"
                />
                <text
                  x={midX}
                  y={midY + 2}
                  fill="#FFFFFF"
                  fontSize="13"
                  fontWeight="800"
                  fontFamily="Roboto Mono"
                  textAnchor="middle"
                >
                  {t.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Render States Nodes */}
        <div className="relative w-full h-full z-10">
          {states.map((st) => {
            let borderColor = 'border-[#9D7BFF]';
            if (st.type === 'start') borderColor = 'border-[#FF4D4D]';
            if (st.type === 'dead') borderColor = 'border-[#990000]';
            if (st.type === 'accept') borderColor = 'border-[#00E676] border-4';

            return (
              <div
                key={st.id}
                style={{ left: `${st.x - 32}px`, top: `${st.y - 32}px` }}
                className={`absolute w-16 h-16 rounded-full bg-[#161224] border-4 ${borderColor} flex items-center justify-center shadow-lg group select-none`}
              >
                {/* Large Start Arrow if Start State */}
                {st.type === 'start' && (
                  <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 text-[#FF4D4D] flex items-center">
                    <ArrowRight className="w-8 h-8 stroke-[3]" />
                  </div>
                )}

                <span className="font-mono font-extrabold text-white text-base">
                  {st.label}
                </span>

                {/* 4 Connection Anchors (North, South, East, West) */}
                <button
                  onClick={(e) => handleAnchorClick(st.id, 'N', e)}
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-[#9D7BFF] rounded-full border border-white hover:scale-125 transition"
                  title="Connect North"
                />
                <button
                  onClick={(e) => handleAnchorClick(st.id, 'S', e)}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-[#9D7BFF] rounded-full border border-white hover:scale-125 transition"
                  title="Connect South"
                />
                <button
                  onClick={(e) => handleAnchorClick(st.id, 'E', e)}
                  className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3.5 h-3.5 bg-[#9D7BFF] rounded-full border border-white hover:scale-125 transition"
                  title="Connect East"
                />
                <button
                  onClick={(e) => handleAnchorClick(st.id, 'W', e)}
                  className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3.5 h-3.5 bg-[#9D7BFF] rounded-full border border-white hover:scale-125 transition"
                  title="Connect West"
                />
              </div>
            );
          })}
        </div>

        {/* Floating Generate Action Button */}
        <div className="absolute bottom-6 right-6 z-20">
          <button
            onClick={() => setShowMethodModal(true)}
            className="flex items-center gap-2 bg-[#FF3333] hover:bg-[#e62e2e] text-white font-extrabold text-lg px-7 py-3.5 rounded-full shadow-2xl shadow-red-600/50 hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5 fill-white" /> GENERATE REGEX
          </button>
        </div>
      </div>

      {/* Modal Choice Window */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161224] border-2 border-[#9D7BFF] rounded-2xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowMethodModal(false)}
              className="absolute top-4 right-4 text-[#A392C9] hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-extrabold text-white font-mono mb-2">
              Select Conversion Method
            </h2>
            <p className="text-[#A392C9] text-sm mb-6">
              Choose the mathematical engine to derive the Regular Expression from your drawn DFA.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setSelectedMethod('arden');
                  setShowMethodModal(false);
                  setActiveSlide(0);
                }}
                className="w-full text-left p-4 rounded-xl bg-[#08060C] border-2 border-[#9D7BFF]/40 hover:border-[#9D7BFF] hover:bg-[#9D7BFF]/10 transition group"
              >
                <div className="font-extrabold font-mono text-white text-lg group-hover:text-[#9D7BFF] flex justify-between items-center">
                  1. USING ARDEN'S THEOREM
                  <ArrowRight className="w-5 h-5" />
                </div>
                <p className="text-xs text-[#A392C9] mt-1">
                  Solves state equations $R = Q + RP \implies R = QP^*$ through systematic substitution.
                </p>
              </button>

              <button
                onClick={() => {
                  setSelectedMethod('elimination');
                  setShowMethodModal(false);
                  setActiveSlide(0);
                }}
                className="w-full text-left p-4 rounded-xl bg-[#08060C] border-2 border-[#9D7BFF]/40 hover:border-[#9D7BFF] hover:bg-[#9D7BFF]/10 transition group"
              >
                <div className="font-extrabold font-mono text-white text-lg group-hover:text-[#9D7BFF] flex justify-between items-center">
                  2. USING STATE ELIMINATION METHOD
                  <ArrowRight className="w-5 h-5" />
                </div>
                <p className="text-xs text-[#A392C9] mt-1">
                  Converts DFA to GNFA and eliminates states iteratively to yield regular expression edges.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-Step Interactive Slide Deck Visualizer */}
      {selectedMethod && (
        <div className="bg-[#161224] border-2 border-[#9D7BFF] rounded-2xl p-6 md:p-8 relative shadow-2xl flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-[#9D7BFF]/20 pb-4">
              <span className="text-[#9D7BFF] font-mono font-extrabold text-sm uppercase tracking-widest">
                Engine: {selectedMethod === 'arden' ? "Arden's Theorem" : "State Elimination"}
              </span>
              <span className="text-xs font-mono text-white bg-[#08060C] px-3 py-1 rounded-full border border-[#9D7BFF]/30">
                Step {activeSlide + 1} of {currentSlides.length}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-white font-mono mb-3">
              {currentSlides[activeSlide].title}
            </h3>

            {/* Display Mathematical Equations */}
            <div className="bg-[#08060C] p-5 rounded-xl border border-[#9D7BFF]/30 mb-4 space-y-2">
              {currentSlides[activeSlide].equations.map((eq, i) => (
                <div key={i} className="font-mono text-white text-lg md:text-xl font-extrabold tracking-wide">
                  {eq}
                </div>
              ))}
            </div>

            <p className="text-[#A392C9] font-medium text-sm md:text-base leading-relaxed">
              {currentSlides[activeSlide].description}
            </p>
          </div>

          {/* Slide Deck Bottom Control Bar */}
          <div className="flex items-center justify-between border-t border-[#9D7BFF]/20 pt-6 mt-6">
            <button
              disabled={activeSlide === 0}
              onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08060C] border border-[#9D7BFF]/40 text-white font-bold disabled:opacity-30 hover:border-[#9D7BFF] transition"
            >
              <ChevronLeft className="w-5 h-5" /> Previous Step
            </button>

            {activeSlide < currentSlides.length - 1 ? (
              <button
                onClick={() => setActiveSlide(prev => Math.min(currentSlides.length - 1, prev + 1))}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#9D7BFF] text-black font-extrabold hover:bg-[#8052FF] transition shadow-lg shadow-[#9D7BFF]/20"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#00E676]/10 border border-[#00E676] rounded-xl text-[#00E676] font-mono font-extrabold text-sm">
                  FINAL REGEX: <span className="text-white text-base ml-1">(0 + 11)* · 10 · (0 + 1)*</span>
                </div>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-3 rounded-full bg-[#FF3333] hover:bg-[#e62e2e] text-white font-extrabold text-sm shadow-xl shadow-red-600/40 transition"
                >
                  Exit to Home
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
