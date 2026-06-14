import Link from "next/link";

interface MiniMapProps {
  title: string;
  viewFullText: string;
}

export function MiniMap({ title, viewFullText }: MiniMapProps) {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            {title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-white">
            {/* Static map placeholder — replaced with Mapbox in Sprint 5 */}
            <div className="h-72 md:h-96 bg-gradient-to-br from-primary/5 via-neutral-50 to-secondary/5 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl block mb-4">🗺️</span>
                <p className="text-neutral-500 text-sm">
                  Desa Sukamakmur, Kec. Sukamakmur, Kab. Bogor
                </p>
                <p className="text-neutral-400 text-xs mt-1">
                  -6.730°S, 106.838°E
                </p>
              </div>
            </div>

            {/* Overlay link */}
            <div className="absolute inset-0 flex items-end justify-center pb-6">
              <Link
                href="/peta"
                className="px-6 py-2.5 bg-white/90 backdrop-blur-sm text-primary font-semibold text-sm rounded-xl border border-neutral-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {viewFullText} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
