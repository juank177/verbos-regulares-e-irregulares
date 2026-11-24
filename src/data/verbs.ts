export type VerbCategory = 'irregular' | 'regular';

export type MotionType =
  | 'palm-strike'
  | 'vocal-ladder'
  | 'step-twin-clap'
  | 'arm-arc'
  | 'wrist-or-pull'
  | 'wind-push'
  | 'three-step-heel'
  | 'mime-action'
  | 'syllable-bounce'
  | 'throat-dry-cut'
  | 'throat-vibrate';

export interface VerbGroup {
  id: number;
  title: string;
  subtitle: string;
  category: VerbCategory;
  strategy: string;
  rhythmCue: string;
  motionType: MotionType;
  beatLabels: [string, string, string];
  accentHex: string;
  accentLabel: string;
}

export interface VerbItem {
  id: string;
  groupId: number;
  category: VerbCategory;
  present: string;
  past: string;
  participle: string;
  meaning: string;
  anchor: string;
  /** Optional phonetic hint for speech synthesis (e.g., Read past/participle -> "red") */
  speakPresent?: string;
  speakPast?: string;
  speakParticiple?: string;
}

export const VERB_GROUPS: VerbGroup[] = [
  {
    id: 1,
    title: 'Grupo 1: Los Inmutables',
    subtitle: 'Presente, pasado y participio iguales',
    category: 'irregular',
    strategy:
      'Mantén el cuerpo quieto y da un solo golpe firme con la palma sobre la mesa mientras dices las tres formas con el mismo ritmo ("Cut - cut - cut").',
    rhythmCue: '1 golpe seco · Sin cambio',
    motionType: 'palm-strike',
    beatLabels: ['Golpe firme', 'Mismo punto', 'Mismo punto'],
    accentHex: '#0284C7',
    accentLabel: 'CONSTANTE',
  },
  {
    id: 2,
    title: 'Grupo 2: La Escalera Vocal',
    subtitle: 'Cambio rítmico I - A - U',
    category: 'irregular',
    strategy:
      'Usa tu mano como director de orquesta marcando tres alturas descendentes: arriba en presente (i), al pecho en pasado (a) y abajo en participio (u).',
    rhythmCue: 'Mano: arriba → pecho → abajo',
    motionType: 'vocal-ladder',
    beatLabels: ['Arriba (I)', 'Pecho (A)', 'Abajo (U)'],
    accentHex: '#2563EB',
    accentLabel: 'ESCALERA I·A·U',
  },
  {
    id: 3,
    title: 'Grupo 3: Los Gemelos',
    subtitle: 'Pasado y participio exactamente iguales',
    category: 'irregular',
    strategy:
      'Da un paso al frente para el presente y aplaude dos veces seguidas en el mismo lugar para el pasado y el participio.',
    rhythmCue: 'Paso al frente + 2 aplausos iguales',
    motionType: 'step-twin-clap',
    beatLabels: ['Paso al frente', 'Aplauso 1', 'Aplauso 2 (igual)'],
    accentHex: '#059669',
    accentLabel: 'GEMELOS 2=3',
  },
  {
    id: 4,
    title: 'Grupo 4: Los Hermanos -OUGHT / -AUGHT',
    subtitle: 'Rima larga /ɔːt/',
    category: 'irregular',
    strategy:
      'Haz un movimiento amplio lanzando el brazo hacia adelante mientras alargas el sonido /ɔːt/ en pasado y participio.',
    rhythmCue: 'Lanzamiento largo de brazo en /ɔːt/',
    motionType: 'arm-arc',
    beatLabels: ['Preparar', 'Lanzar brazo /ɔːt/', 'Mantener /ɔːt/'],
    accentHex: '#D97706',
    accentLabel: 'RIMA /ɔːt/',
  },
  {
    id: 5,
    title: 'Grupo 5: Los -OU- y -U-',
    subtitle: 'Giro o jalón cerrado',
    category: 'irregular',
    strategy:
      'Haz un movimiento circular con la muñeca para los terminados en -ound y simula jalar una cuerda hacia tu pecho para los terminados en -ung / -uck / -ug / -un.',
    rhythmCue: 'Giro de muñeca (-ound) · Jalón al pecho (-u-)',
    motionType: 'wrist-or-pull',
    beatLabels: ['Base abierta', 'Giro / Jalón 1', 'Giro / Jalón 2'],
    accentHex: '#0D9488',
    accentLabel: 'GIRO / JALÓN',
  },
  {
    id: 6,
    title: 'Grupo 6: Los del Viento',
    subtitle: '-EW en pasado / -OWN -AWN en participio',
    category: 'irregular',
    strategy:
      'Mueve ambas manos hacia adelante como empujando una corriente de aire en cada tiempo verbal.',
    rhythmCue: 'Empujar corriente de aire en 3 tiempos',
    motionType: 'wind-push',
    beatLabels: ['Brisa suave', 'Empuje -EW', 'Ráfaga -OWN/-AWN'],
    accentHex: '#0284C7',
    accentLabel: 'FLUJO DE AIRE',
  },
  {
    id: 7,
    title: 'Grupo 7: Los Participios en -EN / -N',
    subtitle: 'Tres formas distintas',
    category: 'irregular',
    strategy:
      'Da tres pasos hacia adelante (uno por columna) y marca el tercer paso con un toque firme de talón en el suelo para enfatizar la terminación -en / -n.',
    rhythmCue: '3 pasos al frente + toque firme de talón',
    motionType: 'three-step-heel',
    beatLabels: ['Paso 1 (Base)', 'Paso 2 (Pasado)', 'Paso 3 + Talón (-EN)'],
    accentHex: '#4F46E5',
    accentLabel: '3 PASOS + TALÓN',
  },
  {
    id: 8,
    title: 'Grupo 8: Casos Especiales',
    subtitle: 'Mímica directa de acción',
    category: 'irregular',
    strategy:
      'Escríbelos en tarjetas de colores con un dibujo rápido y ejecuta la mímica teatral del verbo mientras dices los tres tiempos en voz alta.',
    rhythmCue: 'Mímica teatral de la acción en 3 tiempos',
    motionType: 'mime-action',
    beatLabels: ['Iniciar mímica', 'Sostener acción', 'Cerrar gesto'],
    accentHex: '#DC2626',
    accentLabel: 'MÍMICA DIRECTA',
  },
  {
    id: 9,
    title: 'Grupo 9: Sonido /ɪd/ — El Rebote',
    subtitle: 'Sílaba extra (terminan en T o D)',
    category: 'regular',
    strategy:
      'Terminan en letra T o D. Da dos toques con el dedo o el pie sobre el suelo/mesa para separar la sílaba extra (want - ed, need - ed).',
    rhythmCue: '2 toques: raíz + sílaba /-ɪd/',
    motionType: 'syllable-bounce',
    beatLabels: ['Raíz (1 toque)', 'Rebote /-ɪd/ (2 toques)', 'Rebote /-ɪd/ (2 toques)'],
    accentHex: '#0284C7',
    accentLabel: 'REBOTE /ɪd/',
  },
  {
    id: 10,
    title: 'Grupo 10: Sonido /t/ — Aire Seco',
    subtitle: 'Sin vibración en garganta',
    category: 'regular',
    strategy:
      'Pon dos dedos en tu garganta (no debe vibrar al final) y haz un corte rápido en el aire con la mano pronunciando una -T seca (walkt, cookt).',
    rhythmCue: 'Garganta quieta + corte rápido /t/',
    motionType: 'throat-dry-cut',
    beatLabels: ['Base limpia', 'Corte seco /t/', 'Corte seco /t/'],
    accentHex: '#D97706',
    accentLabel: 'AIRE SECO /t/',
  },
  {
    id: 11,
    title: 'Grupo 11: Sonido /d/ — Vibración Sonora',
    subtitle: 'Cuerdas vocales activas',
    category: 'regular',
    strategy:
      'Mantén dos dedos en tu cuello para sentir el zumbido de las cuerdas vocales antes de cerrar suavemente con la lengua en /d/.',
    rhythmCue: 'Dedos en cuello · Vibración + cierre /d/',
    motionType: 'throat-vibrate',
    beatLabels: ['Base sonora', 'Vibración + /d/', 'Vibración + /d/'],
    accentHex: '#059669',
    accentLabel: 'VIBRACIÓN /d/',
  },
];

export const VERBS: VerbItem[] = [
  // ======================== GRUPO 1: LOS INMUTABLES (20) ========================
  { id: 'g1-bet', groupId: 1, category: 'irregular', present: 'Bet', past: 'Bet', participle: 'Bet', meaning: 'Apostar', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-bid', groupId: 1, category: 'irregular', present: 'Bid', past: 'Bid', participle: 'Bid', meaning: 'Pujar', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-broadcast', groupId: 1, category: 'irregular', present: 'Broadcast', past: 'Broadcast', participle: 'Broadcast', meaning: 'Radiar / Transmitir', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-burst', groupId: 1, category: 'irregular', present: 'Burst', past: 'Burst', participle: 'Burst', meaning: 'Reventar', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-cast', groupId: 1, category: 'irregular', present: 'Cast', past: 'Cast', participle: 'Cast', meaning: 'Arrojar', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-cost', groupId: 1, category: 'irregular', present: 'Cost', past: 'Cost', participle: 'Cost', meaning: 'Costar', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-cut', groupId: 1, category: 'irregular', present: 'Cut', past: 'Cut', participle: 'Cut', meaning: 'Cortar', anchor: '1 golpe seco + gesto tijera' },
  { id: 'g1-hit', groupId: 1, category: 'irregular', present: 'Hit', past: 'Hit', participle: 'Hit', meaning: 'Golpear', anchor: '1 golpe seco en mesa' },
  { id: 'g1-hurt', groupId: 1, category: 'irregular', present: 'Hurt', past: 'Hurt', participle: 'Hurt', meaning: 'Herir / Doler', anchor: '1 golpe seco + tocar brazo' },
  { id: 'g1-knit', groupId: 1, category: 'irregular', present: 'Knit', past: 'Knit', participle: 'Knit', meaning: 'Tejer / Hacer punto', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-let', groupId: 1, category: 'irregular', present: 'Let', past: 'Let', participle: 'Let', meaning: 'Permitir / Dejar', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-put', groupId: 1, category: 'irregular', present: 'Put', past: 'Put', participle: 'Put', meaning: 'Poner', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-read', groupId: 1, category: 'irregular', present: 'Read', past: 'Read (pron. /red/)', participle: 'Read (pron. /red/)', meaning: 'Leer', anchor: '1 golpe + abrir palmas', speakPresent: 'read', speakPast: 'red', speakParticiple: 'red' },
  { id: 'g1-set', groupId: 1, category: 'irregular', present: 'Set', past: 'Set', participle: 'Set', meaning: 'Poner(se) / Colocar', anchor: '1 golpe seco (sin cambio)' },
  { id: 'g1-shut', groupId: 1, category: 'irregular', present: 'Shut', past: 'Shut', participle: 'Shut', meaning: 'Cerrar', anchor: '1 golpe + cerrar puño' },
  { id: 'g1-split', groupId: 1, category: 'irregular', present: 'Split', past: 'Split', participle: 'Split', meaning: 'Partir / Rajar', anchor: '1 golpe + separar manos' },
  { id: 'g1-spread', groupId: 1, category: 'irregular', present: 'Spread', past: 'Spread', participle: 'Spread', meaning: 'Extender / Untar', anchor: '1 golpe + deslizar mano' },
  { id: 'g1-sweat', groupId: 1, category: 'irregular', present: 'Sweat', past: 'Sweat', participle: 'Sweat', meaning: 'Sudar', anchor: '1 golpe + pasar mano frente' },
  { id: 'g1-thrust', groupId: 1, category: 'irregular', present: 'Thrust', past: 'Thrust', participle: 'Thrust', meaning: 'Introducir / Empujar', anchor: '1 golpe + empujar al frente' },
  { id: 'g1-wet', groupId: 1, category: 'irregular', present: 'Wet', past: 'Wet', participle: 'Wet', meaning: 'Mojar', anchor: '1 golpe seco (sin cambio)' },

  // ======================== GRUPO 2: LA ESCALERA VOCAL (9) ========================
  { id: 'g2-begin', groupId: 2, category: 'irregular', present: 'Begin', past: 'Began', participle: 'Begun', meaning: 'Empezar', anchor: 'Mano: arriba → pecho → abajo' },
  { id: 'g2-drink', groupId: 2, category: 'irregular', present: 'Drink', past: 'Drank', participle: 'Drunk', meaning: 'Beber', anchor: 'Mano: arriba → pecho → abajo' },
  { id: 'g2-ring', groupId: 2, category: 'irregular', present: 'Ring', past: 'Rang', participle: 'Rung', meaning: 'Llamar / Sonar', anchor: 'Mano: arriba → pecho → abajo' },
  { id: 'g2-shrink', groupId: 2, category: 'irregular', present: 'Shrink', past: 'Shrank', participle: 'Shrunk', meaning: 'Encogerse', anchor: 'Mano: arriba → pecho → abajo' },
  { id: 'g2-sing', groupId: 2, category: 'irregular', present: 'Sing', past: 'Sang', participle: 'Sung', meaning: 'Cantar', anchor: 'Mano: arriba → pecho → abajo' },
  { id: 'g2-sink', groupId: 2, category: 'irregular', present: 'Sink', past: 'Sank', participle: 'Sunk', meaning: 'Hundir', anchor: 'Mano: arriba → pecho → abajo' },
  { id: 'g2-spring', groupId: 2, category: 'irregular', present: 'Spring', past: 'Sprang', participle: 'Sprung', meaning: 'Saltar / Brotar', anchor: 'Mano: arriba → pecho → abajo' },
  { id: 'g2-stink', groupId: 2, category: 'irregular', present: 'Stink', past: 'Stank / Stunk', participle: 'Stunk', meaning: 'Apestar', anchor: 'Mano: arriba → pecho → abajo', speakPast: 'stank' },
  { id: 'g2-swim', groupId: 2, category: 'irregular', present: 'Swim', past: 'Swam', participle: 'Swum', meaning: 'Nadar', anchor: 'Mano: arriba → pecho → abajo' },

  // ======================== GRUPO 3: LOS GEMELOS (50) ========================
  { id: 'g3-bend', groupId: 3, category: 'irregular', present: 'Bend', past: 'Bent', participle: 'Bent', meaning: 'Doblar', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-bleed', groupId: 3, category: 'irregular', present: 'Bleed', past: 'Bled', participle: 'Bled', meaning: 'Sangrar', anchor: 'Paso + 2 aplausos (vocal corta)' },
  { id: 'g3-breed', groupId: 3, category: 'irregular', present: 'Breed', past: 'Bred', participle: 'Bred', meaning: 'Criar', anchor: 'Paso + 2 aplausos (vocal corta)' },
  { id: 'g3-build', groupId: 3, category: 'irregular', present: 'Build', past: 'Built', participle: 'Built', meaning: 'Edificar / Construir', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-burn', groupId: 3, category: 'irregular', present: 'Burn', past: 'Burnt / Burned', participle: 'Burnt / Burned', meaning: 'Quemar', anchor: 'Paso + 2 aplausos (cierre -T)', speakPast: 'burnt', speakParticiple: 'burnt' },
  { id: 'g3-creep', groupId: 3, category: 'irregular', present: 'Creep', past: 'Crept', participle: 'Crept', meaning: 'Arrastrarse', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-deal', groupId: 3, category: 'irregular', present: 'Deal', past: 'Dealt', participle: 'Dealt', meaning: 'Tratar / Negociar', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-dream', groupId: 3, category: 'irregular', present: 'Dream', past: 'Dreamt / Dreamed', participle: 'Dreamt / Dreamed', meaning: 'Soñar', anchor: 'Paso + 2 aplausos (cierre -T)', speakPast: 'dreamt', speakParticiple: 'dreamt' },
  { id: 'g3-feed', groupId: 3, category: 'irregular', present: 'Feed', past: 'Fed', participle: 'Fed', meaning: 'Alimentar', anchor: 'Paso + 2 aplausos (vocal corta)' },
  { id: 'g3-feel', groupId: 3, category: 'irregular', present: 'Feel', past: 'Felt', participle: 'Felt', meaning: 'Sentir', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-flee', groupId: 3, category: 'irregular', present: 'Flee', past: 'Fled', participle: 'Fled', meaning: 'Huir', anchor: 'Paso + 2 aplausos (vocal corta)' },
  { id: 'g3-get', groupId: 3, category: 'irregular', present: 'Get', past: 'Got', participle: 'Got / Gotten', meaning: 'Obtener / Conseguir', anchor: 'Paso + 2 aplausos', speakParticiple: 'got' },
  { id: 'g3-have', groupId: 3, category: 'irregular', present: 'Have', past: 'Had', participle: 'Had', meaning: 'Haber / Tener', anchor: 'Paso + 2 aplausos (cierre -D)' },
  { id: 'g3-hear', groupId: 3, category: 'irregular', present: 'Hear', past: 'Heard', participle: 'Heard', meaning: 'Oír', anchor: 'Paso + 2 aplausos + tocar oído' },
  { id: 'g3-hold', groupId: 3, category: 'irregular', present: 'Hold', past: 'Held', participle: 'Held', meaning: 'Agarrar / Sostener', anchor: 'Paso + 2 aplausos + cerrar puño' },
  { id: 'g3-keep', groupId: 3, category: 'irregular', present: 'Keep', past: 'Kept', participle: 'Kept', meaning: 'Conservar / Guardar', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-kneel', groupId: 3, category: 'irregular', present: 'Kneel', past: 'Knelt', participle: 'Knelt', meaning: 'Arrodillarse', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-lay', groupId: 3, category: 'irregular', present: 'Lay', past: 'Laid', participle: 'Laid', meaning: 'Poner / Colocar', anchor: 'Paso + 2 aplausos (termina -ID)' },
  { id: 'g3-lead', groupId: 3, category: 'irregular', present: 'Lead', past: 'Led', participle: 'Led', meaning: 'Conducir / Liderar', anchor: 'Paso + 2 aplausos (vocal corta)' },
  { id: 'g3-lean', groupId: 3, category: 'irregular', present: 'Lean', past: 'Leant', participle: 'Leant', meaning: 'Apoyarse', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-leap', groupId: 3, category: 'irregular', present: 'Leap', past: 'Leapt', participle: 'Leapt', meaning: 'Brincar', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-learn', groupId: 3, category: 'irregular', present: 'Learn', past: 'Learnt / Learned', participle: 'Learnt / Learned', meaning: 'Aprender', anchor: 'Paso + 2 aplausos (cierre -T)', speakPast: 'learnt', speakParticiple: 'learnt' },
  { id: 'g3-leave', groupId: 3, category: 'irregular', present: 'Leave', past: 'Left', participle: 'Left', meaning: 'Dejar / Salir', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-lend', groupId: 3, category: 'irregular', present: 'Lend', past: 'Lent', participle: 'Lent', meaning: 'Prestar', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-light', groupId: 3, category: 'irregular', present: 'Light', past: 'Lit', participle: 'Lit', meaning: 'Encender', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-lose', groupId: 3, category: 'irregular', present: 'Lose', past: 'Lost', participle: 'Lost', meaning: 'Perder', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-make', groupId: 3, category: 'irregular', present: 'Make', past: 'Made', participle: 'Made', meaning: 'Hacer / Fabricar', anchor: 'Paso + 2 aplausos (cierre -D)' },
  { id: 'g3-mean', groupId: 3, category: 'irregular', present: 'Mean', past: 'Meant', participle: 'Meant', meaning: 'Significar', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-meet', groupId: 3, category: 'irregular', present: 'Meet', past: 'Met', participle: 'Met', meaning: 'Encontrar / Conocer', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-pay', groupId: 3, category: 'irregular', present: 'Pay', past: 'Paid', participle: 'Paid', meaning: 'Pagar', anchor: 'Paso + 2 aplausos (termina -ID)' },
  { id: 'g3-say', groupId: 3, category: 'irregular', present: 'Say', past: 'Said', participle: 'Said', meaning: 'Decir', anchor: 'Paso + 2 aplausos (vocal corta)' },
  { id: 'g3-sell', groupId: 3, category: 'irregular', present: 'Sell', past: 'Sold', participle: 'Sold', meaning: 'Vender', anchor: 'Paso + 2 aplausos (termina -OLD)' },
  { id: 'g3-send', groupId: 3, category: 'irregular', present: 'Send', past: 'Sent', participle: 'Sent', meaning: 'Enviar', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-shine', groupId: 3, category: 'irregular', present: 'Shine', past: 'Shone', participle: 'Shone', meaning: 'Brillar', anchor: 'Paso + 2 aplausos' },
  { id: 'g3-shoot', groupId: 3, category: 'irregular', present: 'Shoot', past: 'Shot', participle: 'Shot', meaning: 'Disparar', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-sit', groupId: 3, category: 'irregular', present: 'Sit', past: 'Sat', participle: 'Sat', meaning: 'Sentarse', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-sleep', groupId: 3, category: 'irregular', present: 'Sleep', past: 'Slept', participle: 'Slept', meaning: 'Dormir', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-slide', groupId: 3, category: 'irregular', present: 'Slide', past: 'Slid', participle: 'Slid', meaning: 'Resbalar', anchor: 'Paso + 2 aplausos (vocal corta)' },
  { id: 'g3-smell', groupId: 3, category: 'irregular', present: 'Smell', past: 'Smelt', participle: 'Smelt', meaning: 'Oler', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-speed', groupId: 3, category: 'irregular', present: 'Speed', past: 'Sped', participle: 'Sped', meaning: 'Acelerar', anchor: 'Paso + 2 aplausos (vocal corta)' },
  { id: 'g3-spell', groupId: 3, category: 'irregular', present: 'Spell', past: 'Spelt', participle: 'Spelt', meaning: 'Deletrear', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-spend', groupId: 3, category: 'irregular', present: 'Spend', past: 'Spent', participle: 'Spent', meaning: 'Gastar / Pasar tiempo', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-spill', groupId: 3, category: 'irregular', present: 'Spill', past: 'Spilt / Spilled', participle: 'Spilt / Spilled', meaning: 'Derramar', anchor: 'Paso + 2 aplausos (cierre -T)', speakPast: 'spilt', speakParticiple: 'spilt' },
  { id: 'g3-spit', groupId: 3, category: 'irregular', present: 'Spit', past: 'Spat', participle: 'Spat', meaning: 'Escupir', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-spoil', groupId: 3, category: 'irregular', present: 'Spoil', past: 'Spoilt / Spoiled', participle: 'Spoilt / Spoiled', meaning: 'Estropear / Mimar', anchor: 'Paso + 2 aplausos (cierre -T)', speakPast: 'spoilt', speakParticiple: 'spoilt' },
  { id: 'g3-stand', groupId: 3, category: 'irregular', present: 'Stand', past: 'Stood', participle: 'Stood', meaning: 'Estar de pie', anchor: 'Paso + 2 aplausos + erguirse' },
  { id: 'g3-sweep', groupId: 3, category: 'irregular', present: 'Sweep', past: 'Swept', participle: 'Swept', meaning: 'Barrer', anchor: 'Paso + 2 aplausos (cierre -T)' },
  { id: 'g3-tell', groupId: 3, category: 'irregular', present: 'Tell', past: 'Told', participle: 'Told', meaning: 'Decir / Contar', anchor: 'Paso + 2 aplausos (termina -OLD)' },
  { id: 'g3-understand', groupId: 3, category: 'irregular', present: 'Understand', past: 'Understood', participle: 'Understood', meaning: 'Entender', anchor: 'Paso + 2 aplausos + tocar sien' },
  { id: 'g3-weep', groupId: 3, category: 'irregular', present: 'Weep', past: 'Wept', participle: 'Wept', meaning: 'Llorar', anchor: 'Paso + 2 aplausos (cierre -T)' },

  // ======================== GRUPO 4: LOS HERMANOS -OUGHT / -AUGHT (7) ========================
  { id: 'g4-bring', groupId: 4, category: 'irregular', present: 'Bring', past: 'Brought', participle: 'Brought', meaning: 'Traer / Llevar', anchor: 'Lanzar brazo largo en /ɔːt/' },
  { id: 'g4-buy', groupId: 4, category: 'irregular', present: 'Buy', past: 'Bought', participle: 'Bought', meaning: 'Comprar', anchor: 'Lanzar brazo largo en /ɔːt/' },
  { id: 'g4-catch', groupId: 4, category: 'irregular', present: 'Catch', past: 'Caught', participle: 'Caught', meaning: 'Coger / Atrapar', anchor: 'Lanzar brazo + atrapar en /ɔːt/' },
  { id: 'g4-fight', groupId: 4, category: 'irregular', present: 'Fight', past: 'Fought', participle: 'Fought', meaning: 'Luchar / Pelear', anchor: 'Lanzar brazo largo en /ɔːt/' },
  { id: 'g4-seek', groupId: 4, category: 'irregular', present: 'Seek', past: 'Sought', participle: 'Sought', meaning: 'Buscar', anchor: 'Lanzar brazo largo en /ɔːt/' },
  { id: 'g4-teach', groupId: 4, category: 'irregular', present: 'Teach', past: 'Taught', participle: 'Taught', meaning: 'Enseñar', anchor: 'Lanzar brazo largo en /ɔːt/' },
  { id: 'g4-think', groupId: 4, category: 'irregular', present: 'Think', past: 'Thought', participle: 'Thought', meaning: 'Pensar', anchor: 'Tocar frente + lanzar brazo en /ɔːt/' },

  // ======================== GRUPO 5: LOS -OU- Y -U- (14) ========================
  { id: 'g5-bind', groupId: 5, category: 'irregular', present: 'Bind', past: 'Bound', participle: 'Bound', meaning: 'Atar / Encuadernar', anchor: 'Giro de muñeca (-ound)' },
  { id: 'g5-find', groupId: 5, category: 'irregular', present: 'Find', past: 'Found', participle: 'Found', meaning: 'Encontrar', anchor: 'Giro de muñeca (-ound)' },
  { id: 'g5-grind', groupId: 5, category: 'irregular', present: 'Grind', past: 'Ground', participle: 'Ground', meaning: 'Moler', anchor: 'Giro de muñeca (-ound)' },
  { id: 'g5-wind', groupId: 5, category: 'irregular', present: 'Wind', past: 'Wound', participle: 'Wound', meaning: 'Enrollar / Dar cuerda', anchor: 'Giro de muñeca (-ound)' },
  { id: 'g5-cling', groupId: 5, category: 'irregular', present: 'Cling', past: 'Clung', participle: 'Clung', meaning: 'Agarrarse / Adherirse', anchor: 'Jalar cuerda al pecho (-ung)' },
  { id: 'g5-dig', groupId: 5, category: 'irregular', present: 'Dig', past: 'Dug', participle: 'Dug', meaning: 'Cavar', anchor: 'Jalar cuerda / pala (-ug)' },
  { id: 'g5-hang', groupId: 5, category: 'irregular', present: 'Hang', past: 'Hung', participle: 'Hung', meaning: 'Colgar', anchor: 'Jalar cuerda al pecho (-ung)' },
  { id: 'g5-spin', groupId: 5, category: 'irregular', present: 'Spin', past: 'Spun', participle: 'Spun', meaning: 'Hilar / Girar', anchor: 'Jalar cuerda al pecho (-un)' },
  { id: 'g5-stick', groupId: 5, category: 'irregular', present: 'Stick', past: 'Stuck', participle: 'Stuck', meaning: 'Pegar / Engomar', anchor: 'Jalar cuerda al pecho (-uck)' },
  { id: 'g5-sting', groupId: 5, category: 'irregular', present: 'Sting', past: 'Stung', participle: 'Stung', meaning: 'Picar (insecto)', anchor: 'Jalar cuerda al pecho (-ung)' },
  { id: 'g5-strike', groupId: 5, category: 'irregular', present: 'Strike', past: 'Struck', participle: 'Struck', meaning: 'Golpear / Atacar', anchor: 'Jalar cuerda al pecho (-uck)' },
  { id: 'g5-swing', groupId: 5, category: 'irregular', present: 'Swing', past: 'Swung', participle: 'Swung', meaning: 'Columpiarse / Balancear', anchor: 'Jalar cuerda al pecho (-ung)' },
  { id: 'g5-win', groupId: 5, category: 'irregular', present: 'Win', past: 'Won', participle: 'Won', meaning: 'Ganar', anchor: 'Jalar cuerda + puño arriba (-on)' },
  { id: 'g5-wring', groupId: 5, category: 'irregular', present: 'Wring', past: 'Wrung', participle: 'Wrung', meaning: 'Torcer / Exprimir', anchor: 'Jalar cuerda al pecho (-ung)' },

  // ======================== GRUPO 6: LOS DEL VIENTO (7) ========================
  { id: 'g6-blow', groupId: 6, category: 'irregular', present: 'Blow', past: 'Blew', participle: 'Blown', meaning: 'Soplar', anchor: 'Empujar aire con manos' },
  { id: 'g6-draw', groupId: 6, category: 'irregular', present: 'Draw', past: 'Drew', participle: 'Drawn', meaning: 'Dibujar', anchor: 'Empujar aire / trazar línea' },
  { id: 'g6-fly', groupId: 6, category: 'irregular', present: 'Fly', past: 'Flew', participle: 'Flown', meaning: 'Volar', anchor: 'Empujar aire abriendo brazos' },
  { id: 'g6-grow', groupId: 6, category: 'irregular', present: 'Grow', past: 'Grew', participle: 'Grown', meaning: 'Crecer', anchor: 'Empujar aire hacia arriba' },
  { id: 'g6-know', groupId: 6, category: 'irregular', present: 'Know', past: 'Knew', participle: 'Known', meaning: 'Saber / Conocer', anchor: 'Empujar aire desde la sien' },
  { id: 'g6-throw', groupId: 6, category: 'irregular', present: 'Throw', past: 'Threw', participle: 'Thrown', meaning: 'Arrojar / Tirar', anchor: 'Empujar aire lanzando' },
  { id: 'g6-withdraw', groupId: 6, category: 'irregular', present: 'Withdraw', past: 'Withdrew', participle: 'Withdrawn', meaning: 'Retirarse', anchor: 'Empujar aire hacia atrás' },

  // ======================== GRUPO 7: LOS PARTICIPIOS EN -EN / -N (31) ========================
  { id: 'g7-arise', groupId: 7, category: 'irregular', present: 'Arise', past: 'Arose', participle: 'Arisen', meaning: 'Surgir / Levantarse', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-awake', groupId: 7, category: 'irregular', present: 'Awake', past: 'Awoke', participle: 'Awoken', meaning: 'Despertarse', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-bear', groupId: 7, category: 'irregular', present: 'Bear', past: 'Bore', participle: 'Borne / Born', meaning: 'Soportar / Dar a luz', anchor: '3 pasos + talón (pasado O)', speakParticiple: 'borne' },
  { id: 'g7-beat', groupId: 7, category: 'irregular', present: 'Beat', past: 'Beat', participle: 'Beaten', meaning: 'Golpear / Vencer', anchor: '3 pasos + talón' },
  { id: 'g7-bite', groupId: 7, category: 'irregular', present: 'Bite', past: 'Bit', participle: 'Bitten', meaning: 'Morder', anchor: '3 pasos + talón (vocal corta)' },
  { id: 'g7-break', groupId: 7, category: 'irregular', present: 'Break', past: 'Broke', participle: 'Broken', meaning: 'Romper', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-choose', groupId: 7, category: 'irregular', present: 'Choose', past: 'Chose', participle: 'Chosen', meaning: 'Elegir', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-drive', groupId: 7, category: 'irregular', present: 'Drive', past: 'Drove', participle: 'Driven', meaning: 'Conducir', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-forbid', groupId: 7, category: 'irregular', present: 'Forbid', past: 'Forbade', participle: 'Forbidden', meaning: 'Prohibir', anchor: '3 pasos + talón' },
  { id: 'g7-forget', groupId: 7, category: 'irregular', present: 'Forget', past: 'Forgot', participle: 'Forgotten', meaning: 'Olvidar', anchor: '3 pasos + talón (vocal corta)' },
  { id: 'g7-forgive', groupId: 7, category: 'irregular', present: 'Forgive', past: 'Forgave', participle: 'Forgiven', meaning: 'Perdonar', anchor: '3 pasos + talón' },
  { id: 'g7-freeze', groupId: 7, category: 'irregular', present: 'Freeze', past: 'Froze', participle: 'Frozen', meaning: 'Helar / Congelar', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-give', groupId: 7, category: 'irregular', present: 'Give', past: 'Gave', participle: 'Given', meaning: 'Dar', anchor: '3 pasos + talón' },
  { id: 'g7-hide', groupId: 7, category: 'irregular', present: 'Hide', past: 'Hid', participle: 'Hidden', meaning: 'Ocultar / Esconder', anchor: '3 pasos + talón (vocal corta)' },
  { id: 'g7-mistake', groupId: 7, category: 'irregular', present: 'Mistake', past: 'Mistook', participle: 'Mistaken', meaning: 'Equivocar', anchor: '3 pasos + talón (pasado -ook)' },
  { id: 'g7-ride', groupId: 7, category: 'irregular', present: 'Ride', past: 'Rode', participle: 'Ridden', meaning: 'Montar', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-rise', groupId: 7, category: 'irregular', present: 'Rise', past: 'Rose', participle: 'Risen', meaning: 'Levantarse / Subir', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-shake', groupId: 7, category: 'irregular', present: 'Shake', past: 'Shook', participle: 'Shaken', meaning: 'Sacudir', anchor: '3 pasos + talón (pasado -ook)' },
  { id: 'g7-shear', groupId: 7, category: 'irregular', present: 'Shear', past: 'Shore', participle: 'Shorn', meaning: 'Esquilar', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-speak', groupId: 7, category: 'irregular', present: 'Speak', past: 'Spoke', participle: 'Spoken', meaning: 'Hablar', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-steal', groupId: 7, category: 'irregular', present: 'Steal', past: 'Stole', participle: 'Stolen', meaning: 'Robar', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-stride', groupId: 7, category: 'irregular', present: 'Stride', past: 'Strode', participle: 'Stridden', meaning: 'Dar zancadas', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-swear', groupId: 7, category: 'irregular', present: 'Swear', past: 'Swore', participle: 'Sworn', meaning: 'Jurar', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-take', groupId: 7, category: 'irregular', present: 'Take', past: 'Took', participle: 'Taken', meaning: 'Coger / Tomar', anchor: '3 pasos + talón (pasado -ook)' },
  { id: 'g7-tear', groupId: 7, category: 'irregular', present: 'Tear', past: 'Tore', participle: 'Torn', meaning: 'Rasgar', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-tread', groupId: 7, category: 'irregular', present: 'Tread', past: 'Trod', participle: 'Trodden', meaning: 'Pisar / Hollar', anchor: '3 pasos + talón (vocal corta)' },
  { id: 'g7-undertake', groupId: 7, category: 'irregular', present: 'Undertake', past: 'Undertook', participle: 'Undertaken', meaning: 'Emprender', anchor: '3 pasos + talón (pasado -ook)' },
  { id: 'g7-wake', groupId: 7, category: 'irregular', present: 'Wake', past: 'Woke', participle: 'Woken', meaning: 'Despertarse', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-wear', groupId: 7, category: 'irregular', present: 'Wear', past: 'Wore', participle: 'Worn', meaning: 'Llevar puesto', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-weave', groupId: 7, category: 'irregular', present: 'Weave', past: 'Wove', participle: 'Woven', meaning: 'Tejer', anchor: '3 pasos + talón (pasado O)' },
  { id: 'g7-write', groupId: 7, category: 'irregular', present: 'Write', past: 'Wrote', participle: 'Written', meaning: 'Escribir', anchor: '3 pasos + talón (pasado O)' },

  // ======================== GRUPO 8: CASOS ESPECIALES (16) ========================
  { id: 'g8-be', groupId: 8, category: 'irregular', present: 'Be (am, are, is)', past: 'Was / Were', participle: 'Been', meaning: 'Ser / Estar', anchor: 'Señalarse el pecho con ambas manos', speakPresent: 'be', speakPast: 'was, were' },
  { id: 'g8-become', groupId: 8, category: 'irregular', present: 'Become', past: 'Became', participle: 'Become', meaning: 'Llegar a ser', anchor: 'Girar palmas hacia arriba (1ª=3ª)' },
  { id: 'g8-come', groupId: 8, category: 'irregular', present: 'Come', past: 'Came', participle: 'Come', meaning: 'Venir', anchor: 'Hacer gesto de llamar con mano (1ª=3ª)' },
  { id: 'g8-do', groupId: 8, category: 'irregular', present: 'Do (Does)', past: 'Did', participle: 'Done', meaning: 'Hacer', anchor: 'Simular acción manual rápida', speakPresent: 'do' },
  { id: 'g8-eat', groupId: 8, category: 'irregular', present: 'Eat', past: 'Ate', participle: 'Eaten', meaning: 'Comer', anchor: 'Llevar mano a la boca' },
  { id: 'g8-fall', groupId: 8, category: 'irregular', present: 'Fall', past: 'Fell', participle: 'Fallen', meaning: 'Caer', anchor: 'Bajar rápido el torso / manos' },
  { id: 'g8-go', groupId: 8, category: 'irregular', present: 'Go (Goes)', past: 'Went', participle: 'Gone', meaning: 'Ir', anchor: 'Señalar lejos + dar paso', speakPresent: 'go' },
  { id: 'g8-lie', groupId: 8, category: 'irregular', present: 'Lie', past: 'Lay', participle: 'Lain', meaning: 'Echarse / Tumbarse', anchor: 'Inclinar cabeza sobre manos' },
  { id: 'g8-overcome', groupId: 8, category: 'irregular', present: 'Overcome', past: 'Overcame', participle: 'Overcome', meaning: 'Vencer / Superar', anchor: 'Cruzar brazos y abrirlos (1ª=3ª)' },
  { id: 'g8-run', groupId: 8, category: 'irregular', present: 'Run', past: 'Ran', participle: 'Run', meaning: 'Correr', anchor: 'Mover brazos corriendo en sitio (1ª=3ª)' },
  { id: 'g8-see', groupId: 8, category: 'irregular', present: 'See', past: 'Saw', participle: 'Seen', meaning: 'Ver', anchor: 'Señalar ojos con dos dedos' },
  { id: 'g8-sew', groupId: 8, category: 'irregular', present: 'Sew', past: 'Sewed', participle: 'Sewed / Sewn', meaning: 'Coser', anchor: 'Simular pasar aguja', speakParticiple: 'sewn' },
  { id: 'g8-show', groupId: 8, category: 'irregular', present: 'Show', past: 'Showed', participle: 'Shown', meaning: 'Mostrar', anchor: 'Extender manos mostrando algo' },
  { id: 'g8-sow', groupId: 8, category: 'irregular', present: 'Sow', past: 'Sowed', participle: 'Sowed / Sown', meaning: 'Sembrar', anchor: 'Simular esparcir semillas', speakParticiple: 'sown' },
  { id: 'g8-swell', groupId: 8, category: 'irregular', present: 'Swell', past: 'Swelled', participle: 'Swollen', meaning: 'Hinchar', anchor: 'Inflar mejillas o abrir brazos' },
  { id: 'g8-undergo', groupId: 8, category: 'irregular', present: 'Undergo', past: 'Underwent', participle: 'Undergone', meaning: 'Sufrir / Someterse', anchor: 'Pasar mano por debajo de la otra' },

  // ======================== GRUPO 9: SONIDO /ɪd/ (16) ========================
  { id: 'g9-accept', groupId: 9, category: 'regular', present: 'Accept', past: 'Accepted', participle: 'Accepted', meaning: 'Aceptar', anchor: '2 toques: ac-cept / -ed' },
  { id: 'g9-count', groupId: 9, category: 'regular', present: 'Count', past: 'Counted', participle: 'Counted', meaning: 'Contar', anchor: '2 toques: count / -ed' },
  { id: 'g9-date', groupId: 9, category: 'regular', present: 'Date', past: 'Dated', participle: 'Dated', meaning: 'Citar / Fechar', anchor: '2 toques: dat / -ed' },
  { id: 'g9-end', groupId: 9, category: 'regular', present: 'End', past: 'Ended', participle: 'Ended', meaning: 'Terminar', anchor: '2 toques: end / -ed' },
  { id: 'g9-expect', groupId: 9, category: 'regular', present: 'Expect', past: 'Expected', participle: 'Expected', meaning: 'Esperar (expectativa)', anchor: '2 toques: ex-pect / -ed' },
  { id: 'g9-intend', groupId: 9, category: 'regular', present: 'Intend', past: 'Intended', participle: 'Intended', meaning: 'Intentar / Tener intención', anchor: '2 toques: in-tend / -ed' },
  { id: 'g9-need', groupId: 9, category: 'regular', present: 'Need', past: 'Needed', participle: 'Needed', meaning: 'Necesitar', anchor: '2 toques: need / -ed' },
  { id: 'g9-plant', groupId: 9, category: 'regular', present: 'Plant', past: 'Planted', participle: 'Planted', meaning: 'Plantar', anchor: '2 toques: plant / -ed' },
  { id: 'g9-point', groupId: 9, category: 'regular', present: 'Point', past: 'Pointed', participle: 'Pointed', meaning: 'Señalar', anchor: '2 toques: point / -ed' },
  { id: 'g9-rent', groupId: 9, category: 'regular', present: 'Rent', past: 'Rented', participle: 'Rented', meaning: 'Rentar / Alquilar', anchor: '2 toques: rent / -ed' },
  { id: 'g9-repeat', groupId: 9, category: 'regular', present: 'Repeat', past: 'Repeated', participle: 'Repeated', meaning: 'Repetir', anchor: '2 toques: re-peat / -ed' },
  { id: 'g9-resist', groupId: 9, category: 'regular', present: 'Resist', past: 'Resisted', participle: 'Resisted', meaning: 'Resistir', anchor: '2 toques: re-sist / -ed' },
  { id: 'g9-start', groupId: 9, category: 'regular', present: 'Start', past: 'Started', participle: 'Started', meaning: 'Empezar', anchor: '2 toques: start / -ed' },
  { id: 'g9-visit', groupId: 9, category: 'regular', present: 'Visit', past: 'Visited', participle: 'Visited', meaning: 'Visitar', anchor: '2 toques: vis-it / -ed' },
  { id: 'g9-wait', groupId: 9, category: 'regular', present: 'Wait', past: 'Waited', participle: 'Waited', meaning: 'Esperar (tiempo)', anchor: '2 toques: wait / -ed' },
  { id: 'g9-want', groupId: 9, category: 'regular', present: 'Want', past: 'Wanted', participle: 'Wanted', meaning: 'Querer', anchor: '2 toques: want / -ed' },

  // ======================== GRUPO 10: SONIDO /t/ (22) ========================
  { id: 'g10-ask', groupId: 10, category: 'regular', present: 'Ask', past: 'Asked', participle: 'Asked', meaning: 'Preguntar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-cook', groupId: 10, category: 'regular', present: 'Cook', past: 'Cooked', participle: 'Cooked', meaning: 'Cocinar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-dance', groupId: 10, category: 'regular', present: 'Dance', past: 'Danced', participle: 'Danced', meaning: 'Bailar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-dress', groupId: 10, category: 'regular', present: 'Dress', past: 'Dressed', participle: 'Dressed', meaning: 'Vestir', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-erase', groupId: 10, category: 'regular', present: 'Erase', past: 'Erased', participle: 'Erased', meaning: 'Borrar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-finish', groupId: 10, category: 'regular', present: 'Finish', past: 'Finished', participle: 'Finished', meaning: 'Terminar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-help', groupId: 10, category: 'regular', present: 'Help', past: 'Helped', participle: 'Helped', meaning: 'Ayudar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-jump', groupId: 10, category: 'regular', present: 'Jump', past: 'Jumped', participle: 'Jumped', meaning: 'Brincar / Saltar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-like', groupId: 10, category: 'regular', present: 'Like', past: 'Liked', participle: 'Liked', meaning: 'Gustar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-look', groupId: 10, category: 'regular', present: 'Look', past: 'Looked', participle: 'Looked', meaning: 'Mirar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-miss', groupId: 10, category: 'regular', present: 'Miss', past: 'Missed', participle: 'Missed', meaning: 'Extrañar / Perder', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-practice', groupId: 10, category: 'regular', present: 'Practice', past: 'Practiced', participle: 'Practiced', meaning: 'Practicar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-push', groupId: 10, category: 'regular', present: 'Push', past: 'Pushed', participle: 'Pushed', meaning: 'Empujar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-shop', groupId: 10, category: 'regular', present: 'Shop', past: 'Shopped', participle: 'Shopped', meaning: 'Comprar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-smoke', groupId: 10, category: 'regular', present: 'Smoke', past: 'Smoked', participle: 'Smoked', meaning: 'Fumar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-stop', groupId: 10, category: 'regular', present: 'Stop', past: 'Stopped', participle: 'Stopped', meaning: 'Detener', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-talk', groupId: 10, category: 'regular', present: 'Talk', past: 'Talked', participle: 'Talked', meaning: 'Hablar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-use', groupId: 10, category: 'regular', present: 'Use', past: 'Used', participle: 'Used', meaning: 'Usar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-walk', groupId: 10, category: 'regular', present: 'Walk', past: 'Walked', participle: 'Walked', meaning: 'Caminar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-wash', groupId: 10, category: 'regular', present: 'Wash', past: 'Washed', participle: 'Washed', meaning: 'Lavar', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-wish', groupId: 10, category: 'regular', present: 'Wish', past: 'Wished', participle: 'Wished', meaning: 'Desear', anchor: 'Garganta quieta + corte seco /t/' },
  { id: 'g10-work', groupId: 10, category: 'regular', present: 'Work', past: 'Worked', participle: 'Worked', meaning: 'Trabajar', anchor: 'Garganta quieta + corte seco /t/' },

  // ======================== GRUPO 11: SONIDO /d/ (31) ========================
  { id: 'g11-answer', groupId: 11, category: 'regular', present: 'Answer', past: 'Answered', participle: 'Answered', meaning: 'Responder', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-arrive', groupId: 11, category: 'regular', present: 'Arrive', past: 'Arrived', participle: 'Arrived', meaning: 'Llegar / Arribar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-belong', groupId: 11, category: 'regular', present: 'Belong', past: 'Belonged', participle: 'Belonged', meaning: 'Pertenecer', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-change', groupId: 11, category: 'regular', present: 'Change', past: 'Changed', participle: 'Changed', meaning: 'Cambiar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-clean', groupId: 11, category: 'regular', present: 'Clean', past: 'Cleaned', participle: 'Cleaned', meaning: 'Limpiar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-climb', groupId: 11, category: 'regular', present: 'Climb', past: 'Climbed', participle: 'Climbed', meaning: 'Escalar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-close', groupId: 11, category: 'regular', present: 'Close', past: 'Closed', participle: 'Closed', meaning: 'Cerrar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-consider', groupId: 11, category: 'regular', present: 'Consider', past: 'Considered', participle: 'Considered', meaning: 'Considerar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-dare', groupId: 11, category: 'regular', present: 'Dare', past: 'Dared', participle: 'Dared', meaning: 'Retar / Atreverse', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-deliver', groupId: 11, category: 'regular', present: 'Deliver', past: 'Delivered', participle: 'Delivered', meaning: 'Entregar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-enjoy', groupId: 11, category: 'regular', present: 'Enjoy', past: 'Enjoyed', participle: 'Enjoyed', meaning: 'Disfrutar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-fill', groupId: 11, category: 'regular', present: 'Fill', past: 'Filled', participle: 'Filled', meaning: 'Llenar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-follow', groupId: 11, category: 'regular', present: 'Follow', past: 'Followed', participle: 'Followed', meaning: 'Seguir', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-hurry', groupId: 11, category: 'regular', present: 'Hurry', past: 'Hurried', participle: 'Hurried', meaning: 'Apurar / Darse prisa', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-learn', groupId: 11, category: 'regular', present: 'Learn', past: 'Learned', participle: 'Learned', meaning: 'Aprender', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-listen', groupId: 11, category: 'regular', present: 'Listen', past: 'Listened', participle: 'Listened', meaning: 'Escuchar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-live', groupId: 11, category: 'regular', present: 'Live', past: 'Lived', participle: 'Lived', meaning: 'Vivir', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-love', groupId: 11, category: 'regular', present: 'Love', past: 'Loved', participle: 'Loved', meaning: 'Amar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-name', groupId: 11, category: 'regular', present: 'Name', past: 'Named', participle: 'Named', meaning: 'Nombrar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-open', groupId: 11, category: 'regular', present: 'Open', past: 'Opened', participle: 'Opened', meaning: 'Abrir', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-order', groupId: 11, category: 'regular', present: 'Order', past: 'Ordered', participle: 'Ordered', meaning: 'Ordenar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-plan', groupId: 11, category: 'regular', present: 'Plan', past: 'Planned', participle: 'Planned', meaning: 'Planear', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-play', groupId: 11, category: 'regular', present: 'Play', past: 'Played', participle: 'Played', meaning: 'Jugar / Tocar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-rain', groupId: 11, category: 'regular', present: 'Rain', past: 'Rained', participle: 'Rained', meaning: 'Llover', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-remember', groupId: 11, category: 'regular', present: 'Remember', past: 'Remembered', participle: 'Remembered', meaning: 'Recordar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-show', groupId: 11, category: 'regular', present: 'Show', past: 'Showed', participle: 'Showed', meaning: 'Mostrar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-stay', groupId: 11, category: 'regular', present: 'Stay', past: 'Stayed', participle: 'Stayed', meaning: 'Permanecer / Quedarse', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-study', groupId: 11, category: 'regular', present: 'Study', past: 'Studied', participle: 'Studied', meaning: 'Estudiar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-travel', groupId: 11, category: 'regular', present: 'Travel', past: 'Traveled', participle: 'Traveled', meaning: 'Viajar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-try', groupId: 11, category: 'regular', present: 'Try', past: 'Tried', participle: 'Tried', meaning: 'Intentar / Tratar', anchor: 'Sentir vibración en cuello + /d/' },
  { id: 'g11-turn', groupId: 11, category: 'regular', present: 'Turn', past: 'Turned', participle: 'Turned', meaning: 'Voltear / Dar vuelta', anchor: 'Sentir vibración en cuello + /d/' },
];

export function getGroupById(groupId: number): VerbGroup {
  return VERB_GROUPS.find((g) => g.id === groupId) ?? VERB_GROUPS[0];
}

export function getVerbsByGroup(groupId: number): VerbItem[] {
  return VERBS.filter((v) => v.groupId === groupId);
}
