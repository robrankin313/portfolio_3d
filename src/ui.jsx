import { useEffect, useRef, useState } from 'react'

export function Typewriter({ words }) {
  const [text, setText] = useState('')
  useEffect(() => {
    let w = 0
    let c = 0
    let del = false
    let id
    const tick = () => {
      const word = words[w]
      c += del ? -1 : 1
      setText(word.slice(0, c))
      let wait = del ? 30 : 60
      if (!del && c === word.length) {
        del = true
        wait = 1400
      } else if (del && c === 0) {
        del = false
        w = (w + 1) % words.length
        wait = 300
      }
      id = setTimeout(tick, wait)
    }
    id = setTimeout(tick, 600)
    return () => clearTimeout(id)
  }, [words])
  return (
    <span className="typed">
      {text}
      <i className="caret" />
    </span>
  )
}

export function Counter({ to, suffix, label }) {
  const ref = useRef()
  const [val, setVal] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const run = (now) => {
          const p = Math.min(1, (now - start) / 1400)
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(run)
        }
        requestAnimationFrame(run)
      },
      { threshold: 0.6 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to])
  return (
    <div className="stat glass tilt" ref={ref}>
      <div className="num">
        {val}
        {suffix}
      </div>
      <div className="muted">{label}</div>
    </div>
  )
}

// Page-wide effects: reveal on scroll, card tilt + spotlight, cursor glow, progress bar, active nav
export function usePageEffects(setActive) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('[data-spy]').forEach((el) => spy.observe(el))

    const glow = document.querySelector('.cursor-glow')
    const bar = document.querySelector('.progress')
    const onMove = (e) => {
      if (glow) glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      const card = e.target.closest?.('.tilt')
      document.querySelectorAll('.tilt.active').forEach((el) => {
        if (el !== card) {
          el.classList.remove('active')
          el.style.transform = ''
        }
      })
      if (!card) return
      const r = card.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      card.classList.add('active')
      card.style.setProperty('--mx', `${x * 100}%`)
      card.style.setProperty('--my', `${y * 100}%`)
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg) translateZ(0)`
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      io.disconnect()
      spy.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [setActive])
}
