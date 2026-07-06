"use client"

import * as React from "react"
import * as pdfjsLib from "pdfjs-dist"

// Wajib di-set sebelum pakai pdfjs-dist di browser.
// Worker file-nya di-load dari CDN unpkg, versi harus MATCH persis
// dengan versi pdfjs-dist yang ter-install (cek di package.json).
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

export interface PdfPageThumbnail {
    pageNumber: number
    thumbnailUrl: string
}

export function usePdfThumbnails() {
    const [thumbnails, setThumbnails] = React.useState<PdfPageThumbnail[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const generateThumbnails = async (file: File) => {
        setIsLoading(true)
        setError(null)
        setThumbnails([])

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

            const results: PdfPageThumbnail[] = []

            // Render tiap halaman satu per satu jadi gambar kecil (thumbnail)
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum)

                // Scale kecil (0.3) karena ini cuma buat thumbnail preview,
                // bukan buat dibaca detail — biar proses render cepat & ringan
                const viewport = page.getViewport({ scale: 0.3 })

                const canvas = document.createElement("canvas")
                canvas.width = viewport.width
                canvas.height = viewport.height

                const ctx = canvas.getContext("2d")
                if (!ctx) throw new Error("Canvas not supported in this browser.")

                await page.render({
                    canvasContext: ctx,
                    viewport,
                    canvas,
                }).promise

                const thumbnailUrl = canvas.toDataURL("image/png")

                results.push({ pageNumber: pageNum, thumbnailUrl })
            }

            setThumbnails(results)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load PDF. Make sure the file is a valid PDF."
            )
        } finally {
            setIsLoading(false)
        }
    }

    const reset = () => {
        setThumbnails([])
        setError(null)
    }

    return { generateThumbnails, thumbnails, isLoading, error, reset }
}