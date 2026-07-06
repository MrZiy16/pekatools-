"use client"

import * as React from "react"

export type WatermarkPosition =
    | "top-left" | "top-right"
    | "bottom-left" | "bottom-right"
    | "center"

export interface WatermarkOptions {
    text: string
    position: WatermarkPosition
    opacity: number // 0 - 1
    fontSize: number
    color: string
}

export interface WatermarkResult {
    originalFile: File
    previewUrl: string
    fileName: string
    fileSize: number
}

export function useWatermark() {
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [result, setResult] = React.useState<WatermarkResult | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const applyWatermark = async (file: File, options: WatermarkOptions) => {
        setIsProcessing(true)
        setError(null)
        setResult(null)

        try {
            const imageBitmap = await createImageBitmap(file)

            const canvas = document.createElement("canvas")
            canvas.width = imageBitmap.width
            canvas.height = imageBitmap.height

            const ctx = canvas.getContext("2d")
            if (!ctx) throw new Error("Canvas not supported in this browser.")

            // Gambar image asli dulu sebagai base layer
            ctx.drawImage(imageBitmap, 0, 0)

            // Setup style teks watermark
            ctx.globalAlpha = options.opacity
            ctx.fillStyle = options.color
            ctx.font = `bold ${options.fontSize}px sans-serif`

            // Ukur teks dulu buat tau lebar/tinggi-nya (dibutuhkan buat hitung posisi)
            const textMetrics = ctx.measureText(options.text)
            const textWidth = textMetrics.width
            const textHeight = options.fontSize
            const padding = 24

            // Hitung koordinat x,y berdasarkan posisi yang dipilih user
            let x = padding
            let y = padding + textHeight

            if (options.position === "top-right") {
                x = canvas.width - textWidth - padding
                y = padding + textHeight
            } else if (options.position === "bottom-left") {
                x = padding
                y = canvas.height - padding
            } else if (options.position === "bottom-right") {
                x = canvas.width - textWidth - padding
                y = canvas.height - padding
            } else if (options.position === "center") {
                x = (canvas.width - textWidth) / 2
                y = (canvas.height + textHeight) / 2
            }

            ctx.fillText(options.text, x, y)

            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, file.type, 0.92)
            )

            if (!blob) throw new Error("Failed to apply watermark.")

            const previewUrl = URL.createObjectURL(blob)
            const baseName = file.name.replace(/\.[^/.]+$/, "")
            const extension = file.name.split(".").pop()

            setResult({
                originalFile: file,
                previewUrl,
                fileName: `${baseName}-watermarked.${extension}`,
                fileSize: blob.size,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to apply watermark.")
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        if (result?.previewUrl) {
            URL.revokeObjectURL(result.previewUrl)
        }
        setResult(null)
        setError(null)
    }

    return { applyWatermark, reset, isProcessing, result, error }
}