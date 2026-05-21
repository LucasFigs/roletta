# 🎲 Roletta - Sorteador de Rolês

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)

## 📱 Sobre o Projeto

**Roletta** é um aplicativo web minimalista para casais e grupos decidirem o que fazer no fim de semana. Crie rolês, salve ideias e deixe a sorte decidir por vocês.

### ✨ Funcionalidades

- 🔐 **Autenticação** - Cadastro e login seguro com email
- 🌓 **Modo Escuro** - Interface adaptável com tema claro/escuro
- 🎲 **Sorteio Aleatório** - Escolha aleatória entre seus rolês
- 📝 **CRUD Completo** - Crie, visualize e delete seus rolês
- 💰 **Registro de Gasto** - Acompanhe o custo estimado de cada rolê
- 📱 **Mobile-First** - Design responsivo que funciona em qualquer dispositivo

### 🛠️ Tecnologias Utilizadas

| Tecnologia   | Finalidade                             |
| ------------ | -------------------------------------- |
| Next.js 15   | Framework React com App Router         |
| TypeScript   | Tipagem estática e segurança           |
| TailwindCSS  | Estilização rápida e responsiva        |
| Supabase     | Backend, autenticação e banco de dados |
| Lucide React | Ícones modernos e leves                |
| Vercel       | Hospedagem e deploy contínuo           |

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (gratuita)

### Configuração

**1. Clone o repositório**

git clone https://github.com/seu-usuario/roletta.git
cd roletta

**2. Instale as dependências**

npm install

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz:

NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase

**4. Execute as migrations no Supabase**

Copie o script SQL disponível no projeto e execute no SQL Editor do Supabase.

**5. Inicie o servidor de desenvolvimento**

npm run dev

**6. Acesse** `http://localhost:3000`

## 📦 Estrutura do Projeto

roletta/
├── src/
│ ├── app/
│ │ ├── (app)/ # Rotas protegidas
│ │ │ ├── dashboard/ # Página principal
│ │ │ └── layout.tsx
│ │ ├── (auth)/ # Rotas públicas
│ │ │ ├── login/
│ │ │ └── signup/
│ │ └── layout.tsx # Layout raiz
│ ├── components/
│ │ └── global/
│ │ └── theme-provider.tsx
│ ├── lib/
│ │ └── supabase/ # Cliente Supabase
│ └── proxy.ts # Middleware de autenticação
├── public/ # Arquivos estáticos
├── .env.local # Variáveis de ambiente
└── package.json

## 🌐 Deploy na Vercel

1. **Faça upload do código para o GitHub**
2. **Acesse [Vercel](https://vercel.com) e clique em "New Project"**
3. **Importe o repositório do GitHub**
4. **Configure as variáveis de ambiente:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Clique em "Deploy"**

## 📊 Banco de Dados (Supabase)

### Estrutura das tabelas principais:

| Tabela     | Descrição                                     |
| ---------- | --------------------------------------------- |
| profiles   | Dados dos usuários (nome, avatar)             |
| workspaces | Grupos de usuários (ex: "Casal")              |
| members    | Relação entre usuários e workspaces           |
| rolos      | Os rolês cadastrados (nome, descrição, gasto) |

### Triggers automáticos:

- Criação de perfil ao cadastrar usuário
- Criação de workspace padrão "Meu Espaço"

## 🎯 Funcionalidades Futuras

- [ ] Edição de rolês
- [ ] Categorias personalizadas
- [ ] Sistema de match entre usuários
- [ ] Histórico de rolês realizados
- [ ] Compartilhamento com parceiro(a)
- [ ] PWA para instalação no celular

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📧 Contato

Seu Nome - [@seu_twitter](https://twitter.com/seu_twitter) - seu.email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/roletta](https://github.com/seu-usuario/roletta)

---

Desenvolvido com ❤️ usando Next.js e Supabase
