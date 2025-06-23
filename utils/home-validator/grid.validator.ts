import { type Page } from '@playwright/test';
import { Product } from './types';
import { DataFormatter } from './formatter';
import { ProductMatcher } from './product.matcher';
import { FieldValidator } from './field.validator';
import { DataInteractor } from './data.interactor';
import { plansMapping } from '../page-objects/plans/plans.mapping';

export { Product } from './types';

export class GridValidator {
  private readonly page: Page;
  private readonly validationErrors: string[] = [];
  private readonly dataInteractor: DataInteractor;

  constructor(page: Page) {
    this.page = page;
    this.dataInteractor = new DataInteractor(page);
  }

  async validateGridItems(products: Product[]): Promise<boolean> {
    console.log('🔍 Validating grid items against product data...');

    await this.dataInteractor.interactWithDataElements();
    const gridItems = await this.getGridItems();
    
    if (this.isEmptyGrid(gridItems)) {
      this.addValidationError('❌ No grid items found on the page');
      return false;
    }
    
    const validationResults = await this.validateAllGridItems(gridItems, products);
    this.logValidationSummary(validationResults);
    
    return this.allValidationsPassed(validationResults);
  }

  private async getGridItems() {
    const gridItems = this.page.locator(plansMapping.gridSelector);
    const itemCount = await gridItems.count();
    console.log(`Found ${itemCount} grid items to validate`);
    
    return Array.from({ length: itemCount }, (_, index) => gridItems.nth(index));
  }

  private isEmptyGrid(gridItems: any[]): boolean {
    return gridItems.length === 0;
  }

  private async validateAllGridItems(gridItems: any[], products: Product[]): Promise<boolean[]> {
    const validationResults: boolean[] = [];
    
    for (let index = 0; index < gridItems.length; index++) {
      const gridItem = gridItems[index];
      const gridText = await gridItem.textContent();
      const matchingProduct = ProductMatcher.findMatchingProduct(gridText, products);
      
      if (matchingProduct) {
        const isValid = await this.validateSingleGridItem(gridItem, matchingProduct, index + 1);
        validationResults.push(isValid);
      } else {
        this.addValidationError(`❌ No matching product found for grid item ${index + 1}`);
        validationResults.push(false);
      }
    }
    
    return validationResults;
  }

  private async validateSingleGridItem(gridItem: any, product: Product, gridIndex: number): Promise<boolean> {
    const expectedValues = DataFormatter.formatProductValues(product);
    
    console.log(`\n📋 Grid ${gridIndex}: ${product.name}`);
    console.log(`   Expected: ${expectedValues.price} ${product.price_currency} | ${expectedValues.dataPlan} | ${expectedValues.duration}`);
    
    const validationResults = await FieldValidator.validateAllProductFields(
      gridItem, 
      expectedValues, 
      gridIndex,
      this.addValidationError.bind(this)
    );
    
    const allFieldsValid = this.allValidationsPassed(validationResults);
    this.logGridValidationResult(gridIndex, allFieldsValid);
    
    return allFieldsValid;
  }

  private logGridValidationResult(gridIndex: number, isValid: boolean): void {
    if (isValid) {
      console.log(`   🎉 Grid ${gridIndex} validation passed`);
    } else {
      console.error(`   ❌ Grid ${gridIndex} validation failed`);
    }
  }

  private allValidationsPassed(results: boolean[]): boolean {
    return results.every(result => result);
  }

  private logValidationSummary(results: boolean[]): void {
    const passedCount = results.filter(result => result).length;
    const totalCount = results.length;
    
    if (passedCount === totalCount) {
      console.log('🎉 All grid validations passed successfully!');
    } else {
      console.error(`❌ Grid validation failed: ${passedCount}/${totalCount} passed`);
      this.validationErrors.forEach(error => console.error(error));
    }
  }

  private addValidationError(error: string): void {
    this.validationErrors.push(error);
  }

  getValidationErrors(): string[] {
    return [...this.validationErrors];
  }
} 