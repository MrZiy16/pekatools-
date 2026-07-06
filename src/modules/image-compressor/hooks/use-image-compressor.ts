"use client"

import * as React from "react"
import imageCompression from "browser-image-compression"

export interface CompressedResult {
    originalFile: File
    compressedFile: File
    originalSize: number
    compressedSize: number
    previewUrl: string
}

export function useImageCompressor() {
    const [isCompressing, setIsCompressing] = React.useState(false)
    const [result, setResult] = React.useState<CompressedResult | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const compress = async (file: File) => {
        setIsCompressing(true)
        setError(null)
        setResult(null)

        try {
            const options = {
                maxSizeMB: Math.max(file.size / 1024 / 1024 / 2, 0.5),
                maxWidthOrHeight: 2560,
                useWebWorker: true,
                initialQuality: 0.85,
            }

            const compressedFile = await imageCompression(file, options)
            const previewUrl = URL.createObjectURL(compressedFile)

            setResult({
                originalFile: file,
                compressedFile,
                originalSize: file.size,
                compressedSize: compressedFile.size,
                previewUrl,
            })
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to compress image."
            )
        } finally {
            setIsCompressing(false)
        }
    }

    const reset = () => {
        if (result?.previewUrl) {
            URL.revokeObjectURL(result.previewUrl)
        }
        setResult(null)
        setError(null)
    }

    return { compress, reset, isCompressing, result, error }
}