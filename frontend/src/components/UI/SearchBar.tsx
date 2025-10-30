// frontend/src/components/UI/SearchBar.tsx
'use client';

import { Search, X, Music } from 'lucide-react';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Song } from '@/types/music'; // Importar Song para usar Pick

// Interface para o objeto que esperamos receber como sugestão
interface SuggestionItem extends Pick<Song, 'id' | 'title' | 'artist' | 'imageUrl'> {
    // Apenas os campos necessários para exibir a sugestão
}

// Props atualizadas do componente
interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void; // Chamado no Enter ou clique na sugestão (BUSCA PRINCIPAL)
  onQueryChange?: (query: string) => void; // Chamado a cada digitação (BUSCA SUGESTÕES)
  onClear?: () => void; // Chamado ao clicar no 'X'
  suggestions?: SuggestionItem[]; // Array de SUGESTÕES (objetos)
  isLoadingSuggestions?: boolean; // Flag de loading para SUGESTÕES
}

export function SearchBar({
  placeholder = 'Buscar músicas ou artistas...',
  onSearch,
  onQueryChange,
  onClear,
  suggestions = [],
  isLoadingSuggestions = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Efeito para fechar sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dispara a busca principal
  const triggerSearch = (searchQuery: string) => {
    setQuery(searchQuery); // Atualiza o input visualmente
    onSearch?.(searchQuery); // Chama a função da página pai para buscar resultados principais
    setShowSuggestions(false); // Esconde sugestões
    inputRef.current?.blur(); // Tira o foco
  };

  // Limpa o input e as buscas
  const handleClear = () => {
    setQuery('');
    onQueryChange?.(''); // Limpa query das sugestões
    onSearch?.(''); // Limpa query da busca principal
    onClear?.();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Trata o Enter no input
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      triggerSearch(query); // Dispara busca principal com o texto atual
    }
    // TODO: Navegação por setas nas sugestões
  };

  // Trata a digitação no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      onQueryChange?.(newQuery); // << CHAMA A FUNÇÃO PARA BUSCAR SUGESTÕES >>
      setShowSuggestions(true); // Mostra o dropdown
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Barra de input */}
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
          isFocused ? 'bg-white/20 border border-white/40 shadow-lg shadow-green-500/20' : 'bg-white/10 border border-white/20 hover:bg-white/15'
        }`}
      >
        <Search size={20} className={`transition-colors duration-300 ${isFocused ? 'text-green-400' : 'text-neutral-400'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange} // << Usa o novo handler
          onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
          onBlur={() => { setTimeout(() => { if (containerRef.current && !containerRef.current.contains(document.activeElement)) { setIsFocused(false); setShowSuggestions(false); } }, 150); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder:text-neutral-500 outline-none text-sm"
          aria-label="Buscar"
          autoComplete="off"
        />
        {query && ( <button onClick={handleClear} className="p-1.5 rounded-full hover:bg-white/20 transition-all duration-300 text-neutral-400 hover:text-white" aria-label="Limpar busca"><X size={18} /></button> )}
      </div>

      {/* Dropdown de Sugestões (Renderização Atualizada) */}
      {showSuggestions && (query.length > 0 || isLoadingSuggestions) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-down max-h-80 overflow-y-auto">
          {/* Loading */}
          {isLoadingSuggestions && <div className="px-4 py-3 text-sm text-neutral-400 italic">Buscando sugestões...</div>}
          {/* Sem Sugestões */}
          {!isLoadingSuggestions && suggestions.length === 0 && query.length > 0 && <div className="px-4 py-3 text-sm text-neutral-500">Nenhuma sugestão encontrada com preview.</div>}
          {/* Lista de Sugestões */}
          {!isLoadingSuggestions && suggestions.map((suggestion) => (
            <button
              key={suggestion.id} // Usa ID da música
              onClick={() => triggerSearch(suggestion.title)} // Clicar dispara busca principal com o título
              className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors duration-200 flex items-center gap-3"
              title={`Buscar por "${suggestion.title}"`} // Tooltip
            >
              {/* Imagem (ou Placeholder) */}
              {suggestion.imageUrl ? (
                  <img src={suggestion.imageUrl} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
              ) : (
                  <div className="w-8 h-8 rounded bg-neutral-700 flex items-center justify-center text-neutral-500 flex-shrink-0"><Music size={16}/></div>
              )}
              {/* Texto (Título e Artista) */}
              <div className="overflow-hidden">
                <p className="text-sm text-white truncate">{suggestion.title}</p>
                <p className="text-xs text-neutral-400 truncate">{suggestion.artist}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}