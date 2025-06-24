import { APIRequestContext } from '@playwright/test';

/**
 * Product API Response Interfaces
 * 
 * Defines the structure for the /v1/products API endpoint
 */

export interface Product {
  id: string;
  name: string;
  type: string;
  footprint_code: string;
  duration: number;
  duration_unit: 'DAYS' | 'HOURS' | 'MINUTES';
  price: number;
  price_currency: string;
  data: number;
  data_raw: number;
  data_unit: 'GB' | 'MB' | 'KB';
  footprint: string[];
  source_price: number;
  source_currency: string;
  fx_rate: number;
}

export interface ProductsApiResponse {
  products: Product[];
  availableCountries: string[];
}

/**
 * API Request Functions
 * 
 * Provides functions to fetch products data from the API
 */

export class ProductsApi {
  private static readonly defaultBaseUrl = process.env.API_URL || '';
  private static readonly productsEndpoint = '/v1/products/default/';

  /**
   * Fetch products from the API with specified currency and base URL
   * @param request - Playwright API request context
   * @param currency - Currency code (e.g., 'EUR', 'USD')
   * @returns Promise<ProductsApiResponse>
   */
  static async getProducts(
    request: APIRequestContext, 
    currency: string = process.env.CURRENCY || 'EUR'
  ): Promise<ProductsApiResponse> {
    const apiBaseUrl = this.defaultBaseUrl;
    const url = `${apiBaseUrl}${this.productsEndpoint}?currency=${currency}`;
    const response = await request.get(url);
    
    if (!response.ok()) {
      throw new Error(`Failed to fetch products: ${response.status()} ${response.statusText()}`);
    }
    
    return await response.json();
  }

  /**
   * Get products filtered by currency
   * @param request - Playwright API request context
   * @param baseUrl - Base URL for the API (optional)
   * @param currency - Currency code
   * @returns Promise<Product[]>
   */
  static async getProductsByCurrency(
    request: APIRequestContext,
    currency: string = process.env.CURRENCY || 'EUR',
    id: string = process.env.ID || ''
  ): Promise<Product | null> {
    const data = await this.getProducts(request, currency);
    for (const product of data.products) {
      if (product.id === id) {
        return product;
      }
    }
    return null;
  }
}
