import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService, ENDPOINTS, IFieldInfo, IObjectInfo, IObjectList} from '../../../services/data.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormComponent} from '../../ui/form/form.component';
import {ValidationService} from '../../../services/validation.service';
import {ErrorService} from '../../../services/error.service';


@Component({
    selector: 'rf-object-details',
    templateUrl: './object-details.component.html',
    styleUrls: ['./object-details.component.scss'],
})
export class ObjectDetailsComponent implements OnInit, OnDestroy {

    @ViewChild('form', {static: false}) form: FormComponent;

    // For loading spinner
    isLoading = false;
    // For spinner during saving
    isSaving = false;
    // Form information
    model: IObjectInfo;
    // Form data
    data: any;
    // Related forms data, stores all forms data if some fields has form type
    relatedData: { [key: string]: IObjectList } = {};
    // List of all clsses info for serial fields
    serialInfo: { [key: string]: IObjectInfo } = {};
    // Route params
    params: { [key: string]: string };

    private subOnRouteParam: Subscription;

    constructor(private ds: DataService,
                private router: Router,
                private cd: ChangeDetectorRef,
                private vs: ValidationService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.subOnRouteParam = this.route.params.subscribe(p => {
            this.params = {...p};
            void this.requestData();
        });
    }

    ngOnDestroy() {
        this.subOnRouteParam.unsubscribe();
    }

    /**
     * Navigates to previous screen
     */
    goBack() {
        // TODO: add do you want to dismiss changes dialog
        void this.router.navigateByUrl(`/form/${this.params.class}`);
    }

    /**
     * Request all needed data to display form details
     */
    async requestData(): Promise<any> {
        this.isLoading = true;
        return Promise.all([
            // Request form information
            this.ds.formInfo(this.params.class).then(d => {
                this.model = d;
                return this.requestRelatedFormsDataAndSerialClasses();
            }),
            // Request form data if not new
            this.params.id === 'new'
                ? (this.data = {}) && Promise.resolve()
                : this.ds.objectData(this.params.class, this.params.id).then(d => this.data = d)
        ]).finally(() => {
            this.vs.initialize();
            this.isLoading = false;
        });
    }

    loadRelatedDataAndSerialClasses(field: IFieldInfo, requested: string[]): Promise<any> {
        return new Promise((res, rej) => {
            const all = [];
            // Request data for form
            if (field.category.toLowerCase() === 'form') {
                if (requested.indexOf(field.type + 'D') === -1) {
                    requested.push(field.type + 'D');
                    // TODO: make separate call for 'all' and 'info' depending on jsonreference === 'ID'
                    const url = ENDPOINTS.OBJECTS_LIST.replace('{class}', field.type).replace('{query}', 'all');
                    const promise = this.ds
                        .get(url)
                        .toPromise()
                        .then(data => {
                            this.relatedData[field.type] = data?.children;
                        });
                    all.push(promise);
                }
            }
            // Request class info for serial
            if (field.category.toLowerCase() === 'serial' || field.category.toLowerCase() === 'form') {
                if (requested.indexOf(field.type + 'I') === -1) {
                    requested.push(field.type + 'I');
                    const url = ENDPOINTS.FORM_INFO.replace('{class}', field.type);
                    const promise = this.ds
                        .get(url)
                        .toPromise()
                        .then((data: IObjectInfo) => {
                            this.serialInfo[field.type] = data;
                            const promises = [];
                            data.fields.forEach(f => {
                                promises.push(this.loadRelatedDataAndSerialClasses(f, requested));
                            });
                            return Promise.all(promises);
                        });
                    all.push(promise);
                }
            }

            if (all.length) {
                Promise.all(all).then(res);
            } else {
                res();
            }
        });
    }

    /**
     * Requests all forms information if some fields has form type
     * also requests all class information for serial fields type
     */
    async requestRelatedFormsDataAndSerialClasses() {
        this.relatedData = {};
        this.serialInfo = {};
        const requested = [];
        const promises = [];

        // Iterate through all fields and request data if type of field is 'form' and it wasn't already requested
        this.model.fields.forEach(f => {
            const p = this.loadRelatedDataAndSerialClasses(f, requested);
            promises.push(p);
        });

        // If there is no promises - resolve immediately
        if (promises.length === 0) {
            return Promise.resolve();
        }

        return Promise.all(promises);
    }

    /**
     * Save form data
     */
    save() {
        if (!this.form.validateAll()) {
            return;
        }
        const data = this.form.getDataForSaving();
        // TODO: show success message
        this.isSaving = true;

        void this.ds.saveObject(this.params.class, this.params.id, data)
            .then(() => this.goBack())
            .finally(() => this.isSaving = false);
    }
}
