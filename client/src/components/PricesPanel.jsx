const STORE_CONFIG = {
  'Lavinia': {
    emoji: '🏪',
    color: '#8B0000',
    bgColor: 'rgba(139,0,0,0.08)',
    borderColor: 'rgba(139,0,0,0.2)',
    tagColor: '#e88080',
    description: 'Lavinia.es'
  },
  'Bodeboca': {
    emoji: '🍾',
    color: '#5a3e2b',
    bgColor: 'rgba(90,62,43,0.08)',
    borderColor: 'rgba(201,168,76,0.2)',
    tagColor: '#d4b84a',
    description: 'Bodeboca.com'
  },
  'Decantalo': {
    emoji: '🫙',
    color: '#1a2e4a',
    bgColor: 'rgba(26,46,74,0.1)',
    borderColor: 'rgba(100,150,220,0.2)',
    tagColor: '#7eb3e8',
    description: 'Decantalo.com'
  }
};

function ProductCard({ product, storeName }) {
  const config = STORE_CONFIG[storeName] || STORE_CONFIG['Lavinia'];

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-lg transition-all duration-200 hover:scale-[1.01]"
      style={{ background: config.bgColor, border: `1px solid ${config.borderColor}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs leading-snug flex-1" style={{ color: 'var(--text-muted)' }}>
          {product.name}
        </p>
        {product.price && product.price !== 'Ver precio' ? (
          <span className="text-sm font-bold flex-shrink-0" style={{ color: config.tagColor }}>
            {product.price}
          </span>
        ) : (
          <span className="text-xs flex-shrink-0" style={{ color: config.tagColor }}>
            Ver precio →
          </span>
        )}
      </div>
    </a>
  );
}

function StoreSection({ storeData, index }) {
  const { store, products, searchUrl, available } = storeData;
  const config = STORE_CONFIG[store] || {
    emoji: '🛒',
    bgColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    tagColor: 'var(--text-muted)',
    description: store
  };

  return (
    <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Store header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.emoji}</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{store}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{config.description}</p>
          </div>
        </div>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="store-btn"
          style={{ color: config.tagColor, borderColor: config.borderColor, background: config.bgColor }}
        >
          <span>Ver tienda</span>
          <span>↗</span>
        </a>
      </div>

      {/* Products or fallback */}
      {available && products.length > 0 ? (
        <div className="space-y-2">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard key={i} product={p} storeName={store} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.1)' }}>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Visita la tienda para ver disponibilidad y precios actuales
          </p>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="store-btn"
            style={{ color: config.tagColor, borderColor: config.borderColor, background: config.bgColor }}
          >
            Buscar en {store} ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default function PricesPanel({ prices, wineName }) {
  if (!prices || prices.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>
          🏷️ Precios en Tiendas
        </h3>
        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          No se pudieron cargar los precios
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--gold)' }}>
        🏷️ Precios en Tiendas España
      </h3>

      <div className="space-y-4">
        {prices.map((storeData, i) => (
          <StoreSection key={i} storeData={storeData} index={i} />
        ))}
      </div>

      <p className="text-xs mt-4 text-center leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Los precios pueden variar. Haz clic en cada tienda para ver disponibilidad y precio actual.
      </p>
    </div>
  );
}
