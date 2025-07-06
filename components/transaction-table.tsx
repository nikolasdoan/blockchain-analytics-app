"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Download, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface Transaction {
  chainId: number
  hash: string
  nonce: number
  transactionIndex: number
  fromAddress: string
  toAddress: string
}

interface TransactionTableProps {
  data: Transaction[]
  visible: boolean
  selectedChain: string
}

export function TransactionTable({ data, visible, selectedChain }: TransactionTableProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [visible])

  const filteredData = data.filter(
    (tx) =>
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.fromAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.toAddress.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!visible) return null

  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Chainid is 1
              </Badge>
              <span className="text-sm text-gray-600">
                {paginatedData.length} results displayed (of {filteredData.length.toLocaleString()} total)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Preview Filters & Query
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm">
                Save as View
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium text-gray-700">ChainId</TableHead>
                <TableHead className="font-medium text-gray-700">Hash</TableHead>
                <TableHead className="font-medium text-gray-700">Nonce</TableHead>
                <TableHead className="font-medium text-gray-700">TransactionIndex</TableHead>
                <TableHead className="font-medium text-gray-700">FromAddress</TableHead>
                <TableHead className="font-medium text-gray-700">ToAddress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((transaction, index) => (
                <TableRow
                  key={transaction.hash}
                  className={`transition-all duration-300 ease-in-out hover:bg-gray-50 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <TableCell className="font-medium">{transaction.chainId}</TableCell>
                  <TableCell className="font-mono text-sm">{formatAddress(transaction.hash)}</TableCell>
                  <TableCell>{transaction.nonce.toLocaleString()}</TableCell>
                  <TableCell>{transaction.transactionIndex}</TableCell>
                  <TableCell className="font-mono text-sm">{formatAddress(transaction.fromAddress)}</TableCell>
                  <TableCell className="font-mono text-sm">{formatAddress(transaction.toAddress)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Group By
            </Button>
            <Button variant="outline" size="sm">
              Save as View
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
