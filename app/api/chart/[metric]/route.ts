import { type NextRequest, NextResponse } from "next/server"

// Blockchain network configurations
const CHAIN_CONFIGS = {
  1: { name: "Ethereum", symbol: "ETH", avgBlockTime: 12, baseGasPrice: 25 },
  8453: { name: "Base", symbol: "ETH", avgBlockTime: 2, baseGasPrice: 0.5 },
  137: { name: "Polygon", symbol: "MATIC", avgBlockTime: 2, baseGasPrice: 30 },
  42161: { name: "Arbitrum", symbol: "ETH", avgBlockTime: 0.25, baseGasPrice: 0.1 },
}

// Mock data generator for different metrics with realistic chain-specific variations
function generateMockData(metric: string, chain: number, from: string, to: string) {
  const startDate = new Date(from || "2025-01-01")
  const endDate = new Date(to || "2025-01-07")
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  const chainConfig = CHAIN_CONFIGS[chain as keyof typeof CHAIN_CONFIGS] || CHAIN_CONFIGS[1]
  const data = []

  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dayStr = date.toISOString().split("T")[0]

    switch (metric) {
      case "daily-volume":
        // Chain-specific volume patterns
        const baseVolume = chain === 1 ? 50000 : chain === 8453 ? 5000 : chain === 137 ? 15000 : 8000
        data.push({
          day: dayStr,
          total_eth: (Math.random() * baseVolume + baseVolume * 0.2).toFixed(2),
          chain_id: chain,
          chain_name: chainConfig.name,
        })
        break

      case "daily-count":
        // Higher transaction counts for L2s
        const baseTxCount = chain === 1 ? 100000 : chain === 8453 ? 500000 : chain === 137 ? 800000 : 200000
        data.push({
          day: dayStr,
          txn_count: Math.floor(Math.random() * baseTxCount + baseTxCount * 0.3),
          chain_id: chain,
          chain_name: chainConfig.name,
        })
        break

      case "avg-gas":
        // Chain-specific gas prices
        const gasVariation = Math.random() * 0.4 + 0.8 // 80-120% of base
        data.push({
          day: dayStr,
          avg_gas_price: (chainConfig.baseGasPrice * gasVariation).toFixed(2),
          median_gas_price: (chainConfig.baseGasPrice * gasVariation * 0.9).toFixed(2),
          chain_id: chain,
          chain_name: chainConfig.name,
        })
        break

      case "value-buckets":
        data.push({
          day: dayStr,
          small_tx: Math.floor(Math.random() * 30000 + 20000), // < 0.1 ETH
          medium_tx: Math.floor(Math.random() * 15000 + 5000), // 0.1-1 ETH
          large_tx: Math.floor(Math.random() * 5000 + 1000), // 1-10 ETH
          whale_tx: Math.floor(Math.random() * 500 + 100), // > 10 ETH
          chain_id: chain,
        })
        break

      case "hourly-activity":
        // Generate 24 hours of data for the latest day
        if (i === days) {
          for (let hour = 0; hour < 24; hour++) {
            data.push({
              hour: `${hour.toString().padStart(2, "0")}:00`,
              txn_count: Math.floor(Math.random() * 5000 + 1000),
              avg_gas_price: (Math.random() * 30 + 20).toFixed(1),
              chain_id: chain,
            })
          }
        }
        break

      case "top-blocks":
        data.push({
          day: dayStr,
          block_number: 19000000 + i * 7200, // ~1 block per 12 seconds
          tx_count: Math.floor(Math.random() * 300 + 100),
          gas_used: Math.floor(Math.random() * 30000000 + 15000000),
          chain_id: chain,
        })
        break
    }
  }

  return data
}

export async function GET(request: NextRequest, { params }: { params: { metric: string } }) {
  const { searchParams } = new URL(request.url)
  const metric = params.metric
  const chain = Number.parseInt(searchParams.get("chain") || "1")
  const from = searchParams.get("from") || "2025-01-01"
  const to = searchParams.get("to") || new Date().toISOString().split("T")[0]

  try {
    // Simulate database query time
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 200))

    const data = generateMockData(metric, chain, from, to)

    // Edge caching headers
    const response = NextResponse.json(data)
    response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=30")

    return response
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
