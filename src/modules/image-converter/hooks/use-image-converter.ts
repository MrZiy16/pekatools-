"use client"

import * as React from "react"

export type ConvertFormat = "image/png" | "image/jpeg" | "image/webp"
export interface ConvertedResult {
    originalFile: File
    previewUrl: string
    fileName: string
    fileSize: number
}

export function useImageConverter() {
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [result, setResult] = React.useState<ConvertedResult | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const convert = async (file: File, targetFormat: ConvertFormat) => {
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

            if (targetFormat === "image/jpeg") {
                ctx.fillStyle = "#FFFFFF"
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            ctx.drawImage(imageBitmap, 0, 0)

            const quality = targetFormat === "image/jpeg" || targetFormat === "image/webp" ? 0.92 : undefined
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, targetFormat, quality)
            )

            if (!blob) throw new Error("Failed to convert image.")

            const previewUrl = URL.createObjectURL(blob)
            const extensionMap: Record<ConvertFormat, string> = {
                "image/jpeg": "jpg",
                "image/png": "png",
                "image/webp": "webp",
            }
            const newExtension = extensionMap[targetFormat]
            const baseName = file.name.replace(/\.[^/.]+$/, "")

            setResult({
                originalFile: file,
                previewUrl,
                fileName: `${baseName}.${newExtension}`,
                fileSize: blob.size,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to convert image.")
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

    return { convert, reset, isProcessing, result, error }
}