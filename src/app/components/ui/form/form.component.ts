import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DataService, FieldType, IFieldInfo} from '../../../services/data.service';
import {MatDatepicker} from '@angular/material/datepicker';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BaseDataEditor} from '../../../classes/BaseDataEditor';
import {ValidationService} from '../../../services/validation.service';

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

    FieldType = FieldType;

    formClosed: { [propName: string]: boolean } = {};
    compareObjects: any;

    constructor(public vs: ValidationService, public ds: DataService) {
        super(vs, ds);
        this.compareObjects = (a, b) => {
            return this.isEqual(a, b);
        };
    }

    /**
     * Returns time as string from posix time
     */
    static getTimeFromPosixTime(ptime: number): string {
        const date = new Date(ptime * 1000);
        const hours = date.getHours();
        const minutes = '0' + date.getMinutes();
        const seconds = '0' + date.getSeconds();
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    ngOnInit() {
        super.ngOnInit();
        this.createEmptyObjectsForSerialFields();
        this.initPropValidation();
    }

    protected prepareData() {
    }

    /**
     * Creates empty objects for serial fields
     * to be able to bind data
     * This is needed because data on server for this field
     * can be undefined
     */
    private createEmptyObjectsForSerialFields() {
        this.properties.forEach(p => {
            if (p.category !== 'serial' && p.rfType !== FieldType.Array) {
                return;
            }
            // Check if we have object in data for this serial
            if (this.data && !this.data[p.name]) {
                this.data[p.name] = {};
            }
        });
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
        this.vs.addProperties(this.properties, this.data);
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
        // if (v.indexOf('T') === -1) {
        //     v += 'T00:00:00Z';
        // }
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
    getTimeFromDatetime(date: string): string {
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
        return prop?.category === 'serial' || prop.rfType === FieldType.Array;
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

    /**
     * Returns time for time field
     */
    getTime(prop: IFieldInfo) {
        const value = this.data[prop.name];
        if (!value) {
            return '';
        }
        if (prop.type === '%Library.PosixTime') {
            return FormComponent.getTimeFromPosixTime(value);
        } else {
            return value.replace('Z', '');
        }
    }

    public getPosixTimeFromTime(time: string, originalValue: number): number {
        const parts = time.split(':');
        if (parts.length !== 3) {
            return 0;
        }
        let d = new Date(1970, 0, 1);
        if (originalValue) {
            d = new Date(originalValue * 1000);
        }
        d.setHours(parseInt(parts[0], 10));
        d.setMinutes(parseInt(parts[1], 10));
        d.setSeconds(parseInt(parts[2], 10));
        return Date.parse(d as any) / 1000;
    }

    /**
     * Change time in model during input in field
     */
    changeTime(prop: IFieldInfo, inpTime: HTMLInputElement) {
        if (prop.type === '%Library.PosixTime') {
            this.data[prop.name] = this.getPosixTimeFromTime(inpTime.value, this.data[prop.name]);
        } else {
            this.data[prop.name] = inpTime.value + 'Z';
        }
    }
}
