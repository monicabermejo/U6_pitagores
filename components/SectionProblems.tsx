import React, { useState } from 'react';
import { SectionProps } from '../types';
import { REAL_PROBLEMS, TEXTS } from '../constants';
import { motion } from 'framer-motion';
import { Check, X, ChevronRight, ChevronDown } from 'lucide-react';
import { trackAnswer } from '../utils/trackAnswer';

export const SectionProblems: React.FC<SectionProps> = ({ lang, onComplete, isLocked, studentEmail, sessionId }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<{ [key: string]: boolean | null }>({});
  
  // Pagination to keep it clean
  const [page, setPage] = useState(0);
  const [activityOpen, setActivityOpen] = useState(false);

  if (isLocked) return null;

  const currentProblem = REAL_PROBLEMS[page];
  const totalCorrect = Object.values(results).filter(Boolean).length;
  const isAllDone = totalCorrect >= REAL_PROBLEMS.length;

  const checkCurrent = () => {
    const val = parseFloat(answers[currentProblem.id]);
    const isCorrect = val === currentProblem.answer;
    setResults({ ...results, [currentProblem.id]: isCorrect });

    // Registrar resposta al Google Sheet
    trackAnswer({
      email: studentEmail,
      questionId: currentProblem.id,
      questionText: currentProblem.question[lang],
      userAnswer: isNaN(val) ? '' : val,
      correctAnswer: currentProblem.answer,
      isCorrect,
      section: 'problems',
      lang,
      sessionId,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px] flex flex-col">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 w-full">
           <div 
             className="h-full bg-indigo-500 transition-all duration-500" 
             style={{ width: `${((page + 1) / REAL_PROBLEMS.length) * 100}%` }} 
           />
        </div>

        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
            <span className="text-gray-400 font-bold tracking-widest text-sm mb-4">
               PROBLEMA {page + 1} / {REAL_PROBLEMS.length}
            </span>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-8 max-w-2xl leading-relaxed">
              {currentProblem.question[lang]}
            </h3>

            <div className="flex items-center gap-4 w-full max-w-xs">
              <input 
                 type="number"
                 placeholder="0.00"
                 value={answers[currentProblem.id] || ''}
                 onChange={(e) => setAnswers({ ...answers, [currentProblem.id]: e.target.value })}
                 className="flex-1 text-center text-3xl font-bold border-b-4 border-gray-200 focus:border-indigo-500 outline-none py-2 text-indigo-600 placeholder-gray-200 transition-colors bg-transparent"
              />
              <span className="text-2xl font-bold text-gray-400">{currentProblem.unit}</span>
            </div>

            <div className="h-16 mt-6 flex items-center justify-center">
              {results[currentProblem.id] === true && (
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-500 font-bold text-xl bg-green-50 px-6 py-2 rounded-full">
                   <Check size={28} /> {TEXTS.correct[lang]}
                 </motion.div>
              )}
               {results[currentProblem.id] === false && (
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-red-500 font-bold text-xl bg-red-50 px-6 py-2 rounded-full">
                   <X size={28} /> {TEXTS.incorrect[lang]}
                 </motion.div>
              )}
            </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-100">
           <button 
             onClick={() => setPage(p => Math.max(0, p - 1))}
             disabled={page === 0}
             className="px-6 py-2 font-bold text-gray-500 hover:text-indigo-600 disabled:opacity-30"
           >
             ← Anterior
           </button>

           <button 
              onClick={checkCurrent}
              className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all"
           >
             {TEXTS.check[lang]}
           </button>

           <button 
             onClick={() => setPage(p => Math.min(REAL_PROBLEMS.length - 1, p + 1))}
             disabled={page === REAL_PROBLEMS.length - 1}
             className="px-6 py-2 font-bold text-gray-500 hover:text-indigo-600 disabled:opacity-30"
           >
             Següent →
           </button>
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-2">
         {REAL_PROBLEMS.map((_, idx) => (
           <div 
             key={idx} 
             onClick={() => setPage(idx)}
             className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
               idx === page ? 'bg-indigo-600 scale-125' : 
               results[REAL_PROBLEMS[idx].id] ? 'bg-green-400' : 'bg-gray-300'
             }`}
           />
         ))}
      </div>

      {isAllDone && (
        <div className="text-center p-8 bg-yellow-100 rounded-xl border-2 border-yellow-400 mb-8 animate-bounce">
           <h2 className="text-3xl font-black text-yellow-600 mb-4">🏆 MESTRE PITAGÒRIC!</h2>
           <p className="text-yellow-800">Has completat tots els problemes reals.</p>
        </div>
      )}

      {/* NEW EVALUABLE ACTIVITY SECTION */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl mb-8 shadow-sm overflow-hidden">
         <button
           onClick={() => setActivityOpen(o => !o)}
           className="w-full flex items-center justify-between p-6 text-left hover:bg-purple-100 transition-colors"
         >
           <h3 className="text-xl font-bold text-purple-900">{TEXTS.s4_activity_title[lang]}</h3>
           <ChevronDown
             size={22}
             className={`text-purple-600 transition-transform duration-300 ${activityOpen ? 'rotate-180' : ''}`}
           />
         </button>
         {activityOpen && (
           <div className="px-8 pb-8 space-y-6 text-purple-800">
             {/* Fase 1 */}
             <div className="bg-white/60 rounded-lg p-5 border border-purple-100">
               <p className="font-bold text-lg mb-2">{TEXTS.s4_activity_p1_title[lang]}</p>
               <p className="text-base leading-relaxed">{TEXTS.s4_activity_p1[lang]}</p>
             </div>
             {/* Fase 2 */}
             <div className="bg-white/60 rounded-lg p-5 border border-purple-100">
               <p className="font-bold text-lg mb-2">{TEXTS.s4_activity_p2_title[lang]}</p>
               <p className="text-base leading-relaxed">{TEXTS.s4_activity_p2[lang]}</p>
             </div>
             {/* Fase 3 */}
             <div className="bg-white/60 rounded-lg p-5 border border-purple-100">
               <p className="font-bold text-lg mb-2">{TEXTS.s4_activity_p3_title[lang]}</p>
               <p className="text-base leading-relaxed">{TEXTS.s4_activity_p3[lang]}</p>
             </div>
             {/* Avaluació */}
             <div className="bg-purple-100/80 rounded-lg p-5 border border-purple-200">
               <p className="font-bold text-lg mb-3">{TEXTS.s4_activity_eval_title[lang]}</p>
               <ul className="space-y-2 text-base">
                 <li className="flex gap-2"><span>🧩</span> {TEXTS.s4_activity_eval1[lang]}</li>
                 <li className="flex gap-2"><span>🎙️</span> {TEXTS.s4_activity_eval2[lang]}</li>
                 <li className="flex gap-2"><span>✍️</span> {TEXTS.s4_activity_eval3[lang]}</li>
               </ul>
             </div>
           </div>
         )}
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onComplete}
          className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 flex items-center gap-2"
        >
          {TEXTS.section_ext_title[lang]} <ChevronRight size={20}/>
        </button>
      </div>
    </motion.div>
  );
};