"use client"

import { useEffect, useState } from "react"
import { LeadStatus } from "@prisma/client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const STATUS_COLORS: Record<string, { label: string; color: string }> = {
  NEW: { label: "New", color: "#94a3b8" }, // slate-400
  CONTACTED: { label: "Contacted", color: "#3b82f6" }, // blue-500
  RESPONDED: { label: "Responded", color: "#10b981" }, // emerald-500
  QUALIFIED: { label: "Qualified", color: "#f59e0b" }, // amber-500
  DISQUALIFIED: { label: "Disqualified", color: "#ef4444" }, // red-500
  CONVERTED: { label: "Converted", color: "#8b5cf6" }, // violet-500
}

interface LeadStatusData {
  status: string
  count: number
  color: string
}

interface DashboardLeadStatusChartProps {
  data: Record<string, number>
}

export function DashboardLeadStatusChart({
  data: statusData,
}: DashboardLeadStatusChartProps) {
  const [data, setData] = useState<LeadStatusData[]>([])

  useEffect(() => {
    // Format the data from props for the chart
    const allStatuses = Object.values(LeadStatus) as string[]

    const formattedData = allStatuses.map((status) => {
      const count = statusData[status] || 0
      return {
        status,
        statusName: STATUS_COLORS[status]?.label || status,
        count,
        color: STATUS_COLORS[status]?.color || "#cbd5e1", // Default color
      }
    })

    setData(formattedData)
  }, [statusData])

  return (
    <div>
      <CardHeader>
        <CardTitle>Lead Status Distribution</CardTitle>
        <CardDescription>
          Distribution of leads by current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            status: {
              label: "Status",
              color: "#94a3b8",
            },
          }}
        >
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="statusName"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              width={30}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    Number(value).toLocaleString(),
                    "Leads",
                  ]}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-status)"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.9}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
