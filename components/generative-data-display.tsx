"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, PieChart } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface GenerativeDataDisplayProps {
  insight: any
  selectedChain: string
}

export function GenerativeDataDisplay({ insight, selectedChain }: GenerativeDataDisplayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    console.log("Insight received:", insight) // Debug log
    if (insight) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [insight])

  if (!insight) {
    return null
  }

  // Mock chart data for different visualization types
  const transactionVolumeData = [
    { time: "00:00", transactions: 1200, gasPrice: 25 },
    { time: "04:00", transactions: 800, gasPrice: 22 },
    { time: "08:00", transactions: 2100, gasPrice: 28 },
    { time: "12:00", transactions: 3200, gasPrice: 35 },
    { time: "16:00", transactions: 2800, gasPrice: 32 },
    { time: "20:00", transactions: 1900, gasPrice: 27 },
  ]

  const topAddressesData = [
    { address: "0xd8dA...96045", transactions: 1250, percentage: 35 },
    { address: "0x742d...35Cc", transactions: 890, percentage: 25 },
    { address: "0x28C6...3b03", transactions: 650, percentage: 18 },
    { address: "0x1f9840...f334", transactions: 420, percentage: 12 },
    { address: "Others", transactions: 360, percentage: 10 },
  ]

  const gasPriceHistoryData = [
    { date: "Jan 1", gasPrice: 45, baseFee: 35, priorityFee: 10 },
    { date: "Jan 2", gasPrice: 38, baseFee: 30, priorityFee: 8 },
    { date: "Jan 3", gasPrice: 42, baseFee: 33, priorityFee: 9 },
    { date: "Jan 4", gasPrice: 28, baseFee: 22, priorityFee: 6 },
    { date: "Jan 5", gasPrice: 25, baseFee: 20, priorityFee: 5 },
    { date: "Jan 6", gasPrice: 23, baseFee: 18, priorityFee: 5 },
  ]

  const transactionTypesData = [
    { name: "DEX Swaps", value: 45, color: "#3b82f6" },
    { name: "NFT Trades", value: 25, color: "#10b981" },
    { name: "Token Transfers", value: 20, color: "#f59e0b" },
    { name: "Contract Calls", value: 10, color: "#ef4444" },
  ]

  const renderTransactionCharts = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h4 className="text-lg font-semibold">Transaction Volume (24h)</h4>
          </div>
          <ChartContainer
            config={{
              transactions: {
                label: "Transactions",
                color: "hsl(var(--chart-1))",
              },
              gasPrice: {
                label: "Gas Price (Gwei)",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="transactions"
                  stroke="var(--color-transactions)"
                  fill="var(--color-transactions)"
                  fillOpacity={0.3}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gasPrice"
                  stroke="var(--color-gasPrice)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-5 h-5 text-green-500" />
            <h4 className="text-lg font-semibold">Transaction Types</h4>
          </div>
          <ChartContainer
            config={{
              value: {
                label: "Percentage",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={transactionTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {transactionTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-gray-600">{data.value}% of transactions</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-purple-500" />
          <h4 className="text-lg font-semibold">Top Active Addresses</h4>
        </div>
        <ChartContainer
          config={{
            transactions: {
              label: "Transactions",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topAddressesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="address" type="category" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="transactions" fill="var(--color-transactions)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>
    </div>
  )

  const renderGasCharts = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingDown className="w-5 h-5 text-green-500" />
          <h4 className="text-lg font-semibold">Gas Price History (7 days)</h4>
        </div>
        <ChartContainer
          config={{
            gasPrice: {
              label: "Total Gas Price",
              color: "hsl(var(--chart-1))",
            },
            baseFee: {
              label: "Base Fee",
              color: "hsl(var(--chart-2))",
            },
            priorityFee: {
              label: "Priority Fee",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gasPriceHistoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="gasPrice" stroke="var(--color-gasPrice)" strokeWidth={3} dot={{ r: 4 }} />
              <Line
                type="monotone"
                dataKey="baseFee"
                stroke="var(--color-baseFee)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="priorityFee"
                stroke="var(--color-priorityFee)"
                strokeWidth={2}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <h4 className="text-lg font-semibold">Gas Price Distribution</h4>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Low (0-20 Gwei)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medium (20-40 Gwei)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/5 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">20%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">High (40+ Gwei)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/20 h-2 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h4 className="text-lg font-semibold">Optimal Transaction Times</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Best Time</p>
                <p className="text-sm text-green-600">2:00 AM - 6:00 AM UTC</p>
              </div>
              <Badge className="bg-green-100 text-green-800">-30% Gas</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">Moderate</p>
                <p className="text-sm text-yellow-600">6:00 AM - 2:00 PM UTC</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-800">Peak Hours</p>
                <p className="text-sm text-red-600">2:00 PM - 10:00 PM UTC</p>
              </div>
              <Badge className="bg-red-100 text-red-800">+50% Gas</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderMetricCards = () => {
    if (!insight?.data) {
      return null
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {insight.type === "transactions" && (
          <>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">
                    {insight.data.totalTransactions ? "Total Transactions" : 
                     insight.data.peakHour ? "Peak Hour" :
                     insight.data.totalVolume ? "Total Volume" : "Metric"}
                  </p>
                  <p className="text-2xl font-bold">
                    {insight.data.totalTransactions 
                      ? (typeof insight.data.totalTransactions === 'number' 
                          ? insight.data.totalTransactions.toLocaleString() 
                          : insight.data.totalTransactions)
                      : insight.data.peakHour || insight.data.totalVolume || "N/A"}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">
                    {insight.data.avgGasPrice ? "Avg Gas Price" :
                     insight.data.avgTxPerHour ? "Avg Tx/Hour" :
                     insight.data.avgVolume ? "Avg Volume" : "Secondary Metric"}
                  </p>
                  <p className="text-2xl font-bold">
                    {insight.data.avgGasPrice ||
                     (insight.data.avgTxPerHour ? insight.data.avgTxPerHour.toLocaleString() : null) ||
                     insight.data.avgVolume ||
                     insight.data.activeAddresses?.toLocaleString() ||
                     "N/A"}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">
                    {insight.data.topSender ? "Top Sender" :
                     insight.data.totalHours ? "Time Period" :
                     insight.data.topTransaction ? "Top Transaction" : "Additional Info"}
                  </p>
                  <p className="text-sm font-mono">
                    {insight.data.topSender 
                      ? `${insight.data.topSender.slice(0, 10)}...`
                      : insight.data.totalHours 
                        ? `${insight.data.totalHours}h`
                        : insight.data.topTransaction || "N/A"}
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}

        {insight.type === "gas" && (
          <>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Current Gas Price</p>
                  <p className="text-2xl font-bold">{insight.data.currentGasPrice || "N/A"}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                {(insight.data.trend === "decreasing") ? (
                  <TrendingDown className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="text-sm text-gray-600">Trend</p>
                  <Badge variant={(insight.data.trend === "decreasing") ? "default" : "destructive"}>
                    {insight.data.trend || "stable"}
                  </Badge>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Potential Savings</p>
                  <p className="text-2xl font-bold text-green-600">{insight.data.savings || "0%"}</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">{insight.title}</h3>
        <Badge variant="outline" className="mb-4">
          {selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)} Network
        </Badge>
      </div>

      {renderMetricCards()}

      <div
        className={`transition-all duration-700 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        {insight.type === "transactions" && renderTransactionCharts()}
        {insight.type === "gas" && renderGasCharts()}
      </div>
    </div>
  )
}
