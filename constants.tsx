import { Translations, Question } from './types';
import React from 'react';

export const TEXTS: Translations = {
  title: { ca: "Unitat 6: Pitàgores", es: "Unidad 6: Pitágoras" },
  reset: { ca: "Reiniciar Progrés", es: "Reiniciar Progreso" },
  welcome_title: { ca: "Benvinguts a l'Aventura!", es: "¡Bienvenidos a la Aventura!" },
  welcome_desc: { ca: "Esteu preparats per resoldre el repte i convertir-vos en experts?", es: "¿Estáis preparados para resolver el reto y convertiros en expertos?" },
  start_btn: { ca: "Comencem! 🚀", es: "¡Empecemos! 🚀" },
  section_1_title: { ca: "1️⃣ Recordatori", es: "1️⃣ Recordatorio" },
  section_2_title: { ca: "2️⃣ Identificació Visual", es: "2️⃣ Identificación Visual" },
  section_3_title: { ca: "3️⃣ El Teorema", es: "3️⃣ El Teorema" },
  section_4_title: { ca: "4️⃣ Problemes Reals", es: "4️⃣ Problemas Reales" },
  section_ext_title: { ca: "Extra: Nivell Expert", es: "Extra: Nivel Experto" },
  check: { ca: "Comprovar", es: "Comprobar" },
  correct: { ca: "Correcte! 🎉", es: "¡Correcto! 🎉" },
  incorrect: { ca: "Torna-ho a provar 😅", es: "Inténtalo de nuevo 😅" },
  locked: { ca: "Bloquejat", es: "Bloqueado" },
  completed: { ca: "Completat", es: "Completado" },
  next_section: { ca: "Següent Secció 🔓", es: "Siguiente Sección 🔓" },
  
  // AI Chat
  ai_help_btn: { ca: "Pregunta a Pitàgores (IA)", es: "Pregunta a Pitágoras (IA)" },
  ai_placeholder: { ca: "Hola, sóc Pitàgores. Què vols saber?", es: "Hola, soy Pitágoras. ¿Qué quieres saber?" },
  ai_thinking: { ca: "Pitàgores està pensant...", es: "Pitágoras está pensando..." },
  
  // Section 1 - Theory
  s1_intro: { ca: "Abans d'entrar en matèria, hem de repassar els conceptes bàsics de geometria i càlcul.", es: "Antes de entrar en materia, debemos repasar los conceptos básicos de geometría y cálculo." },
  s1_classif_title: { ca: "Classificació de Triangles", es: "Clasificación de Triángulos" },
  s1_two_names_title: { ca: "Un triangle pot tenir dos noms alhora:", es: "Un triángulo puede tener dos nombres a la vez:" },
  
  // Classification
  s1_class_sides: { ca: "Segons els Costats", es: "Según los Lados" },
  s1_class_angles: { ca: "Segons els Angles", es: "Según los Ángulos" },
  s1_equilateral: { ca: "Equilàter", es: "Equilátero" },
  s1_isosceles: { ca: "Isòsceles", es: "Isósceles" },
  s1_scalene: { ca: "Escalè", es: "Escaleno" },
  s1_acute: { ca: "Acutangle", es: "Acutángulo" },
  s1_right: { ca: "Rectangle", es: "Rectángulo" },
  s1_obtuse: { ca: "Obtusangle", es: "Obtusángulo" },
  s1_warning_title: { ca: "ATENCIÓ: EL PROTAGONISTA", es: "ATENCIÓN: EL PROTAGONISTA" },
  s1_warning_text: { ca: "En aquest tema NOMÉS treballarem amb Triangles Rectangles (90°).", es: "En este tema SOLO trabajaremos con Triángulos Rectángulos (90°)." },

  // Area & Perimeter - GARDEN ANALOGY
  s1_ap_title: { ca: "Perímetre i Àrea: El Jardí", es: "Perímetro y Área: El Jardín" },
  
  s1_p_title: { ca: "Perímetre (La Tanca)", es: "Perímetro (La Valla)" },
  s1_p_desc: { ca: "És la longitud del contorn. Imagina que has de comprar filferro per tancar el jardí.", es: "Es la longitud del contorno. Imagina que tienes que comprar alambre para cercar el jardín." },
  s1_p_form: { ca: "Com es calcula? Amb la suma de tots els costats.", es: "¿Cómo se calcula? Con la suma de todos los lados." },
  s1_p_units: { ca: "Unitats: cm, m, km", es: "Unidades: cm, m, km" },

  s1_a_title: { ca: "Àrea (La Gespa)", es: "Área (El Césped)" },
  s1_a_desc: { ca: "És la superfície de dins. Imagina que has de comprar rotllos de gespa per cobrir el terra.", es: "Es la superficie de dentro. Imagina que tienes que comprar rollos de césped para cubrir el suelo." },
  s1_a_calc: { ca: "Com es calcula? Cada figura té la seva fórmula.", es: "¿Cómo se calcula? Cada figura tiene su fórmula." },
  s1_a_units: { ca: "Unitats: cm², m², km²", es: "Unidades: cm², m², km²" },
  
  s1_sq_title: { ca: "Quadrat", es: "Cuadrado" },
  s1_tri_title: { ca: "Triangle", es: "Triángulo" },
  s1_cir_title: { ca: "Cercle", es: "Círculo" },

  s1_drill_ap_title: { ca: "Drill: Calcula Perímetre (P) i Àrea (A)", es: "Drill: Calcula Perímetro (P) y Área (A)" },
  s1_drill_stm: { ca: "Calcula l'Àrea i el Perímetre", es: "Calcula el Área y el Perímetro" },

  // Roots
  s1_roots_title: { ca: "Arrels Quadrades", es: "Raíces Cuadradas" },
  s1_roots_desc: { ca: "L'arrel quadrada (√) és el contrari d'elevar al quadrat. Quin nombre multiplicat per ell mateix dona el resultat?", es: "La raíz cuadrada (√) es lo contrario de elevar al cuadrado. ¿Qué número multiplicado por sí mismo da el resultado?" },
  s1_show_roots: { ca: "Veure les 15 primeres arrels", es: "Ver las 15 primeras raíces" },
  s1_hide_roots: { ca: "Amagar taula", es: "Ocultar tabla" },
  s1_calc_title: { ca: "Calculadora d'Arrels", es: "Calculadora de Raíces" },
  s1_calc_placeholder: { ca: "Escriu un número...", es: "Escribe un número..." },
  s1_root_range: { ca: "Entre quins nombres enters està?", es: "¿Entre qué números enteros está?" },

  // Section 1 Game
  s1_game_title: { ca: "Practica!", es: "¡Practica!" },
  s1_q1: { ca: "Si un triangle té un angle de 90° i dos costats iguals, com es diu?", es: "¿Si un triángulo tiene un ángulo de 90° y dos lados iguales, cómo se llama?" },
  s1_opt_a: { ca: "Rectangle i Escalè", es: "Rectángulo y Escaleno" },
  s1_opt_b: { ca: "Rectangle i Isòsceles", es: "Rectángulo e Isósceles" },
  s1_opt_c: { ca: "Obtusangle i Isòsceles", es: "Obtusángulo e Isósceles" },
  
  // Section 2
  s2_instr: { ca: "Fes clic a la Hipotenusa (el costat més llarg oposat a l'angle recte).", es: "Haz clic en la Hipotenusa (el lado más largo opuesto al ángulo recto)." },
  
  // Section 3
  s3_history_1: { ca: "El Misteri de les Faves", es: "El Misterio de las Habas" },
  s3_history_2: { ca: "Un Secret Mortal", es: "Un Secreto Mortal" },
  
  // Section 3 History Extended
  s3_header: { ca: "🏛️ Pitàgores: Mite i Llegenda", es: "🏛️ Pitágoras: Mito y Leyenda" },
  s3_desc: { ca: "La Germandat Pitagòrica era una mena de 'secta' matemàtica. Tenien normes molt estranyes i secrets perillosos. Fes clic per descobrir-los.", es: "La Hermandad Pitagórica era una especie de 'secta' matemática. Tenían normas muy extrañas y secretos peligrosos. Haz clic para descubrirlos." },
  
  s3_h1_subtitle: { ca: "La Prohibició Sagrada", es: "La Prohibición Sagrada" },
  s3_h1_text: { 
    ca: "Els pitagòrics eren vegetarians, però tenien una norma estricta: \"No mengis faves!\". Creien que les faves contenien les ànimes dels morts o que s'assemblaven massa als éssers humans. La llegenda diu que Pitàgores va morir perquè, fugint d'uns enemics, es va trobar un camp de faves i es va negar a creuar-lo per no trepitjar-las, i allà el van atrapar.", 
    es: "Los pitagóricos eran vegetarianos, pero tenían una norma estricta: \"¡No comas habas!\". Creían que las habas contenían las almas de los muertos o que se parecían demasiado a los seres humanos. La leyenda dice que Pitágoras murió porque, huyendo de unos enemigos, se encontró un campo de habas y se negó a cruzarlo para no pisarlas, y allí lo atraparon." 
  },
  
  s3_h2_subtitle: { ca: "El Crim d'Hipaso", es: "El Crimen de Hipaso" },
  s3_h2_text: { 
    ca: "Els pitagòrics creien que \"tot és nombre\" (fraccions exactes). Però un alumne, Hipaso de Metapont, va descobrir que l'arrel de 2 (√2) no es podia escriure com una fracció. Això destruïa la seva teoria del món perfecte. Diu la llegenda que, per mantenir el secret, els altres alumnes el van llançar per la borda d'un vaixell al mig del mar.", 
    es: "Los pitagóricos creían que \"todo es número\" (fracciones exactas). Pero un alumno, Hipaso de Metaponto, descubrió que la raíz de 2 (√2) no se podía escribir como una fracción. Esto destruía su teoría del mundo perfecto. Dice la leyenda que, para mantener el secreto, los otros alumnos lo lanzaron por la borda de un barco en medio del mar." 
  },

  // Section 3 Visual Proof
  s3_proof_title: { ca: "Demostració Visual (Sense Paraules)", es: "Demostración Visual (Sin Palabras)" },
  s3_proof_subtitle: { ca: "Observa els dos quadrats grans. Són iguals. Què passa amb l'espai buit?", es: "Observa los dos cuadrados grandes. Son iguales. ¿Qué pasa con el espacio vacío?" },
  s3_proof_left: { ca: "Si posem els triangles a les cantonades... queda el quadrat de la HIPOTENUSA (h²).", es: "Si ponemos los triángulos en las esquinas... queda el cuadrado de la HIPOTENUSA (h²)." },
  s3_proof_right: { ca: "Si ajuntem els triangles... queden els quadrats dels CATETS (c₁² i c₂²).", es: "Si juntamos los triángulos... quedan los cuadrados de los CATETOS (c₁² y c₂²)." },
  s3_proof_concl_title: { ca: "Conclusió: L'espai buit és el mateix.", es: "Conclusión: El espacio vacío es el mismo." },
  s3_proof_quote: { ca: "L'àrea del quadrat gran (hipotenusa) és igual a la suma de les àrees dels dos quadrats petits (catets).", es: "El área del cuadrado grande (hipotenusa) es igual a la suma de las áreas de los dos cuadrados pequeños (catetos)." },
  
  // Section 3 Calculation Guide
  s3_guide_title: { ca: "Guia de Càlcul", es: "Guía de Cálculo" },
  s3_guide_hyp_title: { ca: "Busques la HIPOTENUSA?", es: "¿Buscas la HIPOTENUSA?" },
  s3_guide_hyp_action: { ca: "SUMEM (+)", es: "SUMAMOS (+)" },
  s3_guide_cat_title: { ca: "Busques un CATET?", es: "¿Buscas un CATETO?" },
  s3_guide_cat_action: { ca: "RESTEM (-)", es: "RESTAMOS (-)" },
  s3_known: { ca: "conegut", es: "conocido" },

  // Section 3 Practice
  s3_practice_title: { ca: "Pràctica de Càlcul", es: "Práctica de Cálculo" },
  s3_find_h: { ca: "Troba h.", es: "Halla h." },
  s3_find_c: { ca: "Troba c.", es: "Halla c." },
  s3_check_all: { ca: "Comprovar Tot", es: "Comprobar Todo" },

  // Section 4 Activity
  s4_activity_title: { ca: "🌟 Activitat Avaluable: Sigueu els Professors!", es: "🌟 Actividad Evaluable: ¡Sed los Profesores!" },
  s4_activity_p1: { ca: "Fase 1: Parelles. Cadascú inventa 1 problema i el company el resol.", es: "Fase 1: Parejas. Cada uno inventa 1 problema y el compañero lo resuelve." },
  s4_activity_p2: { ca: "Fase 2: Grups de 4. Trieu el millor problema dels 4.", es: "Fase 2: Grupos de 4. Elegid el mejor problema de los 4." },
  s4_activity_p3: { ca: "Fase 3: Preparació. Poliu l'enunciat i la solució.", es: "Fase 3: Preparación. Pulid el enunciado y la solución." },
  s4_activity_p4: { ca: "Fase 4: Pissarra. Sortiu a explicar-lo com a professors: plantegeu, pregunteu a la classe i resoleu pas a pas.", es: "Fase 4: Pizarra. Salid a explicarlo como profesores: plantead, preguntad a la clase y resolved paso a paso." },

  // EXTENSION: EXPERT LEVEL
  ext_desc: { 
    ca: "Has acabat tots els exercicis? Descobreix el secret dels egipcis per calcular sense calculadora.", 
    es: "¿Has acabado todos los ejercicios? Descubre el secreto de los egipcios para calcular sin calculadora." 
  },
  ext_hist_title: { ca: "Els Egipcis i la Corda de 12 Nusos", es: "Los Egipcios y la Cuerda de 12 Nudos" },
  ext_hist_txt: { 
    ca: "Fa milers d'anys, els agrimensores egipcis (els \"estiradors de corda\") feien servir una corda amb 12 nusos a la mateixa distància. Si formaven un triangle posant 3 nusos en un costat, 4 en l'altre i 5 a la diagonal, aconseguien un angle recte perfecte per construir piràmides! Això és la terna (3, 4, 5).", 
    es: "Hace miles de años, los agrimensores egipcios (los \"estiradores de cuerda\") usaban una cuerda con 12 nudos a la misma distancia. Si formaban un triángulo poniendo 3 nudos en un lado, 4 en el otro y 5 en la diagonal, conseguían un ángulo recto perfecto para construir pirámides. ¡Eso es la terna (3, 4, 5)!" 
  },
  ext_fam_title: { ca: "Famílies de Ternes", es: "Familias de Ternas" },
  ext_fam_prim: { 
    ca: "<strong>Ternes Primitives:</strong> Són els \"pares\" de totes les altres. Les més famoses són (3, 4, 5), (5, 12, 13) i (8, 15, 17).", 
    es: "<strong>Ternas Primitivas:</strong> Son los \"padres\" de todas las demás. Las más famosas son (3, 4, 5), (5, 12, 13) y (8, 15, 17)." 
  },
  ext_fam_deriv: { 
    ca: "<strong>Ternes Derivades:</strong> Si agafes una terna primitiva i multipliques els seus tres números pel mateix nombre (x2, x3, x10...), obtens una nova terna que també funciona.", 
    es: "<strong>Ternas Derivadas:</strong> Si coges una terna primitiva y multiplicas sus tres números por el mismo número (x2, x3, x10...), obtienes una nueva terna que también funciona." 
  },
  ext_chal_title: { ca: "El Repte dels Egipcis", es: "El Reto de los Egipcios" },
  ext_chal_desc: { 
    ca: "Si la terna (3, 4, 5) funciona... què passa si la multipliquem per 2? Calcula els costats resultants.", 
    es: "Si la terna (3, 4, 5) funciona... ¿qué pasa si la multiplicamos por 2? Calcula los lados resultantes." 
  },
  ext_chal_concl: { 
    ca: "✅ Molt bé! Has trobat una derivada multiplicant la terna primitiva per 2.", 
    es: "✅ ¡Muy bien! Has encontrado una derivada multiplicando la terna primitiva por 2." 
  },
  ext_lab_title: { ca: "Laboratori de Ternes", es: "Laboratorio de Ternas" },
  ext_lab_desc: { 
    ca: "Introdueix 3 nombres i et diré si formen un triangle rectangle perfecte.", 
    es: "Introduce 3 números y te diré si forman un triángulo rectángulo perfecto." 
  },
  ext_lab_btn: { ca: "Analitzar", es: "Analizar" },
};

// Prevents Rollup from inlining answer literals into the bundle as readable values.
// The obfuscator will encode both this function and its arguments.
const _a = (n: number): number => n;

export const REAL_PROBLEMS: Question[] = [
  { id: 'rp1', question: { ca: "Una escala de 5m es recolza a la paret. El peu està a 3m de la paret. A quina altura arriba l'escala?", es: "Una escalera de 5m se apoya en la pared. El pie está a 3m de la pared. ¿A qué altura llega la escalera?" }, answer: _a(4), unit: 'm' },
  { id: 'rp2', question: { ca: "Un camp de futbol fa 90m x 120m. Quant mesura la diagonal que corre l'àrbitre d'un córner a l'altre?", es: "Un campo de fútbol mide 90m x 120m. ¿Cuánto mide la diagonal que corre el árbitro de un córner al otro?" }, answer: _a(150), unit: 'm' },
  { id: 'rp3', question: { ca: "Estic al parc d'aventures a punt de llançar-me per una tirolina. La plataforma de sortida està a la copa d'un arbre de 15 metres d'altura. El meu instructor m'espera a baix, a una distància de 8 metres del tronc de l'arbre. Quants metres recorreré volant pel cable?", es: "Estoy en el parque de aventuras a punto de lanzarme por una tirolina. La plataforma de salida está en la copa de un árbol de 15 metros de altura. Mi instructor me espera abajo, a una distancia de 8 metros del tronco del árbol. ¿Cuántos metros recorreré volando por el cable?" }, answer: _a(17), unit: 'm' },
  { id: 'rp4', question: { ca: "Al skatepark del barri han construït una rampa gegant. La superfície per on patines (la rampa inclinada) fa 5 metres de llargada, i quan arribes a dalt de tot estàs a 3 metres d'altura del terra. Quina distància horitzontal ocupa aquesta rampa a terra?", es: "En el skatepark del barrio han construido una rampa gigante. La superficie por donde patinas (la rampa inclinada) mide 5 metros de largo, y cuando llegas arriba de todo estás a 3 metros de altura del suelo. ¿Qué distancia horizontal ocupa esta rampa en el suelo?" }, answer: _a(4), unit: 'm' },
  { id: 'rp5', question: { ca: "Vull comprar una televisió nova per la meva habitació. A la caixa posa que és de 50 polzades (això és la diagonal de la pantalla). Si agafo la cinta mètrica i veig que l'amplada és de 40 polzades, quina altura té la pantalla?", es: "Quiero comprar una televisión nueva para mi habitación. En la caja pone que es de 50 pulgadas (eso es la diagonal de la pantalla). Si cojo la cinta métrica y veo que el ancho es de 40 pulgadas, ¿qué altura tiene la pantalla?" }, answer: _a(30), unit: '"' },
  { id: 'rp6', question: { ca: "Per anar a l'institut, la Maria sempre fa el mateix camí: camina 300 metres cap al Nord i després gira i camina 400 metres cap a l'Est. Avui s'ha llevat tard i decideix travessar la gespa del parc en línia recta (la diagonal). Quants metres caminarà avui?", es: "Para ir al instituto, María siempre hace el mismo camino: camina 300 metros hacia el Norte y después gira y camina 400 metros hacia el Este. Hoy se ha levantado tarde y decide cruzar el césped del parque en línea recta (la diagonal). ¿Cuántos metros caminará hoy?" }, answer: _a(500), unit: 'm' },
  { id: 'rp7', question: { ca: "Hem anat de càmping i estem muntant una tenda de campanya tipus 'tipi'. Té un pal central que fa 2 metres d'alt. Hem de clavar els tensors (cordes) al terra a una distància de 1.5 metres del pal. Quina longitud ha de tenir la corda tensa?", es: "Hemos ido de camping y estamos montando una tienda de campaña tipo 'tipi'. Tiene un palo central que mide 2 metros de alto. Tenemos que clavar los tensores (cuerdas) al suelo a una distancia de 1.5 metros del palo. ¿Qué longitud debe tener la cuerda tensa?" }, answer: _a(2.5), unit: 'm' },
  { id: 'rp8', question: { ca: "Estàs fent volar un estel a la platja i has deixat anar 17 metres de fil. Just en aquest moment, l'estel està volant exactament a sobre d'una font que es troba a 8 metres d'on ets tu. A quina altura està volant l'estel?", es: "Estás haciendo volar una cometa en la playa y has soltado 17 metros de hilo. Justo en ese momento, la cometa está volando exactamente encima de una fuente que se encuentra a 8 metros de donde estás tú. ¿A qué altura está volando la cometa?" }, answer: _a(15), unit: 'm' },
  { id: 'rp9', question: { ca: "Un enginyer ha de subjectar una gran antena de ràdio que fa 24 metres d'altura. Vol posar un cable de seguretat des de la punta de dalt fins a un bloc de formigó que està a 7 metres de la base. Quants metres de cable necessita comprar?", es: "Un ingeniero tiene que sujetar una gran antena de radio que mide 24 metros de altura. Quiere poner un cable de seguridad desde la punta de arriba hasta un bloque de hormigón que está a 7 metros de la base. ¿Cuántos metros de cable necesita comprar?" }, answer: _a(25), unit: 'm' },
  { id: 'rp10', question: { ca: "Tenim un problema amb la mudança. Tenim un armari tombat a terra que fa 2.4 metres d'alt i 0.7 metres de fons. El sostre de l'habitació està a 2.6 metres. Si intentem aixecar l'armari posant-lo dret, la diagonal tocarà en el techo? Calcula quant mesura la diagonal de l'armari.", es: "Tenemos un problema con la mudanza. Tenemos un armario tumbado en el suelo que mide 2.4 metros de alto y 0.7 metros de fondo. El techo de la habitación está a 2.6 metros. Si intentamos levantar el armario poniéndolo de pie, ¿la diagonal tocará en el techo? Calcula cuánto mide la diagonal del armario." }, answer: _a(2.5), unit: 'm' },
  { id: 'rp11', question: { ca: "T'has comprat una funda per a la teva nova tablet. La pantalla mide 12 cm de ancho y 9 cm de alto. El fabricante de fundes te pide la medida de la diagonal para saber si cabe. ¿Cuántos cm hace la diagonal?", es: "Te has comprado una funda para tu nueva tablet. La pantalla mide 12 cm de ancho y 9 cm de alto. El fabricante de fundes te pide la medida de la diagonal para saber si cabe. ¿Cuántos cm hace la diagonal?" }, answer: _a(15), unit: 'cm' },
  { id: 'rp12', question: { ca: "És de nit i un fanal del carrer de 4 metres d'altura projecta una ombra molt llarga a terra, de 3 metres. Si haguéssim de tirar un fil des de la bombeta del fanal fins a la punta de l'ombra, quant mesuraria?", es: "Es de noche y una farola de la calle de 4 metros de altura proyecta una sombra muy larga en el suelo, de 3 metros. Si tuviéramos que tirar un hilo desde la bombilla de la farola hasta la punta de la sombra, ¿cuánto mediría?" }, answer: _a(5), unit: 'm' },
  { id: 'rp13', question: { ca: "El pare vol saber si el seu cotxe nou hi cap en diagonal a la plaça de pàrquing. La plaça fa 2.5 metres d'ample i 6 metres de llarg. Quina és la distància màxima en diagonal que hi ha a la plaça?", es: "Papá quiere saber si su coche nuevo cabe en diagonal en la plaza de parking. La plaza mide 2.5 metros de ancho y 6 metros de largo. ¿Cuál es la distancia máxima en diagonal que hay en la plaza?" }, answer: _a(6.5), unit: 'm' },
  { id: 'rp14', question: { ca: "L'avi té un hort rectangular tancat. Sabem que la diagonal que creua l'hort fa 10 metres i que un dels costats fa 6 metres. L'avi vol saber quants metres fa l'altre costat per plantar-hi tomaqueres. Calcula-ho.", es: "El abuelo tiene un huerto rectangular vallado. Sabemos que la diagonal que cruza el huerto mide 10 metros y que uno de los lados mide 6 metros. El abuelo quiere saber cuántos metros mide el otro lado para plantar tomateras. Calcúlalo." }, answer: _a(8), unit: 'm' },
];