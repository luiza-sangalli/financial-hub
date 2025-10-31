# Guia Rápido: Marcar Transações Recorrentes
**Data:** 24/10/2025 - 16:35

## 🎯 Como Funciona Agora

### Você Decide! 👆

Cada transação na lista tem um botão para você marcar se é recorrente ou não:

```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Aluguel Escritório                  R$ 2.000,00      │
│    05/10/2025 • arquivo.csv            🔄 Recorrente    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Compra Notebook Dell                   R$ 5.000,00      │
│    15/10/2025 • arquivo.csv      ➕ Marcar Recorrente   │
└─────────────────────────────────────────────────────────┘
```

## 📋 Passo a Passo Simples

### Para Marcar como Recorrente:

1. **Vá para** `/dashboard/import` (página de importação)

2. **Veja** suas transações importadas

3. **Encontre** uma transação que se repete (ex: aluguel, salário)

4. **Clique** no botão **"➕ Marcar Recorrente"**

5. **Abre um popup:**
   ```
   ┌─────────────────────────────────────┐
   │  Configurar Recorrência             │
   ├─────────────────────────────────────┤
   │  Frequência:  [Mensal ▼]            │
   │  Intervalo:   [1] mês(es)           │
   │                                     │
   │  📝 Exemplo: Todo mês               │
   │                                     │
   │  [Cancelar]  [Confirmar]            │
   └─────────────────────────────────────┘
   ```

6. **Selecione:**
   - **Mensal** → Para despesas que repetem todo mês
   - **Semanal** → Para despesas semanais
   - **Anual** → Para despesas anuais

7. **Clique** em **"Confirmar"**

8. **Pronto!** 🎉 A transação agora é recorrente

### Para Remover Recorrência:

1. **Clique** no botão **"🔄 Recorrente"**
2. **Pronto!** Volta a ser pontual

## 💡 Exemplos do Dia a Dia

### ✅ Marque como Recorrente:

- 🏠 **Aluguel** - R$ 2.000 todo mês
- 💼 **Salários** - R$ 8.000 todo mês
- 📱 **Assinatura Netflix** - R$ 39,90 mensalmente
- ⚡ **Conta de Luz** - ~R$ 200 todo mês
- 🌐 **Internet** - R$ 150 todo mês
- 📄 **Contador** - R$ 500 todo mês

### ❌ Deixe como Pontual:

- 🖥️ **Compra de Equipamento** - R$ 5.000 (só uma vez)
- 🎉 **Evento da Empresa** - R$ 3.000 (eventual)
- 🚗 **Manutenção Carro** - R$ 800 (quando precisar)
- 🎁 **Bônus Funcionário** - R$ 2.000 (pontual)
- ☕ **Café para Reunião** - R$ 150 (eventual)

## 📊 O Que Muda no Dashboard?

### Antes (Tudo Junto):
```
┌────────────────────┐
│ Total Despesas     │
│ R$ 15.000,00       │
└────────────────────┘
```

### Depois (Separado):
```
┌────────────────────────┬────────────────────────┐
│ 🔄 Gastos Fixos        │ 💰 Gastos Variáveis    │
│ R$ 10.000,00 (67%)     │ R$ 5.000,00 (33%)      │
│ Despesas recorrentes   │ Despesas pontuais      │
└────────────────────────┴────────────────────────┘

💡 Insight: Seus gastos fixos representam a maior
parte das despesas. Considere revisar contratos.
```

## 🤖 Atalho: Detecção Automática

Se tiver preguiça de marcar manualmente:

1. **Vá para** `/dashboard`

2. **Encontre** o card "Detecção Inteligente"

3. **Clique** em **"🔍 Detectar Padrões"**

4. **Aguarde** 2-3 segundos

5. **Veja** sugestões automáticas:
   ```
   ┌─────────────────────────────────────────────┐
   │ Aluguel Escritório                          │
   │ 3 ocorrências • R$ 2.000,00 • Mensal        │
   │ 95% confiança                               │
   │ [✅ Marcar como Recorrente]                 │
   └─────────────────────────────────────────────┘
   ```

6. **Clique** em **"✅ Marcar como Recorrente"**

7. **Pronto!** Todas as transações do padrão são marcadas

## 🎯 Dica Importante

### Quando marcar como Recorrente?

**Pergunte-se:**
> "Esta despesa vai se repetir no próximo mês?"

- ✅ **SIM** → Marque como recorrente
- ❌ **NÃO** → Deixe como pontual

### Exemplos:

**"Aluguel"** → Se repete? **SIM** → 🔄 Recorrente  
**"Compra Cadeiras"** → Se repete? **NÃO** → 💰 Pontual  
**"Salário João"** → Se repete? **SIM** → 🔄 Recorrente  
**"Treinamento"** → Se repete? **NÃO** → 💰 Pontual  

## 📱 Onde Está Tudo?

### 1. Lista de Transações
**Caminho:** `/dashboard/import`
- Veja todas as transações
- Botão para marcar cada uma

### 2. Dashboard Principal
**Caminho:** `/dashboard`
- Veja estatísticas separadas
- Use detecção automática
- Veja análise fixo vs variável

## ❓ Perguntas Frequentes

### Posso mudar depois?
✅ **SIM!** Clique novamente no botão para remover ou reconfigurar

### Precisa marcar todas?
❌ **NÃO!** Marque só as que se repetem. As outras ficam automáticas como pontuais.

### O que acontece se eu não marcar?
📊 O sistema conta tudo como variável. Você ainda terá estatísticas, mas menos precisas.

### Quantas devo marcar?
💡 Geralmente 5-10 transações principais: aluguel, salários, assinaturas, contas fixas.

---

## 🚀 Comece Agora!

1. Faça login
2. Vá para `/dashboard/import`
3. Encontre o aluguel ou salário
4. Clique "➕ Marcar Recorrente"
5. Selecione "Mensal"
6. Confirme

**Pronto! Seu primeiro gasto fixo está marcado!** 🎉


