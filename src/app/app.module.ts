import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginScreenComponent} from './components/screens/login-screen/login-screen.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AutoFocusDirective} from './directives/auto-focus.directive';
import {FocusNextDirective} from './directives/focus-next.directive';
import {FormsListComponent} from './components/screens/forms-list/forms-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from './components/ui/header/header.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {BlurOnEnterDirective} from './directives/blur-on-enter.directive';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ErrorComponent} from './components/ui/error/error.component';

@NgModule({
    declarations: [
        AutoFocusDirective,
        FocusNextDirective,
        BlurOnEnterDirective,
        AppComponent,
        LoginScreenComponent,
        FormsListComponent,
        HeaderComponent,
        ErrorComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatProgressBarModule,
        MatProgressSpinnerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
