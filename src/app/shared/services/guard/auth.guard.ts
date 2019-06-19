import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../auth.service';
import { MainService } from '../main.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private firebaseAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private mainService: MainService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      // this.firebaseAuth.authState()
    if (!this.router.url.includes('review-campaign') &&
      !this.router.url.includes('create-campaign') &&
      !this.router.url.includes('walletly-cards')) {

      this.mainService.dataCoupon = {
        name: '',
        desription: '',
        card_id: '',
        discount: '',
        startDate: '',
        endDate: '',
        campaign_type: '',
        brand_id: ''
      };
    }

      return Observable.create(observer => {
        this.firebaseAuth.authState.subscribe(async result => {

          console.log(result);

          if (result) {
            localStorage.setItem('userID', result.uid);
            await result.getIdToken().then(res => {
              localStorage.setItem('usertoken', res);
            });
            observer.next(true);
          } else {
            this.router.navigate(['/fb-login']);
            observer.next(false);
          }
        });
      });

      // return false;
  }
}
