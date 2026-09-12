import { test, expect } from '@playwright/test';

test('Check cart reset after successful purchase', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');

  await page.locator('[data-test="Espresso"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');

  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Anna');
  await page.getByRole('textbox', { name: 'Email' }).fill('anna@gmail.com');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
});

test('Check all products is displayed', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await expect(page.getByText('Espresso $10.00espresso')).toBeVisible();
  await expect(page.getByText('Espresso Macchiato $12.00espressomilk foam')).toBeVisible();
  await expect(page.getByText('Cappuccino $19.00espressosteamed milkmilk foam')).toBeVisible();
  await expect(page.getByText('Mocha $8.00espressochocolate')).toBeVisible();
  await expect(page.getByText('Flat White $18.00espressosteamed milk')).toBeVisible();
  await expect(page.getByText('Americano $7.00espressowater')).toBeVisible();
  await expect(page.getByText('Cafe Latte $16.00espressosteamed milkmilk foam')).toBeVisible();
  await expect(page.getByText('Espresso Con Panna $14.00espressowhipped cream')).toBeVisible();
  await expect(page.getByText('Cafe Breve $15.00espressosteamed milksteamed creammilk foam')).toBeVisible();
});

test('Check the extra cup proposal is displayed and matching the design', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Flat_White"]').click();
  await page.locator('[data-test="Cappuccino"]').click();

  await expect(page.getByText('It\'s your lucky day! Get an extra cup of Mocha for $4.espressochocolate')).toBeVisible();
  await expect(page.locator('#app')).toContainText('It\'s your lucky day! Get an extra cup of Mocha for $4.');
  await expect(page.locator('[data-test="(Discounted)_Mocha"]')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Yes, of course!' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nah, I\'ll skip.' })).toBeVisible();
});


test('Check that user can accept extra cup proposal and total increases for 4$', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Cafe_Latte"]').click();
  await page.locator('[data-test="Espresso_Con Panna"]').click();
  await page.locator('[data-test="Americano"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $37.00');

  await expect(page.getByText('It\'s your lucky day! Get an extra cup of Mocha for $4.espressochocolate')).toBeVisible();
  await page.getByRole('button', { name: 'Yes, of course!' }).click();

  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $41.00');
});

test('Check the user can add one more product in total product list and total increases x2', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $12.00');

  await page.locator('[data-test="checkout"]').hover();
  await expect(page.locator('#app')).toContainText('Espresso Macchiato x 1+-');

  await page.getByRole('button', { name: 'Add one Espresso Macchiato' }).click();
  await expect(page.locator('#app')).toContainText('Espresso Macchiato x 2+-');

  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $24.00');
});