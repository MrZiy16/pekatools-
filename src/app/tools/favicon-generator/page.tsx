import type { Metadata } from "next"
import { FaviconGeneratorTool } from "@/modules/favicon-generator/components/favicon-generator-tool"

export const metadata: Metadata = {
    title: "Favicon Generator — Free Online Tool | PekaTools",
    description:
        "Generate favicon PNG files in all standard sizes from one image. Free, private, works entirely in your browser.",
}

export default function FaviconGeneratorPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
                    Favicon Generator
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Create all standard favicon sizes from one image — free and private.
                </p>
            </div>

            <FaviconGeneratorTool />
        </main>
    )
}
