'use client'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useMedia } from 'react-use'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'

const routers = [
  {
    href: '/',
    label: 'Overview',
  },
  {
    href: '/transactions',
    label: 'Transactions',
  },
  {
    href: '/accounts',
    label: 'Accounts',
  },
  {
    href: '/categories',
    label: 'Categories',
  },
  {
    href: '/settings',
    label: 'Settings',
  },
]
type RouteButtonProps = { href: string; label: string; isActive: boolean }
function RouteButton({ href, label, isActive }: RouteButtonProps) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn(
        'w-full lg:w-auto justify-between text-white font-normal hover:bg-white/30 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none focus:bg-white/40 transition',
        { 'bg-white/20': isActive }
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  )
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMedia('(max-width: 1024px)', false)

  const onClick = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-normal outline-none text-white bg-white/20 hover:bg-white/30 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent focus:bg-white/40 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col space-y-2 pt-6">
            {routers.map((route) => (
              <Button
                key={route.href}
                variant={route.href === pathname ? 'secondary' : 'ghost'}
                onClick={() => onClick(route.href)}
                className="w-full justify-start"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routers.map((route) => (
        <RouteButton
          key={route.href}
          {...route}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  )
}
