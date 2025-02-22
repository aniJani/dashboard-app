"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DatasetInfo } from "@/lib/api"
import { useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
  type: "visualization" | "insight"
}

interface ChatInterfaceProps {
  onSendMessage: (type: "visualization" | "insight", message: string) => Promise<string>
  placeholder: string
  selectedDataset: DatasetInfo | null
}

export function ChatInterface({ onSendMessage, placeholder, selectedDataset }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [requestType, setRequestType] = useState<"visualization" | "insight">("visualization")

  const handleSend = async () => {
    if (!input.trim() || !selectedDataset) return

    const userMessage: Message = { role: "user", content: input, type: requestType }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    const response = await onSendMessage(requestType, input)
    const assistantMessage: Message = { role: "assistant", content: response, type: requestType }
    setMessages((prev) => [...prev, assistantMessage])
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
            >
              <span className="font-bold">{message.type.charAt(0).toUpperCase() + message.type.slice(1)}:</span>{" "}
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="flex p-4">
        <Select value={requestType} onValueChange={(value: "visualization" | "insight") => setRequestType(value)}>
          <SelectTrigger className="w-[180px] mr-2">
            <SelectValue placeholder="Select request type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visualization">Visualization</SelectItem>
            <SelectItem value="insight">Insight</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedDataset ? placeholder : "Please select a dataset first"}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 mr-2"
          disabled={!selectedDataset}
        />
        <Button onClick={handleSend} disabled={!selectedDataset}>
          Send
        </Button>
      </div>
      {selectedDataset && (
        <div className="px-4 py-2 bg-muted text-sm">Selected dataset: {selectedDataset.filename}</div>
      )}
    </div>
  )
}

