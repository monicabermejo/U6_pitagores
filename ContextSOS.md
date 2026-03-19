# CONTEXT DEL PROJECTE: SOS Isla X

> Fitxer local — NO es puja a GitHub (inclòs al .gitignore)  
> Última actualització: 25 febrer 2026

---

## Descripció general

Joc educatiu de resolució d'equacions de primer grau. L'estudiant ha naufragat en una illa deserta i ha de resoldre equacions per aconseguir recursos de supervivència i ser rescatat. Construït amb React + TypeScript + Vite + Tailwind CSS.

---

## Repositori i desplegament

- **GitHub:** https://github.com/monicabermejo/sos.git
- **GitHub Pages:** https://monicabermejo.github.io/sos/
- **Dev local:** http://localhost:5173/sos/
- **Auto-push:** git hook `post-commit` fa push automàtic a `origin main` en cada commit
- **CI/CD:** `.github/workflows/deploy.yml` fa build i deploy a GitHub Pages en cada push a `main`

---

## Estructura de fitxers

```
sos-isla-x/
├── App.tsx              # Component principal + tota la UI
├── constants.ts         # Dades de les 9 missions + UI_STRINGS + RESOURCE_LABELS
├── types.ts             # Tipus TypeScript (Mission, GameState, ChatMessage, ResourceType...)
├── index.tsx            # Entry point
├── index.css            # Estils globals + animacions
├── index.html
├── vite.config.ts       # base: '/sos/'
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
├── .gitignore
├── CONTEXT.md           # Aquest fitxer (local, no a GitHub)
├── .github/
│   └── workflows/
│       └── deploy.yml
└── services/
    └── gemini.ts        # Integració IA per a pistes
```

---

## Missions (9 en total)

| ID | Recurs     | Emoji | Equació                                          | Resposta  |
|----|------------|-------|--------------------------------------------------|-----------|
| 1  | water      | 💧    | x + x/3 + 7 = 15                                 | 6         |
| 2  | shelter    | 🏚️   | x + 4x = 30                                      | 6, 24     |
| 3  | fire       | 🔥    | x - 12 = x/4                                     | 16        |
| 4  | food       | 🥥    | 3x + 2 = 17                                      | 5         |
| 5  | medicine   | 🌿    | (enunciat original)                               | 6         |
| 6  | raft       | 🛶    | 2x + 4 = 20                                      | 8         |
| 7  | signal     | 🆘    | (enunciat original)                               | (original)|
| 8  | rescue     | 🚢    | 9x = 45                                          | 5         |
| 9  | escape     | 🏆    | 3 equacions complexes                            | -6, 14, 15|

### Missió 9 — equacions finals (separar respostes per comes)
1. `4(x + 1) − 2(x − 3) = 3(x + 5) + 1` → x = **-6**
2. `(x + 4)/3 + (2x − 1)/6 = (x + 7)/2` → x = **14**
3. `5(x − 2) − 2(3x + 1) = 4(x − 3) − 3(2x − 5)` → x = **15**

### Missions amb resposta múltiple (separades per comes)
- **Missió 2:** `6, 24` (parets, sostre)
- **Missió 9:** `-6, 14, 15`

---

## Lògica de validació de respostes (App.tsx)

```ts
// Si expectedAnswer conté comes → resposta múltiple
const expectedParts = mission.expectedAnswer.split(',').map(s => s.trim());
const isMultiAnswer = expectedParts.length > 1;
if (isMultiAnswer) {
  const userParts = raw.split(',').map(s => s.replace(/x\s*=\s*/i, '').trim());
  isCorrect = userParts.length === expectedParts.length &&
    expectedParts.every((exp, i) => parseFloat(userParts[i]) === parseFloat(exp));
} else {
  const normalized = raw.replace(/x\s*=\s*/i, '').replace(',', '.').trim();
  isCorrect = parseFloat(normalized) === parseFloat(mission.expectedAnswer);
}
```

---

## Funcionalitats implementades

- **9 missions** amb narrativa, enunciat HTML, equació, resposta(es), 3 pistes progressives i feedback
- **Pistes IA** via Gemini (servei a `services/gemini.ts`)
- **Idiomes:** Català (CA) i Castellà (ES), toggle al header
- **Mapa de l'illa** amb posicions fixes per a cada recurs + 7 palmeres repartides
- **Sidebar** amb llista de missions:
  - Bloquejades 🔒 fins que no es completen (en ordre)
  - Missió actual ressaltada en ambre
  - Missions completades en verd
  - En mode rescat: totes bloquejades, missatge "🎉 Joc completat!"
- **Modal de rescat** (popup amb fons borrós) en completar el joc:
  - Botó "📖 Revisar missions" → tanca el modal, mostra xat complet
  - Botó "🏝️ Nova aventura" → reinicia
  - Botó "Veure rescat" al banner del xat per tornar-lo a obrir
- **Botó reset** al header (icona 🔄) amb confirmació via `window.confirm`
- **LocalStorage** per persistir progrés (versió 2)
- **Barra de progrés** al sidebar i al panell lateral de resum

---

## Tipus importants (types.ts)

```ts
type ResourceType = 'water' | 'shelter' | 'fire' | 'food' | 'medicine' | 'raft' | 'signal' | 'rescue' | 'escape';

interface Mission {
  id: number;
  resource: ResourceType;
  emoji: string;
  colorClass: string;
  title: Record<Language, string>;
  narrative: Record<Language, string>;
  challenge: Record<Language, string>;
  equation: string;
  expectedAnswer: string;      // pot ser '6' o '6,24' per respostes múltiples
  hints: Record<Language, string[]>;
  feedback: { wrong: Record<Language, string>; correct: Record<Language, string> };
}

interface GameState {
  currentMission: number;        // índex 0-8
  completedMissions: number[];   // ids de missions completades
  resources: ResourceType[];
  daysOnIsland: number;
  rescued: boolean;
  history: ChatMessage[];
  language: Language;
  hintsUsed: number;
  showHelpModal: boolean;
}
```

---

## Constants destacades

- `STORAGE_KEY = 'sos_isla_x_progress'`
- `STORAGE_VERSION = 2`
- `TOTAL_MISSIONS = 9`
- `RESOURCE_POSITIONS` — posicions % (top/left) de cada recurs al mapa

---

## Decisions de disseny preses

- **Missió 1:** enunciat canviat. Eliminat `(x)` de l'enunciat (ara "quantitat desconeguda d'aigua")
- **Missió 2:** canviat a problema de parets+sostre amb 2 respostes
- **Missió 3:** canviat. "sisena part" → "quarta part" per obtenir resultat enter (x=16)
- **Missió 6:** canviat a problema del doble + faltants
- **Missió 9:** equacions finals complexes amb parèntesis, fraccions i signes negatius
- **Mapa:** 7 palmeres repartides per tota la illa (no totes amunt)
- **Bombolles xat:** `max-w-[82%]` per ocupar millor l'espai
- **Panell illa:** `w-80 lg:w-[26rem] xl:w-[30rem]`
- **Validació multi-resposta:** separació per comes, ordre important
