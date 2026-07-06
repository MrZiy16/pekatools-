import type { Metadata } from "next"
import { ConverterTool } from "@/modules/image-converter/components/converter-tool"

export const metadata: Metadata = {
    title: "JPG to PNG Converter — Free Online Tool | PekaTools",
    description: "Convert JPG images to PNG format for free. Fast, private, works entirely in your browser.",
}

export default function JpgToPngPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    JPG to PNG Converter
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Convert your JPG images to PNG format — free and private.
                </p>
            </div>

            <ConverterTool targetFormat="image/png" acceptedInputTypes="image/jpeg" />
        </main>
    )
}