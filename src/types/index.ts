import { User, Company, Transaction, Category, File, Integration, Role, TransactionType, FileStatus, IntegrationType } from '@prisma/client'

// Tipos base do Prisma
export type { User, Company, Transaction, Category, File, Integration, Role, TransactionType, FileStatus, IntegrationType }

// Tipos estendidos para o frontend
export interface UserWithCompany extends User {
  company?: Company | null
}

export interface TransactionWithDetails extends Transaction {
  category?: Category | null
  createdBy?: User | null
  updatedBy?: User | null
}

export interface CompanyWithStats extends Company {
  _count?: {
    users: number
    transactions: number
    categories: number
  }
}

// Tipos para formulários
export interface CreateUserData {
  email: string
  fullName?: string
  role?: Role
  companyId?: string
}

export interface CreateCompanyData {
  name: string
  description?: string
  logoUrl?: string
}

export interface CreateTransactionData {
  amount: number
  description: string
  type: TransactionType
  date: Date
  categoryId?: string
  companyId: string
}

export interface CreateCategoryData {
  name: string
  description?: string
  color?: string
  companyId: string
}

// Tipos para recorrência
export type RecurrenceFrequency = 'MONTHLY' | 'WEEKLY' | 'YEARLY' | 'DAILY'

export interface RecurrenceRule {
  frequency: RecurrenceFrequency
  interval: number
  startDate: string
  endDate?: string
  dayOfMonth?: number
  dayOfWeek?: number
}

export interface TransactionWithRecurrence extends Omit<Transaction, 'recurrenceRule' | 'parentTransactionId'> {
  isRecurring: boolean
  recurrenceRule?: RecurrenceRule | null
  parentTransactionId?: string | null
}

// Tipos para dashboard
export interface DashboardStats {
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  transactionCount: number
  recurringExpenses: number
  oneTimeExpenses: number
  recurringIncome: number
  oneTimeIncome: number
  monthlyTrend: Array<{
    month: string
    revenue: number
    expenses: number
  }>
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
  }>
}

// Tipos para upload de arquivos
export interface FileUploadProgress {
  fileId: string
  fileName: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

// Tipos para integrações
export interface IntegrationConfig {
  name: string
  type: IntegrationType
  config: Record<string, unknown>
  isActive: boolean
}

// Tipos para API responses
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
