import { signIn } from 'next-auth/react'
import { useState } from 'react'

import { ChromeIcon } from '../icons/ChromeIcon'
import { Button } from '../ui/button'

interface SocialLoginProps {
  labelGoogle: string
}

export function SocialLogin({ labelGoogle }: SocialLoginProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true)
      await signIn('google', { callbackUrl: 'http://localhost:3000/app' })
    } catch (error) {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Button
        disabled={isLoading}
        className="mb-3 w-full"
        variant="outline"
        onClick={loginWithGoogle}
      >
        {isLoading && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        <ChromeIcon className="mr-2 h-5 w-5" />
        {labelGoogle}
      </Button>
    </div>
  )
}
