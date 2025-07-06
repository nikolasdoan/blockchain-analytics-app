"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { GenerativeDataDisplay } from "@/components/generative-data-display"
import { TransactionTable } from "@/components/transaction-table"
import { mockTransactionData } from "@/lib/mock-data"
import DynamicLineChart from "@/components/DynamicLineChart"
import ValueBucketsChart from "@/components/ValueBucketsChart"
import MetricSelector from "@/components/MetricSelector"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Database, Zap, TrendingUp } from "lucide-react"

interface ChartRequest {
  id: string
  type: 'metric' | 'value-buckets' | 'multi-metric'
  metric?: string
  metrics?: string[]
  chain: number
  from: string
  to: string
  chartType: string
  title: string
  timestamp: number
}

export default function BlockchainAnalytics() {
  const [selectedChain, setSelectedChain] = useState("ethereum")
  const [currentInsight, setCurrentInsight] = useState<any>(null)
  const [showTable, setShowTable] = useState(false)
  
  // Dynamic charts state - initially empty
  const [activeCharts, setActiveCharts] = useState<ChartRequest[]>([])
  
  // Default parameters for new charts
  const [defaultChain] = useState(1)
  const [defaultFrom] = useState("2025-01-01")
  const [defaultTo] = useState("2025-01-07")

  const addChart = (chartRequest: Omit<ChartRequest, 'id' | 'timestamp'>) => {
    const newChart: ChartRequest = {
      ...chartRequest,
      id: `chart-${Date.now()}`,
      timestamp: Date.now()
    }
    setActiveCharts((prev: ChartRequest[]) => [...prev, newChart])
  }

  const clearCharts = () => {
    setActiveCharts([])
    setCurrentInsight(null)
    setShowTable(false)
  }

  const handleChartRequest = (type: string, userQuery: string) => {
    console.log("🎯 Chart request triggered:", type, userQuery)
    
    // Clear previous charts for new analysis
    setActiveCharts([])
    setShowTable(true) // Always show table with charts
    
    if (type === 'gas') {
      console.log("📊 Adding gas charts...")
      addChart({
        type: 'metric',
        metric: 'avg-gas',
        chain: defaultChain,
        from: defaultFrom,
        to: defaultTo,
        chartType: 'line',
        title: 'Gas Price Trends - L1 vs L2 Networks'
      })
      
      addChart({
        type: 'metric',
        metric: 'hourly-activity',
        chain: defaultChain,
        from: defaultFrom,
        to: defaultTo,
        chartType: 'bar',
        title: 'Hourly Gas Usage Patterns'
      })
    } else if (type === 'transactions') {
      console.log("📊 Adding transaction charts...")
      if (userQuery.includes('volume') || userQuery.includes('value')) {
        addChart({
          type: 'metric',
          metric: 'daily-volume',
          chain: defaultChain,
          from: defaultFrom,
          to: defaultTo,
          chartType: 'area',
          title: 'Daily Transaction Volume (ETH)'
        })
        
        addChart({
          type: 'value-buckets',
          chain: defaultChain,
          from: defaultFrom,
          to: defaultTo,
          chartType: 'bar',
          title: 'Transaction Value Distribution'
        })
      } else if (userQuery.includes('hourly') || userQuery.includes('activity')) {
        addChart({
          type: 'metric',
          metric: 'hourly-activity',
          chain: defaultChain,
          from: defaultFrom,
          to: defaultTo,
          chartType: 'bar',
          title: 'Hourly Transaction Activity Patterns'
        })
        
        addChart({
          type: 'metric',
          metric: 'daily-count',
          chain: defaultChain,
          from: defaultFrom,
          to: defaultTo,
          chartType: 'line',
          title: 'Daily Transaction Count Trends'
        })
      } else {
        addChart({
          type: 'metric',
          metric: 'daily-count',
          chain: defaultChain,
          from: defaultFrom,
          to: defaultTo,
          chartType: 'line',
          title: 'Daily Transaction Count'
        })
        
        addChart({
          type: 'metric',
          metric: 'daily-volume',
          chain: defaultChain,
          from: defaultFrom,
          to: defaultTo,
          chartType: 'area',
          title: 'Transaction Volume Analysis'
        })
      }
    } else {
      // Default comprehensive view
      console.log("📊 Adding comprehensive charts...")
      addChart({
        type: 'metric',
        metric: 'daily-volume',
        chain: defaultChain,
        from: defaultFrom,
        to: defaultTo,
        chartType: 'area',
        title: 'Transaction Volume Trends'
      })
      
      addChart({
        type: 'metric',
        metric: 'daily-count',
        chain: defaultChain,
        from: defaultFrom,
        to: defaultTo,
        chartType: 'line',
        title: 'Transaction Count Analysis'
      })
      
      addChart({
        type: 'value-buckets',
        chain: defaultChain,
        from: defaultFrom,
        to: defaultTo,
        chartType: 'bar',
        title: 'Value Distribution Analysis'
      })
    }
    
    console.log("✅ Charts added, total active:", activeCharts.length + 1)
  }

  const renderChart = (chart: ChartRequest) => {
    if (chart.type === 'value-buckets') {
      return (
        <ValueBucketsChart 
          chain={chart.chain} 
          from={chart.from} 
          to={chart.to} 
        />
      )
    }
    
    return (
      <DynamicLineChart
        metric={chart.metric as any}
        chain={chart.chain}
        from={chart.from}
        to={chart.to}
        chartType={chart.chartType as any}
        title={chart.title}
      />
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        selectedChain={selectedChain} 
        onChainSelect={setSelectedChain}
        onInsightGenerated={(insight) => {
          console.log("🎯 Main page received insight:", insight)
          setCurrentInsight(insight)
          handleChartRequest(insight.type, insight.originalQuery || '')
        }}
        onTableToggle={setShowTable}
        onClearCharts={clearCharts}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Real-Time Blockchain Analytics</h1>
              <p className="text-gray-600 mt-1">Dynamic aggregations • Fresh queries every time • No pre-computed views</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <Badge variant="outline">
                <Database className="w-3 h-3 mr-1" />
                Dynamic SQL
              </Badge>
            </div>
          </div>

          {/* Architecture Overview - Always visible */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Parametrized APIs</p>
                  <p className="text-sm text-gray-600">/api/chart/[metric]?chain=1&from=...&to=...</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Fresh Aggregations</p>
                  <p className="text-sm text-gray-600">Real-time SQL queries, no materialized views</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">Dynamic Charts</p>
                  <p className="text-sm text-gray-600">React + SWR with 30s auto-refresh</p>
                </div>
              </div>
            </Card>
          </div>



          {/* Debug Test Buttons - Remove in production */}
          {process.env.NODE_ENV === "development" && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <h3 className="text-sm font-semibold mb-2">🛠️ Debug Test Buttons</h3>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    console.log("🧪 Testing hourly activity charts")
                    handleChartRequest("transactions", "show hourly activity patterns")
                  }}
                >
                  Test Hourly Charts
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    console.log("🧪 Testing gas charts")
                    handleChartRequest("gas", "gas prices")
                  }}
                >
                  Test Gas Charts
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    console.log("🧪 Testing volume charts")
                    handleChartRequest("transactions", "transaction volume")
                  }}
                >
                  Test Volume Charts
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={clearCharts}
                >
                  Clear All
                </Button>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Active charts: {activeCharts.length} | Show table: {showTable.toString()}
              </div>
            </Card>
          )}

          {/* Empty State - Show when no charts */}
          {activeCharts.length === 0 && (
            <Card className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready for Real-Time Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Ask questions about blockchain data to see dynamic charts generated in real-time.
                  Each query triggers fresh SQL aggregations - no pre-computed materialized views!
                </p>
                <div className="text-sm text-gray-500">
                  <p>Try asking: "Show me transaction volume trends" or "What are current gas prices?"</p>
                </div>
              </div>
            </Card>
          )}

          {/* Dynamic Charts - Only show when requested */}
          {activeCharts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Live Analytics Dashboard</h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {activeCharts.length} chart{activeCharts.length !== 1 ? 's' : ''} • Fresh data
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeCharts.map(renderChart)}
              </div>
            </div>
          )}

          {/* AI Generated Insights */}
          {currentInsight && (
            <GenerativeDataDisplay insight={currentInsight} selectedChain={selectedChain} />
          )}

          {/* Transaction Table - Only show when requested */}
          {showTable && (
            <TransactionTable data={mockTransactionData} visible={showTable} selectedChain={selectedChain} />
          )}
        </div>
      </div>
    </div>
  )
}
