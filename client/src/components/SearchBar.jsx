import { useState, useRef, useEffect } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim() && !loading) {
      onSearch(value.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none opacity-50">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Nombre del vino, bodega o D.O...."
            disabled={loading}
            className="search-input w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="search-btn px-6 py-3.5 rounded-xl text-white font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Buscando...
            </span>
          ) : 'Buscar'}
        </button>
      </div>
    </form>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
