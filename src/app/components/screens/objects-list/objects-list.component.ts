import {Component, OnDestroy, OnInit} from '@angular/core';
import {ENDPOINTS} from '../../../services/data.service';
import {BaseListClass} from '../../../classes/base-list.class';
import {Subscription} from 'rxjs';

@Component({
    selector: 'rf-objects-list',
    templateUrl: './../forms-list/forms-list.component.html',
    styleUrls: ['./../forms-list/forms-list.component.scss']
})
export class ObjectsListComponent extends BaseListClass implements OnDestroy, OnInit {
    title = '';
    columnsData = ['displayName', 'actions'];
    columnsTitle = ['Name', ''];
    backUrl = '/';
    isCreate = true;
    isSettings = false;

    private subOnRouteParam: Subscription;
    protected endpoint = ENDPOINTS.OBJECTS_LIST;

    ngOnInit() {
        this.subOnRouteParam = this.route.params.subscribe(p => {
            this.params = {...p};
            this.params.query = 'info';
            void this.requestData();
        });
    }

    ngOnDestroy() {
        this.subOnRouteParam.unsubscribe();
        super.ngOnDestroy();
    }

    /**
     * Request all data
     */
    async requestData(): Promise<any> {
        return Promise.all([
            this.ds.formInfo(this.params.class).then(d => this.objInfo = d),
            super.requestData()
        ]).then(() => {
            this.addExtraColumns();
        });
    }

    /**
     * Add extra columns if exists in response (ignoring dysplayName and _id)
     */
    private addExtraColumns() {
        const d = this.dataSource.data;
        if (d?.length) {
            const keys = Object.keys(d[0]);
            keys.forEach(k => {
                if (k === '_id' || k === 'displayName') {
                    return;
                }
                this.columnsData.splice(1, 0, k);
                const field = this.objInfo.fields.find(f => f.name === k);
                if (field) {
                    this.columnsTitle.splice(1, 0, field.displayName);
                } else {
                    this.columnsTitle.splice(1, 0, k);
                }
            });
        }
    }

    /**
     * Row click event handler
     */
    onRowClick(row: any, e: MouseEvent) {
        const id = encodeURIComponent(row._id);
        void this.router.navigateByUrl(`/object/${this.params.class}/${id}`);
    }
}
