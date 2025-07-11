"use client"

import { Home, BarChart3, Star, Clock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatInterface } from "@/components/chat-interface"

interface SidebarProps {
  selectedChain: string
  onChainSelect: (chain: string) => void
  onInsightGenerated: (insight: any) => void
  onTableToggle: (show: boolean) => void
  onClearCharts: () => void
}

export function Sidebar({ selectedChain, onChainSelect, onInsightGenerated, onTableToggle, onClearCharts }: SidebarProps) {


  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          <span className="font-medium text-gray-900">Brian Armstrong</span>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search" className="pl-10 bg-gray-50 border-gray-200" />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘ A</span>
        </div>
      </div>

      <nav className="px-4 space-y-1">
        <Button variant="ghost" className="w-full justify-start">
          <Home className="w-4 h-4 mr-3" />
          Home
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <BarChart3 className="w-4 h-4 mr-3" />
          Views
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Star className="w-4 h-4 mr-3" />
          Favorites
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Clock className="w-4 h-4 mr-3" />
          Recently Opened
        </Button>
      </nav>

      {/* Chat Interface */}
      <div className="flex-1 p-4 overflow-hidden">
        <ChatInterface 
          onInsightGenerated={onInsightGenerated}
          onTableToggle={onTableToggle}
          onClearCharts={onClearCharts}
        />
      </div>


    </div>
  )
}
