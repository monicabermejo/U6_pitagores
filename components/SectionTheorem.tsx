import React, { useState } from 'react';
import { SectionProps } from '../types';
import { TEXTS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { trackAnswer } from '../utils/trackAnswer';

export const SectionTheorem: React.FC<SectionProps> = ({ lang, onComplete, isLocked, studentEmail, sessionId }) => {
  const [openHistory, setOpenHistory] = useState<string | null>(null);
  const [checkedProblems, setCheckedProblems] = useState<Record<string, boolean>>({});

  // Drill answers: 5, 6, 13, 5, 10, 12 | 17, 24, 41, 12, 25, 15
  const [inputs, setInputs] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '', q11: '', q12: '' });

  // Challenge (hidden) section state
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeInputs, setChallengeInputs] = useState<Record<string, string>>({});
  const [challengeChecked, setChallengeChecked] = useState<Record<string, boolean>>({});

  if (isLocked) return null;

  const checkOne = (p: { id: string; ans: number; type: string }) => {
    const val = parseFloat(inputs[p.id as keyof typeof inputs]);
    const isCorrect = val === p.ans;
    trackAnswer({
      email: studentEmail,
      questionId: `theorem_drill_${p.id}`,
      questionText: p.type === 'h'
        ? (lang === 'ca' ? `Drill teorema – troba la hipotenusa (${p.id})` : `Drill teorema – encuentra la hipotenusa (${p.id})`)
        : (lang === 'ca' ? `Drill teorema – troba el catet (${p.id})` : `Drill teorema – encuentra el cateto (${p.id})`),
      userAnswer: isNaN(val) ? '' : val,
      correctAnswer: p.ans,
      isCorrect,
      section: 'theorem',
      lang,
      sessionId,
    });
    setCheckedProblems(prev => ({ ...prev, [p.id]: true }));
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

  const drillScore = problems.filter(p =>
    checkedProblems[p.id] && parseFloat(inputs[p.id as keyof typeof inputs]) === p.ans
  ).length;

  // ── Challenge problems (hidden until revealed) ──────────────────────────
  const checkChallenge = (id: string, exactAns: number, tol: number, title: string) => {
    const val = parseFloat(challengeInputs[id] || '');
    const isCorrect = !isNaN(val) && Math.abs(val - exactAns) <= tol;
    trackAnswer({
      email: studentEmail,
      questionId: `theorem_challenge_${id}`,
      questionText: title,
      userAnswer: isNaN(val) ? '' : val,
      correctAnswer: Math.round(exactAns * 100) / 100,
      isCorrect,
      section: 'theorem',
      lang,
      sessionId,
    });
    setChallengeChecked(prev => ({ ...prev, [id]: true }));
  };

  interface ChallengeItem {
    id: string;
    num: number;
    title: { ca: string; es: string };
    statement: { ca: React.ReactNode; es: React.ReactNode };
    hint: { ca: string; es: string };
    unit: string;
    ans: number;
    tol: number;
  }

  const challengeProblems: ChallengeItem[] = [
    {
      id: 'ch1', num: 1,
      title: { ca: "L'alçada del triangle equilàter", es: "La altura del triángulo equilátero" },
      statement: {
        ca: <>Un triangle equilàter té els tres costats iguals que mesuren <strong>12 cm</strong> cadascun. Calcula la seva <strong>alçada</strong> (en cm).</>,
        es: <>Un triángulo equilátero tiene los tres lados iguales que miden <strong>12 cm</strong> cada uno. Calcula su <strong>altura</strong> (en cm).</>
      },
      hint: {
        ca: "L'alçada divideix el triangle equilàter en dos triangles rectangles iguals.",
        es: "La altura divide el triángulo equilátero en dos triángulos rectángulos iguales."
      },
      unit: "cm", ans: Math.sqrt(108), tol: 0.05,
    },
    {
      id: 'ch2', num: 2,
      title: { ca: "El rombe i la seva àrea", es: "El rombo y su área" },
      statement: {
        ca: <>L'àrea d'un rombe és de <strong>96 cm²</strong> i la seva diagonal major fa <strong>16 cm</strong>. Calcula la longitud del <strong>costat del rombe</strong>.</>,
        es: <>El área de un rombo es de <strong>96 cm²</strong> y su diagonal mayor mide <strong>16 cm</strong>. Calcula la longitud del <strong>lado del rombo</strong>.</>
      },
      hint: {
        ca: "Les diagonals d'un rombe es creuen exactament per la meitat.",
        es: "Las diagonales de un rombo se cruzan exactamente por la mitad."
      },
      unit: "cm", ans: 10, tol: 0.05,
    },
    {
      id: 'ch3', num: 3,
      title: { ca: "El quadrat des de la diagonal", es: "El cuadrado desde la diagonal" },
      statement: {
        ca: <>La diagonal d'un quadrat fa exactament <strong>10 cm</strong>. Calcula quant mesura el <strong>costat d'aquest quadrat</strong> (en cm).</>,
        es: <>La diagonal de un cuadrado mide exactamente <strong>10 cm</strong>. Calcula cuánto mide el <strong>lado de este cuadrado</strong> (en cm).</>
      },
      hint: {
        ca: "La diagonal d'un quadrat forma dos triangles rectangles on els dos catets són iguals.",
        es: "La diagonal de un cuadrado forma dos triángulos rectángulos donde los dos catetos son iguales."
      },
      unit: "cm", ans: Math.sqrt(50), tol: 0.05,
    },
    {
      id: 'ch4', num: 4,
      title: { ca: "L'àrea del triangle isòsceles", es: "El área del triángulo isósceles" },
      statement: {
        ca: <>Un triangle isòsceles té una base de <strong>16 cm</strong> i els dos costats iguals mesuren <strong>10 cm</strong> cadascun. Calcula l'<strong>àrea total</strong> del triangle (en cm²).</>,
        es: <>Un triángulo isósceles tiene una base de <strong>16 cm</strong> y los dos lados iguales miden <strong>10 cm</strong> cada uno. Calcula el <strong>área total</strong> del triángulo (en cm²).</>
      },
      hint: {
        ca: "L'alçada d'un triangle isòsceles cau just al mig de la base.",
        es: "La altura de un triángulo isósceles cae justo en la mitad de la base."
      },
      unit: "cm²", ans: 48, tol: 0.05,
    },
    {
      id: 'ch5', num: 5,
      title: { ca: "La diagonal del rectangle", es: "La diagonal del rectángulo" },
      statement: {
        ca: <>Un rectangle té una àrea de <strong>1200 cm²</strong> i la seva base mesura <strong>40 cm</strong>. Calcula la longitud de la seva <strong>diagonal</strong>.</>,
        es: <>Un rectángulo tiene un área de <strong>1200 cm²</strong> y su base mide <strong>40 cm</strong>. Calcula la longitud de su <strong>diagonal</strong>.</>
      },
      hint: {
        ca: "La diagonal d'un rectangle és la hipotenusa del triangle rectangle que formen la base i l'altura.",
        es: "La diagonal de un rectángulo es la hipotenusa del triángulo rectángulo que forman la base y la altura."
      },
      unit: "cm", ans: 50, tol: 0.05,
    },
    {
      id: 'ch6', num: 6,
      title: { ca: "El trapezi isòsceles", es: "El trapecio isósceles" },
      statement: {
        ca: <>Un trapezi isòsceles té una base major de <strong>22 cm</strong>, una base menor de <strong>12 cm</strong> i una alçada de <strong>12 cm</strong>. Calcula el seu <strong>perímetre total</strong>.</>,
        es: <>Un trapecio isósceles tiene una base mayor de <strong>22 cm</strong>, una base menor de <strong>12 cm</strong> y una altura de <strong>12 cm</strong>. Calcula su <strong>perímetro total</strong>.</>
      },
      hint: {
        ca: "Si dibuixes les alçades, als extrems del trapezi es formen dos petits triangles rectangles.",
        es: "Si dibujas las alturas, en los extremos del trapecio se forman dos pequeños triángulos rectángulos."
      },
      unit: "cm", ans: 60, tol: 0.05,
    },
    {
      id: 'ch7', num: 7,
      title: { ca: "L'apotema de l'hexàgon", es: "La apotema del hexágono" },
      statement: {
        ca: <>Un hexàgon regular es divideix en 6 triangles equilàters. Calcula l'<strong>apotema</strong> (l'alçada d'un d'aquests triangles) d'un hexàgon de <strong>costat 8 cm</strong> (en cm).</>,
        es: <>Un hexágono regular se divide en 6 triángulos equiláteros. Calcula la <strong>apotema</strong> (la altura de uno de esos triángulos) de un hexágono con <strong>lado de 8 cm</strong> (en cm).</>
      },
      hint: {
        ca: "L'apotema és l'alçada d'un dels sis triangles equilàters que formen l'hexàgon.",
        es: "La apotema es la altura de uno de los seis triángulos equiláteros que forman el hexágono."
      },
      unit: "cm", ans: 4 * Math.sqrt(3), tol: 0.05,
    },
    {
      id: 'ch8', num: 8,
      title: { ca: "La corda i la circumferència", es: "La cuerda y la circunferencia" },
      statement: {
        ca: (<>
          <svg viewBox="0 0 160 160" width="130" height="130" className="float-right ml-3 mb-1">
            {/* Circle */}
            <circle cx="80" cy="80" r="60" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2"/>
            {/* Chord: from (20,110) to (140,110) — horizontal for clarity */}
            <line x1="26" y1="110" x2="134" y2="110" stroke="#1d4ed8" strokeWidth="2.5"/>
            {/* Perpendicular from center to midpoint of chord */}
            <line x1="80" y1="80" x2="80" y2="110" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3"/>
            {/* Radius to right endpoint of chord */}
            <line x1="80" y1="80" x2="134" y2="110" stroke="#16a34a" strokeWidth="2"/>
            {/* Right-angle mark at midpoint */}
            <rect x="80" y="103" width="7" height="7" fill="none" stroke="#dc2626" strokeWidth="1.5"/>
            {/* Center dot */}
            <circle cx="80" cy="80" r="3" fill="#1d4ed8"/>
            {/* Labels */}
            <text x="84" y="98" fontSize="11" fill="#dc2626" fontWeight="bold">5</text>
            <text x="108" y="97" fontSize="11" fill="#16a34a" fontWeight="bold">13</text>
            <text x="65" y="125" fontSize="11" fill="#1d4ed8" fontWeight="bold">corda</text>
            <text x="72" y="75" fontSize="10" fill="#1d4ed8">O</text>
          </svg>
          Dins d'una circumferència de <strong>radi 13 cm</strong> hi ha dibuixada una corda. La distància des del centre fins al mig de la corda és de <strong>5 cm</strong>. Quina és la <strong>longitud total de la corda</strong>?
        </>),
        es: (<>
          <svg viewBox="0 0 160 160" width="130" height="130" className="float-right ml-3 mb-1">
            <circle cx="80" cy="80" r="60" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2"/>
            <line x1="26" y1="110" x2="134" y2="110" stroke="#1d4ed8" strokeWidth="2.5"/>
            <line x1="80" y1="80" x2="80" y2="110" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3"/>
            <line x1="80" y1="80" x2="134" y2="110" stroke="#16a34a" strokeWidth="2"/>
            <rect x="80" y="103" width="7" height="7" fill="none" stroke="#dc2626" strokeWidth="1.5"/>
            <circle cx="80" cy="80" r="3" fill="#1d4ed8"/>
            <text x="84" y="98" fontSize="11" fill="#dc2626" fontWeight="bold">5</text>
            <text x="108" y="97" fontSize="11" fill="#16a34a" fontWeight="bold">13</text>
            <text x="63" y="125" fontSize="11" fill="#1d4ed8" fontWeight="bold">cuerda</text>
            <text x="72" y="75" fontSize="10" fill="#1d4ed8">O</text>
          </svg>
          Dentro de una circunferencia de <strong>radio 13 cm</strong> hay una cuerda. La distancia desde el centro hasta el punto medio de la cuerda es de <strong>5 cm</strong>. ¿Cuál es la <strong>longitud total de la cuerda</strong>?
        </>),
      },
      hint: {
        ca: "El radi que va del centre fins a un extrem de la corda és la hipotenusa.",
        es: "El radio que va del centro hasta un extremo de la cuerda es la hipotenusa."
      },
      unit: "cm", ans: 24, tol: 0.05,
    },
    {
      id: 'ch9', num: 9,
      title: { ca: "Del perímetre a la diagonal", es: "Del perímetro a la diagonal" },
      statement: {
        ca: <>Un rectangle té un perímetre de <strong>28 cm</strong> i la seva base mesura <strong>8 cm</strong>. Calcula quant fa la seva <strong>diagonal</strong>.</>,
        es: <>Un rectángulo tiene un perímetro de <strong>28 cm</strong> y su base mide <strong>8 cm</strong>. Calcula cuánto mide su <strong>diagonal</strong>.</>
      },
      hint: {
        ca: "Amb el perímetre i la base pots trobar l'altura del rectangle.",
        es: "Con el perímetro y la base puedes encontrar la altura del rectángulo."
      },
      unit: "cm", ans: 10, tol: 0.05,
    },
    {
      id: 'ch10', num: 10,
      title: { ca: "Figura composta: Rectangle + Triangle", es: "Figura compuesta: Rectángulo + Triángulo" },
      statement: {
        ca: <>Una figura formada per un rectangle (<strong>base 8 cm, altura 3 cm</strong>) amb un triangle isòsceles al damunt. L'altura total de la figura és <strong>6 cm</strong>. Calcula la longitud dels <strong>costats iguals del triangle</strong>.</>,
        es: <>Una figura formada por un rectángulo (<strong>base 8 cm, altura 3 cm</strong>) con un triángulo isósceles encima. La altura total de la figura es <strong>6 cm</strong>. Calcula la longitud de los <strong>lados iguales del triángulo</strong>.</>
      },
      hint: {
        ca: "Resta l'altura del rectangle a l'altura total per trobar l'altura del triangle.",
        es: "Resta la altura del rectángulo a la altura total para encontrar la altura del triángulo."
      },
      unit: "cm", ans: 5, tol: 0.05,
    },
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
             const isChecked = checkedProblems[p.id];
             const val = parseFloat(inputs[p.id as keyof typeof inputs]);
             const isCorrect = val === p.ans;
             const isFilled = inputs[p.id as keyof typeof inputs] !== '';

             let inputStyle = "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
             if (isChecked && isFilled) {
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
                 <div className="mb-3 text-gray-800">
                   {p.type === 'h' ? TEXTS.s3_find_h[lang] : TEXTS.s3_find_c[lang]}
                 </div>
                 <input
                   type="number"
                   className={`border rounded p-2 w-32 transition-colors outline-none ${inputStyle}`}
                   value={inputs[p.id as keyof typeof inputs]}
                   onChange={(e) => {
                     setInputs({ ...inputs, [p.id]: e.target.value });
                     setCheckedProblems(prev => { const n = { ...prev }; delete n[p.id]; return n; });
                   }}
                 />
                 <div className="mt-3 flex flex-col gap-1">
                   <button
                     disabled={!isFilled}
                     onClick={() => checkOne(p)}
                     className={`w-fit px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${
                       isFilled
                         ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                         : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                     }`}
                   >
                     {lang === 'ca' ? 'Comprova' : 'Comprobar'}
                   </button>
                   {isChecked && (
                     <p className={`text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                       {isCorrect
                         ? (lang === 'ca' ? '✓ Correcte!' : '✓ ¡Correcto!')
                         : (lang === 'ca' ? `✗ La resposta és ${p.ans}` : `✗ La respuesta es ${p.ans}`)}
                     </p>
                   )}
                 </div>
               </div>
             );
           })}
        </div>
        
        <div className="mt-6 flex flex-col items-center gap-2">
          {drillScore > 0 && drillScore < 12 && (
            <p className="text-gray-500 text-sm">
              {lang === 'ca' ? `${drillScore} de 12 correctes` : `${drillScore} de 12 correctas`}
            </p>
          )}
          {drillScore === 12 && (
            <p className="text-green-500 font-bold animate-bounce">
              {lang === 'ca' ? '🎉 Perfecte! Tot correcte.' : '🎉 ¡Perfecto! Todo correcto.'}
            </p>
          )}
        </div>
      </div>

      {/* ── Challenge: hidden extra battery ── */}
      <div className="mt-4">
        <button
          onClick={() => setShowChallenge(v => !v)}
          className="w-full py-4 px-6 rounded-xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 transition-colors text-amber-900 font-bold text-lg flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🏆</span>
          {lang === 'ca'
            ? 'Ja has acabat? Tens ganes de posar-te a prova?'
            : '¿Ya has terminado? ¿Tienes ganas de ponerte a prueba?'}
          {showChallenge ? <ChevronUp className="ml-2 text-amber-600" /> : <ChevronDown className="ml-2 text-amber-600" />}
        </button>

        <AnimatePresence>
          {showChallenge && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-6">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <p className="text-amber-800 font-semibold">
                    {lang === 'ca'
                      ? '⚠️ Aquests exercicis requereixen pensar en diversos passos. Dóna el resultat amb dos decimals.'
                      : '⚠️ Estos ejercicios requieren pensar en varios pasos. Da el resultado con dos decimales.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {challengeProblems.map((p) => {
                    const isChecked = challengeChecked[p.id];
                    const val = parseFloat(challengeInputs[p.id] || '');
                    const isCorrect = !isNaN(val) && Math.abs(val - p.ans) <= p.tol;
                    const isFilled = (challengeInputs[p.id] || '') !== '';

                    let inputStyle = "border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200";
                    if (isChecked && isFilled) {
                      inputStyle = isCorrect
                        ? "border-green-500 bg-green-50 text-green-900 font-bold"
                        : "border-red-300 bg-red-50 text-red-900 font-bold";
                    }

                    return (
                      <div key={p.id} className="bg-white p-6 rounded-lg border border-amber-200 shadow-sm flex flex-col h-full">
                        <h5 className="font-bold text-amber-700 text-base mb-3">
                          {p.num}. {p.title[lang]}
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {p.statement[lang]}
                        </p>
                        <details className="mb-4 text-sm">
                          <summary className="cursor-pointer text-indigo-600 font-semibold hover:text-indigo-800 select-none">
                            💡 {lang === 'ca' ? 'Pista' : 'Pista'}
                          </summary>
                          <p className="mt-2 italic text-gray-500 pl-3 border-l-2 border-indigo-200">
                            {p.hint[lang]}
                          </p>
                        </details>
                        <div className="mt-auto">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="number"
                              step="0.01"
                              className={`border rounded p-2 w-32 transition-colors outline-none ${inputStyle}`}
                              value={challengeInputs[p.id] || ''}
                              onChange={(e) => {
                                setChallengeInputs(prev => ({ ...prev, [p.id]: e.target.value }));
                                setChallengeChecked(prev => { const n = { ...prev }; delete n[p.id]; return n; });
                              }}
                            />
                            <span className="text-gray-500 text-sm">{p.unit}</span>
                          </div>
                          <button
                            disabled={!isFilled}
                            onClick={() => checkChallenge(p.id, p.ans, p.tol, p.title[lang])}
                            className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${
                              isFilled
                                ? 'bg-amber-500 text-white hover:bg-amber-600 cursor-pointer'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {lang === 'ca' ? 'Comprova' : 'Comprobar'}
                          </button>
                          {isChecked && (
                            <p className={`mt-1 text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                              {isCorrect
                                ? (lang === 'ca' ? '✓ Correcte!' : '✓ ¡Correcto!')
                                : (lang === 'ca' ? '✗ Revisa el càlcul i torna-ho a intentar.' : '✗ Revisa el cálculo e inténtalo de nuevo.')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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