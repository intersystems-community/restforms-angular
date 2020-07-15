import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService, ENDPOINTS, IFieldInfo, IObjectModel, IObjectList} from '../../../services/data.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormComponent} from '../../ui/form/form.component';
import {ValidationService} from '../../../services/validation.service';
import {ErrorService} from '../../../services/error.service';
import {ModalService} from '../../../services/modal.service';


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
    // Route params
    params: { [key: string]: string };

    private subOnRouteParam: Subscription;

    constructor(public ds: DataService,
                private router: Router,
                private cd: ChangeDetectorRef,
                private vs: ValidationService,
                private ms: ModalService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.subOnRouteParam = this.route.params.subscribe(async p => {
            this.params = {...p};
            this.isLoading = true;
            await this.ds.getObjectDetails(p.class, p.id);
            this.vs.initialize();
            this.isLoading = false;
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
     * Save form data
     */
    save() {
        if (!this.form.validateAll()) {
            setTimeout(() => {
                const firstError = document.querySelector<any>('span.error:not([hidden])');
                if (firstError) {
                    firstError.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }, 0);
            return;
        }
        const data = this.form.getDataForSaving();
        this.isSaving = true;

        void this.ds.saveObject(this.params.class, this.params.id, data)
            .then(() => {
                this.ms.show({
                    title: 'Done!',
                    message: 'Form has been saved successfully!',
                    buttons: [{
                        label: 'OK',
                        default: true,
                        autoClose: true,
                        click: () => this.goBack()
                    }]
                });
            })
            .finally(() => this.isSaving = false);
    }
}
