import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UploadService } from 'src/app/shared/services/upload.service';
import { BrandService } from 'src/app/shared/services/brand.service';
import { CardService } from 'src/app/shared/services/card.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MainService } from 'src/app/shared/services/main.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-fb-connect',
  templateUrl: './fb-connect.component.html',
  styleUrls: ['./fb-connect.component.scss']
})
export class FbConnectComponent implements OnInit {
  @ViewChild('stepper') stepper;

  loader = false;
  platform;
  // ibeacon = 'no';
  api = '9945f3ab-5de4-4769-b630-5c6520203d7a';
  stepIndex;
  toolTipStatus;
  showLoader;
  FbPages = true;

  photoLogo;
  photoCover;
  coverSizeValidation = true;
  brandSizeValidation = true;

  customValidationStep1 = true;
  customValidationStep2 = true;
  customValidationStep3 = true;

  businessTypes = [
    "E-commerce", "Infopreneurship", "Professional Consulting", 
    "Celebrity, Artist or Public figure", "Local business or Place",
    "Hotel and Hospitality", "Personal blog",
    "Fun (jokes, community, daily quotes etc)",
    "Organization or Institution", "Other"
  ];

  partners = [];

  myFormStep1: FormGroup;
  myFormStep2: FormGroup;
  myFormStep3: FormGroup;

  showLogoUploader = false;
  showBrandUploader = false;
  fileImg;
  coverName;
  logoName;
  uploadType;

  fbId;
  fbResponse;
  fbBrands;
  userBrands;
  brands = [];
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
  inProcces;
  selectedPageId;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private uploadService: UploadService,
    private brandService: BrandService,
    private cardService: CardService,
    private authService: AuthService,
    private mainService: MainService,
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private _sanitizer: DomSanitizer
  ) {

    this.getPartners();
    

    this.myFormStep1 = formBuilder.group({
      facebookPageID: ['www.facebook.com/'],
      fakeData: ['', [Validators.required]]
    });
     
    this.myFormStep2 = formBuilder.group({
      facebookPageID: [this.myFormStep1.get('facebookPageID').value, [Validators.required, Validators.pattern("((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}")]],
      brandName: ["", [Validators.required]],
      profileLogo: ["", [Validators.required]],
      coverImage: ["", [Validators.required]],
      description: ["", [Validators.required]],
      moreInfo: ["", []],
      location: ["", []],
      phone: ["", [Validators.pattern("^[+]{0,1}[0-9]+[-\s\/0-9]*$")]],
      email: ["", [Validators.required, Validators.email]],
      website: ["", [Validators.required]],
    });

    // this.myFormStep1 = formBuilder.group({
    //   facebookPageID: ['www.facebook.com/'],
    //   fakeData: ['', []]
    // });
     
    // this.myFormStep2 = formBuilder.group({
    //   facebookPageID: [this.myFormStep1.get('facebookPageID').value, []],
    //   brandName: ["", []],
    //   profileLogo: ["", []],
    //   coverImage: ["", []],
    //   description: ["", []],
    //   moreInfo: ["", []],
    //   location: ["", []],
    //   phone: ["", []],
    //   email: ["", []],
    //   website: ["", []],
    // });

    this.myFormStep3 = formBuilder.group({
      noOfStaff: ["", [Validators.required, Validators.min(1)]],
      businessType: ["", [Validators.required]],
      noOfLocations: ["", [Validators.required, Validators.min(1)]],
      brandPartner: ["", [Validators.required]]
    });
}

  ngOnInit() {
    this.showLoader = true;
    this.http.get('https://graph.facebook.com/v3.3/me/accounts?fields=cover,name,picture&access_token='
      + localStorage.getItem('access') + '&limit=1000').subscribe((res) => {
      console.log(res);
      if(res['data'].length < 1){
        this.FbPages = false;
      }
      this.fbBrands = res['data'];
      this.brandService.getUsersBrands(localStorage.getItem('userID')).subscribe(result => {
        this.userBrands = result['data']['brands'];
        console.log(this.userBrands);
        this.brands = this.fbBrands;
        this.showLoader = false;
      }, err => {
        console.log(err);
        if (err.error.message === 'brands not found') {
          this.brands = this.fbBrands;
          this.showLoader = false;
        } else {
          this.showLoader = false;
        }
      });
    }, error =>{
      console.log(error);
      this.showLoader = false;
      this.FbPages = false;
    });
  }

  checkUsersBrand(fbBrandId) {
    let isMatch = false;

    if (this.userBrands) {
      this.userBrands.forEach(element => {
        if (element.brand_id === fbBrandId) {
          isMatch = true;
        }
      });
      return isMatch;
    } else {
      return false;
    }
  }

  goStep2(id) {
    this.selectedPageId = id;
    this.inProcces = true;
    this.myFormStep1.controls['fakeData'].setValue('true');

    this.loader = true;
    this.fbId = id;
    this.authService.getFacebookInfo(this.fbId).subscribe(data => {
      console.log(data);
      if (data['success']) {
        console.log(data);
        this.loader = false;
        this.fbResponse = data['data'];
        console.log(this.fbResponse);
      } else {
        this.loader = false;
      }

      const connectingBrand = {
        brand_id: this.fbResponse['brand_id'],
        user_admin_id: localStorage.getItem('userID'),
        brand_name: this.fbResponse['brand_name'],
        brand_logo: this.fbResponse['profile_logo'],
        facebook_page_id: this.fbResponse['brand_id'],
        is_facebook: true
      };
      this.brandService.connectBrand(connectingBrand).subscribe(async result => {
        this.setActiveBrandAndUpdateUser(result['brand_id']);
        if(result['code'] == 602){
          this.router.navigate(['/main/dashboard']);
          return;
        }
        let ibeaconData ={
          'ibeacon': 2,
          'ibeacon_notificationtext': `You are near ${this.fbResponse['brand_name']} Store. Get your coupon scanned for the discounts`
        }
        await this.brandService.addIbeacon(this.fbResponse['brand_id'], ibeaconData).subscribe(async result => {});
        if (result['success']) {
          this.api = result['apikey'];
          this.loader = false;
          this.inProcces = false;
          this.setActiveBrandAndUpdateUser(id);
          if (result['code'] === 602) {
            this.setActiveBrandAndUpdateUser(id);
            this.loader = false;
            this.inProcces = false;
          }
          if (result['code'] !== 602 && result['code'] !== 603) {
            this.setActiveBrandAndUpdateUser(id);
            this.stepper.next();
            this.setForm2();
            // this.photoCover = this.fbResponse['cover_image'];
            this.photoLogo = this.fbResponse['profile_logo'];
            this.myFormStep2.controls['facebookPageID'].setValue('www.facebook.com/' + this.fbResponse.brand_id);
          }

        }
      }, err => {
        console.log(err);
        if (err['error'].code === 603) {
          this.setActiveBrandAndUpdateUser(id);
          this.loader = false;
          this.inProcces = false;
        }
      });

    }, err => {
      this.loader = false;
      this.inProcces = false;
    });

    this.customValidationStep1 = true;
  }

  goStep2Empty() {
    // this.stepper.next();
    window.location.href = 'https://www.facebook.com/pages/creation/';
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

  setActiveBrandAndUpdateUser(id) {
    this.loader = true;
    forkJoin([this.brandService.getBrandById(id),
    this.authService.updateUser(localStorage.getItem('userID'), { activeBrand: id })]).subscribe(results => {
      const brandResult = results[0];
      const userResult = results[1];
      localStorage.setItem('currentBrand', JSON.stringify(brandResult['brand']));
      // this.router.navigate(['/main/dashboard']);
      this.loader = false;
    }, err => {
      if (err['error'].status === 401 && err['error'].statusText === 'Unauthorized') {
        this.logout();
      }
      console.log(err);
      this.loader = false;
    });
  }

  redirectToDashboard(id?) {
    if(this.inProcces){
      return;
    }
    if (id) {
      this.inProcces = true;
      this.setActiveBrandAndUpdateUser(id);
      setTimeout(() => {
        this.router.navigate(['/main/dashboard']);
        this.inProcces = false;
      }, 2000);
    } else {
      this.inProcces = true;
      let isBrand;
      isBrand = JSON.parse(localStorage.getItem('user')).activeBrand;
      if (isBrand) {
        this.router.navigate(['/main/dashboard']);
        this.inProcces = false;
      }
    }
  }

  async goDashboard() {
    if (this.myFormStep3.valid) {
      let data = {
        'noOfStaff': this.myFormStep3.get('noOfStaff').value,
        'businessType': this.myFormStep3.get('businessType').value,
        'noOfLocations': this.myFormStep3.get('noOfLocations').value,
        'brandPartner' : this.myFormStep3.get('brandPartner').value
      }
      let brand_id = this.fbResponse['brand_id'];
      await this.brandService.updateBrand(brand_id, data).subscribe(async result => {
        console.log(result);
      });
      this.router.navigate(['/main/dashboard']);
      this.customValidationStep3 = true;
    } else {
      this.customValidationStep3 = false;
    }
  }

  uploadLogo(file: File) {
    console.log(file);
    this.logoName = file['srcElement'].files[0].name;
    this.fileImg = file;
    this.uploadType = 'logo';
    this.showLogoUploader = true;
  }

  uploadCover(file: File) {
    this.coverName = file['srcElement'].files[0].name;
    this.fileImg = file;
    this.uploadType = 'brand';
    this.showBrandUploader = true;
  }

  setForm2() {
    this.myFormStep2.controls['brandName'].setValue(this.fbResponse.brand_name);
    this.myFormStep2.controls['description'].setValue(this.fbResponse.description);
    this.myFormStep2.controls['email'].setValue(this.fbResponse.email);
    this.myFormStep2.controls['moreInfo'].setValue(this.fbResponse.more_info);
    this.myFormStep2.controls['phone'].setValue(this.fbResponse.phone);
    const webSite = this.fbResponse.website.split(' ')[0];
    this.myFormStep2.controls['website'].setValue(webSite);
    this.myFormStep2.controls['location'].setValue(this.getLocation());
  }

  createBrand() {
    this.inProcces = true;

    this.brand['brand_id'] = this.fbResponse['brand_id'];
    this.brand.brand_cover = this.photoCover;
    this.brand.brand_logo = this.photoLogo;
    this.brand.brand_name = this.myFormStep2.get('brandName').value;
    this.brand.description = this.myFormStep2.get('description').value;
    this.brand.email = this.myFormStep2.get('email').value;
    const fbId = this.myFormStep2.get('facebookPageID').value.split('/');
    this.brand.facebook_page_id = fbId[fbId.length - 1];
    this.brand.location = this.myFormStep2.get('location').value;
    this.brand.more_info = this.myFormStep2.get('moreInfo').value;
    this.brand.phone = this.myFormStep2.get('phone').value;
    this.brand.user_admin_id = localStorage.getItem('userID');
    this.brand.website = this.myFormStep2.get('website').value;
    console.log(this.brand);

    this.brandService.updateBrand(this.brand['brand_id'], this.brand).subscribe(async result => {
      console.log(result);
      if (result['success']) {
        this.authService.updateUser(this.brand.user_admin_id, { activeBrand: this.brand['brand_id'] }).subscribe(res => {
          if (res['success']) {
            this.brandService.getBrandById(this.brand['brand_id']).subscribe((brandData)=>{
              localStorage.setItem('currentBrand', JSON.stringify(brandData['brand']));
            })
            this.inProcces = false;
            this.mainService.showToastrSuccess.emit({text: 'Brand created'});
            this.stepper.next();
          }
        }, err => {
          this.inProcces = false;
          this.messError = err;
        });
      }
    }, err => {
      this.inProcces = false;
      this.messError = err;
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

  getLocation() {
    let location = '';
    if (this.fbResponse.location) {
      if (this.fbResponse.location['state']) {
        location = this.fbResponse.location['state'];
      }
      if (this.fbResponse.location['city']) {
        if (location) {
          location += ', ' + this.fbResponse.location['city'];
        } else {
          location += this.fbResponse.location['city'];
        }
      }
      if (this.fbResponse.location['country']) {
        if (location) {
          location += ', ' + this.fbResponse.location['country'];
        } else {
          location += this.fbResponse.location['country'];
        }
      }

      return location;
    } else {
      return '';
    }
  }

  uploadPhoto(event, fileType) {
    let name;
    let folder;
    switch (fileType) {
      case 'logo':
        name = this.logoName;
        folder = 'logo';
        break;
      case 'cover':
        name = this.coverName;
        folder = 'cover';
        break;
      default:
        break;
    }

    const formData = new FormData();
    formData.append('image', event, name);

    this.uploadService.uploadPhoto(formData, this.fbId + '_' + folder).subscribe(result => {
      if (result['success']) {
        switch (fileType) {
          case 'logo':
            this.photoLogo = result['data'].url;
            break;
          case 'cover':
            this.photoCover = result['data'].url;
            break;
          default:
            break;
        }
      }
    });
  }

  logout() {
    this.firebaseAuth.auth.signOut().then(() => {
      localStorage.clear();
      localStorage.setItem('loggedOut', 'true');
      this.router.navigate(['/fb-login']);
    });
  }

  async getPartners(){
    const partnerRef = this.afs.collection('walletly_partners');
    await partnerRef.valueChanges().subscribe(items => {
      this.partners = items;
    });
  }

  // getPartnerPicture(image){
  //   return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  // }

}
