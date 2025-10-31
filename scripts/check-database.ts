import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Verificando conexão com o banco de dados...\n')

    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão estabelecida com sucesso!\n')

    // Contar registros em cada tabela
    const userCount = await prisma.user.count()
    const companyCount = await prisma.company.count()
    const transactionCount = await prisma.transaction.count()
    const categoryCount = await prisma.category.count()
    const fileCount = await prisma.file.count()
    const integrationCount = await prisma.integration.count()

    console.log('📊 Status das Tabelas:')
    console.log('─────────────────────────────────────')
    console.log(`👥 Users:         ${userCount} registro(s)`)
    console.log(`🏢 Companies:     ${companyCount} registro(s)`)
    console.log(`💰 Transactions:  ${transactionCount} registro(s)`)
    console.log(`📁 Categories:    ${categoryCount} registro(s)`)
    console.log(`📄 Files:         ${fileCount} registro(s)`)
    console.log(`🔌 Integrations:  ${integrationCount} registro(s)`)
    console.log('─────────────────────────────────────\n')

    console.log('✅ Todas as tabelas foram criadas com sucesso!')
    console.log('🎉 Banco de dados está pronto para uso!\n')

  } catch (error) {
    console.error('❌ Erro ao verificar banco de dados:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

