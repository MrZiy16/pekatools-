"use client"

import * as React from "react"
import { PDFDocument } from "pdf-lib"

export interface PdfFileItem {
    id: string
    file: File
}

export interface MergedResult {
    previewUrl: string
    fileName: string
    fileSize: number
    pageCount: number
}

export function useMergePdf() {
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [result, setResult] = React.useState<MergedResult | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const merge = async (items: PdfFileItem[]) => {
        if (items.length < 2) {
            setError("Please add at least 2 PDF files to merge.")
            return
        }

        setIsProcessing(true)
        setError(null)
        setResult(null)

        try {
            // Bikin dokumen PDF baru yang kosong, ini bakal jadi "wadah"
            // buat nampung semua halaman dari file-file yang di-merge
            const mergedPdf = await PDFDocument.create()

            // Proses tiap file SATU PER SATU, secara berurutan sesuai urutan array
            // (urutan array = urutan yang udah di-arrange user lewat drag/reorder)
            for (const item of items) {
                const fileBuffer = await item.file.arrayBuffer()
                const pdf = await PDFDocument.load(fileBuffer)

                // Ambil semua index halaman dari PDF ini
                const pageIndices = pdf.getPageIndices()

                // Copy semua halaman itu ke dokumen gabungan
                const copiedPages = await mergedPdf.copyPages(pdf, pageIndices)
                copiedPages.forEach((page) => mergedPdf.addPage(page))
            }

            const pageCount = mergedPdf.getPageCount()
            const mergedBytes = await mergedPdf.save()

            // Konversi Uint8Array hasil pdf-lib jadi Blob yang bisa dijadiin URL
            const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" })
            const previewUrl = URL.createObjectURL(blob)

            setResult({
                previewUrl,
                fileName: "mergedbyPekaTool.pdf",
                fileSize: blob.size,
                pageCount,
            })
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to merge PDFs. Make sure all files are valid PDFs."
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

    return { merge, reset, isProcessing, result, error }
}