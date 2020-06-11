import {Component} from '@angular/core';
import {HeaderService} from './services/header.service';
import {ErrorService, IError} from './services/error.service';

@Component({
    selector: 'rf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'RestForms';

    constructor(public hs: HeaderService, public es: ErrorService) {
    }

    trackError(idx: number, err: IError) {
        return err.id;
    }
}
