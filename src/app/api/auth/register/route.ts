import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createUserSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe com este email' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(body.password, 12)

    // Criar empresa e usuário em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar empresa para o usuário
      const company = await tx.company.create({
        data: {
          name: validatedData.fullName ? `Empresa de ${validatedData.fullName}` : `Empresa de ${validatedData.email}`,
          description: 'Empresa criada automaticamente no registro'
        }
      })

      // Criar usuário associado à empresa
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          fullName: validatedData.fullName,
          role: validatedData.role || 'USER',
          password: hashedPassword,
          companyId: company.id
        }
      })

      return { user, company }
    })

    // Remover a senha da resposta
    const { password: _, ...userWithoutPassword } = result.user

    return NextResponse.json(
      { 
        message: 'Usuário e empresa criados com sucesso',
        user: userWithoutPassword,
        company: {
          id: result.company.id,
          name: result.company.name
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
