"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { useChartData } from "@/lib/useChartData"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  metric: "daily-volume" | "daily-count" | "avg-gas" | "value-buckets" | "hourly-activity" | "top-blocks"
  chain?: number
  from?: string
  to?: string
  chartType?: "line" | "area" | "bar"
  title?: string
}

export default function DynamicLineChart({ metric, chain = 1, from = "", to = "", chartType = "line", title }: Props) {
  const { data, error, isLoading, refresh } = useChartData(metric, chain, from, to)

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading data: {error.message}</p>
          <Button onClick={refresh} variant="outline" className="mt-2 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  // Chart configuration based on metric
  const getChartConfig = () => {
    switch (metric) {
      case "daily-volume":
        return {
          dataKey: "total_eth",
          name: "ETH Volume",
          color: "hsl(var(--chart-1))",
          xAxisKey: "day",
        }
      case "daily-count":
        return {
          dataKey: "txn_count",
          name: "Transaction Count",
          color: "hsl(var(--chart-2))",
          xAxisKey: "day",
        }
      case "avg-gas":
        return {
          dataKey: "avg_gas_price",
          name: "Avg Gas Price (Gwei)",
          color: "hsl(var(--chart-3))",
          xAxisKey: "day",
        }
      case "hourly-activity":
        return {
          dataKey: "txn_count",
          name: "Hourly Transactions",
          color: "hsl(var(--chart-4))",
          xAxisKey: "hour",
        }
      case "top-blocks":
        return {
          dataKey: "tx_count",
          name: "Transactions per Block",
          color: "hsl(var(--chart-5))",
          xAxisKey: "block_number",
        }
      default:
        return {
          dataKey: "value",
          name: "Value",
          color: "hsl(var(--chart-1))",
          xAxisKey: "day",
        }
    }
  }

  const config = getChartConfig()

  const renderChart = () => {
    if (!data || data.length === 0) return <div className="text-center text-gray-500">No data available</div>

    const chartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke={config.color}
              fill={config.color}
              fillOpacity={0.3}
            />
          </AreaChart>
        )

      case "bar":
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={config.dataKey} fill={config.color} />
          </BarChart>
        )

      default:
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey={config.dataKey} stroke={config.color} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        )
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title || config.name}</h3>
        <div className="flex items-center space-x-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ChartContainer
        config={{
          [config.dataKey]: {
            label: config.name,
            color: config.color,
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}
