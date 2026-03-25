import React, { useState, useEffect } from 'react';
import { TEXTS } from './constants';
import { Language } from './types';
import { APPS_SCRIPT_URL } from './config';
import { SectionBasics } from './components/SectionBasics';
import { SectionVisual } from './components/SectionVisual';
import { SectionTheorem } from './components/SectionTheorem';
import { SectionProblems } from './components/SectionProblems';
import { SectionExpert } from './components/SectionExpert';
import { SectionSummary } from './components/SectionSummary';
import { RefreshCw, Globe, ChevronRight } from 'lucide-react';

/** Genera un ID de sessió curt i aleatori */
function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ca');
  const [level, setLevel] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  const [started, setStarted] = useState(false);
  // Session key acts as a seed to force full component re-initialization on reset
  const [sessionKey, setSessionKey] = useState(0);
  const [studentEmail, setStudentEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [validating, setValidating] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [sessionId] = useState<string>(generateSessionId);
  // Prevents flash of email screen before localStorage is read
  const [ready, setReady] = useState(false);

  // Load progress
  useEffect(() => {
    const savedLevel = localStorage.getItem('pythagoras_level');
    const savedLang = localStorage.getItem('pythagoras_lang');
    if (savedLevel) {
      setLevel(parseInt(savedLevel));
      // If we have a saved level, we assume the user has started before, 
      // but strictly following the flow, we let them click start unless we want to auto-resume.
      // Let's keep strict "Start" flow but restore level.
    }
    if (savedLang) setLang(savedLang as Language);
    const savedEmail = localStorage.getItem('pythagoras_email');
    if (savedEmail) setStudentEmail(savedEmail);
    setReady(true);
  }, []);

  const updateLevel = (newLevel: number) => {
    if (newLevel > level) {
      setLevel(newLevel);
      localStorage.setItem('pythagoras_level', newLevel.toString());
    }
    setActiveSection(newLevel);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLang = () => {
    const newLang = lang === 'ca' ? 'es' : 'ca';
    setLang(newLang);
    localStorage.setItem('pythagoras_lang', newLang);
  };

  const resetProgress = () => {
    const msg = lang === 'ca' 
      ? "Estàs segur que vols reiniciar tot el progrés? S'esborraran totes les dades." 
      : "¿Estás seguro de que quieres reiniciar todo el progreso? Se borrarán todos los datos.";
      
    if (window.confirm(msg)) {
      // 1. Clear ALL storage related to the app
      localStorage.removeItem('pythagoras_level');
      localStorage.removeItem('pythagoras_lang');
      localStorage.removeItem('pythagoras_email');
      
      // 2. Reset all states to default
      setLang('ca');
      setLevel(1);
      setActiveSection(1);
      setStarted(false);
      setStudentEmail('');
      setEmailInput('');
      
      // 3. Force full re-render of components (clears inputs and chat)
      setSessionKey(prev => prev + 1); 
      
      // 4. Reset scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStart = async () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      setEmailError(true);
      setUnauthorized(false);
      return;
    }
    setEmailError(false);
    setUnauthorized(false);

    if (APPS_SCRIPT_URL) {
      setValidating(true);
      try {
        const res = await fetch(
          `${APPS_SCRIPT_URL}?action=validate&email=${encodeURIComponent(trimmed)}`
        );
        const json = await res.json();
        if (!json.authorized) {
          setUnauthorized(true);
          setValidating(false);
          return;
        }
      } catch {
        // Si falla la xarxa, el servidor rebutjarà igualment els no autoritzats
      }
      setValidating(false);
    }

    setStudentEmail(trimmed);
    localStorage.setItem('pythagoras_email', trimmed);
    setStarted(true);
  };

  // Wait until localStorage has been read to avoid showing the email screen
  // briefly even when a saved email exists
  if (!ready) return null;

  if (!studentEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="text-6xl mb-4 animate-bounce">📐</div>
          <h1 className="text-4xl font-black text-gray-800">{TEXTS.welcome_title[lang]}</h1>
          <p className="text-gray-500 text-lg">{TEXTS.welcome_desc[lang]}</p>

          {/* Email d'identificació */}
          <div className="text-left">
            <label className="block text-sm font-bold text-gray-600 mb-1">
              {lang === 'ca' ? 'Correu electrònic' : 'Correo electrónico'}
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setEmailError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder={lang === 'ca' ? 'el.teu@correu.com' : 'tu@correo.com'}
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-700 outline-none transition-colors ${
                emailError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">
                {lang === 'ca' ? 'Introdueix un correu vàlid.' : 'Introduce un correo válido.'}
              </p>
            )}
            {unauthorized && (
              <p className="text-red-500 text-sm mt-1">
                {lang === 'ca'
                  ? 'Aquest correu no està registrat. Demana-ho al professor.'
                  : 'Este correo no está registrado. Pídelo al profesor.'}
              </p>
            )}
          </div>

          <button 
            onClick={handleStart}
            disabled={validating}
            className="w-full bg-indigo-600 text-white text-xl font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            {validating
              ? (lang === 'ca' ? 'Verificant...' : 'Verificando...')
              : TEXTS.start_btn[lang]}
          </button>
          
          <button onClick={toggleLang} className="text-gray-400 hover:text-indigo-600 font-bold flex items-center justify-center gap-2 w-full">
            <Globe size={16} /> {lang === 'ca' ? 'Canviar a Castellano' : 'Canviar a Català'}
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 1, title: TEXTS.section_1_title[lang], Component: SectionBasics },
    { id: 2, title: TEXTS.section_2_title[lang], Component: SectionVisual },
    { id: 3, title: TEXTS.section_3_title[lang], Component: SectionTheorem },
    { id: 4, title: TEXTS.section_4_title[lang], Component: SectionProblems },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-black text-xl md:text-2xl text-indigo-900 flex items-center gap-2">
            <span className="text-2xl">📐</span> {TEXTS.title[lang]}
          </h1>
          
          <div className="flex gap-2">
             <button onClick={toggleLang} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-sm border border-gray-200">
               {lang.toUpperCase()}
             </button>
             <button 
               type="button"
               onClick={resetProgress} 
               className="px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-bold text-sm flex items-center gap-2 transition-colors border border-red-100 cursor-pointer" 
               title={TEXTS.reset[lang]}
             >
               <RefreshCw size={16} />
               <span className="hidden sm:inline">{lang === 'ca' ? 'Reiniciar' : 'Reset'}</span>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        
        {/* Navigation / Progress Map */}
        <div className="flex flex-wrap gap-1.5 mb-6">
           {sections.map((sec) => (
             <button 
               key={sec.id}
               onClick={() => level >= sec.id && setActiveSection(sec.id)}
               className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all whitespace-nowrap ${
                 activeSection === sec.id 
                   ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                   : level >= sec.id 
                     ? 'bg-white text-indigo-600 border border-indigo-200' 
                     : 'bg-gray-200 text-gray-400 cursor-not-allowed'
               }`}
             >
               {sec.title}
             </button>
           ))}
           {/* Expert Level Badge */}
           {level > 4 && (
             <button 
                onClick={() => setActiveSection(5)}
                className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-sm transition-all ${activeSection === 5 ? 'bg-yellow-400 text-yellow-900 scale-105 shadow-md' : 'bg-yellow-100 text-yellow-800'}`}
             >
               ⭐ Expert
             </button>
           )}
           {/* Summary Badge — always visible */}
           <button
             onClick={() => setActiveSection(6)}
             className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-sm transition-all ${activeSection === 6 ? 'bg-violet-600 text-white scale-105 shadow-md' : 'bg-violet-100 text-violet-800'}`}
           >
             🚀 {lang === 'ca' ? 'Resum' : 'Resumen'}
           </button>
        </div>

        {/* Active Section Content */}
        <div className="space-y-8">
          {sections.map(sec => {
             // Only render the active section to save DOM nodes and focus
             if (sec.id !== activeSection) return null;
             
             // The key includes sessionKey, forcing a full remount (and state reset) when sessionKey changes
             return (
               <div key={`sec-${sec.id}-${sessionKey}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <sec.Component 
                   lang={lang} 
                   isLocked={level < sec.id}
                   onComplete={() => updateLevel(sec.id + 1)}
                   studentEmail={studentEmail}
                   sessionId={sessionId}
                 />
               </div>
             )
          })}
          
          {/* Extension Content (Only shows if unlocked) */}
          {activeSection === 5 && (
             <div key={`expert-${sessionKey}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SectionExpert lang={lang} studentEmail={studentEmail} sessionId={sessionId} />
             </div>
          )}

          {/* Summary — always visible */}
          {activeSection === 6 && (
             <div key={`summary-${sessionKey}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SectionSummary lang={lang} />
             </div>
          )}
        </div>

        {/* Next Section Teaser (if current is done but user scrolled back) */}
        {activeSection < level && activeSection < 4 && (
           <div className="flex justify-center mt-12 opacity-50 hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setActiveSection(activeSection + 1)}
                className="flex items-center gap-2 font-bold text-indigo-400"
              >
                Anar a la següent <ChevronRight />
              </button>
           </div>
        )}

      </main>

      <footer className="text-center pb-6 pt-2">
        <span className="text-xs italic text-gray-400">© Mónica Bermejo Abellán</span>
      </footer>

    </div>
  );
};

export default App;