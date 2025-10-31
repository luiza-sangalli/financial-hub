import { NextResponse } from 'next/server'

export async function GET () {
  // Template CSV com exemplos
  const csvContent = `date,description,amount,type,category
01/10/2025,Venda de Produto A,1500.00,INCOME,Vendas
02/10/2025,Aluguel Escritório,2000.00,EXPENSE,Moradia
03/10/2025,Restaurante Almoço,85.50,EXPENSE,Alimentação
04/10/2025,Uber Centro-Casa,35.00,EXPENSE,Transporte
05/10/2025,Salário Outubro,5000.00,INCOME,Salário
06/10/2025,Conta de Luz,250.00,EXPENSE,Moradia
07/10/2025,Supermercado Extra,450.00,EXPENSE,Alimentação
08/10/2025,Gasolina Posto Shell,200.00,EXPENSE,Transporte
09/10/2025,Netflix Assinatura,45.90,EXPENSE,Lazer
10/10/2025,Farmácia Remédios,120.00,EXPENSE,Saúde
11/10/2025,Venda de Serviço,800.00,INCOME,Vendas
12/10/2025,Internet Fibra,99.90,EXPENSE,Moradia
13/10/2025,Pizzaria Jantar,95.00,EXPENSE,Alimentação
14/10/2025,Estacionamento Shopping,15.00,EXPENSE,Transporte
15/10/2025,Academia Mensalidade,149.90,EXPENSE,Lazer`

  // Criar resposta com headers apropriados para download
  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="template-transacoes.csv"',
      'Cache-Control': 'no-cache'
    }
  })
}

