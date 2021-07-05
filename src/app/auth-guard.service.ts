import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: NbAuthService, private router: Router) {
    }

    canActivate() {
        return this.authService.isAuthenticated()
          .pipe(
            tap(authenticated => {
              if (!authenticated) {
                this.router.navigate(['auth/login']);
              }
            }),
          );
      }

    validateApiResponse(response: any) {
      if (response && response.status && response.message) {
        this.authService.logout('twitch');
        localStorage.removeItem('auth_app_token');
        localStorage.removeItem('target_id');
        this.router.navigate(['/']);
      }
    }

    expiredToken() {
      localStorage.removeItem('auth_app_token');
      localStorage.removeItem('target_id');
      this.router.navigate(['auth'], { queryParams: { msg: 'http', status: 405} });
    }

    notAuthorised() {
      localStorage.removeItem('auth_app_token');
      localStorage.removeItem('target_id');
      this.router.navigate(['auth'], { queryParams: { msg: 'http', status: 401} });
    }

}
