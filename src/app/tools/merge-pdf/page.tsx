import type { Metadata } from "next"
import { MergePdfTool } from "@/modules/merge-pdf/components/merge-pdf-tool"

export const metadata: Metadata = {
    title: "Merge PDF — Free Online Tool | PekaTools",
    description: "Combine multiple PDF files into one document for free. Fast, private, works entirely in your browser.",
}

export default function MergePdfPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    Merge PDF
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Combine multiple PDF files into one — free and private.
                </p>
            </div>

            <MergePdfTool />
        </main>
    )
}