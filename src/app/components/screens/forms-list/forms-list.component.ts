import {Component} from '@angular/core';
import {ENDPOINTS} from '../../../services/data.service';
import {BaseListClass, IColumnInfo} from '../../../classes/base-list.class';

@Component({
    selector: 'rf-forms-list',
    templateUrl: './forms-list.component.html',
    styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent extends BaseListClass {
    title = 'Forms';
    columnsData = ['name', 'class'];
    columnsTitle = ['Name', 'Class'];

    protected endpoint = ENDPOINTS.FORMS_LIST;

    onRowClick(row: any, e: MouseEvent) {
        void this.router.navigateByUrl(`/form/${row.class}`);
    }
}
