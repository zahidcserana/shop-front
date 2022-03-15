import { NgModule } from '@angular/core';
import { TrimStrTwo } from './trim-str2.pipe';
import { CouponType } from './coupon.pipe';
import { SubStrThree } from './sub-str3.pipe';

@NgModule({
  declarations: [TrimStrTwo, CouponType, SubStrThree],
  exports: [TrimStrTwo, CouponType, SubStrThree]
})
export class SharedPipeModule { }
