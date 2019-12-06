import { Component, OnInit, Input, ViewChild, TemplateRef, NgZone } from '@angular/core';
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
import { NbDialogService } from '@nebular/theme';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import * as localForage from 'localforage';

@Component({
  selector: 'app-fb-connect',
  templateUrl: './fb-connect.component.html',
  styleUrls: ['./fb-connect.component.scss']
})
export class FbConnectComponent implements OnInit {
  @ViewChild('stepper') stepper;
  @ViewChild('dialog') public templateref: TemplateRef<any>;
  @ViewChild('location') searchElementRef;

  loader = false;
  platform;
  // ibeacon = 'no';
  api = '9945f3ab-5de4-4769-b630-5c6520203d7a';
  stepIndex;
  toolTipStatus;
  showLoader;

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
    location_coordinates: { lat: null, lng: null},
    is_facebook: true,
    brand_logo: '',
    brand_cover: '',
    description: '',
    facebook_page_id: '',
    currency: '',
    currency_code:'',
    more_info: '',
    email: '',
    website: '',
  };

  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

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
    private _sanitizer: DomSanitizer,
    private dialogService: NbDialogService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {

    this.getPartners();
    

    this.myFormStep1 = formBuilder.group({
      facebookPageID: ['www.facebook.com/'],
      fakeData: ['', [Validators.required]]
    });

    // this.myFormStep1 = formBuilder.group({
    //   facebookPageID: ['www.facebook.com/'],
    //   fakeData: ['', []]
    // });
     
    this.myFormStep2 = formBuilder.group({
      facebookPageID: [this.myFormStep1.get('facebookPageID').value, [Validators.required, Validators.pattern("((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}")]],
      brandName: ["", [Validators.required]],
      profileLogo: ["", [Validators.required]],
      coverImage: ["", [Validators.required]],
      description: ["", [Validators.required]],
      moreInfo: ["", []],
      location: ["", [Validators.required]],
      currency: ["", [Validators.required]],
      phone: ["", [Validators.required, Validators.pattern("^([+]{0,1}[0-9]{1,5}|[(]{1}[0-9]{1,5}[)]{1})[0-9 -]{5,20}$")]],
      email: ["", [Validators.required, Validators.email]],
      website: ["", [Validators.required]],
    });

     
    // this.myFormStep2 = formBuilder.group({
    //   facebookPageID: [this.myFormStep1.get('facebookPageID').value, []],
    //   brandName: ["", []],
    //   profileLogo: ["", []],
    //   coverImage: ["", []],
    //   description: ["", []],
    //   moreInfo: ["", []],
    //   location: ["", []],
    //   currency: ["", []],
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

  async ngOnInit() {
    this.showLoader = true;
    this.http.get('https://graph.facebook.com/v3.3/me/accounts?fields=cover,name,picture&access_token='
      + await localForage.getItem('access') + '&limit=1000').subscribe(async (res) => {
      this.fbBrands = res['data'];
      this.brandService.getUsersBrands(await localForage.getItem('userID')).subscribe(result => {
        this.userBrands = result['data']['brands'];
        this.brands = this.getBrands(this.userBrands, this.fbBrands);
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
    });
  }

  getBrands (userBrands, fbBrands) {
    var obj = {};
    for (var i = userBrands.length-1; i >= 0; -- i){
      obj[userBrands[i].brand_id] = userBrands[i];
    }
    for (var i = fbBrands.length-1; i >= 0; -- i){
      if (!obj.hasOwnProperty(fbBrands[i].id)){
        obj[fbBrands[i].id] = fbBrands[i];
      }
    }
    var res = []
    for (var k in obj) {
      res.push(obj[k]);
    }
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  }

  // checkUsersBrand(fbBrandId) {
  //   let isMatch = false;

  //   if (this.userBrands) {
  //     this.userBrands.forEach(element => {
  //       if (element.brand_id === fbBrandId) {
  //         isMatch = true;
  //       }
  //     });
  //     return isMatch;
  //   } else {
  //     return false;
  //   }
  // }

  goStep2(id) {
    this.selectedPageId = id;
    this.inProcces = true;
    this.myFormStep1.controls['fakeData'].setValue('true');

    this.loader = true;
    this.fbId = id;
    this.authService.getFacebookInfo(this.fbId).subscribe(async data => {
      console.log(data);
      if (data['success']) {
        console.log(data);
        this.loader = false;
        this.fbResponse = data['data'];
        console.log(this.fbResponse);
      } else {
        this.loader = false;
      }
      if(this.fbResponse['profile_logo']){
        this.getPhoto(this.fbResponse['profile_logo'], `${this.fbResponse['brand_name']}Logo.png`, 'logo');
      }
      if(this.fbResponse['cover_image']){
        this.getPhoto(this.fbResponse['cover_image'], `${this.fbResponse['brand_name']}Cover.png`, 'cover');
      }
      const connectingBrand = {
        brand_id: this.fbResponse['brand_id'],
        user_admin_id: await localForage.getItem('userID'),
        brand_name: this.fbResponse['brand_name'],
        brand_logo: this.fbResponse['profile_logo'],
        facebook_page_id: this.fbResponse['brand_id'],
        is_facebook: true
      };
      this.brandService.connectBrand(connectingBrand).subscribe(async result => {
        this.setActiveBrandAndUpdateUser(result['brand_id']);
        if(result['code'] == 602){
          setTimeout(() => {
            this.router.navigate(['/main/dashboard']);
          }, 2000);
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
            // this.photoLogo = this.fbResponse['profile_logo'];
            this.myFormStep2.controls['facebookPageID'].setValue('www.facebook.com/' + this.fbResponse.brand_id);
            setTimeout(() => {
              this.loadAutoComplete();
            }, 500);
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
      console.log(err);
      this.loader = false;
      this.inProcces = false;
      if (err.status == 404){
        this.dialogService.open(this.templateref, { context: 'Your page is not published for public use.' });
      }
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

  checknoOfStaff(e){
    if(this.myFormStep3.get('noOfStaff').invalid){
      this.myFormStep3.get('noOfStaff').setValue('');
    }
  }

  checknoOfLocations(e){
    if(this.myFormStep3.get('noOfLocations').invalid){
      this.myFormStep3.get('noOfLocations').setValue('');
    }
  }

  async setActiveBrandAndUpdateUser(id) {
    this.loader = true;
    forkJoin([this.brandService.getBrandById(id),
    this.authService.updateUser(await localForage.getItem('userID'), { activeBrand: id })]).subscribe(async results => {
      const brandResult = results[0];
      const userResult = results[1];
      await localForage.setItem('currentBrand', brandResult['brand']);
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

  async redirectToDashboard(id?) {
    if(this.inProcces){
      return;
    }
    if (id) {
      this.inProcces = true;
      this.setActiveBrandAndUpdateUser(id);
      setTimeout(() => {
        this.ngZone.run(() => {
          this.router.navigate(['/main/dashboard']);
          this.inProcces = false;
        })
      }, 2000);
    } else {
      this.inProcces = true;
      let isBrand;
      const user = await localForage.getItem('user');
      isBrand = user['activeBrand'];
      if (isBrand) {
        this.ngZone.run(() => {
          this.router.navigate(['/main/dashboard']);
          this.inProcces = false;
        })
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

  async createBrand() {
    this.inProcces = true;

    this.brand['brand_id'] = this.fbResponse['brand_id'];
    this.brand.brand_cover = this.photoCover;
    this.brand.brand_logo = this.photoLogo;
    this.brand.brand_name = this.myFormStep2.get('brandName').value;
    this.brand.description = this.myFormStep2.get('description').value;
    this.brand.currency_code = this.myFormStep2.get('currency').value;
    this.brand.currency = this.getCurrency(this.brand.currency_code);
    this.brand.email = this.myFormStep2.get('email').value;
    const fbId = this.myFormStep2.get('facebookPageID').value.split('/');
    this.brand.facebook_page_id = fbId[fbId.length - 1];
    this.brand.location = this.myFormStep2.get('location').value;
    let lat = parseFloat(this.latitude.toFixed(4));
    let lng = parseFloat(this.longitude.toFixed(4));
    this.brand['location_coordinates'] = { 'lat': lat, 'lng': lng};
    this.brand.more_info = this.myFormStep2.get('moreInfo').value;
    this.brand.phone = this.myFormStep2.get('phone').value;
    this.brand.user_admin_id = await localForage.getItem('userID');
    this.brand.website = this.myFormStep2.get('website').value;
    console.log(this.brand);

    this.brandService.updateBrand(this.brand['brand_id'], this.brand).subscribe(async result => {
      console.log(result);
      if (result['success']) {
        this.authService.updateUser(this.brand.user_admin_id, { activeBrand: this.brand['brand_id'] }).subscribe(async res => {
          if (res['success']) {
            this.brandService.getBrandById(this.brand['brand_id']).subscribe(async (brandData)=>{
              await localForage.setItem('currentBrand', brandData['brand']);
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

  getCurrency(currency){
    currency = currency.slice(0, -1);
    return currency.split('(')[1];
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

  async logout() {
    this.firebaseAuth.auth.signOut().then(async () => {
      await localForage.clear();
      await localForage.setItem('loggedOut', true);
      this.router.navigate(['/fb-login']);
    });
  }

  async getPartners(){
    const partnerRef = this.afs.collection('walletly_partners');
    await partnerRef.valueChanges().subscribe(items => {
      this.partners = items;
    });
  }

  getPhoto(image_url, image_name, image_type){
    let image;
    this.http.get(image_url, {
      responseType: 'arraybuffer'
    }).subscribe(response => {
      image = this._arrayBufferToBase64(response);
      image = 'data:image/png;base64,' + image;
      var blob = this.dataURItoBlob(image);
      var file = new File([blob], image_name, {
        type: "'image/png'"
      });
      const formData = new FormData();
      formData.append('image', file, image_name);
      this.uploadService.uploadPhoto(formData, 'brandLogoFolder').subscribe(result => {
        if(image_type == 'logo'){
          this.photoLogo = result['data'].url;
        }else if(image_type == 'cover'){
          this.photoCover = result['data'].url;
        }
      }, err => {
        console.log(err);
      })
    })
  }

  _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  dataURItoBlob(dataURI) {

    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  loadAutoComplete(){
    //load Places Autocomplete
    this.latitude = 54.94341;
    this.longitude = -2.65362;
    this.zoom = 2;
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          
          this.myFormStep2.controls['location'].setValue((document.getElementById('location') as HTMLInputElement).value);

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
            this.myFormStep2.controls['location'].setValue(this.address);
          }
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  // getPartnerPicture(image){
  //   return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  // }

}
