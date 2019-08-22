import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'src/app/shared/services/main.service';
import { BrandService } from 'src/app/shared/services/brand.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ManychatService } from '../../shared/services/manychat.service';


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
  @ViewChild('integrationsTab') integrationTab;

  dataCard = {
    brandLogo: '',
    coverImage: ''
  };

  brand;
  api;


  logoName;
  iconName;
  coverName;

  WrongApi = false;


  showPaymentDetails;
  toolTipStatus = 'Copy';

  paymentTypeOptions = [
    { value: 'oneTime', label: 'One Time ' },
    { value: 'recurring ', label: 'Recurring ' },
  ];

  partners = [];

  photoLogo;
  photoCover;
  photoIcon;
  coverSizeValidation = true;
  brandSizeValidation = true;
  platform;
  container;
  showLogoUploader = false;
  showBrandUploader = false;
  fileImg;
  uploadType;

  customValidation = true;
  customValidationPayment = true;
  customValidationPackages = true;

  showActions;

  manyChatApiForm: FormGroup;

  myForm: FormGroup;
  myFormPayment: FormGroup;
  myFormPackages: FormGroup;
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
    private uploadService: UploadService,
    private afs: AngularFirestore,
    private manychatService: ManychatService) {
    this.getPartners();

    this.manyChatApiForm = formBuilder.group({
      manyChatApi: ['', [Validators.required]],
    });

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
      brandPartner: ["", [Validators.required]],
      currency: ["", [Validators.required]],
    });
    this.myFormPackages = formBuilder.group({
      packagesName: ["", [Validators.required]],
      numberOfCampaigns: ["", [Validators.required]],
      numberOfCoupons: ["", [Validators.required]],
      pricing: ["", [Validators.required]],
      iconImage: ["", [Validators.required]]
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

  ngOnInit() {
    this.brandService.getBrandAdmins((JSON.parse(localStorage.getItem('currentBrand'))['brand_id'])).subscribe((result) => {
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
      this.integrationTab.active = false;

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

  async update() {
    if (this.myForm.valid) {
      this.customValidation = true;
      this.inProcces = true;
      await this.getBrand();
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
    this.logoName = file['srcElement'].files[0].name;
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

  async getData() {

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
    this.myForm.controls['currency'].setValue(this.brand['currency']);
    this.myForm.controls['facebookPageID'].disable();
    this.myForm.controls['brandName'].disable();

    this.manyChatApiForm.controls['manyChatApi'].setValue(this.brand['manychatAPI']);

    setTimeout(() => {
      const partnerId = (this.brand['brandPartner']) ? this.brand['brandPartner'].id || 'none' : 'none';
      this.myForm.controls['brandPartner'].setValue(partnerId);
    }, 500);
  }

  async getBrand() {
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
    this.brand['currency'] = this.myForm.get('currency').value;
    const partnerData = await this.getPartnerData(this.myForm.get('brandPartner').value);
    this.brand['brandPartner'] = partnerData;
  }

  mouseMove() {
    this.toolTipStatus = 'Copy';
  }

  copyApi() {
    this.toolTipStatus = 'Copied';
  }

  async getPartners(){
    const partnerRef = this.afs.collection('walletly_partners');
    await partnerRef.valueChanges().subscribe(items => {
      this.partners = items;
    });
  }

  async getPartnerData(id){
    if (id == 'none'){
      return 'none';
    }
    let partnerData;
    await this.partners.forEach(partner => {
      if (partner.id == id){
        partnerData = partner;
      }
    })
    return partnerData;
  }
  async manychatAPIReceived() {
    if (this.manyChatApiForm.valid) {
      this.inProcces = true;

      const manyChatApi = this.manyChatApiForm.get('manyChatApi').value;
      const manyChatApiBrand = manyChatApi.split(':');
      // console.log(manyChatApi);
      // console.log('from API', manyChatApiBrand[0]);
      // console.log(this.brand['facebook_page_id']);

      if (manyChatApiBrand[0] === this.brand['facebook_page_id']) {
        this.manychatService.getCustomFields(manyChatApi).subscribe( result => {
          if (result) {
            console.log(result['data']);
            this.brandService.updateBrand(JSON.parse(localStorage.getItem('currentBrand'))['brand_id'],
            {'manychatAPI': manyChatApi}).subscribe(check => {
              console.log(check);
              this.inProcces = false;
              this.WrongApi = false;
              this.mainService.showToastrSuccess.emit({text: 'Integration saved'});
            }, err => {
              console.log(err);
            });
          }
        }, err => {
          if (err) {
            console.log(err.message);
            this.inProcces = false;
            this.WrongApi = true;
          }
        });
      } else {
        setTimeout(() => {
          this.inProcces = false;
          this.WrongApi = true;
        }, 800);
      }
    } else {
      this.customValidation = false;
      this.inProcces = false;
    }
  }
  // selectedTab(evt) {
  //   console.log(evt.tabTitle);
  //   if (evt.tabTitle === 'Integrations') {
  //     console.log('run');
  //   }
  // }
}
