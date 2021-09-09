import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ConfigService} from './config.service';
import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {ErrorService} from './error.service';
import {MockDataService, USE_MOCK} from './mock-data.service';

// Field types
export enum FieldType {
    // Implemented
    String = '%Library.String',
    VarString = '%Library.VarString',
    Date = '%Library.Date',
    Numeric = '%Library.Numeric',
    Integer = '%Library.Integer',
    TimeStamp = '%Library.TimeStamp',
    Time = 'time',
    Boolean = '%Library.Boolean',
    Serial = 'serial',
    Form = 'form',
    List = 'list',
    Array = 'array'
}

// %Library.Time,
// %Library.PosixTime

export const PRIMITIVE_TYPES = ['%Library.String', '%Library.VarString', '%Library.Date', '%Library.Numeric',
    '%Library.Integer', '%Library.TimeStamp', '%Library.Boolean', '%Library.Time', '%Library.PosixTime'];

// Field information
export interface IFieldInfo {
    name: string;
    type: string;
    collection: string;
    displayName: string;
    maxlen: string;
    required: number;
    category: string;
    jsonreference: string;

    // Internal type for RF UI
    rfType: FieldType;
}

// Object information
export interface IObjectModel {
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

    objectData: { [key: string]: any };
    objectModel: IObjectModel;
    // Models of all classes for serial fields, and object fields
    allModels: { [key: string]: IObjectModel } = {};
    // Related forms data, stores all forms data if some fields has form type
    allData: { [key: string]: any[] } = {};

    constructor(private http: HttpClient,
                private cs: ConfigService,
                private es: ErrorService,
                private md: MockDataService,
                private router: Router) {
    }

    /**
     * Global error handler
     */
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

    /**
     * Returns options for requests
     */
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
    getObjectData(className: string, id: string) {
        return this.get('form/object/' + className + '/' + encodeURIComponent(id)).toPromise();
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

    /**
     * Requests object data and all needed data(related classes models, form data for dropdowns) to show this object
     */
    async getObjectDetails(cl: string, id: string): Promise<any> {
        this.objectModel = undefined;
        this.objectData = [];
        return Promise.all([
            // Request form information
            this.formInfo(cl).then(d => {
                this.objectModel = d;
                this.initializeTypesForModel(this.objectModel);
                return this.requestRelatedFormsDataAndSerialClasses();
            }),
            // Request form data if not new
            id === 'new'
                ? (this.objectData = {}) && Promise.resolve()
                : this.getObjectData(cl, id).then(d => this.objectData = d)
        ]);
    }

    /**
     * Requests all forms information if some fields has form type
     * also requests all class information for serial fields type
     */
    private async requestRelatedFormsDataAndSerialClasses(): Promise<any> {
        this.allData = {};
        this.allModels = {};
        const requested = [];
        const promises = [];

        // Iterate through all fields and request data if type of field is 'form' and it wasn't already requested
        this.objectModel.fields.forEach(f => {
            const p = this.loadRelatedDataAndSerialClasses(f, requested);
            promises.push(p);
        });

        // If there is no promises - resolve immediately
        if (promises.length === 0) {
            return Promise.resolve();
        }

        return Promise.all(promises);
    }

    private async loadRelatedDataAndSerialClasses(field: IFieldInfo, requested: string[]): Promise<any> {
        return new Promise((res, rej) => {
            const all = [];
            // Request data for form
            if (field.category.toLowerCase() === 'form') {
                if (requested.indexOf(field.type + 'D') === -1) {
                    requested.push(field.type + 'D');
                    // TODO: make separate call for 'all' and 'info' depending on jsonreference === 'ID'
                    const url = ENDPOINTS.OBJECTS_LIST.replace('{class}', field.type).replace('{query}', 'allobj');
                    const promise = this
                        .get(url)
                        .toPromise()
                        .then(data => {
                            this.allData[field.type] = data?.children;
                        });
                    all.push(promise);
                }
            }
            // Request class info for serial
            if (field.category.toLowerCase() === 'serial' || field.category.toLowerCase() === 'form') {
                if (requested.indexOf(field.type + 'I') === -1) {
                    requested.push(field.type + 'I');
                    const url = ENDPOINTS.FORM_INFO.replace('{class}', field.type);
                    const promise = this
                        .get(url)
                        .toPromise()
                        .then((data: IObjectModel) => {
                            this.allModels[field.type] = data;
                            this.initializeTypesForModel(this.allModels[field.type]);
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
     * Returns property type
     */
    getPropType(prop: IFieldInfo): FieldType {
        switch (prop.collection) {
            case 'array': {
                return prop.jsonreference === 'ID' ? FieldType.List : FieldType.Array;
                break;
            }
            case 'list':
                return FieldType.List;
                break;
        }

        if (prop.category.toLowerCase() === 'datatype') {
            return this.getSimpleType(prop.type);
        }

        if (prop.category === 'form') {
            return FieldType.Form;
        }

        if (prop.category === 'serial') {
            return FieldType.Serial;
        }

        return FieldType.String;
    }

    getSimpleType(type: string): FieldType {
        switch (type) {
            case '%Library.Char':
                return FieldType.String;
            case '%Library.DateTime':
                return FieldType.TimeStamp;
            case '%Library.Integer':
            case '%Library.BigInt':
            case '%Library.SmallInt':
            case '%Library.TinyInt':
                return FieldType.Integer;
            case '%Library.Decimal':
            case '%Library.Double':
            case '%Library.Float':
            case '%Library.Currency':
                return FieldType.Numeric;
            case '%Library.Time':
            case '%Library.PosixTime':
                return FieldType.Time;
        }
        return type as FieldType;
    }

    /**
     * Initializes types for model
     */
    initializeTypesForModel(m: IObjectModel) {
        if (!m) {
            console.warn('Trying to initialize types for undefined model');
            return;
        }
        m.fields.forEach(f => {
            f.rfType = this.getPropType(f);
        });
    }
}
