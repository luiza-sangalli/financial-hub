# Implementação de Transações Recorrentes
**Data:** 24/10/2025 - 15:30

## 📋 Problema Identificado

O sistema atual não diferencia entre:
- **Transações Pontuais**: Ocorrem uma única vez (ex: compra de equipamento, bônus)
- **Transações Recorrentes**: Repetem-se mensalmente (ex: aluguel, salários, assinaturas)

### Impactos:
1. ❌ Cálculos de projeção imprecisos
2. ❌ Análise de tendências incorreta
3. ❌ Orçamento mensal não reflete realidade
4. ❌ Impossível prever fluxo de caixa futuro

## 🎯 Solução Proposta

### 1. Modelagem de Dados
Adicionar campos ao modelo `Transaction`:
- `isRecurring`: Boolean - identifica se é recorrente
- `recurrenceRule`: JSON - define a regra de recorrência
  - `frequency`: 'MONTHLY' | 'WEEKLY' | 'YEARLY'
  - `interval`: Number (ex: a cada 2 meses)
  - `startDate`: Data inicial
  - `endDate`: Data final (opcional)
- `parentTransactionId`: String - referência à transação original (para transações geradas)

### 2. Funcionalidades

#### A. Identificação Manual
- Interface para marcar transações como recorrentes
- Definir regras de recorrência

#### B. Detecção Automática
- Algoritmo que identifica padrões:
  - Mesmo valor
  - Mesma descrição (ou similar)
  - Intervalo regular entre datas
- Sugestão ao usuário para confirmar

#### C. Cálculos Ajustados
- **Dashboard**: Mostrar valores mensais vs pontuais separados
- **Projeções**: Calcular fluxo de caixa futuro baseado em recorrências
- **Análises**: Separar gastos fixos de variáveis

### 3. Interface do Usuário

#### Cards de Estatísticas
```
┌─────────────────────┐  ┌─────────────────────┐
│ Gastos Fixos/Mês    │  │ Gastos Variáveis    │
│ R$ 5.000,00         │  │ R$ 2.300,00         │
│ (recorrentes)       │  │ (pontuais)          │
└─────────────────────┘  └─────────────────────┘
```

#### Lista de Transações
```
🔄 Aluguel - R$ 2.000,00 (Mensal)
   Próximo: 01/11/2025

💰 Compra Equipamento - R$ 5.000,00 (Único)
```

## 📊 Casos de Uso

### 1. Aluguel (Recorrente Mensal)
```json
{
  "description": "Aluguel Escritório",
  "amount": -2000,
  "type": "EXPENSE",
  "isRecurring": true,
  "recurrenceRule": {
    "frequency": "MONTHLY",
    "interval": 1,
    "startDate": "2025-01-01",
    "dayOfMonth": 5
  }
}
```

### 2. Compra de Equipamento (Pontual)
```json
{
  "description": "Notebook Dell",
  "amount": -5000,
  "type": "EXPENSE",
  "isRecurring": false,
  "recurrenceRule": null
}
```

### 3. Salário (Recorrente Mensal)
```json
{
  "description": "Salário João",
  "amount": -8000,
  "type": "EXPENSE",
  "isRecurring": true,
  "recurrenceRule": {
    "frequency": "MONTHLY",
    "interval": 1,
    "startDate": "2025-01-01",
    "dayOfMonth": 5
  }
}
```

## 🚀 Implementação

### Fase 1: Estrutura de Dados
1. Migração do banco de dados
2. Atualizar tipos TypeScript
3. Ajustar validações

### Fase 2: Lógica de Negócio
1. Criar serviço de detecção automática
2. Implementar geração de projeções
3. Ajustar cálculos de estatísticas

### Fase 3: Interface
1. Adicionar flag de recorrência na lista
2. Criar modal de configuração de recorrência
3. Implementar página de projeções futuras
4. Separar cards de gastos fixos/variáveis

### Fase 4: Análise Inteligente
1. Algoritmo de detecção de padrões
2. Sugestões automáticas
3. Alertas de variações em recorrentes

## 📈 Benefícios

✅ Projeções financeiras precisas
✅ Separação clara de custos fixos vs variáveis
✅ Melhor planejamento de fluxo de caixa
✅ Alertas de gastos fora do padrão
✅ Orçamento mais realista
✅ Análise de tendências mais precisa

