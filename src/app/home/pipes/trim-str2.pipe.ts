import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'trimStr2' })
export class TrimStrTwo implements PipeTransform {
    transform(str: string): string {
        const strLength = str.length;
        let takeFirst1 = str.substring(0, 10);
        if (strLength > 10) {
            takeFirst1 = takeFirst1.concat('...');
        }
        return takeFirst1;
    }
}