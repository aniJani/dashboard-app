"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchDatasets, type FredSeriesResult } from "@/lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FredSeriesResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const searchResults = await searchDatasets(query);
      setResults(searchResults);
    } catch (err) {
      setError("Failed to search for datasets. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Search Economic Datasets</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for economic datasets..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}

        {results.map((result) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-medium">{result.title}</h3>
                  <a
                    href={`https://fred.stlouisfed.org/series/${result.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Frequency: {result.frequency}</p>
                  <p>Units: {result.units}</p>
                  <p>Last Updated: {new Date(result.last_updated).toLocaleDateString()}</p>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {result.notes}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 