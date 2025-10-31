# Próximos Passos - Deploy no Railway

**Data:** 31/10/2025 - 17:35

## ✅ Preparação Concluída

O código foi enviado para o GitHub com sucesso! 🎉

**Repositório:** https://github.com/luiza-sangalli/financial-hub

### O que foi configurado:

1. ✅ Prisma Schema configurado para PostgreSQL
2. ✅ Scripts de build e deploy no `package.json`
3. ✅ Configuração Railway (`railway.json`)
4. ✅ Variáveis de ambiente documentadas (`env.example`)
5. ✅ `.gitignore` protegendo arquivos sensíveis
6. ✅ Migrations do Prisma prontas
7. ✅ Código commitado e enviado ao GitHub

## 🚀 Próxima Etapa: Configurar Railway

### Passo 1: Acessar Railway
1. Vá para: https://railway.app
2. Faça login com sua conta GitHub

### Passo 2: Criar Novo Projeto
1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório: **`luiza-sangalli/financial-hub`**
4. Railway detectará automaticamente o framework Next.js

### Passo 3: Adicionar PostgreSQL
1. No dashboard do projeto, clique em **"+ New"**
2. Selecione **"Database"**
3. Escolha **"PostgreSQL"**
4. Railway criará e conectará automaticamente o banco

### Passo 4: Configurar Variáveis de Ambiente

No painel do seu serviço Next.js:
1. Vá em **"Variables"** (aba lateral)
2. Clique em **"+ New Variable"**
3. Adicione as seguintes variáveis:

#### Variáveis Obrigatórias:

```env
# 1. Database URL (Railway gera automaticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# 2. NextAuth Secret (GERAR UM NOVO!)
NEXTAUTH_SECRET=GERAR_COM_OPENSSL_ABAIXO

# 3. NextAuth URL (será gerado pelo Railway)
NEXTAUTH_URL=https://SEU_DOMINIO.up.railway.app

# 4. Node Environment
NODE_ENV=production

# 5. File Upload Config
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,csv,xlsx,xls
```

#### ⚠️ IMPORTANTE: Gerar NEXTAUTH_SECRET

**No seu terminal local**, execute:
```bash
openssl rand -base64 32
```

Copie o resultado e use como valor da variável `NEXTAUTH_SECRET`.

#### Sobre o NEXTAUTH_URL:
- Após o primeiro deploy, Railway gerará um domínio (ex: `seu-app.up.railway.app`)
- Volte nas variáveis e atualize `NEXTAUTH_URL` com esse domínio
- Formato: `https://seu-dominio.up.railway.app` (sem barra no final)

### Passo 5: Fazer o Deploy

1. Clique em **"Deploy"** (ou aguarde o deploy automático)
2. Railway executará:
   - `npm install`
   - `npm run build`
   - `npm run db:migrate:deploy` (migrations)
   - `npm run start`

### Passo 6: Acompanhar o Deploy

1. Vá na aba **"Deployments"**
2. Clique no deploy em andamento
3. Veja os logs em tempo real
4. Aguarde a conclusão (2-5 minutos)

### Passo 7: Obter a URL do Projeto

1. Após o deploy, vá em **"Settings"**
2. Role até **"Domains"**
3. Clique em **"Generate Domain"**
4. Railway criará um domínio: `https://seu-app.up.railway.app`

### Passo 8: Atualizar NEXTAUTH_URL

⚠️ **IMPORTANTE**: Após obter a URL:
1. Volte em **"Variables"**
2. Edite `NEXTAUTH_URL`
3. Cole a URL gerada (ex: `https://seu-app.up.railway.app`)
4. Salve
5. Railway fará um novo deploy automaticamente

## 🧪 Testar a Aplicação

Após o deploy bem-sucedido:

### 1. Acessar o App
```
https://seu-app.up.railway.app
```

### 2. Criar Primeira Conta
1. Clique em "Cadastre-se"
2. Preencha:
   - Nome completo
   - Email
   - Senha (mín. 8 caracteres)
3. Clique em "Criar Conta"

### 3. Fazer Login
1. Use as credenciais criadas
2. Você será redirecionado para o Dashboard

### 4. Testar Funcionalidades
- ✅ Dashboard carregando
- ✅ Navegação funcionando
- ✅ Upload de arquivos
- ✅ Visualização de transações

## 📊 Monitoramento

### Ver Logs
1. No Railway, vá em **"Deployments"**
2. Clique no deploy ativo
3. Veja logs em tempo real

### Métricas
Railway mostra automaticamente:
- CPU Usage
- Memory Usage
- Request Count
- Response Time

## 🔄 Deploys Futuros

Agora que está configurado:

### Deploy Automático
Cada `git push` na branch `main` acionará um novo deploy:

```bash
# 1. Fazer mudanças localmente
git add .
git commit -m "Descrição da mudança"

# 2. Enviar para GitHub
git push origin main

# 3. Railway detecta e faz deploy automático
```

### Migrations Automáticas
O Railway executará automaticamente:
```bash
npm run db:migrate:deploy
```

## 🐛 Troubleshooting

### Deploy Falhou?

1. **Verifique os logs:**
   - Vá em Deployments > View Logs
   - Procure por erros em vermelho

2. **Variáveis de ambiente:**
   - Confirme que todas as variáveis estão configuradas
   - Verifique se `DATABASE_URL` está conectado ao PostgreSQL
   - Confirme que `NEXTAUTH_SECRET` foi gerado
   - Verifique se `NEXTAUTH_URL` tem o domínio correto

3. **Migrations:**
   - Se as migrations falharem, execute manualmente:
   - No Railway CLI: `railway run npm run db:migrate:deploy`

### Erro "Invalid NEXTAUTH_SECRET"
- Gere um novo secret: `openssl rand -base64 32`
- Atualize a variável no Railway

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme que `DATABASE_URL` está configurado
- Verifique se a variável está no formato: `${{Postgres.DATABASE_URL}}`

### App não carrega
1. Verifique os logs do deploy
2. Confirme que o domínio foi gerado
3. Teste se o PostgreSQL está acessível
4. Verifique se as migrations rodaram

## 📝 Checklist Final

Antes de considerar o deploy completo:

- [ ] Railway project criado
- [ ] PostgreSQL adicionado e conectado
- [ ] Todas as variáveis de ambiente configuradas
- [ ] `NEXTAUTH_SECRET` gerado com openssl
- [ ] Deploy concluído sem erros
- [ ] Domínio gerado pelo Railway
- [ ] `NEXTAUTH_URL` atualizado com o domínio correto
- [ ] Aplicação acessível na URL
- [ ] Consegue criar conta
- [ ] Consegue fazer login
- [ ] Dashboard carrega corretamente
- [ ] Pode fazer upload de arquivos

## 🎯 Resultado Esperado

Aplicação rodando em:
```
https://seu-app.up.railway.app
```

Com:
- ✅ PostgreSQL configurado
- ✅ Autenticação funcionando
- ✅ Dashboard operacional
- ✅ Imports funcionando
- ✅ Deploy automático configurado
- ✅ HTTPS habilitado
- ✅ Logs e métricas disponíveis

## 📚 Documentação Adicional

- [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md) - Guia completo de deploy
- Railway Docs: https://docs.railway.app
- Prisma Migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate
- NextAuth.js: https://next-auth.js.org/deployment

## 🆘 Precisa de Ajuda?

1. Verifique os logs no Railway
2. Consulte o [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)
3. Revise as variáveis de ambiente
4. Teste as migrations manualmente

---

**Bom deploy! 🚀**

Em caso de dúvidas, todos os detalhes técnicos estão documentados em `DEPLOY_RAILWAY.md`.

