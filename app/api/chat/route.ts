import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are a blockchain data analyst assistant. You help users understand and analyze blockchain transaction data.
    
    When users ask about blockchain data, always provide helpful insights about:
    - Transaction volumes and patterns
    - Gas price trends and optimization
    - Address activity and top performers
    - Network statistics and analytics
    
    Be concise but informative. Always mention specific metrics and actionable insights.`,
    messages,
    maxSteps: 2,
  })

  return result.toDataStreamResponse()
}
