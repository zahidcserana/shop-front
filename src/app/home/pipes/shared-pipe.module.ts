import { NgModule } from '@angular/core';
import { TrimStrTwo } from './trim-str2.pipe';
import { CouponType } from './coupon.pipe';
import { SubStrThree } from './sub-str3.pipe';
import { BdCurrencyFormatPipe } from './bd-currency-format.pipe';

@NgModule({
  declarations: [TrimStrTwo, CouponType, SubStrThree, BdCurrencyFormatPipe],
  exports: [TrimStrTwo, CouponType, SubStrThree, BdCurrencyFormatPipe]
})
export class SharedPipeModule { }
