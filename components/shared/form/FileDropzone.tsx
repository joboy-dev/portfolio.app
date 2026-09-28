"use client"

import React, { useCallback, useRef, useState } from 'react'
import { UploadCloud, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { formatFileSize } from '@/lib/utils/file'
import type { FileInterface } from '@/lib/interfaces/file'

interface QueuedFile {
  id: string
  file: File
  previewUrl?: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}

export interface FileDropzoneProps {
  /** Uploads a single file (caller decides which endpoint/thunk to hit). Reject/throw on failure. */
  onUpload: (file: File) => Promise<FileInterface | undefined>
  /** Called once per batch with every file that uploaded successfully. */
  onUploaded?: (results: FileInterface[]) => void
  accept?: string
  maxSizeMB?: number
  multiple?: boolean
  label?: string
  helperText?: string
  className?: string
}

const DEFAULT_MAX_MB = 10 // matches backend FILE_UPLOAD_LIMIT_MB

export default function FileDropzone({
  onUpload,
  onUploaded,
  accept,
  maxSizeMB = DEFAULT_MAX_MB,
  multiple = false,
  label = "Drop a file here or click to browse",
  helperText,
  className,
}: FileDropzoneProps) {
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = (file: File): string | null => {
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return `Larger than ${maxSizeMB}MB`
    }
    if (accept && accept !== "*") {
      const patterns = accept.split(',').map((p) => p.trim())
      const matches = patterns.some((pattern) => {
        if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase())
        if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1))
        return file.type === pattern
      })
      if (!matches) return `Not an accepted file type`
    }
    return null
  }

  const uploadOne = async (item: QueuedFile): Promise<FileInterface | undefined> => {
    setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading' } : q)))
    try {
      const result = await onUpload(item.file)
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: 'done' } : q)))
      return result
    } catch {
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: 'Upload failed' } : q)))
      return undefined
    }
  }

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList).slice(0, multiple ? undefined : 1)
      const items: QueuedFile[] = incoming.map((file) => {
        const error = validate(file)
        return {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          status: error ? 'error' : 'pending',
          error: error ?? undefined,
        }
      })

      setQueue((prev) => (multiple ? [...prev, ...items] : items))

      const results: FileInterface[] = []
      for (const item of items) {
        if (item.status === 'error') continue
        const result = await uploadOne(item)
        if (result) results.push(result)
      }
      // Fires once per batch regardless of how many results came back non-
      // empty — some callers (eg. a cover-image upload backed by a
      // model-specific route, not the generic File model) only care that
      // the upload finished, not what this hook returns.
      if (items.some((item) => item.status !== 'error')) onUploaded?.(results)
    },
    // validate/uploadOne/onUploaded intentionally excluded: they close over
    // component state (queue) every render, and this callback only needs to
    // re-derive when the actual validation/upload inputs change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [multiple, accept, maxSizeMB]
  )

  const removeItem = (id: string) => setQueue((prev) => prev.filter((q) => q.id !== id))

  return (
    <div className={clsx("w-full", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
        }}
        className={clsx(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          isDragging ? "border-primary bg-primary-soft" : "border-border hover:border-primary/50 hover:bg-muted/40"
        )}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          {helperText ?? `Up to ${maxSizeMB}MB${accept && accept !== "*" ? ` · ${accept}` : ''}`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      {queue.length > 0 && (
        <ul className="mt-3 space-y-2">
          {queue.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-md border border-border bg-card p-2">
              {item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.previewUrl} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded bg-muted shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{item.file.name}</p>
                <p className={clsx("text-xs", item.error ? "text-destructive" : "text-muted-foreground")}>
                  {item.error ?? formatFileSize(item.file.size)}
                </p>
              </div>
              {item.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />}
              {item.status === 'done' && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
              {item.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive shrink-0" />}
              {item.status !== 'uploading' && (
                <button
                  type="button"
                  aria-label={`Remove ${item.file.name}`}
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
