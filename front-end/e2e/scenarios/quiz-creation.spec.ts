import { test, expect } from '@playwright/test';

test.describe('Création de Quiz E2E', () => {
  
  test('Scénario complet de création d\'un quiz', async ({ page }) => {
    
    console.log('ÉTAPE 1 : Accès à l\'administration');
    
    await page.goto('http://localhost:4200');
    await expect(page).toHaveURL(/localhost:4200/);
    
    await page.getByRole('button', { name: /espace intervenant/i }).click();
    
    await expect(page.locator('app-popup-code')).toBeVisible();
    
    await page.locator('input[type="1234"]').fill('admin');
    
   
  });
});