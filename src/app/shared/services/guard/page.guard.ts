import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as localForage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class PageGuard implements CanActivate{

  constructor(private firebaseAuth: AngularFireAuth,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
      return Observable.create(async observer => {
        const user = await localForage.getItem('user');
        if(!user){
          this.router.navigate(['/fb-login']);
          observer.next(false);
        }else{
          const user_type = user['user_type'];
          const url = state.url;
          if (url == '/main/dashboard'){
            if(user_type == 1){
              observer.next(true);
            }else if(user_type == 4){
              this.router.navigate(['/main/dashboard-info-admin']);
              observer.next(false);
            }
          }else if(url == '/main/dashboard-info-admin'){
            if(user_type == 4){
              observer.next(true);
            }else if(user_type == 1){
              this.router.navigate(['/main/dashboard']);
              observer.next(false);
            }
          }else if(url == '/fb-connect'){
            if(user_type == 1){
              observer.next(true);
            }else if(user_type == 4){
              this.router.navigate(['/main/dashboard-info-admin']);
              observer.next(false);
            }
          }
        }
    });
  }
}
