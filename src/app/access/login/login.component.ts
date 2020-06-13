import { Component, OnDestroy } from "@angular/core";
import { NbAuthResult, NbAuthService, NbAuthOAuth2Token } from "@nebular/auth";
import { takeWhile } from "rxjs/operators";
import { UserService } from "../../@core/data/users.service";

@Component({
    selector: 'nb-oauth2-access',
    styleUrls: ['./login.component.scss'],
    templateUrl: './login.component.html',
  })
  export class NbOAuth2LoginComponent implements OnDestroy {
    token: NbAuthOAuth2Token;
    
    alive = true;
    constructor(private authService: NbAuthService, private userService: UserService) {
        this.authService.onTokenChange()
          .pipe(takeWhile(() => this.alive))
          .subscribe((token: NbAuthOAuth2Token) => {
            this.token = null;
            if (token && token.isValid()) {
              this.token = token;
            }
          });
      }

    login() {
      this.authService.authenticate('twitch_bot')
        .pipe(takeWhile(() => this.alive))
        .subscribe((authResult: NbAuthResult) => {
        });
    }

    logout() {
        this.authService.logout('twitch_bot')
          .pipe(takeWhile(() => this.alive))
          .subscribe((authResult: NbAuthResult) => {
            this.userService.logout();
          });
      }
  
    ngOnDestroy(): void {
      this.alive = false;
    }
  }