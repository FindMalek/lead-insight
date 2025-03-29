"use client"

import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart } from "recharts"

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart"

const STATUS_COLORS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "#94a3b8" }, // slate-400
  PROCESSING: { label: "Processing", color: "#3b82f6" }, // blue-500
  COMPLETED: { label: "Completed", color: "#10b981" }, // emerald-500
  FAILED: { label: "Failed", color: "#ef4444" }, // red-500
}

interface BatchStatusData {
  name: string
  value: number
  color: string
}

interface DashboardBatchOverviewProps {
  data: Record<string, number>
}

export function DashboardBatchOverview({
  data: statusData,
}: DashboardBatchOverviewProps) {
  const [data, setData] = useState<BatchStatusData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Format data for the pie chart
    const formattedData = Object.entries(statusData).map(([status, count]) => ({
      name: STATUS_COLORS[status]?.label || status,
      value: count as number,
      color: STATUS_COLORS[status]?.color || "#cbd5e1", // Default color
    }))

    setData(formattedData)
    setLoading(false)
  }, [statusData])

  if (loading) {
    return (
      <div>
        <CardHeader className="pb-2">
          <CardTitle>Batch Overview</CardTitle>
          <CardDescription>Distribution of batches by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 h-[300px] w-full animate-pulse rounded-md"></div>
        </CardContent>
      </div>
    )
  }

  // Check if we have any data with non-zero values
  const hasData = data.some((item) => item.value > 0)

  return (
    <div>
      <CardHeader className="pb-2">
        <CardTitle>Batch Overview</CardTitle>
        <CardDescription>Distribution of batches by status</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground text-center text-sm">
              No batch data available
            </p>
          </div>
        ) : (
          <ChartContainer
            config={data.reduce(
              (acc, item) => {
                acc[item.name] = {
                  label: item.name,
                  color: item.color,
                }
                return acc
              },
              {} as Record<string, { label: string; color: string }>
            )}
            className="h-[300px]"
          >
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background rounded-lg border p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            <span className="text-xs font-medium">
                              {data.name}
                            </span>
                          </div>
                          <div className="text-right text-xs">
                            <span className="font-medium">{data.value}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend content={<ChartLegendContent verticalAlign="bottom" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </div>
  )
}
