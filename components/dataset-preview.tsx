"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatasetSummary, getDatasetHead } from "@/lib/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DatasetPreviewProps {
  datasetId: string;
}

export function DatasetPreview({ datasetId }: DatasetPreviewProps) {
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      setIsLoading(true);
      try {
        const data = await getDatasetHead(datasetId);
        setSummary(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dataset summary"
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (datasetId) {
      fetchSummary();
    }
  }, [datasetId]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-2">
          <div className="h-20 bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="p-2">
          <p className="text-destructive text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  const sampleRows = Array.from({ length: 7 }, (_, index) => {
    const row: Record<string, any> = {};
    summary.columns.forEach((column) => {
      row[column] = summary.sample[column][index];
    });
    return row;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <Card className="shadow-none">
        <CardHeader className="p-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Preview
            <div className="flex gap-1">
              <Badge variant="secondary" className="text-xs">
                {summary.columns.length} cols
              </Badge>
              <Badge variant="outline" className="text-xs">
                {summary.rows} rows
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {summary.columns.map((column) => (
                    <TableHead key={column} className="p-1">
                      <div className="flex flex-col">
                        <span className="text-xs">{column}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {summary.data_types[column]}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleRows.slice(0, 5).map((row, idx) => (
                  <TableRow key={idx}>
                    {summary.columns.map((column) => (
                      <TableCell key={column} className="p-1">
                        <span className="text-xs">
                          {row[column]?.toString() || ""}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
