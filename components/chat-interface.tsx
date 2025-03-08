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
import {
  type DatasetInfo,
  type VisualizationResponse,
  type FredSeriesResult,
} from "@/lib/api";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";

// Add conversation message type to match the app's structure
interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string | VisualizationResponse | FredSeriesResult[];
  type: "visualization" | "insight" | "search";
  timestamp?: Date;
}

interface ChatInterfaceProps {
  onSendMessage: (
    type: "visualization" | "insight" | "search",
    message: string
  ) => Promise<
    | {
        type: string;
        result?: string | VisualizationResponse;
        results?: FredSeriesResult[];
      }
    | string
  >;
  placeholder: string;
  selectedDataset: DatasetInfo | null;
  requestType: "visualization" | "insight" | "search";
  onRequestTypeChange: (type: "visualization" | "insight" | "search") => void;
  isInitialView?: boolean;
  // Add prop for conversation history
  conversationHistory?: ConversationMessage[];
}

export function ChatInterface({
  onSendMessage,
  placeholder,
  selectedDataset,
  requestType,
  onRequestTypeChange,
  isInitialView = false,
  conversationHistory = [],
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInitialView, setShowInitialView] = useState(isInitialView);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convert conversation history to display format
  const displayMessages: Message[] = conversationHistory.map((msg) => ({
    id: crypto.randomUUID(), // Use timestamp or another unique identifier if available
    role: msg.role,
    content: msg.content,
    type: requestType, // Use current request type as default
    timestamp: msg.timestamp,
  }));

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setShowInitialView(false); // Hide initial view after first message

      // Only send the message to parent component
      await onSendMessage(requestType, input.trim());

      // Clear input field
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    if (message.type === "search" && typeof message.content === "object") {
      // ...existing search results rendering...
      return (
        <div className="space-y-2">
          {Array.isArray(message.content) &&
            message.content.map((series) => (
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
                  <p>
                    Last Updated:{" "}
                    {new Date(series.last_updated).toLocaleDateString()}
                  </p>
                  {series.notes && (
                    <p className="mt-1 line-clamp-2">{series.notes}</p>
                  )}
                </div>
              </div>
            ))}
          {Array.isArray(message.content) && message.content.length === 0 && (
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  return (
    <div className="flex flex-col h-full">
      {showInitialView ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#00caeb] to-[#df3f8b] bg-clip-text text-transparent">
            What can I help with?
          </h1>

          <div className="w-full max-w-3xl">
            <div className="flex gap-2 mb-6">
              <Select
                value={requestType}
                onValueChange={(
                  value: "visualization" | "insight" | "search"
                ) => {
                  onRequestTypeChange(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
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
                placeholder="Ask anything..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-500"
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Make ScrollArea take up more space when container is expanded */}
          <ScrollArea className="flex-1 p-4 overflow-auto">
            <div className="space-y-4">
              {displayMessages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
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
                  {/* Add timestamp if available */}
                  {message.timestamp && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(message.timestamp), "h:mm a")}
                    </div>
                  )}
                </div>
              ))}
              {/* Add auto-scroll reference at the bottom */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Keep input area fixed height */}
          <div className="flex gap-2 p-4 border-t border-accent/20">
            <Select
              value={requestType}
              onValueChange={(
                value: "visualization" | "insight" | "search"
              ) => {
                onRequestTypeChange(value);
              }}
            >
              <SelectTrigger className="w-[180px]">
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
              placeholder={placeholder}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-500"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
