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
import { Loader2, RefreshCw, Lock, LockOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  metric: "daily-volume" | "daily-count" | "avg-gas" | "value-buckets" | "hourly-activity" | "top-blocks"
  chain?: number
  from?: string
  to?: string
  chartType?: "line" | "area" | "bar"
  title?: string
  onPin?: () => void
  isPinned?: boolean
}

export default function DynamicLineChart({ metric, chain = 1, from = "", to = "", chartType = "line", title, onPin, isPinned }: Props) {
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

    // Calculate domain padding for better fit
    const getAxisDomain = (dataKey: string) => {
      if (!data || data.length === 0) return [0, 100];
      const values = data.map((item: Record<string, any>) => Number(item[dataKey]));
      const min = Math.min(...values);
      const max = Math.max(...values);
      const padding = (max - min) * 0.1; // 10% padding
      return [Math.max(0, min - padding), max + padding];
    }

    const chartProps = {
      data,
      margin: { top: 10, right: 25, left: 10, bottom: 0 },
    }

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={config.xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={getAxisDomain(config.dataKey)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke={config.color}
              fill={config.color}
              fillOpacity={0.3}
              animationDuration={300}
            />
          </AreaChart>
        )

      case "bar":
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={config.xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={getAxisDomain(config.dataKey)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey={config.dataKey} 
              fill={config.color}
              animationDuration={300}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )

      default:
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={config.xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={getAxisDomain(config.dataKey)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey={config.dataKey} 
              stroke={config.color} 
              strokeWidth={2} 
              dot={{ r: 3 }}
              animationDuration={300}
            />
          </LineChart>
        )
    }
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2 max-w-[calc(100%-80px)]">
          <h3 className="text-sm font-semibold truncate">{title || config.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading && <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />}
          {onPin && (
            <Button onClick={onPin} variant="ghost" size="sm" className="h-7 w-7 p-0 flex-shrink-0">
              {isPinned ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
            </Button>
          )}
          <Button onClick={refresh} variant="ghost" size="sm" className="h-7 w-7 p-0 flex-shrink-0">
            <RefreshCw className="w-3 h-3" />
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
        className="p-4 h-[calc(100%-3rem)]"
      >
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </Card>
  )
}
