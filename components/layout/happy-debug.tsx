"use client"

import { useEffect, useRef, useState } from "react"
import { Code, Lock, ShieldAlert, Terminal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function HappyDebug() {
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchText, setGlitchText] = useState(false)
  const [scanlineActive, setScanlineActive] = useState(true)
  const matrixRef = useRef<HTMLCanvasElement>(null)

  // Matrix digital rain effect
  useEffect(() => {
    const canvas = matrixRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = 14
    const columns = canvas.width / fontSize

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height)
    }

    const matrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0f0"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(Math.floor(Math.random() * 94) + 33)
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(matrix, 50)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Enhanced glitch effects
  useEffect(() => {
    // More frequent glitches
    const majorGlitchInterval = setInterval(
      () => {
        setGlitchActive(true)
        setGlitchText(Math.random() > 0.5)

        setTimeout(
          () => {
            setGlitchActive(false)
            setGlitchText(false)
          },
          Math.random() * 400 + 100
        )
      },
      Math.random() * 1000 + 500
    )

    // Micro glitches
    const microGlitchInterval = setInterval(
      () => {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 50)
      },
      Math.random() * 300 + 200
    )

    // Scanline flicker
    const scanlineInterval = setInterval(
      () => {
        setScanlineActive((prev) => !prev)
        setTimeout(() => setScanlineActive(true), 100)
      },
      Math.random() * 5000 + 2000
    )

    return () => {
      clearInterval(majorGlitchInterval)
      clearInterval(microGlitchInterval)
      clearInterval(scanlineInterval)
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-black p-4">
      {/* Matrix digital rain background */}
      <canvas ref={matrixRef} className="fixed inset-0 opacity-40" />

      {/* Scanlines */}
      <div
        className={`pointer-events-none fixed inset-0 ${scanlineActive ? "opacity-20" : "opacity-0"}`}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-full bg-green-500"
            style={{ top: `${i * 2}%` }}
          />
        ))}
      </div>

      <Card
        className={`relative w-full max-w-2xl overflow-hidden border-green-500 bg-black/80 backdrop-blur-sm
        ${glitchActive ? `translate-x-[${Math.random() * 10 - 5}px] translate-y-[${Math.random() * 6 - 3}px]` : ""}
        transition-all duration-100`}
      >
        {/* Glitch lines */}
        {glitchActive && (
          <>
            <div className="absolute left-0 top-[30%] z-20 h-[2px] w-full bg-green-500 opacity-70"></div>
            <div className="absolute left-0 top-[70%] z-20 h-[3px] w-full bg-green-500 opacity-70"></div>
            <div className="absolute left-[20%] top-0 z-20 h-full w-[2px] bg-green-500 opacity-70"></div>
            <div className="absolute left-[80%] top-0 z-20 h-full w-[2px] bg-green-500 opacity-70"></div>
          </>
        )}

        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-green-600 via-green-400 to-green-600"></div>

        <div className="relative z-10 p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-green-600">
                <Terminal className="h-6 w-6 text-black" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                <ShieldAlert className="h-6 w-6 text-black" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-400">
                <Lock className="h-6 w-6 text-black" />
              </div>
            </div>

            <div className="animate-pulse rounded-full border border-green-500 px-3 py-1 font-mono text-sm text-green-500">
              SYSTEM BREACH
            </div>
          </div>

          <div
            className={`relative ${glitchText ? 'before:absolute before:left-[-5px] before:top-[-5px] before:text-blue-500 before:content-["PAY_ME_OR_ELSE"] after:absolute after:left-[5px] after:top-[5px] after:text-red-500 after:content-["PAY_ME_OR_ELSE"]' : ""}`}
          >
            <h1
              className={`mb-6 font-mono text-5xl font-bold text-green-500 md:text-7xl ${glitchActive ? "skew-x-3" : ""} ${glitchText ? "opacity-90" : ""}`}
            >
              PAY ME OR ELSE
            </h1>
          </div>

          <div className="space-y-4 font-mono text-green-300">
            <p className="relative overflow-hidden text-xl">
              <span className={glitchActive ? "hidden" : ""}>
                Please pay me or I won&apos;t bring the website up and I will do
                bad stuff with your data.
              </span>
              {glitchActive && (
                <span className="text-red-400">ERR0R: SYST3M C0MPROMI5ED</span>
              )}
            </p>

            <div className="rounded-lg border border-green-500/30 bg-green-950/30 p-4">
              <h2 className="mb-2 flex items-center text-lg font-medium text-green-400">
                <Code className="mr-2 h-5 w-5" />
                <span>CONSEQUENCES:</span>
              </h2>
              <ul className="list-none space-y-2 text-green-400">
                {[
                  "$ Website will remain down",
                  "$ Data will be compromised",
                  "$ Security measures will be disabled",
                  "$ Unauthorized access will be granted",
                  "$ Backup systems will be corrupted",
                ].map((item, i) => (
                  <li
                    key={i}
                    className={`${glitchActive && Math.random() > 0.7 ? "text-red-400" : ""}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              variant="outline"
              className="border-green-500 font-mono text-green-500 hover:bg-green-950 hover:text-green-400"
              onClick={() => window.location.reload()}
            >
              PAY NOW
            </Button>

            <Button className="bg-gradient-to-r from-green-600 to-green-500 font-mono text-black hover:from-green-700 hover:to-green-600">
              IGNORE AT YOUR OWN RISK
            </Button>
          </div>

          <div className="mt-6 border-t border-green-500/30 pt-4 font-mono text-sm text-green-500">
            <div className="flex items-center">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
              CONTACT:{" "}
              <span className="ml-2 text-green-400">hi@findmalek.com</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
