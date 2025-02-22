"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadDataset } from "@/lib/api";
import { useState } from "react";

interface DatasetUploadProps {
    onUploadSuccess: (datasetId: string) => void;
}

export function DatasetUpload({ onUploadSuccess }: DatasetUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const datasetId = await uploadDataset(file);
            onUploadSuccess(datasetId);
        } catch (err: any) {
            console.error("Error uploading dataset:", err);
            setError(err.message || "An unknown error occurred");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <label htmlFor="dataset" className="font-medium">
                    Dataset:
                </label>
                <Input
                    id="dataset"
                    type="file"
                    onChange={(e) => {
                        setFile(e.target.files ? e.target.files[0] : null);
                    }}
                />
            </div>
            <Button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? "Uploading..." : "Upload Dataset"}
            </Button>
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
