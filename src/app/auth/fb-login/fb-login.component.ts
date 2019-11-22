import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { BrandService } from 'src/app/shared/services/brand.service';
import { MainService } from 'src/app/shared/services/main.service';
import * as localForage from 'localforage';

@Component({
  selector: 'app-fb-login',
  templateUrl: './fb-login.component.html',
  styleUrls: ['./fb-login.component.scss']
})
export class FbLoginComponent implements OnInit {
  showLoader = true;
  businessUser = false;
  businessEmail;
  deleteUserId;
  deleteSuccess = false;
  disableButton = false;

  constructor(private authService: AuthService,
    private firebaseAuth: AngularFireAuth,
    private ngZone: NgZone,
    public router: Router,
    private brandService: BrandService,
    private mainServ: MainService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.firebaseAuth.auth.getRedirectResult()
      .then(async res => {
        console.log(res);
        if(await localForage.getItem('loggedOut') == true){
          console.log('loggedOut');
          await this.ngZone.run(async () => {
            await localForage.clear();
            this.showLoader = false;
            return;
          });
        }else if(await localForage.getItem('loggedIn') == true){
          console.log('loggedIn');
          this.router.navigate(['/main/dashboard']);
          return;
        }
        if (res.user) {
          console.log(res.user);
          const firstname = res.additionalUserInfo.profile['first_name'];
          const lastname = res.additionalUserInfo.profile['last_name'];
          const email = res.user.email || res.additionalUserInfo.profile['email'];
          const user_id = res.user.uid;
          const photo = res.user.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png';
          const newUser = res.additionalUserInfo.isNewUser;

          await localForage.setItem('userID', res.user.uid);
          await localForage.setItem('usertoken', await res.user.getIdToken());
          await localForage.setItem('access', res.credential['accessToken']);
          console.log(newUser);
          console.log('userID',await localForage.getItem('userID'))
          console.log('usertoken',await localForage.getItem('usertoken'))
          console.log('access',await localForage.getItem('access'))

          if (newUser) {
            // create user in firestore
            console.log('newUser');

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
              console.log('newUser added in database', result);
              console.log('await localForage:',await localForage);
              console.log('get user called for', user_id); 
              this.getUser(user_id);
            }, err => {
              console.log('Error in creating Fb user in Database', err);
              this.ngZone.run(async () => {
                await localForage.clear();
                this.showLoader = false;
                return;
              });
            })
          }else{
            console.log('oldUser');
            this.authService.updateUser(user_id,{ avatar: photo}).subscribe(async result => {
              console.log('userID',await localForage.getItem('userID'))
              console.log('usertoken',await localForage.getItem('usertoken'))
              console.log('access',await localForage.getItem('access'))
              console.log('oldUser updated', result);     
              console.log('await localForage:',await localForage);
              console.log('get user called for', user_id); 
              this.getUser(user_id);
            }, async err => {
              console.log('Error in updating Fb user in Database', err);
              console.log('await localForage:',await localForage);
              console.log('get user called for', user_id); 
              this.getUser(user_id);
            })
          }
        } else {
          console.log('no res.user');
          this.ngZone.run(async () => {
            await localForage.clear();
            this.showLoader = false;
            return;
          });
        }
      }).catch( async err => {
        console.log('fb login error:',err);
        if(await localForage.getItem('loggedOut') == true){
          this.ngZone.run(async () => {
            await localForage.clear();
            this.showLoader = false;
            return;
          });
        }
        if(err.code == 'auth/user-cancelled'){
          this.ngZone.run(async () => {
            await localForage.clear();
            this.showLoader = false;
            return;
          });
        }

        this.firebaseAuth.auth.signOut().then(async () => {
          await localForage.clear();
          await localForage.setItem('loggedOut', true);
          this.router.navigate(['/fb-login']);
        }).catch(async ()=>{
          await localForage.clear();
          await localForage.setItem('loggedOut', true);
          this.router.navigate(['/fb-login']);
        });
        return;

        // let user_type, user_id, tempPassword;
        // const userData = this.authService.getUserByEmail(err.email).subscribe(async data => {
        //   user_type = data['user'].user_type;
        //   user_id = data['user'].user_id;
        //   tempPassword = data['user'].tempPassword;

        //   if(user_type == 2 && err.code == "auth/account-exists-with-different-credential"){
        //     this.ngZone.run(() => {
        //       this.showLoader = false;
        //       this.businessUser = true;
        //       this.businessEmail = err.email;
        //       this.deleteUserId = user_id;
        //       this.openDeleteBox();
        //     });
        //   }
        //   else if (user_type ==3 && err.code == "auth/account-exists-with-different-credential"){
        //     await localForage.setItem('access', err.credential['accessToken']);
        //     if(!tempPassword){
        //       tempPassword = 'asdf1234';
        //     }
        //     firebase.auth().fetchSignInMethodsForEmail(err.email)
        //       .then(providers => {
        //         firebase.auth().signInWithEmailAndPassword(err.email, tempPassword)
        //         .then(async result=>{
        //           result.user.linkAndRetrieveDataWithCredential(err.credential);
        //           await localForage.setItem('userID', result.user.uid);
        //           await localForage.setItem('usertoken', await result.user.getIdToken());
        //           const uid = result.user.uid;
        //           const photo = result.user.providerData[0].photoURL || 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png';
        //           const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
        //           await userRef.set({
        //             account_type: 'starter',                  
        //             marketing: true,
        //             user_type: 1,
        //             avatar: photo
        //           }, {merge: true});
        //           this.getUser(uid);
        //         }).catch(err =>{
        //           console.log('link error',err);
        //         })
        //       });
        //   }
        // });
      });
    }, 1000);
  }

  async getUser(uid){
    console.log('userID',await localForage.getItem('userID'))
    console.log('usertoken',await localForage.getItem('usertoken'))
    console.log('access',await localForage.getItem('access'))
    console.log('getting user with uid:', uid);
    this.authService.getUser(uid).subscribe(async data => {
      console.log('userID',await localForage.getItem('userID'))
      console.log('usertoken',await localForage.getItem('usertoken'))
      console.log('access',await localForage.getItem('access'))
      console.log('user data found',data);
      await localForage.setItem('user', data['data']);
      console.log('user',await localForage.getItem('user'))
      if (data['data']['activeBrand']) {
        console.log('yes activeBrand', data['data']['activeBrand']);
        this.brandService.getBrandById(data['data']['activeBrand']).subscribe(async res_brand => {
          console.log('user',await localForage.getItem('user'));
          console.log('active brand found',res_brand);
          await localForage.setItem('currentBrand', res_brand['brand']);
          this.ngZone.run(() => this.router.navigate(['/main/dashboard']));
          // this.showLoader = false;
        }, err => {
          console.log('active brand error',err);
          this.ngZone.run(() => this.router.navigate(['/fb-connect']));
          this.showLoader = false;
        });
      } else {
        console.log('no activeBrand');
        this.ngZone.run(() => this.router.navigate(['/fb-connect']));
        this.showLoader = false;
      }
    }, async err => {
      console.log('userID',await localForage.getItem('userID'))
      console.log('usertoken',await localForage.getItem('usertoken'))
      console.log('access',await localForage.getItem('access'))
      console.log('user data error',err);
      console.log('userID',await localForage.getItem('userID'))
      console.log('usertoken',await localForage.getItem('usertoken'))
      console.log('access',await localForage.getItem('access'))
      this.showLoader = false;
    });
  }

  async loginFB() {
    if(await localForage.getItem('loggedIn') == true){
      this.ngZone.run(() => this.router.navigate(['/main/dashboard']));
    }else{
      await localForage.clear();
      this.firebaseAuth.auth.signOut();
      this.authService.doFacebookLogin();
    }
  }

  openDeleteBox(){
    (document.getElementById('myModal') as HTMLDivElement).style.display = 'block';
  }

  async closeDeleteBox(){
    (document.getElementById('myModal') as HTMLDivElement).style.display = 'none';
    await localForage.clear();
  }

  deleteUser(id){
    this.disableButton = true;
    this.authService.deleteUser(id).subscribe(data => {
      if(data['success'] == true){
        this.deleteSuccess = true;
      }
    });
  }

  async continue(){
    (document.getElementById('myModal') as HTMLDivElement).style.display = 'none';
    await localForage.clear();
    this.firebaseAuth.auth.signOut();
    this.authService.doFacebookLogin();
  }

}
