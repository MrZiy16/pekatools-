"use client"

import * as React from "react"

export interface ImageGridItem {
    id: string
    file: File
}

export type GridLayout =
    | "2x2"
    | "3x3"
    | "2x3"
    | "3x2"
    | "1x2"
    | "2x1"
    | "1x3"
    | "3x1"

export interface GridOptions {
    layout: GridLayout
    gap: number
    backgroundColor: string
    outputWidth: number
}

export interface GridResult {
    previewUrl: string
    fileName: string
    fileSize: number
    width: number
    height: number
}

export function getLayoutDimensions(layout: GridLayout): { cols: number; rows: number } {
    const [cols, rows] = layout.split("x").map(Number)
    return { cols, rows }
}

export function getMaxImages(layout: GridLayout): number {
    const { cols, rows } = getLayoutDimensions(layout)
    return cols * rows
}

function drawImageCover(
    ctx: CanvasRenderingContext2D,
    image: ImageBitmap,
    x: number,
    y: number,
    width: number,
    height: number
) {
    const imageRatio = image.width / image.height
    const cellRatio = width / height

    let sx: number
    let sy: number
    let sw: number
    let sh: number

    if (imageRatio > cellRatio) {
        sh = image.height
        sw = image.height * cellRatio
        sx = (image.width - sw) / 2
        sy = 0
    } else {
        sw = image.width
        sh = image.width / cellRatio
        sx = 0
        sy = (image.height - sh) / 2
    }

    ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height)
}

export function useImageGrid() {
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [result, setResult] = React.useState<GridResult | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const generate = async (items: ImageGridItem[], options: GridOptions) => {
        const { cols, rows } = getLayoutDimensions(options.layout)
        const cellCount = cols * rows

        if (items.length === 0) {
            setError("Please add at least 1 image.")
            return
        }

        if (items.length > cellCount) {
            setError(`This layout fits up to ${cellCount} images. Remove extras or pick a larger grid.`)
            return
        }

        setIsProcessing(true)
        setError(null)
        setResult(null)

        try {
            const cellWidth =
                (options.outputWidth - options.gap * (cols + 1)) / cols
            const cellHeight = cellWidth
            const canvasWidth = options.outputWidth
            const canvasHeight = options.gap + rows * (cellHeight + options.gap)

            const canvas = document.createElement("canvas")
            canvas.width = canvasWidth
            canvas.height = canvasHeight

            const ctx = canvas.getContext("2d")
            if (!ctx) throw new Error("Canvas not supported in this browser.")

            ctx.fillStyle = options.backgroundColor
            ctx.fillRect(0, 0, canvasWidth, canvasHeight)

            const bitmaps = await Promise.all(
                items.map((item) => createImageBitmap(item.file))
            )

            for (let index = 0; index < bitmaps.length; index++) {
                const col = index % cols
                const row = Math.floor(index / cols)
                const x = options.gap + col * (cellWidth + options.gap)
                const y = options.gap + row * (cellHeight + options.gap)

                drawImageCover(ctx, bitmaps[index], x, y, cellWidth, cellHeight)
            }

            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, "image/png")
            )

            if (!blob) throw new Error("Failed to create collage.")

            const previewUrl = URL.createObjectURL(blob)

            setResult({
                previewUrl,
                fileName: `collage-${options.layout}.png`,
                fileSize: blob.size,
                width: canvasWidth,
                height: canvasHeight,
            })
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to create collage."
            )
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl)
        setResult(null)
        setError(null)
    }

    return { generate, reset, isProcessing, result, error }
}
