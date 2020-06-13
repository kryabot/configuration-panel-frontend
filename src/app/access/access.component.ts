/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { NbAuthService } from '@nebular/auth';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'nb-access',
  styleUrls: ['./access.component.scss'],
  template: `

  <nb-layout>
    <nb-layout-column>
      <nb-card>
        <nb-card-header>
        </nb-card-header>
        <nb-card-body>
          <nb-auth-block>
            <router-outlet></router-outlet>
          </nb-auth-block>
        </nb-card-body>
      </nb-card>
    </nb-layout-column>
  </nb-layout>
`,

})
export class NbAccessComponent implements OnDestroy {

  private alive = true;

  subscription: any;

  authenticated: boolean = false;
  token: string = '';

  constructor(protected auth: NbAuthService, protected location: Location) {

    this.subscription = auth.onAuthenticationChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe((authenticated: boolean) => {
        this.authenticated = authenticated;
      });
  }

  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}