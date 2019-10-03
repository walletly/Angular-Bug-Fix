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
  monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  date;

  constructor(
    private mainService: MainService,
    private cardService: CardService,
    private campaignService: CompaignService,
    private router: Router,
    private activeRout: ActivatedRoute
  ) {
    this.id = this.activeRout.snapshot.paramMap.get('id');
    this.dataCampaign = this.mainService.dataCampaign;
    console.log(this.dataCampaign);

    this.date = new Date(this.dataCampaign.startDate);
    this.date = `${this.date.getDate()} ${this.monthNames[this.date.getMonth()]} ${this.date.getFullYear()}`;
  }

  dataCampaign;
  data;
  couponBack = false;
  couponBackSide = false;
  campaign = {};
  messError;
  inProcces = false;
  showLoader;
  discount;

  ngOnInit() {
    this.discount = (this.dataCampaign.campaign_type == 1) ? `${this.dataCampaign.discount} %` : `${this.dataCampaign.discount} ${this.dataCampaign.currency}`

    this.data = this.mainService.couponsData[0];
    // this.mainService.showLoader.emit(true);
    this.showLoader = true;
    this.cardService.getCardById(this.dataCampaign.card_id).subscribe(data => {
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
    this.mainService.dataCampaign = this.dataCampaign;
    this.createCampaign();
    if (this.id) {
      console.log(this.campaign);
      this.campaignService.updateСampaign(this.id, this.campaign).subscribe(result => {
        console.log(result);
        if (result['success']) {
          this.mainService.dataCampaign = {
            name: '',
            description: '',
            selectedCustomField: '',
            card_id: '',
            discount: '',
            startDate: '',
            endDate: '',
            campaign_type: '',
            brand_id: '',
            coupon_validity: '',
            currency: '',
            memCard_status_customField: '',
            event_name: '',
            venue: '',
            venue_coordinates: null,
            time: '',
            cardType: '',
            points: ''
          };
          this.router.navigate(['/main/campaign-main/details/' + this.id]);
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
          this.mainService.dataCampaign = {
            name: '',
            description: '',
            selectedCustomField: '',
            card_id: '',
            discount: '',
            startDate: '',
            endDate: '',
            campaign_type: '',
            brand_id: '',
            coupon_validity: '',
            currency: '',
            memCard_status_customField: '',
            event_name: '',
            venue: '',
            venue_coordinates: null,
            time: '',
            cardType: '',
            points: ''
          };
          this.router.navigate(['/main/campaign-main/campaign-integration/' + result['campaign']]);
          this.mainService.showToastrSuccess.emit({text: 'Campaign created'});
          this.inProcces = false;
        }
      }, err => {
        console.log(err);
        if (err.error.code === 602) {
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
    this.campaign['campaign_name'] = this.dataCampaign.name;
    this.campaign['description'] = this.dataCampaign.description;
    this.campaign['manychat_customField'] = this.dataCampaign.selectedCustomField;
    this.campaign['manychat_CF_memCard_status'] = this.dataCampaign.memCard_status_customField;
    this.campaign['campaign_type'] = parseInt(this.dataCampaign.campaign_type);
    this.campaign['currency'] = this.dataCampaign.currency;
    this.campaign['coupon_validity'] = parseInt(this.dataCampaign.coupon_validity);
    this.campaign['campaign_value'] = String(this.dataCampaign.discount);
    this.campaign['start_date'] = this.dataCampaign.startDate;
    this.campaign['end_date'] = this.dataCampaign.endDate;
    this.campaign['card_id'] = this.dataCampaign.card_id;
    this.campaign['brand_id'] = this.dataCampaign.brand_id;
    this.campaign['event_name'] = this.dataCampaign.event_name;
    this.campaign['time'] = this.dataCampaign.time;
    this.campaign['venue'] = this.dataCampaign.venue;
    this.campaign['venue_coordinates'] = this.dataCampaign.venue_coordinates;
    this.campaign['points'] = this.dataCampaign.points;
    let date = new Date();
    let offset = date.getTimezoneOffset();
    this.campaign['offset'] = offset;
  }

  changeSide(){
    this.couponBack = !this.couponBack;
    setTimeout(() => {
      this.couponBackSide = !this.couponBackSide;
    }, 200);
  }
}
