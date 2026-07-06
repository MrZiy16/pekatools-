"use client"

import * as React from "react"
import { Download, RotateCcw, ArrowUp, ArrowDown, X, FileText } from "lucide-react"

import { UploadArea } from "@/components/shared/upload-area"
import { Button } from "@/components/ui/button"
import { useMergePdf, type PdfFileItem } from "../hooks/use-merge-pdf"
import { formatBytes } from "@/lib/utils/format-bytes"

export function MergePdfTool() {
    const { merge, reset, isProcessing, result, error } = useMergePdf()

    const [items, setItems] = React.useState<PdfFileItem[]>([])

    // Setiap file baru yang di-upload ditambahin ke list yang sudah ada
    // (bukan menggantikan), karena user bisa upload bertahap
    const handleFilesSelected = (files: File[]) => {
        const newItems: PdfFileItem[] = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
        }))
        setItems((prev) => [...prev, ...newItems])
    }

    const handleRemove = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    const handleMoveUp = (index: number) => {
        if (index === 0) return
        setItems((prev) => {
            const newItems = [...prev]
                ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
            return newItems
        })
    }

    const handleMoveDown = (index: number) => {
        if (index === items.length - 1) return
        setItems((prev) => {
            const newItems = [...prev]
                ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
            return newItems
        })
    }

    const handleMerge = () => {
        merge(items)
    }

    const handleDownload = () => {
        if (!result) return
        const link = document.createElement("a")
        link.href = result.previewUrl
        link.download = result.fileName
        link.click()
    }

    const handleReset = () => {
        reset()
        setItems([])
    }

    return (
        <div className="mx-auto max-w-2xl">
            {!result && (
                <>
                    <UploadArea
                        accept="application/pdf"
                        multiple
                        onFilesSelected={handleFilesSelected}
                        label="Drag & drop your PDF files here"
                        hint="Select 2 or more PDFs — or click to browse"
                    />

                    {items.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                                >
                                    <FileText className="h-5 w-5 shrink-0 text-primary" />

                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {item.file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(item.file.size)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleMoveUp(index)}
                                            disabled={index === 0}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleMoveDown(index)}
                                            disabled={index === items.length - 1}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {items.length > 0 && (
                        <Button
                            onClick={handleMerge}
                            disabled={items.length < 2 || isProcessing}
                            className="mt-4 w-full"
                        >
                            {isProcessing
                                ? "Merging..."
                                : `Merge ${items.length} PDFs`}
                        </Button>
                    )}
                </>
            )}

            {error && (
                <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            {result && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary">
                            <FileText className="h-7 w-7 text-primary" />
                        </div>

                        <div className="flex-1">
                            <p className="font-medium text-foreground">{result.fileName}</p>
                            <p className="text-sm text-muted-foreground">
                                {result.pageCount} pages — {formatBytes(result.fileSize)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button onClick={handleDownload} className="flex-1">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4" />
                            Merge More
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}