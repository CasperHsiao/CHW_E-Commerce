import { test, expect } from '@playwright/test';

test('Add order with the first possible ingredient', async ({ page }) => {
  await page.goto('http://127.0.0.1:8096/customer/alice')

  const firstPossibleIngredient = page.locator('button:has-text("Add") >> nth=0')
  const ingredientName = (await firstPossibleIngredient.innerText()).split('Add ')[1]
  await firstPossibleIngredient.click()
  await page.click("text='Save'")
  await page.click("text='Submit'")

  
  await page.goto('http://127.0.0.1:8096/operator/jim')
  const lastChild = await page.locator('tr:last-child >> nth=1')
  await expect(await lastChild.locator('td').nth(3).innerText()).toContain(ingredientName.toString())
});
