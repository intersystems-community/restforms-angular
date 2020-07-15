import {Input, OnInit} from '@angular/core';
import {DataService, IFieldInfo} from '../services/data.service';
import {ValidationService} from '../services/validation.service';

export abstract class BaseDataEditor implements OnInit {
    @Input() prop: IFieldInfo;
    preparedData: any;

    constructor(public vs: ValidationService,
                public ds: DataService) {
    }

    ngOnInit() {
        this.prepareData();
    }

    protected abstract prepareData();

    abstract getDataForSaving(): any;

    abstract validateAll(): boolean;

}
