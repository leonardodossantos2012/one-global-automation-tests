import { expect } from '@playwright/test';
import { ExpectedProductValues } from './types';

export class FieldValidator {
  static async validateAllProductFields(
    gridItem: any, 
    expectedValues: ExpectedProductValues, 
    gridIndex: number,
    errorCollector: (error: string) => void
  ): Promise<boolean[]> {
    const validations = [
      this.validateField(gridItem, expectedValues.price, 'Price', gridIndex, errorCollector),
      this.validateField(gridItem, expectedValues.dataPlan, 'Data plan', gridIndex, errorCollector),
      this.validateField(gridItem, expectedValues.duration, 'Duration', gridIndex, errorCollector),
      this.validateField(gridItem, expectedValues.planType, 'Plan Type', gridIndex, errorCollector)
    ];
    
    return Promise.all(validations);
  }

  private static async validateField(
    gridItem: any, 
    expectedValue: string, 
    fieldName: string, 
    gridIndex: number,
    errorCollector: (error: string) => void
  ): Promise<boolean> {
    try {
      await expect(gridItem.getByText(expectedValue, { exact: false }).first()).toBeVisible();
      console.log(`   ✅ ${fieldName} "${expectedValue}" validation passed`);
      return true;
    } catch (error) {
      const errorMessage = `   ❌ ${fieldName} "${expectedValue}" not found in grid ${gridIndex}`;
      errorCollector(errorMessage);
      console.error(errorMessage);
      return false;
    }
  }
} 