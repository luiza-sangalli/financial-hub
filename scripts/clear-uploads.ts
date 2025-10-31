import { PrismaClient } from '@prisma/client'
import { rmSync, existsSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function clearUploads () {
  console.log('🗑️  Limpando histórico de uploads...\n')

  try {
    // 1. Buscar todos os arquivos
    const files = await prisma.file.findMany({
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    })

    console.log(`📊 Encontrados ${files.length} arquivos no banco de dados`)

    // 2. Deletar transações associadas aos arquivos
    const transactionsCount = await prisma.transaction.deleteMany({
      where: {
        fileId: {
          not: null
        }
      }
    })

    console.log(`✅ ${transactionsCount.count} transações deletadas`)

    // 3. Deletar registros de arquivos do banco
    const deletedFiles = await prisma.file.deleteMany({})
    console.log(`✅ ${deletedFiles.count} registros de arquivos deletados`)

    // 4. Remover diretório de uploads
    const uploadsDir = join(process.cwd(), 'uploads')
    if (existsSync(uploadsDir)) {
      rmSync(uploadsDir, { recursive: true, force: true })
      console.log('✅ Diretório de uploads removido')
    } else {
      console.log('ℹ️  Diretório de uploads não existe')
    }

    console.log('\n✨ Limpeza concluída com sucesso!')
    console.log('\n📝 Resumo:')
    console.log(`   • ${transactionsCount.count} transações removidas`)
    console.log(`   • ${deletedFiles.count} arquivos removidos do banco`)
    console.log(`   • Diretório de uploads limpo`)
  } catch (error) {
    console.error('\n❌ Erro ao limpar uploads:', error)
    process.exit(1)
  }
}

clearUploads()
  .catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

