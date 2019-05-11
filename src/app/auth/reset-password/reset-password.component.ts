import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  customValidation = true;
  myForm: FormGroup;
  code;

  passwordInput;
  passwordConfirmationInput;

  data = {
    'NewPassword': '',
    'RepeatPassword': '',
  };

  constructor(private formBuilder: FormBuilder, private router: Router, private firebaseAuth: AngularFireAuth,
    private route: ActivatedRoute) {
    this.myForm = formBuilder.group({
      NewPassword: ['', [Validators.required, Validators.minLength(6)]],
      RepeatPassword: ['', Validators.required],
    }, { validator: this.matchingPasswords('NewPassword', 'RepeatPassword') });

    this.code = this.route.snapshot.queryParams['oobCode'];
  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      this.passwordInput = group.controls[passwordKey],
          this.passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (this.passwordInput.value !== this.passwordConfirmationInput.value) {
        return this.passwordConfirmationInput.setErrors({notEquivalent: true});
      } else {
          return this.passwordConfirmationInput.setErrors(null);
      }
    };
  }

  ngOnInit() {
  }

  reset() {
    if (this.myForm.valid && this.code) {

      this.customValidation = true;
      this.firebaseAuth.auth.confirmPasswordReset(this.code, this.data.RepeatPassword)
        .then(result => {
          // Success
          console.log('Password changed!');
          this.router.navigate(['/auth/login']);
        })
        .catch(err => {
          // Invalid code
          console.log(err);
        });
    } else {
      this.customValidation = false;
    }
  }

}
