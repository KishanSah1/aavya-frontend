'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Flame, Leaf, Sprout, Users, Sun } from 'lucide-react'
import ScrollReveal from '@/app/components/ScrollReveal'
import PostModal from '@/app/components/seller/PostModal'
import type { Post, PostCategory } from './types'

// ─── Category meta ─────────────────────────────────────────────────────────────

type FilterCategory = 'All' | PostCategory

const CATEGORIES: FilterCategory[] = ['All', 'Farm', 'Process', 'Seasonal', 'Team']

const CATEGORY_META: Record<PostCategory, { pill: string; icon: React.ElementType }> = {
  Farm:     { pill: 'bg-secondary/10 text-secondary border-secondary/25',   icon: Sprout },
  Process:  { pill: 'bg-primary/12 text-[#8B6914] border-primary/25',      icon: Flame  },
  Seasonal: { pill: 'bg-orange-50 text-orange-700 border-orange-200',       icon: Sun    },
  Team:     { pill: 'bg-amber-50 text-amber-800 border-amber-200',          icon: Users  },
}

// ─── Posts data ────────────────────────────────────────────────────────────────

const POSTS: Post[] = [
  {
    id: 1,
    title: 'Why We Never Rush the Bilona Process',
    excerpt: 'There\u2019s a reason our ghee takes days to make. The Bilona method can\u2019t be shortened \u2014 and we\u2019ll tell you exactly why.',
    caption: `This is our kitchen at 6am. \u2600\uFE0F

The ghee is already on the flame. Has been since 4.

People ask us why it takes so long. Honestly? Because it just does. The Bilona process isn\u2019t something you can speed up \u2014 the curd needs time to settle, the butter needs time to form, and the ghee needs to slowly reach that perfect golden colour.

We tried to rush it once, early on. You could taste the difference immediately. That batch never left our hands.

Now we just wake up early and let it do its thing. \uD83D\uDE4F

#BilonaGhee #A2Ghee #AavyaFoods #SlowFood #PureGhee`,
    category: 'Process',
    date: 'April 14, 2026',
    image: '/aavya/journey-steps/step3.webp',
    images: ['/aavya/journey-steps/step3.webp', '/aavya/journey-steps/step4.webp', '/aavya/journey-steps/step2.webp'],
    featured: true,
    author: 'Aavya Farm Team',
    initials: 'AF',
    likes: 1847,
    comments: [
      { id: 1, author: 'Priya M.', initials: 'PM', text: 'This is why I only buy from Aavya \u2764\uFE0F', time: '2h' },
      { id: 2, author: 'Rohan K.', initials: 'RK', text: 'Never going back to store-bought after tasting yours!', time: '1h' },
    ],
  },
  {
    id: 2,
    title: 'Meet the Farmers Who Start Every Jar',
    excerpt: 'Behind every spoonful are hands that have worked with cows for decades. We visited three farms and came back with stories.',
    caption: `Ramu Kaka has been working with cows his entire life. His father did. His grandfather did.

We visited his farm last week and spent the morning there. He showed us how the cows are milked \u2014 slowly, by hand, with patience. He knows each cow by name.

\u201CInhe pata chalta hai jab jaldi mein hote ho,\u201D he told us.
They know when you\u2019re in a hurry.

That line stayed with us. \uD83D\uDC04

These are the hands behind every jar of Aavya Ghee. We\u2019re grateful every single day.

#FarmFresh #OurFarmers #A2Cows #AavyaFoods #Desi`,
    category: 'Farm',
    date: 'April 7, 2026',
    image: '/aavya/farm-story.png',
    images: ['/aavya/farm-story.png', '/aavya/journey-steps/step1.webp'],
    featured: false,
    author: 'Aavya Farm Team',
    initials: 'AF',
    likes: 2341,
    comments: [
      { id: 1, author: 'Sunita P.', initials: 'SP', text: 'Love that you share these stories \uD83D\uDE4F\uD83C\uDFFD', time: '5h' },
      { id: 2, author: 'Arjun T.', initials: 'AT', text: 'Ramu Kaka is the real hero here!', time: '3h' },
      { id: 3, author: 'Meena R.', initials: 'MR', text: 'This made my morning \u2614', time: '1h' },
    ],
  },
  {
    id: 3,
    title: 'Monsoon at the Farm: How Rain Shapes Our Ghee',
    excerpt: 'Lush grass, happier cows, and a subtly richer ghee. Here\u2019s what quietly changes when the rains arrive.',
    caption: `Monsoon arrived at the farm yesterday. \uD83C\uDF27\uFE0F

The grass is already greener than it was last week. The cows are calmer. The milk is richer \u2014 you can almost feel it just by looking.

This time of year, the ghee has a slightly deeper colour and a warmer, rounder aroma. It\u2019s subtle \u2014 but once you notice it, you can\u2019t un-notice it.

Nature just does this. We don\u2019t add anything. We just show up and pay attention.

Grateful for rain. \uD83C\uDF3F

#MonsoonAtTheFarm #SeasonalGhee #A2Ghee #AavyaFoods #NaturalGoodness`,
    category: 'Seasonal',
    date: 'March 28, 2026',
    image: '/aavya/hero-bg2.png',
    images: ['/aavya/hero-bg2.png', '/aavya/farm-story.png'],
    featured: false,
    author: 'Aavya Farm Team',
    initials: 'AF',
    likes: 1203,
    comments: [
      { id: 1, author: 'Deepa S.', initials: 'DS', text: 'Had no idea seasons affected the ghee this way!', time: '8h' },
    ],
  },
  {
    id: 4,
    title: 'The Golden Hour: When We Know the Ghee is Ready',
    excerpt: 'It\u2019s not a timer or a thermometer. It\u2019s colour, aroma, and years of experience.',
    caption: `It\u2019s not a timer.
It\u2019s not a thermometer.

It\u2019s the colour. The sound the bubbles make. The way the aroma fills the room. And years of experience that tell you \u2014 right now. Stop the flame.

Knowing this exact moment is a skill. Some of our team took years to develop it. Once you have it, it\u2019s yours forever.

The ghee you get from us? It\u2019s only made by people who know this feeling. \uD83D\uDC9B

#PureGhee #BilonaMethod #CraftedWithCare #AavyaFoods #A2Bilona`,
    category: 'Process',
    date: 'March 20, 2026',
    image: '/aavya/journey-steps/step4.webp',
    images: ['/aavya/journey-steps/step4.webp', '/aavya/journey-steps/step3.webp'],
    featured: false,
    author: 'Aavya Farm Team',
    initials: 'AF',
    likes: 3102,
    comments: [
      { id: 1, author: 'Kavita N.', initials: 'KN', text: 'This is actual craft. Respect \uD83D\uDC4F', time: '12h' },
      { id: 2, author: 'Vishnu A.', initials: 'VA', text: 'My grandmother used to say the same thing about knowing when to stop.', time: '6h' },
    ],
  },
  {
    id: 5,
    title: 'Why Our Cows Roam Free \u2014 And Why It Matters',
    excerpt: 'Free-grazing isn\u2019t just a label. The daily movement and natural diet of our cows directly shapes every batch.',
    caption: `Free-grazing isn\u2019t a buzzword for us. It\u2019s just what the cows need.

When an animal is stressed, confined, or eating processed feed \u2014 the milk changes. The body doesn\u2019t lie.

Our cows roam open fields, eat what grows naturally, and are never rushed. Their milk is the starting point of everything we make.

You taste the difference whether you know it or not. That calm, clean, full flavour isn\u2019t something we add. It\u2019s already there.

We just don\u2019t ruin it. \uD83D\uDC04

#FreeGrazing #HappyCows #A2Milk #AavyaFoods #PureFromSource`,
    category: 'Farm',
    date: 'March 10, 2026',
    image: '/aavya/journey-steps/step1.webp',
    images: ['/aavya/journey-steps/step1.webp', '/aavya/farm-story.png', '/aavya/hero-bg2.png'],
    featured: false,
    author: 'Aavya Farm Team',
    initials: 'AF',
    likes: 2789,
    comments: [
      { id: 1, author: 'Smita G.', initials: 'SG', text: 'This is why I trust Aavya completely \u2764\uFE0F', time: '1d' },
      { id: 2, author: 'Rahul M.', initials: 'RM', text: 'Makes so much sense when you put it this way', time: '20h' },
      { id: 3, author: 'Ananya B.', initials: 'AB', text: 'Ordered two jars after reading this \uD83D\uDE02', time: '14h' },
    ],
  },
  {
    id: 6,
    title: '5,000 Families and Still Going',
    excerpt: 'We never imagined reaching this many kitchens. A heartfelt note on what your trust means, and what\u2019s next.',
    caption: `5,000 families.

We started this with one simple belief: that people deserve honest food. No shortcuts. No noise. Just something real.

We never ran ads. Never promised miracles. Just made good ghee, told the truth about how it\u2019s made, and hoped it would find the right people.

It did. \uD83E\uDD7A

Thank you for trusting us with your kitchen. We don\u2019t take it lightly. Every batch we make, we think about the meals you\u2019re cooking.

More to come. Slower, better, always honest.

\u2014 The Aavya Team

#AavyaFoods #5000Families #ThankYou #PureGhee #MadeWithLove`,
    category: 'Team',
    date: 'March 1, 2026',
    image: '/aavya/about-hero-bg.png',
    images: ['/aavya/about-hero-bg.png'],
    featured: false,
    author: 'Aavya Founders',
    initials: 'AV',
    likes: 4512,
    comments: [
      { id: 1, author: 'Neha J.', initials: 'NJ', text: 'Been with you since the beginning. So proud! \uD83C\uDF89', time: '2d' },
      { id: 2, author: 'Suresh P.', initials: 'SP', text: 'Ordered my first jar after seeing this. Can\u2019t wait!', time: '1d' },
    ],
  },
]

// ─── Featured card ─────────────────────────────────────────────────────────────

function FeaturedCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const meta = CATEGORY_META[post.category]
  const Icon = meta.icon
  return (
    <article
      onClick={onClick}
      className="group relative w-full rounded-3xl overflow-hidden shadow-xl min-h-[420px] md:min-h-[520px] cursor-pointer"
    >
      <Image
        src={post.image}
        alt={post.title}
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

      <div className="absolute top-5 left-5 z-10 flex gap-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${meta.pill}`}>
          <Icon className="w-3 h-3" />{post.category}
        </span>
      </div>
      <div className="absolute top-5 right-5 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20 backdrop-blur-sm">
          ✦ Featured
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3 text-white/60 text-xs">
          <Clock className="w-3 h-3" />
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.likes.toLocaleString()} likes</span>
        </div>
        <h2 className="text-white text-2xl md:text-3xl font-bold leading-snug mb-3 max-w-2xl">{post.title}</h2>
        <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-xl mb-5 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {post.initials}
            </div>
            <span className="text-white/80 text-sm font-medium">{post.author}</span>
          </div>
          <span className="inline-flex items-center gap-2 text-white font-semibold text-sm bg-white/15 hover:bg-white/25 border border-white/20 px-5 py-2.5 rounded-full backdrop-blur-sm transition-all duration-200 group-hover:gap-3">
            Open Post <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </article>
  )
}

// ─── Grid card ─────────────────────────────────────────────────────────────────

function StoryCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const meta = CATEGORY_META[post.category]
  const Icon = meta.icon
  return (
    <article
      onClick={onClick}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-surface hover:border-transparent transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${meta.pill}`}>
            <Icon className="w-2.5 h-2.5" />{post.category}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-text-primary font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Post
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-text-secondary/50 text-xs mb-3">
          <span>{post.date}</span>
          <span>·</span>
          <span>❤️ {post.likes.toLocaleString()}</span>
        </div>
        <h3 className="font-bold text-text-primary text-base leading-snug mb-2 group-hover:text-secondary transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
            {post.initials}
          </div>
          <span className="text-text-secondary text-xs font-medium">{post.author}</span>
        </div>
      </div>
    </article>
  )
}

// ─── Conversion banner ─────────────────────────────────────────────────────────

function ConversionBanner() {
  return (
    <div className="relative rounded-3xl overflow-hidden my-4">
      <Image src="/aavya/hero-bg3.png" alt="Aavya Ghee" fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#4E342E]/92 via-[#4E342E]/70 to-transparent" />
      <div className="relative z-10 px-8 py-12 md:px-14 md:py-14 max-w-lg">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-4 h-4 text-primary" />
          <span className="text-primary text-xs font-semibold uppercase tracking-widest">Taste the Story</span>
        </div>
        <h3 className="text-white text-2xl md:text-3xl font-bold leading-snug mb-3">
          Every story here starts with the same jar of ghee.
        </h3>
        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
          Pure, traditional, made without shortcuts \u2014 now in your kitchen.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary-dark text-text-primary font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:gap-3.5 active:scale-95"
        >
          Shop the Ghee <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SellerPage() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const filtered = useMemo(
    () => (activeCategory === 'All' ? POSTS : POSTS.filter((p) => p.category === activeCategory)),
    [activeCategory]
  )

  const featured = filtered.find((p) => p.featured) ?? filtered[0]
  const gridPosts = featured ? filtered.filter((p) => p.id !== featured.id) : filtered
  const firstBatch = gridPosts.slice(0, 3)
  const secondBatch = gridPosts.slice(3)

  // Modal prev/next within filtered list
  const selectedIdx = selectedPost ? filtered.findIndex((p) => p.id === selectedPost.id) : -1
  const handlePrev = selectedIdx > 0 ? () => setSelectedPost(filtered[selectedIdx - 1]) : undefined
  const handleNext = selectedIdx < filtered.length - 1 ? () => setSelectedPost(filtered[selectedIdx + 1]) : undefined

  return (
    <div className="min-h-screen bg-[#FDFCF7]">

      {/* Page hero */}
      <section className="relative bg-gradient-to-b from-[#FDFCF0] to-[#FDFCF7] border-b border-secondary/10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-secondary/6 blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 md:px-8 pt-14 pb-12 md:pt-20 md:pb-16">
          <ScrollReveal animation="up">
            <div className="flex items-center gap-2 mb-5 justify-center md:justify-start">
              <div className="h-px w-8 bg-gradient-green" />
              <span className="text-gradient-green font-semibold text-xs uppercase tracking-[0.2em]">Behind the Jar</span>
              <div className="h-px w-8 bg-gradient-green" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-[3rem] font-extrabold text-text-primary leading-[1.1] tracking-tight text-center md:text-left mb-4">
              Our Stories
            </h1>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-xl text-center md:text-left mb-8">
              Weekly peeks into the farm, the kitchen, and the people behind every jar \u2014 told honestly, the same way we make our ghee.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              {[{ label: 'Stories', value: `${POSTS.length}+` }, { label: 'Posted weekly', value: 'Every Week' }, { label: 'From the source', value: '100% Real' }].map(({ label, value }) => (
                <div key={label} className="text-center md:text-left">
                  <p className="text-text-primary font-bold text-lg">{value}</p>
                  <p className="text-text-secondary text-xs">{label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-14">

        {/* Category filter */}
        <ScrollReveal animation="up">
          <div className="flex gap-2 overflow-x-auto pb-1 mb-10" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/20'
                      : 'bg-white text-text-secondary border-surface hover:border-secondary/40 hover:text-secondary'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </ScrollReveal>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-text-secondary">No stories in this category yet. Check back soon.</div>
        ) : (
          <>
            {featured && (
              <ScrollReveal animation="up" className="mb-8">
                <FeaturedCard post={featured} onClick={() => setSelectedPost(featured)} />
              </ScrollReveal>
            )}
            {firstBatch.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                {firstBatch.map((post, i) => (
                  <ScrollReveal key={post.id} animation="up" delay={i * 90}>
                    <StoryCard post={post} onClick={() => setSelectedPost(post)} />
                  </ScrollReveal>
                ))}
              </div>
            )}
            {firstBatch.length >= 2 && (
              <ScrollReveal animation="scale" className="mb-8">
                <ConversionBanner />
              </ScrollReveal>
            )}
            {secondBatch.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {secondBatch.map((post, i) => (
                  <ScrollReveal key={post.id} animation="up" delay={i * 90}>
                    <StoryCard post={post} onClick={() => setSelectedPost(post)} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom subscribe */}
        <ScrollReveal animation="up" className="mt-20">
          <div className="rounded-3xl bg-gradient-to-br from-[#FDFCF0] to-surface border border-primary/15 px-8 py-12 text-center shadow-sm">
            <Leaf className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-primary mb-2">Don\u2019t miss the next story</h3>
            <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
              We post every week \u2014 from the farm, the kitchen, and everything in between.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white border border-surface rounded-full px-5 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all"
              />
              <button className="shrink-0 bg-gradient-green text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-sm">
                Notify Me
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
