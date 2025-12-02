import { NgModule } from '@angular/core';
import { TrimStrTwo } from './trim-str2.pipe';
import { CouponType } from './coupon.pipe';
import { SubStrThree } from './sub-str3.pipe';
import { BdCurrencyFormatPipe } from './bd-currency-format.pipe';
import { EnterFocusDirective } from 'src/app/common/enter-focus.directive';

@NgModule({
  declarations: [TrimStrTwo, CouponType, SubStrThree, BdCurrencyFormatPipe, EnterFocusDirective],
  exports: [TrimStrTwo, CouponType, SubStrThree, BdCurrencyFormatPipe, EnterFocusDirective]
})
export class SharedPipeModule { }
