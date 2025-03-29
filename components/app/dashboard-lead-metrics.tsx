"use client"

import { useEffect, useState } from "react"
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

interface LeadMetricsData {
  category: string
  value: number
  description: string
}

interface LeadQualityMetrics {
  businessPercentage: number
  withEmailPercentage: number
  withPhonePercentage: number
  withWebsitePercentage: number
  verifiedPercentage: number
}

interface DashboardLeadMetricsProps {
  metrics: LeadQualityMetrics
}

export function DashboardLeadMetrics({ metrics }: DashboardLeadMetricsProps) {
  const [data, setData] = useState<LeadMetricsData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const formattedData = [
      {
        category: "Business",
        value: metrics.businessPercentage || 0,
        description: "Business Accounts",
      },
      {
        category: "Email",
        value: metrics.withEmailPercentage || 0,
        description: "Leads with Email",
      },
      {
        category: "Phone",
        value: metrics.withPhonePercentage || 0,
        description: "Leads with Phone",
      },
      {
        category: "Website",
        value: metrics.withWebsitePercentage || 0,
        description: "Leads with Website",
      },
      {
        category: "Verified",
        value: metrics.verifiedPercentage || 0,
        description: "Verified Accounts",
      },
    ]

    setData(formattedData)
    setLoading(false)
  }, [metrics])

  if (loading) {
    return (
      <div className="p-6">
        <CardHeader className="pb-2">
          <CardTitle>Lead Quality Metrics</CardTitle>
          <CardDescription>
            Key metrics about lead quality and engagement potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 w-full animate-pulse rounded-md"></div>
        </CardContent>
      </div>
    )
  }

  return (
    <div>
      <CardHeader className="pb-2">
        <CardTitle>Lead Quality Metrics</CardTitle>
        <CardDescription>
          Key metrics about lead quality and engagement potential
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Percentage of leads with attributes
          </span>
        </div>
        <ChartContainer
          config={{
            metric: {
              label: "Metric",
              color: "#3b82f6",
            },
          }}
        >
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 20, bottom: 30 }}
            layout="vertical"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              unit="%"
            />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              width={80}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value}%`, "of leads"]}
                />
              }
            />
            <Bar
              dataKey="value"
              fill="var(--color-metric)"
              radius={[0, 4, 4, 0]}
              barSize={30}
              label={{
                position: "right",
                formatter: (value: number) => `${value.toFixed(1)}%`,
                fontSize: 12,
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
