"use client"

import * as React from "react"
import { PDFDocument } from "pdf-lib"

export interface DeletePagesResult {
    previewUrl: string
    fileName: string
    fileSize: number
    remainingPages: number
}

export function useDeletePdfPages() {
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [result, setResult] = React.useState<DeletePagesResult | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    // pagesToDelete berisi nomor halaman (1-indexed, sesuai yang user lihat di UI)
    // yang mau dihapus, misal [2, 5] artinya hapus halaman 2 dan 5
    const deletePages = async (
        file: File,
        totalPages: number,
        pagesToDelete: number[]
    ) => {
        if (pagesToDelete.length === totalPages) {
            setError("Cannot delete all pages. At least 1 page must remain.")
            return
        }

        setIsProcessing(true)
        setError(null)
        setResult(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdf = await PDFDocument.load(arrayBuffer)

            // pdf-lib pakai index 0-based buat removePage, sedangkan UI kita
            // nampilin nomor halaman 1-based (Page 1, Page 2, dst).
            // Konversi dulu: nomor halaman 1 -> index 0, halaman 2 -> index 1, dst
            const indicesToDelete = pagesToDelete.map((pageNum) => pageNum - 1)

            // WAJIB dihapus dari index TERBESAR ke TERKECIL.
            // Kalau dihapus dari kecil ke besar, index halaman lain bakal geser
            // tiap kali 1 halaman dihapus, bikin salah hapus halaman yang berbeda.
            const sortedIndices = [...indicesToDelete].sort((a, b) => b - a)

            for (const index of sortedIndices) {
                pdf.removePage(index)
            }

            const remainingPages = pdf.getPageCount()
            const pdfBytes = await pdf.save()
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" })
            const previewUrl = URL.createObjectURL(blob)

            const baseName = file.name.replace(/\.[^/.]+$/, "")

            setResult({
                previewUrl,
                fileName: `${baseName}-editedbyPekaTools.pdf`,
                fileSize: blob.size,
                remainingPages,
            })
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to delete pages."
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

    return { deletePages, reset, isProcessing, result, error }
}