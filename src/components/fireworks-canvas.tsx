"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { playFireworksSound } from "@/lib/music"

type Vec = { x: number; y: number }

class Particle {
  pos: Vec
  vel: Vec
  size = 2
  shrink = 0.97
  resistance = 1
  gravity = 0
  flick = false
  alpha = 1
  fade = 0
  color = 0

  constructor(pos?: Vec) {
    this.pos = { x: pos?.x ?? 0, y: pos?.y ?? 0 }
    this.vel = { x: 0, y: 0 }
  }

  update() {
    this.vel.x *= this.resistance
    this.vel.y *= this.resistance
    this.vel.y += this.gravity
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.size *= this.shrink
    this.alpha -= this.fade
  }

  render(c: CanvasRenderingContext2D) {
    if (!this.exists()) return
    c.save()
    c.globalCompositeOperation = "lighter"
    const x = this.pos.x
    const y = this.pos.y
    const r = this.size / 2
    const g = c.createRadialGradient(x, y, 0.1, x, y, r)
    g.addColorStop(0.1, `rgba(255,255,255,${this.alpha})`)
    g.addColorStop(0.8, `hsla(${this.color}, 100%, 50%, ${this.alpha})`)
    g.addColorStop(1, `hsla(${this.color}, 100%, 50%, 0.1)`)
    c.fillStyle = g
    c.beginPath()
    c.arc(x, y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true)
    c.closePath()
    c.fill()
    c.restore()
  }

  exists() {
    return this.alpha >= 0.1 && this.size >= 1
  }
}

class Rocket extends Particle {
  explosionColor = 0
  constructor(x: number, h: number) {
    super({ x, y: h })
  }
  explode(particles: Particle[], withSound = false) {
    if (withSound) {
      playFireworksSound()
    }
    const count = Math.random() * 10 + 80
    for (let i = 0; i < count; i++) {
      const p = new Particle(this.pos)
      const angle = Math.random() * Math.PI * 2
      const speed = Math.cos((Math.random() * Math.PI) / 2) * 15
      p.vel.x = Math.cos(angle) * speed
      p.vel.y = Math.sin(angle) * speed
      p.size = 10
      p.gravity = 0.2
      p.resistance = 0.92
      p.shrink = Math.random() * 0.05 + 0.93
      p.flick = true
      p.color = this.explosionColor
      p.fade = 0.02 + Math.random() * 0.02
      particles.push(p)
    }
  }
}

export default function FireworksCanvas({
  className,
  autoStart = false,
  density = 1,
  withSound = false,
}: {
  className?: string
  autoStart?: boolean
  density?: number
  withSound?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    canvas.style.width = "100vw"
    canvas.style.height = "100vh"
    canvas.style.background = "transparent"

    let raf = 0
    let launchTimer: number | null = null

    let particles: Particle[] = []
    let rockets: Rocket[] = []
    const MAX_PARTICLES = 450

    function onResize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener("resize", onResize)

    const renderLoop = () => {
      ctx.save()
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = "rgba(0,0,0,0.14)"
      ctx.fillRect(0, 0, width, height)
      ctx.restore()

      const nextRockets: Rocket[] = []
      for (const r of rockets) {
        r.update()
        r.render(ctx)
        const dist = Math.hypot(width - r.pos.x, height - r.pos.y)
        if (r.pos.y < height / 5 || r.vel.y >= 0 || dist < 50 || Math.random() * 100 <= 1) {
          r.explode(particles, withSound)
        } else {
          nextRockets.push(r)
        }
      }
      rockets = nextRockets

      const nextParticles: Particle[] = []
      for (const p of particles) {
        p.update()
        if (p.exists()) {
          p.render(ctx)
          nextParticles.push(p)
        }
      }
      particles = nextParticles
      while (particles.length > MAX_PARTICLES) particles.shift()

      raf = requestAnimationFrame(renderLoop)
    }

    const start = () => {
      if (launchTimer) return
      launchTimer = window.setInterval(() => {
        if (rockets.length < Math.max(6, Math.floor(10 * density))) {
          const r = new Rocket(width / 2 + (Math.random() * width) / 4 - width / 8, height)
          r.explosionColor = Math.floor((Math.random() * 360) / 10) * 10
          r.vel.y = Math.random() * -3 - 4
          r.vel.x = Math.random() * 6 - 3
          r.size = 8
          r.shrink = 0.999
          r.gravity = 0.01
          rockets.push(r)
        }
      }, 800)
      raf = requestAnimationFrame(renderLoop)
    }

    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      if (launchTimer) clearInterval(launchTimer)
      launchTimer = null
    }

    let observer: IntersectionObserver | null = null
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && autoStart) start()
            else stop()
          })
        },
        { threshold: 0.1 },
      )
      observer.observe(canvas)
    } else {
      if (autoStart) start()
    }

    return () => {
      stop()
      window.removeEventListener("resize", onResize)
      observer?.disconnect()
    }
  }, [autoStart, density, withSound])

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 -z-10 block", "mix-blend-normal", className)}
      aria-hidden="true"
    />
  )
}
