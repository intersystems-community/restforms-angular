import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
    selector: '[rfFocusNext]'
})
export class FocusNextDirective {

    @Input('rfFocusNext') next: string;
    @Output('onFocusNext') onFocusNext = new EventEmitter<any>();

    constructor(private el: ElementRef) {
    }

    @HostListener('keydown.enter', ['$event'])
    onReturnPressed(e: KeyboardEvent) {
        e.preventDefault();
        let focusEl = document.getElementById(this.next);
        if (focusEl?.tagName === 'NG-SELECT') {
            focusEl = focusEl.getElementsByTagName('input')[0];
        }

        if (focusEl) {
            focusEl.focus();
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }

}
