import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../auth.service';
import { MainService } from '../main.service';
import { BrandService } from '../brand.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private firebaseAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private mainService: MainService,
    private brandService: BrandService,) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // this.firebaseAuth.authState()
    if (!this.router.url.includes('review-campaign') &&
      !this.router.url.includes('create-campaign') &&
      !this.router.url.includes('walletly-cards')) {

      this.mainService.dataCampaign = {
        name: '',
        desription: '',
        card_id: '',
        discount: '',
        startDate: '',
        endDate: '',
        campaign_type: '',
        brand_id: '',
        coupon_validity: '',
        currency: '',
        event_name: '',
        venue: '',
        time: '',
        cardType: ''
      };
    }

      return Observable.create(observer => {
        this.firebaseAuth.authState.subscribe(async result => {

          console.log(result);

          if (result) {
            localStorage.setItem('loggedIn', 'true');
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


  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(observer => {
      if (JSON.parse(localStorage.getItem("user"))["user_type"] === 4){
        observer.next(true);
        return;
      }
      this.brandService.getUsersBrands(localStorage.getItem("userID"))
        .subscribe(result => {
          observer.next(true);
        }, error => {
          this.router.navigate(['/fb-connect']);
          observer.next(false);
        });
    });
  }
}
