"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { useChartData } from "@/lib/useChartData"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  chain?: number
  from?: string
  to?: string
}

export default function ValueBucketsChart({ chain = 1, from = "", to = "" }: Props) {
  const { data, error, isLoading, refresh } = useChartData("value-buckets", chain, from, to)

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">Error loading data</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Transaction Value Distribution</h3>
        <div className="flex items-center space-x-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ChartContainer
        config={{
          small_tx: {
            label: "< 0.1 ETH",
            color: "hsl(var(--chart-1))",
          },
          medium_tx: {
            label: "0.1-1 ETH",
            color: "hsl(var(--chart-2))",
          },
          large_tx: {
            label: "1-10 ETH",
            color: "hsl(var(--chart-3))",
          },
          whale_tx: {
            label: "> 10 ETH",
            color: "hsl(var(--chart-4))",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="small_tx" stackId="a" fill="var(--color-small_tx)" />
            <Bar dataKey="medium_tx" stackId="a" fill="var(--color-medium_tx)" />
            <Bar dataKey="large_tx" stackId="a" fill="var(--color-large_tx)" />
            <Bar dataKey="whale_tx" stackId="a" fill="var(--color-whale_tx)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}
