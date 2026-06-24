'use client'

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import ThemeToggle from '../ThemeToggle';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = usePathname();

  return (
    <header className="bg-background w-full border-b border-primary/10 backdrop-blur supports-[backdrop-filter]:bg-background/90 fixed top-0 z-10">
      <div className="flex items-center justify-between nav-padding">
        <Logo/>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={clsx(
                "relative text-lg pb-1 transition-colors hover:text-primary",
                "after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:bg-primary after:transition-transform after:duration-300 after:origin-left",
                location === item.to ? "text-primary after:w-full after:scale-x-100" : "after:w-full after:scale-x-0 hover:after:scale-x-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          {/* <LinkButton
            to="/contact"
            size='sm'
            variant='primary'
            className="max-md:hidden font-bold"
          >
            Let's Talk
            <ArrowUpRight className='h-4 w-4 ml-5'/>
          </LinkButton> */}

          <ThemeToggle />

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden text-foreground"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 bg-background shadow-md nav-padding">
          <div className='flex flex-col gap-4'>
            {navItems.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "hover:text-primary text-lg",
                    "block py-2 text-foreground hover:text-primary text-left",
                    location===item.to ? "text-primary" : ""
                  )}
                >
                  {item.label}
                </Link>
            ))}
            {/* <LinkButton
              to="/contact"
              variant='outline'
              className='w-48 mb-5 font-bold'
            >
              Let's Talk
              <ArrowUpRight className='h-4 w-4 ml-5'/>
            </LinkButton> */}
          </div>
        </div>
      )}
    </header>
  );
}
