import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as moment from 'moment';
import { MainService } from 'src/app/shared/services/main.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { CardService } from 'src/app/shared/services/card.service';
import { BrandService } from 'src/app/shared/services/brand.service';
import { ManychatService } from 'src/app/shared/services/manychat.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import * as localForage from 'localforage';

@Component({
  selector: 'app-create-campaing',
  templateUrl: './create-campaing.component.html',
  styleUrls: ['./create-campaing.component.scss']
})
export class CreateCampaingComponent implements OnInit {

  myForm: FormGroup;
  ticketForm: FormGroup;
  loyaltyForm: FormGroup;
  stampForm: FormGroup;
  membershipForm: FormGroup;
  customValidation = true;
  campaign = {};
  id;
  disable;
  // numberOfCoupon;
  coupons = [];
  membership = [];
  tickets = [];
  loyalty = [];
  customFieldsText = [];
  customFieldsNumber = [];
  customFieldsBoolean = [];
  currentBrand;

  isApi = false;
  manychatAPI;
  template;
  selectedSell;
  cardType;
  brand_currency = '$';
  dateStart = new Date();
  dateEnd = new Date();
  dataCampaign;
  dataTicket;
  showDatePickerEnd;
  showDatePicker;
  showLoader;
  noCoupons = true;
  noMembership = true;
  noTickets = true;
  noLoyalty = true;
  loyaltyCampaignId;
  stampCampaignId;
  membershipCampaignId;
  limit = '';

  @ViewChild('selectTemplate') selectTemplate;
  @ViewChild('selectCurrency') selectCurrency;
  @ViewChild('selectCustomField') selectCustomField;
  @ViewChild('selectNumber') selectNumber;
  @ViewChild('location') searchElementRef;

  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  defaultColumns = [ 'Cards', 'Coupons', 'Tickets'];
  allColumns = this.defaultColumns;
  user;

  public customPatterns = { '0': { pattern: new RegExp('\d{1,2}') } };

  data = [
    {
      data: { 'Cards': { name: 'Loyalty Card', icon: 'assets/img/LoyaltyCard.png', type: 'loyalty', locked: false }, 'Coupons': { name: 'Coupon in %', icon: 'assets/img/Coupon.png', type: 'coupon', locked: false }, 'Tickets': { name: 'Event Tickets', icon: 'assets/img/eventTickets.png', type: 'ticket', locked: false } },
    },
    {
      data: { 'Cards': { name: 'Stamp Card', icon: 'assets/img/stampCard.png', type: 'loyalty', locked: false }, 'Coupons': { name: 'Coupon in $', icon: 'assets/img/Coupon-in-$.png', type: 'coupon', locked: false }, 'Tickets': { name: 'Webinar Event', icon: 'assets/img/webinarIcon.png', type: 'ticket', locked: false } },
    },
    {
      data: { 'Cards': { name: 'Membership Card', icon: 'assets/img/membershipCard.png', type: 'membership', locked: false }, 'Coupons': { name: '', icon: '' }, 'Tickets': { name: '', icon: '' } },
    },
    // {
    //   data: { 'Coupons': { name: 'Birthday Coupon', icon: 'assets/img/Birthday-Coupon.png', type: 'coupon', locked: true }, 'Cards': { name: 'Membership Card', icon: 'assets/img/membershipCard.png', type: 'membership', locked: false }, 'Tickets': { name: '', icon: '' } },
    // },
    // {
    //   data: { 'Coupons': { name: 'Referral Coupon', icon: 'assets/img/Referral-Coupon.png', type: 'coupon', locked: true }, 'Cards': { name: '', icon: '' }, 'Tickets': { name: '', icon: '' } },
    // },
  ];

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activeRout: ActivatedRoute,
    private campaignService: CompaignService,
    private cardService: CardService,
    private brandService: BrandService,
    private manychatService: ManychatService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.myForm = formBuilder.group({
      campaignName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      template: ["", [Validators.required]],
      customFields: [""],
      customFieldFinance: [""],
      customFieldAddwallet: [""],
      discount: ["", []],
      // numberOfCoupon: ["", [Validators.required]],
      // setLimit: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      currency: ["", []],
      validity: ["", [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.max(365)]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });

    this.ticketForm = formBuilder.group({
      campaignName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      template: ["", [Validators.required]],
      customFields: [""],
      customFieldAddwallet: [""],
      startDate: ["", [Validators.required]],
      time: ["", [Validators.required, Validators.pattern("((1[0-2]|0?[1-9]):([0-5][0-9]) ?((AM)|(PM)|(am)|(pm)))")]],
      event_name: ["", [Validators.required]],
      venue: ["", [Validators.required]]
    });

    this.loyaltyForm = formBuilder.group({
      campaignName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      template: ["", [Validators.required]],
      customFields: [""],
      customFieldFinance: [""],
      customFieldAddwallet: [""],
      currency: ["", [Validators.required]],
      points: ["", [Validators.required, Validators.min(0)]],
    });

    this.stampForm = formBuilder.group({
      campaignName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      template: ["", [Validators.required]],
      customFields: [""],
      customFieldFinance: [""],
      customFieldAddwallet: [""]
    });

    this.membershipForm = formBuilder.group({
      campaignName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      template: ["", [Validators.required]],
      customFields_redeem: [""],
      customFields_status: [""],
      customFieldAddwallet: [""]
    });
  }

 async ngOnInit() {
  this.user = await localForage.getItem('user');
  this.currentBrand = await localForage.getItem('currentBrand');
  this.id = this.activeRout.snapshot.paramMap.get('id');
  if(this.id){
    this.disable = true;
  } else{
    this.campaignService.getСampaignsBrands(this.currentBrand.brand_id,{}).subscribe(result => {
      console.log(result);
      for (let i in result['data']){
        if(result['data'][i].campaign_type == 5){
          this.loyaltyCampaignId = result['data'][i].id;
        }
        if(result['data'][i].campaign_type == 6){
          this.stampCampaignId = result['data'][i].id;
        }
        if(result['data'][i].campaign_type == 7){
          this.membershipCampaignId = result['data'][i].id;
        }
      }
    }, err => {
      console.log(err);
    });
  }
  console.log(this.dataCampaign);
  if (!this.dataCampaign) {
    this.dataCampaign = this.mainService.dataCampaign;
    console.log(this.dataCampaign);
    this.myForm.controls['template'].setValue(this.dataCampaign.card_id);
    this.ticketForm.controls['template'].setValue(this.dataCampaign.card_id);
    this.loyaltyForm.controls['template'].setValue(this.dataCampaign.card_id);
    this.stampForm.controls['template'].setValue(this.dataCampaign.card_id);
    this.membershipForm.controls['template'].setValue(this.dataCampaign.card_id);
    this.cardType = this.dataCampaign.cardType;
    if(this.cardType != ''){
      this.disable = true;
    }
  }

  this.cardService.getBrandsCards(this.currentBrand.brand_id).subscribe(data => {
    for (let i in data['data']){
      if(data['data'][i].card_type == 1){
        this.coupons.push(data['data'][i]);
        this.noCoupons = false;
      }else if(data['data'][i].card_type == 2){
        this.membership.push(data['data'][i]);
        this.noMembership = false;
      }else if(data['data'][i].card_type == 3){
        this.tickets.push(data['data'][i]);
        this.noTickets = false;
      }else if(data['data'][i].card_type == 4){
        this.loyalty.push(data['data'][i]);
        this.noLoyalty = false;
      }
    }
  }, err => {
    console.log(err);
  });

  this.brandService.getBrandById(this.currentBrand.brand_id).subscribe(data => {
    if (data) {
      if(data['brand'].currency){
        this.brand_currency = data['brand'].currency;
        this.mainService.dataCampaign.currency = this.brand_currency;
      }
      console.log(data['brand']);
      this.manychatAPI = data['brand'].manychatAPI;
      console.log('manychatAPI', this.manychatAPI);
      this.manychatService.getCustomFields(this.manychatAPI).subscribe( result => {
        if (result) {
          console.log(result['data']);
          this.isApi = true;
          result['data'].data.forEach(customField => {
              if(customField.type === 'boolean') {
                this.customFieldsBoolean.push(customField);
              } else if (customField.type === 'number') {
                this.customFieldsNumber.push(customField);
              } else if (customField.type === 'Text') {
                this.customFieldsText.push(customField);
              }
          });
          // console.log(this.customFields);
        }
      }, err => {
        if (err) {
          console.log(err.message);
          this.isApi = false;
        }
      });
    }
  }, err => {
    console.log(err);
  });

  if (this.id) {
    // this.mainService.showLoader.emit(true);
    this.showLoader = true;
    this.campaignService.getСampaignById(this.id).subscribe(result => {
      console.log(result['data']);
      if (result['success']) {
        this.mainService.dataCampaign.name = result['data'].campaign_name;
        this.mainService.dataCampaign.description = result['data'].description;

        this.mainService.dataCampaign.selectedCustomField = result['data'].manychat_customField || '';
        this.mainService.dataCampaign.memCard_status_customField = result['data'].manychat_CF_memCard_status || '';
        this.mainService.dataCampaign.financeField = result['data'].manychat_CF_finance || '';
        this.mainService.dataCampaign.addWalletField = result['data'].manychat_CF_addwallet || '';

        this.mainService.dataCampaign.campaign_type = result['data'].campaign_type.toString();
        this.mainService.dataCampaign.discount = result['data'].campaign_value;
        this.mainService.dataCampaign.startDate = result['data'].startDateFormatted;
        this.mainService.dataCampaign.endDate = result['data'].endDateFormatted;
        this.mainService.dataCampaign.brand_id = result['data'].brand_id;
        this.mainService.dataCampaign.card_id = result['data'].card_id;
        this.mainService.dataCampaign.coupon_validity = (result['data'].coupon_validity) ? String(result['data'].coupon_validity) : '';
        this.mainService.dataCampaign.currency = this.brand_currency;
        this.mainService.dataCampaign.event_name = result['data'].event_name;
        this.mainService.dataCampaign.venue = result['data'].venue;
        this.mainService.dataCampaign.venue_coordinates = result['data'].venue_coordinates ? result['data'].venue_coordinates : null;
        this.mainService.dataCampaign.time = result['data'].time;
        this.mainService.dataCampaign.points = result['data'].points;
        this.mainService.dataCampaign.cardType = (result['data'].campaign_type <= 4) ? 'coupon'
                                                  : (result['data'].campaign_type <= 6) ? 'loyalty'
                                                  : (result['data'].campaign_type <= 7) ? 'membership'
                                                  : (result['data'].campaign_type <= 9) ? 'ticket'
                                                  : '';
        this.dataCampaign = this.mainService.dataCampaign;
        this.myForm.controls['template'].setValue(this.dataCampaign.card_id);
        this.ticketForm.controls['template'].setValue(this.dataCampaign.card_id);
        this.loyaltyForm.controls['template'].setValue(this.dataCampaign.card_id);
        this.stampForm.controls['template'].setValue(this.dataCampaign.card_id);
        this.membershipForm.controls['template'].setValue(this.dataCampaign.card_id);

        // need for all template
        if (this.dataCampaign.campaign_type === '1') {
          this.selectType('Coupon in %');
        }else if(this.dataCampaign.campaign_type === '2'){
          this.selectType('Coupon in $');
        }else if(this.dataCampaign.campaign_type === '5'){
          this.selectType('Loyalty Card');
          setTimeout(() => {
            (document.getElementById('Stamp Card') as HTMLElement).classList.add('disable');
          }, 200);
        }else if(this.dataCampaign.campaign_type === '6'){
          this.selectType('Stamp Card');
          setTimeout(() => {
            (document.getElementById('Loyalty Card') as HTMLElement).classList.add('disable');
          }, 200);
        }else if(this.dataCampaign.campaign_type === '7'){
          this.selectType('Membership Card');
        }else if(this.dataCampaign.campaign_type === '8'){
          this.selectType('Event Tickets');
        }else if(this.dataCampaign.campaign_type === '9'){
          this.selectType('Webinar Event');
        }

      }
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    }, err => {
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    });
  }
  }

  changeDiscount(event) {
    this.dataCampaign.discount = event;
  }

  checkDiscount(e){
    if(this.myForm.get('discount').invalid){
      this.myForm.get('discount').setValue('');
    }
  }

  checkValidity(e){
    if(this.myForm.get('validity').invalid){
      this.myForm.get('validity').setValue('');
    }
  }

  checkPoints(e){
    if(this.loyaltyForm.get('points').invalid){
      this.loyaltyForm.get('points').setValue('');
    }
  }

  async create() {
    this.currentBrand = await localForage.getItem('currentBrand');
    if (!this.dataCampaign.brand_id) {
      this.dataCampaign.brand_id = this.currentBrand.brand_id;
    }
    if (this.myForm.valid) {
      this.dataCampaign.cardType = this.cardType;
      this.dataCampaign['venue_coordinates'] = null;
      this.mainService.dataCampaign = this.dataCampaign;
      this.mainService.dataCampaign.currency = this.brand_currency;

      if (this.id) {
        this.router.navigate(['/main/campaign-main/review-campaign/' + this.id]);
      } else {
        this.router.navigate(['/main/campaign-main/review-campaign']);
      }
    }if (this.ticketForm.valid) {
      this.dataCampaign.cardType = this.cardType;
      if(this.dataCampaign.campaign_type == 8){
        let lat = parseFloat(this.latitude.toFixed(4));
        let lng = parseFloat(this.longitude.toFixed(4));
        this.dataCampaign['venue_coordinates'] = { 'lat': lat, 'lng': lng};
      }else if(this.dataCampaign.campaign_type == 9){
        this.dataCampaign['venue_coordinates'] = null;
      }
      this.mainService.dataCampaign = this.dataCampaign;
      this.mainService.dataCampaign.currency = this.brand_currency;

      if (this.id) {
        this.router.navigate(['/main/campaign-main/review-campaign/' + this.id]);
      } else {
        this.router.navigate(['/main/campaign-main/review-campaign']);
      }
    }if (this.loyaltyForm.valid) {
      this.dataCampaign.cardType = this.cardType;
      this.dataCampaign['venue_coordinates'] = null;
      this.mainService.dataCampaign = this.dataCampaign;
      this.mainService.dataCampaign.currency = this.brand_currency;

      if (this.id) {
        this.router.navigate(['/main/campaign-main/review-campaign/' + this.id]);
      } else {
        this.router.navigate(['/main/campaign-main/review-campaign']);
      }
    }if (this.stampForm.valid) {
      this.dataCampaign.cardType = this.cardType;
      this.dataCampaign['venue_coordinates'] = null;
      this.mainService.dataCampaign = this.dataCampaign;
      this.mainService.dataCampaign.currency = this.brand_currency;

      if (this.id) {
        this.router.navigate(['/main/campaign-main/review-campaign/' + this.id]);
      } else {
        this.router.navigate(['/main/campaign-main/review-campaign']);
      }
    }if (this.membershipForm.valid) {
      this.dataCampaign.cardType = this.cardType;
      this.dataCampaign['venue_coordinates'] = null;
      this.mainService.dataCampaign = this.dataCampaign;
      this.mainService.dataCampaign.currency = this.brand_currency;

      if (this.id) {
        this.router.navigate(['/main/campaign-main/review-campaign/' + this.id]);
      } else {
        this.router.navigate(['/main/campaign-main/review-campaign']);
      }
    } else {
      this.customValidation = false;
    }
  }

  dateEndChange(event) {
    this.dataCampaign.endDate = moment(event).format('YYYY-MM-DD');
    const compare = this.compare(this.dateStart, event);
    if (compare === 1 || (compare === 0 && this.dateStart)) {
      this.dataCampaign.startDate = '';
    }
    console.log(this.compare(this.dateStart, event));
    this.showDatePickerEnd = false;
  }

  // numberOfCouponChange(e) {
  //   console.log(this.selectNumber);
  //   console.log(e);
  //   this.numberOfCoupon = e;
  // }

  dateStartChange(event) {
    this.dataCampaign.startDate = moment(event).format('YYYY-MM-DD');
    const compare = this.compare(event, this.dateEnd);
    if (compare === 1 || compare === 0) {
      this.dataCampaign.endDate = '';
    }
    console.log(this.compare(event, this.dateEnd));
    this.showDatePicker = false;
  }

  compare(dateTimeA, dateTimeB) {
    const momentA = moment(dateTimeA, 'YYYY-MM-DD');
    const momentB = moment(dateTimeB, 'YYYY-MM-DD');
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
  }

  selectType(typeName) {
    if (typeName === 'Coupon in %') {
      this.selectedSell = 'Coupon in %';
      this.dataCampaign.campaign_type = 1;
      this.dataCampaign.venue = '';
      this.dataCampaign.event_name = '';
      this.dataCampaign.time='';
      this.dataCampaign.points = '';
      this.cardType = 'coupon';
      this.myForm.get('discount').setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.myForm.get('discount').updateValueAndValidity();
    }else if(typeName === 'Coupon in $'){
      this.selectedSell = 'Coupon in $';
      this.dataCampaign.campaign_type = 2;
      this.dataCampaign.venue = '';
      this.dataCampaign.event_name = '';
      this.dataCampaign.time='';
      this.dataCampaign.points = '';
      this.cardType = 'coupon';
      this.myForm.get('discount').setValidators([Validators.required, Validators.min(0)]);
      this.myForm.get('discount').updateValueAndValidity();
    }else if(typeName === 'Loyalty Card'){
      this.selectedSell = 'Loyalty Card';
      this.dataCampaign.campaign_type = 5;
      this.dataCampaign.endDate = '';
      this.dataCampaign.startDate = '';
      this.dataCampaign.discount='';
      this.dataCampaign.coupon_validity='';
      this.dataCampaign.venue = '';
      this.dataCampaign.event_name = '';
      this.dataCampaign.time='';
      this.cardType = 'loyalty';
    }else if(typeName === 'Stamp Card'){
      this.selectedSell = 'Stamp Card';
      this.dataCampaign.campaign_type = 6;
      this.dataCampaign.endDate = '';
      this.dataCampaign.startDate = '';
      this.dataCampaign.discount='';
      this.dataCampaign.coupon_validity='';
      this.dataCampaign.venue = '';
      this.dataCampaign.event_name = '';
      this.dataCampaign.time='';
      this.dataCampaign.points = '';
      this.cardType = 'loyalty';
    }else if(typeName === 'Membership Card'){
      this.selectedSell = 'Membership Card';
      this.dataCampaign.campaign_type = 7;
      this.dataCampaign.endDate = '';
      this.dataCampaign.startDate = '';
      this.dataCampaign.discount='';
      this.dataCampaign.coupon_validity='';
      this.dataCampaign.venue = '';
      this.dataCampaign.event_name = '';
      this.dataCampaign.time='';
      this.dataCampaign.points = '';
      this.cardType = 'membership';
    }else if(typeName === 'Event Tickets'){
      this.selectedSell = 'Event Tickets';
      this.dataCampaign.campaign_type = 8;
      this.dataCampaign.endDate = '';
      this.dataCampaign.discount='';
      this.dataCampaign.coupon_validity='';
      this.dataCampaign.points = '';
      this.ticketForm.controls['venue'].setValue('');
      this.ticketForm.get('venue').setValidators([Validators.required]);
      this.ticketForm.get('venue').updateValueAndValidity();
      this.cardType = 'ticket';
      setTimeout(() => {
        this.loadAutoComplete();
      }, 500);
    }else if(typeName === 'Webinar Event'){
      this.selectedSell = 'Webinar Event';
      this.dataCampaign.campaign_type = 9;
      this.dataCampaign.endDate = '';
      this.dataCampaign.discount='';
      this.dataCampaign.coupon_validity='';
      this.dataCampaign.points = '';
      this.ticketForm.controls['venue'].setValue('');
      this.ticketForm.get('venue').setValidators([Validators.required, Validators.pattern("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$")]);
      this.ticketForm.get('venue').updateValueAndValidity();
      this.cardType = 'ticket';
    }
  }

  clear() {
    if ((!this.noCoupons || !this.noMembership || !this.noLoyalty || !this.noTickets) && (this.selectTemplate)) {
      this.selectTemplate.reset();
    }
    if(this.selectCustomField){
      this.selectCustomField.reset();
    }
    this.dataCampaign = {
      name: '',
      description: '',
      selectedCustomField: '',
      memCard_status_customField: '',
      financeField: '',
      addWalletField: '',
      template: '',
      discount: '',
      startDate: '',
      endDate: '',
      coupon_validity: '',
      event_name: '',
      venue: '',
      time: '',
      points: '',
      currency: '',
    };
    this.selectType(this.selectedSell);
    // this.myForm.get('setLimit').setValue('');
  }

  loadAutoComplete(){
    //load Places Autocomplete
    this.latitude = 54.94341;
    this.longitude = -2.65362;
    this.zoom = 2;
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      if(this.dataCampaign['venue_coordinates']){
        this.latitude = this.dataCampaign['venue_coordinates'].lat;
        this.longitude = this.dataCampaign['venue_coordinates'].lng;
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

          this.ticketForm.controls['venue'].setValue((document.getElementById('location') as HTMLInputElement).value);

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
            this.ticketForm.controls['venue'].setValue(this.address);
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
