import {Component, HostListener} from '@angular/core';
import {HeaderService} from './services/header.service';
import {ErrorService, IError} from './services/error.service';
import {ERROR_TOGGLE_ANIMATION} from './components/ui/error/error.component';
import {ModalService} from './services/modal.service';

@Component({
    selector: 'rf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [ERROR_TOGGLE_ANIMATION]
})
export class AppComponent {
    title = 'RestForms2UI';

    constructor(public hs: HeaderService,
                public es: ErrorService,
                public ms: ModalService) {
    }

    trackError(idx: number, err: IError) {
        return err.id;
    }
}
