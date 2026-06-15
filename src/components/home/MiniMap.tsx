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
            {/* Google Maps Embed */}
            <div className="h-72 md:h-96 w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d106.838!3d-6.730!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDMnNDguMCJTIDEwNsKwNTAnMTYuOCJF!5e0!3m2!1sen!2sid!4v1709405625447!5m2!1sen!2sid" 
                className="w-full h-full border-0" 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
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
