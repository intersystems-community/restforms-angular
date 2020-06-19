import {Component} from '@angular/core';
import {ENDPOINTS} from '../../../services/data.service';
import {BaseListClass} from '../../../classes/base-list.class';
import {Subscription} from 'rxjs';

@Component({
    selector: 'rf-objects-list',
    templateUrl: './../forms-list/forms-list.component.html',
    styleUrls: ['./../forms-list/forms-list.component.scss']
})
export class ObjectsListComponent extends BaseListClass{
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

    async requestData(): Promise<any> {
        return Promise.all([
            this.ds.formInfo(this.params.class).then(d => this.objInfo = d),
            super.requestData()
        ]);
    }

    onRowClick(row: any, e: MouseEvent) {
        void this.router.navigateByUrl(`/object/${this.params.class}/${row._id}`);
    }
}
