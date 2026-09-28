'use client'

import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Logo from '../Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';
import LinkButton from '../button/LinkButton';
import ContactForm from '@/components/messages/ContactForm';
import { dur, ease, spring } from '@/lib/motion';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
];

function isActive(pathname: string, to: string) {
  return to === '/' ? pathname === '/' : pathname.startsWith(to);
}

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 8));

  // Close the mobile sheet on route change, so a link tap doesn't leave it open.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes the mobile sheet.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <ContactForm
        isOpen={isContactOpen}
        setIsOpen={setIsContactOpen}
        title="Get in touch"
        subtitle="Send a message and I'll get back to you."
      />

      <header
        className={clsx(
          'w-full bg-background/80 backdrop-blur-md fixed top-0 z-(--z-nav) h-16 transition-[border-color] duration-(--dur-fast)',
          'border-b',
          scrolled ? 'border-border' : 'border-transparent'
        )}
      >
        <div className="flex items-center justify-between nav-padding h-full py-0!">
          <Logo />

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={clsx(
                    'relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-(--dur-fast)',
                    active ? 'text-primary-strong' : 'text-foreground/70 hover:text-foreground'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="public-nav-underline"
                      className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-primary rounded-full"
                      transition={spring.snappy}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LinkButton
              to="#"
              onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}
              size="sm"
              variant="primary"
              className="max-md:hidden font-bold"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4 ml-1.5" />
            </LinkButton>

            <ThemeToggle />

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-sheet"
              className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-sheet"
            className="md:hidden fixed top-16 inset-x-0 z-(--z-dropdown) bg-background border-b border-border container-page pt-2 pb-6 overflow-hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: dur.base, ease: ease.out }}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, transform: 'translateY(-4px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  transition={{ duration: dur.fast, delay: index * 0.04, ease: ease.out }}
                >
                  <Link
                    href={item.to}
                    className={clsx(
                      'block py-2.5 text-base font-medium',
                      isActive(pathname, item.to) ? 'text-primary-strong' : 'text-foreground/80'
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <LinkButton
                to="#"
                onClick={(e) => { e.preventDefault(); setMobileOpen(false); setIsContactOpen(true); }}
                variant="primary"
                className="w-full mt-3 font-bold"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4 ml-1.5" />
              </LinkButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
