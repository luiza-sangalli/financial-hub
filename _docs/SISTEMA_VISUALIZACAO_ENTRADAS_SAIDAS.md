# Sistema de Visualização de Entradas e Saídas
**Data:** 24/10/2025 - 18:15

## 🎯 Visão Geral

Sistema completo de visualização e análise de transações financeiras, permitindo acompanhamento detalhado de entradas e saídas com filtros avançados, gráficos e insights automáticos.

## ✨ Funcionalidades Principais

### 1. Filtros Avançados
- **Períodos Pré-definidos**:
  - Este Mês
  - Trimestre Atual
  - Este Ano
  - Todos os Dados
  
- **Período Customizado**: Selecione data inicial e final específicas

- **Filtro por Tipo**:
  - Todas as transações
  - Apenas Entradas (receitas)
  - Apenas Saídas (despesas)

### 2. Visualizações

#### A. Resumo do Período
Card com análise comparativa incluindo:
- **Resultado Líquido**: Destaque visual de superávit ou déficit
- **Total de Entradas e Saídas**: Com valores médios
- **Valores Recorrentes**: Separação de receitas/despesas fixas
- **Barra de Distribuição**: Visual percentual de entradas vs saídas
- **Insights Automáticos**: Análise inteligente dos dados

#### B. Evolução Mensal
Gráfico de barras comparativo mostrando:
- Entradas e saídas lado a lado por mês
- Resultado líquido mensal
- Valores totais do período
- Escala automática baseada nos valores

#### C. Categorias
Análise detalhada por categoria:
- **Top Categorias de Saídas**: Maiores despesas por categoria
- **Top Categorias de Entradas**: Maiores receitas por categoria
- Percentual de cada categoria no total
- Quantidade de transações por categoria
- Barra de progresso visual

#### D. Destaques
- Maior entrada do período
- Maior saída do período
- Data, descrição e categoria de cada destaque

## 📊 Estrutura Técnica

### API Endpoint

**Rota:** `GET /api/transactions/analytics`

**Query Parameters:**
```typescript
{
  startDate?: string  // YYYY-MM-DD
  endDate?: string    // YYYY-MM-DD
  categoryId?: string // ID da categoria
  type?: 'INCOME' | 'EXPENSE'
}
```

**Response:**
```typescript
{
  success: boolean
  period: {
    startDate: string | null
    endDate: string | null
  }
  summary: {
    totalIncome: number
    totalExpense: number
    netResult: number
    recurringIncome: number
    recurringExpense: number
    transactionCount: number
    averageIncome: number
    averageExpense: number
  }
  monthlyTimeSeries: Array<{
    month: string
    income: number
    expense: number
    net: number
    count: number
  }>
  topExpenseCategories: CategoryData[]
  topIncomeCategories: CategoryData[]
  highlights: {
    largestIncome: TransactionHighlight | null
    largestExpense: TransactionHighlight | null
  }
}
```

### Componentes Criados

#### 1. `TransactionFilters`
**Localização:** `src/components/dashboard/transaction-filters.tsx`

Componente de filtros com:
- Seleção de período pré-definido
- Seleção de datas customizadas
- Filtro por tipo de transação
- Aplicação automática de filtros

**Props:**
```typescript
{
  onFilterChange: (filters: FilterValues) => void
}
```

#### 2. `IncomeExpenseChart`
**Localização:** `src/components/dashboard/income-expense-chart.tsx`

Gráfico de barras comparativo mensal.

**Props:**
```typescript
{
  data: MonthlyData[]
  loading?: boolean
}
```

#### 3. `IncomeExpenseComparison`
**Localização:** `src/components/dashboard/income-expense-comparison.tsx`

Card de resumo com comparação detalhada.

**Props:**
```typescript
{
  data: ComparisonData
  loading?: boolean
}
```

#### 4. `CategoryBreakdown`
**Localização:** `src/components/dashboard/category-breakdown.tsx`

Análise por categoria com barras de progresso.

**Props:**
```typescript
{
  title: string
  description: string
  data: CategoryData[]
  type: 'income' | 'expense'
  loading?: boolean
}
```

### Página Principal

**Rota:** `/dashboard/transactions`

Integra todos os componentes em um layout responsivo com sidebar de filtros e conteúdo principal.

## 🚀 Como Usar

### Acessar o Sistema

1. Faça login no sistema
2. No Dashboard principal, clique no botão **"📊 Visualizar Entradas e Saídas"**
3. Ou navegue diretamente para `/dashboard/transactions`

### Filtrar Dados

#### Por Período Pré-definido:
1. No card "Filtros" à esquerda, clique em um dos botões:
   - **Este Mês**: Dados do mês atual
   - **Trimestre**: Últimos 3 meses
   - **Este Ano**: Ano atual completo
   - **Tudo**: Todos os dados disponíveis

#### Por Período Customizado:
1. No card "Filtros", seção "Período Customizado"
2. Selecione a data inicial no campo "De"
3. Selecione a data final no campo "Até"
4. Clique em "Aplicar Datas"

#### Por Tipo de Transação:
1. No card "Filtros", seção "Tipo de Transação"
2. Clique em:
   - **Todas**: Mostra entradas e saídas
   - **Entradas**: Apenas receitas
   - **Saídas**: Apenas despesas

### Interpretar os Dados

#### Resultado Líquido
- **Verde**: Superávit (entradas > saídas) ✓
- **Vermelho**: Déficit (saídas > entradas) ⚠
- **Margem %**: Percentual de lucro sobre as entradas

#### Evolução Mensal
- **Barra Verde**: Entradas do mês
- **Barra Vermelha**: Saídas do mês
- **Valor no topo**: Resultado líquido (verde = positivo, vermelho = negativo)

#### Insights Automáticos
O sistema gera automaticamente análises como:
- Percentual de despesas recorrentes
- Comparação de médias
- Alertas de déficit
- Oportunidades de otimização

## 📋 Casos de Uso

### Caso 1: Análise Mensal
**Objetivo:** Entender o mês atual

**Passos:**
1. Acesse `/dashboard/transactions`
2. Filtro já vem em "Este Mês" por padrão
3. Analise:
   - Resultado líquido (superávit/déficit)
   - Principais categorias de gasto
   - Comparação com meses anteriores (evolução)

### Caso 2: Planejamento Trimestral
**Objetivo:** Análise de tendências

**Passos:**
1. Selecione filtro "Trimestre"
2. Observe o gráfico de evolução mensal
3. Identifique padrões:
   - Meses com maior déficit
   - Categorias que cresceram
   - Receitas sazonais

### Caso 3: Análise Anual
**Objetivo:** Relatório anual

**Passos:**
1. Selecione filtro "Este Ano"
2. Verifique:
   - Total de entradas e saídas no ano
   - Evolução mês a mês
   - Top categorias do ano
   - Maior receita e despesa

### Caso 4: Período Específico
**Objetivo:** Analisar campanha ou projeto específico

**Passos:**
1. Use "Período Customizado"
2. Defina data inicial e final
3. Filtre por tipo se necessário
4. Analise os resultados específicos

### Caso 5: Foco em Despesas
**Objetivo:** Otimizar custos

**Passos:**
1. Selecione filtro "Saídas"
2. Analise "Top Categorias - Saídas"
3. Identifique maiores gastos
4. Veja percentual de despesas recorrentes
5. Use insights para decisões

## 🎨 Design e UX

### Cores
- **Verde (#22c55e)**: Entradas, superávit, positivo
- **Vermelho (#ef4444)**: Saídas, déficit, atenção
- **Azul (#3b82f6)**: Neutro, informação
- **Cinza (#64748b)**: Texto secundário

### Layout Responsivo
- **Desktop**: Filtros na sidebar esquerda, conteúdo em 3 colunas
- **Tablet**: Filtros no topo, conteúdo em 2 colunas
- **Mobile**: Stack vertical, filtros colapsáveis

### Estados
- **Loading**: Skeleton com mensagem "Carregando..."
- **Erro**: Alert vermelho com mensagem clara
- **Vazio**: Card com CTA para importar dados
- **Sucesso**: Todos os componentes renderizados

## 📈 Métricas Disponíveis

### Resumo Financeiro
- Total de Entradas
- Total de Saídas
- Resultado Líquido
- Margem de Lucro (%)
- Taxa de Retenção

### Análise de Recorrência
- Receitas Recorrentes
- Despesas Recorrentes (Fixas)
- Percentual de Fixos vs Variáveis

### Médias
- Valor Médio de Entrada
- Valor Médio de Saída
- Transações por Mês

### Categorização
- Top 10 Categorias de Despesa
- Top 10 Categorias de Receita
- Distribuição Percentual
- Quantidade de Transações

## 🔄 Integração com Outros Módulos

### Dashboard Principal
- Link direto no header
- Cards de resumo sincronizados
- Mesma base de dados

### Importação de Dados
- Dados importados aparecem automaticamente
- Filtros detectam novos períodos
- Categorização automática aplicada

### Transações Recorrentes
- Separação de fixos vs variáveis
- Insights sobre recorrência
- Compatível com detecção de padrões

## 🛠️ Manutenção e Extensibilidade

### Adicionar Novo Filtro

1. **Atualizar `TransactionFilters`:**
```typescript
// Adicionar estado
const [newFilter, setNewFilter] = useState('')

// Adicionar UI
<Input onChange={(e) => setNewFilter(e.target.value)} />

// Incluir no callback
onFilterChange({ ...filters, newFilter })
```

2. **Atualizar API:**
```typescript
// Em /api/transactions/analytics/route.ts
const newFilter = searchParams.get('newFilter')
if (newFilter) {
  where.newField = newFilter
}
```

### Adicionar Nova Visualização

1. Criar componente em `src/components/dashboard/`
2. Importar na página `src/app/dashboard/transactions/page.tsx`
3. Adicionar no layout onde desejar
4. Passar dados do estado `data`

### Adicionar Nova Métrica

1. Calcular na API `analytics/route.ts`:
```typescript
const newMetric = transactions.reduce(...)
```

2. Adicionar ao response:
```typescript
summary: {
  ...
  newMetric
}
```

3. Exibir no componente desejado

## 🎯 Próximas Melhorias Sugeridas

### Curto Prazo
- [ ] Exportação para PDF/Excel
- [ ] Filtro por categoria específica
- [ ] Comparação de períodos lado a lado
- [ ] Gráfico de linha (além de barras)

### Médio Prazo
- [ ] Gráfico de pizza para categorias
- [ ] Previsão baseada em tendências
- [ ] Alertas configuráveis
- [ ] Dashboard personalizável

### Longo Prazo
- [ ] Análise preditiva com IA
- [ ] Recomendações de otimização
- [ ] Benchmarking com outras empresas
- [ ] Relatórios automáticos por email

## 📱 Responsividade

### Desktop (> 1024px)
- Layout em 4 colunas (1 filtros + 3 conteúdo)
- Gráficos lado a lado
- Todas as visualizações visíveis

### Tablet (768px - 1024px)
- Layout em 2 colunas
- Filtros no topo ou colapsável
- Gráficos empilhados

### Mobile (< 768px)
- Layout em 1 coluna
- Filtros em accordion/drawer
- Cards em stack vertical
- Gráficos otimizados para largura

## 🔐 Segurança e Permissões

### Autenticação
- Requer sessão ativa (Next-Auth)
- Redirecionamento automático para login

### Autorização
- Usuário só vê dados da própria empresa
- Filtro automático por `companyId`
- Isolamento total entre empresas

### Dados Sensíveis
- Valores formatados no frontend
- Cálculos no backend
- Sem exposição de IDs em URLs

## 📊 Performance

### Otimizações Implementadas
- Queries otimizadas com Prisma
- Agregações no banco de dados
- Paginação implícita (top 10 categorias)
- Loading states para UX fluida

### Cache (Futuro)
- Cache de 5 minutos para dados do mês atual
- Invalidação após nova importação
- Redis para dados agregados

## 🧪 Testando o Sistema

### Dados de Teste Necessários
Para testar todas as funcionalidades:
1. Mínimo 3 meses de transações
2. Mix de entradas e saídas
3. Múltiplas categorias
4. Alguns valores recorrentes

### Cenários de Teste

**Teste 1: Período sem dados**
- Selecione um período futuro
- Deve mostrar mensagem "Nenhuma transação encontrada"
- Botão para importar dados

**Teste 2: Apenas entradas**
- Filtre por "Entradas"
- Deve mostrar apenas receitas
- Top categorias de despesa vazio

**Teste 3: Período customizado**
- Selecione 1 mês específico
- Verifique se dados batem com a seleção

**Teste 4: Ano completo**
- Selecione "Este Ano"
- Verifique evolução mês a mês
- Confira totais

## 📚 Referências

### Arquivos Criados
```
src/
├── app/
│   ├── api/
│   │   └── transactions/
│   │       └── analytics/
│   │           └── route.ts          # API de analytics
│   └── dashboard/
│       └── transactions/
│           └── page.tsx               # Página principal
└── components/
    └── dashboard/
        ├── transaction-filters.tsx    # Filtros
        ├── income-expense-chart.tsx   # Gráfico evolução
        ├── income-expense-comparison.tsx  # Comparação
        └── category-breakdown.tsx     # Análise categorias
```

### Dependências
- Next.js 14+
- React 18+
- Prisma ORM
- Shadcn/ui components
- Tailwind CSS

## ✨ Conclusão

Sistema completo de visualização que transforma dados brutos de transações em insights acionáveis, com:
- ✅ Interface intuitiva e moderna
- ✅ Filtros flexíveis e poderosos
- ✅ Visualizações claras e informativas
- ✅ Insights automáticos
- ✅ Performance otimizada
- ✅ Código limpo e extensível

Pronto para uso em produção! 🚀

