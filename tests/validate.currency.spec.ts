import { test, expect } from '@playwright/test';
import { ProductsApi } from '../fixtures/get.currency';
import currencyData from '../data/currency.data.json';
import { HomePage } from '@/utils/page-objects/home/home.page';
import { GridValidator } from '@/utils/page-objects/home/grid.validator';

interface Country {
  country_code: string;
  name: string;
  price_currency: string;
  products: {
    id: string;
    name: string;
  }[];
}
let productDataArray: any[] = [];

test.describe('Validate Currency', () => {
  test.beforeEach(async ({ request, page }) => {
    // Get the currency data from the currency.data.json file
    const countryCode = process.env.COUNTRY_CODE || 'THA';
    const currency = process.env.CURRENCY || 'EUR';
    const productsData = (currencyData.countries as any)[countryCode]?.[currency]?.products;
    const url = process.env.BASE_URL || 'https://www.betterroaming.com/';

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
    await homePage.goto(url);
  });

  test('@EUR @THB @BR Validate the data plan if is returned the value with success', async ({ page }) => {
    const currencyToUpdate = process.env.CURRENCY || 'EUR';
    const destination = process.env.DESTINATION || 'BR';
    const homePage = new HomePage(page);
    await homePage.selectCurrency(currencyToUpdate);
    await homePage.searchYourDestination(destination);

    // Validate grid items against API data using the dedicated validator
    const gridValidator = new GridValidator(page);
    const validationPassed = await gridValidator.validateGridItems(productDataArray);
    
    // Fail the test if validation failed
    expect(validationPassed, 'All plans was returned with success').toBe(true);
  });
});

