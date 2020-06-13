import { Component, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NbAuthService, NbAuthResult, NbAuthOAuth2Token, NbAuthTokenClass, NbAuthToken } from "@nebular/auth";
import { takeWhile } from "rxjs/operators";
import { UserService } from "../../@core/data/users.service";
import { Observable } from "rxjs";
import { BackendService } from "../../@core/data/backend.service";
import { User } from "../../@core/model/User.model";

@Component({
    selector: 'nb-playground-oauth2-callback',
    template: `
    <b>
    <nb-spinner message='Preparing milkshake...' size='large'></nb-spinner>
    </b>
        `,
  })
  export class NbOAuth2CallbackPlaygroundComponent implements OnDestroy {
  
    alive = true;
    token: NbAuthToken;
    params: Params;

    constructor(private authService: NbAuthService, 
                private router: Router, 
                private userService: UserService, 
                private backendService: BackendService,
                private activatedRoute: ActivatedRoute) {
      
      this.activatedRoute.queryParams.subscribe((params) => {
        this.params = params;

        this.authService.authenticate('twitch')
        .pipe(takeWhile(() => this.alive))
        .subscribe((authResult: NbAuthResult) => {
          console.log(authResult)
          if (authResult.isSuccess()) {
              this.token = authResult.getToken();
              this.validateTokenResponse(this.token.getValue());
            } else {
              this.authService.logout('twitch');
              this.router.navigate([this.getRedirectPath(false)], { queryParams: { msg: 'http', status: authResult.getResponse().status} });
            }
        },
        (error: any)=>{
          console.log('got err')
          console.log(error)
          this.router.navigate([this.getRedirectPath(false)]);
        });
      });
    }
    
    validateTokenResponse(resp: any){
        if (resp == null || resp.message){
          this.authService.logout('twitch');
          this.router.navigate([this.getRedirectPath(false)], { queryParams: { msg: resp.message} });
          return;
        }
        this.router.navigate(['app']);
      }

    ngOnDestroy(): void {
      this.alive = false;
    }

    getRedirectPath(success: boolean): string{
      if (this.params.state){
        if (this.params.state == 'da-login') { return 'da-access'}
      }
      
      return success ? 'app' : 'auth';
    }
  }