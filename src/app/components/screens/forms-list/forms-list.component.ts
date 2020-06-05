import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataService, IFormData} from '../../../services/data.service';
import {MatTableDataSource} from '@angular/material/table';
import {HeaderService} from '../../../services/header.service';

@Component({
    selector: 'rf-forms-list',
    templateUrl: './forms-list.component.html',
    styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit {
    displayedColumns: string[] = ['name', 'class'];
    dataSource = new MatTableDataSource<IFormData>();
    isLoading = false;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private ds: DataService,
                private hs: HeaderService) {
        this.hs.showHeader();
    }

    ngOnInit(): void {
        this.requestData();
    }

    async requestData() {
        this.isLoading = true;
        try {
            this.dataSource.data = await this.ds.getForms();
            for (let i = 0; i < 3; i++) {
                this.dataSource.data = [...this.dataSource.data, ...this.dataSource.data ];
            }
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // If the user changes the sort order, reset back to the first page.
            // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

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
}
