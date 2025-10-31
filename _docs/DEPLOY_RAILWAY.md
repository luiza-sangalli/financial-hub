# Deploy no Railway - Financial Hub

**Data de criação:** 31/10/2025 - 17:30

## 📋 Pré-requisitos

- Conta no Railway (https://railway.app)
- Conta no GitHub
- Repositório configurado: https://github.com/luiza-sangalli/financial-hub.git

## 🚀 Passo a Passo para Deploy

### 1. Preparação do Repositório

O projeto já está configurado com:
- ✅ `railway.json` - Configurações de build e deploy
- ✅ `package.json` - Scripts de build e migrate configurados
- ✅ `.gitignore` - Arquivos sensíveis protegidos
- ✅ `env.example` - Template de variáveis de ambiente
- ✅ Prisma Schema configurado para PostgreSQL

### 2. Configurar Railway

1. **Acessar Railway:**
   - Vá para https://railway.app
   - Faça login com GitHub

2. **Criar Novo Projeto:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório: `luiza-sangalli/financial-hub`

3. **Adicionar PostgreSQL:**
   - No projeto Railway, clique em "+ New"
   - Selecione "Database"
   - Escolha "PostgreSQL"
   - Railway criará automaticamente o banco

4. **Configurar Variáveis de Ambiente:**
   
   Vá em Settings > Variables e adicione:

   ```env
   # Database (Railway fornece automaticamente)
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   
   # NextAuth (IMPORTANTE: gerar secret seguro)
   NEXTAUTH_SECRET=<gerar com: openssl rand -base64 32>
   NEXTAUTH_URL=https://<seu-dominio>.railway.app
   
   # File Upload
   MAX_FILE_SIZE=10485760
   ALLOWED_FILE_TYPES=pdf,csv,xlsx,xls
   
   # Environment
   NODE_ENV=production
   ```

   **⚠️ IMPORTANTE:** Gere um NEXTAUTH_SECRET único usando:
   ```bash
   openssl rand -base64 32
   ```

### 3. Deploy Automático

Railway detectará automaticamente o `railway.json` e executará:

1. **Build:**
   ```bash
   npm install && npm run build
   ```

2. **Deploy:**
   ```bash
   npm run db:migrate:deploy && npm run start
   ```

O primeiro deploy incluirá a execução das migrations do Prisma automaticamente.

### 4. Verificar Deploy

1. Aguarde o build finalizar (2-5 minutos)
2. Clique no seu serviço para ver os logs
3. Acesse a URL gerada pelo Railway
4. Verifique se a aplicação está funcionando

### 5. Configurar Domínio (Opcional)

1. No Railway, vá em Settings > Domains
2. Clique em "Generate Domain" para um domínio .railway.app
3. Ou adicione um domínio customizado

## 🔧 Comandos Úteis

### Gerar NEXTAUTH_SECRET localmente
```bash
openssl rand -base64 32
```

### Ver logs do Railway
```bash
railway logs
```

### Executar migrations manualmente (se necessário)
No Railway CLI:
```bash
railway run npm run db:migrate:deploy
```

## 📊 Monitoramento

### Ver logs em tempo real:
1. Acesse o dashboard do Railway
2. Clique no seu serviço
3. Vá para a aba "Deployments"
4. Clique em "View Logs"

### Métricas importantes:
- CPU Usage
- Memory Usage
- Request Count
- Response Time

## 🔄 Deploys Futuros

Após o setup inicial, todo push para a branch `main` do GitHub acionará automaticamente um novo deploy no Railway.

### Workflow:
1. Desenvolver localmente
2. Commit e push para `main`
3. Railway detecta mudanças
4. Build e deploy automático
5. Migrations rodadas automaticamente

## 🐛 Troubleshooting

### Erro de Migration
Se as migrations falharem:
1. Vá no painel do Railway
2. Abra o terminal do container
3. Execute: `npm run db:migrate:deploy`

### Erro de Build
Verifique:
- Todas as dependências estão no `package.json`
- Não há erros de TypeScript
- `.gitignore` não está bloqueando arquivos necessários

### Erro de Conexão com Banco
Verifique:
- A variável `DATABASE_URL` está configurada
- O serviço PostgreSQL está rodando
- O formato da URL está correto

## 📝 Variáveis de Ambiente Completas

```env
# Database
DATABASE_URL=${{Postgres.DATABASE_URL}}

# NextAuth
NEXTAUTH_SECRET=<seu-secret-gerado>
NEXTAUTH_URL=https://<seu-dominio>.railway.app

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,csv,xlsx,xls

# Environment
NODE_ENV=production
```

## 🔐 Segurança

- ✅ Variáveis de ambiente nunca commitadas
- ✅ NEXTAUTH_SECRET forte e único
- ✅ DATABASE_URL gerenciada pelo Railway
- ✅ Uploads protegidos por autenticação
- ✅ HTTPS automático pelo Railway

## 📱 Próximos Passos

Após o deploy bem-sucedido:

1. **Criar primeiro usuário:**
   - Acesse `/auth/signup`
   - Crie sua conta de administrador

2. **Configurar categorias:**
   - Acesse o Dashboard
   - Configure as categorias da sua empresa

3. **Testar importação:**
   - Faça upload de um CSV de teste
   - Verifique o processamento

4. **Monitorar:**
   - Acompanhe os logs no Railway
   - Verifique métricas de uso

## 🔗 Links Úteis

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Prisma Migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Suporte:** Em caso de problemas, verifique os logs no Railway e a documentação do projeto.

