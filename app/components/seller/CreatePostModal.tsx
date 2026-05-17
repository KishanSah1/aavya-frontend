'use client'

import { useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ImageIcon, ChevronLeft, ChevronRight, Plus, Leaf } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/store/authStore'
import { fetchWithAuth } from '@/lib/fetchWithAuth'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

type Step = 'select' | 'details'

interface CreatePostModalProps {
  onClose: () => void
}

async function uploadFile(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetchWithAuth(`${API}/api/v1/upload`, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Image upload failed')
  const { data } = await res.json()
  return data.url
}

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const [step, setStep] = useState<Step>('select')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const addMoreRef = useRef<HTMLInputElement>(null)

  function addFiles(list: FileList | null) {
    if (!list) return
    const valid = Array.from(list).filter((f) => f.type.startsWith('image/'))
    if (!valid.length) return
    const urls = valid.map((f) => URL.createObjectURL(f))
    setFiles((p) => [...p, ...valid])
    setPreviews((p) => [...p, ...urls])
  }

  function removeFile(i: number) {
    URL.revokeObjectURL(previews[i])
    setFiles((p) => p.filter((_, idx) => idx !== i))
    setPreviews((p) => p.filter((_, idx) => idx !== i))
    setActiveIdx((prev) => Math.min(prev, Math.max(0, files.length - 2)))
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  async function handleShare() {
    if (!title.trim()) { setError('Add a title'); return }
    if (!caption.trim()) { setError('Write a caption'); return }
    setError('')
    setLoading(true)
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f)))
      const authorName = user?.name ?? 'Aavya Farm Team'
      const initials = authorName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 3)
      const res = await fetchWithAuth(`${API}/api/v1/posts`, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          caption: caption.trim(),
          image: urls[0],
          images: urls,
          author: authorName,
          initials,
          featured: false,
        }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error?.message ?? 'Failed to publish'); return }
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const avatarLetter = (user?.name ?? 'A')[0].toUpperCase()

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />

      <div className={`relative z-10 bg-[#FDFCF7] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-modal-in transition-[width,max-width] duration-300 ${
        step === 'select' ? 'w-full max-w-md' : 'w-full max-w-[860px]'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface shrink-0 bg-white">
          {step === 'details' ? (
            <button
              onClick={() => { setStep('select'); setError('') }}
              disabled={loading}
              className="text-text-secondary hover:text-secondary transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-secondary" />
            <span className="font-bold text-sm text-text-primary">
              {step === 'select' ? 'Add Story' : 'New Story'}
            </span>
          </div>

          {step === 'details' ? (
            <button
              onClick={handleShare}
              disabled={loading}
              className="text-secondary hover:text-secondary-light font-semibold text-sm disabled:opacity-50 transition-colors"
            >
              {loading ? 'Posting…' : 'Post'}
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>

        {/* Step 1: Select photos */}
        {step === 'select' && (
          <div className="flex flex-col">
            {files.length === 0 ? (
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-5 py-20 px-8 cursor-pointer transition-colors select-none ${
                  isDragging ? 'bg-secondary/5' : 'bg-[#FDFCF7] hover:bg-surface/60'
                }`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                  isDragging ? 'bg-secondary/15' : 'bg-primary/15'
                }`}>
                  <ImageIcon className={`w-10 h-10 transition-colors ${isDragging ? 'text-secondary' : 'text-primary'}`} />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-text-primary text-xl font-light">Drag photos here</p>
                  <p className="text-text-secondary/60 text-sm">Supports JPG, PNG, WEBP</p>
                </div>
                <button
                  type="button"
                  className="bg-secondary hover:bg-secondary-light text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors shadow-md shadow-secondary/20"
                >
                  Select from computer
                </button>
              </div>
            ) : (
              <>
                {/* Main preview */}
                <div className="relative bg-black aspect-square overflow-hidden">
                  <Image
                    src={previews[activeIdx]}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="448px"
                    unoptimized
                  />
                  {files.length > 1 && (
                    <>
                      {activeIdx > 0 && (
                        <button
                          onClick={() => setActiveIdx((i) => i - 1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      {activeIdx < files.length - 1 && (
                        <button
                          onClick={() => setActiveIdx((i) => i + 1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                        {previews.map((_, i) => (
                          <span key={i} className={`rounded-full transition-all ${i === activeIdx ? 'w-4 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/50'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                <div className="flex items-center gap-2 px-3 py-3 overflow-x-auto border-t border-surface bg-white" style={{ scrollbarWidth: 'none' }}>
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden cursor-pointer group"
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="64px" unoptimized />
                      <div className={`absolute inset-0 transition-all ${i === activeIdx ? 'ring-2 ring-secondary ring-inset' : 'group-hover:bg-black/10'}`} />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addMoreRef.current?.click()}
                    className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-secondary/30 flex items-center justify-center hover:border-secondary/60 hover:bg-secondary/5 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-secondary/60" />
                  </button>
                  <input ref={addMoreRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                </div>

                {/* Next button */}
                <div className="px-4 pb-4 pt-1 bg-white">
                  <button
                    onClick={() => setStep('details')}
                    className="w-full bg-secondary hover:bg-secondary-light text-white font-semibold py-2.5 rounded-full transition-colors text-sm shadow-md shadow-secondary/20"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <div className="flex" style={{ height: '540px' }}>

            {/* Left: image carousel */}
            <div className="relative bg-black shrink-0 overflow-hidden" style={{ width: '54%' }}>
              <Image
                src={previews[activeIdx]}
                alt="Preview"
                fill
                className="object-contain"
                sizes="500px"
                unoptimized
              />
              {files.length > 1 && (
                <>
                  {activeIdx > 0 && (
                    <button
                      onClick={() => setActiveIdx((i) => i - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  {activeIdx < files.length - 1 && (
                    <button
                      onClick={() => setActiveIdx((i) => i + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                    {previews.map((_, i) => (
                      <span key={i} className={`rounded-full transition-all ${i === activeIdx ? 'w-4 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right: form */}
            <div className="flex flex-col flex-1 min-w-0 border-l border-surface bg-[#FDFCF7]">

              {/* Author row */}
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-surface shrink-0 bg-white">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {avatarLetter}
                </div>
                <span className="font-semibold text-sm text-text-primary truncate">{user?.name ?? 'Aavya Farm Team'}</span>
              </div>

              {/* Title */}
              <div className="px-4 pt-4 shrink-0">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title…"
                  maxLength={200}
                  autoFocus
                  className="w-full text-sm font-semibold text-text-primary placeholder:text-text-secondary/40 outline-none pb-3 border-b border-surface focus:border-secondary/50 bg-transparent transition-colors"
                />
              </div>

              {/* Caption */}
              <div className="flex-1 overflow-y-auto px-4 pt-3">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your story…"
                  className="w-full h-full text-sm text-text-secondary placeholder:text-text-secondary/40 outline-none resize-none bg-transparent leading-relaxed"
                />
              </div>

              {/* Character count + error */}
              <div className="px-4 pb-4 shrink-0 space-y-1.5 bg-white border-t border-surface pt-3">
                <p className="text-xs text-text-secondary/40 text-right">{caption.length} characters</p>
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
