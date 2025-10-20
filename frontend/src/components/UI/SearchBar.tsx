// frontend/src/components/UI/SearchBar.tsx
import { Search } from 'lucide-react';
import { ChangeEvent, FormEvent } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Buscar músicas, artistas ou playlists...',
}: SearchBarProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    onSearch?.(query);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          name="search"
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-neutral-800 text-white rounded-full border border-neutral-700 focus:border-green-500 focus:outline-none transition-colors"
          aria-label="Buscar"
        />
      </div>
    </form>
  );
}

