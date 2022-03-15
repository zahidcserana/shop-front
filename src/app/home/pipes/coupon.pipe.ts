import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'couponType' })
export class CouponType implements PipeTransform {
    transform(str: string): string {
        if (str == '1MONTH') {
            return '30 days';
        } else if (str == '3MONTH') {
            return '90 days';
        } else if (str == '6MONTH') {
            return '180 days';
        } else if (str == '1YEAR') {
            return '360 days';
        }
        return '30 days';
    }
}