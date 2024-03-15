'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DashboardPageGenericProps<T = any> = {
  children: React.ReactNode
  className?: string
} & T

export function LayoutPage({ children, className }: DashboardPageGenericProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(['h-screen w-screen lg:w-auto', className])}
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

export function LayoutPageHeader({
  children,
  className,
}: DashboardPageGenericProps) {
  return (
    <header className={cn(['border-b border-border px-6 py-3', className])}>
      {children}
    </header>
  )
}

export function LayoutPageHeaderTitle({
  children,
  className,
}: DashboardPageGenericProps) {
  return (
    <h1 className={cn(['text-sm uppercase text-muted-foreground', className])}>
      {children}
    </h1>
  )
}

export function LayoutPageHeaderNav({
  children,
  className,
}: DashboardPageGenericProps) {
  return <nav className={cn(['', className])}>{children}</nav>
}

export function LayoutPageMain({
  children,
  className,
}: DashboardPageGenericProps) {
  return <main className={cn(['lg:p-2', className])}>{children}</main>
}
