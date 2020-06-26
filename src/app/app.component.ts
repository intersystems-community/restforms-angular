import {Component, HostListener} from '@angular/core';
import {HeaderService} from './services/header.service';
import {ErrorService, IError} from './services/error.service';
import {ERROR_TOGGLE_ANIMATION} from './components/ui/error/error.component';

@Component({
    selector: 'rf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [ERROR_TOGGLE_ANIMATION]
})
export class AppComponent {
    title = 'RestFormsUI2';

    constructor(public hs: HeaderService, public es: ErrorService) {
    }

    trackError(idx: number, err: IError) {
        return err.id;
    }
}
