import Link from 'next/link'
import { UserButton, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'

import Logo from '@/components/logo'
import Loader from '@/components/loader'
import Filters from '@/components/filters'
import MaxWidthWrapper from '@/components/max-width-wrapper'

import Navigation from './navigation'
import WelcomeMsg from './welcome-msg'

function HeaderLogo() {
  return (
    <Link href="/">
      <div className="hidden lg:flex items-center">
        <Logo height={28} width={28} />
        <p className="font-semibold text-white text-2xl ml-2.5">My Finance</p>
      </div>
    </Link>
  )
}

export default function Header() {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-400 px-4 lg:px-14 pt-8 pb-36">
      <MaxWidthWrapper>
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:space-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader />
          </ClerkLoading>
        </div>
        <WelcomeMsg />
        <Filters />
      </MaxWidthWrapper>
    </header>
  )
}
