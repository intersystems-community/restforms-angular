import {DataService, ENDPOINTS, IFormData, IFormDataEx, IObjectModel} from '../services/data.service';
import {HeaderService} from '../services/header.service';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {ObjectsListComponent} from '../components/screens/objects-list/objects-list.component';
import {ModalService} from '../services/modal.service';

/**
 * Column defenition
 */
export interface IColumnInfo {
    name: string;
    data: string;
}

export abstract class BaseListClass implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    title = '';
    dataSource = new MatTableDataSource<IFormData | IFormDataEx>();
    isLoading = false;
    isCreate = false;
    isSettings = false;

    objInfo: IObjectModel;

    backUrl = '';
    abstract columnsData: string[];
    abstract columnsTitle: string[];

    protected abstract endpoint: ENDPOINTS;
    params: { [key: string]: string };

    constructor(protected ds: DataService,
                private hs: HeaderService,
                private ms: ModalService,
                protected route: ActivatedRoute,
                protected router: Router) {
        this.hs.showHeader();
    }

    ngOnInit() {
        void this.requestData();
    }

    ngOnDestroy() {

    }

    async requestData() {
        this.isLoading = true;
        try {
            let url = this.endpoint as string;
            if (this.params) {
                url = this.replaceApiParams(url, this.params);
            }
            this.dataSource.data = await this.ds.get(url).toPromise();
            if (this.dataSource.data) {
                if ((this.dataSource.data as any).children) {
                    this.dataSource.data = (this.dataSource.data as any).children;
                }
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                // If the user changes the sort order, reset back to the first page.
                // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.isLoading = false;
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    goBack() {
        this.router.navigateByUrl(this.backUrl);
    }

    private replaceApiParams(url: string, params: { [key: string]: string }): string {
        Object.keys(params).forEach(p => {
            url = url.replace('{' + p + '}', params[p]);
        });
        return url;
    }

    onCreateClick() {
        void this.router.navigateByUrl(`/object/${this.params.class}/new`);
    }

    async onDeleteClick(row: any, $event: MouseEvent) {
        $event.stopPropagation();
        this.ms.show({
            title: 'Delete',
            message: `Do you really want to delete form: "${row[this.columnsData[0]]}"?`,
            buttons: [
                {
                    label: 'No',
                    autoClose: true
                },
                {
                    label: 'Yes',
                    default: true,
                    autoClose: true,
                    click: async () => {
                        await this.ds.deleteObject(this.params.class, row._id);
                        this.requestData();
                    }
                }
            ]
        });
    }

    abstract onRowClick(row: any, $event: MouseEvent);
}
