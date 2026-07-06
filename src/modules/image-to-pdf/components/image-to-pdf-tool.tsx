"use client"

import * as React from "react"
import Image from "next/image"
import { Download, RotateCcw, ArrowUp, ArrowDown, X, FileText } from "lucide-react"

import { UploadArea } from "@/components/shared/upload-area"
import { Button } from "@/components/ui/button"
import { useImageToPdf, type ImageFileItem } from "../hooks/use-image-to-pdf"
import { formatBytes } from "@/lib/utils/format-bytes"

export function ImageToPdfTool() {
    const { convert, reset, isProcessing, result, error } = useImageToPdf()

    const [items, setItems] = React.useState<ImageFileItem[]>([])
    // previewUrls di-cache terpisah per item id, biar gak perlu bikin ulang
    // object URL tiap kali komponen re-render (misal pas reorder)
    const previewUrlsRef = React.useRef<Map<string, string>>(new Map())

    const getPreviewUrl = (item: ImageFileItem) => {
        if (!previewUrlsRef.current.has(item.id)) {
            previewUrlsRef.current.set(item.id, URL.createObjectURL(item.file))
        }
        return previewUrlsRef.current.get(item.id)!
    }

    const handleFilesSelected = (files: File[]) => {
        const newItems: ImageFileItem[] = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
        }))
        setItems((prev) => [...prev, ...newItems])
    }

    const handleRemove = (id: string) => {
        // Bersihin object URL yang udah gak dipakai lagi, hindari memory leak
        const url = previewUrlsRef.current.get(id)
        if (url) {
            URL.revokeObjectURL(url)
            previewUrlsRef.current.delete(id)
        }
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

    const handleConvert = () => {
        convert(items)
    }

    const handleDownload = () => {
        if (!result) return
        const link = document.createElement("a")
        link.href = result.previewUrl
        link.download = result.fileName
        link.click()
    }

    const handleReset = () => {
        // Bersihin semua cached preview URL sebelum clear items
        previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
        previewUrlsRef.current.clear()
        reset()
        setItems([])
    }

    return (
        <div className="mx-auto max-w-2xl">
            {!result && (
                <>
                    <UploadArea
                        accept="image/png, image/jpeg"
                        multiple
                        onFilesSelected={handleFilesSelected}
                        label="Drag & drop your images here"
                        hint="PNG or JPG only — select multiple, or click to browse"
                    />

                    {items.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                                >
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border">
                                        <Image
                                            src={getPreviewUrl(item)}
                                            alt={item.file.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>

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
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="mt-4 w-full"
                        >
                            {isProcessing
                                ? "Converting..."
                                : `Convert ${items.length} Image${items.length !== 1 ? "s" : ""} to PDF`}
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
                            Convert More
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}