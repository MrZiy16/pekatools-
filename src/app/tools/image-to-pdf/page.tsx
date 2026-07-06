import type { Metadata } from "next"
import { ImageToPdfTool } from "@/modules/image-to-pdf/components/image-to-pdf-tool"

export const metadata: Metadata = {
    title: "Image to PDF — Free Online Tool | PekaTools",
    description: "Convert images into a single PDF document for free. Fast, private, works entirely in your browser.",
}

export default function ImageToPdfPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    Image to PDF
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Convert your images into a single PDF document — free and private.
                </p>
            </div>

            <ImageToPdfTool />
        </main>
    )
}