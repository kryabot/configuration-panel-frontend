import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAccessComponent } from './access.component';
import { NbOAuth2CallbackPlaygroundComponent } from './callback/callback.component';
import { NbOAuth2LoginComponent } from './login/login.component';
export const routes: Routes = [
  // .. here goes our components routes
  {
    path: '',
    component: NbAccessComponent,
    
    children: [
      {
        path: '',
        component: NbOAuth2LoginComponent,
      },
      {
        path: 'callback',
        component: NbOAuth2CallbackPlaygroundComponent,
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