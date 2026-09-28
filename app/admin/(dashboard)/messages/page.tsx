"use client"

import ActionBreadcrumb from '@/components/shared/breadcrumb/ActionBreadcrumb'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { RootState } from '@/lib/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { SearchField } from '@/components/shared/form/SearchField'
import { ArrowLeft, Mail, MapPin, Phone, Reply, Trash } from 'lucide-react'
import Avatar from '@/components/shared/Avatar'
import Button from '@/components/shared/button/Button'
import Pagination from '@/components/shared/Pagination'
import { deleteMessage, getMessages } from '@/lib/redux/slices/message/message'
import { useConfirm } from '@/lib/hooks/useConfirm'
import { AdminListSkeleton } from '@/components/shared/Skeleton'
import ListEmpty from '@/components/shared/ListEmpty'
import { formatDate, formatRelativeTime } from '@/lib/utils/formatter'
import type { MessageInterface } from '@/lib/interfaces/message'

const READ_STORAGE_KEY = 'admin-messages-read'

export default function MessagesPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, messages, isLoading } = useAppSelector((state: RootState) => state.message)
    const { confirm, ConfirmDialog } = useConfirm()
    const hasLoadedOnce = useRef(false)

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [readIds, setReadIds] = useState<Set<string>>(new Set())

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        name?: string
        email?: string
    }>({})

    useEffect(() => {
        dispatch(getMessages({
            ...filtersState,
        })).finally(() => { hasLoadedOnce.current = true })
    }, [dispatch, filtersState])

    // No `is_read` column on the backend — read state is tracked locally
    // per-browser instead. Not synced across devices, but costs nothing and
    // beats every message looking permanently unread.
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(READ_STORAGE_KEY) ?? '[]')
            setReadIds(new Set(stored))
        } catch {
            // localStorage unavailable — messages just won't show as read
        }
    }, [])

    const markRead = (id: string) => {
        setReadIds((prev) => {
            if (prev.has(id)) return prev
            const next = new Set(prev)
            next.add(id)
            try {
                localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(next)))
            } catch {
                // best-effort only
            }
            return next
        })
    }

    const selectMessage = (message: MessageInterface) => {
        setSelectedId(message.id)
        markRead(message.id)
    }

    const handleDelete = (message: MessageInterface) => confirm({
        title: "Delete message",
        content: `Delete the message from "${message.name}"? This can't be undone.`,
        confirmLabel: "Delete",
        onConfirm: async () => {
            await dispatch(deleteMessage({ id: message.id })).unwrap()
            if (selectedId === message.id) setSelectedId(null)
        },
    })

    const selected = messages.find((m) => m.id === selectedId) ?? null

    return (
        <div>
            {ConfirmDialog}

            <ActionBreadcrumb
                title="Messages"
                subtitle={`${total} message(s) sent through your contact form`}
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search messages by name'
                onSearch={() => setFiltersState({...filtersState, name: search})}
                onSearchClear={() => setFiltersState({})}
            />

            {isLoading && !hasLoadedOnce.current ? (
                <AdminListSkeleton rows={5} />
            ) : (
                <div className={clsx('transition-opacity duration-(--dur-base)', isLoading ? 'opacity-60' : 'opacity-100')} aria-busy={isLoading}>
                    {messages.length === 0 ? (
                        <div className='mt-5 bg-background rounded-lg border border-border'>
                            <ListEmpty title='messages' subtitle='Messages from your contact form show up here.' />
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-[320px_1fr] mt-5 bg-background border border-border rounded-lg overflow-hidden min-h-[32rem]'>
                            {/* List pane — hidden on mobile once a message is open */}
                            <div className={clsx('border-border overflow-y-auto md:border-r', selected && 'max-md:hidden')}>
                                {messages.map((message) => {
                                    const isUnread = !readIds.has(message.id)
                                    const isActive = message.id === selectedId
                                    return (
                                        <button
                                            key={message.id}
                                            type='button'
                                            onClick={() => selectMessage(message)}
                                            className={clsx(
                                                'w-full text-left flex items-start gap-3 p-4 border-b border-border transition-colors duration-(--dur-fast)',
                                                isActive ? 'bg-primary-soft' : 'hover:bg-secondary/50'
                                            )}
                                        >
                                            <Avatar name={message.name} size='sm' className='shrink-0 mt-0.5' />
                                            <div className='min-w-0 flex-1'>
                                                <div className='flex items-center justify-between gap-2'>
                                                    <p className={clsx('truncate text-sm', isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80')}>
                                                        {message.name}
                                                    </p>
                                                    {isUnread && <span className='h-2 w-2 rounded-full bg-primary shrink-0' aria-label='Unread' />}
                                                </div>
                                                <p className='text-xs text-muted-foreground truncate mt-0.5'>{message.message}</p>
                                                <p className='text-xs text-muted-foreground/70 mt-1'>{formatRelativeTime(message.created_at)}</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Reading pane */}
                            <div className={clsx('p-6 max-md:p-4', !selected && 'max-md:hidden')}>
                                {!selected ? (
                                    <div className='h-full flex items-center justify-center text-center'>
                                        <p className='text-muted-foreground'>Select a message to read it.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className='md:hidden mb-4'
                                            onClick={() => setSelectedId(null)}
                                        >
                                            <ArrowLeft className='h-4 w-4 mr-1.5' /> Back
                                        </Button>

                                        <div className='flex items-start justify-between gap-4 mb-4'>
                                            <div className='flex items-center gap-3 min-w-0'>
                                                <Avatar name={selected.name} size='md' className='shrink-0' />
                                                <div className='min-w-0'>
                                                    <h2 className='text-lg font-semibold text-foreground truncate'>{selected.name}</h2>
                                                    <p className='text-sm text-muted-foreground'>{formatDate(selected.created_at)}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant='ghostDanger'
                                                size='sm'
                                                aria-label='Delete message'
                                                onClick={() => handleDelete(selected)}
                                            >
                                                <Trash className='h-4 w-4' />
                                            </Button>
                                        </div>

                                        <div className='flex flex-col gap-2 text-sm text-muted-foreground mb-6'>
                                            <div className='flex items-center gap-2'>
                                                <Mail className='h-4 w-4 shrink-0' />
                                                <a href={`mailto:${selected.email}`} className='hover:text-foreground hover:underline'>{selected.email}</a>
                                            </div>
                                            {selected.phone_number && (
                                                <div className='flex items-center gap-2'>
                                                    <Phone className='h-4 w-4 shrink-0' />
                                                    {selected.phone_country_code}{selected.phone_number}
                                                </div>
                                            )}
                                            {selected.location && (
                                                <div className='flex items-center gap-2'>
                                                    <MapPin className='h-4 w-4 shrink-0' />
                                                    {selected.location}
                                                </div>
                                            )}
                                        </div>

                                        <p className='text-base text-foreground whitespace-pre-wrap leading-relaxed mb-6'>
                                            {selected.message}
                                        </p>

                                        <a
                                            href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: your message to Joboy.dev`)}`}
                                            className='inline-flex items-center justify-center h-10 px-5 rounded-md font-medium bg-primary-strong text-primary-foreground hover:opacity-90 transition-opacity duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
                                        >
                                            <Reply className='h-4 w-4 mr-2' /> Reply
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <Pagination
                        currentPage={filtersState.page ?? 1}
                        totalPages={totalPages ?? 1}
                        onPageChange={(page) => setFiltersState({...filtersState, page})}
                    />
                </div>
            )}
        </div>
    )
}
