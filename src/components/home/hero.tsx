"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ImageDown, FileStack, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"

// 3 "bukti" yang di-cycle otomatis di kartu signature — merepresentasikan
// 3 kategori tool secara ringkas, biar user langsung "lihat" value proposition
// tanpa perlu baca paragraf panjang.
const proofStates = [
    {
        icon: ImageDown,
        label: "Compress",
        detail: "2.4 MB → 640 KB",
        accent: "text-primary",
    },
    {
        icon: FileStack,
        label: "Merge PDF",
        detail: "3 files → 1 document",
        accent: "text-violet-500 dark:text-violet-400",
    },
    {
        icon: QrCode,
        label: "Generate QR",
        detail: "Any link, instantly",
        accent: "text-primary",
    },
]

export function Hero() {
    const [activeIndex, setActiveIndex] = React.useState(0)

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % proofStates.length)
        }, 2600)
        return () => clearInterval(interval)
    }, [])

    const active = proofStates[activeIndex]
    const Icon = active.icon

    return (
        <section className="relative overflow-hidden">
            {/* Ambient gradient blobs — samar, cuma buat kasih "depth" di background,
          bukan elemen yang menarik perhatian sendiri */}
            <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute top-32 right-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
                <div className="grid items-center gap-12 md:grid-cols-2">
                    {/* Kolom kiri: copy, left-aligned (bukan center) */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            No uploads. No sign-up. 100% free.
                        </div>

                        <h1 className="font-heading mt-6 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground text-balance">
                            Every file tool you need,{" "}
                            <span className="text-primary">right in your browser</span>
                        </h1>

                        <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                            Compress images, merge PDFs, generate QR codes — twelve tools
                            that run entirely on your device. Nothing you upload ever
                            leaves your browser.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Button size="lg" asChild>
                                <Link href="/tools">
                                    Explore Tools
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Kolom kanan: signature element — kartu yang cycle otomatis */}
                    <div className="relative flex justify-center md:justify-end">
                        <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <p className="text-xs font-medium text-muted-foreground">
                                Live preview
                            </p>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="mt-4"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                                        <Icon className={`h-6 w-6 ${active.accent}`} />
                                    </div>
                                    <p className="mt-4 font-medium text-foreground">
                                        {active.label}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {active.detail}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-6 flex gap-1.5">
                                {proofStates.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-colors ${i === activeIndex ? "bg-primary" : "bg-border"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}