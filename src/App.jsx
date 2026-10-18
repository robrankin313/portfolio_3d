import { useState } from 'react'
import Scene from './Scene.jsx'
import { Counter, Typewriter, usePageEffects } from './ui.jsx'
import { profile, roles, stats, skills, experience, education } from './data.js'

const nav = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['contact', 'Contact'],
]

export default function App() {
  const [active, setActive] = useState('top')
  usePageEffects(setActive)

  return (
    <>
      <div className="canvas"><Scene /></div>
      <div className="cursor-glow" />
      <div className="progress" />

      <nav className="nav glass">
        <a href="#top" className="logo">RR</a>
        {nav.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'on' : ''}>{label}</a>
        ))}
      </nav>

      <header id="top" data-spy className="hero">
        <div className="hero-text">
          <p className="eyebrow">{profile.location}</p>
          <h1>{profile.name}</h1>
          <p className="title">{profile.title}</p>
          <p className="typed-line"><Typewriter words={roles} /></p>
          <a className="btn" href="#contact">Get in touch</a>
        </div>
        <div className="scroll-cue">scroll<span /></div>
      </header>

      <main>
        <section id="about" data-spy>
          <h2 className="reveal">About</h2>
          {profile.summary.map((p) => <p key={p} className="reveal lead">{p}</p>)}
          <div className="stats">
            {stats.map((s) => <Counter key={s.label} {...s} />)}
          </div>
        </section>

        <section id="skills" data-spy>
          <h2 className="reveal">Skills</h2>
          <p className="muted reveal">Tip: hover or click the glowing nodes behind this page.</p>
          <div className="skill-grid">
            {skills.map((s) => (
              <div key={s.group} className="card glass tilt reveal">
                <h3>{s.group}</h3>
                <ul className="chips">{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" data-spy>
          <h2 className="reveal">Experience</h2>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.role + e.period} className="card glass tilt reveal">
                <div className="row">
                  <h3>{e.role} <span className="at">@ {e.company}</span></h3>
                  <span className="period">{e.period}</span>
                </div>
                <p className="muted">{e.place}{e.about ? ` · ${e.about}` : ''}</p>
                <ul>{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                <ul className="chips">{e.tech.map((t) => <li key={t}>{t}</li>)}</ul>
              </li>
            ))}
          </ol>
        </section>

        <section id="education" data-spy className="tall">
          <h2 className="reveal">Education</h2>
          <div className="card glass tilt reveal">
            <div className="row">
              <h3>{education.degree}</h3>
              <span className="period">{education.period}</span>
            </div>
            <p className="muted">{education.school}</p>
          </div>
        </section>

        <section id="contact" data-spy className="tall">
          <h2 className="reveal">Let's build something</h2>
          <p className="reveal lead"><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
          <p className="reveal">{profile.links.map((l) => <a key={l.label} className="btn" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}</p>
        </section>
      </main>
      <footer>© {new Date().getFullYear()} {profile.name}</footer>
    </>
  )
}
