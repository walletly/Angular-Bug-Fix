import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/shared/services/upload.service';
import { BrandService } from 'src/app/shared/services/brand.service';
import { CardService } from 'src/app/shared/services/card.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-connect-page',
  templateUrl: './connect-page.component.html',
  styleUrls: ['./connect-page.component.scss']
})
export class ConnectPageComponent implements OnInit {

  @ViewChild('stepper') stepper;

  loader = false;
  platform;
  api = '9945f3ab-5de4-4769-b630-5c6520203d7a';
  stepIndex;
  toolTipStatus;

  photoLogo;
  photoCover;
  coverSizeValidation = true;
  brandSizeValidation = true;

  customValidationStep1 = true;
  customValidationStep2 = true;
  customValidationStep3 = true;

  myFormStep1: FormGroup;
  myFormStep2: FormGroup;
  myFormStep3: FormGroup;

  fbResponse;
  brand = {
    user_admin_id: '',
    brand_name: '',
    phone: '',
    location: [],
    is_facebook: true,
    brand_logo: '',
    brand_cover: '',
    description: '',
    facebook_page_id: '',
    more_info: '',
    email: '',
    website: '',
  };

  terms;
  messError;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private uploadService: UploadService,
    private brandService: BrandService,
    private cardService: CardService,
    private authService: AuthService
  ) {

    this.myFormStep1 = formBuilder.group({
      facebookPageID: ["www.facebook.com/", [Validators.required, Validators.pattern("((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}")]]
    });

    this.myFormStep2 = formBuilder.group({
      facebookPageID: [this.myFormStep1.get('facebookPageID').value, [Validators.required, Validators.pattern("((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}")]],
      brandName: ["", [Validators.required]],
      profileLogo: ["", [Validators.required]],
      coverImage: ["", [Validators.required]],
      description: ["", [Validators.required]],
      moreInfo: ["", [Validators.required]],
      location: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      website: ["", [Validators.required, Validators.pattern("http(s?):\/\/[a-zA-Z0-9.]+[\/]*[a-zA-Z0-9.]*[\/]*")]],
    });

    this.myFormStep3 = formBuilder.group({
      apiKey: ["", [Validators.required]],
    });
  }

  ngOnInit() {
  }

  goStep2() {
    if (this.myFormStep1.valid) {
      this.loader = true;
      const fbId = this.myFormStep1.get('facebookPageID').value.split('/');
      this.authService.getFacebookInfo(fbId[fbId.length - 1]).subscribe(data => {
        console.log(data);
        if (data['success']) {
          console.log(data);
          this.loader = false;
          this.fbResponse = data['data'];
          console.log(this.fbResponse);
          this.stepper.next();
          this.setForm2();
          this.photoCover = this.fbResponse['cover_image'];
          this.photoLogo = this.fbResponse['profile_logo'];
          this.myFormStep2.controls['facebookPageID'].setValue(this.myFormStep1.get('facebookPageID').value);
        } else {
          this.loader = false;
        }
      });
      this.loader = false;
      // setTimeout(() => {
      //   this.loader = false;
      //   this.stepper.next();
      //   this.myFormStep2.controls['facebookPageID'].setValue(this.myFormStep1.get('facebookPageID').value);
      // }, 1000);
      this.customValidationStep1 = true;
    } else {
      this.customValidationStep1 = false;
      this.messError = 'Validation Error';
    }
  }

  goStep3() {
    if (this.uploadCover && this.uploadLogo) {
      this.myFormStep2.controls['profileLogo'].setErrors(null);
      this.myFormStep2.controls['coverImage'].setErrors(null);
    }
    if (this.myFormStep2.valid) {
      this.createBrand();
      this.customValidationStep2 = true;
    } else {
      this.customValidationStep2 = false;
      this.messError = 'Validation Error';
    }
  }

  goDashboard() {
    if (this.myFormStep3.valid) {
      this.router.navigate(['/main/dashboard']);
      this.customValidationStep3 = true;
    } else {
      this.customValidationStep3 = false;
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
            // const load = new FormData();
            // load.append('image', file[0]);
            // this.uploadService.uploadPhoto(load).subscribe(result => {
            //   console.log(result);
            //   if (result['success']) {
            //     this.photoLogo = result['data']['url'];
            //   } else {
            //     this.brandSizeValidation = false;
            //   }
            // });
            this.photoLogo = reader.result as string;
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

  setForm2() {
    this.myFormStep2.controls['brandName'].setValue(this.fbResponse.brand_name);
    this.myFormStep2.controls['description'].setValue(this.fbResponse.description);
    this.myFormStep2.controls['email'].setValue(this.fbResponse.email);
    this.myFormStep2.controls['moreInfo'].setValue(this.fbResponse.more_info);
    this.myFormStep2.controls['phone'].setValue(this.fbResponse.phone);
    const webSite = this.fbResponse.website.split(' ')[0];
    this.myFormStep2.controls['website'].setValue(webSite);
    if (this.fbResponse.location && this.fbResponse.location['latitude'] && this.fbResponse.location['longitude']) {
      this.myFormStep2.controls['location'].setValue(this.fbResponse.location['latitude'] + ',' + this.fbResponse.location['longitude']);
    } else {
      this.myFormStep2.controls['location'].setValue('');
    }
  }

  createBrand() {
    // this.brand['brand_id'] = Math.random() * (1000 - 1) + 1000;
    // this.brand.brand_cover = this.myFormStep2.get('coverImage').value;
    // this.brand.brand_logo = this.myFormStep2.get('profileLogo').value;

    this.brand['brand_id'] = this.fbResponse['brand_id'];
    this.brand.brand_cover = this.photoCover;
    this.brand.brand_logo = this.photoLogo;
    this.brand.brand_name = this.myFormStep2.get('brandName').value;
    this.brand.description = this.myFormStep2.get('description').value;
    this.brand.email = this.myFormStep2.get('email').value;
    const fbId = this.myFormStep2.get('facebookPageID').value.split('/');
    this.brand.facebook_page_id = fbId[fbId.length - 1];
    this.brand.location = this.myFormStep2.get('location').value.split(',');
    this.brand.more_info = this.myFormStep2.get('moreInfo').value;
    this.brand.phone = this.myFormStep2.get('phone').value;
    this.brand.user_admin_id = localStorage.getItem('userID');
    this.brand.website = this.myFormStep2.get('website').value;
    console.log(this.brand);

    this.brandService.createBrand(this.brand).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.api = result['apiKey'];
        this.authService.updateUser(this.brand.user_admin_id, this.brand['brand_id']).subscribe(res => {
          if (result['success']) {
            localStorage.setItem('currentBrand', JSON.stringify(this.brand));
            this.stepper.next();
          }
        }, err => {
          this.messError = err.error.error;
        });
      }
    }, err => {
      this.messError = err.error.error;
    });
  }

  deleteImg(name) {
    if (name === 'photoCover') {
      this.myFormStep2.controls.coverImage.reset();
      this.photoCover = null;
    }
    if (name === 'photoLogo') {
      this.myFormStep2.controls.profileLogo.reset();
      this.photoLogo = null;
    }
  }

  mouseMove() {
    this.toolTipStatus = 'Copy';
  }

  copyApi() {
    this.toolTipStatus = 'Copied';
  }
}
