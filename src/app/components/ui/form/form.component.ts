import {Component, Input, OnInit} from '@angular/core';
import {IFieldInfo, IObjectList} from '../../../services/data.service';
import {MatDatepicker} from '@angular/material/datepicker';

enum FieldType {
    // Implemented
    String = '%Library.String',
    Date = '%Library.Date',
    Numeric = '%Library.Numeric',
    Integer = '%Library.Integer',
    TimeStamp = '%Library.TimeStamp',
    Form = 'form',

    // Not implemented
    Boolean = '%Library.Boolean',
    Array = 'array',
    Serial = 'serial'
}

// %Library.BigInt,
// %Library.SmallInt,
// %Library.TinyInt
// %Library.Decimal,
// %Library.Double,
// %Library.Float,
// %Library.Currency,
// %Library.VarString,
// %Library.Char
// %Library.DateTime,
// %Library.Time,
// %Library.PosixTime

class PropValidationState {
    prop: IFieldInfo;
    isValid = true;
    message = '';
    touched = false;

    constructor(prop: IFieldInfo) {
        this.prop = prop;
    }
}

@Component({
    selector: 'rf-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

    private int = new Intl.DateTimeFormat('en', {year: 'numeric', month: '2-digit', day: '2-digit'});
    private pickerOpening = false;

    @Input() properties: IFieldInfo[];
    @Input() data: any;
    @Input() relatedData: Map<string, IObjectList>;

    validation = new Map<string, PropValidationState>();
    FieldType = FieldType;

    constructor() {
    }

    ngOnInit() {
        // this.properties.forEach(p => p.required = 1);
        this.initPropValidation();
    }


    /**
     * Initializes validation state for all properties
     */
    private initPropValidation() {
        if (!this.properties) {
            return;
        }
        this.properties.forEach(p => {
            this.validation.set(p.name, new PropValidationState(p));
        });
    }

    getPropType(prop: IFieldInfo): FieldType {
        if (prop.category.toLowerCase() === 'datatype') {
           return prop.type as FieldType;
        }

        if (prop.category === 'form') {
            return prop.collection.toLowerCase() === 'array' ? FieldType.Array : FieldType.Form;
        }

        if (prop.category === 'serial') {
            return FieldType.Serial;
        }

        return FieldType.String;
    }

    openDatePicker(picker: MatDatepicker<any>, input: HTMLInputElement) {
        if (picker.opened) {
            return;
        }
        picker.open();
        if (input) {
            setTimeout(() => input.focus(), 0);
        }
    }

    // showDatePicker(picker: MatDatepicker<any>|NgxMatDatetimePicker<any>, inp: HTMLInputElement) {
    //     if (this.pickerOpening) {
    //         return;
    //     }
    //     this.pickerOpening = true;
    //     console.log('focus');
    //     picker.open();
    //     setTimeout(() => {
    //         inp.focus();
    //         this.pickerOpening = false;
    //     }, 100);
    // }

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
        this.validate(prop);
    }

    hidePicker(picker: MatDatepicker<any>) {
        // if (this.pickerOpening) {
        //     return;
        // }
        // console.log('blur');
        picker.opened = false;
    }

    dateFromString(s: string): Date {
        return new Date(s);
    }

    validateAll(): boolean {
        let valid = true;
        this.properties.forEach(p => {
            const v = this.validate(p);
            if (!v.isValid) {
                valid = false;
            }
        });
        return valid;
    }

    validate(prop: IFieldInfo): PropValidationState {
        const v = this.validation.get(prop.name);
        v.isValid = true;
        v.message = '';
        if (prop.required === 1) {
            if (!this.data[prop.name]) {
                v.isValid = false;
                v.message = 'This field is required';
            }
        } else {
            const value = this.data[v.prop.name];
            if (value === '' || value === undefined || value === null) {
                return v;
            }
        }
        const type = this.getPropType(prop);
        switch (type) {
            case FieldType.Integer: this.validateInteger(v); break;
            case FieldType.Numeric: this.validateNumeric(v); break;
            case FieldType.Date: this.validateDate(v); break;
            case FieldType.TimeStamp: this.validateDate(v, true); break;
        }
        return v;
    }

    private validateInteger(v: PropValidationState) {
        const value = this.data[v.prop.name];
        if (isNaN(+value) || !/^\d+$/.test(value)) {
            v.isValid = false;
            v.message = 'Please enter valid integer number';
        }
    }

    private validateNumeric(v: PropValidationState) {
        const value = this.data[v.prop.name];
        if (isNaN(+value) || !/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(value)) {
            v.isValid = false;
            v.message = 'Please enter valid number';
        }
    }

    private validateDate(v: PropValidationState, validateTime = false) {
        let value = this.data[v.prop.name];
        let time = '';
        if (validateTime) {
            time = value.split('T')[1]?.replace('Z', '').split('.')[0];
            value = value.split('T')[0];
        }
        if (!/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(value)) {
            v.isValid = false;
            v.message = 'Please enter a valid date in format "yyyy-mm-dd"';
        }

        if (validateTime) {
            if (!/^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/.test(time)) {
                v.isValid = false;
                v.message = 'Please enter a valid time in format "hh:mm:ss"';
            }
            // /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/
            // for 24-hour time, leading zeroes mandatory.
            //
            // /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/
            // for 24-hour time, leading zeroes optional.
            //
            // /^(?:1[0-2]|0[0-9]):[0-5][0-9]:[0-5][0-9]$/
            // for 12-hour time, leading zeroes mandatory.
            //
            // /^(?:1[0-2]|0?[0-9]):[0-5][0-9]:[0-5][0-9]$/
            // for 12-hour time, leading zeroes optional.
        }
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

    changeTimestamp(prop: IFieldInfo, inp: HTMLInputElement, inpTime: HTMLInputElement) {
        const date = inp.value;
        const time = inpTime.value;
        this.data[prop.name] = date + 'T' + time + 'Z';
    }

    // onSelectKeyEnter(event, idx: number) {
    //     event.stopImmediatePropagation();
    // }
}
