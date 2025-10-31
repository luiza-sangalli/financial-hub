'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface FileUploadProps {
  onUploadComplete?: (fileId: string) => void
}

export function FileUpload ({ onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [processResult, setProcessResult] = useState<{ successfulRows?: number; failedRows?: number; total?: number; failed?: number; successful?: number; errors?: Array<{ row: number; message: string }> } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setSuccess(null)
      setProcessResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo primeiro')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Erro ao fazer upload')
      }

      setSuccess('Upload concluído! Processando arquivo...')
      setUploading(false)
      setProcessing(true)

      // Processar arquivo
      const processRes = await fetch('/api/files/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId: uploadData.file.id })
      })

      const processData = await processRes.json()

      if (!processRes.ok) {
        throw new Error(processData.error || 'Erro ao processar arquivo')
      }

      setProcessing(false)
      setProcessResult(processData.processed)
      setSuccess('Arquivo processado com sucesso!')
      
      // Reset
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Callback
      if (onUploadComplete) {
        onUploadComplete(uploadData.file.id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setUploading(false)
      setProcessing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const handleDownloadTemplate = () => {
    window.open('/api/files/template', '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Upload de Arquivo</CardTitle>
            <CardDescription>
              Importe transações financeiras de arquivos CSV ou Excel
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="text-xs"
          >
            📥 Baixar Template
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={uploading || processing}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {file && (
            <div className="text-sm text-slate-600">
              <span className="font-medium">{file.name}</span>
              <span className="text-slate-400"> ({formatFileSize(file.size)})</span>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading || processing}
            className="w-full"
          >
            {uploading && 'Fazendo upload...'}
            {processing && 'Processando...'}
            {!uploading && !processing && 'Enviar e Processar'}
          </Button>

          {(uploading || processing) && (
            <Progress value={uploading ? 50 : 100} className="w-full" />
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {processResult && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Resultado do Processamento</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">
                  {processResult.total}
                </div>
                <div className="text-xs text-slate-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {processResult.successful}
                </div>
                <div className="text-xs text-slate-500">Sucesso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {processResult.failed}
                </div>
                <div className="text-xs text-slate-500">Falhas</div>
              </div>
            </div>
            {processResult.errors && processResult.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-slate-600 mb-1">Erros encontrados:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {processResult.errors.map((err: { row: number; message: string }, idx: number) => (
                    <div key={idx} className="text-xs text-red-600 bg-red-50 p-1 rounded">
                      Linha {err.row}: {err.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-sm">Formato do Arquivo</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadTemplate}
              className="text-xs h-7"
            >
              📥 Baixar Template
            </Button>
          </div>
          <p className="text-xs text-slate-600 mb-2">
            O arquivo deve conter as seguintes colunas:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div>
              <Badge variant="outline" className="mb-1">Obrigatórias</Badge>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>date (data)</li>
                <li>description (descrição)</li>
                <li>amount (valor)</li>
                <li>type (tipo: INCOME/EXPENSE)</li>
              </ul>
            </div>
            <div>
              <Badge variant="outline" className="mb-1">Opcionais</Badge>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>category (categoria)</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
            <p className="font-medium mb-1">💡 Dica:</p>
            <p>Baixe o template para garantir que seu arquivo está no formato correto. As transações sem categoria serão categorizadas automaticamente.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

