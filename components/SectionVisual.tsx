import React, { useState } from 'react';
import { SectionProps } from '../types';
import { TEXTS } from '../constants';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { trackAnswer } from '../utils/trackAnswer';

export const SectionVisual: React.FC<SectionProps> = ({ lang, onComplete, isLocked, studentEmail, sessionId }) => {
  const [feedback, setFeedback] = useState<string>('');
  // Track which specific exercises (by index) are completed
  const [completed, setCompleted] = useState<number[]>([]);
  const totalRequired = 4; // Reduced to 4

  if (isLocked) return null;

  const handleCorrect = (index: number) => {
    if (!completed.includes(index)) {
      setFeedback(TEXTS.correct[lang]);
      setCompleted(prev => [...prev, index]);
      trackAnswer({
        email: studentEmail,
        questionId: `visual_hypotenuse_t${index + 1}`,
        questionText: lang === 'ca'
          ? `Identifica la hipotenusa – triangle ${index + 1}`
          : `Identifica la hipotenusa – triángulo ${index + 1}`,
        userAnswer: 'hipotenusa',
        correctAnswer: 'hipotenusa',
        isCorrect: true,
        section: 'visual',
        lang,
        sessionId,
      });
    }
  };

  const handleWrong = (index: number) => {
    setFeedback(lang === 'ca' ? "No, això és un catet!" : "¡No, eso es un cateto!");
    trackAnswer({
      email: studentEmail,
      questionId: `visual_hypotenuse_t${index + 1}`,
      questionText: lang === 'ca'
        ? `Identifica la hipotenusa – triangle ${index + 1}`
        : `Identifica la hipotenusa – triángulo ${index + 1}`,
      userAnswer: 'catet',
      correctAnswer: 'hipotenusa',
      isCorrect: false,
      section: 'visual',
      lang,
      sessionId,
    });
  };

  const isCompleted = (index: number) => completed.includes(index);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* ANATOMY BOX */}
      <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-2xl">🔍</span>
          <h3 className="font-black text-teal-800 text-lg">
            {lang === 'ca' ? 'Anatomia del triangle rectangle' : 'Anatomía del triángulo rectángulo'}
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* SVG diagram — vèrtexs: A(30,20) dalt, B(30,130) angle recte, C(215,130) dreta */}
          <div className="flex-shrink-0">
            <svg viewBox="0 0 260 160" className="w-72 h-44 mx-auto">
              {/* Triangle fill */}
              <polygon points="30,130 30,20 215,130" fill="rgba(20,184,166,0.08)" stroke="none"/>

              {/* Catet 1 — vertical — blue */}
              <line x1="30" y1="20" x2="30" y2="130" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/>
              {/* Catet 2 — horitzontal — blue */}
              <line x1="30" y1="130" x2="215" y2="130" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/>
              {/* Hipotenusa h — red */}
              <line x1="30" y1="20" x2="215" y2="130" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round"/>

              {/* Right angle marker at B(30,130) */}
              <polyline points="30,118 42,118 42,130" fill="none" stroke="#374151" strokeWidth="2"/>
              <text x="44" y="126" fontSize="9" fill="#374151" fontWeight="bold">90°</text>

              {/* Label c₁ (vertical leg) */}
              <text textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="12" transform="translate(14,75) rotate(-90)">c₁</text>

              {/* Label c₂ (horizontal leg) */}
              <text x="122" y="148" fontSize="12" fill="#2563eb" fontWeight="bold" textAnchor="middle">c₂</text>

              {/* Label h (hypotenuse) */}
              <text textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="12" transform="translate(118,63) rotate(31)">h</text>

              {/* Angle α at A(30,20) — arc centered at A, sweep=0 (CCW screen), from AB to AC */}
              {/* on AB at d=16: (30,36) · on AC at d=16: (44,28) */}
              <path d="M 30,36 A 16,16 0 0,0 44,28" fill="none" stroke="#059669" strokeWidth="1.8"/>
              <text x="45" y="46" fontSize="12" fill="#059669" fontWeight="bold">α</text>

              {/* Angle β at C(215,130) — arc centered at C, sweep=0 (CCW screen = going UP from CB to CA), from CB to CA */}
              {/* on CB at d=20: (195,130) · on CA at d=20: C + 20*(-0.857,-0.510) = (198,120) */}
              <path d="M 195,130 A 20,20 0 0,0 198,120" fill="none" stroke="#059669" strokeWidth="1.8"/>
              <text x="173" y="126" fontSize="12" fill="#059669" fontWeight="bold">β</text>
            </svg>
          </div>

          {/* Legend */}
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-0.5"></span>
              <div>
                <span className="font-bold text-red-700">{lang === 'ca' ? 'Hipotenusa (h)' : 'Hipotenusa (h)'}</span>
                <p className="text-gray-600 text-xs mt-0.5">{lang === 'ca' ? 'El costat més llarg. Sempre oposat a l\'angle recte.' : 'El lado más largo. Siempre opuesto al ángulo recto.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-0.5"></span>
              <div>
                <span className="font-bold text-blue-700">{lang === 'ca' ? 'Catets (c₁ i c₂)' : 'Catetos (c₁ y c₂)'}</span>
                <p className="text-gray-600 text-xs mt-0.5">{lang === 'ca' ? 'Els dos costats que formen l\'angle recte.' : 'Los dos lados que forman el ángulo recto.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full bg-gray-700 flex-shrink-0 mt-0.5"></span>
              <div>
                <span className="font-bold text-gray-700">{lang === 'ca' ? 'Angle recte (90°)' : 'Ángulo recto (90°)'}</span>
                <p className="text-gray-600 text-xs mt-0.5">{lang === 'ca' ? 'Marcat pel quadradet. On es troben els dos catets.' : 'Marcado por el cuadradito. Donde se unen los catetos.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-0.5"></span>
              <div>
                <span className="font-bold text-emerald-700">{lang === 'ca' ? 'Angles aguts (α i β)' : 'Ángulos agudos (α y β)'}</span>
                <p className="text-gray-600 text-xs mt-0.5">{lang === 'ca' ? 'Sempre menors de 90°. Els tres angles sumen 180°.' : 'Siempre menores de 90°. Los tres ángulos suman 180°.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                    <line x1="10" y1="10" x2="10" y2="90" stroke="transparent" strokeWidth="20" onClick={() => handleWrong(idx)} className="cursor-pointer hover:stroke-red-500/20"/>
                    <line x1="10" y1="90" x2="90" y2="90" stroke="black" strokeWidth="3"/>
                    <line x1="10" y1="90" x2="90" y2="90" stroke="transparent" strokeWidth="20" onClick={() => handleWrong(idx)} className="cursor-pointer hover:stroke-red-500/20"/>
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
                        <line x1="20" y1="20" x2="20" y2="80" stroke="transparent" strokeWidth="20" onClick={() => handleWrong(idx)} className="cursor-pointer hover:stroke-red-500/20"/>
                        <line x1="20" y1="80" x2="80" y2="80" stroke="black" strokeWidth="3"/>
                        <line x1="20" y1="80" x2="80" y2="80" stroke="transparent" strokeWidth="20" onClick={() => handleWrong(idx)} className="cursor-pointer hover:stroke-red-500/20"/>
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
                        <line x1="0" y1="0" x2="50" y2="0" stroke="transparent" strokeWidth="20" onClick={() => handleWrong(idx)} className="cursor-pointer hover:stroke-red-500/20"/>
                        <line x1="0" y1="0" x2="0" y2="70" stroke="black" strokeWidth="3"/>
                        <line x1="0" y1="0" x2="0" y2="70" stroke="transparent" strokeWidth="20" onClick={() => handleWrong(idx)} className="cursor-pointer hover:stroke-red-500/20"/>
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
                     <rect x="10" y="30" width="80" height="40" fill="none" stroke="transparent" strokeWidth="20" onClick={() => handleWrong(idx)} className="cursor-pointer hover:stroke-red-500/20" />

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