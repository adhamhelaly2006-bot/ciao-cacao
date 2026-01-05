import React, { useState, useRef, useEffect } from 'react';
import { menuData } from './menuData';

interface MenuItemProps {
  name: string;
  price: string;
  description: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, description }) => (
  <div className="flex flex-col py-4">
    <div className="flex justify-between items-baseline">
      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      <p className="text-xl font-bold text-gray-800">{price}</p>
    </div>
    <p className="text-gray-600 mt-1">{description}</p>
  </div>
);

interface MenuCategoryProps {
  category: {
    title: string;
    items: MenuItemProps[];
  };
  id: string;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ category, id }) => (
  <section id={id} className="mb-12 scroll-mt-24">
    <h2 className="text-4xl font-extrabold text-[#2E7D32] mb-6 border-b-4 border-[#2E7D32] pb-2">
      {category.title}
    </h2>
    <div className="divide-y divide-gray-200">
      {category.items.map((item) => (
        <MenuItem key={item.name} {...item} />
      ))}
    </div>
  </section>
);


const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(menuData[0].title);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, menuData.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-900">
      <header className="text-center py-8 bg-white shadow-md">
        <h1 className="text-6xl md:text-7xl font-serif font-extrabold text-[#2E7D32] tracking-wider">
          Ciao Cacao
        </h1>
        <p className="text-gray-500 mt-2 text-lg md:text-xl">قائمة الطعام</p>
      </header>

      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row px-4 py-8 md:py-12">
        <aside className="md:w-1/4 lg:w-1/5 md:sticky md:top-8 md:self-start mb-8 md:mb-0">
          <nav>
            <h3 className="text-2xl font-bold mb-4 text-[#2E7D32]">الأقسام</h3>
            <ul>
              {menuData.map((category) => (
                <li key={category.title}>
                  <a
                    href={`#${category.title}`}
                    className={`block py-2 px-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                      activeCategory === category.title
                        ? 'bg-[#2E7D32] text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="md:w-3/4 lg:w-4/5 md:pr-8 lg:pr-12">
          {menuData.map((category, index) => (
             <section
              key={category.title}
              id={category.title}
              ref={el => sectionRefs.current[index] = el}
              className="mb-12 scroll-mt-24"
            >
              <h2 className="text-4xl font-extrabold text-[#2E7D32] mb-6 border-b-4 border-[#2E7D32] pb-2">
                {category.title}
              </h2>
              <div className="divide-y divide-gray-200">
                {category.items.map((item) => (
                  <MenuItem key={item.name} {...item} />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default App;
