"use client"

import * as React from "react"
import Image from "next/image"
import { Download, RotateCcw } from "lucide-react"

import { UploadArea } from "@/components/shared/upload-area"
import { Button } from "@/components/ui/button"
import { useFaviconGenerator } from "../hooks/use-favicon-generator"
import { formatBytes } from "@/lib/utils/format-bytes"

export function FaviconGeneratorTool() {
    const { generate, reset, isProcessing, result, error } = useFaviconGenerator()

    const [file, setFile] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

    const handleFilesSelected = (files: File[]) => {
        const selected = files[0]
        if (!selected) return

        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setFile(selected)
        setPreviewUrl(URL.createObjectURL(selected))
    }

    const handleGenerate = () => {
        if (file) generate(file)
    }

    const handleDownload = () => {
        if (!result) return
        const link = document.createElement("a")
        link.href = result.zipUrl
        link.download = result.fileName
        link.click()
    }

    const handleReset = () => {
        reset()
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        setFile(null)
    }

    return (
        <div className="mx-auto max-w-2xl">
            {!file && (
                <UploadArea
                    accept="image/*"
                    onFilesSelected={handleFilesSelected}
                    label="Drag & drop your image here"
                    hint="Square images work best — or click to browse"
                />
            )}

            {file && !result && (
                <div className="rounded-xl border border-border bg-card p-6">
                    {previewUrl && (
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
                                <Image
                                    src={previewUrl}
                                    alt="Source preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="truncate font-medium text-foreground">{file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatBytes(file.size)}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Generates 8 PNG sizes (16px–512px) in a ZIP file
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex gap-3">
                        <Button
                            onClick={handleGenerate}
                            disabled={isProcessing}
                            className="flex-1"
                        >
                            {isProcessing ? "Generating..." : "Generate Favicons"}
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            Cancel
                        </Button>
                    </div>
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
                                alt="Favicon preview"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>

                        <div className="flex-1">
                            <p className="font-medium text-foreground">{result.fileName}</p>
                            <p className="text-sm text-muted-foreground">
                                {result.files.length} PNG files — {formatBytes(result.fileSize)}
                            </p>
                        </div>
                    </div>

                    <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-4">
                        {result.files.map((favicon) => (
                            <li
                                key={favicon.name}
                                className="rounded-md border border-border bg-secondary/50 px-2 py-1.5 text-center text-xs"
                            >
                                {favicon.size}×{favicon.size}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex gap-3">
                        <Button onClick={handleDownload} className="flex-1">
                            <Download className="h-4 w-4" />
                            Download ZIP
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4" />
                            Generate More
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
