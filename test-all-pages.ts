/**
 * Скрипт для тестирования всех страниц через Playwright
 * Запуск: npx ts-node test-all-pages.ts
 */

import { chromium } from 'playwright';

const baseURL = 'http://localhost:3000';
const demoUsers = [
  { email: 'admin@demo.com', password: 'admin123', role: 'Super Admin', pages: ['/dashboard'] },
  { email: 'manager@demo.com', password: 'manager123', role: 'Manager', pages: ['/dashboard'] },
  { email: 'picker@demo.com', password: 'picker123', role: 'Picker', pages: ['/picker'] },
  { email: 'courier@demo.com', password: 'courier123', role: 'Courier', pages: ['/courier'] },
];

async function testPages() {
  console.log('🧪 Начинаем тестирование всех страниц...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Тест страницы входа
    console.log('📄 Тестируем страницу входа...');
    await page.goto(`${baseURL}/login`);
    await page.waitForSelector('h1');
    const loginTitle = await page.textContent('h1');
    console.log(`   ✅ Страница входа: ${loginTitle}\n`);

    // Тест демо-страницы
    console.log('📄 Тестируем демо-страницу...');
    await page.goto(`${baseURL}/demo`);
    await page.waitForSelector('h1');
    const demoTitle = await page.textContent('h1');
    console.log(`   ✅ Демо-страница: ${demoTitle}\n`);

    // Тест для каждого пользователя
    for (const user of demoUsers) {
      console.log(`👤 Тестируем как ${user.role} (${user.email})...`);
      
      try {
        // Вход
        await page.goto(`${baseURL}/login`);
        await page.fill('input[type="email"]', user.email);
        await page.fill('input[type="password"]', user.password);
        await page.click('button[type="submit"]');
        
        // Ждем редиректа или ошибки
        await page.waitForTimeout(3000);
        
        const currentURL = page.url();
        console.log(`   📍 Текущий URL: ${currentURL}`);

        // Проверяем доступные страницы
        for (const pagePath of user.pages) {
          try {
            await page.goto(`${baseURL}${pagePath}`);
            await page.waitForTimeout(2000);
            const pageTitle = await page.textContent('h2') || await page.textContent('h1');
            console.log(`   ✅ ${pagePath}: ${pageTitle || 'Загружено'}`);
          } catch (error) {
            console.log(`   ❌ ${pagePath}: Ошибка - ${error}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Ошибка входа: ${error}`);
        console.log(`   💡 Убедитесь, что пользователь ${user.email} создан в Firebase`);
      }
      
      console.log('');
    }

    console.log('✅ Тестирование завершено!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await browser.close();
  }
}

testPages();

