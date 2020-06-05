import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[rfBlurOnEnter]'
})
export class BlurOnEnterDirective {

    constructor(private el: ElementRef) {
    }

    @HostListener('keydown.enter', ['$event'])
    onReturnPressed(e: KeyboardEvent) {
        e.preventDefault();
        this.el.nativeElement.blur();
    }

}
