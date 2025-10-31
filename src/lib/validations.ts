import { z } from 'zod'

// Validações para usuários
export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  role: z.enum(['ADMIN', 'USER', 'VIEWER']).optional(),
  companyId: z.string().optional(),
})

export const updateUserSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  role: z.enum(['ADMIN', 'USER', 'VIEWER']).optional(),
  companyId: z.string().optional(),
})

// Validações para empresas
export const createCompanySchema = z.object({
  name: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  logoUrl: z.string().url('URL inválida').optional(),
})

export const updateCompanySchema = z.object({
  name: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres').optional(),
  description: z.string().optional(),
  logoUrl: z.string().url('URL inválida').optional(),
})

// Validações para transações
export const createTransactionSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.date(),
  categoryId: z.string().optional(),
  companyId: z.string().min(1, 'ID da empresa é obrigatório'),
})

export const updateTransactionSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo').optional(),
  description: z.string().min(1, 'Descrição é obrigatória').optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  date: z.date().optional(),
  categoryId: z.string().optional(),
})

// Validações para categorias
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal').optional(),
  companyId: z.string().min(1, 'ID da empresa é obrigatório'),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório').optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal').optional(),
})

// Validações para upload de arquivos
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'Nome do arquivo é obrigatório'),
  size: z.number().positive('Tamanho do arquivo deve ser positivo'),
  mimeType: z.string().min(1, 'Tipo MIME é obrigatório'),
  companyId: z.string().min(1, 'ID da empresa é obrigatório'),
})

// Validações para integrações
export const createIntegrationSchema = z.object({
  name: z.string().min(1, 'Nome da integração é obrigatório'),
  type: z.enum(['BANK', 'ERP', 'API', 'WEBHOOK']),
  config: z.record(z.any()),
  companyId: z.string().min(1, 'ID da empresa é obrigatório'),
})

// Validações para paginação
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Validações para filtros de transações
export const transactionFiltersSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
})

// Tipos inferidos dos schemas
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateCompanyInput = z.infer<typeof createCompanySchema>
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type FileUploadInput = z.infer<typeof fileUploadSchema>
export type CreateIntegrationInput = z.infer<typeof createIntegrationSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type TransactionFiltersInput = z.infer<typeof transactionFiltersSchema>
