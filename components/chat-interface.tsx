"use client"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface ChatInterfaceProps {
  onInsightGenerated: (insight: any) => void
  onTableToggle: (show: boolean) => void
  onClearCharts?: () => void
}

export function ChatInterface({ onInsightGenerated, onTableToggle, onClearCharts }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{id: string, role: string, content: string}>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: any) => {
    setInput(e.target.value)
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateResponse = (query: string) => {
    const q = query.toLowerCase()
    if (q.includes("gas")) {
      return "I'll analyze gas price patterns across different networks. Ethereum mainnet typically shows higher gas prices (~25 Gwei) compared to L2 solutions like Base (~0.5 Gwei) and Polygon (~30 Gwei for MATIC). Let me show you the trends."
    } else if (q.includes("volume") || q.includes("transaction")) {
      return "I'll show you transaction volume and activity patterns. You can see how transaction volumes vary across different blockchain networks, with L2 solutions typically handling higher transaction counts."
    } else if (q.includes("hourly") || q.includes("activity")) {
      return "Here's the hourly activity analysis showing peak transaction times and network utilization patterns throughout the day."
    }
    return "I'll analyze your blockchain data request and generate the appropriate visualizations showing real-time aggregated data."
  }

  const processUserQuery = (userQuery: string) => {
    console.log("Processing query:", userQuery)
    setIsLoading(true)
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      role: "user", 
      content: userQuery
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // Simulate AI response and trigger charts
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(userQuery)
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
      
      // Trigger chart generation based on query
      const query = userQuery.toLowerCase()
      console.log("🔍 Analyzing query:", query)

      if (
        query.includes("gas") ||
        query.includes("price") ||
        query.includes("fee") ||
        query.includes("gwei")
      ) {
        console.log("🔥 Triggering gas charts")
        onInsightGenerated({
          type: "gas",
          title: "Gas Price Analysis & Trends",
          originalQuery: userQuery,
          data: {
            currentGasPrice: "23.2 Gwei",
            trend: "decreasing",
            savings: "12%",
          },
        })
      } else if (
        query.includes("hourly") ||
        query.includes("activity") ||
        query.includes("patterns")
      ) {
        console.log("⏰ Triggering hourly activity charts")
        onInsightGenerated({
          type: "transactions",
          title: "Hourly Activity Patterns",
          originalQuery: userQuery,
          data: {
            peakHour: "14:00 UTC",
            avgTxPerHour: 12500,
            totalHours: 24,
          },
        })
      } else if (
        query.includes("volume") ||
        query.includes("value")
      ) {
        console.log("💰 Triggering volume charts")
        onInsightGenerated({
          type: "transactions",
          title: "Transaction Volume Analysis",
          originalQuery: userQuery,
          data: {
            totalVolume: "127,450 ETH",
            avgVolume: "18.2 ETH",
            topTransaction: "450 ETH",
          },
        })
      } else if (
        query.includes("transaction") ||
        query.includes("count") ||
        query.includes("tx")
      ) {
        console.log("📊 Triggering transaction charts")
        onInsightGenerated({
          type: "transactions",
          title: "Transaction Analysis & Visualizations",
          originalQuery: userQuery,
          data: {
            totalTransactions: 15727450,
            avgGasPrice: "25.4 Gwei",
            topSender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          },
        })
      } else {
        console.log("🌐 Triggering comprehensive blockchain overview")
        onInsightGenerated({
          type: "transactions",
          title: "Blockchain Data Overview",
          originalQuery: userQuery,
          data: {
            totalTransactions: 15727450,
            totalVolume: "127,450 ETH",
            avgGasPrice: "25.4 Gwei",
            activeAddresses: 89234,
          },
        })
      }
    }, 500) // 500ms delay to simulate processing
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    processUserQuery(input)
    setInput("") // Clear input after submitting
  }

  const quickQuestions = [
    "Show me transaction volume trends across chains",
    "What are gas price patterns on L2s vs mainnet?",
    "Display daily transaction count comparisons",
    "Analyze value distribution in transactions", 
    "Show hourly activity patterns",
    "Compare Ethereum vs Base network metrics"
  ]

  const handleQuickQuestion = (question: string) => {
    processUserQuery(question)
  }

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <h2 className="text-sm font-semibold">Ask about blockchain data</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-gray-500 text-xs">Start a conversation by clicking suggestions below or typing a question</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded-lg ${message.role === "user" ? "bg-blue-50" : "bg-gray-50"}`}
              >
                <div className="text-xs font-medium mb-1">{message.role === "user" ? "You" : "AI"}</div>
                <div className="text-xs">{message.content}</div>
              </div>
            ))}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Horizontally Scrollable Suggestion Strips */}
      <div className="mb-3">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 pb-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-xs px-3 py-1 h-auto bg-transparent flex-shrink-0"
                onClick={() => handleQuickQuestion(question)}
              >
                {question.length > 35 ? question.substring(0, 32) + '...' : question}
              </Button>
            ))}
          </div>
        </div>
        </div>

      {/* Chat Input */}
      <div className="mt-auto">
        <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={handleInputChange}
            placeholder="Ask about blockchain data..."
            className="flex-1 text-xs"
          disabled={isLoading}
        />
          <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
            <Send className="w-3 h-3" />
        </Button>
      </form>
        </div>


    </Card>
  )
}
