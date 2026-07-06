import type { Metadata } from "next"
import { QrGeneratorLogoTool } from "@/modules/qr-generator/components/qr-generator-logo-tool"

export const metadata: Metadata = {
    title: "QR Generator with Logo — Free Online Tool | PekaTools",
    description: "Generate custom QR codes with your own logo embedded, for free. Fast, private, works entirely in your browser.",
}

export default function QrGeneratorLogoPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    QR Generator with Logo
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Generate QR codes with your own logo embedded — free and private.
                </p>
            </div>

            <QrGeneratorLogoTool />
        </main>
    )
}