import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, Volume2, X, XCircle } from 'lucide-react';
import { VERBS, VERB_GROUPS, getGroupById, type VerbItem } from '../data/verbs';
import { getBeatSpeakTexts, playKinestheticCue, speakEnglishWord } from '../utils/audio';

interface QuickDrillModalProps {
  isOpen: boolean;
  masteredIds: Set<string>;
  onClose: () => void;
  onMarkMastered: (verbId: string) => void;
}

function normalizeAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .trim();
}

function matchesExpected(userInput: string, expectedField: string): boolean {
  const cleanUser = normalizeAnswer(userInput);
  if (!cleanUser) return false;
  const acceptedOptions = expectedField
    .split('/')
    .map((opt) => normalizeAnswer(opt))
    .filter(Boolean);
  return acceptedOptions.includes(cleanUser);
}

export function QuickDrillModal({
  isOpen,
  masteredIds,
  onClose,
  onMarkMastered,
}: QuickDrillModalProps) {
  const [scopeGroupId, setScopeGroupId] = useState<number | 'pending' | 'all'>('pending');
  const [sessionSeed, setSessionSeed] = useState(1);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [pastInput, setPastInput] = useState('');
  const [participleInput, setParticipleInput] = useState('');
  const [checkedResult, setCheckedResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const drillQueue: VerbItem[] = useMemo(() => {
    let pool = VERBS;
    if (scopeGroupId === 'pending') {
      const pending = VERBS.filter((v) => !masteredIds.has(v.id));
      pool = pending.length > 0 ? pending : VERBS;
    } else if (typeof scopeGroupId === 'number') {
      pool = VERBS.filter((v) => v.groupId === scopeGroupId);
    }

    // Deterministic-feeling shuffle based on sessionSeed
    const copy = [...pool];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = (i * 17 + sessionSeed * 31) % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(10, copy.length));
  }, [scopeGroupId, masteredIds, sessionSeed]);

  if (!isOpen) return null;

  const activeVerb = drillQueue[currentIdx] ?? drillQueue[0];
  const activeGroup = getGroupById(activeVerb.groupId);

  const resetSession = (nextScope: typeof scopeGroupId) => {
    setScopeGroupId(nextScope);
    setSessionSeed((s) => s + 1);
    setCurrentIdx(0);
    setPastInput('');
    setParticipleInput('');
    setCheckedResult('idle');
    setCorrectCount(0);
    setFinished(false);
  };

  const playVerbAudio = async () => {
    const texts = getBeatSpeakTexts(activeVerb);
    for (const i of [0, 1, 2] as const) {
      playKinestheticCue(activeGroup.motionType, i);
      await speakEnglishWord(texts[i], 0.95);
    }
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkedResult !== 'idle') {
      if (currentIdx + 1 >= drillQueue.length) {
        setFinished(true);
      } else {
        setCurrentIdx((i) => i + 1);
        setPastInput('');
        setParticipleInput('');
        setCheckedResult('idle');
      }
      return;
    }

    const okPast = matchesExpected(pastInput, activeVerb.past);
    const okPart = matchesExpected(participleInput, activeVerb.participle);

    if (okPast && okPart) {
      setCheckedResult('correct');
      setCorrectCount((c) => c + 1);
      onMarkMastered(activeVerb.id);
      playVerbAudio();
    } else {
      setCheckedResult('incorrect');
      playVerbAudio();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-drill-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 id="quick-drill-title" className="text-xl font-bold text-slate-900">
              Entrenamiento rápido (10 verbos)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Escribe el pasado y participio mientras ejecutas el ancla física del grupo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar entrenamiento"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scope Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <select
            aria-label="Elegir verbos para entrenar"
            value={scopeGroupId}
            onChange={(e) => {
              const val = e.target.value;
              resetSession(val === 'pending' || val === 'all' ? val : Number(val));
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-2 focus:outline-blue-600 cursor-pointer"
          >
            <option value="pending">Verbos pendientes por dominar</option>
            <option value="all">Mezcla aleatoria de los 223 verbos</option>
            {VERB_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>

          <span className="text-xs font-mono text-slate-600 tabular-nums">
            {finished ? `${correctCount}/${drillQueue.length} aciertos` : `Verbo ${currentIdx + 1} / ${drillQueue.length}`}
          </span>
        </div>

        {finished ? (
          <div className="py-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tabular-nums">
                {correctCount} de {drillQueue.length} correctos
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Los verbos acertados se marcaron automáticamente como dominados en tu progreso.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => resetSession(scopeGroupId)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nueva ronda de 10</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Volver a la práctica
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCheck} className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span>{activeGroup.title}</span>
                <span>{activeVerb.anchor}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500 block">Presente</span>
                  <span className="text-2xl font-bold text-slate-900">{activeVerb.present}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Significado</span>
                  <span className="text-lg font-semibold text-blue-700">{activeVerb.meaning}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="drill-past" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Pasado Simple
                </label>
                <input
                  id="drill-past"
                  type="text"
                  autoComplete="off"
                  autoFocus
                  value={pastInput}
                  onChange={(e) => setPastInput(e.target.value)}
                  disabled={checkedResult !== 'idle'}
                  placeholder="Escribe el pasado..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-2 focus:outline-blue-600 disabled:bg-slate-50"
                />
              </div>
              <div>
                <label htmlFor="drill-part" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Participio Pasado
                </label>
                <input
                  id="drill-part"
                  type="text"
                  autoComplete="off"
                  value={participleInput}
                  onChange={(e) => setParticipleInput(e.target.value)}
                  disabled={checkedResult !== 'idle'}
                  placeholder="Escribe el participio..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-2 focus:outline-blue-600 disabled:bg-slate-50"
                />
              </div>
            </div>

            {checkedResult !== 'idle' && (
              <div
                className={`rounded-xl border p-3.5 flex items-start justify-between gap-3 text-xs ${
                  checkedResult === 'correct'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {checkedResult === 'correct' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">
                      {checkedResult === 'correct' ? '¡Correcto y anclado!' : 'Revisa la forma exacta:'}
                    </p>
                    <p className="mt-0.5 font-medium">
                      {activeVerb.present} — {activeVerb.past} — {activeVerb.participle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={playVerbAudio}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Oír</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {checkedResult === 'idle'
                  ? 'Comprobar respuesta'
                  : currentIdx + 1 >= drillQueue.length
                  ? 'Ver resultado final'
                  : 'Siguiente verbo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
