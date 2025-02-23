"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type DatasetInfo, type VisualizationResponse, type FredSeriesResult, searchDatasets } from "@/lib/api";
import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string | VisualizationResponse | FredSeriesResult[];
  type: "visualization" | "insight" | "search";
}

interface ChatInterfaceProps {
  onSendMessage: (
    type: "visualization" | "insight" | "search",
    message: string
  ) => Promise<{
    type: string;
    result?: string | VisualizationResponse;
    results?: FredSeriesResult[];
  } | string>;
  placeholder: string;
  selectedDataset: DatasetInfo | null;
  requestType: "visualization" | "insight" | "search";
  onRequestTypeChange: (type: "visualization" | "insight" | "search") => void;
}

export function ChatInterface({
  onSendMessage,
  placeholder,
  selectedDataset,
  requestType,
  onRequestTypeChange,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message for all request types
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: input.trim(),
        type: requestType,
      };
      setMessages((prev) => [...prev, userMessage]);

      if (requestType === "search") {
        const response = await onSendMessage(requestType, input.trim());
        const searchResults = typeof response === 'object' && 'results' in response ? response.results : [];
        
        const searchMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: searchResults,
          type: "search",
        };
        setMessages((prev) => [...prev, searchMessage]);
        setInput("");
        return;
      }

      // Handle visualization and insight responses
      const response = await onSendMessage(requestType, input.trim());
      if (response) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: typeof response === 'string' ? response : response.result || 'No content available',
          type: requestType,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    if (message.type === "search" && typeof message.content === "object") {
      const results = message.content.seriess || [];
      return (
        <div className="space-y-2">
          {results.map((series) => (
            <div key={series.id} className="p-2 rounded bg-card/50">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{series.title}</h4>
                <a
                  href={`https://fred.stlouisfed.org/series/${series.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Frequency: {series.frequency}</p>
                <p>Units: {series.units}</p>
                <p>Seasonal Adjustment: {series.seasonal_adjustment}</p>
                <p>Last Updated: {new Date(series.last_updated).toLocaleDateString()}</p>
                {series.notes && <p className="mt-1 line-clamp-2">{series.notes}</p>}
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <p className="text-muted-foreground">No datasets found</p>
          )}
        </div>
      );
    }

    if (typeof message.content === "string") {
      return message.content;
    }

    return (
      <div>
        <Image
          src={`data:image/png;base64,${message.content.image_base64}`}
          alt="Visualization"
          width={400}
          height={300}
          layout="responsive"
        />
        {message.content.description && (
          <p className="mt-2 text-sm">{message.content.description}</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {renderMessage(message)}
            </div>
          </div>
        ))}
      </ScrollArea>

      <div className="flex p-4">
        <Select
          value={requestType}
          onValueChange={(value: "visualization" | "insight" | "search") => {
            onRequestTypeChange(value);
          }}
        >
          <SelectTrigger className="w-[180px] mr-2">
            <SelectValue placeholder="Select request type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visualization">Visualization</SelectItem>
            <SelectItem value="insight">Insight</SelectItem>
            <SelectItem value="search">Search Dataset</SelectItem>
          </SelectContent>
        </Select>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            requestType === "search"
              ? "Search for economic datasets..."
              : selectedDataset
              ? placeholder
              : "Please select a dataset first"
          }
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 mr-2"
          disabled={
            (requestType !== "search" && !selectedDataset) || 
            (requestType === "search" && selectedDataset)
          }
        />
        <Button 
          onClick={handleSend} 
          disabled={
            (requestType !== "search" && !selectedDataset) || 
            (requestType === "search" && selectedDataset) ||
            isLoading
          }
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>

      {selectedDataset && requestType !== "search" && (
        <div className="px-4 py-2 bg-muted text-sm">
          Selected dataset: {selectedDataset.filename}
        </div>
      )}
    </div>
  );
}
