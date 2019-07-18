import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { CardService } from 'src/app/shared/services/card.service';
import { SERVER_API_URL } from '../../../../environments/environment';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent implements OnInit {
  toolTipStatus = 'Copy';
  showAletr = true;
  showLoader;
  inProcces;

  id;
  campaign;
  campaignType;
  card;
  discount;

  url = SERVER_API_URL + 'coupon';

  constructor(
    private activeRout: ActivatedRoute,
    private campaignService: CompaignService,
    private cardService: CardService,
    private router: Router
  ) {
    this.id = this.activeRout.snapshot.paramMap.get('id');
    this.showLoader = true;
    this.campaignService.getСampaignById(this.id).subscribe(data => {
      console.log(data);
      this.campaign = data['data'];
      this.discount = (this.campaign.campaign_type == 1) ? `${this.campaign.campaign_value} %` : `${this.campaign.campaign_value} ${this.campaign.currency}`;
      this.cardService.getCardById(this.campaign.card_id).subscribe(dataCard => {
        console.log(dataCard);
        this.card = dataCard['data'];
        this.showLoader = false;
      });

      switch (this.campaign.campaign_type) {
        case 1:
          this.campaignType = 'Coupon in %';
          break;

        case 2:
          this.campaignType = 'Coupon in $';
          break;

        case 3:
          this.campaignType = 'Birthday Coupon';
          break;

        case 4:
          this.campaignType = 'Referral Coupon';
          break;

        default:
          break;
      }
    });
  }

  ngOnInit() { }

  edit() {
    this.router.navigate(['/main/campaign-main/create-campaign/' + this.id]);
  }

  delete() {
    console.log('asdasdasd');
    
    this.inProcces = true;
    // this.campaignService.deleteСampaign({ campaign_id: this.id, brand_id: this.card.brand_id }).subscribe(result => {
    //   console.log(result);
    //   this.router.navigate(['/main/campaign-main/campaign']);
    //   this.inProcces = false;
    // });
  }

  mouseMove() {
    this.toolTipStatus = 'Copy';
  }

  closeAlert() {
    this.showAletr = false;
  }

  copyApi() {
    this.toolTipStatus = 'Copied';
  }
}
