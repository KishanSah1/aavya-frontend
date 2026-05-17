'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import {
  X, Heart, MessageCircle, Share2, Bookmark,
  ChevronLeft, ChevronRight, ArrowRight,
} from 'lucide-react'
import type { Post, Comment } from '@/app/seller/types'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { useAuthStore } from '@/lib/store/authStore'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface PostModalProps {
  post: Post
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

function formatCommentDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function PostModal({ post, onClose, onPrev, onNext }: PostModalProps) {
  const user = useAuthStore((s) => s.user)

  const [currentImage, setCurrentImage] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [saved, setSaved] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [likeAnimKey, setLikeAnimKey] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>(post.comments)
  const [commentLoading, setCommentLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const commentRef = useRef<HTMLInputElement>(null)
  const heartTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset when post changes and fetch comments from API
  useEffect(() => {
    setCurrentImage(0)
    setLiked(false)
    setLikeCount(post.likes)
    setSaved(false)
    setComments([])
    setCommentText('')

    fetch(`${API}/api/v1/posts/${post.id}/comments`)
      .then((r) => r.json())
      .then(({ data }) => {
        setComments(
          (data as any[]).map((c) => ({
            id: c.id,
            author: c.author,
            initials: c.initials,
            text: c.text,
            time: formatCommentDate(c.createdAt),
          })),
        )
      })
      .catch(() => {})
  // only reset when the post itself changes, not on every likes count update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  const triggerLike = useCallback(async () => {
    if (likeLoading) return
    const next = !liked
    setLiked(next)
    setLikeCount((c) => (next ? c + 1 : c - 1))
    setLikeAnimKey((k) => k + 1)
    setLikeLoading(true)

    try {
      const res = await fetchWithAuth(`${API}/api/v1/posts/${post.id}/like`, {
        method: next ? 'POST' : 'DELETE',
      })
      if (res.ok) {
        const { data } = await res.json()
        setLikeCount(data.likeCount)
      } else if (next && res.status === 409) {
        setLiked(true)
      } else if (!next && res.status === 404) {
        setLiked(false)
      } else {
        setLiked(!next)
        setLikeCount((c) => (next ? c - 1 : c + 1))
      }
    } catch {
      setLiked(!next)
      setLikeCount((c) => (next ? c - 1 : c + 1))
    } finally {
      setLikeLoading(false)
    }
  }, [liked, likeLoading, post.id])

  const handleImageClick = useCallback(() => {
    if (!liked) {
      triggerLike()
      if (heartTimeout.current) clearTimeout(heartTimeout.current)
      setShowHeart(true)
      heartTimeout.current = setTimeout(() => setShowHeart(false), 900)
    }
  }, [liked, triggerLike])

  const handleSave = useCallback(async () => {
    const next = !saved
    setSaved(next)
    try {
      await fetchWithAuth(`${API}/api/v1/posts/${post.id}/save`, {
        method: next ? 'POST' : 'DELETE',
      })
    } catch {
      setSaved(!next)
    }
  }, [saved, post.id])

  const handleComment = async () => {
    if (!commentText.trim() || commentLoading) return
    const text = commentText.trim()
    setCommentText('')
    setCommentLoading(true)
    try {
      const res = await fetchWithAuth(`${API}/api/v1/posts/${post.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      })
      const { data } = await res.json()
      if (res.ok) {
        setComments((c) => [
          ...c,
          {
            id: data.id,
            author: data.author,
            initials: data.initials,
            text: data.text,
            time: 'Just now',
          },
        ])
      }
    } catch {
      // silently fail — comment text already cleared
    } finally {
      setCommentLoading(false)
    }
  }

  const userInitials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'G'

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-reveal-fade"
        onClick={onClose}
      />

      {/* Prev post */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/25 transition-all hover:scale-110"
          aria-label="Previous post"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next post */}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/25 transition-all hover:scale-110"
          aria-label="Next post"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Modal panel */}
      <div className="
        relative z-10 w-full bg-white
        flex flex-col md:flex-row
        h-[94vh] md:h-[88vh] md:max-h-[860px]
        md:max-w-[900px] md:mx-6
        rounded-t-3xl md:rounded-2xl
        overflow-hidden shadow-2xl
        animate-modal-in
      ">

        {/* ── Left: Image panel ── */}
        <div
          className="relative md:w-[52%] shrink-0 bg-black h-[46vw] min-h-[240px] md:h-full cursor-pointer select-none"
          onDoubleClick={handleImageClick}
        >
          {/* Images (cross-fade) */}
          {post.images.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-400 ${i === currentImage ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <Image
                src={src}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 52vw"
                priority={i === 0}
              />
            </div>
          ))}

          {/* Floating heart on double-click */}
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span className="text-7xl animate-heart-pop drop-shadow-xl">❤️</span>
            </div>
          )}

          {/* Image carousel controls */}
          {post.images.length > 1 && (
            <>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {post.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`rounded-full transition-all duration-300 ${i === currentImage ? 'w-5 h-[5px] bg-white' : 'w-[5px] h-[5px] bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
              {currentImage > 0 && (
                <button
                  onClick={() => setCurrentImage((c) => c - 1)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {currentImage < post.images.length - 1 && (
                <button
                  onClick={() => setCurrentImage((c) => c + 1)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Right: Content panel ── */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                {post.initials}
              </div>
              <div>
                <p className="font-bold text-text-primary text-sm leading-tight">{post.author}</p>
                <p className="text-text-secondary/60 text-[11px]">{post.date}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">

            {/* Caption */}
            <div className="text-text-primary text-sm leading-[1.7] whitespace-pre-line">
              <span className="font-bold text-text-primary mr-1.5">{post.author}</span>
              {post.caption}
            </div>

            {/* Shop CTA strip */}
            <Link
              href="/products"
              className="flex items-center justify-between bg-gradient-to-r from-[#FDFCF0] to-surface border border-primary/20 rounded-2xl px-4 py-3 group hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-sm">🫙</span>
                </div>
                <div>
                  <p className="text-text-primary text-xs font-semibold leading-tight">Try the ghee from this story</p>
                  <p className="text-text-secondary/70 text-[11px]">Pure A2 Bilona Ghee — Shop Now</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Comments */}
            {comments.length > 0 && (
              <div className="space-y-3 pt-1">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-[10px] font-bold text-text-secondary shrink-0 border border-surface">
                      {c.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text-primary leading-snug">
                        <span className="font-bold mr-1">{c.author}</span>
                        {c.text}
                      </p>
                      <p className="text-[10px] text-text-secondary/50 mt-0.5">{c.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="border-t border-surface px-4 pt-3 pb-2 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <button
                  key={likeAnimKey}
                  onClick={triggerLike}
                  disabled={likeLoading}
                  className={`transition-colors duration-200 disabled:opacity-70 ${liked ? 'text-red-500' : 'text-text-secondary hover:text-text-primary'} ${likeAnimKey > 0 ? 'animate-like-jump' : ''}`}
                  aria-label="Like"
                >
                  <Heart className={`w-6 h-6 transition-all duration-200 ${liked ? 'fill-red-500 scale-110' : ''}`} />
                </button>
                <button
                  onClick={() => commentRef.current?.focus()}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Comment"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className="text-text-secondary hover:text-text-primary transition-colors" aria-label="Share">
                  <Share2 className="w-[22px] h-[22px]" />
                </button>
              </div>
              <button
                onClick={handleSave}
                className={`transition-colors duration-200 ${saved ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                aria-label="Save"
              >
                <Bookmark className={`w-6 h-6 transition-all duration-200 ${saved ? 'fill-text-primary' : ''}`} />
              </button>
            </div>
            <p className="text-text-primary text-xs font-bold mb-1">{likeCount.toLocaleString()} likes</p>
          </div>

          {/* Comment input */}
          <div className="border-t border-surface px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center text-[10px] font-bold text-secondary shrink-0">
              {userInitials}
            </div>
            <input
              ref={commentRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              placeholder="Add a comment…"
              className="flex-1 text-sm bg-transparent outline-none text-text-primary placeholder:text-text-secondary/40 py-1"
            />
            {commentText.trim() && (
              <button
                onClick={handleComment}
                disabled={commentLoading}
                className="text-secondary font-bold text-sm hover:text-secondary-light transition-colors shrink-0 disabled:opacity-50"
              >
                {commentLoading ? '…' : 'Post'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
