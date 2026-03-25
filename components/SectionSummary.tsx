import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

type Lang = 'ca' | 'es';

const t = (ca: string, es: string, lang: Lang) => lang === 'ca' ? ca : es;

// ── Mini quiz data ──────────────────────────────────────────────────────────
const quizQuestions = [
  {
    id: 'sq1',
    ca: 'Un triangle rectangle té catets 6 i 8. Quant mesura la hipotenusa?',
    es: 'Un triángulo rectángulo tiene catetos 6 y 8. ¿Cuánto mide la hipotenusa?',
    answer: 10,
    hint_ca: '6² + 8² = 36 + 64 = 100 → √100 = 10',
    hint_es: '6² + 8² = 36 + 64 = 100 → √100 = 10',
  },
  {
    id: 'sq2',
    ca: 'La hipotenusa és 13 i un catet és 5. Quant mesura l\'altre catet?',
    es: 'La hipotenusa es 13 y un cateto es 5. ¿Cuánto mide el otro cateto?',
    answer: 12,
    hint_ca: '13² − 5² = 169 − 25 = 144 → √144 = 12',
    hint_es: '13² − 5² = 169 − 25 = 144 → √144 = 12',
  },
  {
    id: 'sq3',
    ca: 'Una escala de 5 m toca la paret a 4 m d\'alçada. A quina distància és el peu de la paret?',
    es: 'Una escalera de 5 m toca la pared a 4 m de altura. ¿A qué distancia está el pie de la pared?',
    answer: 3,
    hint_ca: '5² − 4² = 25 − 16 = 9 → √9 = 3 m',
    hint_es: '5² − 4² = 25 − 16 = 9 → √9 = 3 m',
  },
];

type QuizState = { value: string; checked: boolean; correct: boolean | null };

export const SectionSummary: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [quiz, setQuiz] = useState<Record<string, QuizState>>(
    Object.fromEntries(quizQuestions.map(q => [q.id, { value: '', checked: false, correct: null }]))
  );

  const check = (id: string, answer: number) => {
    const val = parseFloat(quiz[id].value);
    setQuiz(prev => ({ ...prev, [id]: { ...prev[id], checked: true, correct: val === answer } }));
  };

  const reset = (id: string) => {
    setQuiz(prev => ({ ...prev, [id]: { value: '', checked: false, correct: null } }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* ── 1. EL TEOREMA ──────────────────────────────────────────────────── */}
      <section className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-black text-indigo-800 mb-1 flex items-center gap-2">
          <span>🔬</span> {t('1. El Teorema de Pitàgores', '1. El Teorema de Pitágoras', lang)}
        </h3>
        <p className="text-gray-500 text-sm italic mb-5">
          {t(
            'En tot triangle rectangle, el quadrat de la hipotenusa és igual a la suma dels quadrats dels dos catets.',
            'En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los dos catetos.',
            lang
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Diagram */}
          <div className="flex-shrink-0">
            <svg viewBox="0 0 220 150" className="w-64 h-44 mx-auto">
              <polygon points="25,125 25,15 185,125" fill="rgba(99,102,241,0.07)" stroke="none" />
              {/* legs */}
              <line x1="25" y1="15" x2="25" y2="125" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
              <line x1="25" y1="125" x2="185" y2="125" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
              {/* hypotenuse */}
              <line x1="25" y1="15" x2="185" y2="125" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
              {/* right angle marker */}
              <polyline points="25,113 37,113 37,125" fill="none" stroke="#374151" strokeWidth="2" />
              {/* labels legs */}
              <text x="10" y="75" fontSize="13" fill="#2563eb" fontWeight="bold" textAnchor="middle">c₁</text>
              <text x="105" y="141" fontSize="13" fill="#2563eb" fontWeight="bold" textAnchor="middle">c₂</text>
              {/* hypotenuse label */}
              <text textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="13"
                transform="translate(111,64) rotate(33)">h</text>

            </svg>
          </div>

          {/* Formula box */}
          <div className="flex-1 space-y-3">
            <div className="bg-indigo-600 text-white rounded-xl px-6 py-4 text-center shadow">
              <div className="text-3xl font-black font-mono tracking-wide">c₁² + c₂² = h²</div>
              <div className="text-indigo-200 text-xs mt-1">
                {t('on h és sempre la hipotenusa', 'donde h es siempre la hipotenusa', lang)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="font-bold text-blue-700 mb-1">{t('Catets (c₁, c₂)', 'Catetos (c₁, c₂)', lang)}</div>
                <div className="text-blue-600 text-xs">{t('Formen l\'angle recte (90°)', 'Forman el ángulo recto (90°)', lang)}</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="font-bold text-red-700 mb-1">{t('Hipotenusa (h)', 'Hipotenusa (h)', lang)}</div>
                <div className="text-red-600 text-xs">{t('La més llarga. Oposada a 90°', 'La más larga. Opuesta a 90°', lang)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. LES DUES FÓRMULES ──────────────────────────────────────────── */}
      <section className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-black text-emerald-800 mb-4 flex items-center gap-2">
          <span>🧮</span> {t('2. Les dues fórmules', '2. Las dos fórmulas', lang)}
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Find hypotenuse */}
          <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5">
            <div className="font-black text-green-700 text-base mb-3">
              {t('🔍 Trobar la HIPOTENUSA (h)', '🔍 Encontrar la HIPOTENUSA (h)', lang)}
            </div>
            <div className="bg-white rounded-lg px-4 py-3 text-center border border-green-200 mb-3">
              <div className="text-2xl font-black font-mono text-green-700 flex items-center justify-center">
                <span>h =&nbsp;</span>
                <span className="inline-flex items-end">
                  <span style={{ fontSize: '1.4em', lineHeight: 1 }}>√</span>
                  <span className="border-t-2 border-green-700" style={{ paddingLeft: '2px', paddingRight: '3px' }}>c₁² + c₂²</span>
                </span>
              </div>
            </div>
            <div className="space-y-1 text-sm text-green-800">
              <div className="flex items-start gap-2"><span className="font-bold">1.</span><span>{t('Eleva al quadrat els dos catets', 'Eleva al cuadrado los dos catetos', lang)}</span></div>
              <div className="flex items-start gap-2"><span className="font-bold">2.</span><span>{t('Suma els resultats', 'Suma los resultados', lang)}</span></div>
              <div className="flex items-start gap-2"><span className="font-bold">3.</span><span>{t('Aplica l\'arrel quadrada', 'Aplica la raíz cuadrada', lang)}</span></div>
            </div>
            <div className="mt-3 bg-green-100 rounded-lg p-2 text-xs text-green-900">
              <span className="font-bold">{t('Exemple:', 'Ejemplo:', lang)}</span> c₁=3, c₂=4 → h=√(9+16)=√25=<span className="font-black">5</span>
            </div>
          </div>

          {/* Find leg */}
          <div className="bg-orange-50 border-2 border-orange-400 rounded-xl p-5">
            <div className="font-black text-orange-700 text-base mb-3">
              {t('🔍 Trobar un CATET (c₁ o c₂)', '🔍 Encontrar un CATETO (c₁ o c₂)', lang)}
            </div>
            <div className="bg-white rounded-lg px-4 py-3 text-center border border-orange-200 mb-3">
              <div className="text-2xl font-black font-mono text-orange-700 flex items-center justify-center">
                <span>c₁ =&nbsp;</span>
                <span className="inline-flex items-end">
                  <span style={{ fontSize: '1.4em', lineHeight: 1 }}>√</span>
                  <span className="border-t-2 border-orange-700" style={{ paddingLeft: '2px', paddingRight: '3px' }}>h² − c₂²</span>
                </span>
              </div>
            </div>
            <div className="space-y-1 text-sm text-orange-800">
              <div className="flex items-start gap-2"><span className="font-bold">1.</span><span>{t('Eleva al quadrat la hipotenusa i el catet conegut', 'Eleva al cuadrado la hipotenusa y el cateto conocido', lang)}</span></div>
              <div className="flex items-start gap-2"><span className="font-bold">2.</span><span>{t('Resta: h² − catet²', 'Resta: h² − cateto²', lang)}</span></div>
              <div className="flex items-start gap-2"><span className="font-bold">3.</span><span>{t('Aplica l\'arrel quadrada', 'Aplica la raíz cuadrada', lang)}</span></div>
            </div>
            <div className="mt-3 bg-orange-100 rounded-lg p-2 text-xs text-orange-900">
              <span className="font-bold">{t('Exemple:', 'Ejemplo:', lang)}</span> h=10, c₂=8 → c₁=√(100−64)=√36=<span className="font-black">6</span>
            </div>
          </div>
        </div>

        {/* Decision key */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
          <div className="font-black text-gray-700 mb-2">⚡ {t('Clau ràpida de decisió', 'Clave rápida de decisión', lang)}</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-green-100 rounded-lg px-3 py-2">
              <span className="text-lg">✅</span>
              <span className="text-green-800">{t('Tens c₁ i c₂ → busques h → SUMA', 'Tienes c₁ y c₂ → buscas h → SUMA', lang)}</span>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-orange-100 rounded-lg px-3 py-2">
              <span className="text-lg">✅</span>
              <span className="text-orange-800">{t('Tens h + un catet → busques l\'altre catet → RESTA', 'Tienes h + un cateto → buscas el otro cateto → RESTA', lang)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TERNES PITAGÒRIQUES A MEMORITZAR ──────────────────────────── */}
      <section className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-black text-purple-800 mb-1 flex items-center gap-2">
          <span>🧠</span> {t('3. Ternes a memoritzar', '3. Ternas a memorizar', lang)}
        </h3>
        <p className="text-gray-500 text-sm italic mb-4">
          {t(
            'Aquestes combinacions surten molt a exàmens. Si les reconèixes, t\'estalvies càlculs!',
            'Estas combinaciones salen mucho en exámenes. ¡Si las reconoces, te ahorras cálculos!',
            lang
          )}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { a: 3, b: 4, c: 5 },
            { a: 5, b: 12, c: 13 },
            { a: 8, b: 15, c: 17 },
            { a: 6, b: 8, c: 10 },
            { a: 9, b: 12, c: 15 },
            { a: 7, b: 24, c: 25 },
          ].map(({ a, b, c }) => (
            <div key={`${a}-${b}-${c}`} className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
              <div className="font-black text-purple-700 text-lg">({a}, {b}, {c})</div>
              <div className="text-purple-500 text-xs mt-1">{a}²+{b}²={c}²</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. PROBLEMES REALS: PASSOS ──────────────────────────────────────── */}
      <section className="bg-white border-2 border-sky-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-black text-sky-800 mb-1 flex items-center gap-2">
          <span>🗺️</span> {t('4. Com resoldre un problema real', '4. Cómo resolver un problema real', lang)}
        </h3>
        <p className="text-gray-500 text-sm italic mb-5">
          {t(
            'Sempre el mateix mètode, sigui quin sigui l\'enunciat.',
            'Siempre el mismo método, sea cual sea el enunciado.',
            lang
          )}
        </p>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {[
            {
              n: '1', color: 'bg-sky-600',
              ca: 'Dibuixa el triangle rectangle i identifica les dades',
              es: 'Dibuja el triángulo rectángulo e identifica los datos',
            },
            {
              n: '2', color: 'bg-sky-500',
              ca: 'Decideix: busques hipotenusa o catet?',
              es: 'Decide: ¿buscas hipotenusa o cateto?',
            },
            {
              n: '3', color: 'bg-sky-400',
              ca: 'Aplica la fórmula correcta (suma o resta)',
              es: 'Aplica la fórmula correcta (suma o resta)',
            },
            {
              n: '4', color: 'bg-sky-300',
              ca: 'Calcula l\'arrel quadrada i escriu la unitat',
              es: 'Calcula la raíz cuadrada y escribe la unidad',
            },
          ].map(step => (
            <div key={step.n} className="flex items-center gap-4">
              <div className={`${step.color} text-white font-black text-lg w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center shadow`}>
                {step.n}
              </div>
              <div className="text-gray-700 font-medium">{t(step.ca, step.es, lang)}</div>
            </div>
          ))}
        </div>

        {/* Example problem */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
          <div className="font-bold text-sky-800 mb-3">
            📌 {t('Exemple resolt', 'Ejemplo resuelto', lang)}
          </div>
          <p className="text-gray-700 text-sm mb-3 italic">
            {t(
              'Una tirolina va des d\'un arbre de 15 m fins a un punt del terra a 8 m del tronc. Quant mesura el cable?',
              'Una tirolina va desde un árbol de 15 m hasta un punto del suelo a 8 m del tronco. ¿Cuánto mide el cable?',
              lang
            )}
          </p>
          <div className="space-y-1 text-sm text-sky-900">
            <div><span className="font-bold">1.</span> {t('Catets: alçada = 15 m, base = 8 m. Busquem la hipotenusa (cable).', 'Catetos: altura = 15 m, base = 8 m. Buscamos la hipotenusa (cable).', lang)}</div>
            <div><span className="font-bold">2.</span> c = √(15² + 8²) = √(225 + 64) = √289</div>
            <div><span className="font-bold">3.</span> √289 = <span className="font-black text-sky-700 text-base">17 m</span></div>
          </div>
        </div>
      </section>

      {/* ── 5. MINI QUIZ ───────────────────────────────────────────────────── */}
      <section className="bg-white border-2 border-violet-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-black text-violet-800 mb-1 flex items-center gap-2">
          <span>✏️</span> {t('6. Autoavaluació ràpida', '6. Autoevaluación rápida', lang)}
        </h3>
        <p className="text-gray-500 text-sm italic mb-5">
          {t(
            'Tres preguntes per comprovar si el tens clar. Sense trampe!',
            'Tres preguntas para comprobar si lo tienes claro. ¡Sin trampa!',
            lang
          )}
        </p>
        <div className="space-y-4">
          {quizQuestions.map((q, i) => {
            const state = quiz[q.id];
            return (
              <div key={q.id} className={`rounded-xl p-4 border-2 transition-all ${
                state.correct === true ? 'bg-green-50 border-green-400' :
                state.correct === false ? 'bg-red-50 border-red-300' :
                'bg-gray-50 border-gray-200'
              }`}>
                <p className="font-medium text-gray-800 text-sm mb-3">
                  <span className="font-black text-violet-600">{i + 1}.</span> {t(q.ca, q.es, lang)}
                </p>
                {!state.checked ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={state.value}
                      onChange={e => setQuiz(prev => ({ ...prev, [q.id]: { ...prev[q.id], value: e.target.value } }))}
                      onKeyDown={e => e.key === 'Enter' && check(q.id, q.answer)}
                      className="border-2 border-violet-300 rounded-lg px-3 py-2 w-28 text-center font-bold focus:outline-none focus:border-violet-500"
                      placeholder="?"
                    />
                    <button
                      onClick={() => check(q.id, q.answer)}
                      className="bg-violet-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors text-sm"
                    >
                      {t('Comprovar', 'Comprobar', lang)}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 font-bold text-sm ${state.correct ? 'text-green-700' : 'text-red-600'}`}>
                      {state.correct
                        ? <><CheckCircle size={16} /> {t('Correcte! ✨', '¡Correcto! ✨', lang)}</>
                        : <><XCircle size={16} /> {t(`Incorrecte. La resposta és ${q.answer}.`, `Incorrecto. La respuesta es ${q.answer}.`, lang)}</>
                      }
                    </div>
                    <div className="text-xs text-gray-500 bg-white rounded-lg px-3 py-1.5 border border-gray-200">
                      💡 {t(q.hint_ca, q.hint_es, lang)}
                    </div>
                    <button
                      onClick={() => reset(q.id)}
                      className="text-xs text-violet-500 hover:text-violet-700 underline"
                    >
                      {t('Tornar a intentar', 'Volver a intentar', lang)}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FINAL BANNER ───────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white text-center shadow-lg">
        <div className="text-4xl mb-2">🏆</div>
        <h3 className="text-xl font-black mb-1">
          {t('Ja estàs llest/a per a l\'examen!', '¡Ya estás listo/a para el examen!', lang)}
        </h3>
        <p className="text-emerald-100 text-sm">
          {t(
            'Recorda: identifica la hipotenusa, tria la fórmula correcta i no oblidis l\'arrel quadrada.',
            'Recuerda: identifica la hipotenusa, elige la fórmula correcta y no olvides la raíz cuadrada.',
            lang
          )}
        </p>
        <div className="mt-4 font-black text-2xl font-mono bg-white/20 rounded-xl py-2 px-6 inline-block">
          c₁² + c₂² = h²
        </div>
      </div>
    </motion.div>
  );
};
