'use client'

import { DashboardLayoutWithSidebar } from '../layout-with-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconHelp, IconBook, IconMessageCircle, IconMail } from '@tabler/icons-react'

export default function HelpPage () {
  return (
    <DashboardLayoutWithSidebar
      title="Ajuda"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Ajuda' }
      ]}
    >
      <div className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IconHelp className="h-6 w-6 text-slate-600" />
              <div>
                <CardTitle>Central de Ajuda</CardTitle>
                <CardDescription>
                  Encontre respostas e suporte para o FinancialHub
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
              {/* Documentação */}
              <div className="flex flex-col items-center p-6 border rounded-lg hover:bg-slate-50 transition-colors">
                <IconBook className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Documentação</h3>
                <p className="text-sm text-slate-600 text-center mb-4">
                  Guias completos sobre como usar o sistema
                </p>
                <a href="/docs" className="text-sm text-blue-600 hover:underline">
                  Ver documentos →
                </a>
              </div>

              {/* FAQ */}
              <div className="flex flex-col items-center p-6 border rounded-lg hover:bg-slate-50 transition-colors">
                <IconMessageCircle className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="font-semibold mb-2">FAQ</h3>
                <p className="text-sm text-slate-600 text-center mb-4">
                  Perguntas frequentes e respostas rápidas
                </p>
                <span className="text-sm text-slate-400">
                  Em breve
                </span>
              </div>

              {/* Suporte */}
              <div className="flex flex-col items-center p-6 border rounded-lg hover:bg-slate-50 transition-colors">
                <IconMail className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Suporte</h3>
                <p className="text-sm text-slate-600 text-center mb-4">
                  Entre em contato com nossa equipe
                </p>
                <a href="mailto:suporte@financialhub.com" className="text-sm text-purple-600 hover:underline">
                  Enviar email →
                </a>
              </div>
            </div>

            {/* Recursos Rápidos */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold mb-4">Recursos Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    📄 Como importar transações
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    📊 Entendendo a visualização de dados
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    🔄 Trabalhando com transações recorrentes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    🏷️ Gerenciando categorias
                  </a>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayoutWithSidebar>
  )
}

