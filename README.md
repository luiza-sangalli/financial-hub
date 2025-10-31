# FinancialHub

Plataforma SaaS de gestão financeira para pequenas empresas.

## 🚀 Tecnologias

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend:** Next.js API Routes
- **Banco de Dados:** SQLite (desenvolvimento) / PostgreSQL (produção)
- **ORM:** Prisma
- **Autenticação:** NextAuth.js
- **Validação:** Zod

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd financialhub
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

4. Configure o banco de dados:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Execute o projeto:
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
financialhub/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Rotas de autenticação
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── api/            # API Routes
│   │   └── globals.css     # Estilos globais
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes shadcn/ui
│   │   ├── dashboard/     # Componentes do dashboard
│   │   ├── forms/         # Formulários
│   │   └── providers/     # Providers (Session, etc.)
│   ├── lib/               # Utilitários e configurações
│   │   ├── prisma.ts      # Cliente Prisma
│   │   ├── auth.ts        # Configuração NextAuth
│   │   ├── utils.ts       # Funções utilitárias
│   │   └── validations.ts # Schemas de validação
│   ├── types/             # Definições TypeScript
│   └── hooks/             # Custom hooks
├── prisma/                # Schema e migrações do banco
├── public/                # Arquivos estáticos
└── docs/                  # Documentação
```

## 🗄️ Banco de Dados

O projeto usa Prisma como ORM com suporte a:
- **SQLite** para desenvolvimento
- **PostgreSQL** para produção

### Modelos principais:
- `User` - Usuários do sistema
- `Company` - Empresas/clientes
- `Transaction` - Transações financeiras
- `Category` - Categorias de transações
- `File` - Arquivos uploadados
- `Integration` - Integrações externas

### Comandos úteis:
```bash
# Visualizar dados no Prisma Studio
npx prisma studio

# Resetar banco de dados
npx prisma migrate reset

# Gerar cliente Prisma
npx prisma generate
```

## 🔐 Autenticação

O sistema usa NextAuth.js com:
- Autenticação por credenciais
- Sessões JWT
- Proteção de rotas
- Roles de usuário (ADMIN, USER, VIEWER)

## 🎨 UI/UX

- Design system baseado em shadcn/ui
- Tema responsivo com Tailwind CSS
- Componentes acessíveis
- Dark mode (futuro)

## 📊 Funcionalidades Implementadas

### ✅ Fase 1: Fundação
- [x] Configuração do ambiente de desenvolvimento
- [x] Setup do projeto Next.js com TypeScript
- [x] Configuração do SQLite/Postgres
- [x] Setup do shadcn/ui
- [x] Estrutura básica de autenticação

### ✅ Fase 2: Autenticação e Usuários (Básico)
- [x] Sistema de login/registro
- [x] Gestão de sessões com NextAuth.js
- [x] Proteção de rotas
- [x] Páginas de autenticação

### ✅ Fase 4: Upload e Processamento
- [x] **Sistema de Upload de Arquivos**
  - Upload de CSV e Excel (.csv, .xlsx, .xls)
  - Validação de tipo e tamanho (máx. 10MB)
  - Armazenamento seguro

- [x] **Processamento de Dados Financeiros**
  - Parser CSV e Excel
  - Suporte a múltiplos formatos de data
  - Conversão automática de valores monetários
  - Validação robusta de dados

- [x] **Categorização Automática**
  - 15 categorias pré-definidas
  - Sistema baseado em palavras-chave
  - Criação automática de novas categorias

- [x] **Interface de Importação**
  - Componente de upload com preview
  - Histórico de arquivos processados
  - Lista de transações importadas
  - Feedback visual de progresso

## 🔄 Como Usar - Importação de Dados

1. **Acesse o Dashboard:**
   - Faça login na aplicação
   - Clique no botão "📂 Importar Dados"

2. **Baixe o template:**
   - Clique no botão "📥 Baixar Template" na interface
   - O template já vem com exemplos de transações
   - Ou baixe manualmente: `/public/examples/transacoes-exemplo.csv`

3. **Prepare seu arquivo:**
   - Use o formato CSV ou Excel
   - Colunas obrigatórias: `date`, `description`, `amount`, `type`
   - Coluna opcional: `category`
   - Edite o template baixado com seus dados

**Exemplo de formato CSV:**
```csv
date,description,amount,type,category
01/10/2025,Venda de produto,1500.00,INCOME,Vendas
02/10/2025,Aluguel,2000.00,EXPENSE,Moradia
03/10/2025,Restaurante,85.50,EXPENSE,Alimentação
```

**Tipos aceitos:**
- Receitas: `INCOME`, `RECEITA`, `ENTRADA`
- Despesas: `EXPENSE`, `DESPESA`, `SAIDA`

**Formatos de data aceitos:**
- DD/MM/YYYY (ex: 24/10/2025)
- YYYY-MM-DD (ex: 2025-10-24)
- DD-MM-YYYY (ex: 24-10-2025)

4. **Faça o upload:**
   - Selecione o arquivo
   - Clique em "Enviar e Processar"
   - Aguarde o processamento
   - Visualize os resultados

## 🚧 Próximas Fases

### Fase 3: Dashboard Core
- [ ] Layout principal do dashboard
- [ ] Componentes de visualização de dados
- [ ] Gráficos básicos (receita/despesas)
- [ ] Sistema de navegação

### Fase 5: Análises Avançadas
- [ ] KPIs financeiros
- [ ] Relatórios automatizados
- [ ] Alertas e notificações
- [ ] Análise de tendências

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@financialhub.com ou abra uma issue no GitHub.