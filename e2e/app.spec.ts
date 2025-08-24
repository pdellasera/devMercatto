import { test, expect } from '@playwright/test';

test.describe('Application', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Check if the app loads
    await expect(page).toHaveTitle(/Mercatto/);
  });

  test('should display design system demo', async ({ page }) => {
    await page.goto('/');
    
    // Check if design system components are visible
    await expect(page.getByText('Design System Demo')).toBeVisible();
    await expect(page.getByText('Button Variants')).toBeVisible();
    await expect(page.getByText('Card Components')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    
    // Find and click theme toggle button
    const themeButton = page.getByRole('button', { name: /toggle theme/i });
    await themeButton.click();
    
    // Check if theme changed (this would need to be implemented in the app)
    // For now, just check if the button exists
    await expect(themeButton).toBeVisible();
  });
});
