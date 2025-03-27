import Link from "next/link"

import { siteConfig } from "@/config/site"

import { AuthRegisterForm } from "@/components/app/auth-register-form"
import { Icons } from "@/components/shared/icons"

export default function RegisterPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex flex-col items-center gap-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <Icons.logo className="size-6" />
            </div>
            <span className="sr-only">{siteConfig.name}</span>
          </Link>
          <h1 className="text-xl font-bold">Create an account</h1>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="hover:text-primary underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </div>

        <AuthRegisterForm />

        <div className="text-muted-foreground mt-4 text-balance text-center text-xs">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
