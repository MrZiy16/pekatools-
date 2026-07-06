"use client"
// Wajib, karena komponen ini pakai useState, event handler (onClick, onChange),
// dan browser API (createImageBitmap) — semua butuh jalan di client, bukan server.

import * as React from "react"
import Image from "next/image"
import { Download, RotateCcw, Lock, Unlock } from "lucide-react"

import { UploadArea } from "@/components/shared/upload-area"   // komponen upload reusable dari Phase 2
import { Button } from "@/components/ui/button"                 // shadcn button
import { Input } from "@/components/ui/input"                   // shadcn input, buat field width/height
import { Switch } from "@/components/ui/switch"                 // shadcn toggle, buat lock aspect ratio
import { useImageResize } from "../hooks/use-image-resize"    // hook logic resize yang kita buat sebelumnya
import { formatBytes } from "@/lib/utils/format-bytes"                 // helper format ukuran file (KB/MB)

export function ResizeTool() {
    // Ambil semua yang di-expose dari hook: function resize/reset,
    // dan state isProcessing/result/error
    const { resize, reset, isProcessing, result, error } = useImageResize()

    // State file yang lagi "dipegang" user SEBELUM di-resize.
    // Ini beda dari result.originalFile di hook — file ini dipakai
    // buat nampilin form input width/height dulu, baru nanti dikirim ke resize().
    const [file, setFile] = React.useState<File | null>(null)

    // Nyimpen dimensi asli gambar (buat ditampilin sebagai referensi ke user,
    // dan buat ngitung aspect ratio)
    const [originalDimensions, setOriginalDimensions] = React.useState({ width: 0, height: 0 })

    // State input width & height yang bisa diedit user
    const [width, setWidth] = React.useState(0)
    const [height, setHeight] = React.useState(0)

    // Toggle: kalau true, ubah width otomatis ngitung ulang height (dan sebaliknya)
    // supaya gambar gak gepeng/stretched
    const [lockAspectRatio, setLockAspectRatio] = React.useState(true)

    // Rasio lebar:tinggi asli, dihitung ulang tiap render dari originalDimensions.
    // Ini "derived value" — gak perlu state sendiri karena bisa dihitung dari state lain.
    const aspectRatio = originalDimensions.width / originalDimensions.height

    // Dipanggil begitu user pilih file dari UploadArea.
    // Di sini kita CUMA baca dimensi gambar dulu — belum resize beneran.
    const handleFilesSelected = async (files: File[]) => {
        const selectedFile = files[0]
        if (!selectedFile) return

        // createImageBitmap dipakai lagi di sini cuma buat "intip" ukuran asli gambar
        // (width & height), tanpa perlu proses resize apapun dulu
        const bitmap = await createImageBitmap(selectedFile)

        setFile(selectedFile)
        setOriginalDimensions({ width: bitmap.width, height: bitmap.height })
        // Set nilai awal input width/height = ukuran asli, biar user tinggal
        // sesuaikan dari situ, bukan mulai dari 0
        setWidth(bitmap.width)
        setHeight(bitmap.height)
    }

    // Dipanggil tiap kali user ngetik di field Width
    const handleWidthChange = (value: number) => {
        setWidth(value)
        // Kalau lock aktif, hitung ulang height biar proporsional:
        // height baru = width baru / rasio asli
        if (lockAspectRatio && aspectRatio) {
            setHeight(Math.round(value / aspectRatio))
        }
    }

    // Sama seperti di atas, tapi arah sebaliknya: user ngetik di field Height
    const handleHeightChange = (value: number) => {
        setHeight(value)
        // width baru = height baru * rasio asli
        if (lockAspectRatio && aspectRatio) {
            setWidth(Math.round(value * aspectRatio))
        }
    }

    // Dipanggil pas user klik tombol "Resize Image".
    // Baru di sini proses resize BENERAN dijalankan (manggil hook)
    const handleResize = () => {
        if (file && width > 0 && height > 0) {
            resize(file, width, height)
        }
    }

    // Trigger download file hasil resize — trik yang sama kayak di compressor:
    // bikin elemen <a> tersembunyi, arahkan ke previewUrl, lalu klik programmatic
    const handleDownload = () => {
        if (!result) return
        const link = document.createElement("a")
        link.href = result.previewUrl
        link.download = `resized-${result.originalFile.name}`
        link.click()
    }

    // Reset total: bersihin state dari hook (result, error, revoke object URL)
    // SEKALIGUS bersihin state lokal komponen ini (file, dimensi) biar
    // balik ke tampilan upload dari awal
    const handleReset = () => {
        reset()
        setFile(null)
        setOriginalDimensions({ width: 0, height: 0 })
    }

    return (
        <div className="mx-auto max-w-2xl">
            {/* KONDISI 1: belum ada file sama sekali -> tampilkan area upload */}
            {!file && (
                <UploadArea
                    accept="image/*"
                    onFilesSelected={handleFilesSelected}
                    label="Drag & drop your image here"
                    hint="Supports JPG, PNG, WebP — or click to browse"
                />
            )}

            {/* KONDISI 2: file udah dipilih TAPI belum di-resize -> tampilkan form
          input width/height + toggle lock aspect ratio */}
            {file && !result && (
                <div className="rounded-xl border border-border bg-card p-6">
                    {/* Info dimensi asli, biar user tau titik awal sebelum ubah angka */}
                    <p className="text-sm text-muted-foreground">
                        Original: {originalDimensions.width} × {originalDimensions.height}px
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">Width (px)</label>
                            <Input
                                type="number"
                                value={width}
                                // Number(e.target.value) -> convert string dari input jadi number,
                                // karena HTML input value selalu string walau type="number"
                                onChange={(e) => handleWidthChange(Number(e.target.value))}
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">Height (px)</label>
                            <Input
                                type="number"
                                value={height}
                                onChange={(e) => handleHeightChange(Number(e.target.value))}
                                className="mt-1.5"
                            />
                        </div>
                    </div>

                    {/* Toggle lock aspect ratio, dengan icon yang berubah (Lock/Unlock)
              sesuai state-nya biar user langsung ngerti statusnya secara visual */}
                    <div className="mt-4 flex items-center gap-2">
                        <Switch
                            checked={lockAspectRatio}
                            onCheckedChange={setLockAspectRatio}
                            id="lock-ratio"
                        />
                        <label htmlFor="lock-ratio" className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            {lockAspectRatio ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                            Lock aspect ratio
                        </label>
                    </div>

                    <div className="mt-6 flex gap-3">
                        {/* disabled={isProcessing} -> cegah user klik berkali-kali
                selagi proses resize masih jalan */}
                        <Button onClick={handleResize} disabled={isProcessing} className="flex-1">
                            {isProcessing ? "Resizing..." : "Resize Image"}
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* KONDISI 3: ada error dari proses resize -> tampilkan pesan error.
          Ini render terpisah (bukan exclusive kayak 3 kondisi lain),
          bisa muncul bareng kondisi manapun kalau error terjadi */}
            {error && (
                <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* KONDISI 4: resize udah selesai -> tampilkan hasil + tombol download/reset */}
            {result && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-4">
                        {/* Thumbnail preview hasil resize */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border">
                            <Image
                                src={result.previewUrl}
                                alt="Resized preview"
                                fill
                                className="object-cover"
                                unoptimized
                            // unoptimized wajib karena previewUrl itu blob URL (data sementara
                            // di browser), Next.js Image Optimization gak bisa proses itu
                            />
                        </div>

                        <div className="flex-1">
                            <p className="font-medium text-foreground truncate">
                                {result.originalFile.name}
                            </p>
                            {/* Nampilin perbandingan dimensi sebelum -> sesudah */}
                            <p className="text-sm text-muted-foreground">
                                {result.originalWidth}×{result.originalHeight} → {result.newWidth}×{result.newHeight}
                            </p>
                            {/* Ukuran file hasil, diformat jadi KB/MB yang manusiawi */}
                            <p className="text-sm text-muted-foreground">
                                {formatBytes(result.fileSize)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button onClick={handleDownload} className="flex-1">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4" />
                            Resize Another
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}