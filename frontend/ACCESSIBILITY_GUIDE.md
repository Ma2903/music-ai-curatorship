# Guia de Acessibilidade e Usabilidade - Music AI Curatorship

## Visão Geral

Este documento descreve as práticas de acessibilidade e usabilidade implementadas no frontend do Music AI Curatorship, garantindo que a aplicação seja inclusiva e fácil de usar para todos os usuários, independentemente de suas habilidades ou dispositivos.

## Princípios de Acessibilidade (WCAG 2.1)

### 1. Perceptível
A informação e os componentes da interface devem ser apresentados de forma que os usuários possam percebê-los.

#### Implementações:
- **Contraste de Cores**: Todas as cores seguem a proporção de contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande
- **Imagens Responsivas**: Todas as imagens possuem atributos `alt` descritivos
- **Ícones Acessíveis**: Ícones são acompanhados de `aria-label` ou texto alternativo
- **Fontes Legíveis**: Utilizamos fontes sans-serif padrão com tamanho mínimo de 14px

### 2. Operável
Os componentes da interface devem ser operáveis através de teclado e outros dispositivos de entrada.

#### Implementações:
- **Navegação por Teclado**: Todos os botões e links são acessíveis via Tab
- **Focus Visible**: Elementos focados possuem indicadores visuais claros
- **Sem Armadilhas de Teclado**: Usuários podem navegar livremente sem ficar presos
- **Tempo Suficiente**: Não há conteúdo que pisque ou se move automaticamente
- **Suporte a Leitores de Tela**: Implementação de `aria-label`, `aria-describedby` e `role` atributos

### 3. Compreensível
A informação e a operação da interface devem ser compreensíveis.

#### Implementações:
- **Linguagem Clara**: Textos em português claro e direto
- **Previsibilidade**: Padrões consistentes em toda a interface
- **Ajuda e Prevenção de Erros**: Mensagens de erro descritivas e sugestões
- **Estrutura Semântica**: Uso correto de elementos HTML semânticos

### 4. Robusto
O conteúdo deve ser compatível com tecnologias assistivas atuais e futuras.

#### Implementações:
- **HTML Semântico**: Uso de tags como `<button>`, `<nav>`, `<main>`, `<section>`
- **ARIA Attributes**: Implementação apropriada de atributos ARIA
- **Compatibilidade**: Testes com leitores de tela (NVDA, JAWS)

## Recursos de Acessibilidade Implementados

### 1. Componentes Acessíveis

#### Button Component
```tsx
<Button
  variant="primary"
  size="md"
  aria-label="Descrição da ação"
  disabled={false}
>
  Ação
</Button>
```

**Características:**
- Suporte a estados desabilitados
- Indicadores visuais de foco
- Estados de carregamento acessíveis
- Feedback tátil (active state)

#### SearchBar Component
```tsx
<SearchBar
  placeholder="Buscar músicas..."
  onSearch={(query) => handleSearch(query)}
  suggestions={['Rock', 'Pop', 'Jazz']}
/>
```

**Características:**
- Suporte a sugestões com navegação por teclado
- Limpeza de busca acessível
- Feedback visual de foco
- Descrição clara do campo

#### MusicCard Component
```tsx
<MusicCard
  recommendation={recommendation}
  onPlay={() => handlePlay()}
  onFavorite={() => handleFavorite()}
/>
```

**Características:**
- Botões com `aria-label` descritivos
- Informações estruturadas semanticamente
- Efeitos de hover acessíveis
- Suporte a navegação por teclado

### 2. Navegação Acessível

#### Sidebar
- Links com `aria-current="page"` para página ativa
- Estrutura hierárquica clara
- Atalhos de teclado documentados

#### Header
- Logo com link para home
- Menu de navegação estruturado
- Busca acessível

#### Main Content
- Landmarks ARIA: `<main>`, `<nav>`, `<aside>`
- Estrutura de headings hierárquica (h1 → h6)
- Skip links para pular para conteúdo principal

### 3. Responsividade e Usabilidade

#### Mobile-First Design
- Layouts adaptáveis para todos os tamanhos de tela
- Touch targets mínimos de 44x44px
- Gestos intuitivos

#### Breakpoints
```css
sm: 640px   /* Tablets pequenos */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops pequenos */
xl: 1280px  /* Desktops */
2xl: 1536px /* Desktops grandes */
```

#### Orientação
- Suporte a orientação retrato e paisagem
- Layouts que se adaptam dinamicamente

### 4. Preferências do Usuário

#### Modo Escuro
- Implementado por padrão
- Suporte a `prefers-color-scheme`

#### Movimento Reduzido
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Alto Contraste
- Suporte a `prefers-contrast: more`
- Cores ajustadas para melhor legibilidade

### 5. Feedback Visual

#### Estados Interativos
- **Hover**: Mudança de cor e sombra
- **Focus**: Anel de foco visível
- **Active**: Escala reduzida (feedback tátil)
- **Disabled**: Opacidade reduzida

#### Animações
- Transições suaves (300ms padrão)
- Respeito a `prefers-reduced-motion`
- Sem piscadas ou conteúdo em movimento

### 6. Validação e Feedback

#### Formulários
- Labels associados aos inputs
- Mensagens de erro descritivas
- Indicadores de campos obrigatórios
- Feedback de sucesso/erro

#### Busca
- Sugestões filtradas em tempo real
- Navegação por setas do teclado
- Seleção com Enter

## Testes de Acessibilidade

### Ferramentas Recomendadas
1. **axe DevTools**: Verificação automática de acessibilidade
2. **NVDA**: Leitor de tela gratuito para Windows
3. **JAWS**: Leitor de tela profissional
4. **Chrome DevTools**: Lighthouse para auditoria
5. **WebAIM**: Verificador de contraste

### Checklist de Testes
- [ ] Navegação completa por teclado
- [ ] Leitura correta por leitor de tela
- [ ] Contraste de cores adequado
- [ ] Imagens com alt text descritivo
- [ ] Botões com labels claros
- [ ] Formulários com labels associados
- [ ] Sem armadilhas de teclado
- [ ] Foco visível em todos os elementos
- [ ] Responsividade em todos os breakpoints
- [ ] Funcionalidade em navegadores antigos

## Padrões de Código

### Exemplo de Componente Acessível

```tsx
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface AccessibleCardProps {
  title: string;
  description: string;
  onFavorite?: () => void;
}

export function AccessibleCard({
  title,
  description,
  onFavorite,
}: AccessibleCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.();
  };

  return (
    <article
      className="rounded-lg border border-neutral-700 p-4"
      aria-label={`Card: ${title}`}
    >
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="text-sm text-neutral-400">{description}</p>
      
      <button
        onClick={handleFavorite}
        className="mt-4 flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-black font-bold transition-all hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
        aria-label={`${isFavorited ? 'Remover de' : 'Adicionar a'} favoritos: ${title}`}
        aria-pressed={isFavorited}
      >
        <Heart
          size={18}
          fill={isFavorited ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
        {isFavorited ? 'Favoritado' : 'Favoritar'}
      </button>
    </article>
  );
}
```

## Diretrizes para Desenvolvedores

### 1. Sempre use HTML Semântico
```tsx
// ✅ Bom
<button onClick={handleClick}>Ação</button>
<nav>...</nav>
<main>...</main>

// ❌ Ruim
<div onClick={handleClick}>Ação</div>
<div role="navigation">...</div>
```

### 2. Forneça Labels para Inputs
```tsx
// ✅ Bom
<label htmlFor="search">Buscar</label>
<input id="search" type="text" />

// ❌ Ruim
<input placeholder="Buscar" type="text" />
```

### 3. Use aria-label para Ícones
```tsx
// ✅ Bom
<button aria-label="Fechar modal">
  <X size={24} />
</button>

// ❌ Ruim
<button>
  <X size={24} />
</button>
```

### 4. Indique Estado Atual
```tsx
// ✅ Bom
<a href="/home" aria-current="page">Home</a>

// ❌ Ruim
<a href="/home" className="active">Home</a>
```

### 5. Descreva Conteúdo Complexo
```tsx
// ✅ Bom
<img
  src="album-cover.jpg"
  alt="Capa do álbum 'Neon Dreams' por Aetherius"
/>

// ❌ Ruim
<img src="album-cover.jpg" alt="Imagem" />
```

## Recursos Adicionais

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

## Conclusão

A acessibilidade não é um recurso adicional, mas um requisito fundamental. Ao seguir estas diretrizes, garantimos que o Music AI Curatorship seja inclusivo e acessível para todos os usuários.

