import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { CardService } from 'src/app/shared/services/card.service';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review-campaing',
  templateUrl: './review-campaing.component.html',
  styleUrls: ['./review-campaing.component.scss']
})
export class ReviewCampaingComponent implements OnInit {

  id;

  constructor(
    private mainService: MainService,
    private cardService: CardService,
    private campaignService: CompaignService,
    private router: Router,
    private activeRout: ActivatedRoute
  ) {
    this.id = this.activeRout.snapshot.paramMap.get('id');
  }

  dataCoupon;
  data;
  couponBack;
  campaign = {};
  messError;
  inProcces = false;
  showLoader;

  ngOnInit() {
    this.dataCoupon = this.mainService.dataCoupon;
    console.log(this.dataCoupon);

    this.data = this.mainService.couponsData[0];
    // this.mainService.showLoader.emit(true);
    this.showLoader = true;
    this.cardService.getCardById(this.dataCoupon.card_id).subscribe(data => {
      console.log(data);
      this.data = data['data'];
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    }, err => {
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    });
  }

  create() {
    this.inProcces = true;
    this.mainService.dataCoupon = this.dataCoupon;
    this.createCampaign();
    if (this.id) {
      console.log(this.campaign);
      this.campaignService.updateСampaign(this.id, this.campaign).subscribe(result => {
        console.log(result);
        if (result['success']) {
          this.mainService.dataCoupon = {
            name: '',
            desription: '',
            card_id: '',
            discount: '',
            startDate: '',
            endDate: '',
            campaign_type: '',
            brand_id: ''
          };
          this.router.navigate(['/main/campaign-main/campaign']);
          this.mainService.showToastrSuccess.emit({text: 'Campaign updated'});
          this.inProcces = false;
        }
      }, err => {
        this.messError = 'Error during update';
        this.inProcces = false;
      });
    } else {
      this.campaignService.createСampaign(this.campaign).subscribe(result => {
        console.log(result);
        if (result['success']) {
          this.mainService.dataCoupon = {
            name: '',
            desription: '',
            card_id: '',
            discount: '',
            startDate: '',
            endDate: '',
            campaign_type: '',
            brand_id: ''
          };
          this.mainService.showToastrSuccess.emit({text: 'Campaign created'});
          this.router.navigate(['/main/campaign-main/campaign']);
          this.inProcces = false;
        }
      }, err => {
        console.log(err);
        if (err.error.code === 605) {
          this.mainService.showToastr.emit({currentCountCompany: '4/4', futureCountCompany: '10/10', type: 'basic'});
        }
        this.messError = 'Error at creation';
        this.inProcces = false;
      });
    }
  }

  edit() {
    if (this.id) {
      this.router.navigate(['/main/campaign-main/create-campaign/' + this.id]);
    } else {
      this.router.navigate(['/main/campaign-main/create-campaign']);
    }
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
