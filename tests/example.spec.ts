import { test, expect } from '@playwright/test';

test('Checkout shopping Cart and add order with the first possible ingredient', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080')
  await expect(page).toHaveTitle(/UI/)

  await page.getByRole('link', { name: 'Login' }).click();

  // Login with pre-create keycloak test account 
  await page.getByLabel('Username or email').fill('testaccount1');
  await page.getByLabel('Password').fill('123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  await page.getByRole('link', { name: 'My Orders' }).click();

  const lastItem = await page.locator('div .card').nth(-1);
  const lastItemName = await (await lastItem.locator('.card-body > .card-title').innerText()).toString()

  await lastItem.locator('.card-footer > .btn').click()
  await page.getByRole('button', { name: 'Shopping Cart' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'OK' }).click();

  const orderItem = await page.getByRole('row').nth(-1).getByRole('cell').nth(-1);
  const orderItemName = await (await orderItem.innerText()).toString()
  await expect(orderItemName).toContain(lastItemName)

  // Logout and login with operator (admin)
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.locator('div .kc-login-tooltip').click()

  await page.getByLabel('Username or email').fill('jim');
  await page.getByLabel('Password').fill('123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.getByRole('link', { name: 'My Work Screen' }).click();

  const lastorder = await page.getByRole('row').nth(-1).getByRole('cell').nth(-2);
  const lastorderName = await (await lastorder.innerText()).toString();
  await expect(lastorderName).toContain(orderItemName);
});

test('Submit form by adding item in operator work screen', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080')
  await expect(page).toHaveTitle(/UI/)

  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByLabel('Username or email').fill('jim');
  await page.getByLabel('Password').fill('123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.getByRole('link', { name: 'My Work Screen' }).click();
  await page.getByRole('button', { name: 'Additem' }).click();

  const itemName = "Apple"
  // Fill in the form
  await page.getByPlaceholder("item name").fill(itemName);
  await page.locator('div .form-group > input').nth(1).fill("30");
  await page.getByPlaceholder("item description").fill("This is a fresh apple");
  await page.locator('div .form-group > input').nth(-1).fill("2.6");

  await page.getByRole('button', { name: 'Confirm' }).click();

  // Login with pre-create keycloak test account 
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.locator('div .kc-login-tooltip').click();

  await page.getByLabel('Username or email').fill('testaccount1');
  await page.getByLabel('Password').fill('123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  await page.getByRole('link', { name: 'My Orders' }).click();

  const lastItem = await page.locator('div .card').nth(-1);
  const lastItemName = await (await lastItem.locator('.card-body > .card-title').innerText()).toString()
  await expect(lastItemName).toContain(itemName);
});
