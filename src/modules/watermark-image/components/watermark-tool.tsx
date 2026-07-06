"use client"

import * as React from "react"
import Image from "next/image"
import { Download, RotateCcw } from "lucide-react"

import { UploadArea } from "@/components/shared/upload-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    useWatermark,
    type WatermarkPosition,
} from "./hooks/use-watermark"
import { formatBytes } from "@/lib/utils/format-bytes"

// Daftar posisi yang bisa dipilih, dengan label yang enak dibaca user
const positions: { value: WatermarkPosition; label: string }[] = [
    { value: "top-left", label: "Top Left" },
    { value: "top-right", label: "Top Right" },
    { value: "center", label: "Center" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-right", label: "Bottom Right" },
]

export function WatermarkTool() {
    const { applyWatermark, reset, isProcessing, result, error } = useWatermark()

    const [file, setFile] = React.useState<File | null>(null)
    const [text, setText] = React.useState("© PekaTools")
    const [position, setPosition] = React.useState<WatermarkPosition>("bottom-right")
    const [opacity, setOpacity] = React.useState([0.5])
    const [fontSize, setFontSize] = React.useState([32])
    const [color, setColor] = React.useState("#FFFFFF")

    const handleFilesSelected = (files: File[]) => {
        if (files[0]) setFile(files[0])
    }

    const handleApply = () => {
        if (!file || !text.trim()) return
        applyWatermark(file, {
            text,
            position,
            opacity: opacity[0],
            fontSize: fontSize[0],
            color,
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
        reset()
        setFile(null)
    }

    return (
        <div className="mx-auto max-w-2xl">
            {!file && (
                <UploadArea
                    accept="image/*"
                    onFilesSelected={handleFilesSelected}
                    label="Drag & drop your image here"
                    hint="Or click to browse"
                />
            )}

            {file && !result && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                    <div>
                        <Label htmlFor="watermark-text">Watermark Text</Label>
                        <Input
                            id="watermark-text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter watermark text"
                            className="mt-1.5"
                        />
                    </div>

                    <div>
                        <Label>Position</Label>
                        <div className="mt-1.5 grid grid-cols-3 gap-2">
                            {positions.map((pos) => (
                                <button
                                    key={pos.value}
                                    onClick={() => setPosition(pos.value)}
                                    className={`rounded-lg border px-3 py-2 text-sm transition-colors ${position === pos.value
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border text-muted-foreground hover:border-primary/50"
                                        }`}
                                >
                                    {pos.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <Label>Opacity</Label>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(opacity[0] * 100)}%
                            </span>
                        </div>
                        <Slider
                            value={opacity}
                            onValueChange={setOpacity}
                            min={0.1}
                            max={1}
                            step={0.05}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <Label>Font Size</Label>
                            <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
                        </div>
                        <Slider
                            value={fontSize}
                            onValueChange={setFontSize}
                            min={12}
                            max={80}
                            step={2}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="watermark-color">Text Color</Label>
                        <div className="mt-1.5 flex items-center gap-2">
                            <input
                                id="watermark-color"
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-9 w-14 rounded-md border border-border cursor-pointer bg-transparent"
                            />
                            <span className="text-sm text-muted-foreground">{color}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button onClick={handleApply} disabled={isProcessing} className="flex-1">
                            {isProcessing ? "Applying..." : "Apply Watermark"}
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
                    <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
                        <Image
                            src={result.previewUrl}
                            alt="Watermarked preview"
                            fill
                            className="object-contain bg-secondary"
                            unoptimized
                        />
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                        {result.fileName} — {formatBytes(result.fileSize)}
                    </p>

                    <div className="mt-4 flex gap-3">
                        <Button onClick={handleDownload} className="flex-1">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4" />
                            Watermark Another
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}