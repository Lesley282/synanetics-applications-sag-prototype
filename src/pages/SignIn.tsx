import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  PasswordField,
  SynaneticsLogoWhiteLargeIcon,
  TextField,
} from '@synanetics/syn-library'
import './SignIn.scss'

// Particle background for the form panel, ported from the Claude Design
// export ("Sign in.dc.html" in the "Sign in page with Synanetics design
// system" project) — a canvas of 500 dots, biased toward the panel's edges
// and kept clear of the sign-in card by a 50px exclusion margin. On a
// successful sign-in the dots converge toward the centre as a "glitter"
// celebration before the form resets.

type Particle = {
  sx: number
  sy: number
  size: number
  color: [number, number, number]
  delay: number
  speed: number
  wobbleAmp: number
  wobbleFreq: number
  phase: number
}

type ExclusionBox = { x0: number; x1: number; y0: number; y1: number }

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Biases a 0-1 coordinate toward the edges (0 or 1), leaving the centre sparse.
function edgeBiased() {
  const t = Math.random() < 0.5 ? -1 : 1
  return 0.5 + t * Math.pow(Math.random(), 0.4) * 0.5
}

function makeParticles(exclusion: ExclusionBox | null): Particle[] {
  const N = 500
  const inBox = (x: number, y: number) =>
    exclusion !== null && x > exclusion.x0 && x < exclusion.x1 && y > exclusion.y0 && y < exclusion.y1
  const particles: Particle[] = []
  for (let i = 0; i < N; i++) {
    let sx = 0
    let sy = 0
    let tries = 0
    do {
      sx = edgeBiased()
      sy = edgeBiased()
      tries++
    } while (inBox(sx, sy) && tries < 30)
    if (exclusion && inBox(sx, sy)) {
      // Still inside after retries: snap to the nearest edge of the exclusion box.
      const d = { l: sx - exclusion.x0, r: exclusion.x1 - sx, t: sy - exclusion.y0, b: exclusion.y1 - sy }
      const min = Math.min(d.l, d.r, d.t, d.b)
      if (min === d.l) sx = Math.max(0, exclusion.x0 - 0.02)
      else if (min === d.r) sx = Math.min(1, exclusion.x1 + 0.02)
      else if (min === d.t) sy = Math.max(0, exclusion.y0 - 0.02)
      else sy = Math.min(1, exclusion.y1 + 0.02)
    }
    // Edgeness: 0 near the centre/box, 1 near the container edge. Dark favoured
    // near edges, light favoured near the box, mid fills between; noise keeps
    // the split non-deterministic.
    const edgeness = Math.max(Math.abs(sx - 0.5), Math.abs(sy - 0.5)) * 2
    const noisy = Math.max(0, Math.min(1, edgeness + (Math.random() - 0.5) * 0.6))
    const colorHex = noisy > 0.66 ? 'B8CDDB' : noisy > 0.33 ? '8DB0C5' : '457DA0'
    particles.push({
      sx,
      sy,
      size: 0.7 + Math.random() * Math.random() * 4.2,
      color: hexToRgb(colorHex),
      delay: Math.random() * 900,
      speed: 0.5 + Math.random() * 1.8,
      wobbleAmp: 6 + Math.random() * 14,
      wobbleFreq: 0.002 + Math.random() * 0.003,
      phase: Math.random() * Math.PI * 2,
    })
  }
  return particles
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formOpacity, setFormOpacity] = useState(1)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[] | null>(null)
  const exclusionRef = useRef<ExclusionBox | null>(null)
  const dprRef = useRef(1)
  const glitterRafRef = useRef<number | null>(null)
  const glitterFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const glitterEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const form = formRef.current
    if (!canvas || !container || !form) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateExclusionRect = (w: number, h: number) => {
      const contRect = container.getBoundingClientRect()
      const formRect = form.getBoundingClientRect()
      const margin = 50
      exclusionRef.current = {
        x0: Math.max(0, (formRect.left - contRect.left - margin) / w),
        x1: Math.min(1, (formRect.right - contRect.left + margin) / w),
        y0: Math.max(0, (formRect.top - contRect.top - margin) / h),
        y1: Math.min(1, (formRect.bottom - contRect.top + margin) / h),
      }
    }

    const drawIdle = () => {
      const dpr = dprRef.current
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)
      for (const p of particlesRef.current ?? []) {
        ctx.globalAlpha = 1
        ctx.fillStyle = `rgb(${p.color[0]}, ${p.color[1]}, ${p.color[2]})`
        ctx.beginPath()
        ctx.arc(p.sx * w, p.sy * h, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const resize = () => {
      const rectW = container.clientWidth || 480
      const rectH = container.clientHeight || 600
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dprRef.current = dpr
      const w = Math.max(1, Math.floor(rectW))
      const h = Math.max(1, Math.floor(rectH))
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      updateExclusionRect(w, h)
      if (!particlesRef.current) particlesRef.current = makeParticles(exclusionRef.current)
      drawIdle()
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resizeObserver.observe(form)

    // The design system's fonts/components can settle layout late; recompute
    // the exclusion box (not particle positions) a few times after mount.
    const settleTimers = [150, 400, 900, 1600].map((ms) =>
      setTimeout(() => {
        updateExclusionRect(canvas.width / dprRef.current, canvas.height / dprRef.current)
        drawIdle()
      }, ms),
    )

    return () => {
      resizeObserver.disconnect()
      settleTimers.forEach(clearTimeout)
      if (glitterRafRef.current) cancelAnimationFrame(glitterRafRef.current)
      if (glitterFadeTimerRef.current) clearTimeout(glitterFadeTimerRef.current)
      if (glitterEndTimerRef.current) clearTimeout(glitterEndTimerRef.current)
    }
  }, [])

  const stopGlitter = () => {
    if (glitterRafRef.current) cancelAnimationFrame(glitterRafRef.current)
    if (glitterFadeTimerRef.current) clearTimeout(glitterFadeTimerRef.current)
    if (glitterEndTimerRef.current) clearTimeout(glitterEndTimerRef.current)
    glitterRafRef.current = null

    particlesRef.current = makeParticles(exclusionRef.current)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      const dpr = dprRef.current
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)
      for (const p of particlesRef.current) {
        ctx.globalAlpha = 1
        ctx.fillStyle = `rgb(${p.color[0]}, ${p.color[1]}, ${p.color[2]})`
        ctx.beginPath()
        ctx.arc(p.sx * w, p.sy * h, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  const startGlitter = () => {
    const DURATION = 3000
    // Schedule the fade + reset first so they fire on time even if the canvas
    // drawing below throws.
    glitterFadeTimerRef.current = setTimeout(() => setFormOpacity(0), 20)
    glitterEndTimerRef.current = setTimeout(() => {
      stopGlitter()
      particlesRef.current = null // fresh idle layout after the run completes
      setFormOpacity(1)
      setEmail('')
      setPassword('')
    }, DURATION)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const particles = particlesRef.current ?? makeParticles(exclusionRef.current)
    const dpr = dprRef.current
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    const start = performance.now()
    const cx = w / 2
    const cy = h / 2

    const drawFrame = (now: number) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        const local = elapsed - p.delay
        if (local < 0) continue
        const travelMs = 1600 / p.speed
        const travelT = easeInOut(Math.min(1, local / travelMs))
        const wobble = Math.sin(local * p.wobbleFreq + p.phase) * p.wobbleAmp * (1 - travelT)
        const px = p.sx * w + (cx - p.sx * w) * travelT + wobble
        const py = p.sy * h + (cy - p.sy * h) * travelT + wobble * 0.6
        const fadeIn = Math.min(1, local / 250)
        const fadeOut = 1 - Math.max(0, (travelT - 0.85) / 0.15)
        const alpha = Math.max(0, Math.min(fadeIn, fadeOut))
        if (alpha <= 0) continue
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgb(${p.color[0]}, ${p.color[1]}, ${p.color[2]})`
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => {
      drawFrame(t)
      if (t - start < DURATION) glitterRafRef.current = requestAnimationFrame(loop)
    }
    glitterRafRef.current = requestAnimationFrame(loop)
  }

  const handleSubmit = () => {
    if (busy) return
    setBusy(true)
    setError(false)
    setTimeout(() => {
      const ok = /^[^\s@]+@nhs\.net$/i.test(email.trim()) && password.length > 0
      setBusy(false)
      setError(!ok)
      if (ok) startGlitter()
    }, 500)
  }

  return (
    <div className="SignIn">
      <div className="SignIn__brandPanel">
        <div className="SignIn__brandHeader">
          <SynaneticsLogoWhiteLargeIcon />
        </div>
        <div className="SignIn__brandCopy">
          <h1>Connected care, one clinical record.</h1>
          <p>
            Interoperability for health and social care — bringing data from every system into a single, shared view.
          </p>
        </div>
        <span className="SignIn__brandFooter">NHS-aligned · ISO 27001 · DCB0129 clinically assured</span>
      </div>

      <div className="SignIn__formPanel" ref={containerRef}>
        <canvas ref={canvasRef} className="SignIn__canvas" />
        <div className="SignIn__formCard" ref={formRef} style={{ opacity: formOpacity }}>
          <h2>Sign in</h2>
          <p className="SignIn__formSubtitle">Use your NHS Care Identity credentials.</p>

          {error && (
            <Alert variant="error" description="Check your email address and password, then try again.">
              Sign in failed
            </Alert>
          )}

          <div className="SignIn__fields">
            <TextField label="Email address" value={email} onChange={setEmail} placeholder="name@nhs.net" />
            <PasswordField label="Password" value={password} onChange={setPassword} />

            <div className="SignIn__rememberRow">
              <Checkbox label="Remember me" isSelected={rememberMe} onChange={setRememberMe} />
              <button type="button" className="SignIn__linkButton">
                Forgotten your password?
              </button>
            </div>

            <Button
              variant="primary"
              modifier="standard"
              size="large"
              className="SignIn__submit"
              isDisabled={busy}
              onClick={handleSubmit}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
            <Button variant="secondary" modifier="standard" size="large">
              Sign in with NHS Care Identity
            </Button>
          </div>

          <p className="SignIn__disclaimer">
            Access is monitored and audited. Only view records you are directly involved in caring for.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
