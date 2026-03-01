import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import obfuscator from 'rollup-plugin-obfuscator';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/U6_pitagores/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        // 1. Deshabilitar source maps
        sourcemap: false,
      },
      plugins: [
        react(),
        // 2. Ofuscació del bundle final (només en producció)
        // global:true → usa renderChunk, treballa sobre el JS bundlejat final
        mode === 'production' && obfuscator({
          global: true,
          options: {
            // Renombra variables i funcions a noms hexadecimals (_0x3a2f...)
            identifierNamesGenerator: 'hexadecimal',
            // Encripta strings en base64 → les respostes textuals queden ocultes
            stringArray: true,
            stringArrayEncoding: ['base64'],
            rotateStringArray: true,
            shuffleStringArray: true,
            // Converteix literals numèrics a expressions aritmètiques
            // → answer: 4 apareix com (0x1*0x4+...) en lloc de 4
            numbersToExpressions: true,
            // Separa strings llargs en fragments
            splitStrings: true,
            splitStringsChunkLength: 5,
            // Transforma noms de propietats d'objectes
            transformObjectKeys: true,
            // No activem controlFlowFlattening: infla molt el bundle i pot
            // trencar el runtime de React
            controlFlowFlattening: false,
            deadCodeInjection: false,
            selfDefending: false,
            debugProtection: false,
          },
        }),
      ].filter(Boolean),
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
