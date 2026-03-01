/**
 * trackAnswer
 * -----------
 * Envia les dades d'una resposta al Web App de Google Apps Script.
 */

export interface TrackPayload {
  /** Email identificatiu de l'alumne (validat al servidor) */
  email: string;
  /** Identificador de la pregunta, p.ex. 'rp1', 'basics_q1' */
  questionId: string;
  /** Text complet de la pregunta */
  questionText: string;
  /** Resposta que ha introduït l'alumne */
  userAnswer: string | number;
  /** Resposta correcta */
  correctAnswer: string | number;
  /** Si la resposta és correcta */
  isCorrect: boolean;
  /** Secció de l'app: 'basics' | 'visual' | 'theorem' | 'problems' | 'expert' */
  section: string;
  /** Idioma actiu: 'ca' | 'es' */
  lang: string;
  /** ID de sessió opcional per agrupar respostes d'una mateixa sessió */
  sessionId?: string;
}

import { APPS_SCRIPT_URL } from '../config';

export async function trackAnswer(payload: TrackPayload): Promise<void> {
  if (!APPS_SCRIPT_URL) {
    console.warn("[trackAnswer] URL no definida – no s'ha enviat res.");
    return;
  }
  if (!payload.email) {
    // Sense email no podem identificar l'alumne; no enviem res
    return;
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      // Apps Script no accepta preflight CORS complex → enviem com a text/plain
      // (el servidor llegeix e.postData.contents igualment)
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Falla silenciosament per no bloquejar l'experiència de l'alumne
    console.warn("[trackAnswer] Error enviant resposta:", err);
  }
}
