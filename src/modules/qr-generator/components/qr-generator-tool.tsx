"use client"

import * as React from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useQrGenerator } from "../hooks/use-qr-generator"

export function QrGeneratorTool() {
    const { generate, qrDataUrl, isGenerating, error } = useQrGenerator()

    const [text, setText] = React.useState("")
    const [size, setSize] = React.useState([300])
    const [darkColor, setDarkColor] = React.useState("#000000")
    const [lightColor, setLightColor] = React.useState("#FFFFFF")

    // Debounce: tiap kali salah satu input berubah (text/size/warna),
    // tunggu 400ms dulu sebelum benar-benar generate QR. Kalau dalam 400ms
    // itu user ngetik huruf lagi, timer di-reset ulang (generate lama dibatalkan).
    React.useEffect(() => {
        const timer = setTimeout(() => {
            generate({ text, size: size[0], darkColor, lightColor })
        }, 400)

        // Cleanup function ini yang bikin debounce jalan — tiap kali effect ini
        // dijalankan ulang (karena salah satu dependency berubah), timer yang
        // LAMA di-clear duluan sebelum bikin timer baru
        return () => clearTimeout(timer)
    }, [text, size, darkColor, lightColor, generate])

    const handleDownload = () => {
        if (!qrDataUrl) return
        const link = document.createElement("a")
        link.href = qrDataUrl
        link.download = "qrcode.png"
        link.click()
    }

    return (
        <div className="mx-auto max-w-3xl grid md:grid-cols-2 gap-8">
            {/* Kolom kiri: input & kontrol */}
            <div className="space-y-5">
                <div>
                    <Label htmlFor="qr-text">Text or URL</Label>
                    <Input
                        id="qr-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="https://example.com or any text"
                        className="mt-1.5"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <Label>Size</Label>
                        <span className="text-sm text-muted-foreground">{size[0]}px</span>
                    </div>
                    <Slider
                        value={size}
                        onValueChange={setSize}
                        min={100}
                        max={600}
                        step={20}
                        className="mt-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="qr-dark">QR Color</Label>
                        <div className="mt-1.5 flex items-center gap-2">
                            <input
                                id="qr-dark"
                                type="color"
                                value={darkColor}
                                onChange={(e) => setDarkColor(e.target.value)}
                                className="h-9 w-14 rounded-md border border-border cursor-pointer bg-transparent"
                            />
                            <span className="text-sm text-muted-foreground">{darkColor}</span>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="qr-light">Background</Label>
                        <div className="mt-1.5 flex items-center gap-2">
                            <input
                                id="qr-light"
                                type="color"
                                value={lightColor}
                                onChange={(e) => setLightColor(e.target.value)}
                                className="h-9 w-14 rounded-md border border-border cursor-pointer bg-transparent"
                            />
                            <span className="text-sm text-muted-foreground">{lightColor}</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                        {error}
                    </div>
                )}
            </div>

            {/* Kolom kanan: preview QR + tombol download */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8">
                {!text.trim() && (
                    <p className="text-center text-sm text-muted-foreground">
                        Enter text or a URL to generate your QR code
                    </p>
                )}

                {text.trim() && isGenerating && !qrDataUrl && (
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}

                {qrDataUrl && (
                    <>
                        <img
                            src={qrDataUrl}
                            alt="Generated QR code"
                            className="max-w-full rounded-lg"
                        />
                        <Button onClick={handleDownload} className="mt-6 w-full">
                            <Download className="h-4 w-4" />
                            Download PNG
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}