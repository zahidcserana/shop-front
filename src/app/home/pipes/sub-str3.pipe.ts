import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'substr3' })
export class SubStrThree implements PipeTransform {
    transform(str: string): string {
        const strLength = str.length;
        let takeFirst1 = str.substring(0, 3);
        return takeFirst1;
    }
}