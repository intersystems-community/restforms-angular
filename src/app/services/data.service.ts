import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ConfigService} from './config.service';
import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/operators';

export interface ILoginResponse {
    data: any;
    url: string;
}

// Form data interface
export interface IFormData {
    name: string;
    class: string;
}

// API endpoints
enum ENDPOINTS {
    TEST = 'test',
    FORMS_LIST= 'form/info'
}

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private http: HttpClient,
                private cs: ConfigService,
                private router: Router) {
    }

    /**
     * Performs GET request
     */
    private get(url: string): Observable<any> {
        const api = this.cs.getAPiUrl();
        if (!api) {
            this.router.navigateByUrl('/');
            return;
        }
        return this.http.get(api + url, {
            withCredentials: false,
            headers: new HttpHeaders({
                'X-Requested-With': 'XMLHttpRequest'
            })
        }).pipe(catchError((err) => {
            console.log(err);
            return of();
        }));
    }

    /**
     * Return valid API url from any url like "http://domain.com///rest//api/" > "http://domain.com/rest/api/"
     */
    private getApiUrl(server: string, path: string): string {
        const api = server + '/' + path + '/';
        return api.replace(/([^:]\/)\/+/g, '$1');
    }

    /**
     * Performs login
     */
    login(login: string, password: string, server: string, path: string): Promise<ILoginResponse> {
        const url = this.getApiUrl(server, path);
        return this.http.get(
            url + ENDPOINTS.TEST,
            {
                withCredentials: true,
                headers: new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    Authorization: 'Basic ' + btoa(login + ':' + password)
                })
            }
        ).pipe(
            map((data) => {
                return {data, url};
            })
        ).toPromise();
    }

    /**
     * Performs logout
     */
    logout(): Promise<any> {
        return this.get('logout').toPromise();
    }

    /**
     * Returns list of forms
     */
    getForms(): Promise<IFormData[]> {
        return this.get(ENDPOINTS.FORMS_LIST).toPromise();
    }
}
