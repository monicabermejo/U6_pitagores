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
  const [examplesOpen, setExamplesOpen] = useState(true);
  const [exReveal, setExReveal] = useState<{ [k: string]: boolean }>({});

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
      {/* ── EXEMPLES GUIATS ─────────────────────────────────────────── */}
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setExamplesOpen(o => !o)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-indigo-100 transition-colors"
        >
          <h3 className="text-xl font-bold text-indigo-900">
            {lang === 'ca' ? '🧑‍🏫 Exemples guiats — Resolem junts!' : '🧑‍🏫 Ejemplos guiados — ¡Resolvemos juntos!'}
          </h3>
          <ChevronDown
            size={22}
            className={`text-indigo-600 transition-transform duration-300 ${examplesOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {examplesOpen && (
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Exemple 1: Escala recolzada a la paret — 3, 4, 5 */}
            <div className="bg-white rounded-xl p-5 border border-indigo-100 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">{lang === 'ca' ? 'Exemple 1' : 'Ejemplo 1'}</span>
              <svg width="160" height="130" viewBox="0 0 160 140">
                {/* Wall */}
                <rect x="15" y="10" width="12" height="110" fill="#d1d5db" stroke="#6b7280" strokeWidth="1.5"/>
                {/* Bricks */}
                <line x1="15" y1="30" x2="27" y2="30" stroke="#9ca3af" strokeWidth="0.8"/>
                <line x1="15" y1="50" x2="27" y2="50" stroke="#9ca3af" strokeWidth="0.8"/>
                <line x1="15" y1="70" x2="27" y2="70" stroke="#9ca3af" strokeWidth="0.8"/>
                <line x1="15" y1="90" x2="27" y2="90" stroke="#9ca3af" strokeWidth="0.8"/>
                <line x1="21" y1="10" x2="21" y2="30" stroke="#9ca3af" strokeWidth="0.8"/>
                <line x1="21" y1="50" x2="21" y2="70" stroke="#9ca3af" strokeWidth="0.8"/>
                <line x1="21" y1="90" x2="21" y2="110" stroke="#9ca3af" strokeWidth="0.8"/>
                {/* Ground */}
                <line x1="5" y1="120" x2="150" y2="120" stroke="#6b7280" strokeWidth="2"/>
                {/* Ladder */}
                <line x1="27" y1="28" x2="115" y2="120" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round"/>
                {/* Ladder rungs */}
                <line x1="42" y1="42" x2="52" y2="56" stroke="#b45309" strokeWidth="2" transform="rotate(-42, 47, 49)"/>
                <line x1="55" y1="56" x2="65" y2="70" stroke="#b45309" strokeWidth="2" transform="rotate(-42, 60, 63)"/>
                <line x1="68" y1="70" x2="78" y2="84" stroke="#b45309" strokeWidth="2" transform="rotate(-42, 73, 77)"/>
                <line x1="81" y1="84" x2="91" y2="98" stroke="#b45309" strokeWidth="2" transform="rotate(-42, 86, 91)"/>
                <line x1="94" y1="98" x2="104" y2="112" stroke="#b45309" strokeWidth="2" transform="rotate(-42, 99, 105)"/>
                {/* Right angle marker */}
                <rect x="27" y="108" width="10" height="10" fill="none" stroke="#4b5563" strokeWidth="1.5"/>
                {/* Height label (vertical) */}
                <text x="8" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366f1">? m</text>
                {/* Base label */}
                <text x="70" y="135" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#374151">4 m</text>
                {/* Ladder label */}
                <text x="82" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#b45309">5 m</text>
              </svg>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {lang === 'ca'
                  ? 'Una escala de 5 m es recolza a la paret. El peu està a 4 m de la paret. A quina altura arriba?'
                  : 'Una escalera de 5 m se apoya en la pared. El pie está a 4 m de la pared. ¿A qué altura llega?'}
              </p>
              <button
                onClick={() => setExReveal(r => ({ ...r, ex1: true }))}
                className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors ${exReveal.ex1 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
              >
                {exReveal.ex1 ? (lang === 'ca' ? '✓ Resolució' : '✓ Resolución') : (lang === 'ca' ? 'Mostra la resolució' : 'Muestra la resolución')}
              </button>
              {exReveal.ex1 && (
                <div className="mt-3 bg-indigo-50 rounded-lg p-3 text-left w-full text-sm space-y-1">
                  <p className="font-mono text-indigo-800">c² + 4² = 5²</p>
                  <p className="font-mono text-indigo-800">c² = 25 − 16 = 9</p>
                  <p className="font-mono text-indigo-800">c = √9 = <strong>3 m</strong></p>
                </div>
              )}
            </div>

            {/* Exemple 2: Arbre 6m, ombra 8m, distància = 10 */}
            <div className="bg-white rounded-xl p-5 border border-indigo-100 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">{lang === 'ca' ? 'Exemple 2' : 'Ejemplo 2'}</span>
              <svg width="160" height="130" viewBox="0 0 180 140">
                {/* Ground */}
                <line x1="10" y1="120" x2="170" y2="120" stroke="#9ca3af" strokeWidth="1.5"/>
                {/* Tree trunk */}
                <rect x="25" y="40" width="10" height="80" fill="#92400e" rx="2"/>
                {/* Tree canopy */}
                <ellipse cx="30" cy="35" rx="20" ry="18" fill="#22c55e" opacity="0.8"/>
                {/* Height arrow */}
                <line x1="15" y1="40" x2="15" y2="120" stroke="#e53e3e" strokeWidth="2"/>
                <text x="8" y="83" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e53e3e" transform="rotate(-90, 8, 83)">6 m</text>
                {/* Shadow */}
                <line x1="35" y1="120" x2="140" y2="120" stroke="#fbbf24" strokeWidth="4" opacity="0.5"/>
                <text x="88" y="135" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">8 m</text>
                {/* Hypotenuse */}
                <line x1="30" y1="40" x2="140" y2="120" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="6"/>
                <text x="95" y="72" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#6366f1">?</text>
                {/* Right angle */}
                <rect x="35" y="108" width="10" height="10" fill="none" stroke="#4b5563" strokeWidth="1.5"/>
              </svg>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {lang === 'ca'
                  ? 'Un arbre fa 6 m d\'alt. La seva ombra mesura 8 m. Quant mesura la distància de la copa a la punta de l\'ombra?'
                  : 'Un árbol mide 6 m de alto. Su sombra mide 8 m. ¿Cuánto mide la distancia de la copa a la punta de la sombra?'}
              </p>
              <button
                onClick={() => setExReveal(r => ({ ...r, ex2: true }))}
                className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors ${exReveal.ex2 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
              >
                {exReveal.ex2 ? (lang === 'ca' ? '✓ Resolució' : '✓ Resolución') : (lang === 'ca' ? 'Mostra la resolució' : 'Muestra la resolución')}
              </button>
              {exReveal.ex2 && (
                <div className="mt-3 bg-indigo-50 rounded-lg p-3 text-left w-full text-sm space-y-1">
                  <p className="font-mono text-indigo-800">h² = 6² + 8²</p>
                  <p className="font-mono text-indigo-800">h² = 36 + 64 = 100</p>
                  <p className="font-mono text-indigo-800">h = √100 = <strong>10 m</strong></p>
                </div>
              )}
            </div>

            {/* Exemple 3: Parc 5×12, drecera = 13 */}
            <div className="bg-white rounded-xl p-5 border border-indigo-100 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">{lang === 'ca' ? 'Exemple 3' : 'Ejemplo 3'}</span>
              <svg width="160" height="130" viewBox="0 0 180 130">
                {/* Park (rectangle) */}
                <rect x="20" y="20" width="120" height="80" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" rx="4"/>
                {/* Trees decorative */}
                <circle cx="50" cy="50" r="6" fill="#16a34a" opacity="0.4"/>
                <circle cx="100" cy="40" r="5" fill="#16a34a" opacity="0.3"/>
                <circle cx="75" cy="70" r="7" fill="#16a34a" opacity="0.3"/>
                {/* Walk path (two sides) */}
                <line x1="20" y1="100" x2="20" y2="20" stroke="#4b5563" strokeWidth="2.5"/>
                <line x1="20" y1="20" x2="140" y2="20" stroke="#4b5563" strokeWidth="2.5"/>
                {/* Diagonal shortcut */}
                <line x1="20" y1="100" x2="140" y2="20" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="6"/>
                {/* Labels */}
                <text x="8" y="63" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">5 m</text>
                <text x="80" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">12 m</text>
                <text x="90" y="72" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#6366f1">?</text>
                {/* Right angle */}
                <rect x="20" y="20" width="10" height="10" fill="none" stroke="#4b5563" strokeWidth="1.5"/>
                {/* Person icon at start */}
                <circle cx="20" cy="106" r="4" fill="#6366f1"/>
                {/* Flag at end */}
                <line x1="140" y1="20" x2="140" y2="8" stroke="#e53e3e" strokeWidth="1.5"/>
                <polygon points="140,8 152,12 140,16" fill="#e53e3e"/>
              </svg>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {lang === 'ca'
                  ? 'Un parc rectangular fa 5 m d\'ample i 12 m de llarg. Si tallem per la diagonal, quant mesura la drecera?'
                  : 'Un parque rectangular mide 5 m de ancho y 12 m de largo. Si cortamos por la diagonal, ¿cuánto mide el atajo?'}
              </p>
              <button
                onClick={() => setExReveal(r => ({ ...r, ex3: true }))}
                className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors ${exReveal.ex3 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
              >
                {exReveal.ex3 ? (lang === 'ca' ? '✓ Resolució' : '✓ Resolución') : (lang === 'ca' ? 'Mostra la resolució' : 'Muestra la resolución')}
              </button>
              {exReveal.ex3 && (
                <div className="mt-3 bg-indigo-50 rounded-lg p-3 text-left w-full text-sm space-y-1">
                  <p className="font-mono text-indigo-800">h² = 5² + 12²</p>
                  <p className="font-mono text-indigo-800">h² = 25 + 144 = 169</p>
                  <p className="font-mono text-indigo-800">h = √169 = <strong>13 m</strong></p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

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