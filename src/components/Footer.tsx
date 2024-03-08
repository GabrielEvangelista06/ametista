'use client'

import { motion } from 'framer-motion'

export function Footer() {
  return (
    <motion.footer
      className="text-sm text-muted-foreground md:mt-32 xl:mt-8 2xl:mt-32"
      initial={{ opacity: 0, y: 200, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p>Copyright © 2024 Infinity</p>
      <p>Todos os direitos reservados</p>
    </motion.footer>
  )
}
