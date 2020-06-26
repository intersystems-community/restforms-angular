import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ConfigService} from './config.service';
import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {ErrorService} from './error.service';
import {MockDataService, USE_MOCK} from './mock-data.service';

// Field information
export interface IFieldInfo {
    name: string;
    type: string;
    collection: string;
    displayName: string;
    maxlen: string;
    required: number;
    category: string;
    // temp
    expanded: boolean;
}

// Object information
export interface IObjectInfo {
    name: string;
    class: string;
    displayProperty: string;
    objpermissions: string; // CRUD
    fields: IFieldInfo[];
}

export interface ILoginResponse {
    data: any;
    url: string;
}

// Form data interface
export interface IFormData {
    name: string;
    class: string;
}

export interface IFormDataEx {
    children: IFormData[];
}

// Objects information from 'info' query
export interface IObjectData {
    _id: string;
    displayName: string;
}

// Object list from OBJECTS_LIST request
export interface IObjectList {
    children: IObjectData[];
}


// API endpoints
export const enum ENDPOINTS {
    TEST = 'test',
    FORMS_LIST = 'form/info',
    FORM_INFO = 'form/info/{class}',
    OBJECTS_LIST = 'form/objects/{class}/{query}?size=1000000', // TODO: make server side pagination
    OBJECT_SAVE = 'form/object/{class}/{id}',
    OBJECT_DELETE = 'form/object/{class}/{id}'
}

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private errorHandler = catchError(err => {
        if (err.status === 401) {
            void this.router.navigateByUrl('login');
            return of();
        }
        if (err?.error?.summary) {
            this.es.show(err?.error?.summary);
        } else {
            this.es.show(err.message);
        }
        throw err;
    });

    constructor(private http: HttpClient,
                private cs: ConfigService,
                private es: ErrorService,
                private md: MockDataService,
                private router: Router) {
    }

    /**
     * Performs GET request
     */
    public get(url: string): Observable<any> {
        const api = this.cs.getAPiUrl();
        if (!api) {
            void this.router.navigateByUrl('/');
            return;
        }
        if (USE_MOCK) {
            if (this.md.hasData(url)) {
                return this.md.getData(url);
            }
        }

        return this.http.get(api + url, this.getOptions()).pipe(this.errorHandler);
    }

    private getOptions() {
        return {
            withCredentials: false,
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest'
            })
        };
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
    formInfo(className: string) {
        return this.get(ENDPOINTS.FORM_INFO.replace('{class}', className)).toPromise();
    }

    /**
     * Returns list of forms
     */
    objectData(className: string, id: string) {
        return this.get('form/object/' + className + '/' + id).toPromise();
    }

    async saveObject(className: string, id: string, data: any) {
        const api = this.cs.getAPiUrl();
        if (!api) {
            void this.router.navigateByUrl('/');
            return Promise.reject();
        }
        let url = api + ENDPOINTS.OBJECT_SAVE as string;
        url = url.replace('{class}', className);
        let method = 'put';
        if (id === 'new') {
            url = url.replace('/{id}', '');
            method = 'post';
        } else {
            url = url.replace('{id}', id);
        }

        return this.http.request(method, url, {body: data, ...this.getOptions()}).pipe(this.errorHandler).toPromise();
        // return this.http.put(url, data, this.getOptions()).pipe(this.errorHandler).toPromise();
    }

    /**
     * Deletes object
     */
    async deleteObject(className: string, id: string): Promise<any> {
        const api = this.cs.getAPiUrl();
        let url = api + ENDPOINTS.OBJECT_DELETE as string;
        url = url.replace('{class}', className);
        url = url.replace('{id}', id);
        return this.http.delete(url, this.getOptions()).pipe(this.errorHandler).toPromise();
    }
}
