import { type Page } from '@playwright/test';
import { plansMapping } from '../page-objects/plans/plans.mapping';

export class DataInteractor {
  private readonly page: Page;
  private readonly MAX_DATA_ELEMENTS = 10;
  private readonly CLICK_TIMEOUT = 5000;
  private readonly CLICK_DELAY = 200;

  constructor(page: Page) {
    this.page = page;
  }

  async interactWithDataElements(): Promise<void> {
    console.log('🔍 Validating and clicking "Data" elements in grid...');
    
    await this.ensureGridExists();
    await this.waitForPageLoad();
    
    const dataElements = await this.getDataElements();
    await this.clickDataElements(dataElements);
  }

  private async ensureGridExists(): Promise<void> {
    const gridElement = this.page.locator(plansMapping.gridSelector);
    const gridExists = await gridElement.count();
    
    if (gridExists === 0) {
      throw new Error('Grid element not found on the page');
    }
    
    console.log('✅ Grid element found');
  }

  private async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Page fully loaded');
  }

  private async getDataElements(): Promise<any[]> {
    const dataElements = this.page.locator(plansMapping.gridDataSelector);
    const elementCount = await dataElements.count();
    
    console.log(`Found ${elementCount} "Data" elements in the grid`);
    
    const elementsToProcess = Math.min(elementCount, this.MAX_DATA_ELEMENTS);
    
    if (elementsToProcess === 0) {
      console.warn('⚠️ No "Data" elements found in grid');
      return [];
    }
    
    if (elementCount > this.MAX_DATA_ELEMENTS) {
      console.warn(`⚠️ Found ${elementCount} elements, limiting to first ${this.MAX_DATA_ELEMENTS} to avoid timeout`);
    }
    
    return Array.from({ length: elementsToProcess }, (_, index) => dataElements.nth(index));
  }

  private async clickDataElements(elements: any[]): Promise<void> {
    for (let index = 0; index < elements.length; index++) {
      await this.clickSingleDataElement(elements[index], index + 1, elements.length);
    }
    
    console.log(`🎉 Successfully processed ${elements.length} "Data" elements`);
  }

  private async clickSingleDataElement(element: any, elementIndex: number, totalElements: number): Promise<void> {
    console.log(`Clicking "Data" element ${elementIndex} of ${totalElements}`);
    
    try {
      await element.click({ timeout: this.CLICK_TIMEOUT });
      console.log(`✅ Successfully clicked "Data" element ${elementIndex}`);
      await this.page.waitForTimeout(this.CLICK_DELAY);
    } catch (error) {
      console.error(`❌ Failed to click "Data" element ${elementIndex}:`, error);
    }
  }
} 