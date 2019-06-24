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
  customValidation = true;
  campaign = {};
  id;
  numberOfCoupon;
  cards = [];

  template;
  selectedSell;
  dateStart = new Date();
  dateEnd = new Date();
  dataCoupon;
  showDatePickerEnd;
  showDatePicker;
  showLoader;
  noTemplates = false;
  limit = '';

  @ViewChild('select') select;
  @ViewChild('selectNumber') selectNumber;

  defaultColumns = ['Coupons', 'Cards', 'Tickets'];
  allColumns = this.defaultColumns;
  user;

  public customPatterns = { '0': { pattern: new RegExp('\d{1,2}') } };

  data = [
    {
      data: { 'Coupons': { name: 'Coupon in $', icon: 'assets/img/Coupon-in-$.png', locked: true }, 'Cards': { name: 'Loyalty Card', icon: 'assets/img/LoyaltyCard.png', locked: true }, 'Tickets': { name: 'Event Tickets', icon: 'assets/img/eventTickets.png', locked: true } },
    },
    {
      data: { 'Coupons': { name: 'Coupon in %', icon: 'assets/img/Coupon.png', locked: false }, 'Cards': { name: 'Stamp Card', icon: 'assets/img/stampCard.png', locked: true }, 'Tickets': { name: '', icon: '' } },
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
      discount: ["", [Validators.required]],
      numberOfCoupon: ["", [Validators.required]],
      setLimit: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });

    this.id = this.activeRout.snapshot.paramMap.get('id');

    cardService.getBrandsCards(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(data => {
      this.cards = data['data'];
      console.log(this.cards);
      console.log(this.dataCoupon);
      if (!this.dataCoupon) {
        this.dataCoupon = this.mainService.dataCoupon;
        this.myForm.controls['template'].setValue(this.dataCoupon.card_id);
        console.log(this.dataCoupon);
        // need for all template
        if (this.dataCoupon.campaign_type === '1') {
          this.selectedSell = 'Coupon in %';
        }
      }
    }, err => {
      if (!this.dataCoupon) {
        this.dataCoupon = this.mainService.dataCoupon;
        this.noTemplates = true;
        this.myForm.controls['template'].setValue(this.dataCoupon.card_id);
        console.log(this.dataCoupon);
        // need for all template
        if (this.dataCoupon.campaign_type === '1') {
          this.selectedSell = 'Coupon in %';
        }
      }
    });

    if (this.id && !this.mainService.dataCoupon.name) {
      // this.mainService.showLoader.emit(true);
      this.showLoader = true;
      this.campaignService.getСampaignById(this.id).subscribe(result => {
        console.log(result['data']);
        if (result['success']) {
          this.mainService.dataCoupon.name = result['data'].campaign_name;
          this.mainService.dataCoupon.desription = result['data'].description;
          this.mainService.dataCoupon.campaign_type = result['data'].campaign_type.toString();
          this.mainService.dataCoupon.discount = result['data'].campaign_value;
          this.mainService.dataCoupon.startDate = result['data'].startDateFormatted;
          this.mainService.dataCoupon.endDate = result['data'].endDateFormatted;
          this.mainService.dataCoupon.brand_id = result['data'].brand_id;
          this.mainService.dataCoupon.card_id = result['data'].card_id;
          this.dataCoupon = this.mainService.dataCoupon;
          console.log(this.dataCoupon);
          this.myForm.controls['template'].setValue(this.dataCoupon.card_id);

          // need for all template
          if (this.dataCoupon.campaign_type === '1') {
            this.selectedSell = 'Coupon in %';
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

  ngOnInit() {
  }

  onChange() {
    console.log(this.numberOfCoupon);
    // const userType = JSON.parse(localStorage.getItem('user')).account_type;
    let validationRegex;

    switch (this.numberOfCoupon) {
      case 'Up to 100':
        validationRegex = /^(100|([1-9]{1}[0-9]?))$/g;
        break;
      case '100-10k':
        validationRegex = /^(10000|([1-9]{1}[0-9]{0,3}))$/g;
        break;
      default:
        validationRegex = /^(100|([1-9]{1}[0-9]?))$/g;
        break;
    }

    if (!validationRegex.exec(this.limit)) {
      this.limit = '';
    }
  }

  changeDiscount(event) {
    this.dataCoupon.discount = event;
  }

  create() {

    if (!this.dataCoupon.brand_id) {
      this.dataCoupon.brand_id = JSON.parse(localStorage.getItem('currentBrand'))['brand_id'];
    }
    if (this.myForm.valid) {
      this.mainService.dataCoupon = this.dataCoupon;
      console.log(this.mainService.dataCoupon);

      if (this.id) {
        this.router.navigate(['/main/campaign-main/review-campaign/' + this.id]);
      } else {
        this.router.navigate(['/main/campaign-main/review-campaign']);
      }
      // this.createCampaign();
      // this.campaignService.createСampaign(this.campaign).subscribe(result => {
      //   console.log(result);
      //   if (result['success']) {
      //   }
      // });
    } else {
      this.customValidation = false;
    }
  }

  dateEndChange(event) {
    this.dataCoupon.endDate = moment(event).format('YYYY-MM-DD');
    const compare = this.compare(this.dateStart, event);
    if (compare === 1 || (compare === 0 && this.dateStart)) {
      this.dataCoupon.startDate = null;
    }
    console.log(this.compare(this.dateStart, event));
    this.showDatePickerEnd = false;
  }

  numberOfCouponChange(e) {
    console.log(this.selectNumber);
    console.log(e);
    this.numberOfCoupon = e;
  }

  dateStartChange(event) {
    this.dataCoupon.startDate = moment(event).format('YYYY-MM-DD');
    const compare = this.compare(event, this.dateEnd);
    if (compare === 1 || compare === 0) {
      this.dataCoupon.endDate = null;
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
      this.dataCoupon.campaign_type = '1';
    }
  }

  clear() {
    if (!this.noTemplates) {
      this.select.reset();
    }
    this.dataCoupon = {
      name: '',
      desription: '',
      template: '',
      discount: '',
      startDate: '',
      endDate: '',
    };
  }
}
