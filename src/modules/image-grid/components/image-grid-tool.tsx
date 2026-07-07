"use client"

import * as React from "react"
import Image from "next/image"
import { Download, RotateCcw, X } from "lucide-react"

import { UploadArea } from "@/components/shared/upload-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    useImageGrid,
    getMaxImages,
    type GridLayout,
    type ImageGridItem,
} from "../hooks/use-image-grid"
import { formatBytes } from "@/lib/utils/format-bytes"

const layouts: { value: GridLayout; label: string }[] = [
    { value: "2x2", label: "2×2" },
    { value: "3x3", label: "3×3" },
    { value: "2x3", label: "2×3" },
    { value: "3x2", label: "3×2" },
    { value: "1x2", label: "1×2" },
    { value: "2x1", label: "2×1" },
    { value: "1x3", label: "1×3" },
    { value: "3x1", label: "3×1" },
]

export function ImageGridTool() {
    const { generate, reset, isProcessing, result, error } = useImageGrid()

    const [items, setItems] = React.useState<ImageGridItem[]>([])
    const [layout, setLayout] = React.useState<GridLayout>("2x2")
    const [gap, setGap] = React.useState(8)
    const [backgroundColor, setBackgroundColor] = React.useState("#ffffff")
    const [outputWidth, setOutputWidth] = React.useState(1200)

    const previewUrlsRef = React.useRef<Map<string, string>>(new Map())
    const maxImages = getMaxImages(layout)

    const getPreviewUrl = (item: ImageGridItem) => {
        if (!previewUrlsRef.current.has(item.id)) {
            previewUrlsRef.current.set(item.id, URL.createObjectURL(item.file))
        }
        return previewUrlsRef.current.get(item.id)!
    }

    const handleFilesSelected = (files: File[]) => {
        const newItems: ImageGridItem[] = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
        }))
        setItems((prev) => [...prev, ...newItems])
    }

    const handleRemove = (id: string) => {
        const url = previewUrlsRef.current.get(id)
        if (url) {
            URL.revokeObjectURL(url)
            previewUrlsRef.current.delete(id)
        }
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    const handleGenerate = () => {
        generate(items.slice(0, maxImages), {
            layout,
            gap,
            backgroundColor,
            outputWidth,
        })
    }

    const handleDownload = () => {
        if (!result) return
        const link = document.createElement("a")
        link.href = result.previewUrl
        link.download = result.fileName
        link.click()
    }

    const handleReset = () => {
        previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
        previewUrlsRef.current.clear()
        reset()
        setItems([])
    }

    const visibleItems = items.slice(0, maxImages)
    const overflowCount = Math.max(0, items.length - maxImages)

    return (
        <div className="mx-auto max-w-2xl">
            {!result && (
                <>
                    <UploadArea
                        accept="image/*"
                        multiple
                        onFilesSelected={handleFilesSelected}
                        label="Drag & drop your images here"
                        hint="Add photos for your collage — or click to browse"
                    />

                    {items.length > 0 && (
                        <div className="mt-6 space-y-6 rounded-xl border border-border bg-card p-6">
                            <div>
                                <Label>Grid Layout</Label>
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                    {layouts.map((option) => (
                                        <Button
                                            key={option.value}
                                            type="button"
                                            variant={layout === option.value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setLayout(option.value)}
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Fits up to {maxImages} image{maxImages !== 1 ? "s" : ""}
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="grid-gap">Gap ({gap}px)</Label>
                                <Slider
                                    id="grid-gap"
                                    min={0}
                                    max={48}
                                    step={2}
                                    value={[gap]}
                                    onValueChange={(value) => setGap(value[0])}
                                    className="mt-3"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="grid-bg">Background</Label>
                                    <div className="mt-1.5 flex items-center gap-2">
                                        <Input
                                            id="grid-bg"
                                            type="color"
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className="h-10 w-14 cursor-pointer p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className="flex-1 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="grid-width">Output Width (px)</Label>
                                    <Input
                                        id="grid-width"
                                        type="number"
                                        min={400}
                                        max={4000}
                                        value={outputWidth}
                                        onChange={(e) =>
                                            setOutputWidth(Number(e.target.value) || 1200)
                                        }
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                {visibleItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                                            {index + 1}
                                        </span>
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border">
                                            <Image
                                                src={getPreviewUrl(item)}
                                                alt={item.file.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-foreground">
                                                {item.file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatBytes(item.file.size)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {overflowCount > 0 && (
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    {overflowCount} extra image{overflowCount !== 1 ? "s" : ""} will
                                    be ignored for this layout.
                                </p>
                            )}

                            <Button
                                onClick={handleGenerate}
                                disabled={items.length === 0 || isProcessing}
                                className="w-full"
                            >
                                {isProcessing ? "Creating..." : "Create Collage"}
                            </Button>
                        </div>
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
                    <div className="overflow-hidden rounded-lg border border-border">
                        <Image
                            src={result.previewUrl}
                            alt="Collage preview"
                            width={result.width}
                            height={result.height}
                            className="h-auto w-full"
                            unoptimized
                        />
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                        {result.width}×{result.height}px — {formatBytes(result.fileSize)}
                    </p>

                    <div className="mt-6 flex gap-3">
                        <Button onClick={handleDownload} className="flex-1">
                            <Download className="h-4 w-4" />
                            Download PNG
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4" />
                            Create Another
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
