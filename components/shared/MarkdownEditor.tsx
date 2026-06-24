'use client'

import { useRef } from 'react'
import clsx from 'clsx'
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon, Code, FileCode,
  List, ListOrdered, Quote, Minus,
} from 'lucide-react'
import Button from './button/Button'
import MarkdownRenderer from './MarkdownRenderer'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

type Wrap = { before: string, after?: string, placeholder: string, block?: boolean }

const actions: { label: string, icon: React.ElementType, wrap: Wrap }[] = [
  { label: 'Bold', icon: Bold, wrap: { before: '**', after: '**', placeholder: 'bold text' } },
  { label: 'Italic', icon: Italic, wrap: { before: '*', after: '*', placeholder: 'italic text' } },
  { label: 'Heading 1', icon: Heading1, wrap: { before: '# ', placeholder: 'Heading 1', block: true } },
  { label: 'Heading 2', icon: Heading2, wrap: { before: '## ', placeholder: 'Heading 2', block: true } },
  { label: 'Heading 3', icon: Heading3, wrap: { before: '### ', placeholder: 'Heading 3', block: true } },
  { label: 'Link', icon: LinkIcon, wrap: { before: '[', after: '](https://)', placeholder: 'link text' } },
  { label: 'Image', icon: ImageIcon, wrap: { before: '![', after: '](https://)', placeholder: 'alt text' } },
  { label: 'Code', icon: Code, wrap: { before: '`', after: '`', placeholder: 'code' } },
  { label: 'Code Block', icon: FileCode, wrap: { before: '```\n', after: '\n```', placeholder: 'code block', block: true } },
  { label: 'Bullet List', icon: List, wrap: { before: '- ', placeholder: 'list item', block: true } },
  { label: 'Ordered List', icon: ListOrdered, wrap: { before: '1. ', placeholder: 'list item', block: true } },
  { label: 'Quote', icon: Quote, wrap: { before: '> ', placeholder: 'quote', block: true } },
  { label: 'Horizontal Rule', icon: Minus, wrap: { before: '\n---\n', placeholder: '', block: true } },
]

export default function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const applyWrap = ({ before, after = '', placeholder: text, block }: Wrap) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end) || text

    const needsLeadingNewline = block && start > 0 && value[start - 1] !== '\n'
    const prefix = needsLeadingNewline ? '\n' : ''

    const newValue = value.slice(0, start) + prefix + before + selected + after + value.slice(end)
    onChange(newValue)

    const cursorStart = start + prefix.length + before.length
    const cursorEnd = cursorStart + selected.length

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(cursorStart, cursorEnd)
    })
  }

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center flex-wrap gap-1 border border-border rounded-t-md bg-muted/40 p-1">
        {actions.map(({ label, icon: Icon, wrap }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="sm"
            aria-label={label}
            title={label}
            onClick={() => applyWrap(wrap)}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <textarea
          ref={textareaRef}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Write your post in markdown...'}
          className={clsx(
            'w-full min-h-[400px] font-mono text-sm border border-border border-t-0 rounded-b-md p-3',
            'focus:outline-none focus:ring-0 focus:border-primary',
            'max-md:rounded-b-md max-md:border-t'
          )}
        />

        <div className="border border-border rounded-md max-md:border-t-0 max-md:rounded-t-none overflow-y-auto min-h-[400px] max-h-[600px] p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Preview</p>
          <MarkdownRenderer content={value || '*Nothing to preview yet*'} />
        </div>
      </div>
    </div>
  )
}
