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
import { Activity, Database, Zap, TrendingUp, Lock, LockOpen } from "lucide-react"
import { MarketData } from "@/components/market-data"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { scrollToChart } from "@/lib/utils"

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
  isPinned?: boolean
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
  
  // Resizable panels state
  const [topPanelSize, setTopPanelSize] = useState(50)

  // Toggle chart pin function
  const toggleChartPin = (chartId: string) => {
    setActiveCharts(prev => prev.map(chart => {
      if (chart.id === chartId) {
        return { ...chart, isPinned: !chart.isPinned }
      }
      // Unpin other charts when one is pinned
      return { ...chart, isPinned: false }
    }))
  }

  const addChart = (chartRequest: Omit<ChartRequest, 'id' | 'timestamp'>) => {
    const chartId = `chart-${Date.now()}`;
    const newChart: ChartRequest = {
      ...chartRequest,
      id: chartId,
      timestamp: Date.now()
    }
    setActiveCharts((prev: ChartRequest[]) => [...prev, newChart]);
    
    // Wait for chart to be rendered before scrolling
    setTimeout(() => {
      scrollToChart(chartId);
    }, 100);
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
          onPin={() => toggleChartPin(chart.id)}
          isPinned={chart.isPinned}
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
        onPin={() => toggleChartPin(chart.id)}
        isPinned={chart.isPinned}
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

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction="vertical"
          onLayout={(sizes) => {
            const newTopSize = sizes[0];
            setTopPanelSize(newTopSize);
          }}
        >
          {/* Top Half - Scrollable Charts */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">Live Analytics Dashboard</h1>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge 
                      variant="secondary" 
                      className={`${selectedChain === "ethereum" ? "bg-cyan-100 text-cyan-800" : "bg-gray-100 text-gray-600"} cursor-pointer hover:bg-opacity-90`}
                      onClick={() => setSelectedChain("ethereum")}
                    >
                      Ethereum
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={`${selectedChain === "base" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"} cursor-pointer hover:bg-opacity-90`}
                      onClick={() => setSelectedChain("base")}
                    >
                      Base
                    </Badge>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {activeCharts.length} chart{activeCharts.length !== 1 ? 's' : ''} • Fresh data
                </Badge>
              </div>

              {/* Horizontally Scrollable Charts Container */}
              <div className="h-[calc(100%-4rem)] overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide h-full charts-scroll-container">
                  <div className="flex space-x-4 h-full pb-2">
                    {/* Pinned Charts */}
                    {activeCharts.filter(chart => chart.isPinned).map((chart) => (
                      <div 
                        key={chart.id}
                        data-chart-id={chart.id}
                        className="flex-none w-[40%] shadow-lg"
                      >
                        <div className="relative h-full">
                          {renderChart(chart)}
                        </div>
                      </div>
                    ))}
                    
                    {/* Unpinned Charts */}
                    {activeCharts.filter(chart => !chart.isPinned).map((chart) => (
                      <div 
                        key={chart.id}
                        data-chart-id={chart.id}
                        className="flex-none w-[40%]"
                      >
                        <div className="relative h-full">
                          {renderChart(chart)}
                        </div>
                      </div>
                    ))}
                    
                    {activeCharts.length === 0 && (
                      <div className="w-full flex items-center justify-center">
                        <div className="text-center">
                          <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-gray-600">Ask a question to generate charts</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Bottom Half - Market Data Style Info */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full p-6 bg-white overflow-y-auto">
              <MarketData 
                selectedChain={selectedChain}
                data={{
                  price: 56.85,
                  change: 6.15,
                  changePercent: 11.97,
                  volume: 30522988,
                  avgVolume: 10228728,
                  marketCap: 37.12,
                  beta: 1.51,
                  peRatio: 10.08,
                  eps: 5.64,
                  targetEst: 58.69
                }}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
