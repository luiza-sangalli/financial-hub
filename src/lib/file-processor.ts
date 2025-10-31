import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export interface TransactionRow {
  date: string
  description: string
  amount: string
  type: 'INCOME' | 'EXPENSE'
  category?: string
}

export interface ProcessedFileData {
  rows: TransactionRow[]
  headers: string[]
  errors: Array<{ row: number, message: string }>
}

/**
 * Processa texto CSV
 */
export async function processCSVFromText (csvText: string): Promise<ProcessedFileData> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: Array<{ row: number, message: string }> = []
        
        // Validar headers
        const headers = results.meta.fields || []
        const requiredHeaders = ['date', 'description', 'amount', 'type']
        const missingHeaders = requiredHeaders.filter(h => 
          !headers.some(header => header.toLowerCase().includes(h))
        )

        if (missingHeaders.length > 0) {
          reject(new Error(`Colunas obrigatórias ausentes: ${missingHeaders.join(', ')}`))
          return
        }

        // Processar linhas
        const rows = (results.data as Array<Record<string, unknown>>).map((row, index) => {
          try {
            return normalizeRow(row, headers)
          } catch (error) {
            errors.push({
              row: index + 1,
              message: error instanceof Error ? error.message : 'Erro desconhecido'
            })
            return null
          }
        }).filter((row): row is TransactionRow => row !== null)

        resolve({
          rows,
          headers,
          errors
        })
      },
      error: (error: Error) => {
        reject(new Error(`Erro ao processar CSV: ${error.message}`))
      }
    })
  })
}

/**
 * Processa arquivo CSV (para uso no browser)
 */
export async function processCSV (file: File): Promise<ProcessedFileData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: Array<{ row: number, message: string }> = []
        
        // Validar headers
        const headers = results.meta.fields || []
        const requiredHeaders = ['date', 'description', 'amount', 'type']
        const missingHeaders = requiredHeaders.filter(h => 
          !headers.some(header => header.toLowerCase().includes(h))
        )

        if (missingHeaders.length > 0) {
          reject(new Error(`Colunas obrigatórias ausentes: ${missingHeaders.join(', ')}`))
          return
        }

        // Processar linhas
        const rows = (results.data as Array<Record<string, unknown>>).map((row, index) => {
          try {
            return normalizeRow(row, headers)
          } catch (error) {
            errors.push({
              row: index + 1,
              message: error instanceof Error ? error.message : 'Erro desconhecido'
            })
            return null
          }
        }).filter((row): row is TransactionRow => row !== null)

        resolve({
          rows,
          headers,
          errors
        })
      },
      error: (error: Error) => {
        reject(new Error(`Erro ao processar CSV: ${error.message}`))
      }
    })
  })
}

/**
 * Processa Excel direto do buffer
 */
export async function processExcelFromBuffer (buffer: Buffer): Promise<ProcessedFileData> {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      if (jsonData.length < 2) {
        reject(new Error('Arquivo deve conter pelo menos uma linha de dados'))
        return
      }

      const headers = (jsonData[0] as unknown[]).map(h => String(h))
      const requiredHeaders = ['date', 'description', 'amount', 'type']
      const missingHeaders = requiredHeaders.filter(h => 
        !headers.some(header => String(header).toLowerCase().includes(h))
      )

      if (missingHeaders.length > 0) {
        reject(new Error(`Colunas obrigatórias ausentes: ${missingHeaders.join(', ')}`))
        return
      }

      const errors: Array<{ row: number, message: string }> = []
      const rows: TransactionRow[] = []

      for (let i = 1; i < jsonData.length; i++) {
        const rowData = jsonData[i] as unknown[]
        const rowObject: Record<string, unknown> = {}
        
        headers.forEach((header, index) => {
          rowObject[header] = rowData[index]
        })

        try {
          const normalized = normalizeRow(rowObject, headers)
          rows.push(normalized)
        } catch (error) {
          errors.push({
            row: i + 1,
            message: error instanceof Error ? error.message : 'Erro desconhecido'
          })
        }
      }

      resolve({
        rows,
        headers,
        errors
      })
    } catch (error) {
      reject(new Error(`Erro ao processar Excel: ${error instanceof Error ? error.message : 'Erro desconhecido'}`))
    }
  })
}

/**
 * Processa arquivo Excel (para uso no browser)
 */
export async function processExcel (file: File): Promise<ProcessedFileData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          reject(new Error('Arquivo vazio'))
          return
        }

        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length < 2) {
          reject(new Error('Arquivo deve conter pelo menos uma linha de dados'))
          return
        }

        const headers = (jsonData[0] as unknown[]).map(h => String(h))
        const requiredHeaders = ['date', 'description', 'amount', 'type']
        const missingHeaders = requiredHeaders.filter(h => 
          !headers.some(header => String(header).toLowerCase().includes(h))
        )

        if (missingHeaders.length > 0) {
          reject(new Error(`Colunas obrigatórias ausentes: ${missingHeaders.join(', ')}`))
          return
        }

        const errors: Array<{ row: number, message: string }> = []
        const rows: TransactionRow[] = []

        for (let i = 1; i < jsonData.length; i++) {
          const rowData = jsonData[i] as unknown[]
          const rowObject: Record<string, unknown> = {}
          
          headers.forEach((header, index) => {
            rowObject[header] = rowData[index]
          })

          try {
            const normalized = normalizeRow(rowObject, headers)
            rows.push(normalized)
          } catch (error) {
            errors.push({
              row: i + 1,
              message: error instanceof Error ? error.message : 'Erro desconhecido'
            })
          }
        }

        resolve({
          rows,
          headers,
          errors
        })
      } catch (error) {
        reject(new Error(`Erro ao processar Excel: ${error instanceof Error ? error.message : 'Erro desconhecido'}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * Normaliza uma linha de dados
 */
function normalizeRow (row: Record<string, unknown>, headers: string[]): TransactionRow {
  // Encontrar os campos corretos (case-insensitive e flexível)
  const findField = (possibleNames: string[]): string | undefined => {
    for (const name of possibleNames) {
      const key = headers.find(h => 
        h.toLowerCase().includes(name.toLowerCase())
      )
      if (key && row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return String(row[key]).trim()
      }
    }
    return undefined
  }

  const date = findField(['date', 'data', 'dt'])
  const description = findField(['description', 'descricao', 'desc', 'historico'])
  const amount = findField(['amount', 'valor', 'value'])
  const type = findField(['type', 'tipo'])

  if (!date) throw new Error('Campo "data" ausente ou vazio')
  if (!description) throw new Error('Campo "descrição" ausente ou vazio')
  if (!amount) throw new Error('Campo "valor" ausente ou vazio')
  if (!type) throw new Error('Campo "tipo" ausente ou vazio')

  // Validar e normalizar tipo
  const normalizedType = type.toUpperCase()
  if (!['INCOME', 'EXPENSE', 'RECEITA', 'DESPESA', 'ENTRADA', 'SAIDA'].includes(normalizedType)) {
    throw new Error(`Tipo inválido: ${type}. Use INCOME/RECEITA ou EXPENSE/DESPESA`)
  }

  const finalType = ['INCOME', 'RECEITA', 'ENTRADA'].includes(normalizedType) ? 'INCOME' : 'EXPENSE'

  // Validar data
  const parsedDate = parseDate(date)
  if (!parsedDate) {
    throw new Error(`Data inválida: ${date}`)
  }

  // Validar amount
  const parsedAmount = parseAmount(amount)
  if (isNaN(parsedAmount) || parsedAmount === 0) {
    throw new Error(`Valor inválido: ${amount}`)
  }

  const category = findField(['category', 'categoria', 'cat'])

  return {
    date: parsedDate,
    description,
    amount: String(parsedAmount),
    type: finalType,
    category
  }
}

/**
 * Parse de data com suporte a múltiplos formatos
 */
function parseDate (dateStr: string): string | null {
  // Formatos suportados: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY
  const formats = [
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
    /^(\d{2})-(\d{2})-(\d{4})$/ // DD-MM-YYYY
  ]

  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      let year: string, month: string, day: string

      if (format === formats[0]) { // DD/MM/YYYY
        [, day, month, year] = match
      } else if (format === formats[1]) { // YYYY-MM-DD
        [, year, month, day] = match
      } else { // DD-MM-YYYY
        [, day, month, year] = match
      }

      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
    }
  }

  // Tentar parse direto
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date.toISOString()
  }

  return null
}

/**
 * Parse de valor monetário
 */
function parseAmount (amountStr: string): number {
  // Converter para string e remover espaços e símbolos de moeda
  let cleaned = String(amountStr).trim().replace(/[R$\s]/g, '')

  // Detectar formato: 
  // - Se tem vírgula E ponto: formato BR (1.500,00) - ponto é milhar, vírgula é decimal
  // - Se tem apenas vírgula: formato BR (1500,00) - vírgula é decimal
  // - Se tem apenas ponto: formato US (1500.00) - ponto é decimal
  
  const hasComma = cleaned.includes(',')
  const hasDot = cleaned.includes('.')

  if (hasComma && hasDot) {
    // Formato BR: 1.500,00 ou formato inválido
    // Contar quantos de cada tem para determinar qual é o separador decimal
    const lastComma = cleaned.lastIndexOf(',')
    const lastDot = cleaned.lastIndexOf('.')
    
    if (lastComma > lastDot) {
      // Vírgula vem depois, então é o decimal: 1.500,00
      cleaned = cleaned.replace(/\./g, '').replace(',', '.')
    } else {
      // Ponto vem depois, então é o decimal: 1,500.00
      cleaned = cleaned.replace(/,/g, '')
    }
  } else if (hasComma) {
    // Apenas vírgula: formato BR (1500,00)
    cleaned = cleaned.replace(',', '.')
  }
  // Se tem apenas ponto ou nenhum separador, usa direto

  return parseFloat(cleaned)
}

/**
 * Detecta o tipo de arquivo
 */
export function detectFileType (filename: string, mimeType: string): 'csv' | 'excel' | null {
  const lower = filename.toLowerCase()
  
  if (lower.endsWith('.csv') || mimeType === 'text/csv') {
    return 'csv'
  }
  
  if (
    lower.endsWith('.xlsx') || 
    lower.endsWith('.xls') ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel'
  ) {
    return 'excel'
  }

  return null
}

