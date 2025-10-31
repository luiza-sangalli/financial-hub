/**
 * Sistema de categorização automática de transações
 */

export interface CategoryRule {
  keywords: string[]
  category: string
}

// Regras de categorização baseadas em palavras-chave
const CATEGORY_RULES: CategoryRule[] = [
  // Alimentação
  {
    keywords: ['restaurante', 'lanchonete', 'padaria', 'supermercado', 'mercado', 'ifood', 'uber eats', 'rappi', 'cafe', 'pizzaria', 'hamburgueria', 'açougue', 'hortifruti', 'feira'],
    category: 'Alimentação'
  },
  // Transporte
  {
    keywords: ['uber', 'taxi', '99', 'posto', 'combustivel', 'gasolina', 'alcool', 'ipva', 'estacionamento', 'pedagio', 'metrô', 'onibus', 'estac'],
    category: 'Transporte'
  },
  // Moradia
  {
    keywords: ['aluguel', 'condominio', 'agua', 'luz', 'energia', 'gas', 'internet', 'telefone', 'iptu', 'conserto', 'reforma', 'manutencao'],
    category: 'Moradia'
  },
  // Saúde
  {
    keywords: ['farmacia', 'drogaria', 'medico', 'hospital', 'clinica', 'laboratorio', 'exame', 'consulta', 'plano de saude', 'convenio', 'dentista', 'psicologo'],
    category: 'Saúde'
  },
  // Educação
  {
    keywords: ['escola', 'faculdade', 'universidade', 'curso', 'livro', 'livraria', 'material escolar', 'mensalidade', 'matricula', 'apostila'],
    category: 'Educação'
  },
  // Lazer
  {
    keywords: ['cinema', 'teatro', 'show', 'evento', 'festa', 'bar', 'balada', 'clube', 'academia', 'streaming', 'netflix', 'spotify', 'amazon prime', 'disney', 'youtube'],
    category: 'Lazer'
  },
  // Vestuário
  {
    keywords: ['roupa', 'calçado', 'sapato', 'tenis', 'loja', 'boutique', 'magazine', 'zara', 'renner', 'c&a', 'riachuelo'],
    category: 'Vestuário'
  },
  // Tecnologia
  {
    keywords: ['notebook', 'celular', 'computador', 'mouse', 'teclado', 'software', 'app', 'google', 'apple', 'microsoft', 'adobe'],
    category: 'Tecnologia'
  },
  // Serviços
  {
    keywords: ['salao', 'cabelereiro', 'barbeiro', 'manicure', 'lavanderia', 'lavagem', 'correios', 'cartorio', 'despachante'],
    category: 'Serviços'
  },
  // Viagem
  {
    keywords: ['hotel', 'pousada', 'hospedagem', 'passagem', 'aeroporto', 'viagem', 'turismo', 'decolar', 'latam', 'gol', 'azul'],
    category: 'Viagem'
  },
  // Impostos e Taxas
  {
    keywords: ['imposto', 'taxa', 'multa', 'ir', 'darf', 'inss', 'fgts', 'pis', 'cofins'],
    category: 'Impostos e Taxas'
  },
  // Seguros
  {
    keywords: ['seguro', 'seguradora', 'apolice'],
    category: 'Seguros'
  },
  // Investimentos
  {
    keywords: ['investimento', 'aplicacao', 'poupanca', 'tesouro', 'cdb', 'lci', 'lca', 'fundo', 'acao', 'bolsa', 'corretora'],
    category: 'Investimentos'
  },
  // Salário e Receitas
  {
    keywords: ['salario', 'pagamento', 'receita', 'venda', 'comissao', 'bonus', 'freelance', 'prestacao de servico'],
    category: 'Salário e Receitas'
  },
  // Empréstimos
  {
    keywords: ['emprestimo', 'financiamento', 'prestacao', 'parcela', 'credito'],
    category: 'Empréstimos'
  }
]

/**
 * Categoriza uma transação baseada em sua descrição
 */
export function categorizeTransaction (description: string): string | null {
  const normalizedDesc = description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      const normalizedKeyword = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      
      if (normalizedDesc.includes(normalizedKeyword)) {
        return rule.category
      }
    }
  }

  return null
}

/**
 * Categoriza múltiplas transações
 */
export function categorizeTransactions (transactions: Array<{ description: string }>): Array<string | null> {
  return transactions.map(t => categorizeTransaction(t.description))
}

/**
 * Obtém estatísticas de categorização
 */
export function getCategoryStats (transactions: Array<{ description: string }>) {
  const categories = categorizeTransactions(transactions)
  const total = categories.length
  const categorized = categories.filter(c => c !== null).length
  const uncategorized = total - categorized

  const categoryCount: Record<string, number> = {}
  categories.forEach(cat => {
    if (cat) {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    }
  })

  return {
    total,
    categorized,
    uncategorized,
    percentage: total > 0 ? Math.round((categorized / total) * 100) : 0,
    categoryCount
  }
}

/**
 * Lista todas as categorias disponíveis
 */
export function getAvailableCategories (): string[] {
  return [...new Set(CATEGORY_RULES.map(r => r.category))].sort()
}

