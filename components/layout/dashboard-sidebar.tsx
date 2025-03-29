"use client"

import * as React from "react"

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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Icons.dashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: Icons.lifecycle,
    },
    {
      title: "Analytics",
      url: "#",
      icon: Icons.barChart,
    },
    {
      title: "Projects",
      url: "#",
      icon: Icons.folder,
    },
    {
      title: "Team",
      url: "#",
      icon: Icons.users,
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
      url: "#",
      icon: Icons.settings,
    },
  ],
}

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Icons.logo className="h-5 w-5" />
                <span className="text-base font-semibold">
                  {siteConfig.name}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={data.navMain} />
        <DashboardNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
