// frontend/src/components/UI/SearchBar.tsx
'use client';

import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  suggestions?: string[];
}

export function SearchBar({
  placeholder = 'Buscar músicas, artistas, playlists...',
  onSearch,
  onClear,
  suggestions = [],
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch?.(searchQuery);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
    inputRef.current?.focus();
  };

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Container */}
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
          isFocused
            ? 'bg-white/20 border border-white/40 shadow-lg shadow-green-500/20'
            : 'bg-white/10 border border-white/20 hover:bg-white/15'
        }`}
      >
        {/* Search Icon */}
        <Search
          size={20}
          className={`transition-colors duration-300 ${
            isFocused ? 'text-green-400' : 'text-neutral-400'
          }`}
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder:text-neutral-500 outline-none text-sm"
          aria-label="Buscar"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="p-1.5 rounded-full hover:bg-white/20 transition-all duration-300 text-neutral-400 hover:text-white"
            aria-label="Limpar busca"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-down">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="w-full px-4 py-3 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <Search size={16} className="text-neutral-500" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

