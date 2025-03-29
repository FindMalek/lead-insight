import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth/server"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="relative min-h-screen">
      <Button
        variant="secondary"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        asChild
      >
        <Link href="/">
          <Icons.chevronLeft className="h-5 w-5 transition-all duration-300 hover:pr-2" />
          <span>Back</span>
        </Link>
      </Button>
      {children}
    </div>
  )
}
