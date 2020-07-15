import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {IObjectModel, IObjectList, DataService, PRIMITIVE_TYPES, FieldType} from '../../../services/data.service';
import {BaseDataEditor} from '../../../classes/BaseDataEditor';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ValidationService} from '../../../services/validation.service';

interface IArrayData {
    key: string;
    data: object;
}

const KEY_PREFIX = 'Key';

@Component({
    selector: 'rf-array',
    templateUrl: './array.component.html',
    styleUrls: ['./array.component.scss']
})
export class ArrayComponent extends BaseDataEditor implements OnInit {
    @Input() data: { [key: string]: any };

    preparedData: IArrayData[];
    trackByFn = (i: number, data: IArrayData) => i;

    constructor(public vs: ValidationService, public ds: DataService) {
        super(vs, ds);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * Reordering drop handler
     */
    onReorderDrop(e: CdkDragDrop<any[]>) {
        moveItemInArray(this.preparedData, e.previousIndex, e.currentIndex);
    }

    /**
     * Prepares data. From Key-Value to array
     */
    protected prepareData() {
        this.preparedData = [];
        const keys = Object.keys(this.data);
        keys.forEach(key => {
            this.preparedData.push({key, data: this.data[key]});
        });
    }

    /**
     * Returns data for saving from Array to Key-Value
     */
    getDataForSaving(): any {
        const result = {}; // JSON.parse(JSON.stringify(this.data));
        // Delete all non exists keys
        // Object.keys(result).forEach(key => {
        //     const exists = this.preparedData.some(el => el.key === key);
        //     if (!exists) {
        //         delete result[key];
        //     }
        // });

        // Convert array to object key->value
        this.preparedData.forEach(v => {
            let value: any = v.data;

            // Convert primitives to exact type
            if (this.prop.category === 'datatype') {
                const type = this.ds.getSimpleType(this.prop.type);
                switch (type) {
                    case FieldType.Integer:
                        value = parseInt(value, 10);
                        break;
                    case FieldType.Numeric:
                        value = parseFloat(value);
                        break;
                }
            }

            result[v.key] = value;

            // Delete ID because can't be handled by restforms2 services
            if (result[v.key] && typeof result[v.key] === 'object') {
                delete result[v.key].ID;
            }
        });
        console.log(result);
        return result;
    }

    /**
     * Generates new key for array
     */
    private getEmptyKey(): string {
        if (this.data[''] === undefined) {
            return '';
        }
        let n = 1;
        while (this.data[`${KEY_PREFIX} ${n}`] !== undefined) {
            n++;
        }
        return `${KEY_PREFIX} ${n}`;
    }

    /**
     * Add button clikck
     */
    onAddClick() {
        this.preparedData.push({key: '', data: undefined});
    }

    /**
     * Validates array
     */
    validateAll(): boolean {
        const arr = this.getDataForSaving();
        const v = this.vs.get(this.prop);
        if (!v) {
            console.warn(`Can't find validator for array: `, this.prop);
            return;
        }
        v.isValid = true;
        if (v.prop.jsonreference === 'ID') {
            // TODO: implement
        } else {
            if (arr) {
                for (const p in arr) {
                    if (!arr.hasOwnProperty(p)) {
                        continue;
                    }
                    if (p === '') {
                        v.isValid = false;
                        v.message = 'Please enter valid "Key"';
                        v.index = p;
                        return false;
                    }
                    // Check if this is array with primitive values
                    if (this.prop.category === 'datatype') {
                        // Check if value is entred
                        if (arr[p] === undefined) {
                            v.isValid = false;
                            v.message = `Please enter value form for key "${p}"`;
                            v.index = p + 'select';
                            return;
                        }

                        // Check for valid value type
                        this.vs.validateValue(this.ds.getSimpleType(this.prop.type), v, arr[p]);
                        if (!v.isValid) {
                            v.index = p;
                            return false;
                        }
                    } else {
                        // Check if object was selected
                        if (!arr[p] || Object.keys(arr[p]).length === 0) {
                            v.isValid = false;
                            v.message = `Please select form for key "${p}"`;
                            v.index = p + 'select';
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    /**
     * Delete button click handler
     */
    delete(idx: number) {
        this.preparedData.splice(idx, 1);
        // this.preparedData = [...this.preparedData];
    }
}
