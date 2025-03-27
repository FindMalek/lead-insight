import Link from "next/link"

import { HyperText } from "@/components/fancy/hyper-text"

export function MarketingHeaderMobile() {
  return (
    <div className="bg-muted w-full px-4 py-2 text-center md:hidden ">
      <div className="flex items-center justify-center gap-1">
        <HyperText
          duration={500}
          delay={6}
          as="div"
          className="text-secondary-foreground/70 text-xs"
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
  )
}
