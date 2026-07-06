import Link from "next/link"

import { categories, tools, type ToolCategory } from "@/lib/tools-data"

export function FeaturedTools() {
    const categoryKeys = Object.keys(categories) as ToolCategory[]

    return (
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            {categoryKeys.map((categoryKey) => {
                const categoryTools = tools.filter((tool) => tool.category === categoryKey)

                return (
                    <div key={categoryKey} className="mb-14">
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
                                const isLive = tool.status === "live"

                                const cardContent = (
                                    <div
                                        className={`group relative rounded-xl border border-border bg-card p-5 transition-all ${isLive
                                                ? "hover:border-primary/50 hover:shadow-md cursor-pointer"
                                                : "opacity-60 cursor-not-allowed"
                                            }`}
                                    >
                                        {!isLive && (
                                            <span className="absolute top-3 right-3 text-xs font-medium text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                                                Coming Soon
                                            </span>
                                        )}

                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>

                                        <h3 className="mt-4 font-medium text-foreground">
                                            {tool.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {tool.shortDescription}
                                        </p>
                                    </div>
                                )

                                if (!isLive) {
                                    return <div key={tool.slug}>{cardContent}</div>
                                }

                                return (
                                    <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                                        {cardContent}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </section>
    )
}