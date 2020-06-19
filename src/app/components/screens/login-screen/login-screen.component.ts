import {Component, OnInit} from '@angular/core';
import {DataService, ILoginResponse} from '../../../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {version} from '../../../../../package.json';
import {FormControl} from '@angular/forms';
import {ConfigService} from '../../../services/config.service';
import {HeaderService} from '../../../services/header.service';
import {Location} from '@angular/common';

@Component({
    selector: 'rf-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {
    model = {
        version: '',
        error: ''
    };

    isLoading = false;
    login = new FormControl('_SYSTEM');
    password = new FormControl('SYS');
    server = new FormControl();
    path = new FormControl('forms');

    constructor(private ds: DataService,
                private cs: ConfigService,
                private hs: HeaderService,
                private loc: Location,
                private route: ActivatedRoute,
                private router: Router) {
        this.server.setValue(window.location.protocol + '//' + window.location.host, { emitEvent: false });
        this.hs.hideHeader();
        this.initModel();
    }

    /**
     * Initialize model
     */
    initModel() {
        this.model.version = version;
    }

    ngOnInit() {
    }

    /**
     * Login button click handler
     */
    async onLoginClick() {
        this.model.error = '';
        if (this.login.invalid || this.password.invalid || this.path.invalid) {
            return;
        }
        this.isLoading = true;
        try {
            const resp = await this.ds.login(this.login.value, this.password.value, this.server.value, this.path.value);
            this.onSuccess(resp);
        } catch (e) {
            this.onError(e);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * On success login callback
     */
    private onSuccess(resp: ILoginResponse) {
        if (resp.data.Status === 'OK') {
            this.cs.setApiUrl(resp.url);
            void this.router.navigateByUrl('/');
        }
    }

    /**
     * On login error callback
     */
    private onError(e: Error) {
        this.model.error = e.message;
    }
}
