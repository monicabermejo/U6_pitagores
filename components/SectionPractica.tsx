import React, { useState } from 'react';
import { Language } from '../types';
import { trackAnswer } from '../utils/trackAnswer';

interface Props {
  lang: Language;
  studentEmail: string;
  sessionId: string;
}

interface RealProblem {
  id: string;
  num: number;
  q: { ca: string; es: string };
  hint?: { ca: string; es: string };
  ans: number;
  unit: string;
  level: 'A' | 'B' | 'C';
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

  const realProblems: RealProblem[] = [
    // ── Nivell A (Fàcil) ──────────────────────────────────────────────
    { id: 'rp_a1', num: 1, level: 'A', unit: 'polzades', ans: 13 / 2.54,
      q: { ca: "Un telèfon d'última generació té una pantalla rectangular que fa 12 cm d'alt i 5 cm d'ample. Quina és la mesura de la seva diagonal en polzades?", es: "Un teléfono de última generación tiene una pantalla rectangular de 12 cm de alto y 5 cm de ancho. ¿Cuál es la medida de su diagonal en pulgadas?" },
      hint: { ca: "Calcula primer la diagonal en cm amb Pitàgores. Després divideix per 2,54 per convertir a polzades.", es: "Calcula primero la diagonal en cm con Pitágoras. Después divide entre 2,54 para convertir a pulgadas." },
    },
    { id: 'rp_a2', num: 2, level: 'A', unit: 'm', ans: 2,
      q: { ca: "Per assegurar una pinya, posem una barra de suport a 1,5 metres de la base del castell. Si la barra fa 2,5 metres de llarg, a quina altura del terra tocarà la barra el tronc del casteller?", es: "Para asegurar una piña, ponemos una barra de soporte a 1,5 metros de la base del castillo. Si la barra mide 2,5 metros de largo, ¿a qué altura del suelo tocará la barra el tronco del casteller?" },
    },
    { id: 'rp_a3', num: 3, level: 'A', unit: 'cm', ans: 8 * Math.SQRT2,
      q: { ca: "Una rajola de xocolata és quadrada i té un costat de 8 cm. Si la tallem exactament per la meitat seguint la diagonal, quina distància recorrerà el ganivet? Dóna el resultat amb dos decimals.", es: "Una tableta de chocolate es cuadrada y tiene un lado de 8 cm. Si la cortamos exactamente por la mitad siguiendo la diagonal, ¿qué distancia recorrerá el cuchillo? Da el resultado con dos decimales." },
    },
    { id: 'rp_a4', num: 4, level: 'A', unit: 'm', ans: Math.sqrt(121 + 5.9536),
      q: { ca: "Una porteria fa 2,44 m d'alt. Un jugador xuta des del punt de penal, però la pilota va directa al travesser. Si el punt de penal està a 11 m de la línia de gol, quina distància ha recorregut la pilota per l'aire? Dóna el resultat amb dos decimals.", es: "Una portería mide 2,44 m de alto. Un jugador chuta desde el punto de penalti, pero el balón va directo al larguero. Si el punto de penalti está a 11 m de la línea de gol, ¿qué distancia ha recorrido el balón por el aire? Da el resultado con dos decimales." },
    },
    { id: 'rp_a5', num: 5, level: 'A', unit: 'cm', ans: 15,
      q: { ca: "D'un triangle rectangle en coneixem la hipotenusa, que mesura 17 cm, i un dels catets, que fa 8 cm. Calcula la mesura de l'altre catet.", es: "De un triángulo rectángulo conocemos la hipotenusa, que mide 17 cm, y uno de los catetos, que mide 8 cm. Calcula la medida del otro cateto." },
    },
    // ── Nivell B (Mitjà) ──────────────────────────────────────────────
    { id: 'rp_b6', num: 6, level: 'B', unit: 'm', ans: 4,
      q: { ca: "La secció frontal d'una cabana és un triangle isòsceles. La teulada (els costats iguals) fa 5 m de llarg i l'amplada de la cabana (la base) és de 6 m. Quina altura té el punt més alt de la cabana?", es: "La sección frontal de una cabaña es un triángulo isósceles. El tejado (los lados iguales) mide 5 m de largo y la anchura de la cabaña (la base) es de 6 m. ¿Qué altura tiene el punto más alto de la cabaña?" },
    },
    { id: 'rp_b7', num: 7, level: 'B', unit: 'm', ans: Math.sqrt(725),
      q: { ca: "Una piscina rectangular fa 25 m de llarg i 10 m d'ample. Un nedador vol anar des d'una cantonada a la cantonada oposada nedant en línia recta. Quants metres nedarà? Arrodoneix a 2 decimals.", es: "Una piscina rectangular mide 25 m de largo y 10 m de ancho. Un nadador quiere ir desde una esquina a la esquina opuesta nadando en línea recta. ¿Cuántos metros nadará? Redondea a 2 decimales." },
    },
    { id: 'rp_b8', num: 8, level: 'B', unit: 'cm', ans: 30 * Math.sqrt(3),
      q: { ca: "Un senyal de trànsit té forma de triangle equilàter de 60 cm de costat. Calcula l'altura del senyal per saber si cap en una caixa de transport determinada. Dóna el resultat amb dos decimals.", es: "Una señal de tráfico tiene forma de triángulo equilátero de 60 cm de lado. Calcula la altura de la señal para saber si cabe en una caja de transporte determinada. Da el resultado con dos decimales." },
    },
    { id: 'rp_b9', num: 9, level: 'B', unit: 'cm', ans: 16,
      q: { ca: "Volem dissenyar una rajola en forma de rombe. Si sabem que el costat del rombe ha de fer 10 cm i una de les diagonals fa 12 cm, quants centímetres farà l'altra diagonal?", es: "Queremos diseñar una baldosa en forma de rombo. Si sabemos que el lado del rombo debe medir 10 cm y una de las diagonales mide 12 cm, ¿cuántos centímetros medirá la otra diagonal?" },
    },
    { id: 'rp_b10', num: 10, level: 'B', unit: 'm', ans: Math.sqrt(544),
      q: { ca: "Volem instal·lar una tirolina que surt d'una torre de 15 m d'alçada i arriba a un pal que fa 3 m d'alt. Si la distància a terra entre la torre i el pal és de 20 m, quina longitud tindrà el cable de la tirolina? Dóna el resultat amb dos decimals.", es: "Queremos instalar una tirolina que sale de una torre de 15 m de altura y llega a un poste de 3 m de alto. Si la distancia al suelo entre la torre y el poste es de 20 m, ¿qué longitud tendrá el cable de la tirolina? Da el resultado con dos decimales." },
    },
    { id: 'rp_b11', num: 11, level: 'B', unit: 'm', ans: 200,
      q: { ca: "Per anar de casa al gimnàs, camines 300 m cap al Nord i després 400 m cap a l'Est. Si decideixes anar en línia recta travessant el parc, quants metres t'estalviaràs en total?", es: "Para ir de casa al gimnasio, caminas 300 m hacia el Norte y después 400 m hacia el Este. Si decides ir en línea recta atravesando el parque, ¿cuántos metros te ahorrarás en total?" },
    },
    // ── Nivell C (Difícil) ────────────────────────────────────────────
    { id: 'rp_c12', num: 12, level: 'C', unit: 'cm', ans: 25 * Math.SQRT2,
      q: { ca: "Tenim una pizza circular que té un diàmetre de 40 cm. Volem saber si cabrà en una caixa quadrada que té una diagonal de 50 cm. Calcula quant fa el costat de la caixa quadrada. Dóna el resultat amb dos decimals.", es: "Tenemos una pizza circular con un diámetro de 40 cm. Queremos saber si cabrá en una caja cuadrada que tiene una diagonal de 50 cm. Calcula cuánto mide el lado de la caja cuadrada. Da el resultado con dos decimales." },
      hint: { ca: "El costat d'un quadrat de diagonal d és: costat = d ÷ √2. Un cop tinguis el costat, compara'l amb el diàmetre de la pizza.", es: "El lado de un cuadrado de diagonal d es: lado = d ÷ √2. Una vez tengas el lado, compáralo con el diámetro de la pizza." },
    },
    { id: 'rp_c13', num: 13, level: 'C', unit: 'm²', ans: 28,
      q: { ca: "Una paret té forma de trapezi isòsceles. La base inferior fa 10 m, la superior fa 4 m i els costats inclinats fan 5 m. Calcula l'àrea de la paret. Recorda: primer has de trobar l'altura utilitzant Pitàgores.", es: "Una pared tiene forma de trapecio isósceles. La base inferior mide 10 m, la superior mide 4 m y los lados inclinados miden 5 m. Calcula el área de la pared. Recuerda: primero debes encontrar la altura usando Pitágoras." },
      hint: { ca: "El voladís horitzontal de cada costat = (base_inf − base_sup) ÷ 2 = 3 m. Usa Pitàgores amb hipotenusa=5 i catet=3 per trobar l'alçada.", es: "El vuelo horizontal de cada lado = (base_inf − base_sup) ÷ 2 = 3 m. Usa Pitágoras con hipotenusa=5 y cateto=3 para encontrar la altura." },
    },
    { id: 'rp_c14', num: 14, level: 'C', unit: 'm', ans: Math.sqrt(6.5),
      q: { ca: "Un armari fa 2 m d'alt, 1,5 m d'ample i 0,5 m de fons. Quina és la distància entre la cantonada inferior esquerra de davant i la cantonada superior dreta del fons (la diagonal interna)? Dóna el resultat amb dos decimals.", es: "Un armario mide 2 m de alto, 1,5 m de ancho y 0,5 m de fondo. ¿Cuál es la distancia entre la esquina inferior izquierda de delante y la esquina superior derecha del fondo (la diagonal interna)? Da el resultado con dos decimales." },
    },
    { id: 'rp_c15', num: 15, level: 'C', unit: 'km', ans: 50,
      q: { ca: "Dos vaixells surten del mateix port a les 10:00 h en direccions perpendiculars. El vaixell A va cap al Nord a 15 km/h i el vaixell B va cap a l'Est a 20 km/h. Quina distància en línia recta els separarà quan siguin les 12:00 h?", es: "Dos barcos salen del mismo puerto a las 10:00 h en direcciones perpendiculares. El barco A va hacia el Norte a 15 km/h y el barco B va hacia el Este a 20 km/h. ¿Qué distancia en línea recta los separará cuando sean las 12:00 h?" },
    },
    { id: 'rp_c16', num: 16, level: 'C', unit: 'm', ans: Math.sqrt(16 + 4.84),
      q: { ca: "Un noi d'1,70 m d'alçada està dret sobre un banc de 50 cm d'alt. Si el sol projecta una ombra que acaba exactament a 4 m de la base del banc, quina distància hi ha entre el cap del noi i la punta de l'ombra? Dóna el resultat amb dos decimals.", es: "Un chico de 1,70 m de altura está de pie sobre un banco de 50 cm de alto. Si el sol proyecta una sombra que acaba exactamente a 4 m de la base del banco, ¿qué distancia hay entre la cabeza del chico y la punta de la sombra? Da el resultado con dos decimales." },
    },
  ];


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
        ca: "El triangle isòsceles: de l'àrea al perímetre",
        es: "El triángulo isósceles: del área al perímetro",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 160 140" width="130" height="113" className="float-right ml-3 mb-2">
            <polygon points="80,10 150,120 10,120" fill="#fce7f3" stroke="#9333ea" strokeWidth="2"/>
            {/* alçada */}
            <line x1="80" y1="10" x2="80" y2="120" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4,3"/>
            <rect x="80" y="112" width="8" height="8" fill="none" stroke="#2563eb" strokeWidth="1.2"/>
            {/* base */}
            <line x1="10" y1="128" x2="150" y2="128" stroke="#9333ea" strokeWidth="1.5"/>
            <text x="80" y="138" textAnchor="middle" fill="#9333ea" fontSize="11" fontWeight="bold">16 cm</text>
            {/* àrea */}
            <text x="80" y="78" textAnchor="middle" fill="#374151" fontSize="10">Àrea = 48 cm²</text>
            {/* costat igual */}
            <text x="28" y="68" fill="#ca8a04" fontSize="10" fontWeight="bold">?</text>
          </svg>
          Un triangle isòsceles té una <strong>base de 16 cm</strong> i una <strong>àrea de 48 cm²</strong>. Calcula el seu <strong>perímetre total</strong>.
        </>),
        es: (<>
          <svg viewBox="0 0 160 140" width="130" height="113" className="float-right ml-3 mb-2">
            <polygon points="80,10 150,120 10,120" fill="#fce7f3" stroke="#9333ea" strokeWidth="2"/>
            <line x1="80" y1="10" x2="80" y2="120" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4,3"/>
            <rect x="80" y="112" width="8" height="8" fill="none" stroke="#2563eb" strokeWidth="1.2"/>
            <line x1="10" y1="128" x2="150" y2="128" stroke="#9333ea" strokeWidth="1.5"/>
            <text x="80" y="138" textAnchor="middle" fill="#9333ea" fontSize="11" fontWeight="bold">16 cm</text>
            <text x="80" y="78" textAnchor="middle" fill="#374151" fontSize="10">Área = 48 cm²</text>
            <text x="28" y="68" fill="#ca8a04" fontSize="10" fontWeight="bold">?</text>
          </svg>
          Un triángulo isósceles tiene una <strong>base de 16 cm</strong> y un <strong>área de 48 cm²</strong>. Calcula su <strong>perímetro total</strong>.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Àrea = (base × alçada) / 2 → 48 = (16 × h) / 2 → h = <strong>6 cm</strong></li>
          <li>Semi-base = 16 / 2 = <strong>8 cm</strong></li>
          <li>Pitàgores: costat igual = √(8² + 6²) = √(64 + 36) = √100 = <strong>10 cm</strong></li>
          <li>Perímetre = base + 2 × costat = 16 + 2 × 10 = <strong>36 cm</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Área = (base × altura) / 2 → 48 = (16 × h) / 2 → h = <strong>6 cm</strong></li>
          <li>Semibasse = 16 / 2 = <strong>8 cm</strong></li>
          <li>Pitágoras: lado igual = √(8² + 6²) = √(64 + 36) = √100 = <strong>10 cm</strong></li>
          <li>Perímetro = base + 2 × lado = 16 + 2 × 10 = <strong>36 cm</strong></li>
        </ol>),
      },
      hint: {
        ca: "Primer calcula l'alçada a partir de l'àrea. Després usa Pitàgores amb la semi-base i l'alçada per trobar el costat igual.",
        es: "Primero calcula la altura a partir del área. Después usa Pitágoras con la semibase y la altura para encontrar el lado igual.",
      },
      unit: "cm", ans: 36, tol: 0.05,
    },
    {
      id: 'p2', num: 2,
      title: {
        ca: "El senyal de trànsit (octàgon regular)",
        es: "La señal de tráfico (octágono regular)",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 180 180" width="130" height="130" className="float-right ml-3 mb-2">
            <rect x="10" y="10" width="160" height="160" fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,3"/>
            <polygon points="57,10 123,10 170,57 170,123 123,170 57,170 10,123 10,57"
              fill="#fee2e2" stroke="#dc2626" strokeWidth="2"/>
            <text x="90" y="100" textAnchor="middle" fill="#dc2626" fontSize="18" fontWeight="bold">STOP</text>
            <text x="90" y="22" textAnchor="middle" fill="#374151" fontSize="10">20 cm</text>
            <line x1="4" y1="10" x2="4" y2="170" stroke="#2563eb" strokeWidth="1.5"/>
            <text x="8" y="94" fill="#2563eb" fontSize="11" fontWeight="bold">?</text>
          </svg>
          Un senyal de "STOP" té forma d'<strong>octàgon regular amb costat de 20 cm</strong>. Per fabricar el suport, cal saber la <strong>distància vertical entre dos costats paral·lels</strong> (l'apotema doble). Dóna el resultat amb dos decimals.
        </>),
        es: (<>
          <svg viewBox="0 0 180 180" width="130" height="130" className="float-right ml-3 mb-2">
            <rect x="10" y="10" width="160" height="160" fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,3"/>
            <polygon points="57,10 123,10 170,57 170,123 123,170 57,170 10,123 10,57"
              fill="#fee2e2" stroke="#dc2626" strokeWidth="2"/>
            <text x="90" y="100" textAnchor="middle" fill="#dc2626" fontSize="18" fontWeight="bold">STOP</text>
            <text x="90" y="22" textAnchor="middle" fill="#374151" fontSize="10">20 cm</text>
            <line x1="4" y1="10" x2="4" y2="170" stroke="#2563eb" strokeWidth="1.5"/>
            <text x="8" y="94" fill="#2563eb" fontSize="11" fontWeight="bold">?</text>
          </svg>
          Una señal de "STOP" tiene forma de <strong>octágono regular con lado 20 cm</strong>. Para fabricar el soporte, necesitamos la <strong>distancia vertical entre dos lados paralelos</strong> (la apotema doble). Da el resultado con dos decimales.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Inscrivim l'octàgon en un quadrat: als 4 vèrtexs es formen triangles rectangles isòsceles.</li>
          <li>La hipotenusa de cada triangle = costat de l'octàgon = <strong>20 cm</strong></li>
          <li>Pitàgores (isòsceles: catets iguals): catet = 20 ÷ √2 = 10√2 ≈ <strong>14,14 cm</strong></li>
          <li>Costat del quadrat = 20 + 2 × 14,14 ≈ <strong>48,28 cm</strong></li>
          <li>Apotema doble = costat del quadrat ≈ <strong>48,28 cm</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Inscribimos el octágono en un cuadrado: en los 4 vértices se forman triángulos rectángulos isósceles.</li>
          <li>La hipotenusa de cada triángulo = lado del octágono = <strong>20 cm</strong></li>
          <li>Pitágoras (isósceles: catetos iguales): cateto = 20 ÷ √2 = 10√2 ≈ <strong>14,14 cm</strong></li>
          <li>Lado del cuadrado = 20 + 2 × 14,14 ≈ <strong>48,28 cm</strong></li>
          <li>Apotema doble = lado del cuadrado ≈ <strong>48,28 cm</strong></li>
        </ol>),
      },
      hint: {
        ca: "Inscriu l'octàgon en un quadrat. Als vèrtexs del quadrat es formen triangles rectangles isòsceles: la seva hipotenusa és el costat de l'octàgon (20 cm).",
        es: "Inscribe el octágono en un cuadrado. En los vértices del cuadrado se forman triángulos rectángulos isósceles: su hipotenusa es el lado del octágono (20 cm).",
      },
      unit: "cm", ans: 20 * (1 + Math.SQRT2), tol: 0.15,
    },
    {
      id: 'p3', num: 3,
      title: {
        ca: "L'escala a la cantonada",
        es: "La escalera en la esquina",
      },
      statement: {
        ca: (<>
          Una escala de <strong>5 metres de llargada</strong> està recolzada en una paret. El peu de l'escala és a <strong>1,5 m de la paret</strong>. Si l'escala rellisca i el peu s'allunya <strong>0,5 m més</strong>, quants <strong>centímetres</strong> baixarà l'extrem superior de l'escala? Dóna el resultat amb dos decimals.
        </>),
        es: (<>
          Una escalera de <strong>5 metros de largo</strong> está apoyada en una pared. El pie está a <strong>1,5 m de la pared</strong>. Si la escalera resbala y el pie se aleja <strong>0,5 m más</strong>, ¿cuántos <strong>centímetros</strong> bajará el extremo superior? Da el resultado con dos decimales.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Alçada inicial: h₁ = √(5² − 1,5²) = √(25 − 2,25) = √22,75 ≈ <strong>4,770 m</strong></li>
          <li>Peu nou: 1,5 + 0,5 = <strong>2,0 m</strong></li>
          <li>Alçada final: h₂ = √(5² − 2²) = √(25 − 4) = √21 ≈ <strong>4,583 m</strong></li>
          <li>Baixada = h₁ − h₂ ≈ 4,770 − 4,583 = 0,187 m = <strong>≈ 18,71 cm</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Altura inicial: h₁ = √(5² − 1,5²) = √(25 − 2,25) = √22,75 ≈ <strong>4,770 m</strong></li>
          <li>Pie nuevo: 1,5 + 0,5 = <strong>2,0 m</strong></li>
          <li>Altura final: h₂ = √(5² − 2²) = √(25 − 4) = √21 ≈ <strong>4,583 m</strong></li>
          <li>Bajada = h₁ − h₂ ≈ 4,770 − 4,583 = 0,187 m = <strong>≈ 18,71 cm</strong></li>
        </ol>),
      },
      hint: {
        ca: "Calcula l'alçada inicial amb Pitàgores (escala=hipotenusa, peu=catet). Fes el mateix amb el peu nou. La diferència, en metres, convertida a centímetres, és la resposta.",
        es: "Calcula la altura inicial con Pitágoras (escalera=hipotenusa, pie=cateto). Haz lo mismo con el pie nuevo. La diferencia, en metros, convertida a centímetros, es la respuesta.",
      },
      unit: "cm", ans: (Math.sqrt(22.75) - Math.sqrt(21)) * 100, tol: 0.5,
    },
    {
      id: 'p4', num: 4,
      title: {
        ca: "El logotip del romboide",
        es: "El logotipo del romboide",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 180 140" width="140" height="108" className="float-right ml-3 mb-2">
            {/* paral·lelogram inclinat estil logotip de gelats */}
            <polygon points="45,110 145,110 135,30 35,30" fill="#fde68a" stroke="#d97706" strokeWidth="2.5"/>
            {/* franja de color interna decorativa */}
            <polygon points="55,110 95,110 85,30 45,30" fill="#fbbf24" opacity="0.5"/>
            {/* text marca */}
            <text x="90" y="76" textAnchor="middle" fill="#92400e" fontSize="13" fontWeight="bold" fontStyle="italic" fontFamily="Georgia, serif">Gela</text>
            <text x="90" y="94" textAnchor="middle" fill="#92400e" fontSize="10" fontFamily="Georgia, serif" letterSpacing="3">★ ★ ★</text>
            {/* punt de gelat a dalt */}
            <ellipse cx="140" cy="26" rx="9" ry="9" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.5"/>
            <ellipse cx="128" cy="20" rx="8" ry="8" fill="#fde68a" stroke="#d97706" strokeWidth="1.5"/>
            <ellipse cx="152" cy="20" rx="8" ry="8" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5"/>
          </svg>
          Una empresa de gelats vol crear un logotip en forma de <strong>paral·lelogram</strong>. Els costats fan <strong>10 cm i 17 cm</strong>. L'alçada traçada fins al costat de 17 cm crea un segment de <strong>6 cm</strong> dins d'aquell costat. Calcula l'<strong>àrea total</strong> del logotip.
        </>),
        es: (<>
          <svg viewBox="0 0 180 140" width="140" height="108" className="float-right ml-3 mb-2">
            <polygon points="45,110 145,110 135,30 35,30" fill="#fde68a" stroke="#d97706" strokeWidth="2.5"/>
            <polygon points="55,110 95,110 85,30 45,30" fill="#fbbf24" opacity="0.5"/>
            <text x="90" y="76" textAnchor="middle" fill="#92400e" fontSize="13" fontWeight="bold" fontStyle="italic" fontFamily="Georgia, serif">Gela</text>
            <text x="90" y="94" textAnchor="middle" fill="#92400e" fontSize="10" fontFamily="Georgia, serif" letterSpacing="3">★ ★ ★</text>
            <ellipse cx="140" cy="26" rx="9" ry="9" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.5"/>
            <ellipse cx="128" cy="20" rx="8" ry="8" fill="#fde68a" stroke="#d97706" strokeWidth="1.5"/>
            <ellipse cx="152" cy="20" rx="8" ry="8" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5"/>
          </svg>
          Una empresa de helados quiere crear un logotipo en forma de <strong>paralelogramo</strong>. Los lados miden <strong>10 cm y 17 cm</strong>. La altura trazada hasta el lado de 17 cm crea un segmento de <strong>6 cm</strong> dentro de ese lado. Calcula el <strong>área total</strong> del logotipo.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>El triangle rectangle format té hipotenusa = costat obliquo = <strong>10 cm</strong></li>
          <li>Un catet és el segment de <strong>6 cm</strong></li>
          <li>Pitàgores: alçada = √(10² − 6²) = √(100 − 36) = √64 = <strong>8 cm</strong></li>
          <li>Àrea = base × alçada = 17 × 8 = <strong>136 cm²</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>El triángulo rectángulo formado tiene hipotenusa = lado oblicuo = <strong>10 cm</strong></li>
          <li>Un cateto es el segmento de <strong>6 cm</strong></li>
          <li>Pitágoras: altura = √(10² − 6²) = √(100 − 36) = √64 = <strong>8 cm</strong></li>
          <li>Área = base × altura = 17 × 8 = <strong>136 cm²</strong></li>
        </ol>),
      },
      hint: {
        ca: "El costat obliquo (10 cm) és la hipotenusa d'un triangle rectangle. El segment de 6 cm és un catet. Pitàgores et donarà l'alçada del paral·lelogram.",
        es: "El lado oblicuo (10 cm) es la hipotenusa de un triángulo rectángulo. El segmento de 6 cm es un cateto. Pitágoras te dará la altura del paralelogramo.",
      },
      unit: "cm²", ans: 136, tol: 0.05,
    },
    {
      id: 'p5', num: 5,
      title: {
        ca: "La tenda de campanya",
        es: "La tienda de campaña",
      },
      statement: {
        ca: (<>
          Una tenda de campanya té forma de <strong>piràmide de base quadrada</strong>. El costat de la base fa <strong>2,4 m</strong> i l'alçada central fa <strong>1,6 m</strong>. Quants metres farà l'<strong>aresta lateral</strong> (des del vèrtex superior fins a una cantonada de la base)? Dóna el resultat amb dos decimals.
        </>),
        es: (<>
          Una tienda de campaña tiene forma de <strong>pirámide de base cuadrada</strong>. El lado de la base mide <strong>2,4 m</strong> y la altura central mide <strong>1,6 m</strong>. ¿Cuántos metros mide la <strong>aresta lateral</strong> (desde el vértice superior hasta una esquina de la base)? Da el resultado con dos decimales.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>La diagonal de la base = √(2,4² + 2,4²) = 2,4√2 ≈ <strong>3,394 m</strong></li>
          <li>La semidiagonal = 3,394 ÷ 2 ≈ <strong>1,697 m</strong></li>
          <li>L'aresta lateral és la hipotenusa del triangle rectangle format per l'alçada i la semidiagonal</li>
          <li>Pitàgores: aresta = √(1,6² + 1,697²) = √(2,56 + 2,88) = √5,44 ≈ <strong>2,33 m</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>La diagonal de la base = √(2,4² + 2,4²) = 2,4√2 ≈ <strong>3,394 m</strong></li>
          <li>La semidiagonal = 3,394 ÷ 2 ≈ <strong>1,697 m</strong></li>
          <li>La aresta lateral es la hipotenusa del triángulo rectángulo formado por la altura y la semidiagonal</li>
          <li>Pitágoras: aresta = √(1,6² + 1,697²) = √(2,56 + 2,88) = √5,44 ≈ <strong>2,33 m</strong></li>
        </ol>),
      },
      hint: {
        ca: "Aplica Pitàgores dues vegades: primer la diagonal de la base quadrada, després usa la semidiagonal com a catet per trobar l'aresta lateral.",
        es: "Aplica Pitágoras dos veces: primero la diagonal de la base cuadrada, después usa la semidiagonal como cateto para encontrar la aresta lateral.",
      },
      unit: "m", ans: Math.sqrt(5.44), tol: 0.05,
    },
    {
      id: 'p6', num: 6,
      title: {
        ca: "El túnel de la via del tren",
        es: "El túnel de la vía del tren",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 180 125" width="140" height="97" className="float-right ml-3 mb-2">
            <path d="M 10,115 A 80,80 0 0,1 170,115" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2"/>
            <line x1="10" y1="115" x2="170" y2="115" stroke="#374151" strokeWidth="2"/>
            <rect x="66" y="75" width="48" height="40" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
            <line x1="90" y1="115" x2="90" y2="35" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3"/>
            <text x="94" y="78" fill="#dc2626" fontSize="10">r=5m</text>
            <line x1="90" y1="120" x2="66" y2="120" stroke="#7c3aed" strokeWidth="1.5"/>
            <text x="68" y="130" fill="#7c3aed" fontSize="9">1,5m</text>
            <line x1="60" y1="75" x2="60" y2="115" stroke="#16a34a" strokeWidth="1.5"/>
            <text x="44" y="98" fill="#16a34a" fontSize="11" fontWeight="bold">?</text>
          </svg>
          Un túnel té forma de <strong>semicercle de radi 5 m</strong>. Un camió de <strong>3 m d'amplada</strong> vol passar exactament pel mig. Quina és l'<strong>alçada màxima</strong> que pot tenir el camió per no tocar la part superior? Dóna el resultat amb dos decimals.
        </>),
        es: (<>
          <svg viewBox="0 0 180 125" width="140" height="97" className="float-right ml-3 mb-2">
            <path d="M 10,115 A 80,80 0 0,1 170,115" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2"/>
            <line x1="10" y1="115" x2="170" y2="115" stroke="#374151" strokeWidth="2"/>
            <rect x="66" y="75" width="48" height="40" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
            <line x1="90" y1="115" x2="90" y2="35" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3"/>
            <text x="94" y="78" fill="#dc2626" fontSize="10">r=5m</text>
            <line x1="90" y1="120" x2="66" y2="120" stroke="#7c3aed" strokeWidth="1.5"/>
            <text x="68" y="130" fill="#7c3aed" fontSize="9">1,5m</text>
            <line x1="60" y1="75" x2="60" y2="115" stroke="#16a34a" strokeWidth="1.5"/>
            <text x="44" y="98" fill="#16a34a" fontSize="11" fontWeight="bold">?</text>
          </svg>
          Un túnel tiene forma de <strong>semicírculo de radio 5 m</strong>. Un camión de <strong>3 m de ancho</strong> quiere pasar exactamente por el centro. ¿Cuál es la <strong>altura máxima</strong> que puede tener el camión para no tocar la parte superior? Da el resultado con dos decimales.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>El camió passa pel mig: cada costat queda a 3 ÷ 2 = <strong>1,5 m del centre</strong></li>
          <li>El punt crític és la cantonada superior del camió, a 1,5 m del centre</li>
          <li>Pitàgores (radi=hipotenusa): alçada = √(r² − x²) = √(5² − 1,5²)</li>
          <li>= √(25 − 2,25) = √22,75 ≈ <strong>4,77 m</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>El camión pasa por el centro: cada lado queda a 3 ÷ 2 = <strong>1,5 m del centro</strong></li>
          <li>El punto crítico es la esquina superior del camión, a 1,5 m del centro</li>
          <li>Pitágoras (radio=hipotenusa): altura = √(r² − x²) = √(5² − 1,5²)</li>
          <li>= √(25 − 2,25) = √22,75 ≈ <strong>4,77 m</strong></li>
        </ol>),
      },
      hint: {
        ca: "El camió passa pel mig: el seu mig queda a 1,5 m del centre. El radi (5 m) és la hipotenusa, la semiplada (1,5 m) és un catet. L'alçada és l'altre catet.",
        es: "El camión pasa por el centro: su mitad queda a 1,5 m del centro. El radio (5 m) es la hipotenusa, la semianchura (1,5 m) es un cateto. La altura es el otro cateto.",
      },
      unit: "m", ans: Math.sqrt(22.75), tol: 0.05,
    },
    {
      id: 'p7', num: 7,
      title: {
        ca: "El pentàgon i la corda de piano",
        es: "El pentágono y la cuerda de piano",
      },
      statement: {
        ca: (<>
          En un <strong>cercle de radi 10 cm</strong> hi dibuixem un <strong>pentàgon regular</strong>. L'<strong>apotema</strong> (distància del centre al mig d'un costat) fa aproximadament <strong>8,1 cm</strong>. Calcula la longitud de cada <strong>costat del pentàgon</strong>. Dóna el resultat amb dos decimals.
        </>),
        es: (<>
          En un <strong>círculo de radio 10 cm</strong> dibujamos un <strong>pentágono regular</strong>. La <strong>apotema</strong> (distancia del centro al centro de un lado) mide aproximadamente <strong>8,1 cm</strong>. Calcula la longitud de cada <strong>lado del pentágono</strong>. Da el resultado con dos decimales.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>L'apotema (8,1 cm) i la semibbase formen un triangle rectangle amb el radi (10 cm)</li>
          <li>Pitàgores: (costat/2)² = r² − apotema² = 10² − 8,1² = 100 − 65,61 = 34,39</li>
          <li>costat/2 = √34,39 ≈ <strong>5,865 cm</strong></li>
          <li>Costat = 2 × 5,865 ≈ <strong>11,73 cm</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>La apotema (8,1 cm) y la semibase forman un triángulo rectángulo con el radio (10 cm)</li>
          <li>Pitágoras: (lado/2)² = r² − apotema² = 10² − 8,1² = 100 − 65,61 = 34,39</li>
          <li>lado/2 = √34,39 ≈ <strong>5,865 cm</strong></li>
          <li>Lado = 2 × 5,865 ≈ <strong>11,73 cm</strong></li>
        </ol>),
      },
      hint: {
        ca: "L'apotema va del centre al mig d'un costat. El radi va del centre a un vèrtex. Junts formen un triangle rectangle: aplica Pitàgores per trobar la semibbase i dobla-la.",
        es: "La apotema va del centro al centro de un lado. El radio va del centro a un vértice. Juntos forman un triángulo rectángulo: aplica Pitágoras para encontrar la semibase y duplícala.",
      },
      unit: "cm", ans: 2 * Math.sqrt(100 - 8.1 * 8.1), tol: 0.15,
    },
    {
      id: 'p8', num: 8,
      title: {
        ca: "La piràmide truncada (el test de flors)",
        es: "La pirámide truncada (el tiesto de flores)",
      },
      statement: {
        ca: (<>
          Un test de flors té forma de <strong>piràmide truncada de base quadrada</strong>. La base superior fa <strong>20 cm de costat</strong>, la base inferior fa <strong>10 cm de costat</strong> i l'<strong>alçada del test és 24 cm</strong>. Calcula la longitud de l'<strong>apotema de la cara lateral</strong> (la slant height de la cara trapezoïdal). Dóna el resultat amb dos decimals.
        </>),
        es: (<>
          Un tiesto de flores tiene forma de <strong>pirámide truncada de base cuadrada</strong>. La base superior mide <strong>20 cm de lado</strong>, la base inferior <strong>10 cm de lado</strong> y la <strong>altura del tiesto es 24 cm</strong>. Calcula la longitud de la <strong>apotema de la cara lateral</strong> (la slant height de la cara trapezoidal). Da el resultado con dos decimales.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Diferència de semi-costats: (20 − 10) ÷ 2 = <strong>5 cm</strong> (voladís horitzontal)</li>
          <li>Si talles verticalment la cara, veus un triangle rectangle: un catet és l'alçada (24 cm) i l'altre és el voladís (5 cm)</li>
          <li>Pitàgores: slant = √(24² + 5²) = √(576 + 25) = √601 ≈ <strong>24,52 cm</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Diferencia de semilados: (20 − 10) ÷ 2 = <strong>5 cm</strong> (vuelo horizontal)</li>
          <li>Si cortas verticalmente la cara, ves un triángulo rectángulo: un cateto es la altura (24 cm) y el otro es el vuelo (5 cm)</li>
          <li>Pitágoras: slant = √(24² + 5²) = √(576 + 25) = √601 ≈ <strong>24,52 cm</strong></li>
        </ol>),
      },
      hint: {
        ca: "Talla el test verticalment per la meitat d'una cara. Veuràs un triangle rectangle: els catets són l'alçada (24 cm) i la diferència de semi-costats ((20−10)÷2 = 5 cm).",
        es: "Corta el tiesto verticalmente por la mitad de una cara. Verás un triángulo rectángulo: los catetos son la altura (24 cm) y la diferencia de semilados ((20−10)÷2 = 5 cm).",
      },
      unit: "cm", ans: Math.sqrt(601), tol: 0.12,
    },
    {
      id: 'p9', num: 9,
      title: {
        ca: "El rectangle dins del cercle",
        es: "El rectángulo dentro del círculo",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 180 180" width="130" height="130" className="float-right ml-3 mb-2">
            <circle cx="90" cy="90" r="70" fill="#eff6ff" stroke="#2563eb" strokeWidth="2"/>
            <rect x="34" y="48" width="112" height="84" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2"/>
            <line x1="34" y1="48" x2="146" y2="132" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5,3"/>
            <text x="82" y="98" fill="#dc2626" fontSize="9">∅=50cm</text>
            <text x="90" y="143" textAnchor="middle" fill="#1d4ed8" fontSize="10">40 cm</text>
            <text x="12" y="95" fill="#16a34a" fontSize="11" fontWeight="bold">?</text>
          </svg>
          Tenim una <strong>planxa de fusta circular de 50 cm de diàmetre</strong>. Volem tallar-ne el <strong>rectangle més gran possible</strong> amb una base de <strong>40 cm</strong>. Tingues en compte que, per fer-lo el més gran possible, el diàmetre del cercle ha de ser la diagonal del rectangle. Quina serà l'<strong>alçada</strong> d'aquest rectangle?
        </>),
        es: (<>
          <svg viewBox="0 0 180 180" width="130" height="130" className="float-right ml-3 mb-2">
            <circle cx="90" cy="90" r="70" fill="#eff6ff" stroke="#2563eb" strokeWidth="2"/>
            <rect x="34" y="48" width="112" height="84" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2"/>
            <line x1="34" y1="48" x2="146" y2="132" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5,3"/>
            <text x="82" y="98" fill="#dc2626" fontSize="9">∅=50cm</text>
            <text x="90" y="143" textAnchor="middle" fill="#1d4ed8" fontSize="10">40 cm</text>
            <text x="12" y="95" fill="#16a34a" fontSize="11" fontWeight="bold">?</text>
          </svg>
          Tenemos una <strong>plancha de madera circular de 50 cm de diámetro</strong>. Queremos cortar el <strong>rectángulo más grande posible</strong> con una base de <strong>40 cm</strong>. Ten en cuenta que, para hacerlo lo más grande posible, el diámetro del círculo debe ser la diagonal del rectángulo. ¿Cuál será la <strong>altura</strong> de este rectángulo?
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Diagonal del rectangle = diàmetre = <strong>50 cm</strong></li>
          <li>La diagonal és la hipotenusa del triangle rectangle format pels costats</li>
          <li>Pitàgores: alçada² = 50² − 40² = 2500 − 1600 = <strong>900</strong></li>
          <li>Alçada = √900 = <strong>30 cm</strong></li>
          <li>(Àrea fusta perduda = π×25² − 40×30 ≈ 1963,5 − 1200 ≈ <strong>763,5 cm²</strong>)</li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Diagonal del rectángulo = diámetro = <strong>50 cm</strong></li>
          <li>La diagonal es la hipotenusa del triángulo rectángulo formado por los lados</li>
          <li>Pitágoras: altura² = 50² − 40² = 2500 − 1600 = <strong>900</strong></li>
          <li>Altura = √900 = <strong>30 cm</strong></li>
          <li>(Área de madera perdida = π×25² − 40×30 ≈ 1963,5 − 1200 ≈ <strong>763,5 cm²</strong>)</li>
        </ol>),
      },
      hint: {
        ca: "La diagonal del rectangle = diàmetre del cercle = 50 cm. Ara aplica Pitàgores per trobar l'alçada a partir de la diagonal i la base.",
        es: "La diagonal del rectángulo = diámetro del círculo = 50 cm. Ahora aplica Pitágoras para encontrar la altura a partir de la diagonal y la base.",
      },
      unit: "cm", ans: 30, tol: 0.05,
    },
    {
      id: 'p10', num: 10,
      title: {
        ca: "La distància entre pobles",
        es: "La distancia entre pueblos",
      },
      statement: {
        ca: (<>
          <svg viewBox="0 0 180 180" width="130" height="130" className="float-right ml-3 mb-2">
            <line x1="90" y1="10" x2="90" y2="170" stroke="#d1d5db" strokeWidth="1"/>
            <line x1="10" y1="90" x2="170" y2="90" stroke="#d1d5db" strokeWidth="1"/>
            <text x="93" y="14" fill="#6b7280" fontSize="8">N</text>
            <text x="93" y="172" fill="#6b7280" fontSize="8">S</text>
            <text x="160" y="88" fill="#6b7280" fontSize="8">E</text>
            <text x="12" y="88" fill="#6b7280" fontSize="8">O</text>
            <circle cx="90" cy="90" r="4" fill="#374151"/>
            <text x="94" y="89" fill="#374151" fontSize="9">Torre</text>
            <circle cx="115" cy="30" r="5" fill="#2563eb"/>
            <text x="119" y="29" fill="#2563eb" fontSize="9">A</text>
            <circle cx="55" cy="110" r="5" fill="#dc2626"/>
            <text x="59" y="109" fill="#dc2626" fontSize="9">B</text>
            <line x1="115" y1="30" x2="55" y2="110" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="5,3"/>
            <text x="72" y="67" fill="#7c3aed" fontSize="11" fontWeight="bold">?</text>
          </svg>
          El poble A està a <strong>12 km al Nord i 5 km a l'Est</strong> d'una torre. El poble B està a <strong>4 km al Sud i 7 km a l'Oest</strong> de la mateixa torre. Quina és la <strong>distància en línia recta</strong> entre el poble A i el poble B?
        </>),
        es: (<>
          <svg viewBox="0 0 180 180" width="130" height="130" className="float-right ml-3 mb-2">
            <line x1="90" y1="10" x2="90" y2="170" stroke="#d1d5db" strokeWidth="1"/>
            <line x1="10" y1="90" x2="170" y2="90" stroke="#d1d5db" strokeWidth="1"/>
            <text x="93" y="14" fill="#6b7280" fontSize="8">N</text>
            <text x="93" y="172" fill="#6b7280" fontSize="8">S</text>
            <text x="160" y="88" fill="#6b7280" fontSize="8">E</text>
            <text x="12" y="88" fill="#6b7280" fontSize="8">O</text>
            <circle cx="90" cy="90" r="4" fill="#374151"/>
            <text x="94" y="89" fill="#374151" fontSize="9">Torre</text>
            <circle cx="115" cy="30" r="5" fill="#2563eb"/>
            <text x="119" y="29" fill="#2563eb" fontSize="9">A</text>
            <circle cx="55" cy="110" r="5" fill="#dc2626"/>
            <text x="59" y="109" fill="#dc2626" fontSize="9">B</text>
            <line x1="115" y1="30" x2="55" y2="110" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="5,3"/>
            <text x="72" y="67" fill="#7c3aed" fontSize="11" fontWeight="bold">?</text>
          </svg>
          El pueblo A está a <strong>12 km al Norte y 5 km al Este</strong> de una torre. El pueblo B está a <strong>4 km al Sur y 7 km al Oeste</strong> de la misma torre. ¿Cuál es la <strong>distancia en línea recta</strong> entre el pueblo A y el pueblo B?
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Coordenades A (torre=origen): (+5, +12) km</li>
          <li>Coordenades B: (−7, −4) km</li>
          <li>Diferència horitzontal (Est-Oest): 5 − (−7) = <strong>12 km</strong></li>
          <li>Diferència vertical (Nord-Sud): 12 − (−4) = <strong>16 km</strong></li>
          <li>Pitàgores: d = √(12² + 16²) = √(144 + 256) = √400 = <strong>20 km</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Coordenadas A (torre=origen): (+5, +12) km</li>
          <li>Coordenadas B: (−7, −4) km</li>
          <li>Diferencia horizontal (Este-Oeste): 5 − (−7) = <strong>12 km</strong></li>
          <li>Diferencia vertical (Norte-Sur): 12 − (−4) = <strong>16 km</strong></li>
          <li>Pitágoras: d = √(12² + 16²) = √(144 + 256) = √400 = <strong>20 km</strong></li>
        </ol>),
      },
      hint: {
        ca: "Calcula la diferència de coordenades en horitzontal (Est-Oest) i en vertical (Nord-Sud) entre A i B. Aquests valors seran els catets del triangle rectangle.",
        es: "Calcula la diferencia de coordenadas en horizontal (Este-Oeste) y en vertical (Norte-Sur) entre A y B. Estos valores serán los catetos del triángulo rectángulo.",
      },
      unit: "km", ans: 20, tol: 0.05,
    },
    {
      id: 'p11', num: 11,
      title: {
        ca: "La caixa de varetes",
        es: "La caja de varetas",
      },
      statement: {
        ca: (<>
          Una caixa de sabates fa <strong>24 cm de llarg, 10 cm d'ample i 8 cm d'alt</strong>. Volem guardar-hi una vareta metàl·lica que va d'una cantonada inferior a la cantonada superior oposada (la <strong>diagonal del cos</strong>). Quina és la seva <strong>longitud màxima</strong>? Dóna el resultat amb dos decimals.
        </>),
        es: (<>
          Una caja de zapatos mide <strong>24 cm de largo, 10 cm de ancho y 8 cm de alto</strong>. Queremos guardar una vareta metálica que va de una esquina inferior a la esquina superior opuesta (la <strong>diagonal del cuerpo</strong>). ¿Cuál es su <strong>longitud máxima</strong>? Da el resultado con dos decimales.
        </>),
      },
      steps: {
        ca: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Primer: diagonal de la base = √(24² + 10²) = √(576 + 100) = √676 = <strong>26 cm</strong></li>
          <li>Ara apliquem Pitàgores en 3D: la diagonal de la base (26 cm) és un catet, l'alçada (8 cm) és l'altre</li>
          <li>Diagonal del cos = √(26² + 8²) = √(676 + 64) = √740 ≈ <strong>27,20 cm</strong></li>
        </ol>),
        es: (<ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Primero: diagonal de la base = √(24² + 10²) = √(576 + 100) = √676 = <strong>26 cm</strong></li>
          <li>Ahora Pitágoras en 3D: la diagonal de la base (26 cm) es un cateto, la altura (8 cm) es el otro</li>
          <li>Diagonal del cuerpo = √(26² + 8²) = √(676 + 64) = √740 ≈ <strong>27,20 cm</strong></li>
        </ol>),
      },
      hint: {
        ca: "Aplica Pitàgores en dos passos: primer la diagonal del terra (base rectangle), i després usa-la com a catet per trobar la diagonal de tot el cos incloent l'alçada.",
        es: "Aplica Pitágoras en dos pasos: primero la diagonal del suelo (base rectángulo), y luego úsala como cateto para encontrar la diagonal de todo el cuerpo incluyendo la altura.",
      },
      unit: "cm", ans: Math.sqrt(740), tol: 0.05,
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

      {/* ── Problemes reals per nivell ── */}
      <div className="mt-4 space-y-6">
        {(
          [
            {
              level: 'A' as const,
              emoji: '🟢',
              labelCa: 'Nivell A — Fàcil',
              labelEs: 'Nivel A — Fácil',
              descCa: 'Càlcul directe i situacions quotidianes senzilles.',
              descEs: 'Cálculo directo y situaciones cotidianas sencillas.',
              headerBg: 'bg-green-50 border-green-400',
              titleColor: 'text-green-900',
              descColor: 'text-green-700',
              cardBorder: 'border-green-200',
              numColor: 'text-green-700',
              inputFocus: 'focus:border-green-500 focus:ring-2 focus:ring-green-200',
              btnActive: 'bg-green-500 hover:bg-green-600 text-white',
            },
            {
              level: 'B' as const,
              emoji: '🟡',
              labelCa: 'Nivell B — Mitjà',
              labelEs: 'Nivel B — Medio',
              descCa: 'Identifica el triangle dins d\'altres figures geomètriques.',
              descEs: 'Identifica el triángulo dentro de otras figuras geométricas.',
              headerBg: 'bg-yellow-50 border-yellow-400',
              titleColor: 'text-yellow-900',
              descColor: 'text-yellow-700',
              cardBorder: 'border-yellow-200',
              numColor: 'text-yellow-700',
              inputFocus: 'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200',
              btnActive: 'bg-yellow-500 hover:bg-yellow-600 text-white',
            },
            {
              level: 'C' as const,
              emoji: '🔴',
              labelCa: 'Nivell C — Difícil',
              labelEs: 'Nivel C — Difícil',
              descCa: 'Reptes multi-pas, geometria en 3D i situacions amb més d\'una variable.',
              descEs: 'Retos multi-paso, geometría en 3D y situaciones con más de una variable.',
              headerBg: 'bg-red-50 border-red-400',
              titleColor: 'text-red-900',
              descColor: 'text-red-700',
              cardBorder: 'border-red-200',
              numColor: 'text-red-700',
              inputFocus: 'focus:border-red-500 focus:ring-2 focus:ring-red-200',
              btnActive: 'bg-red-500 hover:bg-red-600 text-white',
            },
          ] as const
        ).map((lvl) => {
          const group = realProblems.filter((p) => p.level === lvl.level);
          return (
            <div key={lvl.level}>
              <div className={`bg-sky-50 border-l-4 border-sky-500 p-5 rounded-r-lg mb-1`}>
                <h4 className="font-bold text-sky-900 text-lg mb-1">
                  🌍 {lang === 'ca' ? 'Problemes reals contextualitzats' : 'Problemas reales contextualizados'}
                </h4>
              </div>
              <div className={`border-l-4 ${lvl.headerBg} p-4 rounded-r-lg mb-4`}>
                <h5 className={`font-bold ${lvl.titleColor} text-base mb-0.5`}>
                  {lvl.emoji} {lang === 'ca' ? lvl.labelCa : lvl.labelEs}
                </h5>
                <p className={`${lvl.descColor} text-sm`}>
                  {lang === 'ca' ? lvl.descCa : lvl.descEs}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                {group.map((p) => {
                  const isChecked = checked[p.id];
                  const val = parseFloat(inputs[p.id] || '');
                  const isCorrect = !isNaN(val) && Math.abs(val - p.ans) <= 0.05;
                  const isFilled = (inputs[p.id] || '') !== '';

                  let inputStyle = `border-gray-300 ${lvl.inputFocus}`;
                  if (isChecked && isFilled) {
                    inputStyle = isCorrect
                      ? 'border-green-500 bg-green-50 text-green-900 font-bold'
                      : 'border-red-300 bg-red-50 text-red-900 font-bold';
                  }

                  return (
                    <div key={p.id} className={`bg-white p-5 rounded-xl border ${lvl.cardBorder} shadow-sm flex flex-col gap-3`}>
                      <p className="text-gray-800 text-sm leading-relaxed">
                        <span className={`font-bold ${lvl.numColor} mr-1`}>{p.num}.</span>
                        {p.q[lang]}
                      </p>
                      {p.hint && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-indigo-600 font-semibold hover:text-indigo-800 select-none">
                            💡 {lang === 'ca' ? 'Pista' : 'Pista'}
                          </summary>
                          <p className="mt-2 italic text-gray-500 pl-3 border-l-2 border-indigo-200">
                            {p.hint[lang]}
                          </p>
                        </details>
                      )}
                      <div className="flex items-center gap-2 mt-auto">
                        <input
                          type="number"
                          step="0.01"
                          className={`border rounded-lg p-2 w-28 transition-colors outline-none ${inputStyle}`}
                          value={inputs[p.id] || ''}
                          onChange={(e) => {
                            setInputs(prev => ({ ...prev, [p.id]: e.target.value }));
                            setChecked(prev => { const n = { ...prev }; delete n[p.id]; return n; });
                          }}
                        />
                        <span className="text-gray-500 text-sm">{p.unit}</span>
                        <button
                          disabled={!isFilled}
                          onClick={() => {
                            trackAnswer({
                              email: studentEmail,
                              questionId: `practica_${p.id}`,
                              questionText: p.q[lang],
                              userAnswer: isNaN(val) ? '' : val,
                              correctAnswer: Math.round(p.ans * 100) / 100,
                              isCorrect,
                              section: 'practica',
                              lang,
                              sessionId,
                            });
                            setChecked(prev => ({ ...prev, [p.id]: true }));
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                            isFilled
                              ? lvl.btnActive + ' cursor-pointer'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {lang === 'ca' ? 'Comprova' : 'Comprobar'}
                        </button>
                      </div>
                      {isChecked && (
                        <p className={`text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                          {isCorrect
                            ? (lang === 'ca' ? '✓ Correcte!' : '✓ ¡Correcto!')
                            : (lang === 'ca'
                                ? `✗ La resposta correcta és ${Math.round(p.ans * 100) / 100} ${p.unit}`
                                : `✗ La respuesta correcta es ${Math.round(p.ans * 100) / 100} ${p.unit}`)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
