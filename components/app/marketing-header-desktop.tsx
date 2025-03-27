import Link from "next/link"

import { siteConfig } from "@/config/site"

import { HyperText } from "@/components/fancy/hyper-text"
import { Button } from "@/components/ui/button"

export function MarketingHeaderDesktop() {
  return (
    <header className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">{siteConfig.name}</h1>
      </div>
      <div className="text-secondary-foreground/70 hidden items-center justify-center text-xs md:flex ">
        <HyperText
          duration={500}
          delay={6}
          as="div"
          className="hidden text-xs md:block "
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
  )
}
