import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MainService } from 'src/app/shared/services/main.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CompaignService } from 'src/app/shared/services/compaign.service';

@Component({
  selector: 'app-create-campaing',
  templateUrl: './create-campaing.component.html',
  styleUrls: ['./create-campaing.component.scss']
})
export class CreateCampaingComponent implements OnInit {

  myForm: FormGroup;
  customValidation = true;
  campaign = {};

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private router: Router
    ) {
    this.myForm = formBuilder.group({
      campaignName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      template: ["", [Validators.required]],
      discount: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });
  }

  @ViewChild('select') select;

  defaultColumns = ['Coupons', 'Cards', 'Tickets'];
  allColumns = this.defaultColumns;

  data = [
    {
      data: { 'Coupons': { name: 'Coupon in $', icon: 'assets/img/Coupon-in-$.png' }, 'Cards': { name: 'Loyalty Card', icon: 'assets/img/LoyaltyCard.png' }, 'Tickets': { name: 'Event Tickets', icon: 'assets/img/eventTickets.png' } },
    },
    {
      data: { 'Coupons': { name: 'Coupon in %', icon: 'assets/img/Coupon.png' }, 'Cards': { name: 'Stamp Card', icon: 'assets/img/stampCard.png' }, 'Tickets': { name: '', icon: '' } },
    },
    {
      data: { 'Coupons': { name: 'Birthday Coupon', icon: 'assets/img/Birthday-Coupon.png' }, 'Cards': { name: 'Membership Card', icon: 'assets/img/membershipCard.png' }, 'Tickets': { name: '', icon: '' } },
    },
    {
      data: { 'Coupons': { name: 'Referral Coupon', icon: 'assets/img/Referral-Coupon.png' }, 'Cards': { name: '', icon: '' }, 'Tickets': { name: '', icon: '' } },
    },
  ];

  template;
  selectedSell;
  dateStart = new Date();
  dateEnd = new Date();
  dataCoupon;
  showDatePickerEnd;
  showDatePicker;

  ngOnInit() {
    this.dataCoupon = this.mainService.dataCoupon;
  }

  create() {
    if (this.mainService.dataCoupon.template) {
      this.myForm.controls['template'].setValue(this.mainService.dataCoupon.template);
    }
    if (this.myForm.valid) {
      this.mainService.dataCoupon = this.dataCoupon;
      this.router.navigate(['/main/campaign-main/review-campaing']);
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
    this.dataCoupon.endDate = moment(event).format('DD/MM/YYYY');
    let compare = this.compare(this.dateStart, event);
    if (compare === 1 || (compare === 0 && this.dateStart)) {
      this.dataCoupon.startDate = null;
    }
    console.log(this.compare(this.dateStart, event));
    this.showDatePickerEnd = false;
  }
  dateStartChange(event) {
    this.dataCoupon.startDate = moment(event).format('DD/MM/YYYY');
    let compare = this.compare(event, this.dateEnd);
    if (compare === 1 || compare === 0) {
      this.dataCoupon.endDate = null;
    }
    console.log(this.compare(event, this.dateEnd));
    this.showDatePicker = false;
  }

  compare(dateTimeA, dateTimeB) {
    let momentA = moment(dateTimeA, "DD/MM/YYYY");
    let momentB = moment(dateTimeB, "DD/MM/YYYY");
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
  }

  clear() {
    this.select.reset();
    this.dataCoupon = {
      name: '',
      desription: '',
      template: '',
      discount: '',
      startDate: '',
      endDate: '',
    };
  }

  createCampaign() {
    this.campaign['campaign_name'] = this.dataCoupon.name;
    this.campaign['description'] = this.dataCoupon.desription;
    this.campaign['campaign_type'] = 1;
    // this.campaign['campaign_type'] this.dataCoupon.
    this.campaign['campaign_value'] = this.dataCoupon.discount;
    this.campaign['start_date'] = this.dataCoupon.startDate;
    this.campaign['end_date'] = this.dataCoupon.endDate;
  }
}
