import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[enterFocus]'
})
export class EnterFocusDirective {

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const form = target.closest('table') || document;

    const focusable = Array.from(
      form.querySelectorAll<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      )
    );

    const index = focusable.indexOf(target);
    if (index > -1 && index < focusable.length - 1) {
      focusable[index + 1].focus();
    }
  }
}
