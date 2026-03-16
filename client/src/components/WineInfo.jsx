export default function WineInfo({ wine }) {
  if (!wine) return null;

  const styleEmoji = {
    'Tinto': '🍷', 'Blanco': '🥂', 'Rosado': '🌸',
    'Espumoso': '🍾', 'Dulce': '🍯', 'Generoso': '🫙'
  };

  return (
    <div className="glass-card p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Identity */}
        <div className="md:col-span-1">
          {/* Wine style badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{styleEmoji[wine.style] || '🍷'}</span>
            <span className="tag-pill">{wine.style}</span>
            {wine.alcohol && (
              <span className="tag-pill">{wine.alcohol}</span>
            )}
          </div>

          {/* Name */}
          <h2 className="font-display text-2xl leading-tight mb-1" style={{ color: 'var(--gold-light, #e8d08a)' }}>
            {wine.name}
          </h2>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            {wine.winery}
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            {wine.region}{wine.subregion ? ` · ${wine.subregion}` : ''} · {wine.country}
          </p>

          {/* Grapes */}
          {wine.grapes?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Uvas</p>
              <div className="flex flex-wrap gap-1.5">
                {wine.grapes.map(g => <span key={g} className="grape-pill">{g}</span>)}
              </div>
            </div>
          )}

          {/* Quick facts */}
          <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            {wine.serving_temp && (
              <div className="flex items-center gap-2">
                <span>🌡️</span>
                <span>Servir a {wine.serving_temp}</span>
              </div>
            )}
            {wine.decanting && (
              <div className="flex items-center gap-2">
                <span>🫗</span>
                <span>{wine.decanting}</span>
              </div>
            )}
            {wine.aging_potential && (
              <div className="flex items-center gap-2">
                <span>⏳</span>
                <span>Guarda: {wine.aging_potential}</span>
              </div>
            )}
            {wine.price_range_eur && (
              <div className="flex items-center gap-2">
                <span>💶</span>
                <span>{wine.price_range_eur}</span>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Tasting notes */}
        <div className="md:col-span-2">
          {wine.description && (
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              {wine.description}
            </p>
          )}

          {wine.tasting_notes && (
            <>
              <div className="wine-divider" />
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>
                Notas de Cata
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'visual', label: 'Visual', emoji: '👁️' },
                  { key: 'nose', label: 'Nariz', emoji: '👃' },
                  { key: 'palate', label: 'Boca', emoji: '👅' },
                  { key: 'finish', label: 'Posgusto', emoji: '✨' }
                ].map(({ key, label, emoji }) => wine.tasting_notes[key] && (
                  <div key={key} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--gold)' }}>
                      <span>{emoji}</span>{label}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {wine.tasting_notes[key]}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Food pairing */}
          {wine.food_pairing?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                🍽️ <span className="uppercase tracking-wider">Maridaje</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {wine.food_pairing.map(f => (
                  <span key={f} className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
