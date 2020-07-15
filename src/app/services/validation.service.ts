import {Injectable} from '@angular/core';
import {FieldType, IFieldInfo} from './data.service';
import {FormComponent} from '../components/ui/form/form.component';

declare const BigInt: any;

export class PropValidationState {
    prop: IFieldInfo;
    isValid = true;
    message = '';
    index = '';
    data: any;

    constructor(prop: IFieldInfo, data: any) {
        this.prop = prop;
        this.data = data;
    }
}

@Injectable({
    providedIn: 'root'
})
export class ValidationService {
    private data = new Map<IFieldInfo, PropValidationState>();

    constructor() {
    }

    /**
     * Initializes validation state
     */
    initialize() {
        this.data = new Map<IFieldInfo, PropValidationState>();
    }

    /**
     * Adds properties to validation
     */
    addProperties(props: IFieldInfo[], data: any) {
        if (!props) {
            return;
        }
        props.forEach(p => {
            this.data.set(p, new PropValidationState(p, data));
        });
    }

    /**
     * Returns validation for prop
     */
    get(prop: IFieldInfo): PropValidationState {
        return this.data.get(prop);
    }

    /**
     * Validate single field
     */
    validate(prop: IFieldInfo): PropValidationState {
        const v = this.data.get(prop);
        if (!v) {
            console.warn(`Can't find validator for array: `, prop);
            return;
        }
        v.isValid = true;
        v.message = '';
        if (prop.required === 1) {
            if (!v.data[prop.name]) {
                v.isValid = false;
                v.message = 'This field is required';
            }
        } else {
            const value = v.data[v.prop.name];
            if (value === '' || value === undefined || value === null) {
                return v;
            }
        }
        this.validateValue(prop.rfType, v, v.data[v.prop.name]);
        return v;
    }

    /**
     * Validates value
     */
    validateValue(type: FieldType, v: PropValidationState, value: any) {
        switch (type) {
            case FieldType.Integer:
                this.validateInteger(v, value);
                break;
            case FieldType.Numeric:
                this.validateNumeric(v, value);
                break;
            case FieldType.Date:
                this.validateDate(v, false, value);
                break;
            case FieldType.TimeStamp:
                this.validateDate(v, true, value);
                break;
            case FieldType.Time:
                this.validateTime(v, value);
                break;
        }
    }

    /**
     * Validates integer field
     */
    private validateInteger(v: PropValidationState, value: any) {
        try {
            const v = BigInt(value);
        } catch (e) {
            v.isValid = false;
            v.message = 'Please enter valid integer number';
        }
    }

    /**
     * Validates number field
     */
    private validateNumeric(v: PropValidationState, value: any) {
        if (isNaN(+value) || !/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(value)) {
            v.isValid = false;
            v.message = 'Please enter valid number';
        }
    }

    /**
     * Validates date field
     */
    private validateDate(v: PropValidationState, validateTime = false, value: any) {
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
     * Validation for time field
     */
    private validateTime(v: PropValidationState, time: any) {
        let t = time;
        if (v.prop.type === '%Library.PosixTime') {
            t = FormComponent.getTimeFromPosixTime(t);
        } else {
            t = t.replace('Z', '');
        }
        if (!/^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/.test(t)) {
            v.isValid = false;
            v.message = 'Please enter a valid time in format "hh:mm:ss"';
        }
    }
}
