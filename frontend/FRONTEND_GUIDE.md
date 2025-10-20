# Music AI Curatorship - Frontend Guide

## 📋 Visão Geral

Este é o frontend completo do Music AI Curatorship, um clone do Spotify com sistema de recomendação baseado em IA. O projeto foi desenvolvido com **Next.js 15**, **TypeScript**, **Tailwind CSS** e **Lucide React** para ícones.

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── page.tsx                 # Página inicial
│   │   │   ├── layout.tsx               # Layout principal com Sidebar e Player
│   │   │   ├── search/
│   │   │   │   └── page.tsx             # Página de busca
│   │   │   ├── history/
│   │   │   │   └── page.tsx             # Página de histórico
│   │   │   └── playlist/
│   │   │       └── [id]/
│   │   │           └── page.tsx         # Página de playlist dinâmica
│   │   ├── layout.tsx                   # Layout raiz
│   │   └── globals.css                  # Estilos globais
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.tsx           # Layout principal
│   │   │   ├── Sidebar.tsx              # Barra lateral de navegação
│   │   │   ├── MusicPlayer.tsx          # Player de música fixo
│   │   │   └── index.ts                 # Exportações
│   │   ├── UI/
│   │   │   ├── MusicCard.tsx            # Card de música com justificativa IA
│   │   │   ├── PlaylistCard.tsx         # Card de playlist
│   │   │   ├── MusicList.tsx            # Lista de músicas
│   │   │   ├── SearchBar.tsx            # Barra de busca
│   │   │   ├── Section.tsx              # Componente de seção reutilizável
│   │   │   ├── Grid.tsx                 # Grid responsivo
│   │   │   ├── Header.tsx               # Header de página
│   │   │   ├── Badge.tsx                # Badge para tags
│   │   │   ├── Button.tsx               # Botão reutilizável
│   │   │   └── index.ts                 # Exportações
│   │   └── index.ts                     # Exportações gerais
│   ├── lib/
│   │   ├── mockData.ts                  # Dados simulados para desenvolvimento
│   │   └── index.ts                     # Exportações
│   ├── types/
│   │   ├── music.d.ts                   # Tipos TypeScript
│   │   └── index.ts                     # Exportações
│   └── public/                          # Arquivos estáticos
├── package.json                         # Dependências
├── tsconfig.json                        # Configuração TypeScript
├── tailwind.config.ts                   # Configuração Tailwind
├── next.config.ts                       # Configuração Next.js
└── FRONTEND_GUIDE.md                    # Este arquivo

```

## 🚀 Como Começar

### Instalação de Dependências

```bash
cd frontend
npm install
```

### Desenvolvimento Local

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Build para Produção

```bash
npm run build
npm start
```

## 📄 Páginas Implementadas

### 1. **Página Inicial (`/`)**
- Exibe recomendações de músicas geradas pela IA
- Mostra playlists do usuário
- Seção de descoberta por gênero
- Totalmente responsiva

### 2. **Busca (`/search`)**
- Barra de busca funcional
- Filtra músicas e playlists
- Exibe resultados em tempo real
- Sem resultados: mensagem amigável

### 3. **Histórico (`/history`)**
- Lista de músicas ouvidas com timestamps
- Botões para reproduzir ou remover
- Formatação de datas relativas (ex: "2h atrás")
- Histórico vazio: mensagem amigável

### 4. **Playlist Dinâmica (`/playlist/[id]`)**
- Exibe informações da playlist
- Lista todas as músicas da playlist
- Botões de ação (reproduzir, favoritar, compartilhar)
- Layout responsivo com capa grande

## 🎨 Componentes Reutilizáveis

### Layout Components

- **MainLayout**: Wrapper principal com Sidebar e Player
- **Sidebar**: Navegação lateral com playlists
- **MusicPlayer**: Player fixo no rodapé

### UI Components

- **MusicCard**: Card de música com justificativa da IA
- **PlaylistCard**: Card de playlist
- **MusicList**: Lista de músicas com controles
- **SearchBar**: Barra de busca
- **Section**: Seção com título e subtítulo
- **Grid**: Grid responsivo (2-6 colunas)
- **Header**: Header de página
- **Badge**: Tags e categorias
- **Button**: Botão reutilizável com variantes

## 🎯 Tipos TypeScript

```typescript
// Música
interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: Genre;
  mood: Mood;
  imageUrl: string;
  audioUrl: string;
}

// Recomendação (Música + Justificativa da IA)
interface Recommendation extends Song {
  justification: string;
}

// Playlist
interface Playlist {
  id: number;
  name: string;
  songCount: number;
  coverUrl: string;
  songs: Song[];
}

// Histórico
interface HistoryEntry {
  song: Song;
  listenedAt: Date;
}

// Mood e Gênero
type Mood = 'Alegre' | 'Triste' | 'Relaxante' | 'Foco' | 'Energético';
type Genre = 'Pop' | 'Rock' | 'Lo-Fi' | 'Eletrônica' | 'Sertanejo';
```

## 🔌 Integração com Backend

O frontend está pronto para ser conectado ao backend. Aqui estão os pontos de integração principais:

### 1. **Recomendações**
- Endpoint: `GET /api/recommendations`
- Substituir `mockRecommendation` em `src/lib/mockData.ts`

### 2. **Playlists**
- Endpoint: `GET /api/playlists`
- Substituir `mockPlaylists` em `src/lib/mockData.ts`

### 3. **Músicas**
- Endpoint: `GET /api/songs`
- Substituir `mockSongs` em `src/lib/mockData.ts`

### 4. **Histórico**
- Endpoint: `GET /api/history`
- Implementar em `src/app/(main)/history/page.tsx`

### 5. **Busca**
- Endpoint: `GET /api/search?q={query}`
- Implementar em `src/app/(main)/search/page.tsx`

## 🎨 Design System

### Cores
- **Fundo**: `bg-neutral-950` (preto profundo)
- **Secundário**: `bg-neutral-900`, `bg-neutral-800`
- **Destaque**: `bg-green-500` (verde Spotify)
- **Texto**: `text-white`, `text-neutral-400`

### Tipografia
- **Font**: Inter (Google Fonts)
- **Títulos**: Bold, 2xl-5xl
- **Corpo**: Regular, sm-base

### Espaçamento
- **Gap**: `gap-3` (sm), `gap-4` (md), `gap-6` (lg)
- **Padding**: `p-4` (sm), `p-6` (md)

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Todos os componentes usam classes Tailwind responsivas (ex: `sm:`, `md:`, `lg:`).

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm start        # Inicia servidor de produção
npm run lint     # Executa ESLint
```

## 📦 Dependências Principais

- **Next.js 15.5.5**: Framework React
- **React 19.1.0**: Biblioteca UI
- **TypeScript 5**: Tipagem estática
- **Tailwind CSS 4.1.14**: Estilização
- **Lucide React 0.546.0**: Ícones SVG

## 🚦 Próximos Passos

1. **Conectar Backend**: Substituir dados mocados por chamadas API
2. **Autenticação**: Implementar login/registro
3. **Reprodução de Áudio**: Integrar player de áudio real
4. **Persistência**: Salvar favoritos e histórico no banco
5. **Notificações**: Adicionar sistema de notificações
6. **Temas**: Implementar modo claro/escuro

## 📝 Notas Importantes

- Todos os dados atualmente são mocados em `src/lib/mockData.ts`
- O player de música é visual apenas (sem áudio real)
- As ações de clique estão prontas para serem conectadas ao backend
- O TypeScript está configurado para máxima segurança de tipos

## 🤝 Contribuindo

Para adicionar novos componentes:

1. Criar arquivo em `src/components/UI/` ou `src/components/Layout/`
2. Exportar em `src/components/[Pasta]/index.ts`
3. Usar em páginas conforme necessário

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para Music AI Curatorship**

