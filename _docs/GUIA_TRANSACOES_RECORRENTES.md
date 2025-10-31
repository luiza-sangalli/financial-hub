# Guia de Uso: Transações Recorrentes
**Data:** 24/10/2025 - 16:00

## 🎯 Visão Geral

O sistema agora diferencia automaticamente entre:
- **💰 Transações Pontuais**: Ocorrem uma única vez (ex: compra de equipamento, bônus)
- **🔄 Transações Recorrentes**: Repetem-se regularmente (ex: aluguel, salários, assinaturas)

Esta diferenciação permite:
✅ Análise financeira mais precisa
✅ Separação de custos fixos vs variáveis
✅ Projeções futuras de fluxo de caixa
✅ Orçamento mensal realista

## 📊 Novos Recursos no Dashboard

### 1. Cards de Análise de Despesas
O dashboard agora mostra um card detalhado com:
- **Gastos Fixos (Recorrentes)**: Despesas que se repetem mensalmente
- **Gastos Variáveis (Pontuais)**: Despesas únicas ou eventuais
- **Percentual** de cada tipo em relação ao total
- **Insight automático** baseado na distribuição

### 2. Detecção Inteligente de Padrões
Novo card "Detecção Inteligente" que:
- 🔍 Analisa automaticamente todas as transações
- 🤖 Identifica padrões recorrentes usando IA
- 📊 Calcula nível de confiança (0-100%)
- ✅ Permite marcar transações como recorrentes com um clique

### 3. Indicador Visual
Transações recorrentes são identificadas por:
- Ícone 🔄 ao lado da descrição
- Tag "Recorrente" nas informações da transação
- Destaque visual na lista

## 🚀 Como Usar

### Detectar Padrões Automaticamente

1. Acesse o **Dashboard** (`/dashboard`)
2. Localize o card **"Detecção Inteligente"**
3. Clique no botão **"🔍 Detectar Padrões"**
4. Aguarde a análise (alguns segundos)
5. Revise os padrões sugeridos com nível de confiança
6. Clique em **"✅ Marcar como Recorrente"** nos padrões desejados

### O que o Detector Identifica

O algoritmo analisa:
- ✅ Descrições similares (ignora datas e variações)
- ✅ Valores consistentes (aceita até 10% de variação)
- ✅ Intervalos regulares entre transações
- ✅ Frequência: Mensal, Semanal, Anual

### Níveis de Confiança

- **80-100%**: Alta confiança - provavelmente é recorrente
- **60-79%**: Média confiança - revisar antes de aplicar
- **< 60%**: Não mostrado - não é padrão confiável

### Marcar Manualmente

Para marcar transações manualmente, use a API:

```bash
# Marcar uma transação como recorrente
PATCH /api/transactions/{id}/recurrence
{
  "isRecurring": true,
  "recurrenceRule": {
    "frequency": "MONTHLY",
    "interval": 1,
    "startDate": "2025-01-01",
    "dayOfMonth": 5
  }
}

# Remover marcação de recorrente
DELETE /api/transactions/{id}/recurrence
```

## 📋 Exemplos Práticos

### Exemplo 1: Aluguel Mensal

**Transações detectadas:**
```
- Aluguel Escritório - R$ 2.000,00 - 05/01/2025
- Aluguel Escritório - R$ 2.000,00 - 05/02/2025
- Aluguel Escritório - R$ 2.000,00 - 05/03/2025
```

**Padrão identificado:**
- Descrição: "Aluguel Escritório"
- Frequência: Mensal (todo dia 5)
- Confiança: 95%
- Valor médio: R$ 2.000,00

### Exemplo 2: Salários

**Transações detectadas:**
```
- Salário João Silva - R$ 8.000,00 - 05/01/2025
- Salário João Silva - R$ 8.000,00 - 05/02/2025
- Salário João Silva - R$ 8.200,00 - 05/03/2025
```

**Padrão identificado:**
- Descrição: "Salário João Silva"
- Frequência: Mensal (todo dia 5)
- Confiança: 88% (variação de valor aceita)
- Valor médio: R$ 8.067,00

### Exemplo 3: Assinatura de Software

**Transações detectadas:**
```
- Assinatura Adobe Creative - R$ 290,00 - 10/01/2025
- Assinatura Adobe Creative - R$ 290,00 - 10/02/2025
```

**Padrão identificado:**
- Descrição: "Assinatura Adobe Creative"
- Frequência: Mensal (todo dia 10)
- Confiança: 82%
- Valor: R$ 290,00

## 🔧 Estrutura Técnica

### Campos no Banco de Dados

```typescript
{
  isRecurring: boolean          // true se for recorrente
  recurrenceRule: {
    frequency: 'MONTHLY' | 'WEEKLY' | 'YEARLY' | 'DAILY'
    interval: number            // Ex: 1 = todo mês, 2 = a cada 2 meses
    startDate: string           // Data inicial do padrão
    endDate?: string            // Data final (opcional)
    dayOfMonth?: number         // Dia específico do mês
    dayOfWeek?: number          // Dia da semana (0-6)
  }
  parentTransactionId?: string  // Referência (futuro uso)
}
```

### APIs Disponíveis

#### 1. Detectar Padrões
```
POST /api/transactions/recurrence/detect
Response: { patterns: [...], totalAnalyzed, patternsFound }
```

#### 2. Aplicar Padrão
```
POST /api/transactions/recurrence/apply
Body: { transactionIds: [...], recurrenceRule: {...} }
```

#### 3. Atualizar Transação
```
PATCH /api/transactions/{id}/recurrence
Body: { isRecurring: true, recurrenceRule: {...} }
```

#### 4. Remover Recorrência
```
DELETE /api/transactions/{id}/recurrence
```

## 💡 Dicas e Boas Práticas

### ✅ Faça
- Execute a detecção após importar novos dados
- Revise padrões com confiança < 80% antes de aplicar
- Use para identificar oportunidades de redução de custos fixos
- Monitore variações em transações recorrentes (podem indicar problemas)

### ❌ Evite
- Marcar como recorrente transações verdadeiramente únicas
- Ignorar padrões com alta confiança (>90%)
- Aplicar padrões sem revisar a descrição e valor

## 📈 Benefícios de Negócio

### Análise Financeira
- **Custos Fixos vs Variáveis**: Entenda a estrutura de custos
- **Previsibilidade**: Saiba exatamente quanto gasta por mês
- **Otimização**: Identifique oportunidades de redução

### Planejamento
- **Orçamento**: Separe gastos previsíveis de eventuais
- **Fluxo de Caixa**: Projete receitas e despesas futuras
- **Tomada de Decisão**: Base sólida para decisões financeiras

### Alertas (Futuro)
- Notificação de variação em recorrentes
- Alerta de vencimentos próximos
- Sugestões de economia baseadas em padrões

## 🔮 Próximas Melhorias

Planejadas para as próximas fases:
1. **Projeção de Fluxo de Caixa**: Calcular receitas/despesas futuras
2. **Geração Automática**: Criar transações futuras automaticamente
3. **Alertas Inteligentes**: Notificar sobre variações e vencimentos
4. **Análise de Tendências**: Gráficos de evolução de recorrentes
5. **Recomendações**: Sugestões de otimização baseadas em IA

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs do console no navegador
- Confirme que a migração do banco foi aplicada
- Execute `npx prisma generate` se houver erros de tipos

