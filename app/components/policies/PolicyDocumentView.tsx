import Link from 'next/link'
import { Leaf } from 'lucide-react'
import type { PolicyDocument } from '@/lib/policies'

export default function PolicyDocumentView({ document }: { document: PolicyDocument }) {
  return (
    <div className="min-h-screen bg-[#FDFCF7]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-text-secondary hover:text-secondary transition-colors mb-8"
        >
          ← Back to home
        </Link>

        <header className="mb-10">
          <p className="flex items-center gap-2 text-secondary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
            <Leaf className="w-4 h-4 text-primary" aria-hidden />
            Aavya Foods
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-3">
            {document.title}
          </h1>
          <p className="text-text-secondary leading-relaxed">{document.description}</p>
        </header>

        <div className="flex flex-col gap-8 text-text-secondary leading-relaxed">
          {document.intro?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {document.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold text-text-primary mb-3">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.note && (
                <p className="mt-3 text-sm font-medium text-text-primary/80">{section.note}</p>
              )}
            </section>
          ))}

          {document.contact && (
            <section className="rounded-2xl border border-secondary/20 bg-secondary/5 p-5 md:p-6">
              <h2 className="text-lg font-bold text-text-primary mb-3">{document.contact.title}</h2>
              {document.contact.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-2 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
