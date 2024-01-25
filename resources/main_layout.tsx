import * as React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  IconExternalLink,
  IconMenu,
  IconSettings,
  IconX,
  type TablerIconsProps,
} from '@tabler/icons-react'
import { Link } from '@inertiajs/react'
import Button from './components/button'
import Logo from './components/logo'
import { Toaster } from './components/toaster'
import AccountDropdown from './components/account_dropdown'
import clsx from 'clsx'

export default function MainLayout({ children }: React.PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const navigation: Array<{
    name: string
    href: string
    icon: (props: TablerIconsProps) => JSX.Element
    current: boolean
    comingSoon?: boolean
  }> = [
    {
      name: 'Settings',
      href: '/settings',
      icon: IconSettings,
      current: window.location.pathname === '/settings',
    },
  ]

  return (
    <>
      <Toaster />

      <div>
        <Transition.Root show={sidebarOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={React.Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-zinc-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <IconX className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
                    <div className="flex space-x-2 h-16 shrink-0 items-center border-b border-zinc-200 px-6">
                      <Logo variant="dark" />
                      <span className="font-clash font-medium text-xl">Software Citadel</span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li className="px-6">
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={clsx(
                                    item.current
                                      ? 'bg-accent'
                                      : 'text-zinc-900 hover:bg-accent/40 transition-colors',
                                    'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium',
                                    item.comingSoon && 'cursor-not-allowed opacity-50'
                                  )}
                                >
                                  <item.icon
                                    className="h-5 w-5 shrink-0 text-zinc-900"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className="mt-auto border-t border-zinc-200 px-6">
                          <AccountDropdown />
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 bg-white">
            <div className="flex space-x-2 h-16 shrink-0 items-center border-b border-zinc-200 px-6">
              <Logo variant="dark" />
              <span className="font-clash text-xl font-medium">Software Citadel</span>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li className="px-6">
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={clsx(
                            item.current ? 'bg-accent' : ' hover:bg-accent/40 transition-colors',
                            'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-zinc-900',
                            item.comingSoon && 'cursor-not-allowed opacity-50'
                          )}
                        >
                          <item.icon
                            className="h-5 w-5 shrink-0 text-zinc-900"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="mt-auto border-t border-zinc-200 px-6">
                  <AccountDropdown />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-12">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-zinc-900 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-zinc-200 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="ml-auto flex items-center space-x-3">
                <a href="https://www.softwarecitadel.com/contact">
                  <Button variant="ghost">Get in touch</Button>
                </a>
                <a href="https://docs.softwarecitadel.com" target="_blank">
                  <Button variant="outline">
                    <span>Documentation</span>
                    <IconExternalLink stroke={1.5} size={18} />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <main className="py-8 px-12 bg-zinc-50 min-h-[calc(100vh-64px)]">{children}</main>
        </div>
      </div>
    </>
  )
}
