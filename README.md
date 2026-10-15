# 🇲🇿 Serviço Já — Encontre Profissionais em Moçambique

Plataforma web que liga clientes a profissionais prestadores de serviços. O cliente procura, pede e acompanha o serviço num só lugar, e o profissional divulga o seu trabalho e recebe novos pedidos.

🔗 **Demo online:** [servicojamz.vercel.app](https://servicojamz.vercel.app)


## 🎯 Objetivo

Facilitar o acesso a serviços profissionais e dar a técnicos, empreendedores e pequenos prestadores uma forma simples de mostrar as suas competências e conquistar novos clientes.

## ✨ Funcionalidades

**Para clientes**
- Registo e autenticação.
- Pesquisa de profissionais por categoria de serviço.
- Envio de pedidos de serviço aos profissionais.

**Para profissionais**
- Perfil profissional com informações, competências e serviços.
- Galeria de trabalhos realizados.
- Gestão de pedidos: aceitar ou recusar solicitações recebidas.
- Painel com pedidos, estatísticas e informações do plano de utilização.
- Estrutura de planos Premium com opções de subscrição.

**Geral**
- Design responsivo para telemóvel, tablet e computador.
- Pagamentos digitais com M-Pesa e e-Mola em planeamento / desenvolvimento.

## 🛠️ Tecnologias

| Área | Ferramentas |
|------|-------------|
| Interface | React, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI) |
| Navegação e dados | React Router, TanStack Query |
| Backend e dados | Supabase (autenticação e PostgreSQL) |
| Formulários e gráficos | React Hook Form, Zod, Recharts |
| Testes | Vitest, Testing Library |
| Publicação | Vercel |

## 🚀 Como correr localmente

Requisitos: Node.js 18+ (ou Bun) e um projeto no [Supabase](https://supabase.com).

```bash
# 1. Clonar o repositório
git clone https://github.com/Filimao/servicojamz.git
cd servicojamz

# 2. Instalar as dependências
npm install

# 3. Criar o ficheiro .env na raiz do projeto (veja abaixo)

# 4. Iniciar em modo de desenvolvimento
npm run dev
```

Variáveis de ambiente do ficheiro `.env`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

> O ficheiro `.env` não deve ser enviado para o GitHub. Use apenas a chave pública (publishable / `anon`) do Supabase e nunca coloque chaves secretas no código do cliente.

Outros comandos:

```bash
npm run build    # gerar a versão de produção
npm run preview  # pré-visualizar a versão de produção
npm run test     # correr os testes (Vitest)
npm run lint     # verificar o código
```

## 📌 Estado do projeto

Em desenvolvimento contínuo, com foco na experiência do utilizador, na gestão de pedidos, na comunicação entre clientes e profissionais e na integração de pagamentos digitais. As funcionalidades disponíveis dependem da versão publicada.

## ⚠️ Aviso

O Serviço Já é uma plataforma independente. A disponibilidade de pagamentos e de outras integrações depende da configuração atual do projeto.

## 👤 Autor

**Filimão Feliz Mondlane** — Full-Stack Developer, Maputo, Moçambique
[GitHub](https://github.com/Filimao) · [LinkedIn](https://linkedin.com/in/filimaomondlane)
