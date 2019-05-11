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

  constructor(private formBuilder: FormBuilder, private router: Router, private firebaseAuth: AngularFireAuth,
    private authService: AuthService, private brandService: BrandService) {

    this.myForm = formBuilder.group({
      name: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  login() {
    if (this.myForm.valid) {
      this.customValidation = true;
      const email = this.myForm.get('name').value;
      const password = this.myForm.get('password').value;

      this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log(value.user.uid);
        localStorage.setItem('userID', value.user.uid);
        this.authService.getUser(value.user.uid).subscribe(result => {
          console.log(result);
          localStorage.setItem('user', JSON.stringify(result['data']));
          if (result['data']['activeBrand']) {
            this.brandService.getBrandById(result['data']['activeBrand']).subscribe(brand => {
              localStorage.setItem('currentBrand', JSON.stringify(brand['brand']));
              this.router.navigate(['/main/dashboard']);
            });
          } else {
            this.router.navigate(['/connect']);
          }
        });
      })
      .catch(err => {
        this.messError = err.message;
      });
    } else {
      this.customValidation = false;
      this.messError = 'Validation Error';
    }
  }

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then((res) => {
      console.log(res);
      this.router.navigate(['/connect']);
    })
    .catch((err) => this.messError = err.message);
  }
}
