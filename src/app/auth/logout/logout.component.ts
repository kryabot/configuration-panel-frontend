import { Component, OnDestroy } from "@angular/core";
import { NbOAuth2LoginComponent } from "../login/login.component";
import { Router } from "@angular/router";

@Component({
    selector: 'nb-oauth2-logout',

    template: `

    `
  })
  export class NbOAuth2LogoutComponent   {

    constructor(private login: NbOAuth2LoginComponent, private router: Router) {
        login.logout();
        router.navigate(['auth']);
      }

  }