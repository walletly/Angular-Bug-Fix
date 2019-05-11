import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'src/app/shared/services/main.service';
import { BrandService } from 'src/app/shared/services/brand.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @ViewChild('pageSettingsTab') pageSettingsTab;
  @ViewChild('apiSettingsTab') apiSettingsTab;
  @ViewChild('tabsetPaymantTab') tabsetPaymantTab;
  @ViewChild('customDataTab') customDataTab;

  dataCard = {
    brandLogo: '',
    coverImage: ''
  };

  brand;
  api;

  showPaymentDetails;
  toolTipStatus = 'Copy';

  paymentTypeOptions = [
    { value: 'oneTime', label: 'One Time ' },
    { value: 'recurring ', label: 'Recurring ' },
  ];

  photoLogo;
  photoCover;
  coverSizeValidation = true;
  brandSizeValidation = true;
  platform;
  container;

  customValidation = true;
  customValidationPayment = true;

  myForm: FormGroup;
  myFormPayment: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private mainService: MainService,
    private brandService: BrandService
  ) {
    this.myForm = formBuilder.group({
      facebookPageID: ["www.facebook.com/", [Validators.required, Validators.pattern("((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}")]],
      brandName: ["", [Validators.required]],
      profileLogo: [""],
      coverImage: [""],
      description: ["", [Validators.required]],
      moreInfo: ["", [Validators.required]],
      location: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      website: ["", [Validators.required, Validators.pattern("http(s?):\/\/[a-zA-Z0-9.]+[\/]*[a-zA-Z0-9.]*[\/]*")]],
    });
    this.myFormPayment = formBuilder.group({
      plan: ["", [Validators.required]],
      type: ["", [Validators.required]],
      yourName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      address: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      zip: ["", [Validators.required, Validators.pattern('[0-9]{5}')]],
      country: ["", [Validators.required]],
      paymentMethod: ["", [Validators.required]],
      nameOnCard: ["", [Validators.required]],
      cardNumber: ["", [Validators.required, Validators.pattern('((\[0-9]{4}[-. ]?){4}|\[0-9]{4}[-. ]?\[0-9]{6}[-. ]?\[0-9]{5})')]],
      expirationMounth: ["", [Validators.required]],
      expirationYear: ["", [Validators.required]],
      cvc: ["", [Validators.required, Validators.pattern('[0-9]{3}')]],
    });

    brandService.getBrandById(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(data => {
      this.brand = data['brand'];
      this.api = this.brand.apikey;
      console.log(this.brand);
      this.getData();
    });
  }

  ngOnInit() {
    console.log(this.tabsetPaymantTab);

    this.mainService.goToPro.subscribe(() => {
      this.pageSettingsTab.active = false;
      this.apiSettingsTab.active = false;
      this.customDataTab.active = false;

      this.tabsetPaymantTab.active = true;
      this.showPaymentDetails = true;
    });
  }

  update() {
    if (this.myForm.valid) {
      this.customValidation = true;
      this.getBrand();
      console.log(this.brand);
      this.brandService.updateBrand(JSON.parse(localStorage.getItem('currentBrand'))['brand_id'], this.brand).subscribe(result => {
        console.log(result);
      });
    } else {
      this.customValidation = false;
    }
  }

  submitPayment() {
    if (this.myFormPayment.valid) {
      this.customValidationPayment = true;
    } else {
      this.customValidationPayment = false;
    }
  }

  uploadLogo(file: File) {
    if (file[0].size / 1024 / 1024 <= 1) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = document.createElement('img');
        img.src = reader.result as string;
        this.brandSizeValidation = true;

        img.onload = () => {
          if ((img.naturalWidth <= 110 && img.naturalHeight <= 110) && (img.naturalWidth >= 55 && img.naturalHeight >= 55)) {
            this.photoLogo = reader.result as string;
            this.dataCard.brandLogo = this.photoLogo;
            this.brandSizeValidation = true;
          } else {
            this.brandSizeValidation = false;
          }
        };
      };

      reader.readAsDataURL(file[0]);
    } else {
      this.brandSizeValidation = false;
    }
  }

  uploadCover(file: File) {
    if (file[0].size / 1024 / 1024 <= 4) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = document.createElement('img');
        img.src = reader.result as string;

        this.coverSizeValidation = true;
        img.onload = () => {
          if ((img.naturalWidth <= 750 && img.naturalHeight <= 294) && (img.naturalWidth >= 375 && img.naturalHeight >= 147)) {
            this.photoCover = reader.result as string;
            this.dataCard.coverImage = this.photoCover;
            this.coverSizeValidation = true;
          } else {
            this.coverSizeValidation = false;
          }
        };
      };

      reader.readAsDataURL(file[0]);
    } else {
      this.coverSizeValidation = false;
    }
  }

  deleteImg(name) {
    if (name === 'photoCover') {
      this.myForm.controls.coverImage.reset();
      this.photoCover = null;
      this.dataCard.coverImage = '';
    }
    if (name === 'photoLogo') {
      this.myForm.controls.profileLogo.reset();
      this.photoLogo = null;
      this.dataCard.brandLogo = '';
    }
  }

  getData() {
    // this.myForm.controls['coverImage'].setValue(this.brand['brand_cover']);
    // this.myForm.controls['profileLogo'].setValue(this.brand['brand_logo']);
    // this.photoCover = this.brand['brand_cover'];
    // this.photoLogo = this.brand['brand_logo'];
    this.myForm.controls['facebookPageID'].setValue('www.facebook.com/' + this.brand['facebook_page_id']);
    this.myForm.controls['brandName'].setValue(this.brand['brand_name']);
    this.myForm.controls['description'].setValue(this.brand['description']);
    this.myForm.controls['email'].setValue(this.brand['email']);
    this.myForm.controls['location'].setValue(this.brand['location']);
    this.myForm.controls['moreInfo'].setValue(this.brand['more_info']);
    this.myForm.controls['phone'].setValue(this.brand['phone']);
    this.myForm.controls['website'].setValue(this.brand['website']);
  }

  getBrand() {
    const fbId = this.myForm.get('facebookPageID').value.split('/');
    this.brand['facebook_page_id'] = fbId[fbId.length - 1];
    this.brand['brand_name'] = this.myForm.get('brandName').value;
    this.brand['description'] = this.myForm.get('description').value;
    this.brand['email'] = this.myForm.get('email').value;
    this.brand['location'] = this.myForm.get('location').value;
    this.brand['more_info'] = this.myForm.get('moreInfo').value;
    this.brand['phone'] = this.myForm.get('phone').value;
    this.brand['website'] = this.myForm.get('website').value;
    this.brand['brand_cover'] = this.myForm.get('coverImage').value;
    this.brand['brand_logo'] = this.myForm.get('profileLogo').value;
  }

  mouseMove() {
    this.toolTipStatus = 'Copy';
  }

  copyApi() {
    this.toolTipStatus = 'Copied';
  }
}
