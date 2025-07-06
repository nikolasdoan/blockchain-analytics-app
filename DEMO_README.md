# Real-Time Blockchain Analytics Demo

## 🚀 Architecture Overview

This demo showcases a **real-time blockchain analytics architecture** with dynamic aggregations, featuring:

### Core Features

- ✅ **No Pre-computed Views**: Every query triggers fresh SQL aggregations
- ✅ **Dynamic API Layer**: Parametrized endpoints that adapt to any metric/chain/timeframe  
- ✅ **Multi-Chain Support**: Ethereum, Base, Polygon, Arbitrum with chain-specific data patterns
- ✅ **Chat-Driven Interface**: Natural language queries trigger dynamic chart generation
- ✅ **Real-Time Updates**: 30-second auto-refresh with SWR for live data feel

## 🎯 Demo Flow

### 1. **Clean Start** 
- Application loads with **NO charts displayed**
- Shows architecture overview cards highlighting the technical approach
- Displays "Ready for Real-Time Analytics" empty state

### 2. **Chat-Driven Analytics**
Ask questions like:
- *"Show me transaction volume trends across chains"*
- *"What are gas price patterns on L2s vs mainnet?"*
- *"Display daily transaction count comparisons"*
- *"Analyze value distribution in transactions"*

### 3. **Dynamic Chart Generation**
Each question triggers:
- **Fresh API calls** to `/api/chart/[metric]?chain=X&from=Y&to=Z`
- **Dynamic SQL aggregations** (simulated with realistic chain-specific data)
- **Contextual chart selection** (line, area, bar charts based on metric type)
- **Multi-chart dashboards** for comprehensive analysis

## 🏗️ Technical Architecture

### API Layer (`/app/api/chart/[metric]/route.ts`)
```typescript
// Parametrized endpoints
GET /api/chart/daily-volume?chain=1&from=2025-01-01&to=2025-01-07
GET /api/chart/avg-gas?chain=8453&from=2025-01-01&to=2025-01-07
GET /api/chart/value-buckets?chain=137&from=2025-01-01&to=2025-01-07

// Supported metrics:
- daily-volume: Transaction volume trends
- daily-count: Transaction count analytics  
- avg-gas: Gas price analysis
- value-buckets: Transaction value distribution
- hourly-activity: Intraday patterns
- top-blocks: Block-level analytics
```

### Frontend Integration (`React + SWR`)
```typescript
// Custom hooks for data fetching
useChartData(metric, chain, from, to) // Single metric
useMultipleMetrics(metrics[], chain, from, to) // Multiple metrics

// Features:
- 30-second auto-refresh
- Error handling & retry logic
- Loading states & smooth UX
- Cache invalidation on parameter changes
```

### Chain-Specific Configurations
```typescript
const CHAIN_CONFIGS = {
  1: { name: "Ethereum", symbol: "ETH", avgBlockTime: 12, baseGasPrice: 25 },
  8453: { name: "Base", symbol: "ETH", avgBlockTime: 2, baseGasPrice: 0.5 },
  137: { name: "Polygon", symbol: "MATIC", avgBlockTime: 2, baseGasPrice: 30 },
  42161: { name: "Arbitrum", symbol: "ETH", avgBlockTime: 0.25, baseGasPrice: 0.1 },
}
```

## 📊 Chart Types & Metrics

### Volume Analytics
- **Area Charts** for transaction volume trends
- **Chain-specific scaling** (Ethereum: 50K+ ETH, Base: 5K+ ETH)
- **Value bucket distribution** showing transaction size patterns

### Gas Price Analysis  
- **Line charts** for gas price evolution
- **L1 vs L2 comparisons** (ETH mainnet ~25 Gwei, Base ~0.5 Gwei)
- **Hourly patterns** showing peak usage times

### Transaction Analytics
- **Bar charts** for hourly activity patterns
- **Line charts** for daily transaction counts  
- **L2 scaling demonstration** (Polygon: 800K+ txns, Ethereum: 100K+ txns)

## 🔄 Real-Time Features

### Auto-Refresh Mechanism
- **SWR integration** with 30-second intervals
- **Background revalidation** for seamless UX
- **Fresh data indicators** showing live updates

### Edge Caching Strategy
```typescript
response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=30")
```
- 60-second edge cache
- 30-second stale-while-revalidate
- Balance between performance and freshness

## 🎮 Interactive Demo

### Try These Queries:
1. **"Show me transaction volume trends"** → Area chart + value buckets
2. **"What are current gas prices?"** → Gas trends + hourly patterns  
3. **"Compare Ethereum vs Base"** → Multi-chain comparison
4. **"Analyze value distribution"** → Transaction size breakdown
5. **"Show hourly activity patterns"** → Intraday transaction flow

### Expected Behavior:
- Charts appear **only after asking questions**
- Each query **clears previous charts** for focused analysis
- **Multiple related charts** generated per query
- **Real-time data refresh** every 30 seconds
- **Chain-specific realistic data** patterns

## 🎯 Architecture Benefits

### 1. **Ultimate Flexibility**
- Any combination of metric/chain/timeframe
- No pre-aggregated materialized views to maintain
- Schema-agnostic query patterns

### 2. **Real-Time Freshness** 
- Every user interaction = fresh SQL aggregation
- No stale data concerns
- Immediate response to network changes

### 3. **Scalable Design**
- Easy to add new chains (just add config)
- Easy to add new metrics (just add route handler)
- Horizontally scalable API layer

### 4. **Performance Optimized**
- Smart edge caching strategy
- SWR for efficient client-side caching
- Async/background updates

### 5. **User-Centric UX**
- Natural language interface
- Contextual chart generation
- Progressive disclosure (no overwhelming dashboards)

## 🚀 Running the Demo

```bash
# Install dependencies
npm install

# Start development server  
npm run dev

# Open browser to http://localhost:3000
```

### Demo Interaction:
1. **Start with clean interface** - no charts visible
2. **Ask questions in chat** - try the quick question buttons
3. **Watch dynamic charts appear** - specific to your query
4. **Observe real-time updates** - data refreshes every 30 seconds
5. **Try different queries** - see how charts adapt to context

## 🎬 Demo Scenarios

### Scenario 1: Gas Price Analysis
**User**: *"What are gas price patterns on L2s vs mainnet?"*
**Result**: 
- Gas price trend chart (Ethereum ~25 Gwei)
- Hourly gas usage patterns  
- Comparative analysis showing L2 efficiency

### Scenario 2: Volume Comparison
**User**: *"Show me transaction volume trends across chains"*  
**Result**:
- Daily volume area chart
- Value distribution breakdown
- Chain-specific volume patterns

### Scenario 3: Activity Patterns
**User**: *"Show hourly activity patterns"*
**Result**:
- 24-hour transaction bar chart
- Peak usage identification
- Network utilization insights

This demo showcases how **every user interaction triggers fresh aggregations**, exactly as outlined in your real-time blockchain analytics proposal! 