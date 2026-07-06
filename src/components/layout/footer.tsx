import Link from "next/link"
import { categories, getToolsByCategory, type ToolCategory } from "@/lib/tools-data"

export function Footer() {
    const categoryKeys = Object.keys(categories) as ToolCategory[]

    return (
        <footer className="mt-auto border-t border-border bg-background">
            <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="font-semibold text-lg">
                            <span className="text-primary">Peka</span>Tools
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Free online tools that work entirely in your browser. No uploads, no waiting.
                        </p>
                    </div>

                    {categoryKeys.map((categoryKey) => {
                        const categoryTools = getToolsByCategory(categoryKey)

                        return (
                            <div key={categoryKey}>
                                <h3 className="text-sm font-semibold text-foreground">
                                    {categories[categoryKey].label}
                                </h3>
                                <ul className="mt-3 space-y-2">
                                    {categoryTools.map((tool) => (
                                        <li key={tool.slug}>
                                            <Link
                                                href={`/tools/${tool.slug}`}
                                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                {tool.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
                    © {new Date().getFullYear()} PekaTools. All rights reserved.
                </div>
            </div>
        </footer>
    )
}