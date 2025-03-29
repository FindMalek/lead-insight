"use client"

import * as React from "react"
import Link from "next/link"

import { User as UserType } from "@/types/dashboard"

import { siteConfig } from "@/config/site"

import { DashboardNavMain } from "@/components/layout/dashboard-nav-main"
import { DashboardNavSecondary } from "@/components/layout/dashboard-nav-secondary"
import { DashboardNavUser } from "@/components/layout/dashboard-nav-user"
import { Icons } from "@/components/shared/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Icons.dashboard,
    },
    {
      title: "Leads",
      url: "/dashboard/leads",
      icon: Icons.users,
    },
    {
      title: "Batches",
      url: "/dashboard/batches",
      icon: Icons.databaseZap,
    },
    {
      title: "Imports",
      url: "/dashboard/imports",
      icon: Icons.trendingUp,
    },
    {
      title: "Tags",
      url: "/dashboard/tags",
      icon: Icons.badgeCheck,
    },
    {
      title: "Campaigns",
      url: "/dashboard/campaigns",
      icon: Icons.mail,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: Icons.barChart,
    },
  ],
  navSecondary: [
    {
      title: "Search",
      url: "#",
      icon: Icons.search,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Icons.settings,
    },
  ],
}

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserType
}

export function DashboardSidebar({ user, ...props }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Icons.logo className="h-5 w-5" />
                <span className="text-base font-semibold">
                  {siteConfig.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={data.navMain} />
        <DashboardNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
