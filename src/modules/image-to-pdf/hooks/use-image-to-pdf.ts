"use client"

import * as React from "react"
import { PDFDocument } from "pdf-lib"

export interface ImageFileItem {
    id: string
    file: File
}

export interface ImageToPdfResult {
    previewUrl: string
    fileName: string
    fileSize: number
    pageCount: number
}

export function useImageToPdf() {
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [result, setResult] = React.useState<ImageToPdfResult | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const convert = async (items: ImageFileItem[]) => {
        if (items.length === 0) {
            setError("Please add at least 1 image.")
            return
        }

        setIsProcessing(true)
        setError(null)
        setResult(null)

        try {
            const pdfDoc = await PDFDocument.create()

            for (const item of items) {
                const imageBytes = await item.file.arrayBuffer()

                // pdf-lib butuh tau format gambar buat embed dengan benar —
                // PNG dan JPG punya method embed yang beda (embedPng vs embedJpg)
                const isPng = item.file.type === "image/png"
                const embeddedImage = isPng
                    ? await pdfDoc.embedPng(imageBytes)
                    : await pdfDoc.embedJpg(imageBytes)

                // Ukuran halaman PDF dibuat SAMA PERSIS dengan dimensi gambar asli,
                // biar gambar gak ke-crop atau ada border putih aneh
                const { width, height } = embeddedImage

                const page = pdfDoc.addPage([width, height])
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width,
                    height,
                })
            }

            const pageCount = pdfDoc.getPageCount()
            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" })
            const previewUrl = URL.createObjectURL(blob)

            setResult({
                previewUrl,
                fileName: "images-to-pdf.pdf",
                fileSize: blob.size,
                pageCount,
            })
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to convert images. Only PNG and JPG are supported."
            )
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