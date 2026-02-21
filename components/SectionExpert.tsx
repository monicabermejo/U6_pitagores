import React, { useState } from 'react';
import { TEXTS } from '../constants';
import { motion } from 'framer-motion';
import { FlaskConical, Calculator } from 'lucide-react';

export const SectionExpert: React.FC<{ lang: 'ca' | 'es' }> = ({ lang }) => {
  // Challenge State
  const [chalInputs, setChalInputs] = useState({ t1: '', t2: '', t3: '' });
  const [chalFeedback, setChalFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Lab State
  const [labInputs, setLabInputs] = useState({ a: '', b: '', c: '' });
  const [labResult, setLabResult] = useState<{ isTriple: boolean; msg: string } | null>(null);

  const checkChallenge = () => {
    const v1 = parseFloat(chalInputs.t1);
    const v2 = parseFloat(chalInputs.t2);
    const v3 = parseFloat(chalInputs.t3);

    if (v1 === 6 && v2 === 8 && v3 === 10) {
      setChalFeedback('correct');
    } else {
      setChalFeedback('incorrect');
    }
  };

  const checkLab = () => {
    const a = parseFloat(labInputs.a);
    const b = parseFloat(labInputs.b);
    const c = parseFloat(labInputs.c);

    if (isNaN(a) || isNaN(b) || isNaN(c)) return;

    // Sort so the largest number is treated as potential hypotenuse
    const sorted = [a, b, c].sort((x, y) => x - y);
    const [s1, s2, h] = sorted;

    // Check with small epsilon for floats
    const isPythagorean = Math.abs((s1 * s1 + s2 * s2) - (h * h)) < 0.01;

    if (isPythagorean) {
      setLabResult({ 
        isTriple: true, 
        msg: lang === 'ca' ? "✨ SÍ! És una Terna Pitagòrica!" : "✨ ¡SÍ! ¡Es una Terna Pitagórica!" 
      });
    } else {
      setLabResult({ 
        isTriple: false, 
        msg: lang === 'ca' ? "❌ No. Prova amb altres nombres." : "❌ No. Prueba con otros números." 
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 pb-12"
    >
        {/* Title */}
        <div className="text-center bg-yellow-100 border-4 border-yellow-400 rounded-3xl p-8 mb-8">
            <div className="text-6xl mb-4">🏺</div>
            <h2 className="text-3xl font-black text-yellow-800">{TEXTS.section_ext_title[lang]}</h2>
            <p className="text-yellow-700 text-lg mt-2 font-bold">
                {TEXTS.ext_desc[lang]}
            </p>
        </div>

        {/* History: 12 Knots */}
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 shadow-sm">
            <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
                📜 {TEXTS.ext_hist_title[lang]}
            </h3>
            <p className="text-yellow-900 leading-relaxed mb-4">
                {TEXTS.ext_hist_txt[lang]}
            </p>
            <div className="bg-white p-4 rounded-lg border-2 border-yellow-100 flex justify-center">
                <svg width="300" height="150" viewBox="0 0 300 150">
                    {/* Rope Visualization */}
                    <path d="M 50 120 L 250 120 L 50 20 Z" fill="none" stroke="#d97706" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* Knots on bottom (4 segments -> 5 knots) */}
                    <circle cx="50" cy="120" r="5" fill="#78350f" />
                    <circle cx="100" cy="120" r="5" fill="#78350f" />
                    <circle cx="150" cy="120" r="5" fill="#78350f" />
                    <circle cx="200" cy="120" r="5" fill="#78350f" />
                    <circle cx="250" cy="120" r="5" fill="#78350f" />
                    
                    {/* Knots on vertical (3 segments) */}
                    <circle cx="50" cy="86.6" r="5" fill="#78350f" />
                    <circle cx="50" cy="53.3" r="5" fill="#78350f" />
                    <circle cx="50" cy="20" r="5" fill="#78350f" />

                    {/* Knots on hypotenuse (5 segments) */}
                    <circle cx="90" cy="40" r="5" fill="#78350f" />
                    <circle cx="130" cy="60" r="5" fill="#78350f" />
                    <circle cx="170" cy="80" r="5" fill="#78350f" />
                    <circle cx="210" cy="100" r="5" fill="#78350f" />
                    
                    <text x="150" y="140" textAnchor="middle" fill="#d97706" fontWeight="bold">4</text>
                    <text x="30" y="70" textAnchor="middle" fill="#d97706" fontWeight="bold">3</text>
                    <text x="160" y="60" textAnchor="middle" fill="#d97706" fontWeight="bold">5</text>
                </svg>
            </div>
        </div>

        {/* Theory: Families */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                👨‍👩‍👧‍👦 {TEXTS.ext_fam_title[lang]}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: TEXTS.ext_fam_prim[lang] }} className="text-blue-900" />
                    <div className="mt-2 font-mono text-sm bg-white p-2 rounded text-blue-600 font-bold text-center">
                        (3, 4, 5) • (5, 12, 13) • (8, 15, 17)
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: TEXTS.ext_fam_deriv[lang] }} className="text-green-900" />
                </div>
            </div>
        </div>

        {/* Challenge */}
        <div className="bg-white rounded-xl p-6 border-2 border-indigo-100 shadow-md">
             <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                ⚡ {TEXTS.ext_chal_title[lang]}
            </h3>
            <p className="text-gray-600 mb-6">{TEXTS.ext_chal_desc[lang]}</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                <div className="flex items-center gap-2 text-xl font-bold text-gray-700">
                    <span>3 x 2 =</span>
                    <input 
                        type="number" 
                        value={chalInputs.t1} 
                        onChange={e => { setChalInputs({...chalInputs, t1: e.target.value}); setChalFeedback(null); }}
                        className="w-20 border-b-2 border-indigo-300 focus:border-indigo-600 outline-none text-center text-indigo-600"
                    />
                </div>
                <div className="flex items-center gap-2 text-xl font-bold text-gray-700">
                    <span>4 x 2 =</span>
                    <input 
                        type="number" 
                        value={chalInputs.t2} 
                        onChange={e => { setChalInputs({...chalInputs, t2: e.target.value}); setChalFeedback(null); }}
                        className="w-20 border-b-2 border-indigo-300 focus:border-indigo-600 outline-none text-center text-indigo-600"
                    />
                </div>
                <div className="flex items-center gap-2 text-xl font-bold text-gray-700">
                    <span>5 x 2 =</span>
                    <input 
                        type="number" 
                        value={chalInputs.t3} 
                        onChange={e => { setChalInputs({...chalInputs, t3: e.target.value}); setChalFeedback(null); }}
                        className="w-20 border-b-2 border-indigo-300 focus:border-indigo-600 outline-none text-center text-indigo-600"
                    />
                </div>
            </div>
            
            <div className="text-center">
                <button 
                    onClick={checkChallenge}
                    className="bg-indigo-600 text-white px-8 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors"
                >
                    {TEXTS.check[lang]}
                </button>
                {chalFeedback === 'correct' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 text-green-600 font-bold bg-green-50 p-2 rounded-lg inline-block">
                        {TEXTS.ext_chal_concl ? TEXTS.ext_chal_concl[lang] : (lang === 'ca' ? "Correcte! (6, 8, 10) és una terna." : "¡Correcto! (6, 8, 10) es una terna.")}
                    </motion.div>
                )}
                {chalFeedback === 'incorrect' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 text-red-500 font-bold">
                        {TEXTS.incorrect[lang]}
                    </motion.div>
                )}
            </div>
        </div>

        {/* Lab */}
        <div className="bg-gray-900 text-white rounded-xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                <FlaskConical /> {TEXTS.ext_lab_title[lang]}
            </h3>
            <p className="text-gray-300 mb-6">{TEXTS.ext_lab_desc[lang]}</p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <input 
                    type="number" 
                    placeholder="a" 
                    value={labInputs.a}
                    onChange={e => setLabInputs({...labInputs, a: e.target.value})}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-center w-24 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input 
                    type="number" 
                    placeholder="b" 
                    value={labInputs.b}
                    onChange={e => setLabInputs({...labInputs, b: e.target.value})}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-center w-24 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input 
                    type="number" 
                    placeholder="c" 
                    value={labInputs.c}
                    onChange={e => setLabInputs({...labInputs, c: e.target.value})}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-center w-24 focus:ring-2 focus:ring-purple-500 outline-none"
                />
            </div>

            <div className="text-center">
                 <button 
                    onClick={checkLab}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/50 flex items-center gap-2 mx-auto"
                >
                   <Calculator size={20} /> {TEXTS.ext_lab_btn[lang]}
                </button>

                {labResult && (
                    <motion.div 
                        key={labResult.msg}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 rounded-xl font-bold text-lg ${labResult.isTriple ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}
                    >
                        {labResult.msg}
                    </motion.div>
                )}
            </div>
        </div>
    </motion.div>
  );
};