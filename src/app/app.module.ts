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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {ObjectsListComponent} from './components/screens/objects-list/objects-list.component';
import { ObjectDetailsComponent } from './components/screens/object-details/object-details.component';
import { HeadlineComponent } from './components/ui/headline/headline.component';
import { FormComponent } from './components/ui/form/form.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DefaultValueDirective} from './directives/default-value.directive';

@NgModule({
    declarations: [
        AutoFocusDirective,
        FocusNextDirective,
        BlurOnEnterDirective,
        DefaultValueDirective,
        AppComponent,
        LoginScreenComponent,
        FormsListComponent,
        ObjectsListComponent,
        HeaderComponent,
        ErrorComponent,
        ObjectDetailsComponent,
        HeadlineComponent,
        FormComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSortModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        NgSelectModule,
        MatTooltipModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
