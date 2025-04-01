'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageLayoutGenericProps<T = any> = {
  children: React.ReactNode
  className?: string
} & T

export function PageLayout({ children, className }: PageLayoutGenericProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(['h-screen w-screen lg:w-auto xl:min-h-screen', className])}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.section>
  )
}

export function PageLayoutHeader({
  children,
  className,
}: PageLayoutGenericProps) {
  return (
    <header
      className={cn([
        'flex items-center justify-between border-b border-border px-6 py-3',
        className,
      ])}
    >
      {children}
    </header>
  )
}

export function PageLayoutHeaderTitle({
  children,
  className,
}: PageLayoutGenericProps) {
  return (
    <h1 className={cn(['text-sm uppercase text-muted-foreground', className])}>
      {children}
    </h1>
  )
}

export function PageLayoutHeaderNav({
  children,
  className,
}: PageLayoutGenericProps) {
  return <nav className={cn(['', className])}>{children}</nav>
}

export function PageLayoutMain({
  children,
  className,
}: PageLayoutGenericProps) {
  return (
    <main className={cn(['mx-2 lg:mx-0 lg:p-2', className])}>{children}</main>
  )
}
