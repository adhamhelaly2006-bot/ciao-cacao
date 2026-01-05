import React, { useState, useEffect, useRef } from 'react';
import { menuData } from './menuData';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
    return 'light';
  });

  const [activeCategory, setActiveCategory] = useState<string>(menuData[0]?.title || '');
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      // Offset to trigger the highlight a bit before the section top reaches the viewport top
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      let currentCategory = '';
      sectionRefs.current.forEach((ref, index) => {
        if (ref && ref.offsetTop <= scrollPosition) {
          currentCategory = menuData[index].title;
        }
      });

      if (currentCategory && activeCategory !== currentCategory) {
        setActiveCategory(currentCategory);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, title: string) => {
    e.preventDefault();
    setActiveCategory(title);
    const element = document.getElementById(title.replace(/\s+/g, '-'));
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white dark:bg-gray-900 transition-colors duration-300">
      <header className="relative text-center py-8 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
        <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
        </div>
        <h1 className="text-6xl md:text-7xl font-serif font-extrabold text-[#2E7D32] tracking-wider">
          Ciao Cacao
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg md:text-xl">Menu</p>
      </header>
      
      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
         <nav className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 overflow-x-auto no-scrollbar" dir="rtl">
            {menuData.map((category) => (
              <a
                key={category.title}
                href={`#${category.title.replace(/\s+/g, '-')}`}
                onClick={(e) => handleNavClick(e, category.title)}
                className={`whitespace-nowrap px-4 py-2 text-sm md:text-base font-medium rounded-full transition-colors duration-200 ${
                  activeCategory === category.title
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.title}
              </a>
            ))}
          </div>
        </nav>

        <div dir="rtl">
          {menuData.map((category, index) => (
            <section
              key={category.title}
              id={category.title.replace(/\s+/g, '-')}
              ref={(el) => (sectionRefs.current[index] = el)}
              className="mb-16 scroll-mt-24" // scroll-mt for sticky nav offset
            >
              <h2 className="text-4xl font-serif font-bold text-gray-800 dark:text-white mb-8 border-b-2 border-[#2E7D32] pb-3">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 gap-y-6">
                {category.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-start py-2">
                    <div className="pr-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                      {item.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>}
                    </div>
                    <div className="text-lg font-mono font-semibold text-right text-gray-700 dark:text-gray-200 whitespace-nowrap">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;