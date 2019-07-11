import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BrandService } from 'src/app/shared/services/brand.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  customValidation = true;
  myForm: FormGroup;
  messError;
  isLogin;

  constructor(private formBuilder: FormBuilder, private router: Router, private firebaseAuth: AngularFireAuth,
    private authService: AuthService, private brandService: BrandService) {

    this.myForm = formBuilder.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // this.firebaseAuth.authState.subscribe(data => {
    //   if (data && !this.isLogin) {
    //     this.router.navigate(['/main/dashboard']);
    //   }
    // });
  }

  ngOnInit() {
    setTimeout(() => {
      if(localStorage.getItem('loggedOut') == 'true'){
        localStorage.clear();
        return;
      }else if(localStorage.getItem('loggedIn') == 'true'){
        this.router.navigate(['/main/dashboard']);
        return;
      }
    }, 1000);
  }

  login() {
    this.firebaseAuth.auth.signOut();
    this.isLogin = true;

    if (this.myForm.valid) {
      this.customValidation = true;
      const email = this.myForm.get('name').value;
      const password = this.myForm.get('password').value;

      this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log(value.user.uid);
        console.log(value.user['ra']);
        localStorage.setItem('userID', value.user.uid);
        localStorage.setItem('usertoken', value.user['ra']);
        this.authService.getUser(value.user.uid).subscribe(result => {
          if(result['data'].user_type != 4 ){
            this.logout();
          }
          localStorage.setItem('user', JSON.stringify(result['data']));
          this.router.navigate(['/main/dashboard-info-admin']);
          // if (result['data']['activeBrand']) {
          //   this.brandService.getBrandById(result['data']['activeBrand']).subscribe(brand => {
          //     localStorage.setItem('currentBrand', JSON.stringify(brand['brand']));

          //     this.router.navigate(['/main/dashboard']);
          //   });
          // } else {
          //   this.router.navigate(['/connect']);
          // }
        });
      })
      .catch(err => {
        this.messError = err.message;
        console.log(err);
      });
    } else {
      this.customValidation = false;
      this.messError = 'Validation Error';
    }
  }

  signInWithFacebook() {
    this.authService.doFacebookLogin();
    // this.firebaseAuth.auth.signOut();

    // this.authService.signInWithFacebook()
    // .then((res) => {
    //   console.log(res);
    //   this.router.navigate(['/connect']);
    // })
    // .catch((err) => this.messError = err.message);
  }

  logout() {
    this.firebaseAuth.auth.signOut().then(() => {
      localStorage.clear();
      localStorage.setItem('loggedOut', 'true');
      this.router.navigate(['/master-admin']);
    });
  }
}
