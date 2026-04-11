# Nota de Versions del Disseny Tècnic
## Dossier Digital Interactiu: El Teorema de Pitàgores

> **Projecte:** Unitat 6 — Pitàgores  
> **Autora:** Mónica Bermejo Abellán  
> **Marc metodològic:** Investigació Basada en el Disseny (IBD)  
> **Audiència:** Alumnes de 2n d'ESO (~13 anys)  
> **Data del document:** 28 de març de 2026

---

## 0. Resum Executiu

Aquest document recull l'evolució tècnica del dossier digital «Pitàgores», des del prototip inicial generat amb Google AI Studio fins a la versió optimitzada actual, treballada iterativament a VS Code. L'objectiu és doble: (1) servir com a evidència metodològica del cicle de disseny–implementació–avaluació propi de l'IBD, i (2) documentar les decisions d'enginyeria que tenen fonamentació pedagògica directa.

---

## 1. Fase 1 — Prototipatge (Google AI Studio)

### 1.1 Estructura original de la IA

El punt de partida va ser un prototip generat a **Google AI Studio** amb el model Gemini. L'estructura inicial era la d'una **Single Page Application (SPA) monolítica**: un únic fitxer amb tota la lògica d'interfície, contingut i interacció. L'agent d'IA operava amb un prompt genèric i directe:

```
You are Pythagoras. Answer the student's question about geometry or your theorem
briefly and encouragingly in [Catalan|Spanish]. Keep it simple for a 13 year old.
```

**Característiques del prototip base:**

| Aspecte | Estat inicial |
|---|---|
| Arquitectura | Fitxer monolític (una sola pàgina de codi) |
| Llenguatge | JavaScript / React generat per IA |
| Tipatge | Sense TypeScript — variables sense tipus definits |
| System Prompt | Genèric, una línia, sense restriccions temàtiques |
| Tracking | Inexistent — cap registre de les respostes de l'alumne |
| Validació d'accés | Sense autenticació ni gate d'entrada |
| Bilingüisme | Parcial o inexistent |
| Protecció de respostes | Cap — respostes visibles al codi font del navegador |
| Feedback pedagògic | Binari (correcte/incorrecte), sense matisos |

### 1.2 Limitacions pedagògiques detectades

El prototip AI Studio va ser funcional com a proof-of-concept, però presentava **riscos pedagògics** importants:

1. **Al·lucinacions matemàtiques:** L'agent podia inventar resultats numèrics incorrectes sense cap mecanisme de verificació.
2. **Absència de dades:** Sense sistema de logs, era impossible recollir evidències de l'aprenentatge per a l'avaluació formativa.
3. **Contingut obert:** L'alumne podia preguntar qualsevol cosa a la IA, rebent respostes fora del temari.
4. **Respostes exposades:** Obrint les DevTools del navegador, qualsevol alumne podia trobar les respostes en text pla al codi JavaScript.

---

## 2. Fase 2 — Optimització i Refinament (VS Code)

### 2.1 Refactorització arquitectònica

La primera decisió d'enginyeria va ser **descompondre el monòlit** en una arquitectura modular basada en components React amb TypeScript estricte:

```
App.tsx                    → Estat global, flux de navegació, email gate
├── components/
│   ├── SectionBasics.tsx  → Secció 1: Recordatori (triangles, àrea, arrels)
│   ├── SectionVisual.tsx  → Secció 2: Identificació visual (SVG interactiu)
│   ├── SectionTheorem.tsx → Secció 3: El Teorema (història, drill 12 càlculs)
│   ├── SectionProblems.tsx→ Secció 4: 14 Problemes contextualitzats
│   ├── SectionExpert.tsx  → Extra: Ternes pitagòriques
│   ├── SectionSummary.tsx → Secció resum amb mini-quiz de consolidació
│   └── AIChat.tsx         → Agent IA flotant (Gemini)
├── utils/
│   └── trackAnswer.ts    → Mòdul de Learning Analytics
├── types.ts               → Interfícies TypeScript (Question, SectionProps...)
├── constants.tsx           → Textos bilingües + problemes amb respostes ofuscades
├── config.ts              → URL del backend (Apps Script)
└── apps-script/
    └── Code.gs            → Backend serverless per a recollida de dades
```

**Fonamentació pedagògica:** Cada secció mapa una fase de la seqüència didàctica (Recordatori → Visualització → Formalització → Aplicació → Extensió), permetent un **flux de desbloqueig progressiu** on l'alumne no accedeix a la secció $n+1$ fins completar la secció $n$.

### 2.2 Sistema de tipatge — de JavaScript a TypeScript

S'han definit interfícies TypeScript estrictes que garanteixen la coherència de les dades:

```typescript
type Language = 'ca' | 'es';

interface Question {
  id: string;
  question: { ca: string; es: string };
  answer: number;
  unit?: string;
}

interface SectionProps {
  lang: Language;
  onComplete: () => void;
  isLocked: boolean;
  studentEmail: string;     // ← afegit per al tracking
  sessionId: string;        // ← afegit per al tracking
}

interface TrackPayload {
  email: string;
  questionId: string;
  questionText: string;
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  section: string;
  lang: string;
  sessionId?: string;
}
```

**Impacte:** El tipatge estàtic elimina errors en temps de compilació (p.ex., passar una resposta com a `string` quan s'espera un `number`), cosa que redueix bugs que podrien confondre l'alumne amb avaluacions incorrectes.

---

### 2.3 Precisió de la IA — Estratègies anti-al·lucinació

#### 2.3.1 System Prompt restraint

El prompt de l'agent IA (`AIChat.tsx`) va evolucionar d'una instrucció genèrica a una amb **restriccions temàtiques i de rol**:

| Versió | Prompt |
|---|---|
| **Prototip** | *"You are Pythagoras. Answer questions briefly."* |
| **Actual** | *"You are Pythagoras. Answer the student's question about geometry or your theorem briefly and encouragingly in [Catalan/Spanish]. Keep it simple for a 13 year old."* |

Les millores clau del prompt refinat:
- **Restricció temàtica:** `about geometry or your theorem` — limita l'abast a geometria.
- **Adequació al nivell:** `Keep it simple for a 13 year old` — evita conceptes de nivell universitari.
- **Bilingüisme dinàmic:** El prompt canvia idioma segons l'estat `lang` de l'aplicació.
- **To d'acompanyament:** `encouragingly` — coherent amb l'enfocament pedagògic constructivista.

#### 2.3.2 Ofuscació de respostes al bundle

Un risc crític era que les respostes numèriques (p.ex., `answer: 4`) fossin visibles al codi font del navegador. S'han implementat **dues capes de protecció** al fitxer `vite.config.ts`:

```typescript
// Capa 1: Indirecta via funció wrapper (constants.tsx)
const _a = (n: number): number => n;
// answer: _a(4) → el literal 4 no apareix directament associat a 'answer'

// Capa 2: Ofuscació del bundle (vite.config.ts)
obfuscator({
  global: true,
  options: {
    identifierNamesGenerator: 'hexadecimal',    // Variables → _0x3a2f
    stringArray: true,
    stringArrayEncoding: ['base64'],             // Strings → base64
    numbersToExpressions: true,                  // 4 → (0x1*0x4+...)
    splitStrings: true,
    splitStringsChunkLength: 5,
    transformObjectKeys: true,
  },
})
```

Addicionalment, `sourcemap: false` impedeix la reconstrucció del codi original.

**Fonamentació:** Protegir les respostes és necessari per mantenir la **validesa de l'avaluació formativa**. Si l'alumne pot consultar les respostes al codi, el tracking perd el seu valor diagnòstic.

---

### 2.4 Implementació del sistema de Learning Analytics

#### 2.4.1 Arquitectura del flux de dades

```
[Alumne interactua]
       │
       ▼
  trackAnswer()         ← utils/trackAnswer.ts
       │ POST JSON (text/plain per evitar CORS preflight)
       ▼
  Google Apps Script     ← apps-script/Code.gs
       │
       ├── Validació email contra llista "Participants"
       ├── Escriptura a fulla "Respostes" (12 columnes)
       └── Upsert a fulla "Resum_alumnes" (9 columnes)
```

#### 2.4.2 Payload de cada interacció

Cada resposta de l'alumne genera un registre amb les dades següents:

| Camp | Descripció | Exemple |
|---|---|---|
| `email` | Identificador validat de l'alumne | joan@escola.cat |
| `questionId` | ID únic de la pregunta | `rp3`, `theorem_drill_q7` |
| `questionText` | Enunciat complet (en l'idioma actiu) | "Una tirolina de 15 m..." |
| `userAnswer` | Resposta introduïda per l'alumne | 17 |
| `correctAnswer` | Resposta esperada | 17 |
| `isCorrect` | Avaluació booleana | true |
| `section` | Secció de l'app | `problems` |
| `lang` | Idioma actiu | `ca` |
| `sessionId` | ID de sessió (per agrupar intents) | `m3k9x2a` |

#### 2.4.3 Backend — Google Apps Script (`Code.gs`)

El servidor serverless gestiona tres operacions:

1. **`doPost()`** — Rep i valida cada resposta:
   - Comprova que l'email pertany a la llista de `Participants` (llista blanca).
   - Recupera el nom complet i el grup de l'alumne.
   - Escriu una fila a `Respostes` amb 12 columnes (timestamp, email, nom, grup, secció, ID, text pregunta, resposta alumne, resposta correcta, correcte?, idioma, sessió).
   - Actualitza `Resum_alumnes` amb un upsert: si l'alumne ja existeix, incrementa comptadors; si és nou, crea la fila.

2. **`doGet()`** — Validació d'email en temps real:
   - L'app consulta `?action=validate&email=xxx` abans de permetre l'accés.
   - Retorna `{ authorized: true/false }`.

3. **`updateSummary()`** — Dashboard del professor:
   - Columnes: Email, Nom, Grup, Total respostes, Correctes, Incorrectes, % Èxit, Última activitat, Seccions visitades.

**Fonamentació pedagògica:** El sistema de logs permet al professor:
- Detectar **patrons d'error** comuns per ajustar la instrucció (p.ex., si el 70% falla el problema rp8, cal reforçar la identificació de catets).
- Fer **avaluació formativa** basada en dades reals, no en percepció.
- Analitzar el **temps i nombre d'intents** per sessió gràcies al `sessionId`.

---

### 2.5 Millores en la interfície per a 2n d'ESO

#### 2.5.1 Sistema de desbloqueig progressiu (scaffolding)

```
[Email Gate] → [Pregunta desbloqueig] → [Sec 1] → [Sec 2] → [Sec 3] → [Sec 4] → [Extra]
                                              ↑ cada secció desbloqueja la següent
```

- **Email Gate:** Pantalla d'entrada amb validació d'email contra la llista de participants. Evita accessos no autoritzats i vincula cada resposta a un alumne real.
- **Pregunta de desbloqueig:** Trivia gamificada ("Qui era Pitàgores de Samos?") amb opcions humorístiques adaptades a l'edat (l'inventor de la pizza, un mag de Hogwarts...).
- **Desbloqueig seqüencial:** L'arquitectura d'estat (`level` + `activeSection`) impedeix saltar seccions. L'alumne ha de completar *tots* els exercicis d'una secció per avançar.

#### 2.5.2 Bilingüisme complet (CA/ES)

Tots els textos s'emmagatzemen al diccionari `TEXTS` dins `constants.tsx`, amb claus bilingües `{ ca: string, es: string }`. El toggle d'idioma és instantani i no perd el progrés:

```typescript
const toggleLang = () => {
  const newLang = lang === 'ca' ? 'es' : 'ca';
  setLang(newLang);
  localStorage.setItem('pythagoras_lang', newLang);
};
```

**Impacte pedagògic:** Alumnes castellanoparlants de nova incorporació poden treballar en el seu idioma dominant sense perdre's.

#### 2.5.3 Persistència de progrés

El progrés es desa a `localStorage` (claus: `pythagoras_level`, `pythagoras_lang`, `pythagoras_email`, `pythagoras_unlocked`). L'alumne pot tancar el navegador i reprendre on ho va deixar. El botó de reinici (`resetProgress`) esborra tot amb confirmació explícita.

#### 2.5.4 Diversitat d'exercicis interactius

| Tipus d'exercici | Secció | Mecànica |
|---|---|---|
| Test d'opció múltiple | Sec. 1 — Classificació | Selecció d'una opció amb feedback immediat |
| Drag & Drop conceptual | Sec. 1 — Etiquetes | Arrossegar etiquetes a figures |
| Input numèric amb tolerància | Sec. 1 — Àrea/Perímetre | 6 figures amb validació `±0.2` per decimals |
| Input amb rang acceptable | Sec. 1 — Arrels | √10 accepta valors entre 3.1 i 3.2 |
| Clic sobre SVG interactiu | Sec. 2 — Visual | 4 triangles; l'alumne clica la hipotenusa |
| Drill de càlcul (12 problemes) | Sec. 3 — Teorema | Inputs individuals amb comprovació per separat |
| Repte ocult (10 problemes multi-pas) | Sec. 3 — Teorema | Exercicis avançats amb acordió ocult; ±0.05 de tolerància; inclou pistes i diagrama SVG |
| Problemes paginats | Sec. 4 — Reals | 14 problemes amb navegació anterior/següent |
| Laboratori obert | Extra — Ternes | Input lliure de 3 nombres amb verificació $a^2 + b^2 = c^2$ |
| Mini-quiz de resum | Resum | 3 problemes de consolidació |

#### 2.5.5 Elements visuals i narratius

- **Demostracions SVG:** El teorema s'explica amb una demostració visual sense paraules (dos quadrats iguals amb triangles reorganitzats).
- **Anatomia del triangle rectangle:** Diagrama SVG interactiu amb codificació per colors (hipotenusa en vermell, catets en blau, angle recte en gris).
- **Microhistòries motivacionals:** Acordions amb les llegendes de la Germandat Pitagòrica (les faves, Hipaso de Metapont) per generar curiositat.
- **Animacions:** Biblioteca `framer-motion` per a transicions suaus entre seccions i feedback d'exercicis.
- **Activitat avaluable col·laborativa:** La Secció 4 inclou una activitat en 3 fases (creació en parella → intercanvi en grup de 4 → presentació oral) que combina el digital amb el presencial.

---

### 2.6 Evolució del System Prompt — De genèric a co-dissenyador rigorós

El refinament del system prompt reflecteix l'evolució del rol de la IA dins el dossier:

| Dimensió | Prototip (AI Studio) | Versió actual (VS Code) |
|---|---|---|
| **Rol** | Agent conversacional genèric | Personatge «Pitàgores» amb personalitat definida |
| **Àmbit temàtic** | Obert (qualsevol pregunta) | Restringit a geometria i el teorema |
| **Nivell lingüístic** | No especificat | Adaptat a 13 anys (`Keep it simple for a 13 year old`) |
| **Idioma** | Fix (un sol idioma) | Dinàmic segons variable `lang` |
| **To** | Neutre | `encouragingly` — reforç positiu constructivista |
| **Protecció anti-al·lucinació** | Cap | Restricció temàtica explícita |
| **Integració curricular** | Desconnectat del contingut | Contextualitzat dins de les seccions del dossier |

**Evolució futura prevista (cicle IBD):** Integrar un system prompt amb context complet del dossier (com els fitxers `ContextPitagores.md`, `ContextSOS.md` i `ContextX-Hunter.md` ja presents al repositori local), permetent a l'agent referenciar exercicis concrets, donar pistes sense revelar la resposta, i adaptar el nivell segons la secció on es trobi l'alumne.

---

## 3. Resum de Decisions de Disseny (Pont Enginyeria ↔ Pedagogia)

| Decisió tècnica | Justificació pedagògica |
|---|---|
| Descomposició en components per secció | Mapa la seqüència didàctica; permet desbloqueig progressiu (scaffolding) |
| TypeScript estricte (`SectionProps`, `TrackPayload`) | Garanteix la coherència de les dades d'avaluació |
| `trackAnswer()` + Google Apps Script | Learning Analytics: avaluació formativa basada en dades reals |
| Ofuscació del bundle (`rollup-plugin-obfuscator`) | Protegeix la validesa de l'avaluació (les respostes no són visibles) |
| `sessionId` únic per sessió | Permet analitzar intents múltiples i persistència |
| Validació d'email contra llista blanca | Control d'accés; vincula dades a alumnes reals |
| Bilingüisme CA/ES amb toggle instantani | Inclusió lingüística; atenció a la diversitat |
| Tolerància numèrica (±0.2) en decimals | Evita frustració per errors d'arrodoniment |
| SVG interactius per a la Secció Visual | Aprenentatge kinestèsic: «clic a la hipotenusa» |
| Animacions `framer-motion` | Feedback visual immediat; manté l'atenció |
| `localStorage` per a persistència | L'alumne reprèn on ho va deixar; redueix ansietat |
| Pregunta de desbloqueig gamificada | Activació motivacional; punt d'entrada amable |
| `_a(n)` wrapper + `numbersToExpressions` | Doble capa contra la inspecció de respostes |
| `Resum_alumnes` amb upsert automàtic | Dashboard en temps real per al professor |
| Activitat avaluable col·laborativa (Sec. 4) | Connecta el digital amb la interacció presencial |

---

## 4. Stack Tecnològic Final

| Component | Tecnologia | Versió |
|---|---|---|
| Bundler | Vite | 6.x |
| UI Framework | React | 19.x |
| Tipatge | TypeScript | 5.x |
| Estils | Tailwind CSS | 3.x (CDN) |
| Animacions | framer-motion | 12.x |
| Icones | lucide-react | — |
| IA | Google Gemini API | gemini-3-flash-preview |
| Ofuscació | rollup-plugin-obfuscator | 1.x |
| Backend | Google Apps Script | — |
| Base de dades | Google Sheets (3 fulles) | — |
| Desplegament | GitHub Pages (CI/CD amb GitHub Actions) | — |

---

## 5. Cicles IBD Documentats

| Cicle | Acció | Evidència |
|---|---|---|
| **Cicle 0** | Generació del prototip amb Google AI Studio | Codi monolític inicial |
| **Cicle 1** | Refactorització a components + TypeScript | Estructura modular a `components/`, fitxer `types.ts` |
| **Cicle 2** | Implementació del sistema de tracking (`trackAnswer`) | `utils/trackAnswer.ts`, `apps-script/Code.gs` |
| **Cicle 3** | Protecció de respostes (ofuscació del bundle) | `vite.config.ts` amb configuració d'obfuscator |
| **Cicle 4** | Bilingüisme complet i persistència de progrés | `constants.tsx` amb 100+ claus CA/ES, `localStorage` |
| **Cicle 5** | Refinament del system prompt i agent IA | `AIChat.tsx` amb restriccions temàtiques |
| **Cicle 6** | Validació d'accés amb email gate | `App.tsx` (flux handleStart) + `Code.gs` (doGet validate) |
| **Cicle 7** | Dashboard del professor amb resum automàtic | `updateSummary()` a `Code.gs`, fulla `Resum_alumnes` |
| **Cicle 8** | Secció de resum i consolidació | `SectionSummary.tsx` amb mini-quiz integrat |
| **Cicle 9** | Bateria de repte oculta a la Secció 3 | 10 problemes multi-pas amagats sota un acordió a `SectionTheorem.tsx`; s'activen amb "Ja has acabat? Tens ganes de posar-te a prova?"; inclou diagrama SVG codificat per colors al problema 8 |

---

> **Nota:** Aquest document forma part de la carpeta d'evidències del TFM i il·lustra el procés iteratiu de disseny i millora contínua propi de la metodologia IBD. Cada decisió tècnica ha estat validada en funció del seu impacte educatiu real amb alumnes de 2n d'ESO.
