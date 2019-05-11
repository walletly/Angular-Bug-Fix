import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { SERVER_URL } from '../../../environments/environment';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss']
})
export class ForgetPassComponent implements OnInit {
  customValidation = true;
  resetConfirm;
  myForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private firebaseAuth: AngularFireAuth) {

    this.myForm = formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  send() {
    if (this.myForm.valid) {
      this.customValidation = true;
      this.firebaseAuth.auth.sendPasswordResetEmail(this.myForm.get('email').value, { url: SERVER_URL + 'auth/login' });
      this.resetConfirm = true;
    } else {
      this.customValidation = false;
    }
  }

}
