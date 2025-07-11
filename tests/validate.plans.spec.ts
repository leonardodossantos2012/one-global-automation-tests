import { test, expect } from '@playwright/test';
import { ProductsApi } from '../fixtures/get.currency';
import currencyData from '../data/currency.data.json';
import { HomePage } from '@/utils/page-objects/home/home.page';
import { GridValidator } from '@/utils/home-validator/grid.validator';


let productDataArray: any[] = [];

test.describe('Validate Currency', () => {
  test.beforeEach(async ({ request, page }) => {
    // Get the currency data from the currency.data.json file
    const countryCode = process.env.COUNTRY_CODE || '';
    const currency = process.env.CURRENCY || '';
    const productsData = (currencyData.countries as any)[countryCode]?.[currency]?.products;
    const url = process.env.PAGE_URL || '';

    if (countryCode === '' && currency === '' && url === '') {
      throw new Error('COUNTRY_CODE, CURRENCY, and PAGE_URL must be set');
    }

    for (const product of productsData) {
      const productsAPI = await ProductsApi.getProductsByCurrency(request, currency, product.id);
      try {
        expect(productsAPI?.name).toBe(product.name);
        productDataArray.push(productsAPI);
      } catch (error) {
        console.log("Before Test error: ", error);
        productDataArray.push(productsAPI);
      }
    }

    // Go to the home page
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test('@EUR @THA @BR Validate the data plan if is returned the value with success', async ({ page }) => {
    const currencyToUpdate = process.env.CURRENCY || 'EUR';
    const destination = process.env.DESTINATION || 'BR';
    const homePage = new HomePage(page);
    await homePage.selectCurrency(currencyToUpdate);
    await homePage.searchYourDestination(destination);
    await page.waitForTimeout(10000);

    // Validate grid items against API data using the dedicated validator
    const gridValidator = new GridValidator(page);
    const validationPassed = await gridValidator.validateGridItems(productDataArray);
    
    // Fail the test if validation failed
    expect(validationPassed, 'All plans was returned with success').toBe(true);
  });
});

