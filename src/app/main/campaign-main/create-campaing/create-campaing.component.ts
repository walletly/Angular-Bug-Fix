import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MainService } from 'src/app/shared/services/main.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { CardService } from 'src/app/shared/services/card.service';

@Component({
  selector: 'app-create-campaing',
  templateUrl: './create-campaing.component.html',
  styleUrls: ['./create-campaing.component.scss']
})
export class CreateCampaingComponent implements OnInit {

  myForm: FormGroup;
  ticketForm: FormGroup;
  customValidation = true;
  campaign = {};
  id;
  // numberOfCoupon;
  coupons = [];
  cards = [];
  tickets = [];

  template;
  selectedSell;
  cardType;
  dateStart = new Date();
  dateEnd = new Date();
  dataCampaign;
  dataTicket;
  showDatePickerEnd;
  showDatePicker;
  showLoader;
  noCoupons = true;
  noCards = true;
  noTickets = true;
  limit = '';

  @ViewChild('select') select;
  @ViewChild('selectNumber') selectNumber;

  defaultColumns = ['Coupons', 'Cards', 'Tickets'];
  allColumns = this.defaultColumns;
  user;

  public customPatterns = { '0': { pattern: new RegExp('\d{1,2}') } };

  data = [
    {
      data: { 'Coupons': { name: 'Coupon in $', icon: 'assets/img/Coupon-in-$.png', locked: false }, 'Cards': { name: 'Loyalty Card', icon: 'assets/img/LoyaltyCard.png', locked: true }, 'Tickets': { name: 'Event Tickets', icon: 'assets/img/eventTickets.png', locked: true } },
    },
    {
      data: { 'Coupons': { name: 'Coupon in %', icon: 'assets/img/Coupon.png', locked: false }, 'Cards': { name: 'Stamp Card', icon: 'assets/img/stampCard.png', locked: true }, 'Tickets': { name: 'Webinar Event', icon: 'assets/img/webinarIcon.png', locked: false } },
    },
    {
      data: { 'Coupons': { name: 'Birthday Coupon', icon: 'assets/img/Birthday-Coupon.png', locked: true }, 'Cards': { name: 'Membership Card', icon: 'assets/img/membershipCard.png', locked: true }, 'Tickets': { name: '', icon: '' } },
    },
    {
      data: { 'Coupons': { name: 'Referral Coupon', icon: 'assets/img/Referral-Coupon.png', locked: true }, 'Cards': { name: '', icon: '' }, 'Tickets': { name: '', icon: '' } },
    },
  ];

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activeRout: ActivatedRoute,
    private campaignService: CompaignService,
    private cardService: CardService
  ) {

    this.user = JSON.parse(localStorage.getItem('user'));
    this.myForm = formBuilder.group({
      campaignName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      template: ["", [Validators.required]],
      discount: ["", []],
      // numberOfCoupon: ["", [Validators.required]],
      // setLimit: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      currency: ["", [Validators.required]],
      validity: ["", [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.max(100)]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });

    this.ticketForm = formBuilder.group({
      campaignName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      template: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      time: ["", [Validators.required, Validators.pattern("((1[0-2]|0?[1-9]):([0-5][0-9]) ?((AM)|(PM)|(am)|(pm)))")]],
      event_name: ["", [Validators.required]],
      venue: ["", [Validators.required]]
    });

    this.id = this.activeRout.snapshot.paramMap.get('id');

    cardService.getBrandsCards(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(data => {
      for (let i in data['data']){
        if(data['data'][i].card_type == 1){
          this.coupons.push(data['data'][i]);
          this.noCoupons = false;
        }else if(data['data'][i].card_type == 2){
          this.cards.push(data['data'][i]);
          this.noCards = false;
        }else if(data['data'][i].card_type == 3){
          this.tickets.push(data['data'][i]);
          this.noTickets = false;
        }
      }
      console.log(this.dataCampaign);
      if (!this.dataCampaign) {
        this.dataCampaign = this.mainService.dataCampaign;
        this.myForm.controls['template'].setValue(this.dataCampaign.card_id);
        console.log(this.dataCampaign);
        // need for all template
        if (this.dataCampaign.campaign_type === '1') {
          this.selectType('Coupon in %');
        }else if(this.dataCampaign.campaign_type === '2'){
          this.selectType('Coupon in $');
        }
      }
    }, err => {
      if (!this.dataCampaign) {
        this.dataCampaign = this.mainService.dataCampaign;
        this.myForm.controls['template'].setValue(this.dataCampaign.card_id);
        console.log(this.dataCampaign);
        // need for all template
        if (this.dataCampaign.campaign_type === '1') {
          this.selectType('Coupon in %');
        }else if(this.dataCampaign.campaign_type === '2'){
          this.selectType('Coupon in $');
        }
      }
    });

    if (this.id) {
      // this.mainService.showLoader.emit(true);
      this.showLoader = true;
      this.campaignService.getСampaignById(this.id).subscribe(result => {
        console.log(result['data']);
        if (result['success']) {
          this.mainService.dataCampaign.name = result['data'].campaign_name;
          this.mainService.dataCampaign.desription = result['data'].description;
          this.mainService.dataCampaign.campaign_type = result['data'].campaign_type.toString();
          this.mainService.dataCampaign.discount = result['data'].campaign_value;
          this.mainService.dataCampaign.startDate = result['data'].startDateFormatted;
          this.mainService.dataCampaign.endDate = result['data'].endDateFormatted;
          this.mainService.dataCampaign.brand_id = result['data'].brand_id;
          this.mainService.dataCampaign.card_id = result['data'].card_id;
          this.mainService.dataCampaign.coupon_validity = (result['data'].coupon_validity) ? String(result['data'].coupon_validity) : '';
          this.mainService.dataCampaign.currency = result['data'].currency;
          this.mainService.dataCampaign.event_name = result['data'].event_name;
          this.mainService.dataCampaign.venue = result['data'].venue;
          this.mainService.dataCampaign.time = result['data'].time;
          this.mainService.dataCampaign.cardType = (result['data'].campaign_type <= 4) ? 'coupon' : (result['data'].campaign_type <= 7) ? 'card' : 'ticket';
          this.dataCampaign = this.mainService.dataCampaign;
          this.myForm.controls['template'].setValue(this.dataCampaign.card_id);
          this.ticketForm.controls['template'].setValue(this.dataCampaign.card_id);

          // need for all template
          if (this.dataCampaign.campaign_type === '1') {
            this.selectType('Coupon in %');
          }else if(this.dataCampaign.campaign_type === '2'){
            this.selectType('Coupon in $');
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
    }else{
      this.mainService.dataCampaign.name = '';
      this.mainService.dataCampaign.desription = '';
      this.mainService.dataCampaign.campaign_type = '';
      this.mainService.dataCampaign.discount = '';
      this.mainService.dataCampaign.startDate = '';
      this.mainService.dataCampaign.endDate = '';
      this.mainService.dataCampaign.brand_id = '';
      this.mainService.dataCampaign.card_id = '';
      this.mainService.dataCampaign.coupon_validity = '';
      this.mainService.dataCampaign.currency = '';
      this.mainService.dataCampaign.event_name = '';
      this.mainService.dataCampaign.venue = '';
      this.mainService.dataCampaign.time = '';
      this.mainService.dataCampaign.cardType = '';
      this.dataCampaign = this.mainService.dataCampaign;
      this.myForm.controls['template'].setValue('');
      this.ticketForm.controls['template'].setValue('');
    }
  }

  ngOnInit() {
  }

  // onChange() {
  //   console.log(this.numberOfCoupon);
  //   // const userType = JSON.parse(localStorage.getItem('user')).account_type;
  //   let validationRegex;

  //   switch (this.numberOfCoupon) {
  //     case 'Up to 100':
  //       validationRegex = /^(100|([1-9]{1}[0-9]?))$/g;
  //       break;
  //     case '100-10k':
  //       validationRegex = /^(10000|([1-9]{1}[0-9]{0,3}))$/g;
  //       break;
  //     default:
  //       validationRegex = /^(100|([1-9]{1}[0-9]?))$/g;
  //       break;
  //   }

  //   if (!validationRegex.exec(this.limit)) {
  //     this.limit = '';
  //   }
  // }

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

  create() {
    
    if (!this.dataCampaign.brand_id) {
      this.dataCampaign.brand_id = JSON.parse(localStorage.getItem('currentBrand'))['brand_id'];
    }
    if (this.myForm.valid) {
      this.dataCampaign.cardType = this.cardType;
      this.mainService.dataCampaign = this.dataCampaign;

      if (this.id) {
        this.router.navigate(['/main/campaign-main/review-campaign/' + this.id]);
      } else {
        this.router.navigate(['/main/campaign-main/review-campaign']);
      }
    }if (this.ticketForm.valid) {
      this.dataCampaign.cardType = this.cardType;
      this.mainService.dataCampaign = this.dataCampaign;

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
      this.cardType = 'coupon';
      this.myForm.get('discount').setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.myForm.get('discount').updateValueAndValidity();
      setTimeout(() => {
        (document.getElementById('discountInput') as HTMLInputElement).style.backgroundImage = "url('assets/img/percent.png')";
      }, 50);
    }else if(typeName === 'Coupon in $'){
      this.selectedSell = 'Coupon in $';
      this.dataCampaign.campaign_type = 2;
      this.dataCampaign.venue = '';
      this.dataCampaign.event_name = '';
      this.dataCampaign.time='';
      this.cardType = 'coupon';
      this.myForm.get('discount').setValidators([Validators.required, Validators.min(0)]);
      this.myForm.get('discount').updateValueAndValidity();
      setTimeout(() => {
        (document.getElementById('discountInput') as HTMLInputElement).style.backgroundImage = "url('assets/img/dollar.png')";
      }, 50);    
    }else if(typeName === 'Webinar Event'){
      this.selectedSell = 'Webinar Event';
      this.dataCampaign.campaign_type = 9;
      this.dataCampaign.endDate = '';
      this.dataCampaign.currency = '';
      this.dataCampaign.discount='';
      this.dataCampaign.coupon_validity='';
      console.log(this.dataCampaign);
      this.cardType = 'ticket';    
    }
  }

  clear() {
    if (!this.noCoupons || !this.noCards || !this.noTickets) {
      this.select.reset();
    }
    this.dataCampaign = {
      name: '',
      desription: '',
      template: '',
      discount: '',
      startDate: '',
      endDate: '',
      coupon_validity: '',
      event_name: '',
      venue: '',
      time: '',
    };
    // this.myForm.get('setLimit').setValue('');
  }
}
