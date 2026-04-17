'use client'

import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
import Button from '@/app/components/ui/Button'

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: 'Is Aavya Ghee 100% pure?',
    answer:
      'Yes, our ghee is made using the traditional Bilona method from farm-sourced milk with no preservatives, additives, or artificial inputs of any kind. Every batch is lab-tested before it reaches you.',
  },
  {
    question: 'How should I store the ghee?',
    answer:
      'Store it in a cool, dry place away from direct sunlight. No refrigeration needed — our ghee stays fresh at room temperature for up to 12 months. Always use a dry spoon to scoop.',
  },
  {
    question: 'Do you offer cash on delivery?',
    answer:
      'Yes, we offer Cash on Delivery across most pin codes in India. You can select COD at checkout. For remote areas, prepaid orders are preferred to ensure timely delivery.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Orders are typically delivered within 4–6 business days across India. Same-day delivery is available in Mumbai, Pune, and Delhi NCR for orders placed before 12 PM.',
  },
  {
    question: 'What is the Bilona method?',
    answer:
      'The Bilona method is an ancient Vedic process where curd made from A2 cow milk is hand-churned to extract butter, which is then slow-cooked on a low flame into golden, aromatic ghee. It preserves all natural nutrients and gives ghee its distinctive flavour.',
  },
  {
    question: 'Do you ship outside India?',
    answer:
      'Currently we ship only within India. International shipping is something we are actively working on — sign up for our newsletter to be notified when it launches.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative py-24 px-4">

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary text-sm">
            Everything you need to know about our ghee
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="bg-background/90 backdrop-blur-sm rounded-2xl border border-surface overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-text-primary text-sm md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-secondary shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer — height transition via grid trick */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-text-secondary text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-text-primary font-semibold text-lg mb-4">
            Still have questions?
          </p>
          <Button
            href="/about"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  )
}
