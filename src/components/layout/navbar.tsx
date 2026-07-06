"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ImageIcon, FileText, QrCode, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
    { label: "Image Tools", href: "/tools#image", icon: ImageIcon },
    { label: "PDF Tools", href: "/tools#pdf", icon: FileText },
    { label: "QR Tools", href: "/tools#qr", icon: QrCode },
]

export function Navbar() {
    const [open, setOpen] = React.useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                    <span className="text-primary">Peka</span>Tools
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="w-[85vw] max-w-sm bg-background p-0"
                        >
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                            <div className="flex flex-col h-full">
                                {/* Header kecil di dalam sheet, konsisten sama navbar utama */}
                                <div className="flex items-center h-16 px-5 border-b border-border">
                                    <span className="font-semibold text-lg">
                                        <span className="text-primary">Peka</span>Tools
                                    </span>
                                </div>

                                {/* Nav links jadi "row" yang jelas, bukan teks polos */}
                                <nav className="flex flex-col p-3">
                                    {navLinks.map((link) => {
                                        const Icon = link.icon
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                                            >
                                                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                                                    <Icon className="h-4 w-4 text-primary" />
                                                </span>
                                                {link.label}
                                            </Link>
                                        )
                                    })}
                                </nav>

                                <div className="mt-auto border-t border-border p-5">
                                    <Button asChild className="w-full" onClick={() => setOpen(false)}>
                                        <Link href="/tools">
                                            Explore All Tools
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}