import React, { useState } from 'react';
import { SectionProps } from '../types';
import { TEXTS } from '../constants';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const SectionVisual: React.FC<SectionProps> = ({ lang, onComplete, isLocked }) => {
  const [feedback, setFeedback] = useState<string>('');
  // Track which specific exercises (by index) are completed
  const [completed, setCompleted] = useState<number[]>([]);
  const totalRequired = 4; // Reduced to 4

  if (isLocked) return null;

  const handleCorrect = (index: number) => {
    if (!completed.includes(index)) {
      setFeedback(TEXTS.correct[lang]);
      setCompleted(prev => [...prev, index]);
    }
  };

  const handleWrong = () => {
    setFeedback(lang === 'ca' ? "No, això és un catet!" : "¡No, eso es un cateto!");
  };

  const isCompleted = (index: number) => completed.includes(index);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* TIP BOX */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💡</span>
          <h3 className="font-black text-amber-800 text-lg">
            {lang === 'ca' ? 'Com trobar la hipotenusa? El truc!' : '¿Cómo encontrar la hipotenusa? ¡El truco!'}
          </h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <div className="text-3xl mb-2">📐</div>
            <p className="font-bold text-amber-900 text-sm">
              {lang === 'ca' ? 'Busca l\'angle recte' : 'Busca el ángulo recto'}
            </p>
            <p className="text-amber-700 text-xs mt-1">
              {lang === 'ca' ? '(el quadradet de la cantonada)' : '(el cuadradito de la esquina)'}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <div className="text-3xl mb-2">👉</div>
            <p className="font-bold text-amber-900 text-sm">
              {lang === 'ca' ? 'El costat del davant' : 'El lado de enfrente'}
            </p>
            <p className="text-amber-700 text-xs mt-1">
              {lang === 'ca' ? 'La hipotenusa és el costat oposat a l\'angle recte' : 'La hipotenusa es el lado opuesto al ángulo recto'}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <div className="text-3xl mb-2">🏆</div>
            <p className="font-bold text-amber-900 text-sm">
              {lang === 'ca' ? 'Sempre és la més llarga' : 'Siempre es la más larga'}
            </p>
            <p className="text-amber-700 text-xs mt-1">
              {lang === 'ca' ? 'Mai toca l\'angle recte directament' : 'Nunca toca el ángulo recto directamente'}
            </p>
          </div>
        </div>
        <p className="mt-4 text-center text-amber-800 text-sm font-semibold italic">
          {lang === 'ca'
            ? '🎯 Regla d\'or: si el costat toca el quadradet → és un catet. Si NO el toca → és la hipotenusa!'
            : '🎯 Regla de oro: si el lado toca el cuadradito → es un cateto. Si NO lo toca → ¡es la hipotenusa!'}
        </p>
      </div>

      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-indigo-800 text-lg mb-2">{TEXTS.section_2_title[lang]}</h3>
        <p className="text-indigo-700">{TEXTS.s2_instr[lang]}</p>
        <div className="mt-2 text-sm font-bold text-indigo-900">
           Progrés: {completed.length} / {totalRequired}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {/* Helper wrapper for styles */}
        {([0, 1, 2, 3] as const).map((idx) => {
           const done = isCompleted(idx);
           return (
             <div key={idx} className={`relative rounded-lg transition-all ${done ? 'ring-4 ring-green-400 scale-105 bg-green-50' : ''}`}>
                {done && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1 z-10 shadow-sm">
                    <CheckCircle size={20} />
                  </div>
                )}
                
                {/* Render specific SVG based on index */}
                {idx === 0 && (
                  /* Triangle 1: Standard */
                  <svg width="150" height="150" viewBox="0 0 100 100" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <path d="M 10 10 L 10 90 L 90 90 Z" fill="none" stroke="transparent"/>
                    <line x1="10" y1="10" x2="10" y2="90" stroke="black" strokeWidth="3"/>
                    <line x1="10" y1="10" x2="10" y2="90" stroke="transparent" strokeWidth="20" onClick={handleWrong} className="cursor-pointer hover:stroke-red-500/20"/>
                    <line x1="10" y1="90" x2="90" y2="90" stroke="black" strokeWidth="3"/>
                    <line x1="10" y1="90" x2="90" y2="90" stroke="transparent" strokeWidth="20" onClick={handleWrong} className="cursor-pointer hover:stroke-red-500/20"/>
                    <line x1="10" y1="10" x2="90" y2="90" stroke="black" strokeWidth="3"/>
                    <line x1="10" y1="10" x2="90" y2="90" stroke="transparent" strokeWidth="20" onClick={() => handleCorrect(0)} className="cursor-pointer hover:stroke-green-500/20"/>
                    <rect x="10" y="75" width="15" height="15" fill="none" stroke="black"/>
                  </svg>
                )}

                {idx === 1 && (
                  /* Triangle 2: Rotated */
                  <svg width="150" height="150" viewBox="0 0 100 100" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <g transform="rotate(45, 50, 50)">
                        <line x1="20" y1="20" x2="20" y2="80" stroke="black" strokeWidth="3"/>
                        <line x1="20" y1="20" x2="20" y2="80" stroke="transparent" strokeWidth="20" onClick={handleWrong} className="cursor-pointer hover:stroke-red-500/20"/>
                        <line x1="20" y1="80" x2="80" y2="80" stroke="black" strokeWidth="3"/>
                        <line x1="20" y1="80" x2="80" y2="80" stroke="transparent" strokeWidth="20" onClick={handleWrong} className="cursor-pointer hover:stroke-red-500/20"/>
                        <line x1="20" y1="20" x2="80" y2="80" stroke="black" strokeWidth="3"/>
                        <line x1="20" y1="20" x2="80" y2="80" stroke="transparent" strokeWidth="20" onClick={() => handleCorrect(1)} className="cursor-pointer hover:stroke-green-500/20"/>
                        <rect x="20" y="65" width="15" height="15" fill="none" stroke="black"/>
                    </g>
                  </svg>
                )}

                {idx === 2 && (
                   /* Triangle 3: Weird Angle */
                   <svg width="150" height="150" viewBox="0 0 100 100" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                     <g transform="rotate(200, 50, 50) translate(20, 20)">
                        <line x1="0" y1="0" x2="50" y2="0" stroke="black" strokeWidth="3"/>
                        <line x1="0" y1="0" x2="50" y2="0" stroke="transparent" strokeWidth="20" onClick={handleWrong} className="cursor-pointer hover:stroke-red-500/20"/>
                        <line x1="0" y1="0" x2="0" y2="70" stroke="black" strokeWidth="3"/>
                        <line x1="0" y1="0" x2="0" y2="70" stroke="transparent" strokeWidth="20" onClick={handleWrong} className="cursor-pointer hover:stroke-red-500/20"/>
                        <line x1="50" y1="0" x2="0" y2="70" stroke="black" strokeWidth="3"/>
                        <line x1="50" y1="0" x2="0" y2="70" stroke="transparent" strokeWidth="20" onClick={() => handleCorrect(2)} className="cursor-pointer hover:stroke-green-500/20"/>
                        <rect x="0" y="0" width="10" height="10" fill="none" stroke="black"/>
                    </g>
                   </svg>
                )}

                {idx === 3 && (
                   /* Exercise 4: Rectangle with Diagonal (Uniform thickness) */
                   <svg width="150" height="150" viewBox="0 0 100 100" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                     {/* Legs (Rectangle Border) */}
                     <rect x="10" y="30" width="80" height="40" fill="none" stroke="black" strokeWidth="3" />
                     {/* Click area Legs */}
                     <rect x="10" y="30" width="80" height="40" fill="none" stroke="transparent" strokeWidth="20" onClick={handleWrong} className="cursor-pointer hover:stroke-red-500/20" />

                     {/* Hypotenuse (Diagonal) - SAME THICKNESS */}
                     <line x1="10" y1="70" x2="90" y2="30" stroke="black" strokeWidth="3" />
                     {/* Click area Diagonal */}
                     <line x1="10" y1="70" x2="90" y2="30" stroke="transparent" strokeWidth="20" onClick={() => handleCorrect(3)} className="cursor-pointer hover:stroke-green-500/20" />
                     
                     {/* Right Angle marker */}
                     <rect x="10" y="30" width="8" height="8" fill="none" stroke="black" strokeWidth="1"/>
                     <rect x="82" y="62" width="8" height="8" fill="none" stroke="black" strokeWidth="1"/>
                   </svg>
                )}
             </div>
           );
        })}
      </div>

      <div className="h-8 text-center font-bold text-xl min-h-[2rem]" style={{ color: feedback.includes('No') ? '#ef4444' : '#22c55e' }}>
          {feedback}
      </div>

      <div className="flex justify-center pt-8">
           <button 
             onClick={onComplete}
             className={`bg-indigo-500 text-white px-8 py-4 rounded-full font-black text-xl shadow-lg hover:scale-105 hover:bg-indigo-600 transition-all flex items-center gap-3 ${completed.length >= totalRequired ? 'animate-bounce' : ''}`}
           >
             {TEXTS.next_section[lang]}
           </button>
      </div>
    </motion.div>
  );
};