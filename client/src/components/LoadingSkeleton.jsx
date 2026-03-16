function SkeletonBlock({ className }) {
  return <div className={`skeleton ${className}`} />;
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 fade-in">
      {/* Wine info skeleton */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <SkeletonBlock className="h-5 w-16" />
            <SkeletonBlock className="h-8 w-48" />
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-4 w-24" />
            <div className="flex gap-2 mt-4">
              <SkeletonBlock className="h-6 w-20 rounded-full" />
              <SkeletonBlock className="h-6 w-16 rounded-full" />
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
            <SkeletonBlock className="h-4 w-4/6" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <SkeletonBlock className="h-3 w-16 mb-2" />
                  <SkeletonBlock className="h-3 w-full" />
                  <SkeletonBlock className="h-3 w-4/5 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scores + Prices skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 glass-card p-6 space-y-3">
          <SkeletonBlock className="h-4 w-40 mb-5" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <SkeletonBlock className="h-12 w-12 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <SkeletonBlock className="h-4 w-36 mb-5" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl space-y-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex justify-between">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-6 w-16 rounded-md" />
              </div>
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs animate-pulse" style={{ color: 'var(--text-muted)' }}>
        Consultando base de datos de vinos y tiendas...
      </p>
    </div>
  );
}
