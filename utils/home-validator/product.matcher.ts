import { Product } from './types';
import { DataFormatter } from './formatter';

export class ProductMatcher {
  static findMatchingProduct(gridText: string | null, products: Product[]): Product | null {
    if (!gridText) return null;
    
    return products.find(product => this.isProductMatchingGrid(product, gridText)) || null;
  }

  private static isProductMatchingGrid(product: Product, gridText: string): boolean {
    if (!this.hasValidProductData(product)) return false;
    
    const expectedPrice = product.price.toString();
    const expectedDataPlan = DataFormatter.formatDataPlan(product.data, product.data_unit);
    
    return gridText.includes(expectedPrice) && gridText.includes(expectedDataPlan);
  }

  private static hasValidProductData(product: Product): boolean {
    return Boolean(product?.price && product?.data);
  }
} 