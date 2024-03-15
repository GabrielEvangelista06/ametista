'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DashboardPageGenericProps<T = any> = {
  children: React.ReactNode
  className?: string
} & T

export function DashboardPage({
  children,
  className,
}: DashboardPageGenericProps) {
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

export function DashboardPageHeader({
  children,
  className,
}: DashboardPageGenericProps) {
  return (
    <header className={cn(['border-b border-border px-6 py-3', className])}>
      {children}
    </header>
  )
}

export function DashboardPageHeaderTitle({
  children,
  className,
}: DashboardPageGenericProps) {
  return (
    <h1 className={cn(['text-sm uppercase text-muted-foreground', className])}>
      {children}
    </h1>
  )
}

export function DashboardPageHeaderNav({
  children,
  className,
}: DashboardPageGenericProps) {
  return <nav className={cn(['', className])}>{children}</nav>
}

export function DashboardPageMain({
  children,
  className,
}: DashboardPageGenericProps) {
  return <main className={cn(['lg:p-2', className])}>{children}</main>
}
