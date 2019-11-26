import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'src/app/shared/services/main.service';
import { BrandService } from 'src/app/shared/services/brand.service';
import { StripeSubscriptionService } from 'src/app/shared/services/stripe-subscription.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ManychatService } from '../../shared/services/manychat.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import * as localForage from 'localforage';


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
  @ViewChild('location') searchElementRef;
  
  elements: Elements;
  card: StripeElement;
 
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  is_subscribed = false;
  subscriptionData = {};
  showNewCard = false;
  cancelSubsciption = true;
  resubscribe = false;
  authenticateUrl = '';
 
  subscriptionForm: FormGroup;
  invalidSubscriptionForm = false;
  inSubscriptionProcces = false;
  inDeletionProcces = false;
  pendingCancellation = false;
  inUndeletionProcces = false;
  cardError = false;
  cardErrorMessage = '';
  
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
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  currentUser;
  currentBrand;


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
    private stripeSubscriptionService: StripeSubscriptionService,
    private uploadService: UploadService,
    private afs: AngularFirestore,
    private manychatService: ManychatService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private stripeService: StripeService) {
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
      location: ["", [Validators.required]],
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

    this.subscriptionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.showLoader = true;
    // this.goPayment();
  }
  
  async ngOnInit() {
    this.currentUser = await localForage.getItem('user');
    this.currentBrand = await localForage.getItem('currentBrand');
    if (this.currentUser.user_type === 4){
      this.userAdmin = true;
    } else {
      this.userAdmin = false;
      this.getBrandSettings();
    }
    this.brandService.getBrandAdmins(this.currentBrand.brand_id).subscribe((result) => {
      this.brandAdmins = result['brand_admins'];
    });
    this.stripeSubscriptionService.getSubscription(this.currentBrand.brand_id).subscribe(result => {
      if(result['success']){
        this.is_subscribed = true;
        this.subscriptionData = result['data'];
        if(!this.is_subscribed){
          this.is_subscribed = !this.subscriptionData['is_delete'] && this.subscriptionData['status'] == 'incomplete'  ? true : false;
        }
        if(this.subscriptionData['status'] == ('canceled') || this.subscriptionData['status'] == ('incomplete_expired')){
          this.cancelSubsciption = false;
        }
        if(this.subscriptionData['cancel_at_period_end'] && this.subscriptionData['status'] != ('canceled')){
          this.cancelSubsciption = false;
          this.subscriptionData['status'] = 'Pending Cancellation';
          this.pendingCancellation = true;
        }
        if(this.subscriptionData['latestInvoice_date']){
          let d = new Date(this.subscriptionData['latestInvoice_date']._seconds * 1000);
          this.subscriptionData['latestInvoice_date'] = d.toDateString();
          if(!this.cancelSubsciption){
            this.subscriptionData['nextInvoice_date'] = null;
          }else{
            this.subscriptionData['nextInvoice_date'] = new Date(d.setDate(d.getDate() + 30)).toDateString();
          }
        }
        if(this.subscriptionData['payment_intent'].status == 'requires_action' || this.subscriptionData['payment_intent'].status === 'requires_payment_method'){
          if(this.subscriptionData['payment_intent'].next_action){
            if(this.subscriptionData['payment_intent'].next_action.use_stripe_sdk){
              if(this.subscriptionData['payment_intent'].next_action.use_stripe_sdk.stripe_js){
                this.authenticateUrl = this.subscriptionData['payment_intent'].next_action.use_stripe_sdk.stripe_js;
              }
            }
          }
        }
      }else{
        this.is_subscribed = false;
      }
    }, err => {
      console.log('getSubscription err:', err);
    });
  }

  async onChangeTab(event) {
    this.currentUser = await localForage.getItem('user');
    if (event.tabTitle === 'Billing' && this.is_subscribed == false) {
      this.invalidSubscriptionForm = false;
      this.cardError = false;
      this.cardErrorMessage = '';
      setTimeout(() => {
        this.stripeService.elements(this.elementsOptions)
        .subscribe(elements => {
          this.elements = elements;
          if (!this.card) {
            this.card = this.elements.create('card', {
              style: {
                base: {
                  iconColor: '#666EE8',
                  color: '#31325F',
                  lineHeight: '40px',
                  fontWeight: 300,
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSize: '18px',
                  '::placeholder': {
                    color: '#CFD7E0'
                  }
                }
              }
            });
            this.card.mount('#card-element');
            this.subscriptionForm.controls['email'].setValue(this.currentUser.email);
          }
        });
      }, 300);
    }

  }

  async confirmSubscription() {
    this.currentUser = await localForage.getItem('user');
    this.currentBrand = await localForage.getItem('currentBrand');
    if(this.subscriptionForm.valid){
      this.invalidSubscriptionForm = false;
      this.inSubscriptionProcces = true;
      this.cardError = false;
      this.cardErrorMessage = '';
      const email = this.subscriptionForm.get('email').value;
      this.stripeService.createPaymentMethod('card', this.card, {
        billing_details: {
          email: email
        },
        metadata: {}
      }).subscribe(async result => {
        if (result.paymentMethod) {
          const payment_method = result.paymentMethod;
          const customerData = {
            brand_id: this.currentBrand.brand_id,
            brand_name: this.currentBrand.brand_name,
            payment_method,
            user_id: await localForage.getItem('userID')
          }
          this.stripeSubscriptionService.makeCustomerSubscription(customerData).subscribe(result => {
            this.subscriptionData = result['brandSubscription'];
            this.is_subscribed = this.subscriptionData['is_subscribed'];
            if(!this.is_subscribed){
              this.is_subscribed = !this.subscriptionData['is_delete'] && this.subscriptionData['status'] == 'incomplete'  ? true : false;
            }
            this.cancelSubsciption = true;
            this.showNewCard = false;
            if(this.subscriptionData['latestInvoice_date']){
              let d = new Date(this.subscriptionData['latestInvoice_date']._seconds * 1000);
              this.subscriptionData['latestInvoice_date'] = d.toDateString();
              this.subscriptionData['nextInvoice_date'] = new Date(d.setDate(d.getDate() + 30)).toDateString();
            }
            this.inSubscriptionProcces = false;
            if(result['status'] == 'active'){
              this.mainService.showToastrSuccess.emit({text: 'Subscription Confirmed'});
            }
            else{
              const payment_intent = result['payment_intent'];
              
              if (payment_intent) {
                const { status } = payment_intent;
                
                if (status === 'requires_action' || status === 'requires_payment_method') {
                  this.mainService.showToastrSuccess.emit({text: 'Subscription Awaiting Authentication'});
                  if(payment_intent['next_action']){
                    if(payment_intent['next_action'].use_stripe_sdk){
                      if(payment_intent['next_action'].use_stripe_sdk.stripe_js){
                        this.authenticateUrl = payment_intent['next_action'].use_stripe_sdk.stripe_js;
                      }
                    }
                  }
                } else {
                  // No additional information was needed
                  // Show a success message to your customer
                  this.mainService.showToastrSuccess.emit({text: 'Subscription Confirmed'});
                }
              }
            }
          }, err => {
            console.log('makeCustomerSubscription err:',err);
            this.inSubscriptionProcces = false;
          });
        }else if(result.error){
          this.inSubscriptionProcces = false;
          this.invalidSubscriptionForm = true;
          this.cardError = true;
          this.cardErrorMessage = result.error.message;
        }
      });
    }else{
      this.invalidSubscriptionForm = true;
    }
  }

  async deleteSubscription() {
    this.showNewCard = false;
    this.currentBrand = await localForage.getItem('currentBrand');
    this.inDeletionProcces = true;
    this.stripeSubscriptionService.deleteSubscription(this.currentBrand.brand_id).subscribe(result => {
      this.inDeletionProcces = false;
      this.mainService.showToastrSuccess.emit({text: 'Subscription Deleted'});
      this.subscriptionData['status'] = result['status'];
      this.cancelSubsciption = false;
      this.pendingCancellation = true;
      this.subscriptionData['nextInvoice_date'] = null;
    }, err => {
      console.log('deleteSubscription err:',err);
      this.inDeletionProcces = false;
    })
  }

  async undeleteSubscription() {
    this.showNewCard = false;
    this.currentBrand = await localForage.getItem('currentBrand');
    this.inUndeletionProcces = true;
    this.stripeSubscriptionService.undeleteSubscription(this.currentBrand.brand_id).subscribe(result => {
      this.inUndeletionProcces = false;
      this.mainService.showToastrSuccess.emit({text: 'Subscription Activated'});
      this.subscriptionData['status'] = result['status'];
      this.cancelSubsciption = true;
      this.subscriptionData['nextInvoice_date'] = null;
    }, err => {
      console.log('undeleteSubscription err:',err);
      this.inUndeletionProcces = false;
    })
  }

  async newCard(resubscribe){
    if(this.pendingCancellation && resubscribe){
      this.undeleteSubscription();
      return;
    }
    if(resubscribe){
      this.resubscribe = true;
      this.showNewCard = false;
    }else{
      this.resubscribe = false;
      if(!this.cancelSubsciption){
        return
      }
    }
    this.showNewCard = true;
    this.currentUser = await localForage.getItem('user');
    this.invalidSubscriptionForm = false;
    this.cardError = false;
    this.cardErrorMessage = '';
    setTimeout(() => {
      this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
          this.card = this.elements.create('card', {
          style: {
            base: {
              iconColor: '#666EE8',
              color: '#31325F',
              lineHeight: '40px',
              fontWeight: 300,
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSize: '18px',
              '::placeholder': {
                color: '#CFD7E0'
              }
            }
          }
        });
        this.card.mount('#card-element');
        this.subscriptionForm.controls['email'].setValue(this.currentUser.email);
      });
    }, 300);
  }

  async changeCustomerCard(){
    this.currentUser = await localForage.getItem('user');
    this.currentBrand = await localForage.getItem('currentBrand');
    if(this.subscriptionForm.valid){
      this.invalidSubscriptionForm = false;
      this.inSubscriptionProcces = true;
      this.cardError = false;
      this.cardErrorMessage = '';
      const email = this.subscriptionForm.get('email').value;
      this.stripeService.createPaymentMethod('card', this.card, {
        billing_details: {
          email: email
        },
        metadata: {}
      }).subscribe(async result => {
        if (result.paymentMethod) {
          const new_payment_method = result.paymentMethod;
          const customerData = {
            brand_id: this.currentBrand.brand_id,
            new_payment_method,
            paymentMethod_id: this.subscriptionData['paymentMethod_id'],
            customer_id: this.subscriptionData['customer_id'],
            user_id: await localForage.getItem('userID')
          }
          this.stripeSubscriptionService.changeCustomerCard(customerData).subscribe(result => {
            this.inSubscriptionProcces = false;
            if(result['success']){
              this.subscriptionData['card'] = result['card'];
              this.subscriptionData['billing_details'] = result['billing_details'];
              this.mainService.showToastrSuccess.emit({text: 'Card Changed'});
              this.showNewCard = false;
            }
          }, err => {
            console.log('changeCustomerSubscription err:',err);
            this.inSubscriptionProcces = false;
          });
        }else if(result.error){
          this.inSubscriptionProcces = false;
          this.invalidSubscriptionForm = true;
          this.cardError = true;
          this.cardErrorMessage = result.error.message;
        }
      })
    }else{
      this.invalidSubscriptionForm = true;
    }
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

  async getBrandSettings() {
    this.currentBrand = await localForage.getItem('currentBrand');
    this.brandService.getBrandById(this.currentBrand.brand_id).subscribe(data => {
      this.brand = data['brand'];
      this.api = this.brand.apikey;
      console.log(this.brand);
      this.getData();
      this.showLoader = false;
      this.goPayment();
      setTimeout(() => {
        this.loadAutoComplete();
      }, 500);
    }, err => {
      this.showLoader = false;
      this.goPayment();
    });
  }

  async update() {
    this.currentBrand = await localForage.getItem('currentBrand');
    if (this.myForm.valid) {
      this.customValidation = true;
      this.inProcces = true;
      await this.getBrand();
      console.log(this.brand);
      this.brandService.updateBrand(this.currentBrand.brand_id, this.brand).subscribe(result => {
        console.log(result);
        this.brandService.getBrandById(this.currentBrand.brand_id).subscribe(async data => {
          await localForage.setItem('currentBrand', data['brand']);
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
    this.myForm.controls['currency'].setValue(this.brand['currency_code']);
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
    this.brand['currency_code'] = this.myForm.get('currency').value;
    this.brand['currency'] = this.getCurrency(this.brand['currency_code']);
    let lat = parseFloat(this.latitude.toFixed(4));
    let lng = parseFloat(this.longitude.toFixed(4));
    this.brand['location_coordinates'] = { 'lat': lat, 'lng': lng};
    const partnerData = await this.getPartnerData(this.myForm.get('brandPartner').value);
    this.brand['brandPartner'] = partnerData;
  }

  getCurrency(currency){
    currency = currency.slice(0, -1);
    return currency.split('(')[1];
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
    this.currentBrand = await localForage.getItem('currentBrand');
    if (this.manyChatApiForm.valid) {
      this.inProcces = true;

      const manyChatApi = this.manyChatApiForm.get('manyChatApi').value;

      this.manychatService.getPageInfo(manyChatApi).subscribe(result => {
        if(result){
          console.log(result);
          // if(result['data'].data.id === parseInt(this.brand['facebook_page_id'])) {
            this.brandService.updateBrand(this.currentBrand.brand_id,
              {'manychatAPI': manyChatApi}).subscribe(check => {
                console.log(check);
                this.inProcces = false;
                this.WrongApi = false;
                this.mainService.showToastrSuccess.emit({text: 'Integration saved'});
              }, err => {
                this.inProcces = false;
                this.WrongApi = true;
                console.log(err);
              });
        // } else {
            // this.inProcces = false;
            // this.WrongApi = true;
        }
      }, err => {
          console.log(err.message);
          this.inProcces = false;
          this.WrongApi = true;
      });
    } else {
      this.customValidation = false;
      this.inProcces = false;
    }
  }

  // Get Current Location Coordinates
  // private setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 8;
  //       this.getAddress(this.latitude, this.longitude);
  //     });
  //   }
  // }


  loadAutoComplete(){
    //load Places Autocomplete
    this.latitude = 54.94341;
    this.longitude = -2.65362;
    this.zoom = 2;
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      if(this.brand['location_coordinates']){
        this.latitude = this.brand['location_coordinates'].lat;
        this.longitude = this.brand['location_coordinates'].lng;
        this.zoom = 12;
      }
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          
          this.myForm.controls['location'].setValue((document.getElementById('location') as HTMLInputElement).value);

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.getAddress(this.latitude, this.longitude, false);
        });
      });
    });
  }


  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude, true);
  }

  getAddress(latitude, longitude, marker) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          if(marker){
            this.myForm.controls['location'].setValue(this.address);
          }
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
}
