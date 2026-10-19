'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Home,
  Grid,
  Store,
  ShoppingCart,
  User,
  Sparkles
} from 'lucide-react'
import { useBup } from '@/context/BupContext'

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { totalCartCount, currentUser, openAuth } = useBup()

  const handleAccountClick = () => {
    if (currentUser) {
      router.push('/account')
    } else {
      openAuth('bup')
    }
  }

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="size-5" />,
      href: '/',
      isActive: pathname === '/',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <Grid className="size-5" />,
      href: '/marketplace',
      isActive: pathname === '/marketplace',
    },
    {
      id: 'stalls',
      label: 'Stalls',
      icon: <Store className="size-5" />,
      href: '/stall-spaces',
      isActive: pathname === '/stall-spaces',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: (
        <div className="relative">
          <ShoppingCart className="size-5" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-[#b5573a] text-[10px] font-black text-white shadow-2xs">
              {totalCartCount}
            </span>
          )}
        </div>
      ),
      href: '/cart',
      isActive: pathname === '/cart',
    },
  ]

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-lg px-2 py-1.5"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-md transition-colors ${
              item.isActive
                ? 'text-[#1f3a2e] font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <div className={item.isActive ? 'text-[#b5573a]' : 'text-neutral-500'}>
              {item.icon}
            </div>
            <span className="text-[10px] leading-none">{item.label}</span>
          </Link>
        ))}

        {/* Account Tab */}
        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-md transition-colors ${
            pathname?.startsWith('/account')
              ? 'text-[#1f3a2e] font-bold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <div className="relative">
            <User className={`size-5 ${pathname?.startsWith('/account') ? 'text-[#b5573a]' : 'text-neutral-500'}`} />
            {currentUser?.isBupVerified && (
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-500" />
            )}
          </div>
          <span className="text-[10px] leading-none">
            {currentUser ? currentUser.name.split(' ')[0] : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  )
}
