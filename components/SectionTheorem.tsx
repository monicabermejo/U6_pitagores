import React, { useState } from 'react';
import { SectionProps } from '../types';
import { TEXTS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { trackAnswer } from '../utils/trackAnswer';

export const SectionTheorem: React.FC<SectionProps> = ({ lang, onComplete, isLocked, studentEmail, sessionId }) => {
  const [openHistory, setOpenHistory] = useState<string | null>(null);
  const [drillScore, setDrillScore] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);

  // Drill answers: 5, 6, 13, 5, 10, 12 | 17, 24, 41, 12, 25, 15
  const [inputs, setInputs] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '', q11: '', q12: '' });

  if (isLocked) return null;

  const checkDrill = () => {
    const answers: { id: string; correct: number; type: string }[] = [
      { id: 'q1',  correct: 5,  type: 'h' }, { id: 'q2',  correct: 6,  type: 'c' },
      { id: 'q3',  correct: 13, type: 'h' }, { id: 'q4',  correct: 5,  type: 'c' },
      { id: 'q5',  correct: 10, type: 'h' }, { id: 'q6',  correct: 12, type: 'c' },
      { id: 'q7',  correct: 17, type: 'h' }, { id: 'q8',  correct: 24, type: 'c' },
      { id: 'q9',  correct: 41, type: 'h' }, { id: 'q10', correct: 12, type: 'c' },
      { id: 'q11', correct: 25, type: 'h' }, { id: 'q12', correct: 15, type: 'c' },
    ];
    let score = 0;
    answers.forEach(({ id, correct, type }) => {
      const val = parseFloat(inputs[id as keyof typeof inputs]);
      const isCorrect = val === correct;
      if (isCorrect) score++;
      trackAnswer({
        email: studentEmail,
        questionId: `theorem_drill_${id}`,
        questionText: type === 'h'
          ? (lang === 'ca' ? `Drill teorema – troba la hipotenusa (${id})` : `Drill teorema – encuentra la hipotenusa (${id})`)
          : (lang === 'ca' ? `Drill teorema – troba el catet (${id})` : `Drill teorema – encuentra el cateto (${id})`),
        userAnswer: isNaN(val) ? '' : val,
        correctAnswer: correct,
        isCorrect,
        section: 'theorem',
        lang,
        sessionId,
      });
    });
    setDrillScore(score);
    setHasChecked(true);
  };

  const problems = [
    { id: 'q1', num: 1, tex: <>c<sub>1</sub> = 3, c<sub>2</sub> = 4.</>, type: 'h', ans: 5 },
    { id: 'q2', num: 2, tex: <>h = 10, c = 8.</>, type: 'c', ans: 6 },
    { id: 'q3', num: 3, tex: <>c<sub>1</sub> = 5, c<sub>2</sub> = 12.</>, type: 'h', ans: 13 },
    { id: 'q4', num: 4, tex: <>h = 13, c = 12.</>, type: 'c', ans: 5 },
    { id: 'q5', num: 5, tex: <>c<sub>1</sub> = 6, c<sub>2</sub> = 8.</>, type: 'h', ans: 10 },
    { id: 'q6', num: 6, tex: <>h = 15, c = 9.</>, type: 'c', ans: 12 },
    { id: 'q7', num: 7, tex: <>c<sub>1</sub> = 8, c<sub>2</sub> = 15.</>, type: 'h', ans: 17 },
    { id: 'q8', num: 8, tex: <>h = 25, c = 7.</>, type: 'c', ans: 24 },
    { id: 'q9', num: 9, tex: <>c<sub>1</sub> = 9, c<sub>2</sub> = 40.</>, type: 'h', ans: 41 },
    { id: 'q10', num: 10, tex: <>h = 20, c = 16.</>, type: 'c', ans: 12 },
    { id: 'q11', num: 11, tex: <>c<sub>1</sub> = 7, c<sub>2</sub> = 24.</>, type: 'h', ans: 25 },
    { id: 'q12', num: 12, tex: <>h = 39, c = 36.</>, type: 'c', ans: 15 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Intro Header */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
        <h3 className="font-bold text-purple-900 text-xl mb-2">{TEXTS.s3_header[lang]}</h3>
        <p className="text-purple-700 leading-relaxed">{TEXTS.s3_desc[lang]}</p>
      </div>

      {/* History Accordion */}
      <div className="space-y-4">
        {[
          { 
            id: 'beans', 
            title: TEXTS.s3_history_1[lang], 
            subtitle: TEXTS.s3_h1_subtitle[lang],
            emoji: '🥗', 
            text: TEXTS.s3_h1_text[lang] 
          },
          { 
            id: 'death', 
            title: TEXTS.s3_history_2[lang], 
            subtitle: TEXTS.s3_h2_subtitle[lang],
            emoji: '🌊', 
            text: TEXTS.s3_h2_text[lang] 
          }
        ].map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <button 
              onClick={() => setOpenHistory(openHistory === item.id ? null : item.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xl font-bold text-gray-800">{item.emoji} {item.title}</span>
                {openHistory === item.id ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
              </div>
            </button>
            <AnimatePresence>
              {openHistory === item.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-gray-600 leading-relaxed bg-gray-50 border-t border-gray-100">
                    <h4 className="font-bold text-indigo-700 mb-2 mt-4">{item.subtitle}</h4>
                    <p>{item.text}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Visual Proof Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
         <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-blue-600 mb-2">{TEXTS.s3_proof_title[lang]}</h3>
            <p className="text-gray-700">{TEXTS.s3_proof_subtitle[lang]}</p>
         </div>
         
         <div className="p-8 bg-gray-50 flex flex-col md:flex-row gap-8 justify-center items-start">
             
             {/* LEFT PROOF: h^2 */}
             <div className="flex flex-col items-center gap-4 w-full md:w-1/2">
                <div className="relative border-4 border-gray-800 bg-white">
                   <svg width="200" height="200" viewBox="0 0 200 200">
                      {/* 4 Blue Triangles arranged in corners */}
                      {/* Top Left */}
                      <path d="M 0 0 L 80 0 L 0 120 Z" className="fill-blue-200 stroke-blue-900" strokeWidth="1"/>
                      {/* Top Right */}
                      <path d="M 80 0 L 200 0 L 200 80 Z" className="fill-blue-200 stroke-blue-900" strokeWidth="1"/>
                      {/* Bottom Right */}
                      <path d="M 200 80 L 200 200 L 120 200 Z" className="fill-blue-200 stroke-blue-900" strokeWidth="1"/>
                      {/* Bottom Left */}
                      <path d="M 120 200 L 0 200 L 0 120 Z" className="fill-blue-200 stroke-blue-900" strokeWidth="1"/>
                      
                      {/* Inner Red Square (Resulting hole) */}
                      <path d="M 80 0 L 200 80 L 120 200 L 0 120 Z" className="fill-red-200" />
                      <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="fill-red-800 font-bold text-2xl">h²</text>
                   </svg>
                </div>
                <p className="text-center text-sm text-gray-600 px-4">{TEXTS.s3_proof_left[lang]}</p>
             </div>

             {/* RIGHT PROOF: c1^2 + c2^2 */}
             <div className="flex flex-col items-center gap-4 w-full md:w-1/2">
                <div className="relative border-4 border-gray-800 bg-white">
                   <svg width="200" height="200" viewBox="0 0 200 200">
                      {/* Square c1 (top left) */}
                      <rect x="0" y="0" width="80" height="80" className="fill-green-200 stroke-green-900" strokeWidth="1"/>
                      <text x="40" y="40" textAnchor="middle" dominantBaseline="middle" className="fill-green-800 font-bold text-xl">c₁²</text>
                      
                      {/* Square c2 (bottom right) */}
                      <rect x="80" y="80" width="120" height="120" className="fill-yellow-200 stroke-yellow-700" strokeWidth="1"/>
                      <text x="140" y="140" textAnchor="middle" dominantBaseline="middle" className="fill-yellow-800 font-bold text-xl">c₂²</text>

                      {/* 4 Blue Triangles arranged as rectangles */}
                      {/* Top Right Rectangle (2 triangles) */}
                      <path d="M 80 0 L 200 0 L 200 80 Z" className="fill-blue-200 stroke-blue-900" strokeWidth="1"/>
                      <path d="M 80 0 L 80 80 L 200 80 Z" className="fill-blue-200 stroke-blue-900" strokeWidth="1"/>
                      
                      {/* Bottom Left Rectangle (2 triangles) */}
                      <path d="M 0 80 L 80 80 L 80 200 Z" className="fill-blue-200 stroke-blue-900" strokeWidth="1"/>
                      <path d="M 0 80 L 0 200 L 80 200 Z" className="fill-blue-200 stroke-blue-900" strokeWidth="1"/>
                   </svg>
                </div>
                <p className="text-center text-sm text-gray-600 px-4">{TEXTS.s3_proof_right[lang]}</p>
             </div>
         </div>

         <div className="bg-blue-50 p-6 text-center border-t border-blue-100">
            <h4 className="font-bold text-gray-800 mb-4">{TEXTS.s3_proof_concl_title[lang]}</h4>
            <div className="text-4xl font-black text-blue-500 font-math mb-4">h² = c₁² + c₂²</div>
            <p className="text-gray-600 italic">"{TEXTS.s3_proof_quote[lang]}"</p>
         </div>
      </div>

      {/* Calculation Guide */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
        <h4 className="text-center font-bold text-gray-800 text-lg mb-2">{TEXTS.s3_guide_title[lang]}</h4>
        <p className="text-center text-sm text-gray-500 italic mb-6">
          {lang === 'ca'
            ? 'En qualsevol triangle rectangle, el quadrat de la hipotenusa és igual a la suma dels quadrats dels dos catets.'
            : 'En cualquier triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los dos catetos.'}
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Hypotenuse Box - Green */}
          <div className="bg-white border-2 border-green-500 rounded-xl p-6 flex flex-col items-center shadow-sm relative">
             <h5 className="font-bold text-green-600 mb-6 text-lg">{TEXTS.s3_guide_hyp_title[lang]}</h5>
             <div className="flex items-center gap-1 font-serif italic text-3xl mb-6">
               <span className="text-gray-800">h = </span>
               <span className="text-4xl leading-none font-normal text-gray-800">√</span>
               <span className="border-t-2 border-gray-800 pt-1">c₁² + c₂²</span>
             </div>
             <div className="font-black text-gray-800 text-lg uppercase tracking-wide">{TEXTS.s3_guide_hyp_action[lang]}</div>
          </div>

          {/* Cathetus Box - Red */}
          <div className="bg-white border-2 border-red-500 rounded-xl p-6 flex flex-col items-center shadow-sm relative">
             <h5 className="font-bold text-red-600 mb-6 text-lg">{TEXTS.s3_guide_cat_title[lang]}</h5>
             <div className="flex items-center gap-1 font-serif italic text-3xl mb-6">
               <span className="text-gray-800">c = </span>
               <span className="text-4xl leading-none font-normal text-gray-800">√</span>
               <span className="border-t-2 border-gray-800 pt-1">h² - c²<sub className="text-sm not-italic ml-0.5">{TEXTS.s3_known[lang]}</sub></span>
             </div>
             <div className="font-black text-gray-800 text-lg uppercase tracking-wide">{TEXTS.s3_guide_cat_action[lang]}</div>
          </div>
        </div>
      </div>

      {/* NEW: Practice Calculation Grid (6 Items) */}
      <div>
        <h4 className="font-bold text-xl text-blue-500 mb-4">{TEXTS.s3_practice_title[lang]}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {problems.map((p) => {
             const val = parseFloat(inputs[p.id as keyof typeof inputs]);
             const isCorrect = val === p.ans;
             const isFilled = inputs[p.id as keyof typeof inputs] !== '';
             
             let inputStyle = "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
             if (hasChecked && isFilled) {
               inputStyle = isCorrect 
                  ? "border-green-500 bg-green-50 text-green-900 font-bold" 
                  : "border-red-300 bg-red-50 text-red-900 font-bold";
             }

             return (
               <div key={p.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
                  <div className="mb-4">
                    <span className="font-bold text-lg text-gray-800 mr-2">{p.num}.</span>
                    <span className="math-font text-xl">{p.tex}</span>
                  </div>
                  <div className="mb-4 text-gray-800">
                    {p.type === 'h' ? TEXTS.s3_find_h[lang] : TEXTS.s3_find_c[lang]}
                  </div>
                  <input 
                    type="number"
                    className={`border rounded p-2 w-32 transition-colors outline-none ${inputStyle}`}
                    value={inputs[p.id as keyof typeof inputs]}
                    onChange={(e) => {
                      setInputs({...inputs, [p.id]: e.target.value});
                      setHasChecked(false); // Reset check state on edit so user knows to re-check
                    }}
                  />
               </div>
             );
           })}
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-2">
            <button 
              onClick={checkDrill} 
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-blue-600 transition-all text-lg"
            >
              {TEXTS.s3_check_all[lang]}
            </button>
            {hasChecked && drillScore < 12 && (
              <p className="text-red-500 font-bold animate-pulse">
                {lang === 'ca' ? `Tens ${drillScore} de 12 correctes.` : `Tienes ${drillScore} de 12 correctas.`}
              </p>
            )}
            {hasChecked && drillScore === 12 && (
              <p className="text-green-500 font-bold animate-bounce">
                {lang === 'ca' ? "Perfecte! Tot correcte." : "¡Perfecto! Todo correcto."}
              </p>
            )}
        </div>
      </div>

      <div className="flex justify-center pt-8">
           <button 
             onClick={onComplete}
             className={`bg-purple-500 text-white px-8 py-4 rounded-full font-black text-xl shadow-lg hover:scale-105 hover:bg-purple-600 transition-all flex items-center gap-3 ${drillScore === 12 ? 'animate-bounce' : ''}`}
           >
             {TEXTS.next_section[lang]}
           </button>
      </div>
    </motion.div>
  );
};