import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  customValidation = true;
  myForm: FormGroup;
  terms;
  marketing = false;
  messError;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {

    this.myForm = formBuilder.group({
      firstname: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  signUp() {
    if (this.myForm.valid && this.terms) {
      this.customValidation = true;
      const user = Object.assign({ marketing: this.marketing, }, this.myForm.value);
      this.authService.createUser(user).subscribe(data => {
        console.log(data);
        this.router.navigate(['/auth/login']);
      }, err => {
        console.log(err.error.error);
        this.messError = err.error.error;
      });
    } else {
      this.customValidation = false;
      this.messError = 'Validation Error';
    }
  }

  ngOnInit() {
  }

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then((res) => {
      this.router.navigate(['/connect']);
    })
    .catch((err) => console.log(err));
  }

}
