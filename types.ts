import React from 'react';

export type Language = 'ca' | 'es';

export interface Translations {
  [key: string]: {
    ca: string;
    es: string;
  };
}

export interface Question {
  id: string;
  question: { ca: string; es: string };
  answer: number;
  unit?: string;
  image?: React.ReactNode;
}

export interface SectionProps {
  lang: Language;
  onComplete: () => void;
  isLocked: boolean;
}