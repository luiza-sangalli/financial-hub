import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function createTestUser() {
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'teste@financialhub.com' }
    })

    if (existingUser) {
      console.log('Usuário de teste já existe:', existingUser.email)
      return
    }

    // Criar usuário de teste
    const hashedPassword = await bcrypt.hash('123456', 12)
    
    const user = await prisma.user.create({
      data: {
        email: 'teste@financialhub.com',
        fullName: 'Usuário Teste',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('Usuário de teste criado:', user.email)
    console.log('Senha: 123456')
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error)
  }
}

createTestUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

