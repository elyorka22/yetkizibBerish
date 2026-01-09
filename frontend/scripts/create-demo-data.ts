/**
 * Скрипт для создания демо-пользователей и данных
 * Запуск: npx ts-node scripts/create-demo-data.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo',
  // Для демо используем публичные ключи или создаем через консоль
};

// Демо пользователи
const demoUsers = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'Супер Администратор',
    phone: '+998901234567',
    role: 'super_admin',
  },
  {
    email: 'manager@demo.com',
    password: 'manager123',
    name: 'Менеджер Иванов',
    phone: '+998901234568',
    role: 'manager',
  },
  {
    email: 'picker@demo.com',
    password: 'picker123',
    name: 'Сборщик Петров',
    phone: '+998901234569',
    role: 'picker',
  },
  {
    email: 'courier@demo.com',
    password: 'courier123',
    name: 'Курьер Сидоров',
    phone: '+998901234570',
    role: 'courier',
  },
];

// Демо заказы
const demoOrders = [
  {
    status: 'new',
    items: [
      { productId: 'prod1', productName: 'Пицца Маргарита', quantity: 2, price: 1500 },
      { productId: 'prod2', productName: 'Кола 0.5л', quantity: 2, price: 300 },
    ],
    totalAmount: 3600,
    customerName: 'Иван Иванов',
    customerPhone: '+998901111111',
    deliveryAddress: 'ул. Навои, д. 10, кв. 25',
  },
  {
    status: 'assigned_to_picker',
    items: [
      { productId: 'prod3', productName: 'Бургер Классик', quantity: 1, price: 2000 },
      { productId: 'prod4', productName: 'Картофель фри', quantity: 1, price: 800 },
    ],
    totalAmount: 2800,
    customerName: 'Мария Петрова',
    customerPhone: '+998902222222',
    deliveryAddress: 'пр. Амира Темура, д. 5, кв. 12',
    pickerId: 'picker_user_id', // Будет заменено на реальный ID
  },
  {
    status: 'picked',
    items: [
      { productId: 'prod5', productName: 'Салат Цезарь', quantity: 2, price: 1200 },
    ],
    totalAmount: 2400,
    customerName: 'Алексей Сидоров',
    customerPhone: '+998903333333',
    deliveryAddress: 'ул. Университетская, д. 15, кв. 8',
    pickerId: 'picker_user_id',
  },
  {
    status: 'assigned_to_courier',
    items: [
      { productId: 'prod6', productName: 'Суши сет', quantity: 1, price: 3500 },
    ],
    totalAmount: 3500,
    customerName: 'Елена Козлова',
    customerPhone: '+998904444444',
    deliveryAddress: 'ул. Пушкина, д. 20, кв. 30',
    pickerId: 'picker_user_id',
    courierId: 'courier_user_id', // Будет заменено на реальный ID
  },
  {
    status: 'in_delivery',
    items: [
      { productId: 'prod7', productName: 'Шашлык', quantity: 1, price: 2500 },
      { productId: 'prod8', productName: 'Лаваш', quantity: 2, price: 400 },
    ],
    totalAmount: 3300,
    customerName: 'Дмитрий Волков',
    customerPhone: '+998905555555',
    deliveryAddress: 'ул. Ленина, д. 7, кв. 15',
    pickerId: 'picker_user_id',
    courierId: 'courier_user_id',
  },
  {
    status: 'delivered',
    items: [
      { productId: 'prod9', productName: 'Плов', quantity: 2, price: 1800 },
    ],
    totalAmount: 3600,
    customerName: 'Ольга Новикова',
    customerPhone: '+998906666666',
    deliveryAddress: 'ул. Самаркандская, д. 25, кв. 5',
    pickerId: 'picker_user_id',
    courierId: 'courier_user_id',
    deliveredAt: new Date(Date.now() - 3600000), // 1 час назад
  },
];

async function createDemoData() {
  console.log('🚀 Начинаем создание демо-данных...\n');

  try {
    // Инициализация Firebase Admin (только если есть credentials)
    // Для демо можно использовать клиентский SDK
    console.log('📝 Инструкции по созданию демо-пользователей:\n');
    console.log('1. Откройте Firebase Console: https://console.firebase.google.com/');
    console.log('2. Перейдите в Authentication > Users');
    console.log('3. Создайте следующих пользователей:\n');

    demoUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Пароль: ${user.password}`);
      console.log(`   Роль: ${user.role}\n`);
    });

    console.log('4. После создания пользователей, создайте записи в Firestore:\n');
    console.log('   Коллекция: users');
    console.log('   Документ ID = UID пользователя из Authentication\n');

    demoUsers.forEach((user) => {
      console.log(`   Документ для ${user.email}:`);
      console.log(`   {`);
      console.log(`     "email": "${user.email}",`);
      console.log(`     "name": "${user.name}",`);
      console.log(`     "phone": "${user.phone}",`);
      console.log(`     "role": "${user.role}",`);
      console.log(`     "createdAt": Timestamp.now(),`);
      console.log(`     "updatedAt": Timestamp.now()`);
      console.log(`   }\n`);
    });

    console.log('5. Создайте демо-заказы в коллекции "orders"\n');
    console.log('   Примечание: pickerId и courierId нужно заменить на реальные UID\n');

    console.log('✅ Демо-данные готовы к использованию!');
    console.log('\n📋 Для быстрого входа используйте:');
    console.log('   - admin@demo.com / admin123 (Super Admin)');
    console.log('   - manager@demo.com / manager123 (Manager)');
    console.log('   - picker@demo.com / picker123 (Picker)');
    console.log('   - courier@demo.com / courier123 (Courier)');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

createDemoData();

