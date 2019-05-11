import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-business',
  templateUrl: './create-business.component.html',
  styleUrls: ['./create-business.component.scss']
})
export class CreateBusinessComponent implements OnInit {
  @ViewChild('select') select;

  showAletr = true;

  options = [
    { value: 'YES', label: 'YES' },
    { value: 'NO', label: 'NO' },
  ];

  data = {
    firstName: '',
    lastName: '',
    permission: '',
    phoneNumber: '',
    emailAddress: ''
  }

  myForm: FormGroup;
  customValidation = true;

  constructor(private mainService: MainService, private formBuilder: FormBuilder, private router: Router) {
    this.myForm = formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      permission: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
    });
  }
  ngOnInit() {
  }

  closeAlert() {
    this.showAletr = false;
  }

  save() {
    if (this.myForm.valid) {
      this.customValidation = true;
      this.mainService.addBusiness(this.data);
      this.router.navigate(['/main/business/business-page']);
    } else {
      this.customValidation = false;
    }
  }
  clear() {
    this.select.reset()
    this.data = {
      firstName: '',
      lastName: '',
      permission: '',
      phoneNumber: '',
      emailAddress: ''
    }
  }
}
