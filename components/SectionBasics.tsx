import React, { useState } from 'react';
import { SectionProps } from '../types';
import { TEXTS } from '../constants';
import { Check, AlertTriangle, Calculator, Ruler, ChevronDown, ChevronUp, Table } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackAnswer } from '../utils/trackAnswer';

export const SectionBasics: React.FC<SectionProps> = ({ lang, onComplete, isLocked, studentEmail, sessionId }) => {
  // State for Classification Game
  const [q1Answer, setQ1Answer] = useState('');
  const [q1Feedback, setQ1Feedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [placements, setPlacements] = useState<{ [key: string]: string }>({});
  const [completedDrag, setCompletedDrag] = useState(false);

  // State for Area/Perimeter Drill
  const [apAnswers, setApAnswers] = useState<{[key:string]: string}>({});
  const [apFeedback, setApFeedback] = useState(false);

  // State for Roots
  const [showRoots, setShowRoots] = useState(false);
  const [calcValue, setCalcValue] = useState('');
  const [rootAnswers, setRootAnswers] = useState({ q1: '', q2: '', q3a: '', q3b: '' });
  const [rootFeedback, setRootFeedback] = useState(false);

  if (isLocked) return null;

  // --- Handlers ---
  const handleQ1Check = () => {
    const isCorrect = q1Answer === 'b';
    setQ1Feedback(isCorrect ? 'correct' : 'incorrect');
    trackAnswer({
      email: studentEmail,
      questionId: 'basics_q1_triangle_type',
      questionText: lang === 'ca'
        ? 'Quin triangle és rectàngle?'
        : '¿Qué triángulo es rectángulo?',
      userAnswer: q1Answer,
      correctAnswer: 'b',
      isCorrect,
      section: 'basics',
      lang,
      sessionId,
    });
  };

  const handlePlace = (boxId: string, correctLabel: string) => {
    if (selectedLabel) {
      if (selectedLabel === correctLabel) {
        const newPlacements = { ...placements, [boxId]: selectedLabel };
        setPlacements(newPlacements);
        setSelectedLabel(null);
        if (Object.keys(newPlacements).length === 3) setCompletedDrag(true);
      } else {
        alert(TEXTS.incorrect[lang]);
      }
    }
  };

  const checkAP = () => {
    // Tolerances for floats
    const eq = (val: string, expected: number) => Math.abs(parseFloat(val || '0') - expected) < 0.2;
    
    // Q1: Square 5. P=20, A=25
    // Q2: Triangle b=6, h=4, s=5. P=16, A=12
    // Q3: Circle DIAMETER=10 -> r=5. P=2*pi*5=31.41, A=pi*25=78.54
    // Q4: Rubik small=1.5 -> Side=4.5. P=18, A=20.25
    // Q5: Yield s=60, h=52. P=180, A=1560

    const q1ok = eq(apAnswers['q1p'], 20) && eq(apAnswers['q1a'], 25);
    const q2ok = eq(apAnswers['q2p'], 16) && eq(apAnswers['q2a'], 12);
    const q3ok = eq(apAnswers['q3p'], 31.4) && eq(apAnswers['q3a'], 78.5); 
    const q4ok = eq(apAnswers['q4p'], 18) && eq(apAnswers['q4a'], 20.25);
    const q5ok = eq(apAnswers['q5p'], 180) && eq(apAnswers['q5a'], 1560);

    if (q1ok && q2ok && q3ok && q4ok && q5ok) {
        setApFeedback(true);
        trackAnswer({
          email: studentEmail,
          questionId: 'basics_area_perimeter',
          questionText: lang === 'ca'
            ? 'Exercici àrea i perímetre (5 figures)'
            : 'Ejercicio área y perímetro (5 figuras)',
          userAnswer: 'tot correcte',
          correctAnswer: 'tot correcte',
          isCorrect: true,
          section: 'basics',
          lang,
          sessionId,
        });
    } else {
        trackAnswer({
          email: studentEmail,
          questionId: 'basics_area_perimeter',
          questionText: lang === 'ca'
            ? 'Exercici àrea i perímetre (5 figures)'
            : 'Ejercicio área y perímetro (5 figuras)',
          userAnswer: JSON.stringify(apAnswers),
          correctAnswer: 'q1p:20,q1a:25,q2p:16,q2a:12,q3p:31.4,q3a:78.5,q4p:18,q4a:20.25,q5p:180,q5a:1560',
          isCorrect: false,
          section: 'basics',
          lang,
          sessionId,
        });
        alert(lang === 'ca' ? "Alguna resposta no és correcta. Revisa els càlculs!" : "Alguna respuesta no es correcta. ¡Revisa los cálculos!");
    }
  };

  const checkRoots = () => {
    const q1Correct = parseFloat(rootAnswers.q1) === 5; // sqrt(25)
    // sqrt(10) is approx 3.16. Let's accept 3.1 or 3.2 or 3.16
    const val2 = parseFloat(rootAnswers.q2);
    const q2Correct = val2 >= 3.1 && val2 <= 3.2;
    // sqrt(30) is between 5 and 6
    const q3Correct = (parseFloat(rootAnswers.q3a) === 5 && parseFloat(rootAnswers.q3b) === 6) || (parseFloat(rootAnswers.q3a) === 6 && parseFloat(rootAnswers.q3b) === 5);

    if (q1Correct && q2Correct && q3Correct) {
        setRootFeedback(true);
        trackAnswer({
          email: studentEmail,
          questionId: 'basics_arrels',
          questionText: lang === 'ca' ? 'Exercici arrels quadrades' : 'Ejercicio raíces cuadradas',
          userAnswer: JSON.stringify(rootAnswers),
          correctAnswer: 'q1:5, q2:≈3.16, q3a:5 q3b:6',
          isCorrect: true,
          section: 'basics',
          lang,
          sessionId,
        });
    } else {
        trackAnswer({
          email: studentEmail,
          questionId: 'basics_arrels',
          questionText: lang === 'ca' ? 'Exercici arrels quadrades' : 'Ejercicio raíces cuadradas',
          userAnswer: JSON.stringify(rootAnswers),
          correctAnswer: 'q1:5, q2:≈3.16, q3a:5 q3b:6',
          isCorrect: false,
          section: 'basics',
          lang,
          sessionId,
        });
        alert(TEXTS.incorrect[lang]);
    }
  };

  const canUnlock = q1Feedback === 'correct' && completedDrag && apFeedback && rootFeedback;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Intro Header */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="font-bold text-blue-900 text-xl mb-2">{TEXTS.section_1_title[lang]}</h3>
        <p className="text-blue-700">{TEXTS.s1_intro[lang]}</p>
      </div>

      {/* 1. CLASSIFICATION THEORY */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <Ruler className="text-indigo-500" /> {TEXTS.s1_classif_title[lang]}
        </h4>

        <div className="mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
           <p className="font-bold text-indigo-900 mb-2">{TEXTS.s1_two_names_title[lang]}</p>
           <ul className="list-disc list-inside text-indigo-800 space-y-1 ml-2">
             <li><span className="font-bold">{TEXTS.s1_class_sides[lang]}:</span> {TEXTS.s1_equilateral[lang]}, {TEXTS.s1_isosceles[lang]}, {TEXTS.s1_scalene[lang]}.</li>
             <li><span className="font-bold">{TEXTS.s1_class_angles[lang]}:</span> {TEXTS.s1_acute[lang]}, {TEXTS.s1_right[lang]}, {TEXTS.s1_obtuse[lang]}.</li>
           </ul>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
           {/* By Sides */}
           <div className="space-y-4">
              <h5 className="font-bold text-center text-gray-500 text-xs uppercase tracking-widest">{TEXTS.s1_class_sides[lang]}</h5>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                 <div className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 100 100" className="w-16 h-16"><polygon points="50,10 90,90 10,90" fill="none" stroke="black" strokeWidth="2"/><circle cx="50" cy="55" r="2" fill="blue"/><circle cx="30" cy="55" r="2" fill="blue"/><circle cx="70" cy="55" r="2" fill="blue"/></svg>
                    <span>{TEXTS.s1_equilateral[lang]}</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 100 100" className="w-16 h-16"><polygon points="50,10 80,90 20,90" fill="none" stroke="black" strokeWidth="2"/><line x1="35" y1="50" x2="25" y2="50" stroke="red" strokeWidth="2"/><line x1="65" y1="50" x2="75" y2="50" stroke="red" strokeWidth="2"/></svg>
                    <span>{TEXTS.s1_isosceles[lang]}</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 100 100" className="w-16 h-16"><polygon points="20,20 90,80 10,90" fill="none" stroke="black" strokeWidth="2"/></svg>
                    <span>{TEXTS.s1_scalene[lang]}</span>
                 </div>
              </div>
           </div>
           
           {/* By Angles */}
           <div className="space-y-4">
              <h5 className="font-bold text-center text-gray-500 text-xs uppercase tracking-widest">{TEXTS.s1_class_angles[lang]}</h5>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                 <div className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 100 100" className="w-16 h-16"><polygon points="50,10 90,90 10,90" fill="none" stroke="black" strokeWidth="2"/></svg>
                    <span>{TEXTS.s1_acute[lang]}</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 100 100" className="w-16 h-16"><polygon points="20,20 20,90 90,90" fill="none" stroke="black" strokeWidth="2"/><rect x="20" y="80" width="10" height="10" stroke="black" fill="none"/></svg>
                    <span className="font-bold text-indigo-600">{TEXTS.s1_right[lang]}</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 100 100" className="w-16 h-16"><polygon points="10,90 72,90 82,18" fill="none" stroke="black" strokeWidth="2"/><path d="M 62,90 A 10,10 0 0,1 73,80" fill="none" stroke="black" strokeWidth="1.5"/></svg>
                    <span>{TEXTS.s1_obtuse[lang]}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Combination table */}
        <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest text-center">
              {lang === 'ca' ? '7 combinacions possibles (de 9 teòriques)' : '7 combinaciones posibles (de 9 teóricas)'}
            </p>
          </div>

          {/* Why only 7 */}
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 text-xs text-blue-800">
            <span className="font-bold">💡 {lang === 'ca' ? 'Per què no 9?' : '¿Por qué no 9?'} </span>
            {lang === 'ca'
              ? 'El triangle equilàter té tots els angles iguals: 180º ÷ 3 = 60º. Com que 60º < 90º, sempre és acutangle. És impossible que sigui rectangle o obtusangle.'
              : 'El triángulo equilátero tiene todos los ángulos iguales: 180° ÷ 3 = 60°. Como 60° < 90°, siempre es acutángulo. Es imposible que sea rectángulo u obtusángulo.'}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="px-3 py-2 text-left text-gray-500 font-bold w-24"></th>
                  <th className="px-2 py-2 text-indigo-700 font-bold">{TEXTS.s1_acute[lang]}<br/><span className="font-normal text-gray-400">{lang === 'ca' ? 'tots < 90°' : 'todos < 90°'}</span></th>
                  <th className="px-2 py-2 bg-indigo-600 text-white font-black">{TEXTS.s1_right[lang]}<br/><span className="font-normal text-indigo-200">{lang === 'ca' ? 'un = 90° ★' : 'uno = 90° ★'}</span></th>
                  <th className="px-2 py-2 text-indigo-700 font-bold">{TEXTS.s1_obtuse[lang]}<br/><span className="font-normal text-gray-400">{lang === 'ca' ? 'un > 90°' : 'uno > 90°'}</span></th>
                </tr>
              </thead>
              <tbody>
                {/* Equilateral row */}
                <tr className="border-t border-gray-100">
                  <td className="px-3 py-3 font-bold text-left text-indigo-700 whitespace-nowrap">
                    {TEXTS.s1_equilateral[lang]}
                    <div className="font-normal text-gray-400 mt-0.5">{lang === 'ca' ? '3 costats =':'3 lados ='}</div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <svg viewBox="0 0 60 60" className="w-10 h-10">
                        <polygon points="30,6 54,54 6,54" fill="rgba(99,102,241,0.1)" stroke="#4f46e5" strokeWidth="2"/>
                        <circle cx="30" cy="34" r="1.5" fill="#4f46e5"/>
                        <circle cx="18" cy="34" r="1.5" fill="#4f46e5"/>
                        <circle cx="42" cy="34" r="1.5" fill="#4f46e5"/>
                      </svg>
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-400">60°, 60°, 60°</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 bg-gray-100">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-300 text-2xl font-bold">—</span>
                      <span className="text-gray-400 leading-tight text-center">{lang === 'ca' ? 'impossible' : 'imposible'}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 bg-gray-100">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-300 text-2xl font-bold">—</span>
                      <span className="text-gray-400 leading-tight text-center">{lang === 'ca' ? 'impossible' : 'imposible'}</span>
                    </div>
                  </td>
                </tr>
                {/* Isosceles row */}
                <tr className="border-t border-gray-100">
                  <td className="px-3 py-3 font-bold text-left text-indigo-700 whitespace-nowrap">
                    {TEXTS.s1_isosceles[lang]}
                    <div className="font-normal text-gray-400 mt-0.5">{lang === 'ca' ? '2 costats =':'2 lados ='}</div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <svg viewBox="0 0 60 60" className="w-10 h-10">
                        <polygon points="30,8 50,54 10,54" fill="rgba(99,102,241,0.1)" stroke="#4f46e5" strokeWidth="2"/>
                        <line x1="21" y1="31" x2="15" y2="31" stroke="red" strokeWidth="1.5"/>
                        <line x1="39" y1="31" x2="45" y2="31" stroke="red" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-400">70°, 70°, 40°</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 bg-indigo-50 border-x border-indigo-200">
                    <div className="flex flex-col items-center gap-1">
                      <svg viewBox="0 0 60 60" className="w-10 h-10">
                        <polygon points="10,10 10,54 54,54" fill="rgba(99,102,241,0.15)" stroke="#4f46e5" strokeWidth="2"/>
                        <rect x="10" y="44" width="10" height="10" fill="none" stroke="#4f46e5" strokeWidth="1.5"/>
                        <line x1="7" y1="32" x2="13" y2="32" stroke="red" strokeWidth="1.5"/>
                        <line x1="32" y1="57" x2="32" y2="51" stroke="red" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-400">90°, 45°, 45°</span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <svg viewBox="0 0 60 60" className="w-10 h-10">
                        <polygon points="6,54 43,54 50,12" fill="rgba(99,102,241,0.1)" stroke="#4f46e5" strokeWidth="2"/>
                        <line x1="26" y1="33" x2="17" y2="33" stroke="red" strokeWidth="1.5"/>
                        <line x1="48" y1="33" x2="57" y2="33" stroke="red" strokeWidth="1.5"/>
                        <path d="M 35,54 A 8,8 0 0,1 37,47" fill="none" stroke="#374151" strokeWidth="1.3"/>
                      </svg>
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-400">120°, 30°, 30°</span>
                    </div>
                  </td>
                </tr>
                {/* Scalene row */}
                <tr className="border-t border-gray-100">
                  <td className="px-3 py-3 font-bold text-left text-indigo-700 whitespace-nowrap">
                    {TEXTS.s1_scalene[lang]}
                    <div className="font-normal text-gray-400 mt-0.5">{lang === 'ca' ? 'cap costat =':'ningún lado ='}</div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <svg viewBox="0 0 60 60" className="w-10 h-10">
                        <polygon points="20,8 54,54 6,54" fill="rgba(99,102,241,0.1)" stroke="#4f46e5" strokeWidth="2"/>
                      </svg>
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-400">80°, 60°, 40°</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 bg-indigo-50 border-x border-indigo-200">
                    <div className="flex flex-col items-center gap-1">
                      <svg viewBox="0 0 60 60" className="w-10 h-10">
                        <polygon points="10,10 10,54 52,54" fill="rgba(99,102,241,0.15)" stroke="#4f46e5" strokeWidth="2"/>
                        <rect x="10" y="44" width="10" height="10" fill="none" stroke="#4f46e5" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-400">90°, 60°, 30°</span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <svg viewBox="0 0 60 60" className="w-10 h-10">
                        <polygon points="6,54 46,54 54,14" fill="rgba(99,102,241,0.1)" stroke="#4f46e5" strokeWidth="2"/>
                        <path d="M 33,54 A 8,8 0 0,1 36,47" fill="none" stroke="#374151" strokeWidth="1.3"/>
                      </svg>
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-400">120°, 40°, 20°</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. WARNING */}
      <div className="bg-yellow-100 border-l-8 border-yellow-500 p-6 rounded-r-lg shadow-md flex items-start gap-4">
         <span className="text-4xl flex-shrink-0">⭐</span>
         <div>
            <h4 className="font-black text-yellow-800 text-lg uppercase">{TEXTS.s1_warning_title[lang]}</h4>
            <p className="text-yellow-900 font-medium">{TEXTS.s1_warning_text[lang]}</p>
         </div>
      </div>

      {/* MOVED: PRACTICE GAME */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-inner border border-indigo-100">
        <h4 className="font-bold text-indigo-900 mb-6 text-center text-xl">{TEXTS.s1_game_title[lang]}</h4>
        
        {/* Question 1 */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h5 className="font-bold text-gray-800 mb-4">{TEXTS.s1_q1[lang]}</h5>
          <div className="space-y-2">
            {['a', 'b', 'c'].map((opt) => (
              <label key={opt} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                q1Answer === opt ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:bg-gray-50'
              }`}>
                <input 
                  type="radio" name="q1" value={opt} 
                  onChange={(e) => { setQ1Answer(e.target.value); setQ1Feedback(null); }}
                  className="w-5 h-5 text-indigo-600"
                />
                <span className="ml-3 font-medium text-gray-700">
                  {opt === 'a' && TEXTS.s1_opt_a[lang]}
                  {opt === 'b' && TEXTS.s1_opt_b[lang]}
                  {opt === 'c' && TEXTS.s1_opt_c[lang]}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 text-right">
             <button onClick={handleQ1Check} className="text-sm font-bold text-indigo-600 hover:underline">{TEXTS.check[lang]}</button>
             {q1Feedback === 'correct' && <span className="ml-2 text-green-600 font-bold">OK!</span>}
             {q1Feedback === 'incorrect' && <span className="ml-2 text-red-500 font-bold">X</span>}
          </div>
        </div>

        {/* Drag & Drop */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {['Equilàter', 'Isòsceles', 'Escalè'].map(lbl => {
              if (Object.values(placements).includes(lbl)) return null;
              return (
                <button
                  key={lbl} onClick={() => setSelectedLabel(lbl)}
                  className={`px-3 py-1 rounded-full font-bold text-sm transition-all ${selectedLabel === lbl ? 'bg-yellow-400 text-yellow-900 scale-110' : 'bg-gray-100 text-gray-600'}`}
                >
                  {lbl}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Isosceles */}
             <div className="flex flex-col items-center gap-2">
                <svg width="60" height="60" viewBox="0 0 100 100"><path d="M 50 10 L 80 90 L 20 90 Z" fill="none" stroke="#4b5563" strokeWidth="3"/><line x1="35" y1="50" x2="25" y2="55" stroke="red" strokeWidth="2"/><line x1="65" y1="50" x2="75" y2="55" stroke="red" strokeWidth="2"/></svg>
                <div onClick={() => handlePlace('box1', 'Isòsceles')} className={`w-full h-10 rounded border-2 border-dashed flex items-center justify-center font-bold cursor-pointer text-sm ${placements['box1'] ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50'}`}>
                  {placements['box1'] || '?'}
                </div>
             </div>
             {/* Scalene */}
             <div className="flex flex-col items-center gap-2">
                <svg width="60" height="60" viewBox="0 0 100 100"><path d="M 20 20 L 90 80 L 10 90 Z" fill="none" stroke="#4b5563" strokeWidth="3"/></svg>
                <div onClick={() => handlePlace('box2', 'Escalè')} className={`w-full h-10 rounded border-2 border-dashed flex items-center justify-center font-bold cursor-pointer text-sm ${placements['box2'] ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50'}`}>
                  {placements['box2'] || '?'}
                </div>
             </div>
             {/* Equilateral */}
             <div className="flex flex-col items-center gap-2">
                <svg width="60" height="60" viewBox="0 0 100 100"><path d="M 50 10 L 90 80 L 10 80 Z" fill="none" stroke="#4b5563" strokeWidth="3"/><line x1="30" y1="45" x2="20" y2="45" stroke="blue" strokeWidth="2"/><line x1="70" y1="45" x2="80" y2="45" stroke="blue" strokeWidth="2"/><line x1="50" y1="85" x2="50" y2="75" stroke="blue" strokeWidth="2"/></svg>
                <div onClick={() => handlePlace('box3', 'Equilàter')} className={`w-full h-10 rounded border-2 border-dashed flex items-center justify-center font-bold cursor-pointer text-sm ${placements['box3'] ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50'}`}>
                  {placements['box3'] || '?'}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 3. AREA & PERIMETER THEORY */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-6">
           <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-4">
             🌿 {TEXTS.s1_ap_title[lang]}
           </h4>
           
           <div className="grid md:grid-cols-2 gap-6">
              {/* Perimeter Card */}
              <div className="bg-green-50 p-5 rounded-xl border-2 border-green-200 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity text-4xl">📏</div>
                 <h5 className="font-bold text-green-800 text-lg mb-2">{TEXTS.s1_p_title[lang]}</h5>
                 <p className="text-green-700 text-sm mb-3 leading-relaxed">{TEXTS.s1_p_desc[lang]}</p>
                 <div className="bg-white/60 p-2 rounded text-xs font-mono text-green-900">
                    <div>{TEXTS.s1_p_form[lang]}</div>
                    <div className="mt-1 font-bold">{TEXTS.s1_p_units[lang]}</div>
                 </div>
              </div>

              {/* Area Card */}
              <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity text-4xl">⬛</div>
                 <h5 className="font-bold text-blue-800 text-lg mb-2">{TEXTS.s1_a_title[lang]}</h5>
                 <p className="text-blue-700 text-sm mb-3 leading-relaxed">{TEXTS.s1_a_desc[lang]}</p>
                 <div className="bg-white/60 p-2 rounded text-xs font-mono text-blue-900">
                    <div>{TEXTS.s1_a_calc[lang]}</div>
                    <div className="mt-1 font-bold">{TEXTS.s1_a_units[lang]}</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Formulas Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {/* Square */}
           <div className="border rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-shadow">
              <h5 className="font-bold text-gray-700 mb-2">{TEXTS.s1_sq_title[lang]}</h5>
              <svg width="80" height="80" viewBox="0 0 100 100" className="mb-3">
                 <rect x="20" y="20" width="60" height="60" fill="none" stroke="black" strokeWidth="2" />
                 <text x="50" y="95" textAnchor="middle" fontSize="12">l</text>
              </svg>
              <div className="text-sm bg-gray-50 w-full p-2 rounded text-center">
                 <div className="font-mono">P = 4 · l</div>
                 <div className="font-mono">A = l²</div>
              </div>
           </div>

           {/* Triangle */}
           <div className="border rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-shadow">
              <h5 className="font-bold text-gray-700 mb-2">{TEXTS.s1_tri_title[lang]}</h5>
              <svg width="80" height="80" viewBox="0 0 100 100" className="mb-3">
                 <polygon points="10,80 90,80 50,20" fill="none" stroke="black" strokeWidth="2" />
                 <line x1="50" y1="20" x2="50" y2="80" stroke="red" strokeDasharray="4" />
                 <text x="50" y="95" textAnchor="middle" fontSize="12">b</text>
                 <text x="55" y="50" fill="red" fontSize="12">h</text>
              </svg>
              <div className="text-sm bg-gray-50 w-full p-2 rounded text-center">
                 <div className="font-mono">P = a + b + c</div>
                 <div className="font-mono">A = (b · h) / 2</div>
              </div>
           </div>

           {/* Circle */}
           <div className="border rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-shadow">
              <h5 className="font-bold text-gray-700 mb-2">{TEXTS.s1_cir_title[lang]}</h5>
              <svg width="80" height="80" viewBox="0 0 100 100" className="mb-3">
                 <circle cx="50" cy="50" r="30" fill="none" stroke="black" strokeWidth="2" />
                 <line x1="50" y1="50" x2="80" y2="50" stroke="blue" />
                 <text x="65" y="45" fill="blue" fontSize="12">r</text>
              </svg>
              <div className="text-sm bg-gray-50 w-full p-2 rounded text-center">
                 <div className="font-mono">L = 2 · π · r</div>
                 <div className="font-mono">A = π · r²</div>
                 <div className="font-bold text-xs mt-1 text-indigo-600">π ≈ 3.1416</div>
              </div>
           </div>
        </div>

        {/* Drill Section */}
        <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-gray-800">{TEXTS.s1_drill_ap_title[lang]}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${apFeedback ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                 {apFeedback ? TEXTS.completed[lang] : '0/5'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
               {/* Q1: Square */}
               <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center gap-2 border border-gray-200 text-center">
                  <svg width="60" height="60" viewBox="0 -12 100 112">
                    <rect x="20" y="20" width="60" height="60" fill="white" stroke="#4b5563" strokeWidth="3"/>
                    <text x="50" y="12" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">5</text>
                  </svg>
                  <label className="text-xs font-bold text-gray-500 uppercase">Quadrat</label>
                  <p className="text-[10px] text-gray-600 mb-1">{TEXTS.s1_drill_stm[lang]}</p>
                  <input placeholder="P" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q1p: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
                  <input placeholder="A" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q1a: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
               </div>

               {/* Q2: Triangle */}
               <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center gap-2 border border-gray-200 text-center">
                  <svg width="60" height="60" viewBox="0 0 100 110">
                    <polygon points="10,90 90,90 50,20" fill="white" stroke="#4b5563" strokeWidth="3"/>
                    <line x1="50" y1="20" x2="50" y2="90" stroke="red" strokeDasharray="3"/>
                    <text x="50" y="106" textAnchor="middle" fontSize="10">6</text>
                    <text x="55" y="60" fill="red" fontSize="10">4</text>
                    <text x="80" y="50" fontSize="10">5</text>
                  </svg>
                  <label className="text-xs font-bold text-gray-500 uppercase">Triangle</label>
                  <p className="text-[10px] text-gray-600 mb-1">{TEXTS.s1_drill_stm[lang]}</p>
                  <input placeholder="P" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q2p: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
                  <input placeholder="A" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q2a: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
               </div>

               {/* Q3: Circle */}
               <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center gap-2 border border-gray-200 text-center">
                  <svg width="60" height="60" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" fill="white" stroke="#4b5563" strokeWidth="3"/>
                     {/* Diameter Line */}
                     <line x1="10" y1="50" x2="90" y2="50" stroke="blue" strokeWidth="2"/>
                     <text x="50" y="45" fontSize="12" fill="blue" textAnchor="middle">10</text>
                  </svg>
                  <label className="text-xs font-bold text-gray-500 uppercase">Cercle (Diàmetre)</label>
                  <p className="text-[10px] text-gray-600 mb-1">{TEXTS.s1_drill_stm[lang]}</p>
                  <input placeholder="P" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q3p: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
                  <input placeholder="A" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q3a: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
               </div>

               {/* Q4: Rubik */}
               <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center gap-2 border border-gray-200 text-center">
                  <svg width="60" height="60" viewBox="0 0 90 90">
                     {[['#e53e3e','#3182ce','#ed8936'],['#f7fafc','#ecc94b','#48bb78'],['#3182ce','#e53e3e','#f7fafc']]
                       .map((row, ri) => row.map((color, ci) => (
                         <rect key={`${ri}-${ci}`} x={ci*30} y={ri*30} width="30" height="30" fill={color} stroke="black" strokeWidth="2"/>
                       )))}
                  </svg>
                  <p className="text-[10px] font-semibold text-gray-700 text-center leading-tight">
                    {lang === 'ca' ? 'Calcula P i A d\'una cara d\'aquest cub de Rubik' : 'Calcula P y A de una cara de este cubo de Rubik'}
                  </p>
                  <p className="text-[10px] text-gray-600 mb-1">1.5 = costat quadrat petit</p>
                  <input placeholder="P" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q4p: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
                  <input placeholder="A" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q4a: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
               </div>

               {/* Q5: Yield */}
               <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center gap-2 border border-gray-200 text-center">
                  <svg width="60" height="60" viewBox="0 -14 100 114">
                     <polygon points="10,10 90,10 50,90" fill="white" stroke="red" strokeWidth="5"/>
                     <text x="50" y="3" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#374151">60 cm</text>
                     <line x1="50" y1="10" x2="50" y2="90" stroke="red" strokeDasharray="3"/>
                     <text x="55" y="60" fontSize="10" fill="red" fontWeight="bold">52</text>
                  </svg>
                  <label className="text-xs font-bold text-gray-500 uppercase text-center">Cediu el Pas</label>
                  <p className="text-[10px] text-gray-600 mb-1">{TEXTS.s1_drill_stm[lang]}</p>
                  <input placeholder="P" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q5p: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
                  <input placeholder="A" type="number" disabled={apFeedback} onChange={(e) => setApAnswers({...apAnswers, q5a: e.target.value})} className={`w-full border rounded p-1 text-center font-bold text-sm ${apFeedback ? 'bg-green-100 text-green-800' : ''}`}/>
               </div>
            </div>

            {!apFeedback && (
              <button onClick={checkAP} className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-bold hover:bg-black transition-colors">{TEXTS.check[lang]}</button>
            )}
        </div>
      </div>

      {/* 4. SQUARE ROOTS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
            <Calculator className="text-indigo-500" /> {TEXTS.s1_roots_title[lang]}
         </h4>
         <p className="text-gray-600 mb-4">{TEXTS.s1_roots_desc[lang]}</p>

         <button 
           onClick={() => setShowRoots(!showRoots)}
           className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-4"
         >
           <Table size={16}/> {showRoots ? TEXTS.s1_hide_roots[lang] : TEXTS.s1_show_roots[lang]}
           {showRoots ? <ChevronUp size={16} /> : <ChevronDown size={16}/>}
         </button>

         <AnimatePresence>
            {showRoots && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="grid grid-cols-5 gap-2 bg-indigo-50 p-4 rounded-xl">
                   {Array.from({length: 15}, (_, i) => i + 1).map(n => (
                     <div key={n} className="text-center">
                        <div className="text-xs text-indigo-400">{n}²</div>
                        <div className="font-bold text-indigo-900">{n*n}</div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
         </AnimatePresence>
         
         {/* Calculator Feature */}
         <div className="bg-gray-800 p-4 rounded-xl text-white mb-6 max-w-sm mx-auto shadow-lg">
             <h5 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{TEXTS.s1_calc_title[lang]}</h5>
             <div className="flex gap-2">
                <div className="flex-1 relative">
                   <span className="absolute left-3 top-2 text-gray-400">√</span>
                   <input 
                     type="number" 
                     value={calcValue}
                     onChange={(e) => setCalcValue(e.target.value)}
                     className="w-full bg-gray-700 rounded-lg pl-8 pr-4 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     placeholder="144"
                   />
                </div>
                <div className="bg-black/30 rounded-lg px-4 py-2 font-mono text-xl min-w-[80px] text-center text-green-400 flex items-center justify-center">
                   {calcValue ? Math.sqrt(parseFloat(calcValue)).toFixed(2).replace(/\.00$/, '') : '-'}
                </div>
             </div>
         </div>

         <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-xl">
             <div className="flex gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">√25</label>
                  <input type="number" onChange={(e) => setRootAnswers({...rootAnswers, q1: e.target.value})} className="w-20 p-2 rounded border border-gray-300 text-center"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">√10 (1 dec)</label>
                  <input type="number" onChange={(e) => setRootAnswers({...rootAnswers, q2: e.target.value})} className="w-20 p-2 rounded border border-gray-300 text-center"/>
                </div>
             </div>
             
             <div className="bg-white p-2 rounded border border-gray-200">
                <label className="block text-xs font-bold text-gray-500 mb-1 text-center">{TEXTS.s1_root_range[lang]}</label>
                <div className="flex items-center gap-2">
                   <span className="text-gray-400 font-bold">√30 està entre</span>
                   <input type="number" onChange={(e) => setRootAnswers({...rootAnswers, q3a: e.target.value})} className="w-12 p-1 rounded border border-gray-300 text-center"/>
                   <span className="text-gray-400">i</span>
                   <input type="number" onChange={(e) => setRootAnswers({...rootAnswers, q3b: e.target.value})} className="w-12 p-1 rounded border border-gray-300 text-center"/>
                </div>
             </div>

             <button 
                onClick={checkRoots}
                disabled={rootFeedback}
                className={`px-6 py-2 h-full rounded-lg font-bold text-white transition-colors ${rootFeedback ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
             >
                {rootFeedback ? <Check /> : '?'}
             </button>
         </div>
      </div>

      <div className="flex justify-center pt-8">
           <button 
             onClick={onComplete}
             className={`bg-green-500 text-white px-8 py-4 rounded-full font-black text-xl shadow-lg hover:scale-105 hover:bg-green-600 transition-all flex items-center gap-3 ${canUnlock ? 'animate-bounce' : ''}`}
           >
             {TEXTS.next_section[lang]}
           </button>
      </div>
    </motion.div>
  );
};