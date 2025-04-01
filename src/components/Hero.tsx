'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import { Button } from './ui/button'

export function Hero() {
  const [isPlaying, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(true)
  }, [])

  return (
    <motion.section
      className="relative md:mt-[250px] md:min-h-[375px]"
      onViewportEnter={() => {
        if (!isPlaying) {
          setPlaying(true)
        }
      }}
      onViewportLeave={() => {
        if (isPlaying) {
          setPlaying(false)
        }
      }}
    >
      <div className="hero-slide-up mt-[240px] flex flex-col">
        <h1 className="mt-6 text-[30px] font-medium leading-none md:text-[90px]">
          Controle Suas Finanças com Facilidade e Segurança.
        </h1>

        <p className="mt-4 max-w-[600px] text-[#878787] md:mt-6">
          A Ferramenta Intuitiva para Simplificar a Gestão Financeira Pessoal e
          Familiar.
        </p>

        <div className="mt-8">
          <div className="flex items-center space-x-4">
            <a href="https://app.midday.ai">
              <Button className="h-12 px-5">Comece a usar</Button>
            </a>
          </div>
        </div>

        <p className="mt-8 font-mono text-xs text-[#707070]">
          Usado por mais de{' '}
          <Link href="/open-startup" prefetch>
            <span className="underline">1200+</span>
          </Link>{' '}
          pessoas.
        </p>
      </div>
    </motion.section>
  )
}
