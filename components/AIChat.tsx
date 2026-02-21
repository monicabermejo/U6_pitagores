import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TEXTS } from '../constants';

interface AIChatProps {
  lang: Language;
}

export const AIChat: React.FC<AIChatProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    
    // Check if API key is available
    if (!process.env.API_KEY) {
      setResponse(lang === 'ca' ? "Error: Manca la clau API." : "Error: Falta la clave API.");
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are Pythagoras. Answer the student's question about geometry or your theorem briefly and encouragingly in ${lang === 'ca' ? 'Catalan' : 'Spanish'}. Keep it simple for a 13 year old. Question: ${input}`;
      
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResponse(result.text || '');
    } catch (error) {
      console.error(error);
      setResponse(lang === 'ca' ? "Ho sento, estic descansant una mica." : "Lo siento, estoy descansando un poco.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform z-50 flex items-center gap-2"
      >
        <Sparkles size={24} />
        <span className="font-bold hidden sm:inline">{TEXTS.ai_help_btn[lang]}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex justify-between items-center bg-indigo-50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
                  🏛️
                </div>
                <h3 className="font-bold text-indigo-900">Pitàgores AI</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
              {response ? (
                <div className="bg-indigo-100 p-4 rounded-xl rounded-tl-none text-indigo-900 shadow-sm">
                   {response}
                </div>
              ) : (
                <p className="text-gray-400 text-center text-sm italic">
                  {TEXTS.ai_placeholder[lang]}
                </p>
              )}
              {loading && <p className="text-center text-xs text-indigo-400 mt-2 animate-pulse">{TEXTS.ai_thinking[lang]}</p>}
            </div>

            <div className="p-4 border-t bg-white rounded-b-2xl flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleAsk}
                disabled={loading}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
