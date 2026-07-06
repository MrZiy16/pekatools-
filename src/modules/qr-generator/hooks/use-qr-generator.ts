"use client"

import * as React from "react"
import QRCode from "qrcode"

export interface QrOptions {
    text: string
    size: number
    darkColor: string
    lightColor: string
    logoFile?: File | null
}

export function useQrGenerator() {
    const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null)
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const generate = React.useCallback(async (options: QrOptions) => {
        if (!options.text.trim()) {
            setQrDataUrl(null)
            setError(null)
            return
        }

        setIsGenerating(true)
        setError(null)

        try {
            // errorCorrectionLevel "H" (High) itu WAJIB kalau bakal ada logo,
            // karena ini yang bikin QR tetap bisa dibaca walau bagian tengahnya
            // ketutup logo. Tanpa ini, kemungkinan besar QR jadi gak valid.
            const dataUrl = await QRCode.toDataURL(options.text, {
                width: options.size,
                margin: 2,
                errorCorrectionLevel: "H",
                color: {
                    dark: options.darkColor,
                    light: options.lightColor,
                },
            })

            // Kalau gak ada logo, langsung pakai hasil QR polos
            if (!options.logoFile) {
                setQrDataUrl(dataUrl)
                return
            }

            // Kalau ada logo, gabungkan QR + logo lewat canvas
            const combined = await overlayLogo(dataUrl, options.logoFile, options.size)
            setQrDataUrl(combined)
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to generate QR code."
            )
        } finally {
            setIsGenerating(false)
        }
    }, [])

    return { generate, qrDataUrl, isGenerating, error }
}

// Function terpisah (bukan di dalam hook) karena ini pure logic canvas,
// gak butuh akses ke state React apapun — lebih gampang dibaca & di-test
// kalau dipisah dari function utama.
async function overlayLogo(
    qrDataUrl: string,
    logoFile: File,
    qrSize: number
): Promise<string> {
    const qrImage = await loadImage(qrDataUrl)
    const logoImage = await loadImage(URL.createObjectURL(logoFile))

    const canvas = document.createElement("canvas")
    canvas.width = qrSize
    canvas.height = qrSize

    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas not supported in this browser.")

    // Gambar QR-nya dulu sebagai base layer
    ctx.drawImage(qrImage, 0, 0, qrSize, qrSize)

    // Logo dibatasi maksimal 22% dari ukuran QR, biar error correction
    // QR-nya masih cukup buat nutupin bagian yang ketutup logo
    const logoSize = qrSize * 0.22
    const logoX = (qrSize - logoSize) / 2
    const logoY = (qrSize - logoSize) / 2

    // Background putih di belakang logo, biar logo transparan (PNG)
    // tetap kebaca jelas, gak nyampur sama pola QR di belakangnya
    const padding = logoSize * 0.1
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(
        logoX - padding,
        logoY - padding,
        logoSize + padding * 2,
        logoSize + padding * 2
    )

    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)

    return canvas.toDataURL("image/png")
}

// Helper: convert URL (data URL atau object URL) jadi HTMLImageElement
// yang siap digambar ke canvas. Dibungkus Promise karena loading image
// itu event-based (onload), bukan native async/await.
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}