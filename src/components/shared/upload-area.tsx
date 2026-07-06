"use client"

import * as React from "react"
import { UploadCloud } from "lucide-react"

interface UploadAreaProps {
    accept: string
    multiple?: boolean
    onFilesSelected: (files: File[]) => void
    label?: string
    hint?: string
}

export function UploadArea({
    accept,
    multiple = false,
    onFilesSelected,
    label = "Drag & drop your file here",
    hint = "or click to browse",
}: UploadAreaProps) {
    const [isDragging, setIsDragging] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return
        const files = Array.from(fileList)
        onFilesSelected(multiple ? files : [files[0]])
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
    }

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
            }}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-secondary/50"
                }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <UploadCloud className="h-6 w-6 text-primary" />
            </div>

            <p className="mt-4 font-medium text-foreground">{label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        </div>
    )
}