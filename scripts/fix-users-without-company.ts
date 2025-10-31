import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixUsersWithoutCompany () {
  console.log('🔍 Buscando usuários sem empresa...')

  // Buscar todos os usuários sem empresa
  const usersWithoutCompany = await prisma.user.findMany({
    where: {
      companyId: null
    }
  })

  console.log(`📊 Encontrados ${usersWithoutCompany.length} usuários sem empresa`)

  if (usersWithoutCompany.length === 0) {
    console.log('✅ Todos os usuários já têm empresa associada!')
    return
  }

  console.log('\n🔧 Criando empresas para os usuários...\n')

  for (const user of usersWithoutCompany) {
    try {
      // Criar empresa para o usuário
      const company = await prisma.company.create({
        data: {
          name: user.fullName ? `Empresa de ${user.fullName}` : `Empresa de ${user.email}`,
          description: 'Empresa criada automaticamente durante migração'
        }
      })

      // Associar usuário à empresa
      await prisma.user.update({
        where: { id: user.id },
        data: { companyId: company.id }
      })

      console.log(`✅ ${user.email} → ${company.name}`)
    } catch (error) {
      console.error(`❌ Erro ao processar ${user.email}:`, error)
    }
  }

  console.log('\n✨ Migração concluída!')
}

fixUsersWithoutCompany()
  .catch((error) => {
    console.error('❌ Erro na migração:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

