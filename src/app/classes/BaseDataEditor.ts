import {Input, OnInit} from '@angular/core';
import {IFieldInfo} from '../services/data.service';
import {ValidationService} from '../services/validation.service';

export abstract class BaseDataEditor implements OnInit {
    @Input() prop: IFieldInfo;
    preparedData: any;

    constructor(public vs: ValidationService) {}


    ngOnInit() {
        this.prepareData();
    }

    protected abstract prepareData();

    abstract getDataForSaving(): any;

    abstract validateAll(): boolean;

}
