import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthentificationComponent} from '@views/authentification/authentification.component';
import {DashboardComponent} from '@views/dashboard/dashboard.component';
import {AuthGuard} from '@utils/auth.guard';

const routes: Routes = [
  {path: '', component: AuthentificationComponent},
  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
