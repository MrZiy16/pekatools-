import type { Metadata } from "next"
import Link from "next/link"

import { categories, tools, type ToolCategory } from "@/lib/tools-data"

export const metadata: Metadata = {
    title: "All Tools — PekaTools",
    description: "Browse all 12 free productivity tools. Compress images, merge PDFs, generate QR codes, and more — all running entirely in your browser.",
}

export default function ToolsPage() {
    const categoryKeys = Object.keys(categories) as ToolCategory[]

    return (
        <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <div className="mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    All Tools
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Everything you need, free and private — no uploads, no sign-up.
                </p>
            </div>

            {categoryKeys.map((categoryKey) => {
                const categoryTools = tools.filter((tool) => tool.category === categoryKey)

                return (
                    <div key={categoryKey} id={categoryKey} className="mb-14 scroll-mt-20">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-foreground">
                                {categories[categoryKey].label}
                            </h2>
                            <p className="mt-1 text-muted-foreground">
                                {categories[categoryKey].description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryTools.map((tool) => {
                                const Icon = tool.icon

                                return (
                                    <Link
                                        key={tool.slug}
                                        href={`/tools/${tool.slug}`}
                                        className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <h3 className="mt-4 font-medium text-foreground">
                                            {tool.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {tool.shortDescription}
                                        </p>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </main>
    )
}