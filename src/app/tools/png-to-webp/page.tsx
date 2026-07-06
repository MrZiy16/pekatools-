import type { Metadata } from "next"
import { ConverterTool } from "@/modules/image-converter/components/converter-tool"

export const metadata: Metadata = {
    title: "PNG to WebP Converter — Free Online Tool | PekaTools",
    description: "Convert PNG images to WebP format for free. Smaller file size, same quality — works entirely in your browser.",
}

export default function PngToWebpPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    PNG to WebP Converter
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Convert your PNG images to modern WebP format — free and private.
                </p>
            </div>

            <ConverterTool targetFormat="image/webp" acceptedInputTypes="image/png" />
        </main>
    )
}