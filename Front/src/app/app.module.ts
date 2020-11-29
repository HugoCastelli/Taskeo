import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// MODULES
import {NgParticlesModule} from 'ng-particles';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MomentModule} from 'ngx-moment';

// COMPONENTS
import {ParticlesComponent} from '@components/particles/particles.component';
import {SigninComponent} from '@components/signin/signin.component';
import {SignupComponent} from '@components/signup/signup.component';
import {StatistiquesComponent} from '@components/statistiques/statistiques.component';
import { DialogTasksComponent } from '@components/dialog-tasks/dialog-tasks.component';
// VIEWS
import {AuthentificationComponent} from '@views/authentification/authentification.component';
import {DashboardComponent} from '@views/dashboard/dashboard.component';

// SERVICES
import {JwtInterceptor} from '@services/jwt.service';
import {ErrorInterceptor} from '@services/error.service';

// UTILS
import {MustMatchDirective} from '@utils/mustMatch/must-match.directive';
import { TaskComponent } from './_Components/task/task.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthentificationComponent,
    ParticlesComponent,
    SigninComponent,
    SignupComponent,
    MustMatchDirective,
    DashboardComponent,
    StatistiquesComponent,
    DialogTasksComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgParticlesModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDividerModule,
    SweetAlert2Module.forRoot(),
    MatMenuModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MomentModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
