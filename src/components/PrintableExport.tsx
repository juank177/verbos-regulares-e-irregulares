import { useMemo, useState } from 'react';
import { Printer, Scissors, Table2 } from 'lucide-react';
import { VERBS, VERB_GROUPS, getVerbsByGroup } from '../data/verbs';

type PrintLayoutMode = 'flashcards' | 'table';

export function PrintableExport() {
  const [layoutMode, setLayoutMode] = useState<PrintLayoutMode>('flashcards');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<number | 'all' | 'irregular' | 'regular'>('all');

  const groupsToRender = useMemo(() => {
    if (selectedGroupFilter === 'all') return VERB_GROUPS;
    if (selectedGroupFilter === 'irregular') return VERB_GROUPS.filter((g) => g.category === 'irregular');
    if (selectedGroupFilter === 'regular') return VERB_GROUPS.filter((g) => g.category === 'regular');
    return VERB_GROUPS.filter((g) => g.id === selectedGroupFilter);
  }, [selectedGroupFilter]);

  const totalSelectedVerbs = useMemo(() => {
    const groupIds = new Set(groupsToRender.map((g) => g.id));
    return VERBS.filter((v) => groupIds.has(v.groupId)).length;
  }, [groupsToRender]);

  return (
    <div className="space-y-6">
      {/* Screen-only Controls */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Fichas recortables y tabla para PDF
          </h1>
          <p className="text-sm text-slate-600">
            Elige el formato y el bloque que deseas exportar. Al pulsar imprimir, selecciona «Guardar como PDF» en tu navegador.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setLayoutMode('flashcards')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                layoutMode === 'flashcards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Fichas recortables</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                layoutMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Tabla completa</span>
            </button>
          </div>

          <select
            aria-label="Seleccionar verbos a imprimir"
            value={selectedGroupFilter}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'all' || val === 'irregular' || val === 'regular') {
                setSelectedGroupFilter(val);
              } else {
                setSelectedGroupFilter(Number(val));
              }
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-2 focus:outline-blue-600 cursor-pointer"
          >
            <option value="all">Todos los grupos (223 verbos)</option>
            <option value="irregular">Solo Irregulares (154 verbos)</option>
            <option value="regular">Solo Regulares (69 verbos)</option>
            {VERB_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title} ({getVerbsByGroup(g.id).length})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar PDF ({totalSelectedVerbs})</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Content */}
      <div className="space-y-8">
        {groupsToRender.map((group) => {
          const verbs = getVerbsByGroup(group.id);
          return (
            <section
              key={group.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 print:border-0 print:p-0 print:rounded-none"
            >
              <header className="pb-3 mb-4 border-b border-slate-200 print-break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {group.title} — {group.subtitle}
                  </h2>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    {verbs.length} verbos · {group.accentLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <span className="font-semibold text-slate-800">Estrategia kinestésica:</span> {group.strategy}
                </p>
              </header>

              {layoutMode === 'flashcards' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 gap-3">
                  {verbs.map((v) => (
                    <article
                      key={v.id}
                      className="print-break-inside-avoid border border-dashed border-slate-300 rounded-xl p-3.5 flex flex-col justify-between gap-2.5 bg-slate-50/40 print:bg-white"
                    >
                      <div className="flex items-baseline justify-between gap-2 border-b border-slate-200/80 pb-2">
                        <span className="text-sm font-bold text-slate-900">
                          {v.meaning}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          G{group.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="rounded-lg bg-white border border-slate-200 p-1.5">
                          <span className="block text-[10px] text-slate-400">Presente</span>
                          <span className="text-xs font-bold text-slate-900 break-words">{v.present}</span>
                        </div>
                        <div className="rounded-lg bg-white border border-slate-200 p-1.5">
                          <span className="block text-[10px] text-slate-400">Pasado</span>
                          <span className="text-xs font-bold text-slate-900 break-words">{v.past}</span>
                        </div>
                        <div className="rounded-lg bg-white border border-slate-200 p-1.5">
                          <span className="block text-[10px] text-slate-400">Participio</span>
                          <span className="text-xs font-bold text-slate-900 break-words">{v.participle}</span>
                        </div>
                      </div>

                      <p className="text-[11px] font-medium text-blue-800 pt-1">
                        Ancla: {v.anchor}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-600 font-semibold">
                        <th className="py-2 pr-3">Presente</th>
                        <th className="py-2 pr-3">Pasado Simple</th>
                        <th className="py-2 pr-3">Participio Pasado</th>
                        <th className="py-2 pr-3">Significado</th>
                        <th className="py-2">Ancla Kinestésica</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {verbs.map((v) => (
                        <tr key={v.id} className="print-break-inside-avoid">
                          <td className="py-1.5 pr-3 font-semibold text-slate-900">{v.present}</td>
                          <td className="py-1.5 pr-3 text-slate-800">{v.past}</td>
                          <td className="py-1.5 pr-3 text-slate-800">{v.participle}</td>
                          <td className="py-1.5 pr-3 text-slate-700">{v.meaning}</td>
                          <td className="py-1.5 text-slate-600">{v.anchor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
