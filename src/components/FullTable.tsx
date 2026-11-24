import { useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Search, Volume2 } from 'lucide-react';
import { VERBS, VERB_GROUPS, getGroupById, type VerbItem } from '../data/verbs';
import { getBeatSpeakTexts, playKinestheticCue, speakEnglishWord } from '../utils/audio';

interface FullTableProps {
  masteredIds: Set<string>;
  onToggleMastered: (verbId: string) => void;
  onPracticeVerb: (groupId: number, verbId: string) => void;
}

export function FullTable({
  masteredIds,
  onToggleMastered,
  onPracticeVerb,
}: FullTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'irregular' | 'regular'>('all');
  const [groupFilter, setGroupFilter] = useState<number | 'all'>('all');
  const [playingVerbId, setPlayingVerbId] = useState<string | null>(null);

  const filteredVerbs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VERBS.filter((verb) => {
      if (categoryFilter !== 'all' && verb.category !== categoryFilter) return false;
      if (groupFilter !== 'all' && verb.groupId !== groupFilter) return false;
      if (!q) return true;
      return (
        verb.present.toLowerCase().includes(q) ||
        verb.past.toLowerCase().includes(q) ||
        verb.participle.toLowerCase().includes(q) ||
        verb.meaning.toLowerCase().includes(q) ||
        verb.anchor.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, categoryFilter, groupFilter]);

  const handlePreviewAudio = async (verb: VerbItem) => {
    if (playingVerbId === verb.id) return;
    setPlayingVerbId(verb.id);
    const group = getGroupById(verb.groupId);
    const texts = getBeatSpeakTexts(verb);
    for (const idx of [0, 1, 2] as const) {
      playKinestheticCue(group.motionType, idx);
      await speakEnglishWord(texts[idx], 0.95);
    }
    setPlayingVerbId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1">
            Tabla completa de 223 verbos
          </h1>
          <p className="text-sm text-slate-600">
            154 irregulares y 69 regulares · Busca por verbo en inglés, significado en español o ancla física.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 tabular-nums">
          Mostrando {filteredVerbs.length} de {VERBS.length} verbos
        </span>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar verbo (ej. swim, cortar, aplausos, /t/)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {[
              { key: 'all', label: 'Todos (223)' },
              { key: 'irregular', label: 'Irregulares (154)' },
              { key: 'regular', label: 'Regulares (69)' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setCategoryFilter(item.key as typeof categoryFilter);
                  setGroupFilter('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === item.key
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <select
            aria-label="Filtrar por grupo"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-2 focus:outline-blue-600 cursor-pointer"
          >
            <option value="all">Todos los grupos (1–11)</option>
            {VERB_GROUPS.filter((g) => categoryFilter === 'all' || g.category === categoryFilter).map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4 w-12 tabular-nums">#</th>
                <th className="py-3.5 px-4">Presente</th>
                <th className="py-3.5 px-4">Pasado Simple</th>
                <th className="py-3.5 px-4">Participio Pasado</th>
                <th className="py-3.5 px-4">Significado</th>
                <th className="py-3.5 px-4">Ancla Kinestésica</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredVerbs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                    No se encontraron verbos que coincidan con tu búsqueda.
                  </td>
                </tr>
              ) : (
                filteredVerbs.map((verb, index) => {
                  const isMastered = masteredIds.has(verb.id);
                  const isPlaying = playingVerbId === verb.id;
                  return (
                    <tr
                      key={verb.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-4 text-xs font-mono text-slate-400 tabular-nums">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {verb.present}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {verb.past}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {verb.participle}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {verb.meaning}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <span className="font-medium text-slate-700">{verb.anchor}</span>
                        <span className="text-slate-400 mx-1.5">·</span>
                        <span className="text-slate-500">G{verb.groupId}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePreviewAudio(verb)}
                            title="Escuchar 3 tiempos con ritmo"
                            aria-label={`Escuchar ${verb.present}`}
                            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                              isPlaying
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleMastered(verb.id)}
                            title={isMastered ? 'Marcar como pendiente' : 'Marcar como dominado'}
                            aria-label={`Estado de dominio para ${verb.present}`}
                            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                              isMastered
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onPracticeVerb(verb.groupId, verb.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:text-blue-700 text-xs font-semibold text-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <span>Practicar</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
