'use client';

import { useState } from 'react';
import { categoryService, productService } from '@/services/firestore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';

const demoCategories = [
  { title: 'Пицца', imageUrl: '' },
  { title: 'Бургеры', imageUrl: '' },
  { title: 'Суши', imageUrl: '' },
  { title: 'Напитки', imageUrl: '' },
  { title: 'Десерты', imageUrl: '' },
  { title: 'Салаты', imageUrl: '' },
];

const demoProducts = [
  // Пицца
  { name: 'Пицца Маргарита', description: 'Классическая пицца с томатами, моцареллой и базиликом', price: 1500, stock: 50, categoryTitle: 'Пицца' },
  { name: 'Пицца Пепперони', description: 'Острая пицца с пепперони и сыром', price: 1800, stock: 45, categoryTitle: 'Пицца' },
  { name: 'Пицца Четыре сыра', description: 'Пицца с моцареллой, горгонзолой, пармезаном и чеддером', price: 2000, stock: 30, categoryTitle: 'Пицца' },
  { name: 'Пицца Гавайская', description: 'Пицца с ветчиной и ананасами', price: 1900, stock: 35, categoryTitle: 'Пицца' },
  
  // Бургеры
  { name: 'Бургер Классик', description: 'Классический бургер с говядиной, овощами и соусом', price: 2000, stock: 40, categoryTitle: 'Бургеры' },
  { name: 'Чизбургер', description: 'Бургер с говядиной, сыром и специальным соусом', price: 2200, stock: 38, categoryTitle: 'Бургеры' },
  { name: 'Бургер с курицей', description: 'Бургер с куриной котлетой и свежими овощами', price: 1900, stock: 42, categoryTitle: 'Бургеры' },
  { name: 'Двойной бургер', description: 'Две говяжьи котлеты, двойной сыр и соус', price: 2800, stock: 25, categoryTitle: 'Бургеры' },
  
  // Суши
  { name: 'Суши сет', description: 'Ассорти из 12 суши: лосось, тунец, угорь', price: 3500, stock: 20, categoryTitle: 'Суши' },
  { name: 'Ролл Филадельфия', description: 'Ролл с лососем, сливочным сыром и огурцом', price: 1800, stock: 30, categoryTitle: 'Суши' },
  { name: 'Ролл Калифорния', description: 'Ролл с крабом, авокадо и огурцом', price: 1600, stock: 28, categoryTitle: 'Суши' },
  { name: 'Ролл Дракон', description: 'Запеченный ролл с угрем и соусом унаги', price: 2200, stock: 22, categoryTitle: 'Суши' },
  
  // Напитки
  { name: 'Кола 0.5л', description: 'Охлажденная кола', price: 300, stock: 100, categoryTitle: 'Напитки' },
  { name: 'Сок апельсиновый', description: 'Свежевыжатый апельсиновый сок', price: 400, stock: 80, categoryTitle: 'Напитки' },
  { name: 'Чай зеленый', description: 'Горячий зеленый чай', price: 250, stock: 90, categoryTitle: 'Напитки' },
  { name: 'Кофе латте', description: 'Кофе с молоком и пенкой', price: 500, stock: 60, categoryTitle: 'Напитки' },
  
  // Десерты
  { name: 'Чизкейк', description: 'Нежный чизкейк с ягодным соусом', price: 1200, stock: 25, categoryTitle: 'Десерты' },
  { name: 'Тирамису', description: 'Классический итальянский десерт', price: 1400, stock: 20, categoryTitle: 'Десерты' },
  { name: 'Мороженое пломбир', description: 'Сливочное мороженое', price: 600, stock: 50, categoryTitle: 'Десерты' },
  { name: 'Шоколадный торт', description: 'Торт с шоколадным кремом', price: 1800, stock: 15, categoryTitle: 'Десерты' },
  
  // Салаты
  { name: 'Салат Цезарь', description: 'Салат с курицей, сыром и соусом цезарь', price: 1200, stock: 35, categoryTitle: 'Салаты' },
  { name: 'Греческий салат', description: 'Свежие овощи, оливки, сыр фета', price: 1000, stock: 40, categoryTitle: 'Салаты' },
  { name: 'Салат с морепродуктами', description: 'Салат с креветками и кальмарами', price: 1800, stock: 20, categoryTitle: 'Салаты' },
];

export default function DemoDataPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Проверка прав доступа
  if (user && user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.MANAGER) {
    router.push('/');
    return null;
  }

  const createDemoData = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Создаем категории
      const categoryMap: Record<string, string> = {};
      
      for (const category of demoCategories) {
        const categoryId = await categoryService.create({
          title: category.title,
          imageUrl: category.imageUrl,
        });
        categoryMap[category.title] = categoryId;
        setMessage(prev => prev + `✓ Создана категория: ${category.title}\n`);
      }

      // Создаем товары
      for (const product of demoProducts) {
        const categoryId = categoryMap[product.categoryTitle];
        if (!categoryId) {
          setError(prev => prev + `Ошибка: категория "${product.categoryTitle}" не найдена\n`);
          continue;
        }

        await productService.create({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: categoryId,
        });
        setMessage(prev => prev + `✓ Создан товар: ${product.name}\n`);
      }

      setMessage(prev => prev + '\n✅ Все демо-данные успешно созданы!');
    } catch (err: any) {
      setError(`Ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="glass border-b border-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard')} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold gradient-text">YetkazibBeish</h1>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Создание демо-данных</h2>
          <p className="text-gray-600 mb-6">
            Этот инструмент создаст демо-категории и товары для тестирования магазина.
            Будет создано {demoCategories.length} категорий и {demoProducts.length} товаров.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm whitespace-pre-line max-h-96 overflow-y-auto">
              {message}
            </div>
          )}

          <Button
            variant="gradient"
            size="lg"
            onClick={createDemoData}
            loading={loading}
            className="w-full"
          >
            {loading ? 'Создание...' : 'Создать демо-данные'}
          </Button>
        </Card>

        {/* Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Категории ({demoCategories.length})</h3>
            <ul className="space-y-2">
              {demoCategories.map((cat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {cat.title}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Товары ({demoProducts.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {demoProducts.map((prod, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-accent-500 rounded-full mt-2"></span>
                  <div>
                    <p className="font-semibold text-gray-900">{prod.name}</p>
                    <p className="text-gray-600">{prod.price} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

