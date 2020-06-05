import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    visible$ = new BehaviorSubject(true);

    constructor() {
    }

    showHeader() {
        this.visible$.next(true);
    }

    hideHeader() {
        this.visible$.next(false);
    }
}
