import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {StorageService} from './storage.service';

const CONF_API_KEY = 'rf.api';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    constructor(private ss: StorageService,
                private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return new Observable<any>(o => {
            const done = () => {
                o.next();
                o.complete();
            };

            const api = this.ss.get(CONF_API_KEY);

            if (api) {
                done();
            } else {
                void this.router.navigateByUrl('/login');
            }
        });
    }

    setApiUrl(url: string) {
        this.ss.set(CONF_API_KEY, url);
    }

    getAPiUrl(): string {
        return this.ss.get(CONF_API_KEY) || '';
    }

    clearApiUrl() {
        this.ss.delete(CONF_API_KEY);
    }
}
