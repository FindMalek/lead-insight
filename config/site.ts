import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "LeadInsight",
  description:
    "AI-driven lead management and tracking tool designed to optimize lead engagement and streamline follow-up processes",
  url: "https://lead-insight.undrstnd.dev",
  images: {
    default: "https://lead-insight.undrstnd.dev/og.png",
    notFound: "https://lead-insight.undrstnd.dev/not-found.png",
    logo: "https://emojicdn.elk.sh/🎯?style=twitter",
  },
  links: {
    twitter: "https://twitter.com/undrstndlabs",
    github: "https://github.com/undrstnd-labs/lead-insight",
  },
  author: {
    name: "Undrstnd Labs",
    url: "https://undrstnd.dev",
    email: "malek@undrstnd.dev",
    github: "https://github.com/undrstnd-labs",
  },
  keywords: [
    "Lead Management",
    "AI Lead Processing",
    "Lead Tracking",
    "CSV Processing",
    "Lead Analytics",
    "Sales Automation",
    "Lead Conversion",
    "Customer Engagement",
    "Sales Pipeline",
    "Lead Scoring",
    "Next.js",
    "React",
    "TypeScript",
    "Prisma",
    "TailwindCSS",
    "AI Integration",
    "Business Intelligence",
  ],
}

export const notFoundMetadata = () => {
  return {
    title: "Page not found",
    description: "Page not found",
    openGraph: {
      title: `${siteConfig.name} | Page not found`,
      description: "Page not found",
      images: [
        {
          url: siteConfig.images.notFound,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | Page not found`,
      description: "Page not found",
      images: [siteConfig.images.notFound],
      creator: "@findmalek",
    },
  }
}
