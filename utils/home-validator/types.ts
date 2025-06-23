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

export interface ExpectedProductValues {
  price: string;
  dataPlan: string;
  duration: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
} 