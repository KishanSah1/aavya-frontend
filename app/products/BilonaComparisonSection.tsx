import Link from 'next/link'
import { Leaf } from 'lucide-react'

const COLUMNS = ['Bilona Method', 'Cream-Based Ghee', 'Industrial / Refined'] as const

const ROWS: { aspect: string; values: [string, string, string] }[] = [
  {
    aspect: 'Starting material',
    values: ['Curd from cultured milk', 'Separated cream', 'Mass-processed cream'],
  },
  {
    aspect: 'Churning',
    values: ['Hand-churned in clay pot', 'Machine churn', 'High-speed industrial'],
  },
  {
    aspect: 'Cooking temperature',
    values: ['Low, slow flame', 'Moderate heat', 'Very high heat'],
  },
  {
    aspect: 'Chemicals / additives',
    values: ['None', 'Usually none', 'Often refined & deodorized'],
  },
  {
    aspect: 'Nutrients & aroma',
    values: ['Highest retention', 'Partial loss', 'Significantly reduced'],
  },
  {
    aspect: 'Texture when set',
    values: ['Natural grainy', 'Often uniform', 'Highly processed smooth'],
  },
]

export default function BilonaComparisonSection() {
  return (
    <section className="relative bg-[#FDFCF7] py-16 md:py-20 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-secondary/6 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-3">
            Bilona Method vs Other Methods
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            See how traditional Bilona ghee stacks up against cream-based and industrial alternatives.
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#1a4a35] to-[#0f3325] p-4 sm:p-6 shadow-xl">
          <div className="overflow-x-auto -mx-1 px-1 [scrollbar-width:thin]">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-primary uppercase tracking-wide w-[22%]"
                  >
                    Aspect
                  </th>
                  {COLUMNS.map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-primary uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(({ aspect, values }, i) => (
                  <tr
                    key={aspect}
                    className={i % 2 === 0 ? 'bg-[#FDFCF0]' : 'bg-[#F5F0DC]'}
                  >
                    <th
                      scope="row"
                      className="py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-text-primary align-top"
                    >
                      {aspect}
                    </th>
                    {values.map((value, j) => (
                      <td
                        key={j}
                        className={`py-3.5 px-3 sm:px-4 text-xs sm:text-sm leading-relaxed align-top ${
                          j === 0
                            ? 'font-medium text-secondary'
                            : 'text-text-secondary'
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-secondary-light transition-colors"
          >
            Shop pure Bilona ghee
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
