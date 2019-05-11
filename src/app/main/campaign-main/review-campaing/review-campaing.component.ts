import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { CardService } from 'src/app/shared/services/card.service';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-campaing',
  templateUrl: './review-campaing.component.html',
  styleUrls: ['./review-campaing.component.scss']
})
export class ReviewCampaingComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private cardService: CardService,
    private campaignService: CompaignService,
    private router: Router
  ) { }

  dataCoupon;
  data;
  couponBack;
  campaign = {};
  messError;
  inProcces = false;

  ngOnInit() {
    this.dataCoupon = this.mainService.dataCoupon;
    console.log(this.dataCoupon);

    this.data = this.mainService.couponsData[0];
    this.cardService.getCardById(this.dataCoupon.card_id).subscribe(data => {
      console.log(data);
      this.data = data['data'];
    });
  }

  create() {
    this.inProcces = true;
    this.mainService.dataCoupon = this.dataCoupon;
    this.createCampaign();
    this.campaignService.createСampaign(this.campaign).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.mainService.dataCoupon = {
          name: '',
          desription: '',
          template: '',
          discount: '',
          startDate: '',
          endDate: '',
          card_id: '',
          brand_id: ''
        };
        this.router.navigate(['/main/campaign-main/campaign']);
        this.inProcces = false;
      }
    }, err => {
      this.messError = err.error.error;
      this.inProcces = false;
    });
  }

  createCampaign() {
    this.campaign['campaign_name'] = this.dataCoupon.name;
    this.campaign['description'] = this.dataCoupon.desription;
    this.campaign['campaign_type'] = 1;
    this.campaign['campaign_value'] = this.dataCoupon.discount;
    this.campaign['start_date'] = this.dataCoupon.startDate;
    this.campaign['end_date'] = this.dataCoupon.endDate;
    this.campaign['card_id'] = this.dataCoupon.card_id;
    this.campaign['brand_id'] = this.dataCoupon.brand_id;
  }
}
