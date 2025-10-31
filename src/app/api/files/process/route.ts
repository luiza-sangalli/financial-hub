import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { processCSVFromText, processExcelFromBuffer, detectFileType } from '@/lib/file-processor'
import { categorizeTransaction } from '@/lib/categorizer'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

export async function POST (req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    })

    if (!user?.companyId) {
      return NextResponse.json(
        { error: 'Usuário sem empresa associada' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { fileId } = body

    if (!fileId) {
      return NextResponse.json(
        { error: 'ID do arquivo não fornecido' },
        { status: 400 }
      )
    }

    // Buscar arquivo
    const file = await prisma.file.findUnique({
      where: { id: fileId }
    })

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    if (file.companyId !== user.companyId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    if (file.status === 'PROCESSING') {
      return NextResponse.json(
        { error: 'Arquivo já está sendo processado' },
        { status: 400 }
      )
    }

    // Atualizar status para PROCESSING
    await prisma.file.update({
      where: { id: fileId },
      data: { status: 'PROCESSING' }
    })

    try {
      // Ler arquivo do disco
      const filepath = join(UPLOAD_DIR, file.name)
      const fileBuffer = await readFile(filepath)
      
      // Detectar tipo e processar
      const fileType = detectFileType(file.originalName, file.mimeType)
      
      if (!fileType) {
        throw new Error('Tipo de arquivo não suportado')
      }

      let processedData
      if (fileType === 'csv') {
        // Processar CSV direto do buffer
        const csvText = fileBuffer.toString('utf-8')
        processedData = await processCSVFromText(csvText)
      } else {
        // Processar Excel direto do buffer
        processedData = await processExcelFromBuffer(fileBuffer)
      }

      // Processar categorias existentes
      const existingCategories = await prisma.category.findMany({
        where: { companyId: user.companyId }
      })

      const categoryMap = new Map(
        existingCategories.map(cat => [cat.name.toLowerCase(), cat.id])
      )

      // Preparar transações para inserção
      const transactionsToCreate: Array<{
        companyId: string
        amount: number
        description: string
        type: 'INCOME' | 'EXPENSE'
        date: Date
        categoryId: string | null
        fileId: string
        createdById: string
      }> = []
      const errors: Array<{ row: number, message: string }> = [...processedData.errors]
      let successCount = 0

      for (let i = 0; i < processedData.rows.length; i++) {
        const row = processedData.rows[i]
        
        try {
          // Categorizar automaticamente se não tiver categoria
          let categoryId: string | null = null
          
          if (row.category) {
            // Usar categoria fornecida
            const catKey = row.category.toLowerCase()
            categoryId = categoryMap.get(catKey) || null
            
            // Se categoria não existe, criar
            if (!categoryId) {
              const newCategory = await prisma.category.create({
                data: {
                  name: row.category,
                  companyId: user.companyId
                }
              })
              categoryId = newCategory.id
              categoryMap.set(catKey, categoryId)
            }
          } else {
            // Categorizar automaticamente
            const suggestedCategory = categorizeTransaction(row.description)
            
            if (suggestedCategory) {
              const catKey = suggestedCategory.toLowerCase()
              categoryId = categoryMap.get(catKey) || null
              
              if (!categoryId) {
                const newCategory = await prisma.category.create({
                  data: {
                    name: suggestedCategory,
                    companyId: user.companyId
                  }
                })
                categoryId = newCategory.id
                categoryMap.set(catKey, categoryId)
              }
            }
          }

          transactionsToCreate.push({
            amount: parseFloat(row.amount),
            description: row.description,
            type: row.type,
            date: new Date(row.date),
            companyId: user.companyId,
            categoryId,
            fileId: file.id,
            createdById: user.id
          })

          successCount++
        } catch (error) {
          errors.push({
            row: i + 1,
            message: error instanceof Error ? error.message : 'Erro ao processar linha'
          })
        }
      }

      // Criar transações em lote
      if (transactionsToCreate.length > 0) {
        await prisma.transaction.createMany({
          data: transactionsToCreate
        })
      }

      // Atualizar arquivo com resultado do processamento
      await prisma.file.update({
        where: { id: fileId },
        data: {
          status: errors.length > 0 && successCount === 0 ? 'ERROR' : 'COMPLETED',
          processedRows: processedData.rows.length,
          successfulRows: successCount,
          failedRows: errors.length,
          errorMessage: errors.length > 0 ? JSON.stringify(errors) : null,
          processedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        processed: {
          total: processedData.rows.length,
          successful: successCount,
          failed: errors.length,
          errors: errors.slice(0, 10) // Limitar erros retornados
        }
      })
    } catch (error) {
      // Marcar arquivo como ERROR
      await prisma.file.update({
        where: { id: fileId },
        data: {
          status: 'ERROR',
          errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      })

      throw error
    }
  } catch (error) {
    console.error('Erro no processamento:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao processar arquivo',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

