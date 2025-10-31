# Correção: Parse de Valores Monetários

**Data:** 24 de Outubro de 2025  
**Tipo:** Bug Fix

## 🐛 Problema Identificado

Valores monetários estavam sendo interpretados incorretamente:
- **Esperado:** `1500.00` → R$ 1.500,00
- **Obtido:** `1500.00` → R$ 150.000,00 ❌

O problema afetava valores com ponto como separador decimal (formato US/Internacional).

## 🔍 Causa Raiz

A função `parseAmount` estava removendo **todos** os pontos indiscriminadamente, considerando-os sempre como separadores de milhar:

```typescript
// Código ANTIGO (com bug)
function parseAmount (amountStr: string): number {
  let cleaned = amountStr
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')        // ❌ Remove TODOS os pontos
    .replace(',', '.')         // Converte vírgula para ponto
  
  return parseFloat(cleaned)
}

// Exemplo: "1500.00"
// 1. Remove pontos: "150000"
// 2. Tenta converter vírgula: "150000" (sem mudança)
// 3. Resultado: 150000 ❌
```

## ✅ Solução Implementada

Nova lógica inteligente que detecta automaticamente o formato:

```typescript
function parseAmount (amountStr: string): number {
  let cleaned = String(amountStr).trim().replace(/[R$\s]/g, '')
  
  const hasComma = cleaned.includes(',')
  const hasDot = cleaned.includes('.')

  if (hasComma && hasDot) {
    // Formato: 1.500,00 ou 1,500.00
    const lastComma = cleaned.lastIndexOf(',')
    const lastDot = cleaned.lastIndexOf('.')
    
    if (lastComma > lastDot) {
      // Vírgula é decimal: 1.500,00 (BR)
      cleaned = cleaned.replace(/\./g, '').replace(',', '.')
    } else {
      // Ponto é decimal: 1,500.00 (US)
      cleaned = cleaned.replace(/,/g, '')
    }
  } else if (hasComma) {
    // Apenas vírgula: 1500,00 (BR)
    cleaned = cleaned.replace(',', '.')
  }
  // Apenas ponto: 1500.00 (US) - usa direto
  
  return parseFloat(cleaned)
}
```

## 📊 Formatos Suportados

### ✅ Formato Brasileiro
- `1500,00` → 1500.00
- `1.500,00` → 1500.00
- `R$ 1.500,00` → 1500.00

### ✅ Formato Internacional (US)
- `1500.00` → 1500.00
- `1,500.00` → 1500.00
- `$1,500.00` → 1500.00

### ✅ Formato Simplificado
- `1500` → 1500.00
- `R$ 1500` → 1500.00

## 🧪 Testes

### Antes da Correção ❌
```
Input: "1500.00"  → Output: 150000
Input: "2000.00"  → Output: 200000
Input: "85.50"    → Output: 8550
```

### Depois da Correção ✅
```
Input: "1500.00"  → Output: 1500
Input: "2000.00"  → Output: 2000
Input: "85.50"    → Output: 85.5
Input: "1.500,00" → Output: 1500
Input: "R$ 1.500,00" → Output: 1500
```

## 🔄 Impacto

### Arquivos Afetados
- `src/lib/file-processor.ts` - Função `parseAmount` corrigida

### Dados Já Importados
⚠️ **Atenção:** Transações já importadas com valores incorretos precisam ser removidas e reimportadas.

**Como corrigir dados existentes:**
```bash
# Limpar histórico de uploads
npm run clear:uploads

# Reimportar os arquivos
# (via interface da aplicação)
```

## ✅ Próximos Passos

1. **Limpar dados antigos** (se houver uploads com valores incorretos)
2. **Reiniciar o servidor** de desenvolvimento
3. **Reimportar arquivos** de teste
4. **Validar** que os valores estão corretos

## 📝 Lições Aprendidas

1. **Sempre considerar formatos regionais** ao processar valores monetários
2. **Testar com dados reais** antes de assumir o formato
3. **Documentar formatos aceitos** para os usuários

---

**Status:** ✅ Corrigido e Testado  
**Arquivo:** `src/lib/file-processor.ts`  
**Função:** `parseAmount()`

