'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FileRecord {
  id: string
  name: string
  size: number
  status: string
  processedRows: number | null
  successfulRows: number | null
  failedRows: number | null
  transactionsCount: number
  errorMessage: string | null
  processedAt: string | null
  createdAt: string
}

interface FileHistoryProps {
  refreshTrigger?: number
}

export function FileHistory ({ refreshTrigger }: FileHistoryProps) {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles()
  }, [refreshTrigger])

  const fetchFiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/files')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao carregar arquivos')
      }

      setFiles(data.files)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PENDING: 'secondary',
      PROCESSING: 'default',
      COMPLETED: 'outline',
      ERROR: 'destructive'
    }

    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      PROCESSING: 'Processando',
      COMPLETED: 'Concluído',
      ERROR: 'Erro'
    }

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Uploads</CardTitle>
        <CardDescription>
          Arquivos enviados e processados recentemente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            Nenhum arquivo enviado ainda
          </p>
        ) : (
          <div className="space-y-4">
            {files.map(file => (
              <div
                key={file.id}
                className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{file.name}</h4>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(file.status)}
                </div>

                {file.status === 'COMPLETED' && (
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-700">
                        {file.processedRows || 0}
                      </div>
                      <div className="text-xs text-slate-500">Processadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {file.successfulRows || 0}
                      </div>
                      <div className="text-xs text-slate-500">Sucesso</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">
                        {file.failedRows || 0}
                      </div>
                      <div className="text-xs text-slate-500">Falhas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {file.transactionsCount}
                      </div>
                      <div className="text-xs text-slate-500">Transações</div>
                    </div>
                  </div>
                )}

                {file.status === 'ERROR' && file.errorMessage && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    {file.errorMessage}
                  </div>
                )}

                {file.status === 'PROCESSING' && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                    Processando arquivo... Isso pode levar alguns instantes.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

