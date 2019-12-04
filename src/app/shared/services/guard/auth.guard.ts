import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { MainService } from '../main.service';
import { BrandService } from '../brand.service';
import * as localForage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private firebaseAuth: AngularFireAuth,
    private router: Router,
    private mainService: MainService,
    private brandService: BrandService,
    private ngZone: NgZone,) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // this.firebaseAuth.authState()
    if (!this.router.url.includes('review-campaign') &&
      !this.router.url.includes('create-campaign') &&
      !this.router.url.includes('walletly-cards')) {

      this.mainService.dataCampaign = {
        name: '',
        description: '',
        card_id: '',
        discount: '',
        selectedCustomField: "",
        startDate: '',
        endDate: '',
        campaign_type: '',
        brand_id: '',
        coupon_validity: '',
        currency: '',
        memCard_status_customField: '',
        financeField: '',
        addWalletField: '',
        event_name: '',
        venue: '',
        venue_coordinates: null,
        time: '',
        cardType: '',
        points: ''
      };
    }

    return Observable.create(async observer => {
      this.firebaseAuth.auth.onAuthStateChanged(async currentUser => {
        if(currentUser){
          observer.next(true);
        }else{
          this.ngZone.run(async () => {
            this.router.navigate(['/fb-login']);
            observer.next(false);
          });
        }
      })
    });
  }


  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(async observer => {
      const user = await localForage.getItem("user");
      if(!user){
        this.router.navigate(['/fb-login']);
        observer.next(false);
        return;
      }

      if (user["user_type"] === 4){
        observer.next(true);
        return;
      }

      if (!await localForage.getItem('userID') || 
          !await localForage.getItem('usertoken'))
      {
        this.firebaseAuth.auth.signOut().then(async () => {
          await localForage.clear();
          this.ngZone.run(async () => {
            this.router.navigate(['/fb-login']);
            observer.next(false);
          })
        });
        return;
      }

      const brand = await localForage.getItem("currentBrand");
      if(brand){
        observer.next(true);
        return;
      }

      this.brandService.getUsersBrands(await localForage.getItem("userID"))
        .subscribe(result => {
          observer.next(true);
        }, error => {
          this.router.navigate(['/fb-connect']);
          observer.next(false);
        });
    });
  }
}
