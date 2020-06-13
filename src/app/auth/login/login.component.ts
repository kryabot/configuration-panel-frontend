import { Component, OnDestroy } from "@angular/core";
import { NbAuthResult, NbAuthService, NbAuthOAuth2Token } from "@nebular/auth";
import { takeWhile } from "rxjs/operators";
import { UserService } from "../../@core/data/users.service";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
    selector: 'nb-oauth2-login',
    template: `
    <style>
    .twitch-login-btn {
      background: #6441a4;
      border: 1px solid transparent;
      border-radius: 4px;
      color: #fff;
      -webkit-user-select: none;
  align-items: center;
  display: inline-flex;
  font-size: 1.2rem;
  justify-content: center;
  line-height: 2rem;
  outline: none;
  position: relative;
  text-decoration: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  font-family: Open Sans, sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1rem;
    border-style: solid;
    border-width: 0.0625rem;
    text-transform: uppercase;
    padding: 0.6875rem 1.125rem;
    }
    .twitch-login-btn:hover {
    background: #7d5bbe;
    border-color: #7d5bbe;

  }
  .twitch-login-btn:active {
      background: #6441a4;
      border-color: #7d5bbe;
      box-shadow: 0 0 6px 0 #7d5bbe;
  }
  
  .twitch-login-btn:focus {
    background: #7d5bbe;
    border-color: #9a7fcc;
    box-shadow: 0 0 6px 0 #7d5bbe;
  }

  .title {
    font-size: 1.5em;
  }
    </style>
  
    <p><b><span class='title'>Twitch KryaBot configuration</span></b></p>
    <p *ngIf="knownCode && errorCode == 401"><b>Oooops! You are not allowed to access configuration panel!</b></p>
    <p *ngIf="knownCode && errorCode == 405"><b>Your session expired, you need to relog!</b></p>
    <p *ngIf="error && !knownCode"> <b>Login failed, please try again.</b> <br> Error details: {{ error }} [{{ errorCode }}]</p>
            <div class='auth-login'>

            <button class="twitch-login-btn" *ngIf="!token" (click)="login()">Log in with Twitch</button>
            <button class="twitch-login-btn" *ngIf="token" (click)="logout()">Sign out</button>
            </div>

    `
  })
  export class NbOAuth2LoginComponent implements OnDestroy {
    token: NbAuthOAuth2Token;
    error = '';
    errorCode = null;
    accessDenied = false;
    knownCode = false;

    alive = true;
    constructor(private authService: NbAuthService, 
                private userService: UserService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
          if(params.msg) {
            if (params.msg == 'http'){
              this.error = 'Server error'
            } else {
              this.error = params.msg
            }
          }
          if(params.status)
            this.errorCode = params.status
            
          if(this.errorCode == 401)
            this.knownCode = true
          
          if(this.errorCode == 405)
            this.knownCode = true

          this.authService.onTokenChange()
          .pipe(takeWhile(() => this.alive))
          .subscribe((token: NbAuthOAuth2Token) => {
            this.token = null;
            if (token && token.isValid()) {
              this.token = token;
              
            }
          });
        });


      }

    login() {

      this.authService.authenticate('twitch')
        .pipe(takeWhile(() => this.alive))
        .subscribe((authResult: NbAuthResult) => {
        });
    }

    logout() {
        this.authService.logout('twitch')
          .pipe(takeWhile(() => this.alive))
          .subscribe((authResult: NbAuthResult) => {
            this.userService.logout();
          });
      }
  
    ngOnDestroy(): void {
      this.alive = false;
    }
  }