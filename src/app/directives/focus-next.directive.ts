import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[rfFocusNext]'
})
export class FocusNextDirective {

    constructor(private el: ElementRef) {
    }

    @HostListener('keydown.enter',  ['$event'])
    onReturnPressed(e: KeyboardEvent) {
        e.preventDefault();
        const focusEl = document.getElementById(this.el.nativeElement.attributes.rfFocusNext.value);
        if (focusEl) {
            focusEl.focus();
        }
    }

}
