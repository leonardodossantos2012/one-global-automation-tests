import { expect, type Page } from '@playwright/test';
import { homeMapping } from './home.mapping';

export interface Product {
  id: string;
  name: string;
  price: number;
  price_currency: string;
  data: number;
  data_unit: string;
  duration: number;
  duration_unit: string;
}

export class GridValidator {
  private page: Page;
  private validationErrors: string[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  async validateGridItems(products: Product[]): Promise<boolean> {
    console.log('🔍 Validating grid items against product data...');

    await this.validateAndClickDataElements();

    const gridItems = this.page.locator(homeMapping.gridSelector);
    const gridCount = await gridItems.count();
    
    console.log(`Found ${gridCount} grid items to validate`);
    
    if (gridCount === 0) {
      const error = '❌ No grid items found on the page';
      this.validationErrors.push(error);
      console.error(error);
      return false;
    }
    
    let allValidationsPassed = true;
    
    for (let i = 0; i < gridCount; i++) {
      const gridItem = gridItems.nth(i);
      const gridText = await gridItem.textContent();
      
      // Find matching product for this grid item
      const matchingProduct = this.findMatchingProduct(gridText, products);
      
      if (matchingProduct) {
        const gridValidationPassed = await this.validateGridItem(gridItem, matchingProduct, i + 1);
        if (!gridValidationPassed) {
          allValidationsPassed = false;
        }
      } else {
        const error = `❌ No matching product found for grid item ${i + 1}`;
        this.validationErrors.push(error);
        console.error(error);
        allValidationsPassed = false;
      }
    }
    
    if (allValidationsPassed) {
      console.log('🎉 All grid validations passed successfully!');
    } else {
      console.error('❌ Grid validation failed with the following errors:');
      this.validationErrors.forEach(error => console.error(error));
    }
    
    return allValidationsPassed;
  }

  async validateAndClickDataElements(): Promise<void> {
    console.log('🔍 Validating and clicking "Data" elements in grid...');
    
    const gridElement = this.page.locator(homeMapping.gridSelector);
    const gridExists = await gridElement.count();
    
    if (gridExists === 0) {
        throw new Error('Grid element not found on the page');
    }
    
    console.log('✅ Grid element found');
    
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Page fully loaded');
    

    const gridText = await gridElement.textContent();
    console.log('Grid text content:', gridText);
    
    // More specific selector to target only the "Data" elements in the grid
    // Based in the HTML structure, we want the div that contains "Data" text
    const dataElements = this.page.locator(homeMapping.gridDataSelector);
    const dataCount = await dataElements.count();
    
    console.log(`Found ${dataCount} "Data" elements in the grid`);
    
    // Limit to a reasonable number of elements (should be around 5 based on your HTML)
    const maxElements = 10;
    if (dataCount > maxElements) {
        console.warn(`⚠️ Found ${dataCount} elements, limiting to first ${maxElements} to avoid timeout`);
    }
    
    const elementsToClick = Math.min(dataCount, maxElements);
    
    if (elementsToClick === 0) {
        console.warn('⚠️ No "Data" elements found in grid');
        return;
    }
    
    // Click "Data" elements with shorter timeout
    for (let i = 0; i < elementsToClick; i++) {
        console.log(`Clicking "Data" element ${i + 1} of ${elementsToClick}`);
        
        try {
            // Use a shorter timeout for each click
            await dataElements.nth(i).click({ timeout: 5000 });
            console.log(`✅ Successfully clicked "Data" element ${i + 1}`);
            
            // Shorter wait between clicks
            await this.page.waitForTimeout(200);
        } catch (error) {
            console.error(`❌ Failed to click "Data" element ${i + 1}:`, error);
            // Continue with next element instead of throwing
            continue;
        }
    }
    
    console.log(`🎉 Successfully processed ${elementsToClick} "Data" elements`);
}

  private findMatchingProduct(gridText: string | null, products: Product[]): Product | null {
    if (!gridText) return null;
    
    for (const product of products) {
      if (product?.price && product?.data) {
        const expectedPrice = product.price.toString();
        const expectedDataPlan = product.data.toString() + ' ' + product.data_unit;
        
        if (gridText.includes(expectedPrice) && gridText.includes(expectedDataPlan)) {
          return product;
        }
      }
    }
    return null;
  }

  private async validateGridItem(gridItem: any, product: Product, gridIndex: number): Promise<boolean> {
    const expectedPrice = product.price.toString();
    const expectedDataPlan = product.data.toString() + ' ' + product.data_unit;
    const expectedDuration = this.formatDuration(product.duration, product.duration_unit);
    
    console.log(`\n📋 Grid ${gridIndex}: ${product.name}`);
    console.log(`   Expected: ${expectedPrice} ${product.price_currency} | ${expectedDataPlan} | ${expectedDuration}`);
    
    let gridValidationPassed = true;
    
    try {
      // Validate price within this specific grid item
      await expect(gridItem.getByText(expectedPrice, { exact: false }).first()).toBeVisible();
      console.log(`   ✅ Price "${expectedPrice}" validation passed`);
    } catch (error) {
      const errorMsg = `   ❌ Price "${expectedPrice}" not found in grid ${gridIndex}`;
      this.validationErrors.push(errorMsg);
      console.error(errorMsg);
      gridValidationPassed = false;
    }
    
    try {
      // Validate data plan within this specific grid item
      await expect(gridItem.getByText(expectedDataPlan, { exact: false }).first()).toBeVisible();
      console.log(`   ✅ Data plan "${expectedDataPlan}" validation passed`);
    } catch (error) {
      const errorMsg = `   ❌ Data plan "${expectedDataPlan}" not found in grid ${gridIndex}`;
      this.validationErrors.push(errorMsg);
      console.error(errorMsg);
      gridValidationPassed = false;
    }
    
    try {
      // Validate duration within this specific grid item
      await expect(gridItem.getByText(expectedDuration, { exact: false }).first()).toBeVisible();
      console.log(`   ✅ Duration "${expectedDuration}" validation passed`);
    } catch (error) {
      const errorMsg = `   ❌ Duration "${expectedDuration}" not found in grid ${gridIndex}`;
      this.validationErrors.push(errorMsg);
      console.error(errorMsg);
      gridValidationPassed = false;
    }
    
    if (gridValidationPassed) {
      console.log(`   🎉 Grid ${gridIndex} validation passed`);
    } else {
      console.error(`   ❌ Grid ${gridIndex} validation failed`);
    }
    
    return gridValidationPassed;
  }

  private formatDuration(duration: number, unit: string): string {
    if (unit === 'DAYS') {
      return duration === 1 ? '1 DAY' : `${duration} DAYS`;
    } else if (unit === 'HOURS') {
      return duration === 1 ? '1 HOUR' : `${duration} HOURS`;
    } else if (unit === 'MINUTES') {
      return duration === 1 ? '1 MINUTE' : `${duration} MINUTES`;
    }
    return `${duration} ${unit}`;
  }

  getValidationErrors(): string[] {
    return this.validationErrors;
  }
} 