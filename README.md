# 🎶 Music AI Curatorship

Um clone de aplicação de streaming de música (como o Spotify) focado em **curadoria e descoberta musical personalizada**, utilizando a **API Gemini do Google** para gerar recomendações baseadas no histórico de audição do usuário.

O projeto utiliza a API gratuita [Jamendo](https://developer.jamendo.com/v3.0) para busca e streaming de músicas, e o [Google Gemini](https://ai.google.dev/) como motor de recomendação inteligente.

---

## ✨ Funcionalidades Principais

* **Autenticação de Usuário** — Registro e login com JWT (JSON Web Tokens).
* **Recomendações com IA** — Sugestões personalizadas com justificativas geradas pelo Google Gemini.
* **Player de Música Completo** — Player persistente com controles de reprodução, seek, volume e música atual.
* **Gestão de Playlists (CRUD)**

  * Criar novas playlists (com música inicial)
  * Editar, excluir e visualizar playlists
  * Adicionar ou remover músicas
* **Busca em Tempo Real** — Busca integrada à API do Jamendo.
* **Histórico de Audição** — Cada reprodução é automaticamente registrada.
* **Interface Moderna e Responsiva** — Desenvolvida com Next.js 15 e Tailwind CSS.

---

## 🛠️ Stack de Tecnologias

O projeto é um **monorepo** dividido em duas partes principais:

### **Frontend** (`/frontend`)

* **Responsável:** [@Ma2903](https://github.com/Ma2903) (Manoela)
* **Framework:** [Next.js 15](https://nextjs.org/) (com Turbopack)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **UI:** [React 19](https://react.dev/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Gestão de Estado:** React Context API (para Autenticação, Player e Playlists)
* **Ícones:** [Lucide React](https://lucide.dev/)

### **Backend** (`/backend`)

* **Responsável:** [@DevZIKIII](https://github.com/DevZIKIII) (Daniel)
* **Runtime:** [Node.js](https://nodejs.org/en)
* **Framework:** [Express.js](https://expressjs.com/pt-br/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Autenticação:** [JWT](https://jwt.io/) & [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* **APIs Externas:**

  * [Google Gemini](https://ai.google.dev/) — Recomendação inteligente
  * [Jamendo API](https://developer.jamendo.com/v3.0) — Dados e streaming de músicas

### **Base de Dados & DevOps**

* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
* **Containerização:** [Docker Compose](https://docs.docker.com/compose/)

---

## 🚀 Fluxo de Recomendação com IA

1. O usuário ouve músicas fornecidas pela API Jamendo.
2. Cada faixa é registrada no histórico (`POST /api/history`).
3. O frontend solicita recomendações (`GET /api/recommendations`).
4. O backend recupera o histórico recente (ex: últimas 15 músicas).
5. O histórico é convertido em um *prompt* e enviado à API do Google Gemini.
6. O Gemini retorna sugestões com justificativas.
7. O backend busca as faixas correspondentes na API do Jamendo.
8. O frontend exibe as recomendações em `MusicCard`s.

---

## ⚙️ Instalação e Execução Local

### 🧩 Pré-requisitos

* [Node.js](https://nodejs.org/) (v24 ou superior)
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/install/)

---

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Ma2903/music-ai-curatorship.git
cd music-ai-curatorship
```

---

### 2️⃣ Configurar o Banco de Dados

Suba o container do PostgreSQL com Docker Compose:

```bash
docker compose up -d
```

> Isso criará o container com o banco configurado e pronto para uso.

---

### 3️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` em **/backend** e outro em **/frontend** com os seguintes valores:

#### 📁 **/backend/.env**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/music_ai_curatorship"
JWT_SECRET="sua_chave_secreta_aqui"

# APIs Externas
GEMINI_API_KEY="sua_chave_da_api_gemini"
JAMENDO_CLIENT_ID="seu_client_id_jamendo"
```

#### 📁 **/frontend/.env**

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

### 4️⃣ Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 5️⃣ Rodar as Aplicações

#### 🖥️ Backend

```bash
cd backend
npx prisma migrate dev
npm run dev
```

> Servidor iniciado em: **[http://localhost:4000](http://localhost:4000)**

#### 🌐 Frontend

```bash
cd frontend
npm run dev
```

> App disponível em: **[http://localhost:3000](http://localhost:3000)**

---

## 🧠 Estrutura de Pastas

```
music-ai-curatorship/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
└── docker-compose.yml
```

---

## 👥 Colaboradores

| Nome        | GitHub                                  | Responsabilidade                                                      |
| ----------- | --------------------------------------- | --------------------------------------------------------------------- |
| **Manoela** | [@Ma2903](https://github.com/Ma2903)    | Frontend, UI/UX, integração com APIs e arquitetura do app             |
| **Daniel**  | [@DevZIKIII](https://github.com/DevZIKIII) | Backend, banco de dados, autenticação e lógica de recomendação com IA |

---

## 📜 Licença

Este projeto está licenciado sob a **MIT License** — veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

💡 **Desenvolvido com ❤️ e IA — por [@Ma2903](https://github.com/Ma2903) e [@daniel](https://github.com/SeuGitHub)**
