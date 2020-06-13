import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NbAuthService, NbAuthResult, NbAuthToken } from "@nebular/auth";
import { takeWhile } from "rxjs/operators";
import { UserService } from "../../@core/data/users.service";
import { BackendService } from "../../@core/data/backend.service";

@Component({
    selector: 'nb-playground-oauth2-callback',
    templateUrl: './callback.component.html',
  })
  export class NbOAuth2CallbackPlaygroundComponent implements OnDestroy {
    returned = false;
    returnValue: string;
    alive = true;
    token: NbAuthToken;

    constructor(private authService: NbAuthService, private router: Router, private userService: UserService, private backendService: BackendService) {
      this.returnValue = '';
      this.authService.authenticate('twitch_bot')
        .pipe(takeWhile(() => this.alive))
        .subscribe((authResult: NbAuthResult) => {
          if (authResult.isSuccess()) {
              this.token = authResult.getToken();
              this.validateTokenResponse(this.token.getValue(), authResult);
            }
        });
    }
    
    validateTokenResponse(resp: any, auth: any){
      if (auth.response == null){
        this.returnValue = 'Authorization failed. Please try again.';
      } else if(auth.response.message){
        this.returnValue = 'Authorization failed. Twitch returned an error: ' + auth.response.message;
      } else {
        this.returnValue = 'Success. You may leave this page now. Good luck!';
      }

      this.returned = true;

    }

    ngOnDestroy(): void {
      this.alive = false;
    }
  }