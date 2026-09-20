import { test, expect } from '@playwright/test';

test('Check cart reset after successful purchase', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
  await page.locator('[data-test="Espresso"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');
  await page.locator('[data-test="checkout"]').click();

  await page.locator('input[name="name"]').fill('Anna');
  await page.locator('input[name="email"]').fill('anna@gmail.com');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
});

test('Check all products is displayed', async ({ page }) => {
  await page.goto('');
  const products = await page.locator('li:has(h4)').allTextContents();
  const expectedProducts = ["Espresso", "Espresso Macchiato", "Cappuccino", "Mocha", "Flat White", "Americano", "Cafe Latte", "Espresso Con Panna", "Cafe Breve"];

  for (let i = 0; i < products.length; i++) {
    expect(products[i]).toContain(expectedProducts[i]);
  }
});

test('Check the extra cup proposal is displayed and matching the design', async ({ page }) => {
  await page.goto('');
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Flat_White"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await expect(page.locator('.promo>span')).toContainText('It\'s your lucky day! Get an extra cup of Mocha for $4.');
  await expect(page.locator('[data-test="(Discounted)_Mocha"]')).toBeVisible();
  await expect(page.locator('.promo button[class="yes"]')).toBeVisible();
  await expect(page.locator('.promo button:not(.yes)')).toBeVisible();
});

test('Check that user can accept extra cup proposal and total increases for 4$', async ({ page }) => {
  await page.goto('');
  await page.locator('[data-test="Cafe_Latte"]').click();
  await page.locator('[data-test="Espresso_Con Panna"]').click();
  await page.locator('[data-test="Americano"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $37.00');
  await expect(page.locator('.promo>span')).toBeVisible();
  
  await page.locator('button[class="yes"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $41.00');
});

test('Check the user can add one more product in total product list and total increases x2', async ({ page }) => {
  await page.goto('');
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $12.00');
  await page.locator('[data-test="checkout"]').hover();
  await expect(page.locator('#app')).toContainText('Espresso Macchiato x 1+-');

  await page.locator('button[aria-label="Add one Espresso Macchiato"]').click();
  await expect(page.locator('#app')).toContainText('Espresso Macchiato x 2+-');
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $24.00');
});