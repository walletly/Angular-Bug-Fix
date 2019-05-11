import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private firebaseAuth: AngularFireAuth, private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      // this.firebaseAuth.authState()

      return Observable.create(observer => {
        this.firebaseAuth.authState.subscribe(result => {
          console.log(result);

          if (result) {
            observer.next(true);
          } else {
            this.router.navigate(['/auth/login']);
            observer.next(false);
          }
        });
      });

      // return false;
  }
}
