"use client"

import Image from "next/image"
import { Download, RotateCcw } from "lucide-react"

import { UploadArea } from "@/components/shared/upload-area"
import { Button } from "@/components/ui/button"
import { formatBytes } from "@/lib/utils/format-bytes"
import { useImageConverter, type ConvertFormat } from "../hooks/use-image-converter"

interface ConverterToolProps {
    targetFormat: ConvertFormat
    acceptedInputTypes: string
}

export function ConverterTool({ targetFormat, acceptedInputTypes }: ConverterToolProps) {
    const { convert, reset, isProcessing, result, error } = useImageConverter()

    const handleFilesSelected = (files: File[]) => {
        if (files[0]) convert(files[0], targetFormat)
    }

    const handleDownload = () => {
        if (!result) return
        const link = document.createElement("a")
        link.href = result.previewUrl
        link.download = result.fileName
        link.click()
    }

    return (
        <div className="mx-auto max-w-2xl">
            {!result && !isProcessing && (
                <UploadArea
                    accept={acceptedInputTypes}
                    onFilesSelected={handleFilesSelected}
                    label="Drag & drop your image here"
                    hint="Or click to browse"
                />
            )}

            {isProcessing && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border p-12 text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="mt-4 text-muted-foreground">Converting your image...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            {result && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border">
                            <Image
                                src={result.previewUrl}
                                alt="Converted preview"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>

                        <div className="flex-1">
                            <p className="font-medium text-foreground truncate">
                                {result.fileName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatBytes(result.fileSize)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button onClick={handleDownload} className="flex-1">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                        <Button onClick={reset} variant="outline">
                            <RotateCcw className="h-4 w-4" />
                            Convert Another
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}