# Contexto del proyecto X-Hunter — para crear una nueva app relacionada

## Descripción general

**X-Hunter** es una app web educativa interactiva para practicar ecuaciones de primer grado, dirigida a alumnos de secundaria. Está disponible en:
- **URL pública**: https://monicabermejo.github.io/equacions/
- **Repositorio**: https://github.com/monicabermejo/equacions

La "marca" visual y pedagógica del proyecto se llama **X-Hunter**: el alumno "caza la X" resolviendo ecuaciones. La idea central es que cada problema es una misión: encontrar el valor de X.

---

## Stack técnico

| Tecnología | Versión | Uso |
|---|---|---|
| **Vite** | 6 | Bundler / dev server |
| **React** | 19 | UI |
| **TypeScript** | 5 | Tipado |
| **Tailwind CSS** | 3 | Estilos (utility classes) |
| **Font Awesome** | CDN | Iconos (fa-star, fa-bars, etc.) |
| **Google Gemini API** | gemini-2.0-flash | Generación de pistas con IA |
| **localStorage** | - | Persistencia de progreso |
| **GitHub Pages** | - | Despliegue (base: `/equacions/`) |

---

## Estructura del proyecto

```
/x-hunter
  index.html          ← Entry point, carga Tailwind + Font Awesome por CDN
  index.tsx           ← ReactDOM.createRoot
  App.tsx             ← Componente principal (586 líneas), toda la lógica y UI
  constants.ts        ← Los 26 problemas definidos estáticamente
  types.ts            ← Tipos: Level, AppState, ChatMessage, Language
  services/
    gemini.ts         ← Llamada a la API de Gemini para generar pistas
  vite.config.ts      ← base: '/equacions/'
  package.json
  tsconfig.json
  .github/workflows/deploy.yml  ← CI/CD a GitHub Pages
```

---

## Tipos clave (types.ts)

```typescript
export type Language = 'ca' | 'es';  // catalán o castellano

export interface Level {
  id: number;
  title: Record<Language, string>;
  equation: Record<Language, string>;
  expectedAnswer: string; // valor numérico de X
}

export interface AppState {
  currentLevel: number;       // índice del nivel activo (0-based)
  completedLevels: number[];  // ids de problemas completados
  hintsUsed: number;
  completed: boolean;
  history: ChatMessage[];
  totalLevels: number;        // 26
  language: Language;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}
```

---

## Los 26 problemas (constants.ts)

Cada problema es un objeto `StaticLevel` con:
- `id`: 1–26
- `category`: `'repaso' | 'facil' | 'intermedio' | 'dificil'`
- `title`: `{ ca, es }` → "Problema 1" … "Problema 26"
- `equation`: `{ ca, es }` → enunciado del problema en texto
- `expectedAnswer`: string numérico (p.ej. `"7"`)
- `hints`: `{ ca: string[], es: string[] }` → 3 pistas progresivas
- `feedback.wrong`: `{ ca, es }` → mensaje cuando la respuesta es incorrecta

### Distribución por categoría

| Categoría | IDs | Color UI | Descripción |
|---|---|---|---|
| `repaso` | 1–6 | slate/gris | Ecuaciones simples: x+8=15, 4x=24… |
| `facil` | 7–12 | emerald/verde | Ecuaciones algo más elaboradas |
| `intermedio` | 13–18 | amber/amarillo | Dos pasos, fracciones simples |
| `dificil` | 19–26 | rose/rojo | Problemas de contexto (palabras): bales, granja, velas… |

### Ejemplos de problemas

- **P1** (repaso): `x + 8 = 15` → x=7
- **P7** (facil): `2(x + 3) = 14` → x=4
- **P13** (intermedio): `x/3 + 2 = 5` → x=9
- **P19** (dificil): Una bossa té bales de tres colors… → x=12
- **P25** (dificil): Granja con pollos y conejos… → x=8
- **P26** (dificil): `20 - 2x = 14 - x` (problema velas) → x=6

---

## UI / UX en App.tsx

### Layout general (h-screen, sin scroll en header)

```
┌─────────────────────────────────────┐
│ HEADER (fijo, 2 filas)              │
│  fila 1: ☰  X-Hunter  CA|ES  ?      │
│  fila 2: ★  ★  ★  ★  (4 estrellas) │
├─────────────────────────────────────┤
│ MAIN (overflow-y: scroll)           │
│  Chat messages (burbujas)           │
│  Input bar (fija abajo de main)     │
├─────────────────────────────────────┤
│ FOOTER: barra de progreso           │
│  "X/26 problemes completats"        │
└─────────────────────────────────────┘
```

### Sidebar (menú lateral)

- Se abre con ☰
- Agrupa los 26 problemas en 4 secciones con colores
- Cada item muestra: badge de categoría + título del problema + ✓ si completado
- `jumpToLevel(index)` salta directamente a cualquier problema

### Sistema de estrellas

- 4 estrellas en el header, una por categoría
- Se ilumina cuando el alumno completa **≥ 2 problemas** de esa categoría
- Colores: ⭐ gris (repaso) / ⭐ verde (facil) / ⭐ amarillo (intermedio) / ⭐ rojo (dificil)

### Flujo de chat (mecánica principal)

1. El asistente presenta el enunciado del problema
2. El alumno escribe su respuesta (`x=5` o simplemente `5`)
3. Si es correcta: mensaje de celebración → avanza automáticamente al siguiente nivel
4. Si es incorrecta: feedback específico + opción de pedir `pista`
5. Si escribe `pista`: se llama a Gemini API para generar una pista contextual; si falla, se usa la pista estática del array `hints`

### Persistencia

```typescript
const STORAGE_KEY = 'xhunter_progress';
// Se guarda AppState completo en localStorage en cada cambio
// Se carga al iniciar la app
```

### Bilingüismo

- Toggle CA/ES en el header
- Al cambiar idioma: se regenera el historial del chat en el nuevo idioma
- `UI_STRINGS` contiene todos los textos de la interfaz
- Todos los problemas tienen texto en `ca` y `es`

### Modal de ayuda

- Botón `?` en el header
- Modal con 4 pasos explicativos (íconos Font Awesome + título + descripción)
- Disponible en catalán y castellano

---

## Decisiones de diseño pedagógico

- **Sin bloqueos**: todos los niveles son accesibles desde el menú desde el inicio
- **Progreso no lineal**: el alumno puede resolver problemas en cualquier orden
- **Pistas progresivas**: 3 pistas por problema, de más general a más específica
- **IA como apoyo**: Gemini genera pistas contextuales si el servicio está disponible
- **Feedback inmediato**: respuesta correcta/incorrecta al momento
- **Sin tiempo límite**: ritmo propio del alumno

---

## Ideas para una nueva app relacionada

La nueva app debería mantener la misma **identidad pedagógica** (aprender matemáticas de forma lúdica) y podría conectar con X-Hunter de estas formas:

### Opciones de juego relacionado

1. **X-Builder** (inverso): en lugar de resolver ecuaciones, el alumno *construye* una ecuación que tenga como solución un valor X dado. Parte creativa y de pensamiento inverso.

2. **Equation Duel** (multijugador local): dos alumnos compiten en tiempo real para resolver la misma ecuación. El primero en responder correctamente gana un punto.

3. **X-TimeAttack**: modo contrarreloj. El alumno tiene 60 segundos para resolver tantas ecuaciones como pueda (variante arcade de X-Hunter).

4. **Escape de la X**: formato escape room. Para "escapar" de cada sala hay que resolver una serie de ecuaciones en orden, con historia narrativa.

5. **X-Puzzle**: las ecuaciones se presentan como piezas de puzle o como conexiones en un grafo. El alumno tiene que ordenar los pasos de resolución (drag & drop).

### Reutilización técnica sugerida

- Mismo stack: **Vite + React + TypeScript + Tailwind**
- Reutilizar el archivo `constants.ts` (los 26 problemas) como banco de ecuaciones
- Reutilizar el servicio de **Gemini** para pistas o narrativa
- Mismo sistema de **localStorage** para persistencia
- Mismo sistema de **estrellas/logros** por categoría
- Desplegable en **GitHub Pages** con el mismo workflow de CI/CD

---

## Resumen técnico para empezar un nuevo proyecto relacionado

```
- Stack: Vite 6 + React 19 + TypeScript + Tailwind CSS
- Font Awesome para iconos (CDN en index.html)
- Google Gemini API (gemini-2.0-flash) para IA
- Los 26 problemas reutilizables: ecuaciones de 1er grado, 4 niveles de dificultad
- Bilingüe: catalán (ca) y castellano (es)
- Despliegue: GitHub Pages con GitHub Actions
- La "marca" es X-Hunter: cazar el valor de X
- Audience: alumnos de secundaria, profesores de matemáticas
```
