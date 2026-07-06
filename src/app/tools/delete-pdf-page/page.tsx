import type { Metadata } from "next"
import { DeletePdfTool } from "@/modules/delete-pdf-page/components/delete-pdf-tool"

export const metadata: Metadata = {
    title: "Delete PDF Page — Free Online Tool | PekaTools",
    description: "Remove unwanted pages from a PDF file for free. Fast, private, works entirely in your browser.",
}

export default function DeletePdfPagePage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    Delete PDF Page
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Remove unwanted pages from your PDF — free and private.
                </p>
            </div>

            <DeletePdfTool />
        </main>
    )
}