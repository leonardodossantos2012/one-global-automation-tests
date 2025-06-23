export class DataFormatter {
  private static readonly UNIT_MAPPING: Record<string, string> = {
    'DAYS': 'DAY',
    'HOURS': 'HOUR',
    'MINUTES': 'MINUTE'
  };

  static formatDataPlan(data: number, unit: string): string {
    return `${data} ${unit}`;
  }

  static formatDuration(duration: number, unit: string): string {
    const singularUnit = this.UNIT_MAPPING[unit] || unit;
    const pluralUnit = unit;
    
    const formattedUnit = duration === 1 ? singularUnit : pluralUnit;
    return `${duration} ${formattedUnit}`;
  }

  static formatProductValues(product: any): any {
    return {
      price: product.price.toString(),
      dataPlan: this.formatDataPlan(product.data, product.data_unit),
      duration: this.formatDuration(product.duration, product.duration_unit),
      planType: 'Data only'
    };
  }
} 