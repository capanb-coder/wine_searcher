import { useState } from 'react';

function getScoreClass(score) {
  const n = parseInt(score);
  if (n >= 95) return 'score-95plus';
  if (n >= 90) return 'score-90plus';
  if (n >= 85) return 'score-85plus';
  return 'score-below85';
}

function getScoreLabel(score) {
  const n = parseInt(score);
  if (n >= 97) return 'Extraordinario';
  if (n >= 95) return 'Excepcional';
  if (n >= 93) return 'Sobresaliente';
  if (n >= 90) return 'Excelente';
  if (n >= 87) return 'Muy bueno';
  if (n >= 85) return 'Bueno';
  return 'Correcto';
}

const PUBLICATION_SHORT = {
  'Wine Advocate': 'WA',
  'Robert Parker': 'RP',
  'Wine Spectator': 'WS',
  'Decanter': 'Dec',
  'Guía Peñín': 'Peñín',
  'Wine Enthusiast': 'WE',
  'James Suckling': 'JS',
  'Falstaff': 'FF',
  'Jancis Robinson': 'JR',
};

export default function ScoresTable({ scores, bestVintages }) {
  const [sortBy, setSortBy] = useState('vintage');

  if (!scores || scores.length === 0) {
    return (
      <div className="glass-card p-6 h-full flex flex-col">
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>
          📊 Puntuaciones por Añada
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
            No hay puntuaciones disponibles para este vino
          </p>
        </div>
      </div>
    );
  }

  const sorted = [...scores].sort((a, b) => {
    if (sortBy === 'vintage') return (b.vintage || 0) - (a.vintage || 0);
    if (sortBy === 'score') return (parseInt(b.score) || 0) - (parseInt(a.score) || 0);
    return (a.publication || '').localeCompare(b.publication || '');
  });

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
          📊 Puntuaciones por Añada
        </h3>
        <div className="flex gap-1">
          {[['vintage', 'Añada'], ['score', 'Nota'], ['pub', 'Publicación']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className="text-xs px-2.5 py-1 rounded-md transition-all"
              style={{
                background: sortBy === key ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: sortBy === key ? 'var(--gold)' : 'var(--text-muted)',
                border: `1px solid ${sortBy === key ? 'rgba(201,168,76,0.3)' : 'transparent'}`
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Best vintages */}
      {bestVintages?.length > 0 && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>⭐ Mejores añadas:</span>
          {bestVintages.map(v => (
            <span key={v} className="grape-pill">{v}</span>
          ))}
        </div>
      )}

      {/* Scores */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {sorted.map((score, i) => {
          const shortPub = PUBLICATION_SHORT[score.publication] || score.publication;
          const isBestVintage = bestVintages?.includes(String(score.vintage));
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* Score badge */}
              <div className={`score-badge flex-shrink-0 ${getScoreClass(score.score)}`}>
                {score.score}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {score.vintage}
                    {isBestVintage && <span className="ml-1 text-xs">⭐</span>}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ background: 'rgba(139,26,44,0.2)', color: '#e8a0a8', border: '1px solid rgba(139,26,44,0.3)' }}>
                    {shortPub}
                  </span>
                  {score.reviewer && (
                    <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {score.reviewer}
                    </span>
                  )}
                </div>
                {score.notes && (
                  <p className="text-xs leading-relaxed truncate" style={{ color: 'var(--text-muted)' }} title={score.notes}>
                    {score.notes}
                  </p>
                )}
              </div>

              {/* Quality label */}
              <span className="text-xs flex-shrink-0 hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                {getScoreLabel(score.score)}
              </span>
            </div>
          );
        })}
      </div>

      {scores.length > 5 && (
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
          {scores.length} puntuaciones en total
        </p>
      )}
    </div>
  );
}
