'use client'

import { useEffect, useRef, useState } from 'react'
import { Leaf } from 'lucide-react'

type Speaker = 'a' | 'b'
type Weight  = 'whisper' | 'statement' | 'story'

interface Msg {
  speaker: Speaker
  weight:  Weight
  lines:   string[]
}

const MESSAGES: Msg[] = [
  { speaker: 'a', weight: 'statement', lines: ['Ghee toh aap bhi khaate honge?'] },
  { speaker: 'b', weight: 'statement', lines: ['Haan… ye bhi koi poochne wali baat hai?'] },
  { speaker: 'a', weight: 'statement', lines: ['Kabhi socha hain, jo kha rahe hain, woh aata kahan se hai?'] },
  { speaker: 'b', weight: 'whisper',   lines: ['Sach kahun?\nNahin.'] },
  { speaker: 'a', weight: 'statement', lines: ['Main bhi nahin sochti thi. Bas dabba aata tha, aur use ho jaata tha.'] },
  { speaker: 'b', weight: 'whisper',   lines: ['Phir?'] },
  { speaker: 'a', weight: 'statement', lines: ['Phir ek din… kisi ne Aavya ka naam liya.'] },
  { speaker: 'b', weight: 'statement', lines: ['Aur tumne maan liya?'] },
  { speaker: 'a', weight: 'statement', lines: ['Nahin… maine sawal kiya. Ki ye Aavya hai kya? Aur kyun?'] },
  { speaker: 'b', weight: 'statement', lines: ['Aur jawab mila?'] },
  { speaker: 'a', weight: 'statement', lines: ['Nahin… par pehle kahani mili.'] },
  { speaker: 'b', weight: 'whisper',   lines: ['Kaisi kahani?'] },
  {
    speaker: 'a', weight: 'story',
    lines: [
      'Subah ki.',
      'Wahan subah thodi alag hoti hai. Log uthte toh hain, par bhaagte nahi… jaise unhe kahin pahunchna nahi hota, bas kisi apne ke paas jaana hota hai.',
      'Isiliye woh seedha apni gaayon ke paas jaate hain. Doodh nikalte hue bhi koi jaldi nahi hoti — kyunki yahan kaam nahi, rishta hota hai.',
      'Har cheez ko apna waqt diya jaata hai. Woh doodh dheere dheere rukta hai, badalta hai, aur bilona ke saath ghee ban jaata hai.',
      'Jaise kisi ne usse banaya nahi… bas sambhala ho, aur waqt ne use apne aap poora kar diya ho.',
    ],
  },
  {
    speaker: 'b', weight: 'story',
    lines: [
      'Aur shayad isi liye baat sirf itni nahi hai ki yeh ghee hum tak kaise pahunchta hai.',
      'Wahan kisi ke ghar mein yeh sirf ghee banke nahi nikalta — yeh unke din bhar ki mehnat hoti hai, unki rozi hoti hai, ek aisa sahara jo har subah unhe phir se shuru karne ka hausla deta hai.',
      'Aur jab yeh ghee hum tak pahunchta hai na, toh sirf humare khaane ka swaad nahi badhata — balki kahin na kahin unke ghar mein bhi ek aur din ki roshni jod deta hai.',
    ],
  },
  { speaker: 'a', weight: 'whisper',   lines: ['Itna simple?'] },
  { speaker: 'b', weight: 'statement', lines: ['Haan… itna hi simple.'] },
  { speaker: 'a', weight: 'statement', lines: ['Aur hum? Hum bas uska last hissa dekhte hain… ek dabba, ek naam, ek taste.'] },
  {
    speaker: 'b', weight: 'story',
    lines: [
      'Par beech mein jo hai na… woh kisi ka poora din hai.',
      'Kisi kisan ki subah… uski mehnat… uska bharosa ki jo woh bana raha hai, woh kisi ke ghar tak pahunchega.',
    ],
  },
  { speaker: 'a', weight: 'statement', lines: ['Toh Aavya kya karta hai?'] },
  {
    speaker: 'b', weight: 'story',
    lines: [
      'Kuch naya nahi.',
      'Bas cheezon ko badalta nahi. Woh un logon ke saath khada rehta hai, taaki jo woh bana rahe hain, woh waise hi aap tak aa sake.',
      'Aur haan… yeh sirf ghee nahi deta — unke liye ek raasta bhi deta hai. Ek aamdani, ek yakeen ki kal bhi yahi kaam chalta rahega.',
    ],
  },
  { speaker: 'a', weight: 'statement', lines: ['Toh agar koi puche… kyun Aavya?'] },
  {
    speaker: 'b', weight: 'story',
    lines: [
      'Shayad isliye…',
      'Kyunki kabhi kabhi humein bas khana nahi hota — humein samajhna hota hai ki hum kha kya rahe hain.',
      'Aur jab samajh aa jaata hai na… toh phir chunna mushkil nahi rehta.',
      'Aavya… sirf ghee nahi hai. Thoda sa gaon hai… thodi si subah hai… aur thoda sa bharosa.',
    ],
  },
]

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, on }
}

/* ── Plain person avatars, no labels ── */
function Avatar({ speaker }: { speaker: Speaker }) {
  return speaker === 'a' ? (
    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-stone-100 flex items-center justify-center ring-2 ring-white shadow-sm select-none">
      <span className="text-xl leading-none" role="img" aria-hidden>👩</span>
    </div>
  ) : (
    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-stone-100 flex items-center justify-center ring-2 ring-white shadow-sm select-none">
      <span className="text-xl leading-none" role="img" aria-hidden>👨</span>
    </div>
  )
}

/* Chat line typography — one scale for every bubble (whisper / statement / story body) */
const CHAT_TEXT =
  'text-lg sm:text-xl md:text-2xl leading-snug'

/* ── Whisper (same type size as statements; tone via weight & colour only) ── */
function Whisper({ msg, idx }: { msg: Msg; idx: number }) {
  const { ref, on } = useReveal()
  const isB = msg.speaker === 'b'
  return (
    <div
      ref={ref}
      className={`flex items-start gap-3 py-2.5 px-6 sm:px-10
        ${isB ? 'flex-row-reverse' : 'flex-row'}
        transition-all duration-600
        ${on ? 'opacity-100 translate-x-0' : isB ? 'opacity-0 translate-x-6' : 'opacity-0 -translate-x-6'}`}
      style={{ transitionDelay: `${idx * 18}ms` }}
    >
      <Avatar speaker={msg.speaker} />
      <div className={`max-w-[75%] sm:max-w-[65%] pt-1.5 ${isB ? 'text-right' : 'text-left'}`}>
        <p
          className={`whitespace-pre-line ${CHAT_TEXT}
          ${isB
            ? 'font-semibold text-secondary'
            : 'font-medium italic text-stone-600'}`}
        >
          {msg.lines[0]}
        </p>
      </div>
    </div>
  )
}

/* ── Statement ── */
function Statement({ msg, idx }: { msg: Msg; idx: number }) {
  const { ref, on } = useReveal()
  const isB = msg.speaker === 'b'
  return (
    <div
      ref={ref}
      className={`flex items-start gap-3 py-2.5 px-6 sm:px-10
        ${isB ? 'flex-row-reverse' : 'flex-row'}
        transition-all duration-600
        ${on ? 'opacity-100 translate-x-0' : isB ? 'opacity-0 translate-x-6' : 'opacity-0 -translate-x-6'}`}
      style={{ transitionDelay: `${idx * 18}ms` }}
    >
      <Avatar speaker={msg.speaker} />
      <div className={`max-w-[75%] sm:max-w-[65%] pt-1.5 ${isB ? 'text-right' : 'text-left'}`}>
        <p
          className={`${CHAT_TEXT}
          ${isB
            ? 'font-semibold text-secondary'
            : 'font-medium italic text-stone-600'}`}
        >
          {msg.lines[0]}
        </p>
      </div>
    </div>
  )
}

/* ── Story card ── */
function StoryCard({ msg, idx }: { msg: Msg; idx: number }) {
  const { ref, on } = useReveal(0.06)
  const isB = msg.speaker === 'b'
  return (
    <div
      ref={ref}
      className={`px-6 sm:px-10 my-1 transition-all duration-700
        ${on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${idx * 18}ms` }}
    >
      {/* Avatar row */}
      <div className={`flex items-center gap-2.5 mb-3 ${isB ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar speaker={msg.speaker} />
      </div>

      {/* Card */}
      <div className={`rounded-2xl overflow-hidden border
        ${isB ? 'border-green-100 bg-green-50/40' : 'border-stone-200 bg-stone-50/60'}`}
      >
        <div className={`h-[3px] ${isB
          ? 'bg-gradient-to-r from-secondary to-secondary-light'
          : 'bg-gradient-to-r from-stone-300 to-stone-200'}`}
        />
        <div className="px-6 py-6 sm:px-8 sm:py-7 space-y-3">
          {msg.lines.map((line, i) => (
            <p
              key={i}
              className={`${CHAT_TEXT} leading-relaxed
              ${i === 0
                ? isB
                  ? 'font-semibold text-secondary'
                  : 'font-semibold text-stone-800'
                : isB
                  ? 'font-medium text-secondary/80'
                  : 'font-medium text-stone-600'}`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

function Beat() {
  return (
    <div className="flex justify-center py-0.5">
      <div className="w-px h-5 bg-gradient-to-b from-transparent via-stone-200 to-transparent" />
    </div>
  )
}

export default function ConversationSection() {
  return (
    <section className="py-10 md:py-16 border-t border-primary/10">

      <div className="text-center mb-8 md:mb-12 px-4">
        <p className="flex items-center justify-center gap-2 text-secondary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
          <Leaf className="w-3.5 h-3.5 text-primary" aria-hidden />
          The Honest Story
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
          A conversation worth having
        </h2>
        <p className="text-text-secondary/60 text-sm mt-2.5 max-w-xs mx-auto leading-relaxed">
          Because knowing where your food comes from changes how it tastes.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-black/[0.06] ring-1 ring-black/[0.04] overflow-hidden">

        <div className="py-4 divide-y divide-stone-50">
          {MESSAGES.map((msg, i) => {
            const prev = MESSAGES[i - 1]
            const showBeat = i > 0
              && prev.speaker !== msg.speaker
              && prev.weight !== 'story'
              && msg.weight !== 'story'
            return (
              <div key={i} className="py-1">
                {showBeat && <Beat />}
                {msg.weight === 'whisper'   && <Whisper   msg={msg} idx={i} />}
                {msg.weight === 'statement' && <Statement msg={msg} idx={i} />}
                {msg.weight === 'story'     && <StoryCard msg={msg} idx={i} />}
              </div>
            )
          })}
        </div>

        <div className="border-t border-stone-100 px-6 py-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            { color: 'bg-secondary',       label: 'Farm-sourced A2 milk' },
            { color: 'bg-primary',         label: 'Traditional Bilona method' },
            { color: 'bg-secondary-light', label: 'Direct farmer partnership' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
              <span className="text-xs text-stone-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
