import React, { useState } from 'react';
import { Language } from '../types';
import { trackAnswer } from '../utils/trackAnswer';

interface Props {
  lang: Language;
  studentEmail: string;
  sessionId: string;
}

interface ProblemItem {
  id: string;
  num: number;
  title: { ca: string; es: string };
  statement: { ca: React.ReactNode; es: React.ReactNode };
  steps: { ca: React.ReactNode; es: React.ReactNode };
  hint: { ca: string; es: string };
  unit: string;
  ans: number;
  tol: number;
}

export const SectionPractica: React.FC<Props> = ({ lang, studentEmail, sessionId }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showSteps, setShowSteps] = useState<Record<string, boolean>>({});

  const checkProblem = (p: ProblemItem) => {
    const val = parseFloat(inputs[p.id] || '');
    const isCorrect = !isNaN(val) && Math.abs(val - p.ans) <= p.tol;
    trackAnswer({
      email: studentEmail,
      questionId: `practica_${p.id}`,
      questionText: p.title[lang],
      userAnswer: isNaN(val) ? '' : val,
      correctAnswer: Math.round(p.ans * 100) / 100,
      isCorrect,
      section: 'practica',
      lang,
      sessionId,
    });
    setChecked(prev => ({ ...prev, [p.id]: true }));
  };

  const problems: ProblemItem[] = [
    {
      id: 'p1', num: 1,
      title: {
        ca: "El rombe i les seves diagonals",
        es: "El rombo y sus diagonales",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 170 150" width="130" height="115" className="float-right ml-3 mb-2">
            <polygon points="85,10 155,75 85,140 15,75" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2"/>
            {/* diagonal major - horitzontal */}
            <line x1="15" y1="75" x2="155" y2="75" stroke="#2563eb" strokeWidth="1.8" strokeDasharray="5,3"/>
            {/* diagonal menor - vertical */}
            <line x1="85" y1="10" x2="85" y2="140" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="5,3"/>
            {/* angle recte al centre */}
            <rect x="85" y="75" width="8" height="8" fill="none" stroke="#6b7280" strokeWidth="1.2"/>
            <circle cx="85" cy="75" r="3" fill="#ca8a04"/>
            <text x="20" y="70" fill="#2563eb" fontSize="11" fontWeight="bold">24 cm</text>
            <text x="90" y="50" fill="#dc2626" fontSize="11" fontWeight="bold">?</text>
            <text x="90" y="100" fill="#dc2626" fontSize="11" fontWeight="bold">P = 52 cm</text>
          </svg>
          Un rombe té un <strong>perímetre de 52 cm</strong> i una de les seves diagonals mesura <strong>24 cm</strong>. Calcula la longitud de l'<strong>altra diagonal</strong>.
        </>),
        es: (<>
          <svg viewBox="0 0 170 150" width="130" height="115" className="float-right ml-3 mb-2">
            <polygon points="85,10 155,75 85,140 15,75" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2"/>
            <line x1="15" y1="75" x2="155" y2="75" stroke="#2563eb" strokeWidth="1.8" strokeDasharray="5,3"/>
            <line x1="85" y1="10" x2="85" y2="140" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="5,3"/>
            <rect x="85" y="75" width="8" height="8" fill="none" stroke="#6b7280" strokeWidth="1.2"/>
            <circle cx="85" cy="75" r="3" fill="#ca8a04"/>
            <text x="20" y="70" fill="#2563eb" fontSize="11" fontWeight="bold">24 cm</text>
            <text x="90" y="50" fill="#dc2626" fontSize="11" fontWeight="bold">?</text>
            <text x="90" y="100" fill="#dc2626" fontSize="11" fontWeight="bold">P = 52 cm</text>
          </svg>
          Un rombo tiene un <strong>perímetro de 52 cm</strong> y una de sus diagonales mide <strong>24 cm</strong>. Calcula la longitud de la <strong>otra diagonal</strong>.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Costat = P ÷ 4 = 52 ÷ 4 = <strong>13 cm</strong></li>
          <li>Semidiagonal coneguda = 24 ÷ 2 = <strong>12 cm</strong></li>
          <li>Pitàgores: semidiag² = 13² − 12² = 169 − 144 = 25 → semidiag = <strong>5 cm</strong></li>
          <li>Diagonal desconeguda = 2 × 5 = <strong>10 cm</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Lado = P ÷ 4 = 52 ÷ 4 = <strong>13 cm</strong></li>
          <li>Semidiagonal conocida = 24 ÷ 2 = <strong>12 cm</strong></li>
          <li>Pitágoras: semidiag² = 13² − 12² = 169 − 144 = 25 → semidiag = <strong>5 cm</strong></li>
          <li>Diagonal desconocida = 2 × 5 = <strong>10 cm</strong></li>
        </ol>),
      },
      hint: {
        ca: "Calcula primer el costat (P÷4). Cada costat és la hipotenusa de la meitat del rombe.",
        es: "Calcula primero el lado (P÷4). Cada lado es la hipotenusa de la mitad del rombo.",
      },
      unit: "cm", ans: 10, tol: 0.05,
    },
    {
      id: 'p2', num: 2,
      title: {
        ca: "Figura composta: quadrat i dos triangles",
        es: "Figura compuesta: cuadrado y dos triángulos",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 170 150" width="130" height="115" className="float-right ml-3 mb-2">
            {/* quadrat central */}
            <rect x="45" y="25" width="80" height="80" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>
            {/* triangle esquerre */}
            <polygon points="45,25 45,105 5,65" fill="#fce7f3" stroke="#9333ea" strokeWidth="2"/>
            {/* triangle dret */}
            <polygon points="125,25 125,105 165,65" fill="#fce7f3" stroke="#9333ea" strokeWidth="2"/>
            {/* mesures */}
            <text x="75" y="70" textAnchor="middle" fill="#1d4ed8" fontSize="11" fontWeight="bold">8 cm</text>
            <text x="28" y="67" fill="#9333ea" fontSize="10">5 cm</text>
            <text x="130" y="67" fill="#9333ea" fontSize="10">5 cm</text>
            <line x1="45" y1="138" x2="125" y2="138" stroke="#2563eb" strokeWidth="1"/>
            <text x="85" y="148" textAnchor="middle" fill="#2563eb" fontSize="10">8 cm</text>
          </svg>
          Una figura formada per un <strong>quadrat de costat 8 cm</strong> i dos triangles isòsceles idèntics als costats verticals. Els costats iguals de cada triangle mesuren <strong>5 cm</strong>. Calcula l'<strong>àrea total</strong> de la figura.
        </>),
        es: (<>
          <svg viewBox="0 0 170 150" width="130" height="115" className="float-right ml-3 mb-2">
            <rect x="45" y="25" width="80" height="80" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>
            <polygon points="45,25 45,105 5,65" fill="#fce7f3" stroke="#9333ea" strokeWidth="2"/>
            <polygon points="125,25 125,105 165,65" fill="#fce7f3" stroke="#9333ea" strokeWidth="2"/>
            <text x="75" y="70" textAnchor="middle" fill="#1d4ed8" fontSize="11" fontWeight="bold">8 cm</text>
            <text x="28" y="67" fill="#9333ea" fontSize="10">5 cm</text>
            <text x="130" y="67" fill="#9333ea" fontSize="10">5 cm</text>
            <line x1="45" y1="138" x2="125" y2="138" stroke="#2563eb" strokeWidth="1"/>
            <text x="85" y="148" textAnchor="middle" fill="#2563eb" fontSize="10">8 cm</text>
          </svg>
          Una figura formada por un <strong>cuadrado de lado 8 cm</strong> y dos triángulos isósceles idénticos en los lados verticales. Los lados iguales de cada triángulo miden <strong>5 cm</strong>. Calcula el <strong>área total</strong> de la figura.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Base de cada triangle = costat del quadrat = <strong>8 cm</strong></li>
          <li>Semibbase = 4 cm. Pitàgores: alçada = √(5² − 4²) = √9 = <strong>3 cm</strong></li>
          <li>Àrea quadrat = 8² = <strong>64 cm²</strong></li>
          <li>Àrea cada triangle = (8 × 3) ÷ 2 = <strong>12 cm²</strong></li>
          <li>Total = 64 + 2 × 12 = <strong>88 cm²</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Base de cada triángulo = lado del cuadrado = <strong>8 cm</strong></li>
          <li>Semibbase = 4 cm. Pitágoras: altura = √(5² − 4²) = √9 = <strong>3 cm</strong></li>
          <li>Área cuadrado = 8² = <strong>64 cm²</strong></li>
          <li>Área cada triángulo = (8 × 3) ÷ 2 = <strong>12 cm²</strong></li>
          <li>Total = 64 + 2 × 12 = <strong>88 cm²</strong></li>
        </ol>),
      },
      hint: {
        ca: "L'alçada de cada triangle és un catet: usa Pitàgores amb el costat obliquo i la semibbase.",
        es: "La altura de cada triángulo es un cateto: usa Pitágoras con el lado oblicuo y la semibase.",
      },
      unit: "cm²", ans: 88, tol: 0.05,
    },
    {
      id: 'p3', num: 3,
      title: {
        ca: "Del perímetre del quadrat a la diagonal",
        es: "Del perímetro del cuadrado a la diagonal",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 150 150" width="120" height="120" className="float-right ml-3 mb-2">
            <rect x="15" y="15" width="120" height="120" fill="#eff6ff" stroke="#2563eb" strokeWidth="2"/>
            <line x1="15" y1="15" x2="135" y2="135" stroke="#dc2626" strokeWidth="2" strokeDasharray="6,3"/>
            <text x="75" y="155" textAnchor="middle" fill="#2563eb" fontSize="11" fontWeight="bold">P = 40 cm</text>
            <text x="72" y="68" fill="#dc2626" fontSize="10" fontWeight="bold">?</text>
          </svg>
          Un quadrat té un <strong>perímetre de 40 cm</strong>. Calcula la longitud de la seva <strong>diagonal</strong>. Dóna el resultat amb dos decimals.
        </>),
        es: (<>
          <svg viewBox="0 0 150 150" width="120" height="120" className="float-right ml-3 mb-2">
            <rect x="15" y="15" width="120" height="120" fill="#eff6ff" stroke="#2563eb" strokeWidth="2"/>
            <line x1="15" y1="15" x2="135" y2="135" stroke="#dc2626" strokeWidth="2" strokeDasharray="6,3"/>
            <text x="75" y="155" textAnchor="middle" fill="#2563eb" fontSize="11" fontWeight="bold">P = 40 cm</text>
            <text x="72" y="68" fill="#dc2626" fontSize="10" fontWeight="bold">?</text>
          </svg>
          Un cuadrado tiene un <strong>perímetro de 40 cm</strong>. Calcula la longitud de su <strong>diagonal</strong>. Da el resultado con dos decimales.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Costat = P ÷ 4 = 40 ÷ 4 = <strong>10 cm</strong></li>
          <li>La diagonal forma un triangle rectangle on els dos catets = 10 cm</li>
          <li>Pitàgores: d = √(10² + 10²) = √200 = 10√2 ≈ <strong>14.14 cm</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Lado = P ÷ 4 = 40 ÷ 4 = <strong>10 cm</strong></li>
          <li>La diagonal forma un triángulo rectángulo donde los dos catetos = 10 cm</li>
          <li>Pitágoras: d = √(10² + 10²) = √200 = 10√2 ≈ <strong>14.14 cm</strong></li>
        </ol>),
      },
      hint: {
        ca: "Primer calcula el costat dividint el perímetre per 4. Després aplica Pitàgores.",
        es: "Primero calcula el lado dividiendo el perímetro entre 4. Después aplica Pitágoras.",
      },
      unit: "cm", ans: 10 * Math.SQRT2, tol: 0.05,
    },
    {
      id: 'p4', num: 4,
      title: {
        ca: "El rectangle i la seva diagonal",
        es: "El rectángulo y su diagonal",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 180 130" width="140" height="100" className="float-right ml-3 mb-2">
            <rect x="10" y="20" width="160" height="90" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2"/>
            <line x1="10" y1="20" x2="170" y2="110" stroke="#dc2626" strokeWidth="2" strokeDasharray="6,3"/>
            <text x="90" y="13" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="bold">base</text>
            <text x="175" y="65" fill="#16a34a" fontSize="11" fontWeight="bold">h</text>
            <text x="80" y="72" fill="#dc2626" fontSize="10" fontWeight="bold">?</text>
            <text x="90" y="125" textAnchor="middle" fill="#374151" fontSize="10">P = 34 cm · A = 60 cm²</text>
          </svg>
          Un rectangle té un <strong>perímetre de 34 cm</strong> i una <strong>àrea de 60 cm²</strong>. Calcula la longitud de la seva <strong>diagonal</strong>.
        </>),
        es: (<>
          <svg viewBox="0 0 180 130" width="140" height="100" className="float-right ml-3 mb-2">
            <rect x="10" y="20" width="160" height="90" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2"/>
            <line x1="10" y1="20" x2="170" y2="110" stroke="#dc2626" strokeWidth="2" strokeDasharray="6,3"/>
            <text x="90" y="13" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="bold">base</text>
            <text x="175" y="65" fill="#16a34a" fontSize="11" fontWeight="bold">h</text>
            <text x="80" y="72" fill="#dc2626" fontSize="10" fontWeight="bold">?</text>
            <text x="90" y="125" textAnchor="middle" fill="#374151" fontSize="10">P = 34 cm · A = 60 cm²</text>
          </svg>
          Un rectángulo tiene un <strong>perímetro de 34 cm</strong> y un <strong>área de 60 cm²</strong>. Calcula la longitud de su <strong>diagonal</strong>.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>P = 2(a+b) → a + b = 17</li>
          <li>A = a × b = 60</li>
          <li>Equació: a² − 17a + 60 = 0 → (a−12)(a−5) = 0 → <strong>a = 12 cm, b = 5 cm</strong></li>
          <li>Pitàgores: d = √(12² + 5²) = √169 = <strong>13 cm</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>P = 2(a+b) → a + b = 17</li>
          <li>A = a × b = 60</li>
          <li>Ecuación: a² − 17a + 60 = 0 → (a−12)(a−5) = 0 → <strong>a = 12 cm, b = 5 cm</strong></li>
          <li>Pitágoras: d = √(12² + 5²) = √169 = <strong>13 cm</strong></li>
        </ol>),
      },
      hint: {
        ca: "Usa P per trobar a+b i l'àrea per trobar a×b. Llavors resol el sistema per trobar els costats.",
        es: "Usa P para encontrar a+b y el área para encontrar a×b. Luego resuelve el sistema para encontrar los lados.",
      },
      unit: "cm", ans: 13, tol: 0.05,
    },
    {
      id: 'p5', num: 5,
      title: {
        ca: "L'àrea del triangle rectangle",
        es: "El área del triángulo rectángulo",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 160 150" width="125" height="117" className="float-right ml-3 mb-2">
            {/* triangle rectangle */}
            <polygon points="20,130 140,130 20,20" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
            {/* angle recte */}
            <rect x="20" y="120" width="10" height="10" fill="none" stroke="#d97706" strokeWidth="1.5"/>
            {/* etiquetes */}
            <text x="80" y="148" textAnchor="middle" fill="#374151" fontSize="10">catet a</text>
            <text x="8" y="75" fill="#374151" fontSize="10">catet b</text>
            <text x="90" y="72" fill="#dc2626" fontSize="11" fontWeight="bold">h = 26 cm</text>
            <text x="40" y="155" fill="#374151" fontSize="9">P = 60 cm</text>
          </svg>
          Un triangle rectangle té un <strong>perímetre de 60 cm</strong> i la <strong>hipotenusa mesura 26 cm</strong>. Calcula l'<strong>àrea</strong> del triangle.
        </>),
        es: (<>
          <svg viewBox="0 0 160 150" width="125" height="117" className="float-right ml-3 mb-2">
            <polygon points="20,130 140,130 20,20" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
            <rect x="20" y="120" width="10" height="10" fill="none" stroke="#d97706" strokeWidth="1.5"/>
            <text x="80" y="148" textAnchor="middle" fill="#374151" fontSize="10">cateto a</text>
            <text x="8" y="75" fill="#374151" fontSize="10">cateto b</text>
            <text x="90" y="72" fill="#dc2626" fontSize="11" fontWeight="bold">h = 26 cm</text>
            <text x="40" y="155" fill="#374151" fontSize="9">P = 60 cm</text>
          </svg>
          Un triángulo rectángulo tiene un <strong>perímetro de 60 cm</strong> y la <strong>hipotenusa mide 26 cm</strong>. Calcula el <strong>área</strong> del triángulo.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>a + b = P − h = 60 − 26 = <strong>34</strong></li>
          <li>Pitàgores: a² + b² = 26² = <strong>676</strong></li>
          <li>(a + b)² = a² + 2ab + b² → 34² = 676 + 2ab → 1156 − 676 = 2ab → ab = <strong>240</strong></li>
          <li>Àrea = a × b ÷ 2 = 240 ÷ 2 = <strong>120 cm²</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>a + b = P − h = 60 − 26 = <strong>34</strong></li>
          <li>Pitágoras: a² + b² = 26² = <strong>676</strong></li>
          <li>(a + b)² = a² + 2ab + b² → 34² = 676 + 2ab → 1156 − 676 = 2ab → ab = <strong>240</strong></li>
          <li>Área = a × b ÷ 2 = 240 ÷ 2 = <strong>120 cm²</strong></li>
        </ol>),
      },
      hint: {
        ca: "Usa el perímetre per trobar a+b. Amb Pitàgores trobaràs a²+b². A partir d'aquí pots calcular a×b sense necessitat de trobar cada catet.",
        es: "Usa el perímetro para encontrar a+b. Con Pitágoras encontrarás a²+b². A partir de ahí puedes calcular a×b sin necesidad de encontrar cada cateto.",
      },
      unit: "cm²", ans: 120, tol: 0.05,
    },
    {
      id: 'p6', num: 6,
      title: {
        ca: "El quadrat inscrit en una circumferència",
        es: "El cuadrado inscrito en una circunferencia",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 170 170" width="130" height="130" className="float-right ml-3 mb-2">
            {/* circle */}
            <circle cx="85" cy="85" r="70" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2"/>
            {/* inscribed square - vertices at top, right, bottom, left */}
            <polygon points="85,15 155,85 85,155 15,85" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2"/>
            {/* radius to top vertex */}
            <line x1="85" y1="85" x2="85" y2="15" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="4,3"/>
            {/* center dot */}
            <circle cx="85" cy="85" r="3" fill="#1d4ed8"/>
            {/* right angle mark at top-right vertex */}
            <rect x="85" y="15" width="8" height="8" fill="none" stroke="#374151" strokeWidth="1.2"/>
            <text x="90" y="52" fill="#dc2626" fontSize="11" fontWeight="bold">r=10cm</text>
            <text x="85" y="165" textAnchor="middle" fill="#374151" fontSize="9">?  àrea</text>
          </svg>
          Una circumferència de <strong>radi 10 cm</strong> té inscrit un quadrat (els quatre vèrtexs toquen la circumferència). Calcula l'<strong>àrea</strong> d'aquest quadrat.
        </>),
        es: (<>
          <svg viewBox="0 0 170 170" width="130" height="130" className="float-right ml-3 mb-2">
            <circle cx="85" cy="85" r="70" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2"/>
            <polygon points="85,15 155,85 85,155 15,85" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2"/>
            <line x1="85" y1="85" x2="85" y2="15" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="4,3"/>
            <circle cx="85" cy="85" r="3" fill="#1d4ed8"/>
            <rect x="85" y="15" width="8" height="8" fill="none" stroke="#374151" strokeWidth="1.2"/>
            <text x="90" y="52" fill="#dc2626" fontSize="11" fontWeight="bold">r=10cm</text>
            <text x="85" y="165" textAnchor="middle" fill="#374151" fontSize="9">?  área</text>
          </svg>
          Una circunferencia de <strong>radio 10 cm</strong> tiene inscrito un cuadrado (los cuatro vértices tocan la circunferencia). Calcula el <strong>área</strong> de este cuadrado.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>La diagonal del quadrat = diàmetre = 2 × 10 = <strong>20 cm</strong></li>
          <li>La diagonal divideix el quadrat en dos triangles rectangles iguals amb catets = costat (l)</li>
          <li>Pitàgores: l² + l² = 20² → 2l² = 400 → l² = 200</li>
          <li>Àrea = l² = <strong>200 cm²</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>La diagonal del cuadrado = diámetro = 2 × 10 = <strong>20 cm</strong></li>
          <li>La diagonal divide el cuadrado en dos triángulos rectángulos iguales con catetos = lado (l)</li>
          <li>Pitágoras: l² + l² = 20² → 2l² = 400 → l² = 200</li>
          <li>Área = l² = <strong>200 cm²</strong></li>
        </ol>),
      },
      hint: {
        ca: "La diagonal del quadrat és igual al diàmetre de la circumferència. Recorda: l'àrea d'un quadrat és el costat al quadrat (l²).",
        es: "La diagonal del cuadrado es igual al diámetro de la circunferencia. Recuerda: el área de un cuadrado es el lado al cuadrado (l²).",
      },
      unit: "cm²", ans: 200, tol: 0.05,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg">
        <h3 className="font-bold text-emerald-900 text-xl mb-2">
          {lang === 'ca' ? '✏️ Pràctica avançada — Problemes multi-pas' : '✏️ Práctica avanzada — Problemas multi-paso'}
        </h3>
        <p className="text-emerald-700 leading-relaxed">
          {lang === 'ca'
            ? 'Aquests problemes requereixen diversos passos intermedis abans d\'arribar a aplicar el teorema de Pitàgores. Dóna el resultat amb dos decimals si cal.'
            : 'Estos problemas requieren varios pasos intermedios antes de llegar a aplicar el teorema de Pitágoras. Da el resultado con dos decimales si es necesario.'}
        </p>
      </div>

      {/* Problems grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problems.map((p) => {
          const isChecked = checked[p.id];
          const val = parseFloat(inputs[p.id] || '');
          const isCorrect = !isNaN(val) && Math.abs(val - p.ans) <= p.tol;
          const isFilled = (inputs[p.id] || '') !== '';

          let inputStyle = "border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200";
          if (isChecked && isFilled) {
            inputStyle = isCorrect
              ? "border-green-500 bg-green-50 text-green-900 font-bold"
              : "border-red-300 bg-red-50 text-red-900 font-bold";
          }

          return (
            <div key={p.id} className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col">
              <h5 className="font-bold text-emerald-700 text-base mb-3">
                {p.num}. {p.title[lang]}
              </h5>
              <div className="text-gray-700 text-sm leading-relaxed mb-3 overflow-hidden">
                {p.statement[lang]}
              </div>

              {/* Hint */}
              <details className="mb-4 text-sm">
                <summary className="cursor-pointer text-indigo-600 font-semibold hover:text-indigo-800 select-none">
                  💡 {lang === 'ca' ? 'Pista' : 'Pista'}
                </summary>
                <p className="mt-2 italic text-gray-500 pl-3 border-l-2 border-indigo-200">
                  {p.hint[lang]}
                </p>
              </details>

              {/* Input + check */}
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    step="0.01"
                    className={`border rounded-lg p-2 w-32 transition-colors outline-none ${inputStyle}`}
                    value={inputs[p.id] || ''}
                    onChange={(e) => {
                      setInputs(prev => ({ ...prev, [p.id]: e.target.value }));
                      setChecked(prev => { const n = { ...prev }; delete n[p.id]; return n; });
                    }}
                  />
                  <span className="text-gray-500 text-sm">{p.unit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={!isFilled}
                    onClick={() => checkProblem(p)}
                    className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${
                      isFilled
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {lang === 'ca' ? 'Comprova' : 'Comprobar'}
                  </button>
                  {isChecked && !isCorrect && (
                    <button
                      onClick={() => setShowSteps(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                      className="px-3 py-1.5 rounded-lg font-bold text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                    >
                      {showSteps[p.id]
                        ? (lang === 'ca' ? 'Amaga resolució' : 'Ocultar resolución')
                        : (lang === 'ca' ? 'Veure resolució' : 'Ver resolución')}
                    </button>
                  )}
                </div>
                {isChecked && (
                  <p className={`mt-2 text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {isCorrect
                      ? (lang === 'ca' ? '✓ Correcte!' : '✓ ¡Correcto!')
                      : (lang === 'ca' ? '✗ Revisa el càlcul.' : '✗ Revisa el cálculo.')}
                  </p>
                )}
                {showSteps[p.id] && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">
                      {lang === 'ca' ? 'Resolució pas a pas' : 'Resolución paso a paso'}
                    </p>
                    {p.steps[lang]}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
