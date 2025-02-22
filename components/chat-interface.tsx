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
import type { DatasetInfo, VisualizationResponse } from "@/lib/api";
import { useState } from "react";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string | VisualizationResponse;
  type: "visualization" | "insight";
}

interface ChatInterfaceProps {
  onSendMessage: (
    type: "visualization" | "insight",
    message: string
  ) => Promise<VisualizationResponse | string>;
  placeholder: string;
  selectedDataset: DatasetInfo | null;
}

export function ChatInterface({
  onSendMessage,
  placeholder,
  selectedDataset,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestType, setRequestType] = useState<"visualization" | "insight">(
    "visualization"
  );

  const handleSend = async () => {
    if (!input.trim() || !selectedDataset || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: input.trim(),
        type: requestType,
      };
      setMessages((prev) => [...prev, userMessage]);

      const currentInput = input.trim();
      setInput("");

      try {
        const response = await onSendMessage(requestType, currentInput);

        if (response) {
          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response,
            type: requestType,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          throw new Error("Empty response received");
        }
      } catch (apiError) {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, there was an error processing your request. Please try again.",
          type: requestType,
        };
        setMessages((prev) => [...prev, errorMessage]);
        console.error("API Error:", apiError);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
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
              <span className="font-bold">
                {message.type.charAt(0).toUpperCase() + message.type.slice(1)}:
              </span>{" "}
              {typeof message.content === "string" ? (
                message.content
              ) : (
                <div>
                  <Image
                    src={`data:image/png;base64,${message.content.image_base64}`}
                    alt="Visualization"
                    width={400}
                    height={300}
                    layout="responsive"
                  />
                  {message.content.description && (
                    <p className="mt-2 text-sm">
                      {message.content.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="flex p-4">
        <Select
          value={requestType}
          onValueChange={(value: "visualization" | "insight") =>
            setRequestType(value)
          }
        >
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
          placeholder={
            selectedDataset ? placeholder : "Please select a dataset first"
          }
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 mr-2"
          disabled={!selectedDataset}
        />
        <Button onClick={handleSend} disabled={!selectedDataset || isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
      {selectedDataset && (
        <div className="px-4 py-2 bg-muted text-sm">
          Selected dataset: {selectedDataset.filename}
        </div>
      )}
    </div>
  );
}
