import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private readonly testKey = 'rf_test_local_storage';
    private isLocalStorage = true;

    get storage(): Storage {
        if (this.isLocalStorage) {
            return localStorage;
        } else {
            return sessionStorage;
        }
    }

    constructor() {
        try {
            localStorage.setItem('rf_test_local_storage', '');
        } catch (e) {
            this.isLocalStorage = false;
        }
    }

    get(key: string): string {
        return this.storage.getItem(key);
    }

    set(key: string, value: string) {
        this.storage.setItem(key, value);
    }

    delete(key: string) {
        this.storage.removeItem(key);
    }

}
