import { motion } from 'motion/react';
import type { VerbGroup } from '../data/verbs';

interface KinestheticMotionDiagramProps {
  group: VerbGroup;
  activeBeat: 0 | 1 | 2 | null;
  verbAnchor: string;
}

export function KinestheticMotionDiagram({
  group,
  activeBeat,
  verbAnchor,
}: KinestheticMotionDiagramProps) {
  const { motionType, accentHex, beatLabels } = group;

  const renderDiagram = () => {
    switch (motionType) {
      case 'palm-strike': {
        const isStriking = activeBeat !== null;
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            {/* Table surface */}
            <line x1="36" y1="108" x2="324" y2="108" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            {/* Impact rings at 3 equal beat positions */}
            {[90, 180, 270].map((cx, idx) => {
              const active = activeBeat === idx;
              return (
                <g key={cx}>
                  <motion.circle
                    cx={cx}
                    cy={108}
                    r={20}
                    fill="none"
                    stroke={accentHex}
                    strokeWidth="2"
                    initial={false}
                    animate={{
                      scale: active ? 1.35 : 0.7,
                      opacity: active ? 0.9 : 0.18,
                    }}
                    transition={{ duration: 0.18 }}
                    style={{ transformOrigin: `${cx}px 108px` }}
                  />
                  <circle cx={cx} cy={108} r="5" fill={active ? accentHex : '#94A3B8'} />
                  <text
                    x={cx}
                    y={130}
                    textAnchor="middle"
                    className="text-[11px] font-medium fill-slate-500"
                  >
                    {idx + 1}.° golpe
                  </text>
                </g>
              );
            })}
            {/* Palm icon descending */}
            <motion.g
              initial={false}
              animate={{
                x: activeBeat === null ? 0 : activeBeat === 0 ? -90 : activeBeat === 1 ? 0 : 90,
                y: isStriking ? 22 : 0,
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            >
              <rect x="158" y="34" width="44" height="36" rx="10" fill={accentHex} fillOpacity="0.14" stroke={accentHex} strokeWidth="2" />
              <path d="M168 48v-10m8 10V34m8 14V34m8 14v-8" stroke={accentHex} strokeWidth="2.2" strokeLinecap="round" />
            </motion.g>
          </svg>
        );
      }

      case 'vocal-ladder': {
        const yLevels = [30, 70, 110];
        const xPositions = [90, 180, 270];
        const vowels = ['I', 'A', 'U'];
        const heightTags = ['Arriba', 'Pecho', 'Abajo'];
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            {/* Horizontal tier guides */}
            {yLevels.map((y, idx) => (
              <g key={y}>
                <line
                  x1="50"
                  y1={y}
                  x2="310"
                  y2={y}
                  stroke={activeBeat === idx ? accentHex : '#E2E8F0'}
                  strokeWidth={activeBeat === idx ? 2 : 1}
                  strokeDasharray="4 4"
                />
                <text x="20" y={y + 4} className="text-[11px] font-semibold fill-slate-500">
                  {heightTags[idx]}
                </text>
              </g>
            ))}
            {/* Connecting descent path */}
            <path d="M 90 30 L 180 70 L 270 110" fill="none" stroke="#CBD5E1" strokeWidth="2" />
            {/* Vowel nodes */}
            {xPositions.map((cx, idx) => {
              const active = activeBeat === idx;
              return (
                <g key={cx}>
                  <motion.circle
                    cx={cx}
                    cy={yLevels[idx]}
                    r={16}
                    fill={active ? accentHex : '#FFFFFF'}
                    stroke={active ? accentHex : '#94A3B8'}
                    strokeWidth="2"
                    animate={{ scale: active ? 1.18 : 1 }}
                    transition={{ duration: 0.18 }}
                    style={{ transformOrigin: `${cx}px ${yLevels[idx]}px` }}
                  />
                  <text
                    x={cx}
                    y={yLevels[idx] + 5}
                    textAnchor="middle"
                    className={`text-[13px] font-bold ${active ? 'fill-white' : 'fill-slate-700'}`}
                  >
                    {vowels[idx]}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }

      case 'step-twin-clap': {
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            {/* Left side: 1 step forward */}
            <motion.g
              animate={{ scale: activeBeat === 0 ? 1.12 : 1, opacity: activeBeat === 0 ? 1 : 0.55 }}
              transition={{ duration: 0.16 }}
              style={{ transformOrigin: '85px 72px' }}
            >
              <rect x="40" y="34" width="90" height="72" rx="12" fill={activeBeat === 0 ? '#ECFDF5' : '#F8FAFC'} stroke={activeBeat === 0 ? accentHex : '#CBD5E1'} strokeWidth="2" />
              <path d="M72 68h26m0 0-8-8m8 8-8 8" stroke={accentHex} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <text x="85" y="94" textAnchor="middle" className="text-[11px] font-semibold fill-slate-700">
                1 Paso
              </text>
            </motion.g>

            {/* Connector */}
            <path d="M142 70h26" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />

            {/* Right side: Twin equal box for beats 2 & 3 */}
            <rect x="178" y="24" width="146" height="92" rx="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="5 4" />
            <text x="251" y="42" textAnchor="middle" className="text-[10px] font-semibold fill-slate-500">
              MISMO LUGAR · GEMELOS
            </text>
            {[216, 286].map((cx, i) => {
              const beatIdx = (i + 1) as 1 | 2;
              const active = activeBeat === beatIdx;
              return (
                <motion.g
                  key={cx}
                  animate={{ scale: active ? 1.14 : 1 }}
                  transition={{ duration: 0.16 }}
                  style={{ transformOrigin: `${cx}px 76px` }}
                >
                  <circle cx={cx} cy={76} r="22" fill={active ? accentHex : '#FFFFFF'} stroke={active ? accentHex : '#94A3B8'} strokeWidth="2" />
                  <text x={cx} y={80} textAnchor="middle" className={`text-[11px] font-bold ${active ? 'fill-white' : 'fill-slate-700'}`}>
                    Aplauso {i + 1}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        );
      }

      case 'arm-arc': {
        const isExtended = activeBeat === 1 || activeBeat === 2;
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            {/* Wide throwing arc */}
            <path
              d="M 60 105 Q 180 15 305 62"
              fill="none"
              stroke={isExtended ? accentHex : '#CBD5E1'}
              strokeWidth={isExtended ? 3.5 : 2}
              strokeDasharray={isExtended ? 'none' : '5 5'}
            />
            <motion.circle
              r="14"
              fill={accentHex}
              initial={false}
              animate={{
                cx: activeBeat === 0 ? 64 : activeBeat === 1 ? 215 : activeBeat === 2 ? 302 : 120,
                cy: activeBeat === 0 ? 102 : activeBeat === 1 ? 45 : activeBeat === 2 ? 62 : 76,
                scale: activeBeat !== null ? 1.15 : 0.95,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            />
            <text x="64" y="128" textAnchor="middle" className="text-[11px] font-medium fill-slate-500">
              Inicio
            </text>
            <text x="255" y="92" textAnchor="middle" className="text-[12px] font-bold fill-amber-700">
              /ɔːt/ largo y amplio
            </text>
          </svg>
        );
      }

      case 'wrist-or-pull': {
        const isCircular = verbAnchor.includes('-ound');
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            {isCircular ? (
              <>
                <motion.circle
                  cx="180"
                  cy="70"
                  r="40"
                  fill="none"
                  stroke={accentHex}
                  strokeWidth="3"
                  strokeDasharray="18 10"
                  animate={{ rotate: activeBeat !== null ? (activeBeat + 1) * 120 : 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ transformOrigin: '180px 70px' }}
                />
                <circle cx="180" cy="70" r="8" fill={accentHex} />
                <text x="180" y="128" textAnchor="middle" className="text-[11px] font-semibold fill-slate-600">
                  Giro circular de muñeca (-ound)
                </text>
              </>
            ) : (
              <>
                {/* Chest target */}
                <rect x="52" y="42" width="46" height="56" rx="10" fill="#F0FDFA" stroke={accentHex} strokeWidth="2" />
                <text x="75" y="74" textAnchor="middle" className="text-[11px] font-bold fill-teal-800">
                  Pecho
                </text>
                {/* Rope pull arrows */}
                <motion.g
                  animate={{ x: activeBeat === 1 || activeBeat === 2 ? -36 : 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <line x1="120" y1="70" x2="290" y2="70" stroke={accentHex} strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M134 58l-14 12 14 12" fill="none" stroke={accentHex} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>
                <text x="200" y="120" textAnchor="middle" className="text-[11px] font-semibold fill-slate-600">
                  Jalar cuerda hacia el pecho
                </text>
              </>
            )}
          </svg>
        );
      }

      case 'wind-push': {
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            {[42, 70, 98].map((y, idx) => {
              const active = activeBeat === idx || activeBeat !== null;
              return (
                <motion.g
                  key={y}
                  animate={{
                    x: activeBeat === idx ? 26 : active ? 10 : 0,
                    opacity: activeBeat === idx ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <path
                    d={`M 55 ${y} Q 150 ${y - 12} 270 ${y}`}
                    fill="none"
                    stroke={accentHex}
                    strokeWidth={activeBeat === idx ? 3.5 : 2}
                    strokeLinecap="round"
                  />
                  <path
                    d={`M 260 ${y - 6} L 274 ${y} L 260 ${y + 6}`}
                    fill="none"
                    stroke={accentHex}
                    strokeWidth={activeBeat === idx ? 3 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.g>
              );
            })}
            <text x="180" y="128" textAnchor="middle" className="text-[11px] font-semibold fill-slate-600">
              Empujar corriente de aire hacia adelante
            </text>
          </svg>
        );
      }

      case 'three-step-heel': {
        const steps = [80, 180, 280];
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            <line x1="36" y1="102" x2="324" y2="102" stroke="#CBD5E1" strokeWidth="2" />
            {steps.map((x, idx) => {
              const active = activeBeat === idx;
              const isHeel = idx === 2;
              return (
                <g key={x}>
                  <motion.rect
                    x={x - 24}
                    y={active ? 44 : 52}
                    width="48"
                    height="36"
                    rx="10"
                    fill={active ? accentHex : '#FFFFFF'}
                    stroke={active ? accentHex : '#94A3B8'}
                    strokeWidth="2"
                    animate={{ scale: active ? 1.12 : 1 }}
                    transition={{ duration: 0.16 }}
                    style={{ transformOrigin: `${x}px 70px` }}
                  />
                  <text x={x} y={active ? 66 : 74} textAnchor="middle" className={`text-[11px] font-bold ${active ? 'fill-white' : 'fill-slate-700'}`}>
                    {isHeel ? 'Talón -EN' : `Paso ${idx + 1}`}
                  </text>
                  {isHeel && active && (
                    <motion.circle
                      cx={x}
                      cy={102}
                      r={18}
                      fill="none"
                      stroke={accentHex}
                      strokeWidth="2.5"
                      initial={{ scale: 0.6, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      style={{ transformOrigin: `${x}px 102px` }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        );
      }

      case 'mime-action': {
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            <rect x="44" y="24" width="272" height="92" rx="14" fill="#FEF2F2" stroke="#FECACA" strokeWidth="1.5" />
            {[95, 180, 265].map((cx, idx) => {
              const active = activeBeat === idx;
              return (
                <motion.g
                  key={cx}
                  animate={{ scale: active ? 1.15 : 1 }}
                  transition={{ duration: 0.16 }}
                  style={{ transformOrigin: `${cx}px 62px` }}
                >
                  <circle cx={cx} cy={62} r="18" fill={active ? accentHex : '#FFFFFF'} stroke={accentHex} strokeWidth="2" />
                  <text x={cx} y={66} textAnchor="middle" className={`text-[12px] font-bold ${active ? 'fill-white' : 'fill-red-700'}`}>
                    {idx + 1}
                  </text>
                </motion.g>
              );
            })}
            <text x="180" y="102" textAnchor="middle" className="text-[12px] font-semibold fill-red-900">
              Mímica teatral: {verbAnchor}
            </text>
          </svg>
        );
      }

      case 'syllable-bounce': {
        const isBounce = activeBeat === 1 || activeBeat === 2;
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            <line x1="40" y1="106" x2="320" y2="106" stroke="#CBD5E1" strokeWidth="2.5" />
            {/* Tap 1: Root */}
            <motion.circle
              cx="115"
              cy="76"
              r="20"
              fill={activeBeat !== null ? accentHex : '#FFFFFF'}
              stroke={accentHex}
              strokeWidth="2"
              animate={{ y: activeBeat === 0 ? 12 : 0 }}
            />
            <text x="115" y="80" textAnchor="middle" className={`text-[11px] font-bold ${activeBeat !== null ? 'fill-white' : 'fill-slate-700'}`}>
              Raíz
            </text>
            {/* Bounce arc */}
            <path d="M 135 64 Q 185 18 235 64" fill="none" stroke={isBounce ? accentHex : '#94A3B8'} strokeWidth="2.5" strokeDasharray="4 4" />
            {/* Tap 2: Extra syllable -ed */}
            <motion.circle
              cx="245"
              cy="76"
              r="22"
              fill={isBounce ? accentHex : '#FFFFFF'}
              stroke={accentHex}
              strokeWidth="2"
              animate={{ y: isBounce ? 14 : 0, scale: isBounce ? 1.12 : 1 }}
              style={{ transformOrigin: '245px 76px' }}
            />
            <text x="245" y="80" textAnchor="middle" className={`text-[12px] font-bold ${isBounce ? 'fill-white' : 'fill-slate-700'}`}>
              /-ɪd/
            </text>
            <text x="180" y="128" textAnchor="middle" className="text-[11px] font-semibold fill-slate-600">
              2 toques separados: raíz + sílaba extra
            </text>
          </svg>
        );
      }

      case 'throat-dry-cut': {
        const isCut = activeBeat === 1 || activeBeat === 2;
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            {/* Throat quiet circle */}
            <circle cx="105" cy="68" r="28" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
            <line x1="87" y1="68" x2="123" y2="68" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
            <text x="105" y="114" textAnchor="middle" className="text-[11px] font-semibold fill-slate-600">
              Garganta quieta
            </text>
            {/* Sharp dry air slice */}
            <motion.g
              animate={{ x: isCut ? 18 : 0, opacity: isCut ? 1 : 0.45 }}
              transition={{ duration: 0.14 }}
            >
              <line x1="185" y1="44" x2="295" y2="84" stroke={accentHex} strokeWidth="4" strokeLinecap="round" />
              <text x="242" y="114" textAnchor="middle" className="text-[12px] font-bold fill-amber-700">
                Corte seco /-t/
              </text>
            </motion.g>
          </svg>
        );
      }

      case 'throat-vibrate': {
        const isVibrating = activeBeat === 1 || activeBeat === 2;
        return (
          <svg viewBox="0 0 360 140" className="w-full h-36" aria-hidden="true">
            <circle cx="120" cy="68" r="30" fill={isVibrating ? '#ECFDF5' : '#F8FAFC'} stroke={accentHex} strokeWidth="2" />
            <motion.path
              d="M 96 68 Q 108 50 120 68 T 144 68"
              fill="none"
              stroke={accentHex}
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ scaleY: isVibrating ? 1.45 : 0.7 }}
              transition={{ duration: 0.16 }}
              style={{ transformOrigin: '120px 68px' }}
            />
            <motion.path
              d="M 176 52 Q 195 68 176 84 M 192 44 Q 216 68 192 92"
              fill="none"
              stroke={accentHex}
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ opacity: isVibrating ? 1 : 0.25 }}
            />
            <text x="258" y="72" textAnchor="middle" className="text-[13px] font-bold fill-emerald-800">
              Zumbido + /-d/
            </text>
            <text x="180" y="120" textAnchor="middle" className="text-[11px] font-semibold fill-slate-600">
              Dedos en el cuello sintiendo vibración
            </text>
          </svg>
        );
      }
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-500">
          Coreografía Física · {group.accentLabel}
        </span>
        <span className="text-xs font-mono text-slate-600 tabular-nums">
          {activeBeat !== null ? `Tiempo ${activeBeat + 1}/3: ${beatLabels[activeBeat]}` : group.rhythmCue}
        </span>
      </div>
      {renderDiagram()}
    </div>
  );
}
