import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { VERB_GROUPS, getVerbsByGroup } from '../data/verbs';

interface GroupMapProps {
  masteredIds: Set<string>;
  onOpenGroup: (groupId: number) => void;
}

export function GroupMap({ masteredIds, onOpenGroup }: GroupMapProps) {
  const irregularGroups = VERB_GROUPS.filter((g) => g.category === 'irregular');
  const regularGroups = VERB_GROUPS.filter((g) => g.category === 'regular');

  const renderGroupSection = (
    sectionTitle: string,
    sectionSubtitle: string,
    groups: typeof VERB_GROUPS
  ) => (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{sectionTitle}</h2>
          <p className="text-sm text-slate-600">{sectionSubtitle}</p>
        </div>
        <span className="text-xs font-mono text-slate-500 tabular-nums">
          {groups.reduce((acc, g) => acc + getVerbsByGroup(g.id).length, 0)} verbos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {groups.map((group) => {
          const verbs = getVerbsByGroup(group.id);
          const masteredCount = verbs.filter((v) => masteredIds.has(v.id)).length;
          const pct = Math.round((masteredCount / verbs.length) * 100);
          const sampleVerbs = verbs.slice(0, 3).map((v) => v.present).join(', ');

          return (
            <article
              key={group.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <span>{group.accentLabel}</span>
                  <span className="font-mono tabular-nums">{verbs.length} verbos</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {group.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 mb-3">
                  {group.subtitle}
                </p>

                <p className="text-sm leading-relaxed text-slate-600 mb-4">
                  {group.strategy}
                </p>

                <p className="text-xs text-slate-500">
                  Ejemplos: <span className="font-semibold text-slate-800">{sampleVerbs}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium inline-flex items-center gap-1.5">
                      {pct === 100 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>Progreso</span>
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {masteredCount}/{verbs.length} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenGroup(group.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Practicar este bloque</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Mapa de los 11 bloques kinestésicos
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Cada grupo une verbos que comparten el mismo patrón motor y fonético. Elige un bloque para entrenarlo con ritmo, audio y movimiento físico.
        </p>
      </div>

      {renderGroupSection(
        'Parte 1: Verbos Irregulares por Patrón Motor y Fonético',
        'Grupos 1 al 8 · Organizados por cambio vocálico, rima y movimiento corporal',
        irregularGroups
      )}

      {renderGroupSection(
        'Parte 2: Verbos Regulares por Vibración y Rebote (-ED)',
        'Grupos 9 al 11 · Clasificados por el sonido final exacto (/ɪd/, /t/ o /d/)',
        regularGroups
      )}
    </div>
  );
}
