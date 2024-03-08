'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { RegisterFieldNameEnum } from '@/enums/RegisterFieldNameEnum'
import { api } from '@/lib/api'
import { FieldProps } from '@/props/forms/FieldProps'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { z } from 'zod'

import { Field } from '../../../components/forms/Field'
import { SocialLogin } from '../../../components/forms/SocialLogin'
import { Form } from '../../../components/ui/form'
import { registerSchema } from '../../../validators/registerSchema'

type Input = z.infer<typeof registerSchema>

export function SignupForm() {
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
                      form={form as FieldProps['form']}
                      name={RegisterFieldNameEnum.USERNAME}
                      placeholder="Nome de usuário"
                      type="text"
                    />

                    <Field
                      form={form as FieldProps['form']}
                      name={RegisterFieldNameEnum.EMAIL}
                      placeholder="E-mail"
                      type="email"
                    />

                    <Field
                      form={form as FieldProps['form']}
                      name={RegisterFieldNameEnum.PASSWORD}
                      placeholder="Senha"
                      type="password"
                    />
                  </div>
                  <Button className="mt-8 w-full" type="submit">
                    Criar Conta
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
