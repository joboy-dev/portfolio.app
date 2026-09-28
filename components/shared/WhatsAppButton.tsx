'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa6'
import { useAppSelector } from '@/lib/hooks/redux'
import { ease } from '@/lib/motion'

/** Fixed floating action button, bottom-right, linking straight to a WhatsApp
 *  chat. Rendered once per public layout; hides itself if no number is set. */
export default function WhatsAppButton() {
  const { profile } = useAppSelector((state) => state.profile)
  const shouldReduceMotion = useReducedMotion()

  if (!profile?.whatsapp_url) return null

  return (
    <motion.a
      href={profile.whatsapp_url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Message me on WhatsApp"
      title="Message me on WhatsApp"
      initial={shouldReduceMotion ? undefined : { opacity: 0, transform: 'scale(0.9)' }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, transform: 'scale(1)' }}
      transition={{ duration: 0.3, delay: 0.5, ease: ease.out }}
      whileTap={{ scale: 0.94 }}
      className="hover-fine:scale-105 fixed bottom-6 right-6 z-(--z-nav) h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center transition-transform duration-(--dur-fast)"
    >
      <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
    </motion.a>
  )
}
