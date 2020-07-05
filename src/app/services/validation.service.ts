import {Injectable} from '@angular/core';
import {IFieldInfo} from './data.service';
import {FieldType} from '../components/ui/form/form.component';

export class PropValidationState {
    prop: IFieldInfo;
    isValid = true;
    message = '';
    index = '';

    constructor(prop: IFieldInfo) {
        this.prop = prop;
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
    addProperties(props: IFieldInfo[]) {
        if (!props) {
            return;
        }
        props.forEach(p => {
            this.data.set(p, new PropValidationState(p));
        });
    }

    /**
     * Returns validation for prop
     */
    get(prop: IFieldInfo): PropValidationState {
        return this.data.get(prop);
    }


    /**
     * Returns property type
     * TODO: move _type field of prop. Fill in form init
     */
    getPropType(prop: IFieldInfo): FieldType {
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
            switch (prop.collection) {
                case '':
                    return FieldType.Form;
                    break;
                case 'array': {
                    return prop.jsonreference === 'ID' ? FieldType.List : FieldType.Array;
                    break;
                }
                case 'list':
                    return FieldType.List;
                    break;
            }
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
            case FieldType.Integer:
                this.validateInteger(v);
                break;
            case FieldType.Numeric:
                this.validateNumeric(v);
                break;
            case FieldType.Date:
                this.validateDate(v);
                break;
            case FieldType.TimeStamp:
                this.validateDate(v, true);
                break;
            // case FieldType.Array:
            //     this.validateArray(v);
            //     break;
        }
        return v;
    }

    /**
     * Validates integer field
     */
    private validateInteger(v: PropValidationState) {
        const value = this.data[v.prop.name];
        if (isNaN(+value) || !/^\d+$/.test(value)) {
            v.isValid = false;
            v.message = 'Please enter valid integer number';
        }
    }

    /**
     * Validates number field
     */
    private validateNumeric(v: PropValidationState) {
        const value = this.data[v.prop.name];
        if (isNaN(+value) || !/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(value)) {
            v.isValid = false;
            v.message = 'Please enter valid number';
        }
    }

    /**
     * Validates date field
     */
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
}
