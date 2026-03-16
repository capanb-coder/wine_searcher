import { useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import WineInfo from './components/WineInfo.jsx';
import ScoresTable from './components/ScoresTable.jsx';
import PricesPanel from './components/PricesPanel.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  async function handleSearch(searchQuery) {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setQuery(searchQuery);

    try {
      const res = await fetch(`/api/wine/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al buscar el vino');
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const wineNotFound = results?.wineInfo?.found === false;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gold-500/10 py-5 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🍷</span>
          <div>
            <h1 className="font-display text-2xl text-gold-400 leading-tight">Wine Searcher</h1>
            <p className="text-xs text-wine-300/60 mt-0.5">Notas de cata · Puntuaciones · Precios en España</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-10">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div className="glass-card p-5 text-center fade-in mb-8">
            <p className="text-red-400 text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <LoadingSkeleton />}

        {/* Wine not found */}
        {!loading && wineNotFound && (
          <div className="glass-card p-10 text-center fade-in">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-display text-xl text-gold-400 mb-2">Vino no encontrado</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {results.wineInfo.message || 'Comprueba el nombre del vino e inténtalo de nuevo.'}
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && results && !wineNotFound && (
          <div className="fade-in space-y-6">
            {/* Top: Wine info */}
            <WineInfo wine={results.wineInfo} />

            {/* Bottom: Scores + Prices */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <ScoresTable scores={results.wineInfo.scores} bestVintages={results.wineInfo.best_vintages} />
              </div>
              <div className="lg:col-span-2">
                <PricesPanel prices={results.prices} wineName={query} />
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !results && !error && (
          <div className="text-center py-20">
            <div className="text-7xl mb-6 opacity-30">🍷</div>
            <p className="font-display text-2xl text-gold-500/50 mb-3">Busca cualquier vino</p>
            <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Introduce el nombre del vino o la bodega para ver notas de cata,
              puntuaciones de críticos y precios en tiendas españolas.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['Vega Sicilia Único', 'Pingus', 'La Rioja Alta Gran Reserva 904', 'Contino Reserva', 'Gramona III Lustros'].map(s => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-105"
                  style={{ borderColor: 'rgba(201,168,76,0.2)', color: 'rgba(201,168,76,0.6)', background: 'rgba(201,168,76,0.05)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 mt-10 border-t border-gold-500/5">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Información sobre vinos potenciada por IA · Precios orientativos, consulta las tiendas para disponibilidad actual
        </p>
      </footer>
    </div>
  );
}
