import Link from "next/link"

import { siteConfig } from "@/config/site"

import { AnimatedGridPattern } from "@/components/fancy/animated-grid-pattern"
import { HyperText } from "@/components/fancy/hyper-text"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 overflow-hidden bg-accent-foreground/5">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.5}
          duration={3}
          className="text-gray-200 dark:text-gray-800"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="w-full bg-gray-100 px-4 py-2 text-center md:hidden dark:bg-gray-800">
          <div className="flex items-center justify-center gap-1">
            <HyperText
              duration={500}
              delay={6}
              as="div"
              className="text-xs text-gray-600 dark:text-gray-400"
            >
              CURRENTLY IN PRIVATE BETA - BUILT BY
            </HyperText>
            <Link href="https://www.undrstnd.dev">
              <HyperText
                duration={500}
                delay={4}
                as="div"
                className="text-primary text-xs"
              >
                UNDRSTND LABS
              </HyperText>
            </Link>
          </div>
        </div>
        <header className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">{siteConfig.name}</h1>
          </div>
          <div className="hidden items-center justify-center text-xs text-gray-600 md:flex dark:text-gray-400">
            <HyperText
              duration={500}
              delay={6}
              as="div"
              className="hidden text-xs text-gray-600 md:block dark:text-gray-400"
            >
              CURRENTLY IN PRIVATE BETA - BUILT BY
            </HyperText>{" "}
            <Link href="https://www.undrstnd.dev">
              <HyperText
                duration={500}
                delay={4}
                as="div"
                className="text-primary ml-1 hidden text-xs md:block"
              >
                UNDRSTND LABS
              </HyperText>
            </Link>
          </div>
          <div className="flex items-center">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
              <div className="w-full space-y-6 lg:w-1/2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:whitespace-nowrap lg:text-4xl xl:text-5xl">
                  AI Driven Lead Management
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Manage your leads without the enterprise bloat.
                </p>
                <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="bg-background w-full sm:w-auto sm:flex-1 dark:bg-gray-800"
                  />
                  <Button className="w-full sm:w-auto">Join Waitlist</Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:w-1/2">
                <StatCard value="12" label="Properties Managed" />
                <StatCard value="10HRS+" label="Time Saved Monthly" />
                <StatCard value="3" label="Cities Served" />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto w-full px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <Link href="https://www.undrstnd.dev" className="text-sm text-foreground-muted hover:text-primary transition-colors duration-300">
              © {new Date().getFullYear()} Undrstnd Labs. All rights reserved.
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-sm dark:bg-gray-800">
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  )
}
