import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NbAuthService, NbAuthResult, NbAuthOAuth2Token, NbAuthTokenClass, NbAuthToken } from "@nebular/auth";
import { takeWhile } from "rxjs/operators";
import { UserService } from "../../@core/data/users.service";
import { Observable } from "rxjs";

@Component({
    selector: 'nb-playground-oauth2-callback',
    template: `

        Token forward

    `,
  })
  export class NbTokenComponent implements OnDestroy {
    
    ngOnDestroy(): void {

    }

  }