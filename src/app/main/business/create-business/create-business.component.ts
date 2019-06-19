import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BusinessService } from 'src/app/shared/services/business.service';

@Component({
  selector: 'app-create-business',
  templateUrl: './create-business.component.html',
  styleUrls: ['./create-business.component.scss']
})
export class CreateBusinessComponent implements OnInit {
  @ViewChild('select') select;

  showAletr = false;
  id;
  inProcces = false;

  options = [
    { value: true, label: 'YES' },
    { value: false, label: 'NO' },
  ];

  data = {
    firstname: '',
    lastname: '',
    permission: '',
    phone: '',
    email: '',
    user_id: localStorage.getItem('userID')
  };

  myForm: FormGroup;
  customValidation = true;
  showLoader;

  constructor(private mainService: MainService,
    private formBuilder: FormBuilder,
    private router: Router,
    private business: BusinessService,
    private activeRout: ActivatedRoute
  ) {
    this.myForm = formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      permission: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
    });

    this.id = this.activeRout.snapshot.paramMap.get('id');

    if (this.id) {
      this.showLoader = true;
      // this.mainService.showLoader.emit(true);
      business.getBusinessById(this.id).subscribe(result => {
        console.log(result);
        this.data = result['data'];
        // this.mainService.showLoader.emit(false);
        this.showLoader = false;
      }, err => {
        // this.mainService.showLoader.emit(false);
        this.showLoader = false;
      });
    }
  }

  ngOnInit() {
    this.data = {
      firstname: '',
      lastname: '',
      permission: '',
      phone: '',
      email: '',
      user_id: localStorage.getItem('userID')
    };
  }

  closeAlert() {
    this.showAletr = false;
  }

  save() {
    this.inProcces = true;
    if (this.myForm.valid) {
      this.customValidation = true;
      // this.mainService.addBusiness(this.data);
      this.data['brand_id'] = JSON.parse(localStorage.getItem('currentBrand'))['brand_id'];
      console.log(this.data);
      this.business.createBusiness(this.data).subscribe(result => {
        console.log(result);
        if (result['success']) {
          // this.showAletr = true;
          this.mainService.showToastrSuccess.emit({text: 'User added'});
          this.router.navigate(['/main/business/business-page']);
          this.inProcces = false;
        }
      });
    } else {
      this.customValidation = false;
      this.inProcces = false;
    }
  }

  addUser() {
    this.inProcces = true;
    if (this.myForm.valid) {
      this.customValidation = true;
      // this.mainService.addBusiness(this.data);
      this.data['brandIdToLink'] = JSON.parse(localStorage.getItem('currentBrand'))['brand_id'];
      console.log(this.data);
      this.data['is_active'] = true;
      this.business.addUser(this.data).subscribe(result => {
        console.log(result);
        if (result['success']) {
          // this.showAletr = true;
          this.mainService.showToastrSuccess.emit({text: 'User added'});
          this.router.navigate(['/main/business/business-page']);
          this.inProcces = false;
        } else {
          this.inProcces = false;
        }
      });
    } else {
      this.customValidation = false;
      this.inProcces = false;
    }
  }

  update() {
    this.inProcces = true;
    if (this.myForm.valid) {
      this.customValidation = true;
      // this.mainService.addBusiness(this.data);
      this.data['brand_id'] = JSON.parse(localStorage.getItem('currentBrand'))['brand_id'];
      console.log(this.data);
      this.business.updateBusiness(this.id, this.data).subscribe(result => {
        console.log(result);
        if (result['success']) {
          // this.showAletr = true;
          this.mainService.showToastrSuccess.emit({text: 'User updated'});
          this.router.navigate(['/main/business/business-page']);
          this.inProcces = false;
        }
      });
    } else {
      this.customValidation = false;
      this.inProcces = false;
    }
  }

  clear() {
    this.select.reset();
    this.data = {
      firstname: '',
      lastname: '',
      permission: '',
      phone: '',
      email: '',
      user_id: ''
    };
  }
}
