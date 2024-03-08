'use client'

import Image from 'next/image'

import { ModeToggle } from '@/components/ModeToggle'
import { motion } from 'framer-motion'

import Logo from '../../public/images/logo1.png'

export function Header() {
  return (
    <motion.header
      className="flex w-full items-center justify-between"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ModeToggle />
      <Image
        src={Logo}
        width={75}
        height={75}
        alt="Logo da Budget"
        className="mr-1 mt-1"
      />
    </motion.header>
  )
}
