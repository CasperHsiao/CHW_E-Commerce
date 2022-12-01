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
  const lastorderName = await (await lastorder.innerText()).toString()
  await expect(lastorderName).toContain(orderItemName)

  // const ingredientName = (await firstPossibleIngredient.innerText()).split('Add ')[1]
  // await firstPossibleIngredient.click()
  // await page.click("text='Save'")
  // await page.click("text='Submit'")

  
  // await page.goto('http://127.0.0.1:8096/operator/jim')
  // const lastChild = await page.locator('tr:last-child >> nth=1')
  // await expect(await lastChild.locator('td').nth(3).innerText()).toContain(ingredientName.toString())
});
