import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  cartCount?: number;
  onSearch?: (keyword: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount = 0, onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  // Search & Suggestions
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Session & User
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Drawer Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Login Modal
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Category (mặc định null = "Tất cả dòng xe")
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Categories theo chuẩn giao diện Collections
  const categories = [
    { id: 1, name: 'Sedan Hạng Sang', count: '12' },
    { id: 2, name: 'SUV Hiệu Năng Cao', count: '8' },
    { id: 3, name: 'Coupe & Grand Tourer', count: '5' },
    { id: 4, name: 'Xe Điện & Hybrid', count: '6' },
    { id: 5, name: 'Bộ Sưu Tập Giới Hạn', tag: 'BESPOKE' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const trimmed = keyword.trim();
    if (trimmed.length >= 2) {
      setSuggestions([
        `Tìm "${trimmed}" trong danh mục`,
        `Gợi ý từ trợ lý AI cho "${trimmed}"`,
      ]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch?.(keyword.trim());
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setUserId('user-01');
    setUserName(loginUsername.trim());
    setIsLoginOpen(false);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError(null);
  };

  const handleLogout = () => {
    setUserId(null);
    setUserName('');
    setShowUserMenu(false);
  };

  const userInitials = userName
    ? userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : 'U';

  const isSolid = isScrolled || isHeaderHovered;

  return (
    <>
      {/* HEADER CỐ ĐỊNH TRÊN CÙNG */}
      <header
        id="mainHeader"
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
        className={`fixed top-0 left-0 right-0 h-22 w-full z-50 px-6 sm:px-10 flex items-center justify-between transition-all duration-300 select-none ${isSolid
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200 text-gray-900'
            : 'bg-transparent border-b border-transparent text-white'
          }`}
      >
        {/* NÚT 3 GẠCH + Ô TÌM KIẾM */}
        <div className="flex items-center gap-4 flex-1 max-w-sm sm:max-w-md">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={`p-1.5 transition flex flex-col justify-center gap-1.5 focus:outline-none shrink-0 group ${isSolid ? 'text-gray-800 hover:text-black' : 'text-white hover:text-[#b8955a]'
              }`}
            title="Mở menu danh mục"
          >
            <span className="h-0.5 w-6 bg-current rounded-full transition-all group-hover:w-7" />
            <span className="h-0.5 w-4 bg-current rounded-full transition-all group-hover:w-7" />
            <span className="h-0.5 w-6 bg-current rounded-full transition-all group-hover:w-7" />
          </button>

          <div ref={searchContainerRef} className="relative w-full">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm xe, phụ tùng,..."
                className={`w-full py-1.5 pl-3.5 pr-8 text-xs rounded-full outline-none transition-all duration-300 ${isSolid
                    ? 'bg-gray-100/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-[#b8955a] focus:bg-white'
                    : 'bg-black/35 text-white placeholder-gray-300 border border-white/20 focus:border-[#b8955a] focus:bg-black/60 backdrop-blur-sm'
                  }`}
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#b8955a] hover:scale-110 transition"
              >
                <svg
                  className="h-3.5 w-3.5 stroke-current fill-none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-[#17171a] border border-[#2d2d32] shadow-2xl py-1 z-50 text-xs overflow-hidden">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setKeyword(item);
                      setShowSuggestions(false);
                      onSearch?.(item);
                    }}
                    className="px-4 py-2 text-gray-300 hover:bg-[#25252b] hover:text-[#b8955a] cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LOGO & THƯƠNG HIỆU */}
        <Link to="/" className="flex items-center gap-3.5 group cursor-pointer shrink-0 mx-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-[#b8955a] flex items-center justify-center p-1 text-[#b8955a] shrink-0 transition-transform group-hover:scale-105 bg-black/25 backdrop-blur-sm">
              <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v20M12 12L3.5 7M12 12l8.5-5M12 12L4 18M12 12l8 6" />
              </svg>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span
                className={`text-xs font-semibold tracking-[0.22em] font-serif uppercase transition-colors duration-300 ${isSolid ? 'text-black' : 'text-white drop-shadow-md'
                  }`}
              >
                Mercedes-Benz
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#b8955a] uppercase font-medium">
                Authorized Dealer Portal
              </span>
            </div>
          </div>
        </Link>

        {/* CÁC NÚT TƯƠNG TÁC PHẢI */}
        <div className="flex items-center gap-4 shrink-0">
          {userId && (
            <Link
              to="/cart"
              title="Xem giỏ hàng"
              className="relative p-2 text-[#b8955a] hover:text-[#d4ad6e] transition flex items-center justify-center"
            >
              <svg
                className="h-5 w-5 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#b8955a] text-[10px] font-bold text-black shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {userId && (
            <div
              className={`h-5 w-[1px] transition-colors duration-300 ${isSolid ? 'bg-gray-300' : 'bg-white/30'
                }`}
            />
          )}

          {userId ? (
            <div ref={userMenuRef} className="relative flex items-center gap-2">
              <Link
                to="/"
                title="Về trang chủ"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b8955a] text-xs font-bold text-black shadow-sm hover:ring-2 hover:ring-[#b8955a]/50 transition"
              >
                {userInitials}
              </Link>

              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`hidden sm:inline text-xs font-medium transition-colors ${isSolid ? 'text-gray-800 hover:text-black' : 'text-white hover:text-[#b8955a]'
                  }`}
              >
                {userName} ▾
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-11 w-44 rounded-xl bg-[#17171a] border border-[#2d2d32] shadow-2xl py-1.5 z-50 text-xs">
                  <a
                    href="#hoso"
                    className="block px-4 py-2 text-gray-300 hover:bg-[#25252b] hover:text-white transition"
                  >
                    Hồ sơ đại lý
                  </a>
                  <Link
                    to="/cart"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-gray-300 hover:bg-[#25252b] hover:text-white transition"
                  >
                    Giỏ hàng của tôi
                  </Link>
                  <div className="my-1 border-t border-[#2d2d32]" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#25252b] transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              title="Đăng nhập tài khoản"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b8955a] text-[#b8955a] hover:bg-[#b8955a] hover:text-black transition duration-300 shadow-sm backdrop-blur-sm"
            >
              <svg
                className="h-4 w-4 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* DRAWER SIDEBAR - BẢN THIẾT KẾ COLLECTIONS NỀN TRẮNG */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${isSidebarOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
          }`}
      >
        <div
          onClick={() => setIsSidebarOpen(false)}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}
        />

        <aside
          className={`fixed top-0 left-0 bottom-0 w-[320px] sm:w-[360px] bg-white text-gray-900 flex flex-col justify-between p-8 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 select-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex flex-col">
            <div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-gray-200 rounded text-xs font-semibold tracking-wider text-gray-800 hover:border-black hover:bg-gray-50 transition uppercase"
              >
                <span>✕</span>
                <span>ĐÓNG / CLOSE</span>
              </button>
            </div>

            <div className="mt-8 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                COLLECTIONS
              </span>
            </div>

            <nav className="flex flex-col space-y-5">
              {/* Tất cả dòng xe - Đã chuẩn hóa Unicode NFC */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null);
                  setIsSidebarOpen(false);
                }}
                className="flex items-center justify-between text-left group transition"
              >
                <span
                  style={{ fontFamily: "'Merriweather', serif" }}
                  className={`text-[21px] font-normal leading-tight tracking-normal transition-colors ${activeCategory === null
                      ? 'text-[#b8955a]'
                      : 'text-[#1c2024] group-hover:text-[#b8955a]'
                    }`}
                >
                  Tất cả dòng xe
                </span>
                {activeCategory === null ? (
                  <span className="text-[#b8955a] text-sm">●</span>
                ) : (
                  <span className="text-xs text-gray-400 font-sans">31</span>
                )}
              </button>

              {categories.map((c) => {
                const isSelected = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(c.id);
                      setIsSidebarOpen(false);
                    }}
                    className="flex items-center justify-between text-left group transition"
                  >
                    <span
                      className={`text-xl font-serif tracking-normal ${isSelected
                          ? 'text-[#b8955a] font-medium'
                          : 'text-gray-900 group-hover:text-[#b8955a]'
                        }`}
                    >
                      {c.name}
                    </span>

                    {isSelected ? (
                      <span className="text-[#b8955a] text-sm">●</span>
                    ) : c.tag ? (
                      <span className="bg-[#f5f0e6] text-[#b8955a] border border-[#e5d8be] text-[9px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase font-sans">
                        {c.tag}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-sans">{c.count}</span>
                    )}
                  </button>
                );
              })}
            </nav>


            <div className="w-full h-[1px] bg-gray-200 my-6" />

            <a
              href="#service"
              onClick={() => setIsSidebarOpen(false)}
              className="text-xs text-gray-700 hover:text-[#b8955a] leading-relaxed transition"
            >
              Đặt lịch bảo dưỡng (Service & Maintenance)
            </a>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-600">
            <span className="text-[#b8955a]">🌐</span>
            <span>VN / VND (₫) • English</span>
          </div>
        </aside>
      </div>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div
          id="loginModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLoginOpen(false);
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110]"
        >
          <div className="bg-[#151518] border border-[#2b2b30] p-7 rounded-2xl shadow-2xl w-80 sm:w-96 text-white relative">
            <button
              type="button"
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-3.5 right-3.5 text-gray-400 hover:text-white transition"
            >
              ✕
            </button>

            <h2 className="text-lg font-serif font-bold text-center tracking-wider uppercase mb-5 text-[#b8955a]">
              Đăng nhập tài khoản
            </h2>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Tên tài khoản</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-[#1e1e24] border border-[#32323a] rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#b8955a]"
                  placeholder="Nhập tên đăng nhập..."
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#1e1e24] border border-[#32323a] rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#b8955a]"
                  placeholder="Nhập mật khẩu..."
                />
              </div>

              <div className="text-left text-[11px] text-gray-400 pt-0.5">
                Bạn chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  onClick={() => setIsLoginOpen(false)}
                  className="text-[#b8955a] font-medium hover:underline hover:text-[#d4ad6e] transition"
                >
                  Đăng ký ngay
                </Link>
              </div>

              {loginError && (
                <p className="text-red-400 text-xs font-medium">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#b8955a] text-black font-semibold py-2.5 rounded-lg text-xs hover:bg-[#d4ad6e] transition mt-2"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;