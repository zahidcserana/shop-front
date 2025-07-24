import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bdCurrencyFormat'
})
export class BdCurrencyFormatPipe implements PipeTransform {
  transform(value: number | string, isSymboled = false, symbol: string = '৳'): string {
    if (value === null || value === undefined) return '';

    const num = parseFloat(value.toString());
    if (isNaN(num)) return '';

    // Ensure two decimal places
    const fixedValue = num.toFixed(2);
    let [integerPart, decimalPart] = fixedValue.split('.');

    // Add commas for Indian/Bangladeshi number system
    let lastThree = integerPart.slice(-3);
    let otherNumbers = integerPart.slice(0, -3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }

    const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    const formattedDecimal = '.' + decimalPart; // Always present due to .toFixed(2)

    if (isSymboled)
      return `${formattedInteger}${formattedDecimal} ${symbol}`;
    return `${formattedInteger}${formattedDecimal}`;
  }
}
