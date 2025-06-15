import { Page } from '@playwright/test';

export async function getAuthToken(page: Page): Promise<string> {
  return (await page.context().cookies()).find((c) => c.name === 'Authorization')!.value;
}
