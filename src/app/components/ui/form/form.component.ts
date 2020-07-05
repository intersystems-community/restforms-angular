import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {IFieldInfo, IObjectInfo, IObjectList} from '../../../services/data.service';
import {MatDatepicker} from '@angular/material/datepicker';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BaseDataEditor} from '../../../classes/BaseDataEditor';
import {ValidationService} from '../../../services/validation.service';

export enum FieldType {
    // Implemented
    String = '%Library.String',
    VarString = '%Library.VarString',
    Date = '%Library.Date',
    Numeric = '%Library.Numeric',
    Integer = '%Library.Integer',
    TimeStamp = '%Library.TimeStamp',
    Boolean = '%Library.Boolean',
    Serial = 'serial',
    Form = 'form',

    // Not implemented
    List = 'list',
    Array = 'array'
}

// * %Library.BigInt,
// * %Library.SmallInt,
// * %Library.TinyInt
// * %Library.Decimal,
// * %Library.Double,
// * %Library.Float,
// * %Library.Currency,
// * %Library.VarString,
// * %Library.Char
// * %Library.DateTime,
// %Library.Time,
// %Library.PosixTime

@Component({
    selector: 'rf-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [trigger('slideToggle', [
        state('opened', style({
            height: '*',
            'padding-top': '*',
            'padding-bottom': '*',
            overflow: 'visible'
        })),
        state('closed', style({
            height: '0px',
            'padding-top': '0px',
            'padding-bottom': '0px',
            'margin-bottom': '10px',
            overflow: 'hidden'
        })),
        transition('opened <=> closed', animate('0.1s linear'))
    ])]
})
export class FormComponent extends BaseDataEditor implements OnInit {
    @ViewChildren('editor') private editors: QueryList<BaseDataEditor>;

    private int = new Intl.DateTimeFormat('en', {year: 'numeric', month: '2-digit', day: '2-digit'});
    private pickerOpening = false;

    @Input() properties: IFieldInfo[];
    @Input() data: any;
    @Input() relatedData: { [key: string]: IObjectList };
    @Input() serialInfo: { [key: string]: IObjectInfo };

    FieldType = FieldType;

    formClosed: { [propName: string]: boolean } = {};
    compareObjects: any;

    constructor(public vs: ValidationService) {
        super(vs);
        this.compareObjects = (a, b) => {
            return this.isEqual(a, b);
        };
    }

    ngOnInit() {
        super.ngOnInit();
        this.initPropValidation();
    }

    protected prepareData() {
    }

    /**
     * Gets data for saving from complex editors
     */
    getDataForSaving(): any {
        const result = JSON.parse(JSON.stringify(this.data));
        this.editors.toArray().forEach((e: BaseDataEditor) => {
            result[e.prop.name] = e.getDataForSaving();
        });
        return result;
    }

    /**
     * Initializes validation state for all properties
     */
    private initPropValidation() {
        this.vs.addProperties(this.properties);
    }

    /**
     * Returns property type
     */
    getPropType(prop: IFieldInfo): FieldType {
        switch (prop.collection) {
            case 'array': {
                return prop.jsonreference === 'ID' ? FieldType.List : FieldType.Array;
                break;
            }
            case 'list':
                return FieldType.List;
                break;
        }

        if (prop.category.toLowerCase() === 'datatype') {
            switch (prop.type) {
                case '%Library.Char':
                    return FieldType.String;
                    break;
                case '%Library.DateTime':
                    return FieldType.TimeStamp;
                    break;
                case '%Library.BigInt':
                case '%Library.SmallInt':
                case '%Library.TinyInt':
                    return FieldType.Integer;
                    break;
                case '%Library.Decimal':
                case '%Library.Double':
                case '%Library.Float':
                case '%Library.Currency':
                    return FieldType.Numeric;
                    break;
            }
            return prop.type as FieldType;
        }

        if (prop.category === 'form') {
            return FieldType.Form;
        }

        if (prop.category === 'serial') {
            // Check if we have object in data for this serial
            // TODO: make it during data loading
            if (!this.data[prop.name]) {
                this.data[prop.name] = {};
            }
            return FieldType.Serial;
        }

        return FieldType.String;
    }

    /**
     * Opens date picker
     */
    openDatePicker(picker: MatDatepicker<any>, input: HTMLInputElement) {
        if (picker.opened) {
            return;
        }
        picker.open();
        if (input) {
            setTimeout(() => input.focus(), 0);
        }
    }

    /**
     * Date changing callback
     */
    onDateChange(prop: IFieldInfo, value: any, saveTime = false) {
        const [{value: month}, , {value: day}, , {value: year}] = this.int.formatToParts(value);
        let v = `${year}-${month}-${day}`;
        if (saveTime && this.data[prop.name]) {
            const time = this.data[prop.name].split('T')[1];
            if (time) {
                v += 'T' + time;
            }
        }

        this.data[prop.name] = v;
        this.vs.validate(prop);
    }

    /**
     * Hides date picker
     */
    hidePicker(picker: MatDatepicker<any>) {
        picker.opened = false;
    }

    /**
     * Returns date from string
     */
    dateFromString(s: string): Date {
        return new Date(s);
    }

    /**
     * Validate all controls
     */
    validateAll(): boolean {
        let valid = true;
        this.properties.forEach(p => {
            const v = this.vs.validate(p);
            if (!v.isValid) {
                valid = false;
            }
        });

        // Validate complex editors
        this.editors.toArray().forEach((e: BaseDataEditor) => {
            const isValid = e.validateAll();
            if (!isValid) {
                valid = false;
            }
        });

        return valid;
    }


    /**
     * Returns time part of date string
     */
    getTime(date: string): string {
        if (!date) {
            return '';
        }
        const d = new Date(date);
        if (d instanceof Date && !isNaN(d as any)) {
            return d.toISOString().substr(11, 8);
        }

        return '';
    }

    /**
     * Changes time for datetime field. Used after date selection to save previous time
     */
    changeTimestamp(prop: IFieldInfo, inp: HTMLInputElement, inpTime: HTMLInputElement) {
        const date = inp.value;
        const time = inpTime.value;
        this.data[prop.name] = date + 'T' + time + 'Z';
    }

    /**
     * If property expandable or not
     */
    isExpandable(prop: IFieldInfo): boolean {
        return prop?.category === 'serial' || this.getPropType(prop) === FieldType.Array;
    }

    /**
     * Track by function for properties ngFor
     */
    propTrackBy(index: number, prop: IFieldInfo) {
        return prop.name;
    }

    /**
     * Compare items for ng-select with objects
     */
    private _compareObjects(a: any, b: any) {
        if (typeof a === 'object') {
            return this.isObjectIncludesAllFieldsWithValues(a, b);
        } else {
            return a === b;
        }
    }

    /**
     * Checks if object A include all fields from object B with same values
     */
    private isObjectIncludesAllFieldsWithValues(a: any, b: any): boolean {
        for (const p in b) {
            if (!b.hasOwnProperty(p)) {
                continue;
            }
            if (!a.hasOwnProperty(p)) {
                return false;
            }
            const equal = this.isEqual(a[p], b[p]);
            if (!equal) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if arrays are equal
     */
    private isArraysEqual(a: any[], b: any[]): boolean {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            const equal = this.isEqual(a[i], b[i]);
            if (!equal) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if two objects are equal
     */
    private isEqual(a: any, b: any): boolean {
        if (Array.isArray(a)) {
            return this.isArraysEqual(a, b);
        }
        if (typeof a === 'object') {
            return this.isObjectIncludesAllFieldsWithValues(a, b);
        }
        return a === b;
    }
}
