import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteUserImports() {
  const userEmail = 'luiza.sangalli@outlook.com'
  
  console.log(`Buscando usuário: ${userEmail}...`)
  
  // Buscar o usuário
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { company: true }
  })
  
  if (!user) {
    console.log('❌ Usuário não encontrado')
    return
  }
  
  if (!user.companyId) {
    console.log('❌ Usuário não tem empresa associada')
    return
  }
  
  console.log(`✓ Usuário encontrado: ${user.fullName || user.email}`)
  console.log(`✓ Empresa: ${user.company?.name || user.companyId}`)
  
  // Buscar todos os arquivos da empresa
  const files = await prisma.file.findMany({
    where: { companyId: user.companyId },
    include: {
      _count: {
        select: { transactions: true }
      }
    }
  })
  
  if (files.length === 0) {
    console.log('✓ Nenhum arquivo encontrado para deletar')
    return
  }
  
  console.log(`\nEncontrados ${files.length} arquivo(s):`)
  files.forEach(file => {
    console.log(`  - ${file.name} (${file._count.transactions} transações)`)
  })
  
  // Deletar transações relacionadas aos arquivos
  console.log('\nDeletando transações...')
  const deletedTransactions = await prisma.transaction.deleteMany({
    where: {
      fileId: {
        in: files.map(f => f.id)
      }
    }
  })
  
  console.log(`✓ ${deletedTransactions.count} transação(ões) deletada(s)`)
  
  // Deletar os arquivos
  console.log('\nDeletando arquivos...')
  const deletedFiles = await prisma.file.deleteMany({
    where: {
      companyId: user.companyId
    }
  })
  
  console.log(`✓ ${deletedFiles.count} arquivo(s) deletado(s)`)
  
  console.log('\n✅ Importações removidas com sucesso!')
}

deleteUserImports()
  .catch((error) => {
    console.error('❌ Erro ao deletar importações:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

