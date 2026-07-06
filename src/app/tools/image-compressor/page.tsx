import type { Metadata } from "next"
import { CompressorTool } from "@/modules/image-compressor/components/compressor-tool"

export const metadata: Metadata = {
    title: "Image Compressor — Free Online Tool | PekaTools",
    description: "Compress images online for free. Reduce file size without losing quality — fast, private, works entirely in your browser.",
}

export default function ImageCompressorPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    Image Compressor
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Reduce your image file size without losing quality — free and private.
                </p>
            </div>

            <CompressorTool />
        </main>
    )
}