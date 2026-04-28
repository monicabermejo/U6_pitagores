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
  ans: number;
  unit: string;
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
    { id: 'rp15', num: 1, unit: 'm', ans: 25,
      q: { ca: "Un pont tibant té dues torres de 15 m d'alçada. Els cables que subjecten el tauler estan ancorats al terra a 20 m de la base de cada torre. Quant mesura cadascun d'aquests cables diagonals?", es: "Un puente atirantado tiene dos torres de 15 m de altura. Los cables que sujetan el tablero están anclados al suelo a 20 m de la base de cada torre. ¿Cuánto mide cada uno de estos cables diagonales?" } },
    { id: 'rp16', num: 2, unit: 'm', ans: 26,
      q: { ca: "La piscina municipal és rectangular i fa 24 m de llarg i 10 m d'ample. La monitora neda en diagonal d'un cantó a l'altre cada matí. Quants metres recorre en cada travessia?", es: "La piscina municipal es rectangular y mide 24 m de largo y 10 m de ancho. La monitora nada en diagonal de una esquina a la otra cada mañana. ¿Cuántos metros recorre en cada travesía?" } },
    { id: 'rp17', num: 3, unit: 'm', ans: 144,
      q: { ca: "Una maqueta d'una piràmide d'Egipte té una base quadrada de 120 m de costat i la longitud de la línia que va del centre de la base fins a la punta passant per la cara és de 156 m. Quina és l'alçada de la piràmide?", es: "Una maqueta de una pirámide de Egipto tiene una base cuadrada de 120 m de lado y la longitud de la línea que va del centro de la base hasta la punta pasando por la cara es de 156 m. ¿Cuál es la altura de la pirámide?" } },
    { id: 'rp18', num: 4, unit: 'm', ans: 36,
      q: { ca: "Un parapentista vola 45 m en línia recta inclinada i avança 27 m en horitzontal. Quants metres ha baixat verticalment durant el vol?", es: "Un parapentista vuela 45 m en línea recta inclinada y avanza 27 m en horizontal. ¿Cuántos metros ha bajado verticalmente durante el vuelo?" } },
    { id: 'rp19', num: 5, unit: 'cm', ans: 100,
      q: { ca: "Un marc de quadre fa 60 cm d'ample i 80 cm d'alt. L'has de fer passar per una porta que fa just 1 metre d'ample. Quant mesura la diagonal del marc?", es: "Un marco de cuadro mide 60 cm de ancho y 80 cm de alto. Lo tienes que pasar por una puerta que mide justo 1 metro de ancho. ¿Cuánto mide la diagonal del marco?" } },
    { id: 'rp20', num: 6, unit: 'm', ans: 58,
      q: { ca: "Un atleta surt del punt de partida, corre 40 m cap al nord i després 42 m cap a l'est. Quina és la distància en línia recta des del punt de partida fins on és ara?", es: "Un atleta sale del punto de partida, corre 40 m hacia el norte y después 42 m hacia el este. ¿Cuál es la distancia en línea recta desde el punto de partida hasta donde está ahora?" } },
    { id: 'rp21', num: 7, unit: 'm', ans: 13,
      q: { ca: "Una escala mecànica d'un centre comercial puja 5 metres d'alçada. La base de l'escala ocupa 12 metres de recorregut horitzontal. Quina és la longitud real de l'escala inclinada?", es: "Una escalera mecánica de un centro comercial sube 5 metros de altura. La base de la escalera ocupa 12 metros de recorrido horizontal. ¿Cuál es la longitud real de la escalera inclinada?" } },
    { id: 'rp22', num: 8, unit: 'cm', ans: 48,
      q: { ca: "La diagonal d'un monitor d'ordinador mesura 80 cm i la seva amplada és de 64 cm. Quina és l'alçada de la pantalla?", es: "La diagonal de un monitor de ordenador mide 80 cm y su anchura es de 64 cm. ¿Cuál es la altura de la pantalla?" } },
    { id: 'rp23', num: 9, unit: 'm', ans: 21,
      q: { ca: "Un sonar detecta un objecte submarí a 29 m de distància del vaixell. Sabem que l'objecte es troba a 20 m de profunditat. A quina distància horitzontal del vaixell es troba l'objecte?", es: "Un sonar detecta un objeto submarino a 29 m de distancia del barco. Sabemos que el objeto se encuentra a 20 m de profundidad. ¿A qué distancia horizontal del barco se encuentra el objeto?" } },
    { id: 'rp24', num: 10, unit: 'km', ans: 2.4,
      q: { ca: "Un senderista puja per un camí de muntanya. El camí fa 2.6 km de recorregut total i el desnivell vertical és d'1 km. Quant ha avançat el senderista en horitzontal?", es: "Un senderista sube por un camino de montaña. El camino mide 2.6 km de recorrido total y el desnivel vertical es de 1 km. ¿Cuánto ha avanzado el senderista en horizontal?" } },
    { id: 'rp25', num: 11, unit: 'm', ans: 17,
      q: { ca: "Un magatzem rectangular fa 8 m d'ample i 15 m de llarg. Un treballador recorre el magatzem en diagonal d'un extrem a l'altre. Quina distància recorre?", es: "Un almacén rectangular mide 8 m de ancho y 15 m de largo. Un trabajador recorre el almacén en diagonal de un extremo al otro. ¿Qué distancia recorre?" } },
    { id: 'rp26', num: 12, unit: 'm', ans: 5,
      q: { ca: "Una teulada a dues aigues cobreix un edifici de 8 m d'amplada. El carener (el punt més alt) es troba 3 m per sobre dels murs laterals. Quant mesura cada porció inclinada de la teulada?", es: "Un tejado a dos aguas cubre un edificio de 8 m de ancho. El caballete (el punto más alto) se encuentra 3 m por encima de los muros laterales. ¿Cuánto mide cada porción inclinada del tejado?" } },
    { id: 'rp27', num: 13, unit: 'm', ans: 25,
      q: { ca: "Un quarterback llança la pilota de rugby americà 20 m cap endavant i 15 m cap a la dreta del camp. Quina distància ha recorregut la pilota en total?", es: "Un quarterback lanza el balón de fútbol americano 20 m hacia adelante y 15 m hacia la derecha del campo. ¿Qué distancia ha recorrido el balón en total?" } },
    { id: 'rp28', num: 14, unit: 'm', ans: 12.5,
      q: { ca: "En un teatre, un focus penjat al sostre es troba a 7.5 m d'alçada. El tècnic de llum vol tirar un cable des del focus fins a la paret, que queda a 10 m de distància horitzontal. Quant de cable necessita?", es: "En un teatro, un foco colgado en el techo se encuentra a 7.5 m de altura. El técnico de luces quiere tirar un cable desde el foco hasta la pared, que queda a 10 m de distancia horizontal. ¿Cuánto cable necesita?" } },
    { id: 'rp29', num: 15, unit: 'cm', ans: 50,
      q: { ca: "En un joc de taula, el tauler fa 30 cm d'ample i 40 cm de llarg. Quin és el cordill mínim necessari per travessar el tauler en diagonal d'un extrem a l'altre?", es: "En un juego de mesa, el tablero mide 30 cm de ancho y 40 cm de largo. ¿Cuál es el cordel mínimo necesario para atravesar el tablero en diagonal de un extremo al otro?" } },
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
          Una empresa vol crear un logotip en forma de <strong>paral·lelogram</strong>. Els costats fan <strong>10 cm i 17 cm</strong>. L'alçada traçada fins al costat de 17 cm crea un segment de <strong>6 cm</strong> dins d'aquell costat. Calcula l'<strong>àrea total</strong> del logotip.
        </>),
        es: (<>
          Una empresa quiere crear un logotipo en forma de <strong>paralelogramo</strong>. Los lados miden <strong>10 cm y 17 cm</strong>. La altura trazada hasta el lado de 17 cm crea un segmento de <strong>6 cm</strong> dentro de ese lado. Calcula el <strong>área total</strong> del logotipo.
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

      {/* ── Problemes reals addicionals ── */}
      <div className="mt-4">
        <div className="bg-sky-50 border-l-4 border-sky-500 p-5 rounded-r-lg mb-5">
          <h4 className="font-bold text-sky-900 text-lg mb-1">
            {lang === 'ca' ? '🌍 Problemes reals — Bateria addicional' : '🌍 Problemas reales — Batería adicional'}
          </h4>
          <p className="text-sky-700 text-sm">
            {lang === 'ca'
              ? 'Problemes contextualitzats on has d\'identificar els catets i la hipotenusa per aplicar Pitàgores.'
              : 'Problemas contextualizados donde debes identificar los catetos y la hipotenusa para aplicar Pitágoras.'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {realProblems.map((p) => {
            const isChecked = checked[p.id];
            const val = parseFloat(inputs[p.id] || '');
            const isCorrect = !isNaN(val) && Math.abs(val - p.ans) <= 0.05;
            const isFilled = (inputs[p.id] || '') !== '';

            let inputStyle = "border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200";
            if (isChecked && isFilled) {
              inputStyle = isCorrect
                ? "border-green-500 bg-green-50 text-green-900 font-bold"
                : "border-red-300 bg-red-50 text-red-900 font-bold";
            }

            return (
              <div key={p.id} className="bg-white p-5 rounded-xl border border-sky-200 shadow-sm flex flex-col gap-3">
                <p className="text-gray-800 text-sm leading-relaxed">
                  <span className="font-bold text-sky-700 mr-1">{p.num}.</span>
                  {p.q[lang]}
                </p>
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
                        correctAnswer: p.ans,
                        isCorrect,
                        section: 'practica',
                        lang,
                        sessionId,
                      });
                      setChecked(prev => ({ ...prev, [p.id]: true }));
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                      isFilled
                        ? 'bg-sky-500 text-white hover:bg-sky-600 cursor-pointer'
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
                      : (lang === 'ca' ? `✗ La resposta és ${p.ans} ${p.unit}` : `✗ La respuesta es ${p.ans} ${p.unit}`)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
