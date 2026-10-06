import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../ui/input';
import { useClickOutside } from '../../../hooks/useClickOutside';

interface HeaderSearchProps {
  isSolid: boolean;
  onSearch?: (keyword: string) => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({ isSolid, onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setShowSuggestions(false));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    if (val.trim().length >= 2) {
      setSuggestions([
        `Tìm "${val.trim()}" trong danh mục`,
        `Gợi ý từ trợ lý AI cho "${val.trim()}"`,
      ]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (item: string) => {
    setKeyword(item);
    setShowSuggestions(false);
    onSearch?.(item);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (keyword.trim()) onSearch?.(keyword.trim());
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
  <Input
    value={keyword}
    onChange={handleChange}
    placeholder="Tìm xe, phụ tùng,..."
    className={
      isSolid
        ? 'bg-transparent border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus-visible:border-[#b8955a] focus-visible:ring-1 focus-visible:ring-[#b8955a]'
        : 'bg-transparent border-white/30 text-white placeholder:text-zinc-300 focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white/50'
    }
  />
  <button
    type="submit"
    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
      isSolid
        ? 'text-zinc-600 hover:text-[#b8955a]'
        : 'text-zinc-200 hover:text-white'
    }`}
    aria-label="Tìm kiếm"
  >
    <Search className="h-3.5 w-3.5" />
  </button>
</form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-[#17171a] border border-[#2d2d32] shadow-2xl py-1 z-50 text-xs overflow-hidden">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 text-zinc-300 hover:bg-[#25252b] hover:text-[#b8955a] cursor-pointer transition-colors"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};