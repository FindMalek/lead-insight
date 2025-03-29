import {
  BarChartIcon,
  CheckCircleIcon,
  FolderIcon,
  UsersIcon,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStatsProps {
  stats: {
    totalLeads: number
    totalBatches: number
    recentlyConverted: number
    totalImports: number
  }
}

export function DashboardStatsSummary({ stats }: DashboardStatsProps) {
  const { totalLeads, totalBatches, recentlyConverted, totalImports } = stats

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Leads"
        value={totalLeads.toLocaleString()}
        description="Total leads in database"
        icon={<UsersIcon className="text-muted-foreground h-4 w-4" />}
      />
      <StatCard
        title="Active Batches"
        value={totalBatches.toLocaleString()}
        description="Imported data batches"
        icon={<FolderIcon className="text-muted-foreground h-4 w-4" />}
      />
      <StatCard
        title="Conversions"
        value={recentlyConverted.toLocaleString()}
        description="Converted leads"
        icon={<CheckCircleIcon className="text-muted-foreground h-4 w-4" />}
      />
      <StatCard
        title="Total Imports"
        value={totalImports.toLocaleString()}
        description="Completed imports"
        icon={<BarChartIcon className="text-muted-foreground h-4 w-4" />}
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  )
}
