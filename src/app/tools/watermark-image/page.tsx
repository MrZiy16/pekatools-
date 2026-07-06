import type { Metadata } from "next"
import { WatermarkTool } from "@/modules/watermark-image/components/watermark-tool"

export const metadata: Metadata = {
    title: "Watermark Image — Free Online Tool | PekaTools",
    description: "Add a text watermark to your images for free. Fast, private, works entirely in your browser.",
}

export default function WatermarkImagePage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    Watermark Image
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Add a custom text watermark to your images — free and private.
                </p>
            </div>

            <WatermarkTool />
        </main>
    )
}