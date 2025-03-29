import { Metadata } from "next"

import { DashboardBatchOverview } from "@/components/app/dashboard-batch-overview"
import { DashboardLeadMetrics } from "@/components/app/dashboard-lead-metrics"
import { DashboardLeadStatusChart } from "@/components/app/dashboard-lead-status-chart"
import { DashboardRecentImports } from "@/components/app/dashboard-recent-imports"
import { DashboardStatsSummary } from "@/components/app/dashboard-stats-summary"
import { Card } from "@/components/ui/card"

import {
  getBatchStatusCounts,
  getDashboardStats,
  getLeadQualityMetrics,
  getLeadStatusCounts,
  getRecentImports,
} from "@/actions/stats"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Lead Insight Dashboard Overview",
}

export default async function DashboardPage() {
  const [
    dashboardStats,
    leadStatusCounts,
    batchStatusCounts,
    leadQualityMetrics,
    recentImports,
  ] = await Promise.all([
    getDashboardStats(),
    getLeadStatusCounts(),
    getBatchStatusCounts(),
    getLeadQualityMetrics(),
    getRecentImports(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-6">
        <DashboardStatsSummary stats={dashboardStats} />

        <Card>
          <DashboardLeadStatusChart data={leadStatusCounts} />
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <DashboardRecentImports recentImports={recentImports} />
          </Card>

          <Card>
            <DashboardBatchOverview data={batchStatusCounts} />
          </Card>
        </div>

        <Card>
          <DashboardLeadMetrics metrics={leadQualityMetrics} />
        </Card>
      </div>
    </div>
  )
}
