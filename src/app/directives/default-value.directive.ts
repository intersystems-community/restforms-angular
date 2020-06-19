import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[rfDefaultValue]'
})
export class DefaultValueDirective implements OnInit {

    @Input('rfDefaultValue') defaultValue: string;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        (this.el.nativeElement as HTMLInputElement).value = this.defaultValue;
    }
}
