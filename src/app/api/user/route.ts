import { NextResponse } from 'next/server'

import { db } from '@/lib/prisma'
import { createStripeCustomer } from '@/lib/stripe'
import { registerSchema } from '@/validators/registerSchema'
import { hash } from 'bcrypt'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, email, password } = registerSchema.parse(body)

    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: 'Usuário com esse e-mail já cadastrado.',
        },
        { status: 400 },
      )
    }

    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    })

    if (existingUserByUsername) {
      return NextResponse.json(
        {
          user: null,
          message: 'Esse nome de usuário já foi cadastrado.',
        },
        { status: 400 },
      )
    }

    const hashedPassword = await hash(password, 10)
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })

    await createStripeCustomer({
      name: username,
      email,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: newUserPassword, ...rest } = newUser

    return NextResponse.json(
      {
        user: rest,
        message: 'Usuário cadastrado com sucesso.',
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 },
    )
  }
}
