"use client"
// Wajib ada karena hook ini pakai useState (interactivity) dan Canvas API,
// FileReader, createImageBitmap — semua itu cuma tersedia di browser (client),
// gak ada di server. Kalau dihapus, Next.js bakal coba jalanin ini di server dan error.

import * as React from "react"

// Bentuk data hasil resize. Ini "kontrak" TypeScript — mastiin tiap kali kita
// bikin object ResizedResult, dia harus punya semua field ini dengan tipe yang benar.
export interface ResizedResult {
    originalFile: File        // file asli yang diupload user
    previewUrl: string        // URL sementara buat nampilin hasil resize di <img>
    originalWidth: number     // lebar gambar asli (buat ditampilin sbg perbandingan)
    originalHeight: number    // tinggi gambar asli
    newWidth: number          // lebar setelah di-resize
    newHeight: number         // tinggi setelah di-resize
    fileSize: number          // ukuran file hasil (bytes), buat ditampilin ke user
}

export function useImageResize() {
    // State loading — true selama proses resize berjalan.
    // Dipakai nanti di UI buat nampilin spinner / disable tombol.
    const [isProcessing, setIsProcessing] = React.useState(false)

    // State hasil resize. null kalau belum ada hasil, atau berisi ResizedResult
    // kalau proses udah selesai.
    const [result, setResult] = React.useState<ResizedResult | null>(null)

    // State pesan error. null kalau gak ada error.
    const [error, setError] = React.useState<string | null>(null)

    // Function utama yang dipanggil dari komponen UI, contoh: resize(file, 800, 600)
    const resize = async (
        file: File,
        targetWidth: number,
        targetHeight: number
    ) => {
        // Reset semua state di awal tiap kali mulai proses baru,
        // biar gak ada sisa data/error dari proses sebelumnya yang nyangkut.
        setIsProcessing(true)
        setError(null)
        setResult(null)

        try {
            // createImageBitmap = API browser buat "decode" file gambar jadi bitmap
            // yang siap digambar ke canvas. Ini async & non-blocking (gak nge-freeze UI),
            // beda sama cara lama pakai `new Image()` yang butuh nunggu event onload manual.
            const imageBitmap = await createImageBitmap(file)

            // Bikin elemen <canvas> secara manual di memory (gak ditempel ke DOM/halaman),
            // cuma dipakai sebagai "kanvas kerja" buat proses resize gambar.
            const canvas = document.createElement("canvas")
            canvas.width = targetWidth   // set lebar kanvas sesuai ukuran yang diminta user
            canvas.height = targetHeight // set tinggi kanvas sesuai ukuran yang diminta user

            // Ambil "context" 2D dari canvas — ini API yang dipakai buat gambar/manipulasi
            // pixel di dalam canvas.
            const ctx = canvas.getContext("2d")
            if (!ctx) throw new Error("Canvas not supported in this browser.")
            // ^ Guard clause: kalau browser super jadul yang gak support canvas 2D,
            // langsung lempar error yang jelas daripada nanti error aneh di baris berikutnya.

            // Ini inti dari proses resize: gambar ulang imageBitmap (ukuran asli)
            // ke dalam canvas yang ukurannya udah di-set ke targetWidth x targetHeight.
            // Browser otomatis handle interpolasi pixel (downscale atau upscale).
            ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight)

            // Convert isi canvas (yang sekarang berisi gambar hasil resize) jadi Blob
            // (mirip File, tapi tanpa nama). canvas.toBlob itu callback-based (bukan promise
            // asli), makanya kita bungkus manual pakai `new Promise` biar bisa di-await.
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, file.type, 0.9)
                // file.type -> pertahankan format asli (PNG tetap PNG, JPG tetap JPG)
                // 0.9 -> quality untuk format lossy (JPG). Untuk PNG param ini diabaikan
                // karena PNG itu lossless (gak ada konsep "quality").
            )

            if (!blob) throw new Error("Failed to process image.")
            // ^ toBlob bisa aja gagal (return null) di kasus tertentu (misal file corrupt),
            // jadi kita cek dulu sebelum lanjut.

            // Bikin URL sementara dari blob hasil resize, buat ditampilin sebagai
            // preview <img> di UI tanpa perlu upload kemana-mana.
            const previewUrl = URL.createObjectURL(blob)

            // Simpan semua data hasil ke state `result`. Begitu ini dipanggil,
            // React otomatis re-render komponen yang pakai hook ini.
            setResult({
                originalFile: file,
                previewUrl,
                originalWidth: imageBitmap.width,   // dimensi asli, buat perbandingan di UI
                originalHeight: imageBitmap.height,
                newWidth: targetWidth,
                newHeight: targetHeight,
                fileSize: blob.size,
            })
        } catch (err) {
            // Nangkep semua error yang mungkin terjadi di atas (createImageBitmap gagal,
            // canvas gak didukung, toBlob gagal, dll), terus disimpan sebagai pesan
            // yang gampang dibaca user.
            setError(
                err instanceof Error ? err.message : "Failed to resize image."
            )
        } finally {
            // finally SELALU jalan, baik sukses maupun gagal.
            // Mastiin loading state selalu dimatiin di akhir, user gak stuck lihat spinner.
            setIsProcessing(false)
        }
    }

    // Function buat clear hasil / mulai ulang (dipanggil misal tombol "Resize Another")
    const reset = () => {
        // WAJIB revoke object URL sebelum di-clear, kalau enggak, URL lama
        // numpuk terus di memory browser walau udah gak dipakai (memory leak)
        // tiap kali user resize gambar berkali-kali dalam satu session.
        if (result?.previewUrl) {
            URL.revokeObjectURL(result.previewUrl)
        }
        setResult(null)
        setError(null)
    }

    // Yang di-expose keluar ke komponen UI. Komponen cuma perlu tau
    // "apa yang bisa dipanggil" (resize, reset) dan "apa yang bisa dibaca"
    // (isProcessing, result, error) — tanpa perlu tau detail proses di dalamnya.
    return { resize, reset, isProcessing, result, error }
}