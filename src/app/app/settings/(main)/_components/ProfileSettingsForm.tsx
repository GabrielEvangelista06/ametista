'use client'

import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SheetFooter } from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { updateProfileSchema } from '@/validators/profileSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { updateProfile } from '../actions'

type ProfileSettingsFormProps = {
  user: (Session['user'] & { username: string }) | undefined
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await updateProfile(data)

    if (response.error) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    router.refresh()

    toast({
      title: response.title,
      description: response.message,
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Nome</CardTitle>
            <CardDescription>
              Seu nome será exibido em sua página de perfil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>E-mail</CardTitle>
            <CardDescription>
              Por favor contate o e-mail contact@contact.com para alterar seu
              e-mail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu e-mail"
                      readOnly
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <SheetFooter>
          <Button
            type="submit"
            className="mt-auto"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Salvando..' : 'Salvar mudança'}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  )
}
