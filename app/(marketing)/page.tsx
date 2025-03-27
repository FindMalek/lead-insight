import { MarketingFooter } from "@/components/app/marketing-footer"
import { MarketingHeaderDesktop } from "@/components/app/marketing-header-desktop"
import { MarketingHeaderMobile } from "@/components/app/marketing-header-mobile"
import { MarketingWaitlistForm } from "@/components/app/marketing-waitlist-form"
import { AnimatedGridPattern } from "@/components/fancy/animated-grid-pattern"
import { StatCard } from "@/components/shared/stat-card"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="bg-accent-foreground/5 absolute inset-0 overflow-hidden">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.5}
          duration={3}
          className="text-gray-200 dark:text-gray-800"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <MarketingHeaderMobile />
        <MarketingHeaderDesktop />

        <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
              <MarketingWaitlistForm />

              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-1/2">
                <StatCard value="1" label="Business Managed" />
                <StatCard value="100 HRS+" label="Time Saved Monthly" />
              </div>
            </div>
          </div>
        </main>

        <MarketingFooter />
      </div>
    </div>
  )
}
