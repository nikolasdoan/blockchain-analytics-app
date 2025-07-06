"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Props {
  metric: string
  setMetric: (metric: string) => void
  chain: number
  setChain: (chain: number) => void
  from: string
  setFrom: (from: string) => void
  to: string
  setTo: (to: string) => void
  chartType: string
  setChartType: (type: string) => void
  onRefresh?: () => void
}

const METRICS = [
  { value: "daily-volume", label: "Daily ETH Volume", description: "Total ETH transferred per day" },
  { value: "daily-count", label: "Daily Transaction Count", description: "Number of transactions per day" },
  { value: "avg-gas", label: "Average Gas Price", description: "Gas price trends over time" },
  { value: "value-buckets", label: "Value Distribution", description: "Transactions by value ranges" },
  { value: "hourly-activity", label: "Hourly Activity", description: "Transaction activity by hour" },
  { value: "top-blocks", label: "Block Analysis", description: "Transaction count per block" },
]

const CHAINS = [
  { id: 1, name: "Ethereum", color: "bg-blue-500" },
  { id: 8453, name: "Base", color: "bg-blue-600" },
  { id: 137, name: "Polygon", color: "bg-purple-500" },
  { id: 42161, name: "Arbitrum", color: "bg-blue-400" },
]

export default function MetricSelector({
  metric,
  setMetric,
  chain,
  setChain,
  from,
  setFrom,
  to,
  setTo,
  chartType,
  setChartType,
  onRefresh,
}: Props) {
  const selectedMetric = METRICS.find((m) => m.value === metric)
  const selectedChain = CHAINS.find((c) => c.id === chain)

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Real-Time Blockchain Analytics</h2>
          <p className="text-gray-600 text-sm">Dynamic aggregations running fresh queries on every request</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="metric">Metric</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {METRICS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <div>
                      <div className="font-medium">{m.label}</div>
                      <div className="text-xs text-gray-500">{m.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chain">Blockchain</Label>
            <Select value={chain.toString()} onValueChange={(value) => setChain(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                {CHAINS.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${c.color}`} />
                      <span>{c.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="from">From Date</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To Date</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              {selectedChain && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${selectedChain.color}`} />
                  <span>{selectedChain.name}</span>
                </Badge>
              )}
              {selectedMetric && <Badge variant="secondary">{selectedMetric.label}</Badge>}
            </div>
          </div>

          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              Refresh All Data
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
