import React, { useState } from 'react';
import { Lightbulb, HelpCircle, CheckCircle2, XCircle, ChevronLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';

const mockQuestionsData = [
  {
    id: 1,
    dfaTitle: "DFA accepting strings over {0,1} ending with '1'",
    svgDiagram: (
      <svg className="w-full h-32" viewBox="0 0 400 100">
        <circle cx="80" cy="50" r="22" fill="#161224" stroke="#FF4D4D" strokeWidth="3" />
        <text x="80" y="55" fill="#FFF" fontSize="14" fontWeight="800" textAnchor="middle">q0</text>
        <path d="M 10 50 L 55 50" stroke="#FF4D4D" strokeWidth="3" markerEnd="url(#arrow)" />
        
        <line x1="102" y1="50" x2="258" y2="50" stroke="#9D7BFF" strokeWidth="3" />
        <text x="180" y="42" fill="#FFF" fontSize="14" fontWeight="800" textAnchor="middle">1</text>
        
        <circle cx="280" cy="50" r="22" fill="#161224" stroke="#00E676" strokeWidth="4" />
        <text x="280" y="55" fill="#FFF" fontSize="14" fontWeight="800" textAnchor="middle">q1</text>
        
        <path d="M 80 28 C 60 0, 100 0, 80 28" fill="none" stroke="#9D7BFF" strokeWidth="2" />
        <text x="80" y="10" fill="#FFF" fontSize="12" fontWeight="800" textAnchor="middle">0</text>

        <path d="M 280 28 C 260 0, 300 0, 280 28" fill="none" stroke="#9D7BFF" strokeWidth="2" />
        <text x="280" y="10" fill="#FFF" fontSize="12" fontWeight="800" textAnchor="middle">1</text>

        <path d="M 270 70 C 200 100, 100 100, 90 70" fill="none" stroke="#9D7BFF" strokeWidth="2" />
        <text x="180" y="95" fill="#FFF" fontSize="12" fontWeight="800" textAnchor="middle">0</text>
      </svg>
    ),
    options: [
      { id: 'A', text: '(0 + 1)* 1', correct: true },
      { id: 'B', text: '0* 1*', correct: false },
      { id: 'C', text: '(01)* 1', correct: false },
      { id: 'D', text: '1* (0 + 1)', correct: false }
    ],
    hint: "Identify the loops on q0 and q1. Any number of 0s can occur before a final '1'.",
    explanation: "q0 loops on '0' (0*), transitions to q1 on '1'. q1 loops on '1' and returns to q0 on '0'. Overall language is (0+1)*1."
  },
  {
    id: 2,
    dfaTitle: "DFA accepting even number of 0s",
    svgDiagram: (
      <svg className="w-full h-32" viewBox="0 0 400 100">
        <circle cx="100" cy="50" r="22" fill="#161224" stroke="#00E676" strokeWidth="4" />
        <text x="100" y="55" fill="#FFF" fontSize="14" fontWeight="800" textAnchor="middle">q0</text>
        
        <line x1="122" y1="50" x2="258" y2="50" stroke="#9D7BFF" strokeWidth="3" />
        <text x="190" y="42" fill="#FFF" fontSize="14" fontWeight="800" textAnchor="middle">0</text>
        
        <circle cx="280" cy="50" r="22" fill="#161224" stroke="#9D7BFF" strokeWidth="3" />
        <text x="280" y="55" fill="#FFF" fontSize="14" fontWeight="800" textAnchor="middle">q1</text>
      </svg>
    ),
    options: [
      { id: 'A', text: '(00)*', correct: true },
      { id: 'B', text: '0* 0*', correct: false },
      { id: 'C', text: '(0 + 0)*', correct: false },
      { id: 'D', text: '0 (00)*', correct: false }
    ],
    hint: "Transitions swap between even/odd counts upon each '0'.",
    explanation: "Two '0's are required to return to the initial accept state q0, yielding (00)*."
  }
];

export default function PracticeHub({ setActiveTab }) {
  const [difficulty, setDifficulty] = useState('EASY');
  const [method, setMethod] = useState('arden');
  const [numQuestions, setNumQuestions] = useState(2);
  const [quizStarted, setQuizStarted] = useState(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qIdx]: selectedOptionId }
  const [revealedHints, setRevealedHints] = useState({}); // { [qIdx]: true }
  const [revealedSolutions, setRevealedSolutions] = useState({}); // { [qIdx]: true }
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentIdx(0);
    setUserAnswers({});
    setRevealedHints({});
    setRevealedSolutions({});
    setIsSubmitted(false);
  };

  const handleSelectOption = (qIdx, optionId) => {
    if (userAnswers[qIdx]) return; // prevent changing answer
    setUserAnswers({ ...userAnswers, [qIdx]: optionId });
  };

  const currentQ = mockQuestionsData[currentIdx];

  // Calculate scores for review
  const totalQuestions = Math.min(numQuestions, mockQuestionsData.length);
  const correctCount = Object.keys(userAnswers).filter(
    (qIdx) => mockQuestionsData[qIdx]?.options.find(o => o.id === userAnswers[qIdx])?.correct
  ).length;
  const hintsCount = Object.keys(revealedHints).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {!quizStarted ? (
        /* Configuration Controls Section */
        <div className="bg-[#161224] border border-[#9D7BFF]/30 p-6 md:p-10 rounded-2xl shadow-2xl max-w-3xl mx-auto w-full">
          <h2 className="text-3xl font-extrabold text-white font-mono mb-2">
            Practice Hub Configuration
          </h2>
          <p className="text-[#A392C9] mb-8 font-medium">
            Customize AI test questions generated for DFA to RegEx conversion.
          </p>

          <div className="space-y-6">
            {/* Difficulty Toggle */}
            <div>
              <label className="block text-xs font-mono font-extrabold text-[#9D7BFF] uppercase tracking-wider mb-2">
                Select Difficulty:
              </label>
              <div className="flex gap-3">
                {['EASY', 'MEDIUM', 'HARD'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-3 rounded-xl font-mono font-extrabold text-sm border-2 transition ${
                      difficulty === d
                        ? 'bg-[#9D7BFF] text-black border-[#9D7BFF] shadow-lg shadow-[#9D7BFF]/20'
                        : 'bg-[#08060C] text-[#A392C9] border-[#9D7BFF]/20 hover:border-[#9D7BFF]/50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Method Toggle */}
            <div>
              <label className="block text-xs font-mono font-extrabold text-[#9D7BFF] uppercase tracking-wider mb-2">
                Conversion Engine Focus:
              </label>
              <div className="flex gap-3">
                {[
                  { id: 'arden', label: "Arden's Theorem" },
                  { id: 'elimination', label: 'State Elimination' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex-1 py-3 rounded-xl font-mono font-extrabold text-sm border-2 transition ${
                      method === m.id
                        ? 'bg-[#9D7BFF] text-black border-[#9D7BFF] shadow-lg shadow-[#9D7BFF]/20'
                        : 'bg-[#08060C] text-[#A392C9] border-[#9D7BFF]/20 hover:border-[#9D7BFF]/50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Quantity Selector */}
            <div>
              <label className="block text-xs font-mono font-extrabold text-[#9D7BFF] uppercase tracking-wider mb-2">
                Quantity of Questions:
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full bg-[#08060C] border-2 border-[#9D7BFF]/30 text-white font-mono font-bold p-3 rounded-xl focus:border-[#9D7BFF] outline-none"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Question' : 'Questions'}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full bg-[#9D7BFF] text-black font-extrabold font-mono text-lg py-4 rounded-xl hover:bg-[#8052FF] transition shadow-xl shadow-[#9D7BFF]/30 mt-4"
            >
              Generate Practice Questions
            </button>
          </div>
        </div>
      ) : isSubmitted ? (
        /* Final Performance Review Modal/Slide */
        <div className="bg-[#161224] border-2 border-[#9D7BFF] p-8 md:p-12 rounded-2xl shadow-2xl max-w-2xl mx-auto w-full text-center">
          <Trophy className="w-20 h-20 text-[#00E676] mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-extrabold text-white font-mono mb-2">
            Quiz Completed!
          </h2>
          <p className="text-[#A392C9] mb-8 font-medium">
            Here is your performance breakdown for this session.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#08060C] p-4 rounded-xl border border-[#9D7BFF]/30">
              <div className="text-xs font-mono text-[#A392C9] uppercase">Correct Score</div>
              <div className="text-3xl font-extrabold font-mono text-[#10B981]">
                {correctCount} / {totalQuestions}
              </div>
            </div>
            <div className="bg-[#08060C] p-4 rounded-xl border border-[#9D7BFF]/30">
              <div className="text-xs font-mono text-[#A392C9] uppercase">Hints Used</div>
              <div className="text-3xl font-extrabold font-mono text-[#9D7BFF]">
                {hintsCount}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('home')}
            className="bg-[#9D7BFF] text-black font-extrabold font-mono px-8 py-4 rounded-xl hover:bg-[#8052FF] transition shadow-xl shadow-[#9D7BFF]/20"
          >
            Return to Home Page
          </button>
        </div>
      ) : (
        /* Quiz Interface Layout */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar (Question Navigator) */}
          <div className="bg-[#161224] border border-[#9D7BFF]/30 p-4 rounded-2xl flex flex-col gap-3">
            <h3 className="font-mono font-extrabold text-[#9D7BFF] text-xs uppercase tracking-wider mb-2">
              Question Navigator
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalQuestions }).map((_, idx) => {
                const isCurrent = currentIdx === idx;
                const isAnswered = userAnswers[idx] !== undefined;

                let stateClass = 'bg-[#08060C] text-[#A392C9] border-[#9D7BFF]/20';
                if (isAnswered) stateClass = 'bg-[#10B981] text-black border-[#10B981] font-extrabold';
                if (isCurrent) stateClass = 'bg-[#9D7BFF] text-black border-[#9D7BFF] font-extrabold ring-2 ring-white';

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-lg border flex items-center justify-center font-mono text-sm transition ${stateClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Question Panel */}
          <div className="lg:col-span-3 bg-[#161224] border border-[#9D7BFF]/30 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono text-[#9D7BFF] uppercase tracking-widest font-bold">
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-mono text-white bg-[#08060C] px-3 py-1 rounded-full border border-[#9D7BFF]/30">
                  Target DFA Diagram
                </span>
              </div>

              {/* Target DFA Graph Diagram */}
              <div className="bg-[#08060C] border border-[#9D7BFF]/30 rounded-xl p-4 mb-6 flex items-center justify-center">
                {currentQ.svgDiagram}
              </div>

              <h4 className="text-lg font-bold text-white mb-4 font-mono">
                Which Regular Expression represents the language accepted by this DFA?
              </h4>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentQ.options.map((opt) => {
                  const selectedOpt = userAnswers[currentIdx];
                  const isThisSelected = selectedOpt === opt.id;

                  let styleClass = 'bg-[#08060C] border-[#9D7BFF]/30 text-white hover:border-[#9D7BFF]';
                  if (selectedOpt) {
                    if (opt.correct) {
                      styleClass = 'bg-[#10B981]/20 border-[#10B981] text-white font-extrabold';
                    } else if (isThisSelected && !opt.correct) {
                      styleClass = 'bg-[#EF4444]/20 border-[#EF4444] text-white font-extrabold';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentIdx, opt.id)}
                      className={`p-4 rounded-xl border-2 text-left font-mono transition flex items-center gap-3 ${styleClass}`}
                    >
                      <span className="w-8 h-8 rounded-lg bg-[#161224] border border-white/20 flex items-center justify-center text-sm font-bold">
                        {opt.id}
                      </span>
                      <span className="text-base">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Red Explanation Box for Incorrect Selection */}
              {userAnswers[currentIdx] && !currentQ.options.find(o => o.id === userAnswers[currentIdx])?.correct && (
                <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444] text-white font-mono text-xs leading-relaxed mb-6">
                  <span className="font-extrabold text-[#EF4444] block mb-1">✕ INCORRECT EXPLANATION:</span>
                  {currentQ.explanation}
                </div>
              )}

              {/* Contextual Hint Box */}
              {revealedHints[currentIdx] && (
                <div className="p-4 rounded-xl bg-[#9D7BFF]/10 border border-[#9D7BFF] text-white font-mono text-xs leading-relaxed mb-6">
                  <span className="font-extrabold text-[#9D7BFF] block mb-1">💡 HINT:</span>
                  {currentQ.hint}
                </div>
              )}

              {/* Step-by-Step Solution Derivation */}
              {revealedSolutions[currentIdx] && (
                <div className="p-4 rounded-xl bg-[#00E676]/10 border border-[#00E676] text-white font-mono text-xs leading-relaxed mb-6">
                  <span className="font-extrabold text-[#00E676] block mb-1">✓ FULL SOLUTION DERIVATION:</span>
                  {currentQ.explanation}
                </div>
              )}
            </div>

            {/* Bottom Controls & Navigation */}
            <div className="flex flex-wrap items-center justify-between border-t border-[#9D7BFF]/20 pt-6 gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setRevealedHints({ ...revealedHints, [currentIdx]: true })}
                  className="px-3 py-2 rounded-lg bg-[#08060C] border border-[#9D7BFF]/40 text-[#9D7BFF] text-xs font-mono font-bold flex items-center gap-1 hover:bg-[#9D7BFF]/20"
                >
                  <Lightbulb className="w-3.5 h-3.5" /> Hint
                </button>
                <button
                  onClick={() => setRevealedSolutions({ ...revealedSolutions, [currentIdx]: true })}
                  className="px-3 py-2 rounded-lg bg-[#08060C] border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1 hover:bg-emerald-500/20"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Give Answer
                </button>
              </div>

              <div className="flex gap-3">
                {currentIdx > 0 && (
                  <button
                    onClick={() => setCurrentIdx(prev => prev - 1)}
                    className="px-4 py-2 rounded-xl bg-[#08060C] border border-[#9D7BFF]/40 text-white font-mono font-bold text-sm flex items-center gap-1 hover:border-[#9D7BFF]"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                )}

                {currentIdx < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-[#9D7BFF] text-black font-mono font-extrabold text-sm flex items-center gap-1 hover:bg-[#8052FF]"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSubmitted(true)}
                    className="px-6 py-2 rounded-xl bg-[#00E676] text-black font-mono font-extrabold text-sm hover:bg-[#00c865]"
                  >
                    Submit & View Score
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
