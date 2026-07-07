"use client"

import * as React from "react"
import JSZip from "jszip"

export interface FaviconFile {
    name: string
    size: number
    blob: Blob
}

export interface FaviconResult {
    previewUrl: string
    zipUrl: string
    fileName: string
    fileSize: number
    files: FaviconFile[]
}

const FAVICON_SIZES: { size: number; name: string }[] = [
    { size: 16, name: "favicon-16x16.png" },
    { size: 32, name: "favicon-32x32.png" },
    { size: 48, name: "favicon-48x48.png" },
    { size: 64, name: "favicon-64x64.png" },
    { size: 128, name: "favicon-128x128.png" },
    { size: 180, name: "apple-touch-icon.png" },
    { size: 192, name: "android-chrome-192x192.png" },
    { size: 512, name: "android-chrome-512x512.png" },
]

function drawSquareCrop(
    ctx: CanvasRenderingContext2D,
    image: ImageBitmap,
    size: number
) {
    const minSide = Math.min(image.width, image.height)
    const sx = (image.width - minSide) / 2
    const sy = (image.height - minSide) / 2

    ctx.drawImage(image, sx, sy, minSide, minSide, 0, 0, size, size)
}

async function resizeToPng(image: ImageBitmap, size: number): Promise<Blob> {
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas not supported in this browser.")

    drawSquareCrop(ctx, image, size)

    const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
    )

    if (!blob) throw new Error("Failed to generate favicon PNG.")
    return blob
}

export function useFaviconGenerator() {
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [result, setResult] = React.useState<FaviconResult | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const generate = async (file: File) => {
        setIsProcessing(true)
        setError(null)
        setResult(null)

        try {
            const imageBitmap = await createImageBitmap(file)
            const files: FaviconFile[] = []

            for (const { size, name } of FAVICON_SIZES) {
                const blob = await resizeToPng(imageBitmap, size)
                files.push({ name, size, blob })
            }

            const zip = new JSZip()
            for (const favicon of files) {
                zip.file(favicon.name, favicon.blob)
            }

            const zipBlob = await zip.generateAsync({ type: "blob" })
            const zipUrl = URL.createObjectURL(zipBlob)
            const previewUrl = URL.createObjectURL(files[2]?.blob ?? files[0].blob)

            const baseName = file.name.replace(/\.[^/.]+$/, "")

            setResult({
                previewUrl,
                zipUrl,
                fileName: `${baseName}-favicons.zip`,
                fileSize: zipBlob.size,
                files,
            })
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to generate favicons."
            )
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl)
        if (result?.zipUrl) URL.revokeObjectURL(result.zipUrl)
        setResult(null)
        setError(null)
    }

    return { generate, reset, isProcessing, result, error }
}
