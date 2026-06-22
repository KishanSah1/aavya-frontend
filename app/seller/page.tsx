'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock, Leaf, Plus } from 'lucide-react'
import ScrollReveal from '@/app/components/ScrollReveal'
import PostModal from '@/app/components/seller/PostModal'
import CreatePostModal from '@/app/components/seller/CreatePostModal'
import { usePosts } from '@/lib/queries/usePosts'
import { useAuthStore } from '@/lib/store/authStore'
import type { Post } from './types'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

// ─── Featured card ─────────────────────────────────────────────────────────────

function FeaturedCard({ post, onClick }: { post: Post; onClick: () => void }) {
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
        <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-xl mb-5 line-clamp-2">{post.caption}</p>
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
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 flex-1">{post.caption}</p>
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
      <Image src="/aavya/hero-banner-1.png" alt="Aavya Ghee" fill sizes="100vw" className="object-cover object-center" />
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
          Pure, traditional, made without shortcuts — now in your kitchen.
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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyStatus, setNotifyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [alreadySubscribed, setAlreadySubscribed] = useState(false)

  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const email = user?.email
    if (!email) return
    fetch(`${API}/api/v1/subscribe/check?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then(({ data }) => { if (data?.subscribed) setAlreadySubscribed(true) })
      .catch(() => {})
  }, [user?.email])
  const { data: posts = [], isLoading } = usePosts()

  const featured = posts.find((p) => p.featured) ?? posts[0]
  const gridPosts = featured ? posts.filter((p) => p.id !== featured.id) : posts
  const firstBatch = gridPosts.slice(0, 3)
  const secondBatch = gridPosts.slice(3)

  const selectedIdx = selectedPost ? posts.findIndex((p) => p.id === selectedPost.id) : -1
  const handlePrev = selectedIdx > 0 ? () => setSelectedPost(posts[selectedIdx - 1]) : undefined
  const handleNext = selectedIdx < posts.length - 1 ? () => setSelectedPost(posts[selectedIdx + 1]) : undefined

  async function handleNotify() {
    const email = notifyEmail.trim() || user?.email || ''
    if (!email) return
    setNotifyStatus('loading')
    try {
      const res = await fetch(`${API}/api/v1/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setNotifyStatus('success')
      setAlreadySubscribed(true)
    } catch {
      setNotifyStatus('error')
    }
  }

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
              Weekly peeks into the farm, the kitchen, and the people behind every jar told honestly, the same way we make our ghee.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                {[{ label: 'Stories', value: `${posts.length}+` }, { label: 'Posted weekly', value: 'Every Week' }, { label: 'From the source', value: '100% Real' }].map(({ label, value }) => (
                  <div key={label} className="text-center md:text-left">
                    <p className="text-text-primary font-bold text-lg">{value}</p>
                    <p className="text-text-secondary text-xs">{label}</p>
                  </div>
                ))}
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-secondary text-white font-semibold px-5 py-2.5 rounded-full hover:bg-secondary-light transition-all shadow-md shadow-secondary/20 text-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Add Story
                </button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-14">

        {isLoading ? (
          <div className="text-center py-24 text-text-secondary">Loading stories…</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-text-secondary">No stories yet. Check back soon.</div>
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

        {/* Notify Me */}
        <ScrollReveal animation="up" className="mt-20">
          <div className="rounded-3xl bg-gradient-to-br from-[#FDFCF0] to-surface border border-primary/15 px-8 py-12 text-center shadow-sm">
            <Leaf className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-primary mb-2">Don't miss the next story</h3>
            <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
              We post every week from the farm, the kitchen, and everything in between.
            </p>
            {alreadySubscribed || notifyStatus === 'success' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-2 text-secondary font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  You're already subscribed!
                </div>
                <p className="text-text-secondary/60 text-xs">We'll notify you when the next story drops.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                  <input
                    type="email"
                    value={notifyEmail || user?.email || ''}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={notifyStatus === 'loading'}
                    className="flex-1 bg-white border border-surface rounded-full px-5 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all disabled:opacity-60"
                  />
                  <button
                    onClick={handleNotify}
                    disabled={notifyStatus === 'loading'}
                    className="shrink-0 bg-gradient-green text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-sm disabled:opacity-60"
                  >
                    {notifyStatus === 'loading' ? 'Saving…' : 'Notify Me'}
                  </button>
                </div>
                {notifyStatus === 'error' && (
                  <p className="text-red-500 text-xs mt-3">Something went wrong. Please try again.</p>
                )}
              </>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Post view modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {/* Admin: create post modal */}
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}
