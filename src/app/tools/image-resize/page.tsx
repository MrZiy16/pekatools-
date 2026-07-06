import type { Metadata } from "next"
import { ResizeTool } from "@/modules/image-resize/components/resize-tool"

export const metadata: Metadata = {
    title: "Image Resize — Free Online Tool | PekaTools",
    description: "Resize images to any dimension for free. Fast, private, works entirely in your browser.",
}

export default function ImageResizePage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    Image Resize
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Resize your images to any dimension — free and private.
                </p>
            </div>

            <ResizeTool />
        </main>
    )
}