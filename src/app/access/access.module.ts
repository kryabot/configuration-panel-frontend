import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './access-routing.module';
import { NbAuthModule,  NbOAuth2ResponseType, NbOAuth2GrantType, NbAuthOAuth2Token, NbOAuth2ClientAuthMethod } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  // NbCardModule,
  NbLayoutModule,
  NbCardModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { NbOAuth2LoginComponent } from './login/login.component';
import { NbOAuth2CallbackPlaygroundComponent } from './callback/callback.component';
import { NbOAuth2AuthStrategy } from '../auth/strategies/oauth2/oauth2-strategy';
import { NbAccessComponent } from './access.component';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbLayoutModule,
    NbCardModule,
    NbSpinnerModule,

    NbAuthModule.forRoot({
        strategies: [
          NbOAuth2AuthStrategy.setup({
            name: environment.bot_auth_config.auth_name,
            clientId: environment.bot_auth_config.client_id,
            clientSecret: environment.bot_auth_config.client_secret,
            clientAuthMethod: NbOAuth2ClientAuthMethod.REQUEST_BODY,

            authorize: {
              endpoint: environment.bot_auth_config.authorize_url,
              responseType: NbOAuth2ResponseType.CODE,
              scope: environment.bot_auth_config.auth_scope,
              redirectUri: environment.bot_auth_config.callbacl_url,
            },
            token: {
                endpoint: environment.bot_auth_config.token_url,
                grantType: NbOAuth2GrantType.AUTHORIZATION_CODE,
                redirectUri: environment.bot_auth_config.callbacl_url,
                class: NbAuthOAuth2Token,
            },
          }),
        ],
      }),
  ],
  declarations: [
    // ... here goes our new components
    NbOAuth2LoginComponent,
    NbOAuth2CallbackPlaygroundComponent,
    NbAccessComponent,
  ],
  providers: [
    NbOAuth2AuthStrategy,
    NbOAuth2LoginComponent,
  ],
})
export class NgxAccessModule {

}
