# Setup do Banco de Dados em Produção - Railway

**Data:** 31/10/2025 - 18:00

## 🎯 Objetivo

Configurar o banco de dados PostgreSQL no Railway e executar as migrations para preparar a aplicação para produção.

## ⚠️ Status Atual

- ✅ Schema Prisma configurado para PostgreSQL
- ✅ Migrations criadas em desenvolvimento (SQLite)
- ⚠️ Migrations precisam ser recriadas para PostgreSQL
- ⚠️ Banco PostgreSQL precisa ser provisionado no Railway

## 🔧 Passo a Passo

### 1. Provisionar PostgreSQL no Railway

1. **Acessar o projeto no Railway:**
   - Vá para https://railway.app
   - Abra seu projeto `financial-hub`

2. **Adicionar PostgreSQL:**
   - Clique em **"+ New"**
   - Selecione **"Database"**
   - Escolha **"PostgreSQL"**
   - Aguarde o provisionamento (1-2 minutos)

3. **Obter a DATABASE_URL:**
   - Clique no serviço PostgreSQL
   - Vá para **"Variables"**
   - Copie a variável `DATABASE_URL` (formato: `postgresql://user:password@host:port/database`)

### 2. Configurar Variáveis de Ambiente do App

No serviço Next.js do Railway:

1. Vá para **"Variables"**
2. Adicione/Edite:

```env
# Database (conecta automaticamente ao PostgreSQL do Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# NextAuth
NEXTAUTH_SECRET=<seu-secret-gerado-com-openssl>
NEXTAUTH_URL=https://<seu-dominio>.railway.app

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,csv,xlsx,xls

# Environment
NODE_ENV=production
```

### 3. Preparar Migrations para PostgreSQL

As migrations atuais foram criadas para SQLite e precisam ser recriadas para PostgreSQL.

**Opção A: Resetar e Recriar Migrations (Recomendado para primeiro deploy)**

```bash
# 1. Deletar migrations antigas
rm -rf prisma/migrations

# 2. Criar nova migration para PostgreSQL
# Certifique-se de que DATABASE_URL aponta para PostgreSQL
npx prisma migrate dev --name init

# 3. Commitar as novas migrations
git add prisma/migrations
git commit -m "feat: Recria migrations para PostgreSQL"
git push origin main
```

**Opção B: Deploy Inicial com prisma db push (Mais rápido)**

Configurar no Railway para usar `prisma db push` no primeiro deploy:

1. Editar `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "startCommand": "npx prisma db push --accept-data-loss && npm run start"
  }
}
```

### 4. Executar Migrations no Railway

Após o PostgreSQL estar provisionado e as variáveis configuradas:

**Automático (via railway.json):**
- O Railway executará automaticamente `npm run db:migrate:deploy` no deploy
- Isso aplicará todas as migrations ao banco

**Manual (se necessário):**

1. Instalar Railway CLI:
```bash
npm install -g @railway/cli
```

2. Fazer login:
```bash
railway login
```

3. Conectar ao projeto:
```bash
railway link
```

4. Executar migrations:
```bash
railway run npx prisma migrate deploy
```

### 5. Verificar o Banco de Dados

**Via Railway CLI:**
```bash
# Conectar ao banco
railway run npx prisma studio

# Ou executar queries diretamente
railway run npx prisma db execute --stdin <<EOF
SELECT * FROM "users" LIMIT 5;
EOF
```

**Via Prisma Studio Local (conectando ao Railway):**
```bash
# Copiar a DATABASE_URL do Railway
# Exportar temporariamente
export DATABASE_URL="postgresql://..."

# Abrir Prisma Studio
npx prisma studio
```

### 6. Criar Usuário Inicial

Após as migrations rodarem, criar o primeiro usuário:

**Opção A: Via Interface (Recomendado)**
1. Acesse `https://seu-app.railway.app/auth/signup`
2. Cadastre sua conta de administrador

**Opção B: Via Script**
```bash
# Criar script seed para produção
railway run npx tsx scripts/create-test-user.ts
```

## 🔄 Workflow de Migrations Futuras

### Para adicionar novas migrations:

1. **Desenvolvimento Local:**
```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration
```

2. **Commitar:**
```bash
git add prisma/migrations
git commit -m "feat: Adiciona nova migration para X"
git push origin main
```

3. **Deploy Automático:**
- Railway detecta o push
- Executa `npm run db:migrate:deploy`
- Aplica apenas as migrations novas

## 🚨 Troubleshooting

### Erro: "Can't reach database server"

**Causa:** DATABASE_URL não está configurada ou incorreta

**Solução:**
1. Verifique se o PostgreSQL está rodando no Railway
2. Confirme que `DATABASE_URL=${{Postgres.DATABASE_URL}}` está configurado
3. Verifique se há espaços ou erros de digitação

### Erro: "Migration failed"

**Causa:** Conflito entre migrations SQLite e PostgreSQL

**Solução:**
```bash
# Resetar migrations e recriar
rm -rf prisma/migrations
npx prisma migrate dev --name init
git add prisma/migrations
git commit -m "fix: Recria migrations para PostgreSQL"
git push origin main
```

### Erro: "Table already exists"

**Causa:** Tabelas foram criadas manualmente ou com `db push`

**Solução:**
```bash
# Marcar migrations como aplicadas sem executar
railway run npx prisma migrate resolve --applied "migration_name"
```

### App não inicia após deploy

**Causa:** Migrations não rodaram ou falharam

**Solução:**
1. Verificar logs do Railway: `railway logs`
2. Executar migrations manualmente: `railway run npx prisma migrate deploy`
3. Verificar status do banco: `railway run npx prisma db pull`

## 📊 Monitoramento do Banco

### Verificar Conexões
```sql
SELECT count(*) FROM pg_stat_activity;
```

### Verificar Tamanho do Banco
```sql
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as size;
```

### Verificar Tabelas Criadas
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

## 🔐 Segurança

### Backups
- Railway faz backups automáticos do PostgreSQL
- Acesse em: Projeto → PostgreSQL → Backups

### Conexões
- Use sempre `DATABASE_URL` do Railway (já inclui SSL)
- Não exponha credenciais no código
- Use variáveis de ambiente

## 📝 Checklist de Setup

- [ ] PostgreSQL provisionado no Railway
- [ ] DATABASE_URL configurada no app
- [ ] NEXTAUTH_SECRET gerado e configurado
- [ ] NEXTAUTH_URL configurado com domínio correto
- [ ] Migrations executadas com sucesso
- [ ] Primeira conta de usuário criada
- [ ] App carrega sem erros de conexão
- [ ] Pode criar/ler/atualizar dados
- [ ] Logs do Railway não mostram erros de DB

## 🎯 Resultado Esperado

Após completar o setup:

1. ✅ Banco PostgreSQL rodando no Railway
2. ✅ Migrations aplicadas com sucesso
3. ✅ Schema completo criado (users, transactions, categories, etc.)
4. ✅ App conecta ao banco sem erros
5. ✅ Pode criar conta e fazer login
6. ✅ Pode importar transações
7. ✅ Dashboard carrega dados corretamente

## 🔗 Links Úteis

- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Deploy](https://www.prisma.io/docs/concepts/components/prisma-migrate/migrate-development-production)

---

**Próximo Passo:** Após o banco estar configurado, monitore os logs do Railway para garantir que tudo está funcionando corretamente.

