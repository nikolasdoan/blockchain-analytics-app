"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, DollarSign, Clock } from "lucide-react"

interface MarketDataProps {
  selectedChain: string
  data: {
    price?: number
    change?: number
    changePercent?: number
    volume?: number
    avgVolume?: number
    marketCap?: number
    beta?: number
    peRatio?: number
    eps?: number
    targetEst?: number
  }
}

export function MarketData({ selectedChain, data }: MarketDataProps) {
  return (
    <div className="space-y-6">
      {/* Price Header */}
      <div>
        <div className="flex items-baseline space-x-2">
          <h2 className="text-3xl font-bold">{data.price?.toFixed(2) || '0.00'}</h2>
          <div className={`flex items-center space-x-1 ${data.changePercent && data.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>+{data.change?.toFixed(2)}</span>
            <span>(+{data.changePercent?.toFixed(2)}%)</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">As of {new Date().toLocaleTimeString()}. Market Open.</p>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-4 gap-x-12 gap-y-4 text-sm">
        <div>
          <p className="text-gray-600">Previous Close</p>
          <p className="font-medium">{(data.price! - data.change!).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Day's Range</p>
          <p className="font-medium">{(data.price! - 2).toFixed(2)} - {(data.price! + 1).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Market Cap</p>
          <p className="font-medium">{data.marketCap?.toFixed(2)}B</p>
        </div>
        <div>
          <p className="text-gray-600">Earnings Date</p>
          <p className="font-medium">Jul 10, 2025</p>
        </div>
        <div>
          <p className="text-gray-600">Open</p>
          <p className="font-medium">{(data.price! - data.change!).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">52 Week Range</p>
          <p className="font-medium">34.74 - 69.98</p>
        </div>
        <div>
          <p className="text-gray-600">Beta (5Y Monthly)</p>
          <p className="font-medium">{data.beta?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Forward Dividend & Yield</p>
          <p className="font-medium">0.75 (1.53%)</p>
        </div>
        <div>
          <p className="text-gray-600">Volume</p>
          <p className="font-medium">{data.volume?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Avg. Volume</p>
          <p className="font-medium">{data.avgVolume?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">PE Ratio (TTM)</p>
          <p className="font-medium">{data.peRatio?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Ex-Dividend Date</p>
          <p className="font-medium">Jul 31, 2025</p>
        </div>
        <div>
          <p className="text-gray-600">Bid</p>
          <p className="font-medium">{data.price?.toFixed(2)} x 600</p>
        </div>
        <div>
          <p className="text-gray-600">Ask</p>
          <p className="font-medium">{(data.price! + 0.02).toFixed(2)} x 200</p>
        </div>
        <div>
          <p className="text-gray-600">EPS (TTM)</p>
          <p className="font-medium">{data.eps?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">1y Target Est</p>
          <p className="font-medium">{data.targetEst?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
} 