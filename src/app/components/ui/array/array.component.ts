import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {IObjectInfo, IObjectList} from '../../../services/data.service';
import {BaseDataEditor} from '../../../classes/BaseDataEditor';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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
    @Input() relatedData: Map<string, IObjectList>;
    @Input() serialInfo: Map<string, IObjectInfo>;

    preparedData: IArrayData[];
    trackByFn = (i: number, data: IArrayData) => i;

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
        const result = JSON.parse(JSON.stringify(this.data));
        this.preparedData.forEach(v => {
            result[v.key] = v.data;
            // Delete ID because can't be handled by restforms2 services
            delete result[v.key].ID;
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
            console.warn(`Can;t find validator for array: `, this.prop);
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
                    if (!arr[p] || Object.keys(arr[p]).length === 0) {
                        v.isValid = false;
                        v.message = `Please select form for key "${p}"`;
                        v.index = p + 'select';
                        return false;
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
