import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { BrandService } from 'src/app/shared/services/brand.service';
import * as localForage from 'localforage';

@Component({
  selector: 'app-fb-login',
  templateUrl: './fb-login.component.html',
  styleUrls: ['./fb-login.component.scss']
})
export class FbLoginComponent implements OnInit {
  showLoader = true;
  // businessUser = false;
  // businessEmail;
  // deleteUserId;
  // deleteSuccess = false;
  // disableButton = false;

  constructor(private authService: AuthService,
    private firebaseAuth: AngularFireAuth,
    private ngZone: NgZone,
    public router: Router,
    private brandService: BrandService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.firebaseAuth.auth.getRedirectResult()
      .then(async res => {
        if (res.user) {
          if(!this.firebaseAuth.auth.currentUser){
            return this.ngZone.run(async () => {
              await localForage.clear();
              this.showLoader = false;
              return;
            });
          }
          const firstname = res.additionalUserInfo.profile['first_name'];
          const lastname = res.additionalUserInfo.profile['last_name'];
          const email = res.user.email || res.additionalUserInfo.profile['email'];
          const user_id = res.user.uid;
          const photo = res.user.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png';
          const newUser = res.additionalUserInfo.isNewUser;

          await localForage.setItem('userID', res.user.uid);
          await localForage.setItem('usertoken', await res.user.getIdToken());
          await localForage.setItem('access', res.credential['accessToken']);

          if (newUser) {
            // create user in firestore

            const user = {
              user_id,
              account_type: 'starter',
              firstname,
              lastname,
              email,
              marketing: true,
              user_type: 1,
              avatar: photo
            }
            this.authService.createFbUser(user).subscribe(async result => {
              this.getUser(user_id);
            }, err => {
              return this.ngZone.run(async () => {
                await localForage.clear();
                this.showLoader = false;
                return;
              });
            })
          }else{
            this.authService.updateUser(user_id,{ avatar: photo}).subscribe(async result => {
              this.getUser(user_id);
            }, async err => {
              this.getUser(user_id);
            })
          }
        } else {
          if(this.firebaseAuth.auth.currentUser){
            this.router.navigate(['/main/dashboard']);
            return;
          }else{
            return this.ngZone.run(async () => {
              await localForage.clear();
              this.showLoader = false;
              return;
            });
          }
        }
      }).catch( async err => {
        if(err.code.includes('auth')){
          this.firebaseAuth.auth.signOut().then(async () => {
            this.ngZone.run(async () => {
              await localForage.clear();
              this.showLoader = false;
            });
          }).catch(async ()=>{
            this.ngZone.run(async () => {
              await localForage.clear();
              this.showLoader = false;
            });
          });
        }else{
          this.firebaseAuth.auth.signOut().then(async () => {
            this.ngZone.run(async () => {
              await localForage.clear();
              this.showLoader = false;
            });
          }).catch(async ()=>{
            this.ngZone.run(async () => {
              await localForage.clear();
              this.showLoader = false;
            });
          });
        }
      });
    }, 1000);
  }

  async getUser(uid){
    this.authService.getUser(uid).subscribe(async data => {
      await localForage.setItem('user', data['data']);
      if (data['data']['activeBrand']) {
        this.brandService.getBrandById(data['data']['activeBrand']).subscribe(async res_brand => {
          await localForage.setItem('currentBrand', res_brand['brand']);
          this.ngZone.run(() => this.router.navigate(['/main/dashboard']));
        }, err => {
          this.ngZone.run(() => this.router.navigate(['/fb-connect']));
          this.showLoader = false;
        });
      } else {
        this.ngZone.run(() => this.router.navigate(['/fb-connect']));
        this.showLoader = false;
      }
    }, async err => {
      this.showLoader = false;
    });
  }

  async loginFB() {
    if(this.firebaseAuth.auth.currentUser){
      this.ngZone.run(() => this.router.navigate(['/main/dashboard']));
    }else{
      await localForage.clear();
      this.firebaseAuth.auth.signOut();
      this.authService.doFacebookLogin();
    }
  }

  // openDeleteBox(){
  //   (document.getElementById('myModal') as HTMLDivElement).style.display = 'block';
  // }

  // async closeDeleteBox(){
  //   (document.getElementById('myModal') as HTMLDivElement).style.display = 'none';
  //   await localForage.clear();
  // }

  // deleteUser(id){
  //   this.disableButton = true;
  //   this.authService.deleteUser(id).subscribe(data => {
  //     if(data['success'] == true){
  //       this.deleteSuccess = true;
  //     }
  //   });
  // }

  // async continue(){
  //   (document.getElementById('myModal') as HTMLDivElement).style.display = 'none';
  //   await localForage.clear();
  //   this.firebaseAuth.auth.signOut();
  //   this.authService.doFacebookLogin();
  // }

}
