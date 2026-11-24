/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { VERBS, getVerbsByGroup } from './data/verbs';
import { GuidedPractice } from './components/GuidedPractice';
import { GroupMap } from './components/GroupMap';
import { FullTable } from './components/FullTable';
import { PrintableExport } from './components/PrintableExport';
import { QuickDrillModal } from './components/QuickDrillModal';

type AppTab = 'practice' | 'groups' | 'table' | 'print';

const STORAGE_KEY = 'verbos_kinestesicos_mastered_v1';

function loadMasteredIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((id): id is string => typeof id === 'string'));
    }
  } catch {
    // Ignore storage read errors
  }
  return new Set();
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('practice');
  const [selectedGroupId, setSelectedGroupId] = useState<number>(1);
  const [selectedVerbId, setSelectedVerbId] = useState<string | null>(() => {
    const firstGroup = getVerbsByGroup(1);
    return firstGroup[0]?.id ?? null;
  });
  const [masteredIds, setMasteredIds] = useState<Set<string>>(loadMasteredIds);
  const [isDrillOpen, setIsDrillOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(masteredIds)));
    } catch {
      // Ignore storage write errors
    }
  }, [masteredIds]);

  const handleToggleMastered = useCallback((verbId: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(verbId)) {
        next.delete(verbId);
      } else {
        next.add(verbId);
      }
      return next;
    });
  }, []);

  const handleMarkMastered = useCallback((verbId: string) => {
    setMasteredIds((prev) => {
      if (prev.has(verbId)) return prev;
      const next = new Set(prev);
      next.add(verbId);
      return next;
    });
  }, []);

  const handleSelectGroup = useCallback((groupId: number) => {
    setSelectedGroupId(groupId);
    const verbs = getVerbsByGroup(groupId);
    setSelectedVerbId(verbs[0]?.id ?? null);
    setActiveTab('practice');
  }, []);

  const handlePracticeVerb = useCallback((groupId: number, verbId: string) => {
    setSelectedGroupId(groupId);
    setSelectedVerbId(verbId);
    setActiveTab('practice');
  }, []);

  const navItems: { key: AppTab; label: string }[] = [
    { key: 'practice', label: 'Práctica Guiada' },
    { key: 'groups', label: 'Mapa de Grupos' },
    { key: 'table', label: 'Tabla Completa' },
    { key: 'print', label: 'Fichas Imprimibles' },
  ];

  const masteredCount = masteredIds.size;
  const totalCount = VERBS.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('practice')}
            className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Verbos Kinestésicos
          </button>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    isActive
                      ? 'text-slate-900 font-semibold border-blue-600'
                      : 'text-slate-600 hover:text-slate-900 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsDrillOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Entrenamiento Rápido
            </button>
          </div>
        </div>

        {/* Mobile navigation row */}
        <nav
          aria-label="Navegación móvil"
          className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-4 overflow-x-auto text-xs font-medium"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`py-1 whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-slate-900 font-semibold border-blue-600'
                    : 'text-slate-600 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quiet unboxed progress summary bar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>223 verbos organizados en 11 bloques</span>
            <span aria-hidden="true">·</span>
            <span>154 irregulares</span>
            <span aria-hidden="true">·</span>
            <span>69 regulares</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              Dominados: {masteredCount} / {totalCount}
            </span>
            {masteredCount > 0 && (
              <button
                type="button"
                onClick={() => setMasteredIds(new Set())}
                className="text-slate-500 hover:text-slate-800 underline underline-offset-2 cursor-pointer"
              >
                Reiniciar progreso
              </button>
            )}
          </div>
        </div>

        {activeTab === 'practice' && (
          <GuidedPractice
            selectedGroupId={selectedGroupId}
            selectedVerbId={selectedVerbId}
            masteredIds={masteredIds}
            onSelectGroup={handleSelectGroup}
            onSelectVerb={setSelectedVerbId}
            onToggleMastered={handleToggleMastered}
          />
        )}

        {activeTab === 'groups' && (
          <GroupMap
            masteredIds={masteredIds}
            onOpenGroup={handleSelectGroup}
          />
        )}

        {activeTab === 'table' && (
          <FullTable
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMastered}
            onPracticeVerb={handlePracticeVerb}
          />
        )}

        {activeTab === 'print' && <PrintableExport />}
      </main>

      <QuickDrillModal
        isOpen={isDrillOpen}
        masteredIds={masteredIds}
        onClose={() => setIsDrillOpen(false)}
        onMarkMastered={handleMarkMastered}
      />
    </div>
  );
}
