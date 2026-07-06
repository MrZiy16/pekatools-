import type { LucideIcon } from "lucide-react"
import {
    ImageDown,
    Maximize2,
    FileImage,
    FileType,
    Droplets,
    FileStack,
    FileMinus,
    FileUp,
    QrCode,
    ScanLine,
} from "lucide-react"

export type ToolCategory = "image" | "pdf" | "qr"

export interface Tool {
    slug: string
    name: string
    shortDescription: string
    category: ToolCategory
    icon: LucideIcon
    status: "live" | "coming-soon"
}

export const categories: Record<ToolCategory, { label: string; description: string }> = {
    image: {
        label: "Image Tools",
        description: "Compress, resize, and convert images entirely in your browser.",
    },
    pdf: {
        label: "PDF Tools",
        description: "Merge, edit, and create PDFs without uploading to any server.",
    },
    qr: {
        label: "QR Tools",
        description: "Generate custom QR codes instantly, free and unlimited.",
    },
}

export const tools: Tool[] = [
    {
        slug: "image-compressor",
        name: "Image Compressor",
        shortDescription: "Reduce image file size without losing quality.",
        category: "image",
        icon: ImageDown,
        status: "live",
    },
    {
        slug: "image-resize",
        name: "Image Resize",
        shortDescription: "Resize images to any dimension in seconds.",
        category: "image",
        icon: Maximize2,
        status: "live",
    },
    {
        slug: "png-to-jpg",
        name: "PNG to JPG",
        shortDescription: "Convert PNG images to JPG format.",
        category: "image",
        icon: FileImage,
        status: "live",
    },
    {
        slug: "jpg-to-png",
        name: "JPG to PNG",
        shortDescription: "Convert JPG images to PNG format.",
        category: "image",
        icon: FileType,
        status: "live",
    },
    {
        slug: "png-to-webp",
        name: "PNG to WebP",
        shortDescription: "Convert PNG images to modern WebP format.",
        category: "image",
        icon: FileImage,
        status: "live",
    },
    {
        slug: "webp-to-png",
        name: "WebP to PNG",
        shortDescription: "Convert WebP images back to PNG format.",
        category: "image",
        icon: FileType,
        status: "coming-soon",
    },
    {
        slug: "watermark-image",
        name: "Watermark Image",
        shortDescription: "Add text or logo watermark to your images.",
        category: "image",
        icon: Droplets,
        status: "live",
    },
    {
        slug: "merge-pdf",
        name: "Merge PDF",
        shortDescription: "Combine multiple PDF files into one document.",
        category: "pdf",
        icon: FileStack,
        status: "live",
    },
    {
        slug: "delete-pdf-page",
        name: "Delete PDF Page",
        shortDescription: "Remove unwanted pages from a PDF file.",
        category: "pdf",
        icon: FileMinus,
        status: "live",
    },
    {
        slug: "image-to-pdf",
        name: "Image to PDF",
        shortDescription: "Convert images into a single PDF document.",
        category: "pdf",
        icon: FileUp,
        status: "live",
    },
    {
        slug: "qr-generator",
        name: "QR Generator",
        shortDescription: "Create custom QR codes for free, instantly.",
        category: "qr",
        icon: QrCode,
        status: "live",
    },
    {
        slug: "qr-generator-logo",
        name: "QR Generator with Logo",
        shortDescription: "Generate QR codes with your own logo embedded.",
        category: "qr",
        icon: ScanLine,
        status: "live",
    },
]

export function getToolsByCategory(category: ToolCategory): Tool[] {
    return tools.filter((tool) => tool.category === category)
}

export function getToolBySlug(slug: string): Tool | undefined {
    return tools.find((tool) => tool.slug === slug)
}