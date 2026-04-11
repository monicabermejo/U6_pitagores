# CONTEXT DEL PROJECTE: Pitàgores

## Descripció General

**Pitàgores** és una aplicació web educativa interactiva per aprendre el **Teorema de Pitàgores** (a² + b² = c²).

- **Audiència**: Alumnes de 2n d'ESO (~13 anys)
- **Idiomes**: Català (ca) / Castellà (es) — toggle en temps real sense perdre el progrés
- **Format**: Una pàgina amb 5 seccions desblocables en ordre + una secció extra opcional
- **IA integrada**: Assistent "Pitàgores" (Google Gemini gemini-2.0-flash) disponible en qualsevol moment
- **Avaluació**: Cada resposta s'envia a un Google Sheet del professor via Apps Script

---

## Repositori i Desplegament

| Concepte       | URL                                                              |
|----------------|------------------------------------------------------------------|
| Repositori     | https://github.com/monicabermejo/U6_pitagores                   |
| GitHub Pages   | https://monicabermejo.github.io/U6_pitagores/                   |
| Apps Script    | https://script.google.com/macros/s/AKfycby-W5ibyyd0q_SsQLaREAFsBjgUXPGQhQCJs1kClJKf6zIJpP2ylca0byD54ypNfdie/exec |
| CI/CD          | GitHub Actions → deploy en cada push a `main`                   |

---

## Stack Tecnològic

| Tecnologia               | Versió  | Ús                                        |
|--------------------------|---------|-------------------------------------------|
| Vite                     | 6.x     | Build i dev server                        |
| React                    | 19.x    | UI                                        |
| TypeScript               | 5.x     | Tipatge estàtic                           |
| Tailwind CSS             | 3.x     | Estils                                    |
| framer-motion            | 11.x    | Animacions (sections, feedback)           |
| lucide-react             | —       | Icones                                    |
| Google Gemini API        | 2.0-flash | IA del xat de Pitàgores                 |
| rollup-plugin-obfuscator | —       | Ofuscació del bundle JS (protegir respostes) |
| Google Apps Script       | —       | Web app que rep dades → Google Sheets     |

---

## Estructura de Fitxers

```
/
├── App.tsx                    # Estat global, email gate, navegació entre seccions
├── config.ts                  # URL de l'Apps Script (hardcoded)
├── constants.tsx              # Tots els textos bilingües (TEXTS) + 14 REAL_PROBLEMS
├── types.ts                   # Tipus TypeScript (Question, SectionProps, Language...)
├── index.tsx                  # Punt d'entrada React
├── index.html                 # HTML base (Google Fonts)
├── vite.config.ts             # Build config: sourcemap:false + obfuscator
├── metadata.json              # Metadades del projecte
├── package.json
├── tsconfig.json
│
├── components/
│   ├── SectionBasics.tsx      # Secció 1: Recordatori (triangles, àrea/perímetre, arrels)
│   ├── SectionVisual.tsx      # Secció 2: Identificació Visual (clic a la hipotenusa)
│   ├── SectionTheorem.tsx     # Secció 3: El Teorema (història, demostració, drill 12 problemes)
│   ├── SectionProblems.tsx    # Secció 4: Problemes Reals (14 problemes contextualitzats)
│   ├── SectionExpert.tsx      # Extra: Nivell Expert (ternes pitagòriques)
│   └── AIChat.tsx             # Xat flotant amb Gemini (assistent "Pitàgores")
│
├── utils/
│   └── trackAnswer.ts         # Envia respostes a Apps Script (POST JSON)
│
└── apps-script/
    └── Code.gs                # Google Apps Script: doPost, validació email, escriu al Sheet
```

---

## Tipus TypeScript Principals

```typescript
type Language = 'ca' | 'es';

interface Question {
  id: string;
  question: { ca: string; es: string };
  answer: number;
  unit?: string;
  image?: string;
}

interface SectionProps {
  lang: Language;
  onComplete: () => void;
  isLocked: boolean;
  studentEmail: string;
  sessionId: string;
}

interface Translations {
  [key: string]: { ca: string; es: string };
}
```

---

## Seccions de l'App

### Flux General (App.tsx)

```
[Email Gate] → [Pantalla Benvinguda] → [Sec 1] → [Sec 2] → [Sec 3] → [Sec 4] → [Extra]
                                              ↑ cada secció desbloqueja la següent en completar-la
```

- L'email s'emmagatzema a `localStorage('pythagoras_email')`
- Es valida contra la llista d'autoritzats al Google Sheet (tab "Alumnes_autoritzats")
- `sessionId` = `Date.now().toString(36) + random` — nou per sessió, permet veure quantes vegades un alumne fa cada problema

---

### Secció 1 — Recordatori (`SectionBasics.tsx`)

Contingut teòric + 3 activitats pràctiques:

| Activitat              | ID de tracking             | Resposta correcta                          |
|------------------------|----------------------------|--------------------------------------------|
| Tipus de triangle (MC) | `basics_q1_triangle_type`  | `b` (Rectangle i Isòsceles)               |
| Àrea + Perímetre (5 figs) | `basics_area_perimeter` | Q1: P=20, A=25 / Q2: P=16, A=12 / Q3: P=31.4, A=78.5 / Q4: P=18, A=20.25 / Q5: P=180, A=1560 |
| Arrels Quadrades (3)   | `basics_square_roots`      | √25=5 / √10≈3.1–3.2 / √30 entre 5 i 6    |

---

### Secció 2 — Identificació Visual (`SectionVisual.tsx`)

4 triangles rectangles renderitzats amb SVG. L'alumne ha de fer clic al costat que és la **hipotenusa** (el costat més llarg, oposat a l'angle recte).

| ID                        | Resposta |
|---------------------------|----------|
| `visual_hypotenuse_t1`    | Correcta si clica la hipotenusa |
| `visual_hypotenuse_t2`    | " |
| `visual_hypotenuse_t3`    | " |
| `visual_hypotenuse_t4`    | " |

---

### Secció 3 — El Teorema (`SectionTheorem.tsx`)

Contingut: Històries de la Germandat Pitagòrica (acordió), demostració visual, guia de càlcul.

**Drill de 12 problemes de càlcul:**

| ID           | Enunciat                          | Busques | Resposta |
|--------------|-----------------------------------|---------|----------|
| `theorem_drill_q1`  | c₁ = 3, c₂ = 4                | h       | **5**    |
| `theorem_drill_q2`  | h = 10, c = 8                  | c       | **6**    |
| `theorem_drill_q3`  | c₁ = 5, c₂ = 12               | h       | **13**   |
| `theorem_drill_q4`  | h = 13, c = 12                 | c       | **5**    |
| `theorem_drill_q5`  | c₁ = 6, c₂ = 8                | h       | **10**   |
| `theorem_drill_q6`  | h = 15, c = 9                  | c       | **12**   |
| `theorem_drill_q7`  | c₁ = 8, c₂ = 15               | h       | **17**   |
| `theorem_drill_q8`  | h = 25, c = 7                  | c       | **24**   |
| `theorem_drill_q9`  | c₁ = 9, c₂ = 40               | h       | **41**   |
| `theorem_drill_q10` | h = 20, c = 16                 | c       | **12**   |
| `theorem_drill_q11` | c₁ = 7, c₂ = 24               | h       | **25**   |
| `theorem_drill_q12` | h = 39, c = 36                 | c       | **15**   |

**Repte Ocult — 10 problemes multi-pas (optatiu, per als qui acaben aviat):**

> S'activa prement el botó "Ja has acabat? Tens ganes de posar-te a prova?" que apareix amagat sota el drill. Accepta ±0.05 d'error i demana el resultat amb dos decimals.

| ID                         | Títol                              | Resposta |
|----------------------------|------------------------------------|----------|
| `theorem_challenge_ch1`    | L'alçada del triangle equilàter    | ≈ 10.39  |
| `theorem_challenge_ch2`    | El rombe i la seva àrea            | 10       |
| `theorem_challenge_ch3`    | El quadrat des de la diagonal      | ≈ 7.07   |
| `theorem_challenge_ch4`    | L'àrea del triangle isòsceles      | 48       |
| `theorem_challenge_ch5`    | La diagonal del rectangle          | 50       |
| `theorem_challenge_ch6`    | El trapezi isòsceles               | 60       |
| `theorem_challenge_ch7`    | L'apotema de l'hexàgon             | ≈ 6.93   |
| `theorem_challenge_ch8`    | La corda i la circumferència       | 24       |
| `theorem_challenge_ch9`    | Del perímetre a la diagonal        | 10       |
| `theorem_challenge_ch10`   | Figura composta (Rectangle + Triangle) | 5    |

---

### Secció 4 — Problemes Reals (`SectionProblems.tsx`)

#### Exemples Guiats (3 targetes amb SVG)

Abans de la bateria de 14 problemes, hi ha 3 exemples guiats amb il·lustració i resolució desplegable:

| #  | Situació                          | Dades         | Resposta | Unitat |
|----|-----------------------------------|---------------|----------|--------|
| 1  | Escala recolzada a la paret       | h=5, base=4   | **3**    | m      |
| 2  | Arbre i ombra (copa→punta ombra)  | alt=6, ombra=8| **10**   | m      |
| 3  | Drecera pel parc rectangular      | 5×12          | **13**   | m      |

#### Bateria de 14 problemes contextualitzats

14 problemes contextualitzats. L'alumne els resol un per un amb input numèric. Bilingues (ca/es).

| ID    | Tema                         | Busques  | Resposta | Unitat |
|-------|------------------------------|----------|----------|--------|
| rp1   | Escala recolzada a la paret  | catet (h)| **4**    | m      |
| rp2   | Diagonal d'un camp de futbol | hipotenusa| **150** | m      |
| rp3   | Tirolina al parc d'aventures | hipotenusa| **17**  | m      |
| rp4   | Rampa del skatepark          | catet    | **4**    | m      |
| rp5   | Diagonal d'una TV            | catet    | **30**   | "      |
| rp6   | Drecera de la Maria al parc  | hipotenusa| **500** | m      |
| rp7   | Corda de la tenda de campanya| hipotenusa| **2.5** | m      |
| rp8   | Estel a la platja            | catet    | **15**   | m      |
| rp9   | Cable de seguretat d'antena  | hipotenusa| **25**  | m      |
| rp10  | Diagonal d'un armari         | hipotenusa| **2.5** | m      |
| rp11  | Diagonal d'una tablet        | hipotenusa| **15**  | cm     |
| rp12  | Fil des del fanal a l'ombra  | hipotenusa| **5**   | m      |
| rp13  | Diagonal d'una plaça de pàrquing| hipotenusa| **6.5**| m   |
| rp14  | Costat desconegut de l'hort  | catet    | **8**    | m      |

---

### Extra — Nivell Expert (`SectionExpert.tsx`)

Contingut: História dels egipcis i la corda de 12 nusos. Ternes pitagòriques primitives i derivades.

| Activitat              | ID de tracking           | Resposta correcta |
|------------------------|--------------------------|-------------------|
| Repte: terna (3,4,5)×2 | `expert_challenge_terna` | `6, 8, 10`        |
| Laboratori de ternes   | `expert_lab_terna`       | Qualsevol terna vàlida (p.e. 3,4,5 / 5,12,13 / 8,15,17) |

**Ternes pitagòriques primitives** mencionades:
- (3, 4, 5)
- (5, 12, 13)
- (8, 15, 17)

---

## Lògica de Validació (SectionProblems)

```typescript
// Validació numèrica amb tolerància per decimals
const checkCurrent = () => {
  const userVal = parseFloat(userAnswer.trim());
  const correct = REAL_PROBLEMS[currentIndex].answer;
  const isCorrect = Math.abs(userVal - correct) < 0.1;
  
  if (isCorrect) {
    setCorrectCount(prev => prev + 1);
    // avança al següent problema
  }
  trackAnswer({ ..., isCorrect });
};
```

---

## Integració Google Sheets (trackAnswer + Apps Script)

### Payload enviat per cada resposta

```typescript
interface TrackPayload {
  email: string;        // correu de l'alumne
  questionId: string;   // p.ex. "rp1", "theorem_drill_q3"
  questionText: string; // enunciat en l'idioma actiu
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  section: 'basics' | 'visual' | 'theorem' | 'problems' | 'expert';
  lang: 'ca' | 'es';
  sessionId: string;
}
```

### Estructura del Google Sheet

| Tab                  | Contingut                                                  |
|----------------------|------------------------------------------------------------|
| `Alumnes_autoritzats`| Columna A: emails autoritzats / Columna B: nom alumne      |
| `Respostes`          | Log de cada resposta (timestamp, email, nom, secció, questionId, resposta, correcta, isCorrect, idioma, sessionId) |
| `Resum_alumnes`      | Una fila per alumne: total correctes, total intents, última connexió |

---

## Seguretat

- **Source maps**: desactivats (`build.sourcemap: false`)
- **Ofuscació JS**: `rollup-plugin-obfuscator` amb `global:true` (opera sobre el bundle final)
  - `identifierNamesGenerator: 'hexadecimal'`
  - `stringArray: true` + `stringArrayEncoding: ['base64']`
  - `numbersToExpressions: true`
  - `transformObjectKeys: true`
  - `splitStrings: true`
- **Wrapper `_a()`**: totes les respostes de constants.tsx van embolicades en `_a(n)` per evitar que Rollup les inlini com literals llegibles al bundle

---

## Persistència (localStorage)

```typescript
localStorage.setItem('pythagoras_email', email);      // email de l'alumne
localStorage.setItem('pythagoras_progress', JSON.stringify(progress)); // seccions completades
```

---

## Decisions de Disseny Pedagògic

- **Desbloqueig seqüencial**: cada secció es desbloqueja en completar l'anterior (secció 4 requereix fer un mínim de problemes)
- **Secció Extra sempre visible**: no és obligatòria, és per als alumnes més avançats
- **Feedback immediat**: ✅/❌ al moment de comprovar
- **IA com a suport**: l'alumne pot demanar ajuda a "Pitàgores" en qualsevol moment sense perdre el progrés
- **Bilingüisme transparent**: canvi d'idioma instantani, tot el contingut té versió CA i ES
- **Narrativa**: Història de la Germandat Pitagòrica (faves, Hipas, etc.) per enganxar l'interès
- **Connexió real**: Els 14 problemes usen contextos propers (skatepark, TV, càmping, futbol...)

---

## Ideas per a un Jeu Relacionat

La nova app hauria de mantenir la mateixa **identitat pedagògica** i podria reutilitzar el contingut de Pitàgores:

### Opcions de joc relacionat

1. **Pitagoràdex** (col·leccionista): cada terna pitagòrica descoberta és una "criatura" que es col·lecciona. L'alumne ha de trobar ternes introduïnt nombres o resolent problemes per "capturar-les".

2. **Construeix la Piràmide** (narratiu): joc d'escapada ambientat a l'Egipte antic. Per construir cada bloc de la piràmide cal resoldre un problema de Pitàgores. Format escape room amb finals alternatius.

3. **Pitàgores vs Estiu** (contrarellotge): variant arcade. 60 segons per resoldre tants problemes de la secció 4 com sigui possible. Puntuació que es pot compartir.

4. **El Misteri dels Triangles** (investigació): l'alumne rep un plànol amb distàncies desconegudes i ha de trobar valors ocults resolent encadenaments de Pitàgores (la resposta d'un problema és un catet del següent).

5. **Dual Pitàgores** (dos jugadors): dos alumnes en el mateix dispositiu resolent el mateix problema. El primer en respondre correctament guanya el punt.

### Reutilització tècnica suggerida

- Mateix stack: **Vite + React + TypeScript + Tailwind**
- Reutilitzar `REAL_PROBLEMS` (14 problemes) i el drill de 12 com a banc de preguntes
- Reutilitzar el servei **Gemini** per pistes contextuals
- Reutilitzar `trackAnswer.ts` i l'Apps Script per registrar el progrés
- Reutilitzar el sistema de **desbloqueig/estreles** per categories (triangles simples, triangles contextualitzats, ternes)
- Desplegable a **GitHub Pages** amb el mateix workflow CI/CD

---

## Resum Tècnic per Iniciar un Nou Projecte Relacionat

```
Stack: Vite 6 + React 19 + TypeScript + Tailwind CSS + framer-motion
IA: Google Gemini API (gemini-2.0-flash) per pistes i narrativa
Problemes reutilitzables:
  - 14 problemes reals (rp1–rp14) amb respostes numèriques exactes
  - 12 càlculs de drill (hipotenusa/catet) amb ternes pitagòriques
  - 3 ternes primitives narrables: (3,4,5), (5,12,13), (8,15,17)
Bilingüe: català (ca) i castellà (es)
Edat objectiu: 13 anys (2n ESO)
Fórmula central: a² + b² = c² (Teorema de Pitàgores)
Desplegament: GitHub Pages amb GitHub Actions
Tracking: Google Apps Script → Google Sheets (email, questionId, isCorrect, sessionId)
```
