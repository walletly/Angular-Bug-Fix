import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'src/app/shared/services/main.service';
import { BrandService } from 'src/app/shared/services/brand.service';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @ViewChild('pageSettingsTab') pageSettingsTab;
  @ViewChild('packages') packages;
  @ViewChild('apiSettingsTab') apiSettingsTab;
  @ViewChild('tabsetPaymantTab') tabsetPaymantTab;
  @ViewChild('customDataTab') customDataTab;

  dataCard = {
    brandLogo: '',
    coverImage: ''
  };

  brand;
  api;

  logoName;
  iconName;
  coverName;

  showPaymentDetails;
  toolTipStatus = 'Copy';

  paymentTypeOptions = [
    { value: 'oneTime', label: 'One Time ' },
    { value: 'recurring ', label: 'Recurring ' },
  ];

  photoLogo;
  photoCover;
  photoIcon;
  coverSizeValidation = true;
  brandSizeValidation = true;
  platform;
  container;
  // ibeacon;
  showLogoUploader = false;
  showBrandUploader = false;
  fileImg;
  uploadType;

  customValidation = true;
  customValidationPayment = true;
  customValidationPackages = true;
  // customValidationiBeacon = true;

  showActions;

  myForm: FormGroup;
  myFormPayment: FormGroup;
  myFormPackages: FormGroup;
  // myFormiBeacon: FormGroup;
  showLoader;
  showModalMember;
  userAdmin;
  fbId;
  iconImage;
  inProcces;
  brandAdmins;

  defaultColumns = ["Name", "Icon", "Number of Campaigns", "Number of Coupons", "Pricing", "Status", "Action"];

  categories = [
    "E-commerce", "Infopreneurship", "Professional Consulting", 
    "Celebrity, Artist or Public figure", "Local business or Place",
    "Hotel and Hospitality", "Personal blog",
    "Fun (jokes, community, daily quotes etc)",
    "Organization or Institution", "Other"
  ];

  dataTablePackages = [
    {
      data: {
        "Name": "Basic",
        "Icon": "BASIC",
        "Number of Campaigns": "8",
        "Number of Coupons": "2,000",
        "Pricing": "99$",
        "Status": "Active",
        "Action": ""
      }
    },
    {
      data: {
        "Name": "Basic",
        "Icon": "PRO",
        "Number of Campaigns": "8",
        "Number of Coupons": "2,000",
        "Pricing": "99$",
        "Status": "Active",
        "Action": ""
      }
    },
    {
      data: {
        "Name": "Basic",
        "Icon": "UNLIMITED",
        "Number of Campaigns": "8",
        "Number of Coupons": "2,000",
        "Pricing": "99$",
        "Status": "Active",
        "Action": ""
      }
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private mainService: MainService,
    private brandService: BrandService,
    private uploadService: UploadService
  ) {
    this.myForm = formBuilder.group({
      facebookPageID: ["www.facebook.com/", [Validators.required, Validators.pattern("((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}")]],
      brandName: ["", [Validators.required]],
      profileLogo: [""],
      coverImage: [""],
      description: ["", [Validators.required]],
      moreInfo: ["", []],
      location: ["", []],
      phone: ["", [Validators.pattern("^[+]{0,1}[0-9]+[-\s\/0-9]*$")]],
      email: ["", [Validators.required, Validators.email]],
      website: ["", [Validators.required]],
    });
    this.myFormPackages = formBuilder.group({
      packagesName: ["", [Validators.required]],
      numberOfCampaigns: ["", [Validators.required]],
      numberOfCoupons: ["", [Validators.required]],
      pricing: ["", [Validators.required]],
      iconImage: ["", [Validators.required]]
    });
    // this.myFormiBeacon = formBuilder.group({
    //   ibeacon_uuid: [""],
    //   ibeacon_major: [""],
    //   ibeacon_minor: [""],
    //   ibeacon_notificationtext: ["", [Validators.required]]
    // });
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

    // this.mainService.showLoader.emit(true);
    this.showLoader = true;
    this.goPayment();
    if (JSON.parse(localStorage.getItem('user'))['user_type'] === 4){
      this.userAdmin = true;
    } else {
      this.userAdmin = false;
      this.getBrandSettings();
    }
  }

  // ibeaconToggle(toggle){
  //   if (toggle=='yes'){
  //     this.ibeacon='yes';
  //     this.myFormiBeacon.get('ibeacon_uuid').setValidators([Validators.required,
  //       Validators.pattern("^(?!00)[0-9a-f]{8}[-]{1}(?!00)[0-9a-f]{4}[-]{1}(?!00)[0-9a-f]{4}[-]{1}(?!00)[0-9a-f]{4}[-]{1}(?!00)[0-9a-f]{12}$")]);
  //     this.myFormiBeacon.get('ibeacon_uuid').updateValueAndValidity();
  //     this.myFormiBeacon.get('ibeacon_major').setValidators([Validators.required, Validators.min(0), Validators.max(65535)]);
  //     this.myFormiBeacon.get('ibeacon_major').updateValueAndValidity();
  //     this.myFormiBeacon.get('ibeacon_minor').setValidators([Validators.required, Validators.min(0), Validators.max(65535)]);
  //     this.myFormiBeacon.get('ibeacon_minor').updateValueAndValidity();
  //   }else{
  //     this.ibeacon='no';
  //     this.myFormiBeacon.get('ibeacon_uuid').setValidators([]);
  //     this.myFormiBeacon.get('ibeacon_uuid').updateValueAndValidity();
  //     this.myFormiBeacon.get('ibeacon_major').setValidators([]);
  //     this.myFormiBeacon.get('ibeacon_major').updateValueAndValidity();
  //     this.myFormiBeacon.get('ibeacon_minor').setValidators([]);
  //     this.myFormiBeacon.get('ibeacon_minor').updateValueAndValidity();
  //   }
  // }

  ngOnInit() {
    this.brandService.getBrandAdmins((JSON.parse(localStorage.getItem('currentBrand'))['brand_id'])).subscribe((result)=>{
      this.brandAdmins = result['brand_admins'];
    });
    

  }
  showShared(row, event) {
    console.log(row);
    event.stopPropagation();
    this.showActions = row;
  }
  goPayment() {
    this.mainService.goToPro.subscribe(() => {
      this.pageSettingsTab.active = false;
      this.apiSettingsTab.active = false;
      this.customDataTab.active = false;
      this.packages.active = false;

      this.tabsetPaymantTab.active = true;
      this.showPaymentDetails = true;
    });
  }

  getBrandSettings() {
    this.brandService.getBrandById(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(data => {
      this.brand = data['brand'];
      this.api = this.brand.apikey;
      console.log(this.brand);
      this.getData();
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
      this.goPayment();
    }, err => {
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
      this.goPayment();
    });
  }

  update() {
    if (this.myForm.valid) {
      this.customValidation = true;
      this.inProcces = true;
      this.getBrand();
      console.log(this.brand);
      this.brandService.updateBrand(JSON.parse(localStorage.getItem('currentBrand'))['brand_id'], this.brand).subscribe(result => {
        console.log(result);
        this.brandService.getBrandById(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(data => {
          localStorage.setItem('currentBrand', JSON.stringify(data['brand']));
          this.mainService.showToastrSuccess.emit({text: 'Settings updated'});
          this.inProcces = false;
        }, err => {
          this.inProcces = false;
        });
      }, err2 => {
        this.inProcces = true;
      });
    } else {
      this.customValidation = false;
      this.inProcces = false;
    }
  }

  // updateiBeacon(){
  //   if (this.myFormiBeacon.valid) {
  //     let data;
  //     if(this.ibeacon=='yes'){
  //       data={
  //         'ibeacon': 1,
  //         'ibeacon_uuid': this.myFormiBeacon.get('ibeacon_uuid').value,
  //         'ibeacon_major': this.myFormiBeacon.get('ibeacon_major').value,
  //         'ibeacon_minor': this.myFormiBeacon.get('ibeacon_minor').value,
  //         'ibeacon_notificationtext': this.myFormiBeacon.get('ibeacon_notificationtext').value
  //       }
  //     }else{
  //       data={
  //         'ibeacon': 2,
  //         'ibeacon_uuid': this.brand['ibeacon'].ibeacon_uuid,
  //         'ibeacon_major': this.brand['ibeacon'].ibeacon_major,
  //         'ibeacon_minor': this.brand['ibeacon'].ibeacon_minor,
  //         'ibeacon_notificationtext': this.myFormiBeacon.get('ibeacon_notificationtext').value
  //       }
  //     }
  //     let brand_id = JSON.parse(localStorage.getItem('currentBrand'))['brand_id'];
  //     this.customValidationiBeacon = true;
  //     this.brandService.updateIbeacon(brand_id, data).subscribe(result => {
  //       console.log(result);
  //       this.brandService.getBrandById(brand_id).subscribe(data => {
  //         localStorage.setItem('currentBrand', JSON.stringify(data['brand']));
  //         this.mainService.showToastrSuccess.emit({text: 'Settings updated'});
  //       });
  //     });
  //   } else {
  //     this.customValidationiBeacon = false;
  //   }
  // }

  addPackages(){
    if (this.myFormPackages.invalid){
      this.customValidationPackages = false;
    } else {
      this.customValidationPackages = true;
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
    console.log(file);
    this.iconName = file['srcElement'].files[0].name;
    this.fileImg = file;
    this.uploadType = 'logo';
    this.showLogoUploader = true;
  }

  uploadIcon(file: File) {
    console.log(file);
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
      case 'icon':
        name = this.iconName;
        folder = 'icon';
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
          case 'icon':
            this.photoIcon = result['data'].url;
            break;
          default:
            break;
        }
      }
    });
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
    this.photoCover = this.brand['brand_cover'];
    this.photoLogo = this.brand['brand_logo'];
    this.myForm.controls['facebookPageID'].setValue('www.facebook.com/' + this.brand['facebook_page_id']);
    this.myForm.controls['brandName'].setValue(this.brand['brand_name']);
    this.myForm.controls['description'].setValue(this.brand['description']);
    this.myForm.controls['email'].setValue(this.brand['email']);
    this.myForm.controls['location'].setValue(this.brand['location']);
    this.myForm.controls['moreInfo'].setValue(this.brand['more_info']);
    this.myForm.controls['phone'].setValue(this.brand['phone']);
    this.myForm.controls['website'].setValue(this.brand['website']);
    this.myForm.controls['facebookPageID'].disable();
    this.myForm.controls['brandName'].disable();
    // this.myFormiBeacon.controls['ibeacon_uuid'].setValue(this.brand['ibeacon'].ibeacon_uuid);
    // this.myFormiBeacon.controls['ibeacon_minor'].setValue(this.brand['ibeacon'].ibeacon_minor);
    // this.myFormiBeacon.controls['ibeacon_major'].setValue(this.brand['ibeacon'].ibeacon_major);
    // this.myFormiBeacon.controls['ibeacon_notificationtext'].setValue(this.brand['ibeacon'].ibeacon_notificationtext);
  }

  getBrand() {
    this.fbId = this.myForm.get('facebookPageID').value.split('/');
    this.brand['facebook_page_id'] = this.fbId[this.fbId.length - 1];
    this.brand['brand_name'] = this.myForm.get('brandName').value;
    this.brand['description'] = this.myForm.get('description').value;
    this.brand['email'] = this.myForm.get('email').value;
    this.brand['location'] = this.myForm.get('location').value;
    this.brand['more_info'] = this.myForm.get('moreInfo').value;
    this.brand['phone'] = this.myForm.get('phone').value;
    this.brand['website'] = this.myForm.get('website').value;
    this.brand['brand_cover'] = this.photoCover;
    this.brand['brand_logo'] = this.photoLogo;
  }

  mouseMove() {
    this.toolTipStatus = 'Copy';
  }

  copyApi() {
    this.toolTipStatus = 'Copied';
  }
}
