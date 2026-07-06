"use client"

import * as React from "react"
import Image from "next/image"
import { Download, RotateCcw, Trash2 } from "lucide-react"

import { UploadArea } from "@/components/shared/upload-area"
import { Button } from "@/components/ui/button"
import { usePdfThumbnails } from "../hooks/use-pdf-thumbnails"
import { useDeletePdfPages } from "../hooks/use-delete-pdf-pages"
import { formatBytes } from "@/lib/utils/format-bytes"

export function DeletePdfTool() {
    const {
        generateThumbnails,
        thumbnails,
        isLoading: isLoadingThumbnails,
        error: thumbnailError,
        reset: resetThumbnails,
    } = usePdfThumbnails()

    const {
        deletePages,
        isProcessing,
        result,
        error: deleteError,
        reset: resetDelete,
    } = useDeletePdfPages()

    const [file, setFile] = React.useState<File | null>(null)
    const [selectedPages, setSelectedPages] = React.useState<Set<number>>(new Set())

    const handleFilesSelected = (files: File[]) => {
        const selectedFile = files[0]
        if (!selectedFile) return
        setFile(selectedFile)
        generateThumbnails(selectedFile)
    }

    const togglePage = (pageNumber: number) => {
        setSelectedPages((prev) => {
            const next = new Set(prev)
            if (next.has(pageNumber)) {
                next.delete(pageNumber)
            } else {
                next.add(pageNumber)
            }
            return next
        })
    }

    const handleDelete = () => {
        if (!file || selectedPages.size === 0) return
        deletePages(file, thumbnails.length, Array.from(selectedPages))
    }

    const handleDownload = () => {
        if (!result) return
        const link = document.createElement("a")
        link.href = result.previewUrl
        link.download = result.fileName
        link.click()
    }

    const handleReset = () => {
        resetThumbnails()
        resetDelete()
        setFile(null)
        setSelectedPages(new Set())
    }

    return (
        <div className="mx-auto max-w-4xl">
            {!file && (
                <UploadArea
                    accept="application/pdf"
                    onFilesSelected={handleFilesSelected}
                    label="Drag & drop your PDF file here"
                    hint="Or click to browse"
                />
            )}

            {isLoadingThumbnails && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border p-12 text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="mt-4 text-muted-foreground">Loading PDF pages...</p>
                </div>
            )}

            {file && thumbnails.length > 0 && !result && (
                <div>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Click on pages you want to delete. {selectedPages.size} of{" "}
                        {thumbnails.length} pages selected for deletion.
                    </p>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {thumbnails.map((thumb) => {
                            const isSelected = selectedPages.has(thumb.pageNumber)

                            return (
                                <button
                                    key={thumb.pageNumber}
                                    onClick={() => togglePage(thumb.pageNumber)}
                                    className={`relative rounded-lg border-2 overflow-hidden transition-all ${isSelected
                                        ? "border-destructive opacity-50"
                                        : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    <Image
                                        src={thumb.thumbnailUrl}
                                        alt={`Page ${thumb.pageNumber}`}
                                        width={150}
                                        height={200}
                                        className="w-full h-auto"
                                        unoptimized
                                    />

                                    {isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-destructive/20">
                                            <Trash2 className="h-6 w-6 text-destructive" />
                                        </div>
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 bg-background/90 text-center text-xs py-1 text-foreground">
                                        Page {thumb.pageNumber}
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button
                            onClick={handleDelete}
                            disabled={selectedPages.size === 0 || isProcessing}
                            variant="destructive"
                            className="flex-1"
                        >
                            {isProcessing
                                ? "Deleting..."
                                : `Delete ${selectedPages.size} Page${selectedPages.size !== 1 ? "s" : ""}`}
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {(thumbnailError || deleteError) && (
                <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {thumbnailError || deleteError}
                </div>
            )}

            {result && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <p className="font-medium text-foreground">{result.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                        {result.remainingPages} pages remaining — {formatBytes(result.fileSize)}
                    </p>

                    <div className="mt-4 flex gap-3">
                        <Button onClick={handleDownload} className="flex-1">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4" />
                            Edit Another PDF
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}