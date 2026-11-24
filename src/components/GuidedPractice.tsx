import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Hand,
  Play,
  Repeat,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  VERB_GROUPS,
  getGroupById,
  getVerbsByGroup,
  type VerbItem,
} from '../data/verbs';
import {
  getBeatSpeakTexts,
  playKinestheticCue,
  speakEnglishWord,
} from '../utils/audio';
import { KinestheticMotionDiagram } from './KinestheticMotionDiagram';

interface GuidedPracticeProps {
  selectedGroupId: number;
  selectedVerbId: string | null;
  masteredIds: Set<string>;
  onSelectGroup: (groupId: number) => void;
  onSelectVerb: (verbId: string) => void;
  onToggleMastered: (verbId: string) => void;
}

type QueueFilter = 'all' | 'pending' | 'mastered';

export function GuidedPractice({
  selectedGroupId,
  selectedVerbId,
  masteredIds,
  onSelectGroup,
  onSelectVerb,
  onToggleMastered,
}: GuidedPracticeProps) {
  const group = useMemo(() => getGroupById(selectedGroupId), [selectedGroupId]);
  const groupVerbs = useMemo(() => getVerbsByGroup(selectedGroupId), [selectedGroupId]);

  const [queueFilter, setQueueFilter] = useState<QueueFilter>('all');
  const [activeBeat, setActiveBeat] = useState<0 | 1 | 2 | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [loopMode, setLoopMode] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [soundCueEnabled, setSoundCueEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recallMode, setRecallMode] = useState(false);
  const [revealedBeats, setRevealedBeats] = useState<[boolean, boolean, boolean]>([true, true, true]);
  const [tappedBeats, setTappedBeats] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const sequenceAbortRef = useRef<boolean>(false);

  const filteredQueue = useMemo(() => {
    if (queueFilter === 'pending') return groupVerbs.filter((v) => !masteredIds.has(v.id));
    if (queueFilter === 'mastered') return groupVerbs.filter((v) => masteredIds.has(v.id));
    return groupVerbs;
  }, [groupVerbs, queueFilter, masteredIds]);

  const currentVerb: VerbItem = useMemo(() => {
    const match = groupVerbs.find((v) => v.id === selectedVerbId);
    return match ?? groupVerbs[0];
  }, [groupVerbs, selectedVerbId]);

  const currentIndex = useMemo(
    () => groupVerbs.findIndex((v) => v.id === currentVerb.id),
    [groupVerbs, currentVerb.id]
  );

  const masteredInGroup = useMemo(
    () => groupVerbs.filter((v) => masteredIds.has(v.id)).length,
    [groupVerbs, masteredIds]
  );

  // Reset tap & reveal state when verb changes
  useEffect(() => {
    sequenceAbortRef.current = true;
    setIsPlayingSequence(false);
    setActiveBeat(null);
    setTappedBeats([false, false, false]);
    setRevealedBeats(recallMode ? [true, false, false] : [true, true, true]);
  }, [currentVerb.id, recallMode]);

  const stopSequence = useCallback(() => {
    sequenceAbortRef.current = true;
    setIsPlayingSequence(false);
    setActiveBeat(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const triggerSingleBeat = useCallback(
    async (beatIdx: 0 | 1 | 2) => {
      setActiveBeat(beatIdx);
      setRevealedBeats((prev) => {
        const next: [boolean, boolean, boolean] = [...prev];
        next[beatIdx] = true;
        return next;
      });
      setTappedBeats((prev) => {
        const next: [boolean, boolean, boolean] = [...prev];
        next[beatIdx] = true;
        return next;
      });

      if (soundCueEnabled) {
        playKinestheticCue(group.motionType, beatIdx);
      }

      if (voiceEnabled) {
        const texts = getBeatSpeakTexts(currentVerb);
        await speakEnglishWord(texts[beatIdx], speechRate);
      } else {
        await new Promise((r) => setTimeout(r, 380));
      }

      setActiveBeat((prev) => (prev === beatIdx ? null : prev));
    },
    [currentVerb, group.motionType, soundCueEnabled, voiceEnabled, speechRate]
  );

  const playThreeBeatSequence = useCallback(async () => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }

    sequenceAbortRef.current = false;
    setIsPlayingSequence(true);

    const texts = getBeatSpeakTexts(currentVerb);
    const beatDelay = Math.round(280 / speechRate);

    do {
      for (const idx of [0, 1, 2] as const) {
        if (sequenceAbortRef.current) break;
        setActiveBeat(idx);
        setRevealedBeats((prev) => {
          const next: [boolean, boolean, boolean] = [...prev];
          next[idx] = true;
          return next;
        });

        if (soundCueEnabled) {
          playKinestheticCue(group.motionType, idx);
        }

        if (voiceEnabled) {
          await speakEnglishWord(texts[idx], speechRate);
        } else {
          await new Promise((r) => setTimeout(r, 520));
        }

        if (sequenceAbortRef.current) break;
        await new Promise((r) => setTimeout(r, beatDelay));
      }

      if (sequenceAbortRef.current || !loopMode) break;
      await new Promise((r) => setTimeout(r, 650));
    } while (!sequenceAbortRef.current && loopMode);

    setActiveBeat(null);
    setIsPlayingSequence(false);
  }, [
    isPlayingSequence,
    stopSequence,
    currentVerb,
    speechRate,
    soundCueEnabled,
    group.motionType,
    voiceEnabled,
    loopMode,
  ]);

  const goToPrevVerb = useCallback(() => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : groupVerbs.length - 1;
    onSelectVerb(groupVerbs[prevIdx].id);
  }, [currentIndex, groupVerbs, onSelectVerb]);

  const goToNextVerb = useCallback(() => {
    const nextIdx = currentIndex < groupVerbs.length - 1 ? currentIndex + 1 : 0;
    onSelectVerb(groupVerbs[nextIdx].id);
  }, [currentIndex, groupVerbs, onSelectVerb]);

  // Keyboard shortcuts for physical desk practice
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        playThreeBeatSequence();
      } else if (e.key === '1') {
        e.preventDefault();
        triggerSingleBeat(0);
      } else if (e.key === '2') {
        e.preventDefault();
        triggerSingleBeat(1);
      } else if (e.key === '3') {
        e.preventDefault();
        triggerSingleBeat(2);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextVerb();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevVerb();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onToggleMastered(currentVerb.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playThreeBeatSequence, triggerSingleBeat, goToNextVerb, goToPrevVerb, onToggleMastered, currentVerb.id]);

  const isMastered = masteredIds.has(currentVerb.id);
  const allThreeTapped = tappedBeats[0] && tappedBeats[1] && tappedBeats[2];

  const beats = [
    { label: '1. Presente', value: currentVerb.present, cue: group.beatLabels[0], keyHint: 'Tecla 1' },
    { label: '2. Pasado Simple', value: currentVerb.past, cue: group.beatLabels[1], keyHint: 'Tecla 2' },
    { label: '3. Participio Pasado', value: currentVerb.participle, cue: group.beatLabels[2], keyHint: 'Tecla 3' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT ZONE (Interactive Stage - 60-65%) */}
      <section className="lg:col-span-7 xl:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        {/* Quiet unboxed metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="text-slate-900 font-semibold">{group.title}</span>
            <span aria-hidden="true">·</span>
            <span>{group.category === 'irregular' ? 'Irregular' : 'Regular'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Verbo {currentIndex + 1} de {groupVerbs.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onToggleMastered(currentVerb.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isMastered
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isMastered ? 'Dominado (M)' : 'Marcar dominado (M)'}</span>
          </button>
        </div>

        {/* Spanish meaning focal headline */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Significado en español
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              {currentVerb.meaning}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Ancla física exacta
            </p>
            <p className="text-sm font-semibold text-blue-700">
              {currentVerb.anchor}
            </p>
          </div>
        </div>

        {/* 3 Interactive Tactile Beat Pads */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          {beats.map((beat, idx) => {
            const beatIdx = idx as 0 | 1 | 2;
            const isActive = activeBeat === beatIdx;
            const isRevealed = revealedBeats[beatIdx];
            const isTapped = tappedBeats[beatIdx];

            return (
              <button
                key={beat.label}
                type="button"
                onClick={() => triggerSingleBeat(beatIdx)}
                className={`group relative text-left rounded-xl p-4 sm:p-5 border transition-all cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/70 -translate-y-0.5'
                    : isTapped
                    ? 'border-emerald-300 bg-emerald-50/30 hover:border-blue-400'
                    : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold text-slate-500">
                    {beat.label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {beat.keyHint}
                  </span>
                </div>

                <div className="min-h-[2.5rem] flex items-center">
                  {isRevealed ? (
                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 break-words">
                      {beat.value}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700">
                      <Hand className="w-4 h-4" />
                      <span>Toca para revelar</span>
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2 text-xs text-slate-600">
                  <span className="truncate">{beat.cue}</span>
                  <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Kinesthetic Motion Visualizer */}
        <KinestheticMotionDiagram
          group={group}
          activeBeat={activeBeat}
          verbAnchor={currentVerb.anchor}
        />

        {/* Bottom Stage Action Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={playThreeBeatSequence}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isPlayingSequence
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isPlayingSequence ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Detener ritmo</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Reproducir 3 tiempos (Espacio)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setLoopMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                loopMode
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Repetir bucle: {loopMode ? 'Sí' : 'No'}</span>
            </button>

            {allThreeTapped && !isMastered && (
              <button
                type="button"
                onClick={() => {
                  onToggleMastered(currentVerb.id);
                  goToNextVerb();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Completar y seguir</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevVerb}
              aria-label="Verbo anterior"
              className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              onClick={goToNextVerb}
              aria-label="Siguiente verbo"
              className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* RIGHT ZONE (Control & Concept Deck - 35-40%) */}
      <aside className="lg:col-span-5 xl:col-span-4 space-y-5">
        {/* Group Selector & Strategy Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <label htmlFor="group-select" className="block text-xs font-semibold text-slate-500 mb-2">
            Cambiar bloque kinestésico
          </label>
          <select
            id="group-select"
            value={selectedGroupId}
            onChange={(e) => onSelectGroup(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-2 focus:outline-blue-600 cursor-pointer"
          >
            <optgroup label="Parte 1: Verbos Irregulares (154)">
              {VERB_GROUPS.filter((g) => g.category === 'irregular').map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({getVerbsByGroup(g.id).length})
                </option>
              ))}
            </optgroup>
            <optgroup label="Parte 2: Verbos Regulares (69)">
              {VERB_GROUPS.filter((g) => g.category === 'regular').map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({getVerbsByGroup(g.id).length})
                </option>
              ))}
            </optgroup>
          </select>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 mb-1.5">
              Estrategia física del grupo
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {group.strategy}
            </p>
          </div>

          {/* Group progress bar */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
              <span>Progreso en este grupo</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                {masteredInGroup} / {groupVerbs.length}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${Math.round((masteredInGroup / groupVerbs.length) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Audio & Recall Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Ajustes de práctica
          </h2>

          {/* Speed control */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span className="font-medium">Velocidad del ritmo</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                {speechRate.toFixed(2)}×
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { label: 'Lento', value: 0.75 },
                { label: 'Normal', value: 0.95 },
                { label: 'Fluido', value: 1.15 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSpeechRate(opt.value)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    speechRate === opt.value
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle switches */}
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => setSoundCueEnabled((v) => !v)}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {soundCueEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>Sonido de golpe / aplauso físico</span>
              </span>
              <span className="font-semibold text-slate-900">
                {soundCueEnabled ? 'Activo' : 'Silenciado'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setVoiceEnabled((v) => !v)}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Volume2 className={`w-4 h-4 ${voiceEnabled ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Pronunciación en inglés</span>
              </span>
              <span className="font-semibold text-slate-900">
                {voiceEnabled ? 'Activa' : 'Desactivada'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRecallMode((v) => !v)}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {recallMode ? <EyeOff className="w-4 h-4 text-blue-600" /> : <Eye className="w-4 h-4 text-slate-500" />}
                <span>Modo ocultar pasado y participio</span>
              </span>
              <span className="font-semibold text-slate-900">
                {recallMode ? 'Oculto' : 'Visible'}
              </span>
            </button>
          </div>
        </div>

        {/* Group Verb Queue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Lista del grupo
            </h2>
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'pending', label: 'Pendientes' },
                { key: 'mastered', label: 'Listos' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setQueueFilter(tab.key as QueueFilter)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    queueFilter === tab.key
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto pr-1 space-y-1">
            {filteredQueue.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No hay verbos en este filtro dentro del grupo.
              </p>
            ) : (
              filteredQueue.map((v) => {
                const isSelected = v.id === currentVerb.id;
                const done = masteredIds.has(v.id);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onSelectVerb(v.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 truncate">
                      <span className="font-semibold text-slate-900">{v.present}</span>
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="text-slate-500">{v.meaning}</span>
                    </div>
                    {done && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-label="Dominado" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
