"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { useChartData } from "@/lib/useChartData"
import { Loader2, RefreshCw, Lock, LockOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  chain?: number
  from?: string
  to?: string
  onPin?: () => void
  isPinned?: boolean
}

export default function ValueBucketsChart({ chain = 1, from = "", to = "", onPin, isPinned }: Props) {
  const { data, error, isLoading, refresh } = useChartData("value-buckets", chain, from, to)

  if (error) {
    return (
      <Card className="h-full">
        <div className="text-center text-red-600 p-4">Error loading data</div>
      </Card>
    )
  }

  // Calculate total for each day to set proper Y-axis domain
  const getMaxTotal = () => {
    if (!data) return 0;
    return Math.max(...data.map((day: any) => 
      (day.small_tx || 0) + 
      (day.medium_tx || 0) + 
      (day.large_tx || 0) + 
      (day.whale_tx || 0)
    ));
  }

  const maxTotal = getMaxTotal();
  const yAxisDomain = [0, Math.ceil(maxTotal * 1.1)]; // Add 10% padding

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2 max-w-[calc(100%-80px)]">
          <h3 className="text-sm font-semibold truncate">Transaction Value Distribution</h3>
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
        className="p-4 h-[calc(100%-3rem)]"
      >
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart 
              data={data || []}
              margin={{ top: 10, right: 25, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={yAxisDomain}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '12px',
                  paddingTop: '0px',
                  paddingBottom: '0px'
                }}
                iconSize={8}
                verticalAlign="top"
                height={36}
              />
              <Bar 
                dataKey="small_tx" 
                stackId="a" 
                fill="var(--color-small_tx)"
                radius={[0, 0, 0, 0]}
                animationDuration={300}
              />
              <Bar 
                dataKey="medium_tx" 
                stackId="a" 
                fill="var(--color-medium_tx)"
                radius={[0, 0, 0, 0]}
                animationDuration={300}
              />
              <Bar 
                dataKey="large_tx" 
                stackId="a" 
                fill="var(--color-large_tx)"
                radius={[0, 0, 0, 0]}
                animationDuration={300}
              />
              <Bar 
                dataKey="whale_tx" 
                stackId="a" 
                fill="var(--color-whale_tx)"
                radius={[4, 4, 0, 0]}
                animationDuration={300}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </Card>
  )
}
