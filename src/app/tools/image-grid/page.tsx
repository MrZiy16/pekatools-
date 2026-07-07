import type { Metadata } from "next"
import { ImageGridTool } from "@/modules/image-grid/components/image-grid-tool"

export const metadata: Metadata = {
    title: "Image Grid / Collage Maker — Free Online Tool | PekaTools",
    description:
        "Combine multiple photos into a grid collage. Choose layout, gap, and size — free and private, runs in your browser.",
}

export default function ImageGridPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
                    Image Grid / Collage Maker
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Combine photos into a grid collage — free and private.
                </p>
            </div>

            <ImageGridTool />
        </main>
    )
}
