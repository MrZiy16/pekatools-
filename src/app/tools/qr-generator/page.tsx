import type { Metadata } from "next"
import { QrGeneratorTool } from "@/modules/qr-generator/components/qr-generator-tool"

export const metadata: Metadata = {
    title: "QR Code Generator — Free Online Tool | PekaTools",
    description: "Generate custom QR codes for free, instantly. Fast, private, works entirely in your browser.",
}

export default function QrGeneratorPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    QR Code Generator
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Create custom QR codes for free, instantly — free and private.
                </p>
            </div>

            <QrGeneratorTool />
        </main>
    )
}