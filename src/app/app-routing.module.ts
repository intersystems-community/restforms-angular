import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginScreenComponent} from './components/screens/login-screen/login-screen.component';
import {FormsListComponent} from './components/screens/forms-list/forms-list.component';
import {ConfigService} from './services/config.service';


const routes: Routes = [
    {path: '', component: FormsListComponent, resolve: {model: ConfigService} },
    {path: 'login', component: LoginScreenComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
