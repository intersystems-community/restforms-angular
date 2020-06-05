import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {Router} from '@angular/router';
import {ConfigService} from '../../../services/config.service';

@Component({
    selector: 'rf-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(private ds: DataService,
                private cs: ConfigService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    async logout() {
        try {
            await this.ds.logout();
            this.cs.clearApiUrl();
        } catch (e) {
            console.error(e);
            return;
        }
        this.router.navigateByUrl('/login');
    }
}
