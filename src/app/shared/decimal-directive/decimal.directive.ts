import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDecimalOnly]'
})
export class DecimalDirective {
  private decimalRegEx = /^\d+\.?(\d{1,2})?$/;
  private allowedKeys: Array<string> = [
    'Enter', 'Backspace', 'Tab', 'Delete',
    'End', 'Home', 'ArrowLeft', 'ArrowRight',
  ];

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {

    if (this.allowedKeys.indexOf(event.key) !== -1) {
      return;
    }
    console.log('test');
    const current: string = this.el.nativeElement.value;
    /**
     * How to get selection index.
     * https://stackoverflow.com/questions/5001608/how-to-know-if-the-text-in-a-textbox-is-selected
     */

    const target = event.target as HTMLInputElement;
    const position = target['selectionStart'] as number;
    /**
     * How to concat string at index.
     * https://stackoverflow.com/questions/4364881/inserting-string-at-position-x-of-another-string
     */
    const next = [current.slice(0, position), event.key, current.slice(position)].join('');

    if (this.decimalRegEx.test(next)) {
      return;
    } else {
      event.preventDefault();
    }
  }

  /**
   * Onblur Event.
   * trim zero and dot from input value.
   */
  @HostListener('blur', ['$event']) onBlur(event: KeyboardEvent) {
    const value = this.el.nativeElement.value;
    if (value) {
      if (isNaN(Number(value))) {
        /**
         * Display invalid value to handle cases where users
         * right click paste
         */
        this.el.nativeElement.value = value;
      }
      else {
        this.el.nativeElement.value = parseFloat(this.el.nativeElement.value).toFixed(2);
      }
    }
  }
}