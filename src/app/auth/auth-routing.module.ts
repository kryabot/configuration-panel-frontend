import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from './auth.component';
import { NbOAuth2CallbackPlaygroundComponent } from './callback/callback.component';
import { NbOAuth2LoginComponent } from './login/login.component';
import { NbTokenComponent } from './token/token.component';
import { NbOAuth2LogoutComponent } from './logout/logout.component';
export const routes: Routes = [
  // .. here goes our components routes
  {
    path: '',
    component: NbAuthComponent,
    
    children: [
      {
        path: '',
        redirectTo: 'login'
      },
      {
        path: 'token',
        component: NbTokenComponent,
      },
      {
        path: 'callback',
        component: NbOAuth2CallbackPlaygroundComponent,
      },
      {
        path: 'login',
        component: NbOAuth2LoginComponent,
      },
      {
        path: 'logout',
        component: NbOAuth2LogoutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}