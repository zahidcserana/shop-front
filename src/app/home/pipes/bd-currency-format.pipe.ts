import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bdCurrencyFormat'
})
export class BdCurrencyFormatPipe implements PipeTransform {
  transform(value: number | string, isSymboled=false, symbol: string = '৳'): string {
    if (value === null || value === undefined) return '';

    let [integerPart, decimalPart] = value.toString().split('.');

    // Add commas for Indian/Bangladeshi number system
    let lastThree = integerPart.slice(-3);
    let otherNumbers = integerPart.slice(0, -3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }

    const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    const formattedDecimal = decimalPart ? '.' + decimalPart : '';

    if (isSymboled)
      return `${formattedInteger}${formattedDecimal} ${symbol}`;
    return `${formattedInteger}${formattedDecimal}`;
  }
}
