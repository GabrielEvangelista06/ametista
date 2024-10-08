'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { AuthFieldNameEnum } from '@/enums/AuthFieldNameEnum'
import { api } from '@/lib/api'
import { AuthFieldProps } from '@/props/forms/FieldProps'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { z } from 'zod'

import { Field } from '../../../components/forms/Field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../../components/ui/form'
import { registerSchema } from '../../../validators/registerSchema'
import { SocialLogin } from './SocialLogin'

type Input = z.infer<typeof registerSchema>

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<Input>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: Input) => {
    const respose = await api.post('/user', {
      username: data.username,
      email: data.email,
      password: data.password,
    })

    if (respose.status !== 201) {
      toast({
        title: 'Erro ao realizar login',
        description: 'Ops! Algo deu errado ao realizar login. Tente novamente.',
        variant: 'destructive',
      })
    } else {
      router.push('/login')
    }
  }

  return (
    <motion.div
      className="flex items-center justify-center bg-background"
      initial={{ opacity: 0, y: 200, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border bg-background shadow-xl">
        <div className="md:flex md:items-center md:justify-center">
          <div className="w-full p-8 md:w-1/2">
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-primary">Criar Conta</h2>
              <div className="mt-8">
                <SocialLogin labelGoogle="Cadastrar utilizando Google" />
              </div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-gray-500">-OU-</span>
                </div>
              </div>
              <Form {...form}>
                <form id="registerForm" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <Field
                      form={form as AuthFieldProps['form']}
                      name={AuthFieldNameEnum.USERNAME}
                      placeholder="Nome de usuário"
                      type="text"
                    />

                    <Field
                      form={form as AuthFieldProps['form']}
                      name={AuthFieldNameEnum.EMAIL}
                      placeholder="E-mail"
                      type="email"
                    />

                    <FormField
                      control={form.control}
                      name={AuthFieldNameEnum.PASSWORD}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Digite uma senha segura"
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                              />
                              <Button
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform"
                              >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage>
                            {
                              form.formState.errors[AuthFieldNameEnum.PASSWORD]
                                ?.message
                            }
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    className="mt-8 w-full"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? 'Criando Conta...'
                      : 'Criar Conta'}
                  </Button>
                </form>
              </Form>
              <p className="mt-4 text-center text-sm text-gray-500">
                Você já tem uma conta?{' '}
                <Link className="text-blue-500 hover:underline" href="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
