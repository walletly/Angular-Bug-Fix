import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { CardService } from 'src/app/shared/services/card.service';
import { SERVER_API_URL } from '../../../../environments/environment';
import { MainService } from 'src/app/shared/services/main.service';

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
  integrations = [];

  id;
  campaign;
  campaignType;
  card;
  discount;
  platform = { 'ManyChat': false, 'ActiveChat': false, 'Offline': false };

  url;

  constructor(
    private activeRout: ActivatedRoute,
    private campaignService: CompaignService,
    private cardService: CardService,
    private router: Router,
    private mainService: MainService
  ) {
    this.id = this.activeRout.snapshot.paramMap.get('id');
    this.showLoader = true;
    this.getCampaignDetails();
  }

  ngOnInit() { }

  getCampaignDetails() {
    this.campaignService.getСampaignById(this.id).subscribe(data => {
      console.log(data);
      this.campaign = data['data'];
      this.discount = (this.campaign.campaign_type == 1) ? `${this.campaign.campaign_value} %` : `${this.campaign.campaign_value} ${this.campaign.currency}`;
      this.cardService.getCardById(this.campaign.card_id).subscribe(dataCard => {
        console.log(dataCard);
        this.card = dataCard['data'];
        if (this.card.card_type == 1) {
          this.url = SERVER_API_URL + 'coupon';
        } else if (this.card.card_type == 3) {
          this.url = SERVER_API_URL + 'ticket';
        }
        this.showLoader = false;
      });

      if (this.campaign.campaign_type) {
        this.campaignType = this.campaign.campaign_type_formatted;
      }
      this.integrations = this.campaign.integrations;
      if (this.campaign.integrations) {
        this.campaign.integrations.forEach(element => {
          if (element === 'ManyChat') {
            this.platform.ManyChat = true;
          }
          if (element === 'ActiveChat') {
            this.platform.ActiveChat = true;
          }
          if (element === 'Offline') {
            this.platform.Offline = true;
          }
        });
      }
    });
  }

  edit() {
    this.router.navigate(['/main/campaign-main/create-campaign/' + this.id]);
  }

  delete() {
    this.inProcces = true;
    this.campaignService.deleteСampaign({ campaign_id: this.id, brand_id: this.card.brand_id }).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.mainService.showToastrSuccess.emit({text: 'Campaign deleted'});
        this.router.navigate(['/main/campaign-main/campaign']);
      }
      this.inProcces = false;
    }, err => {
      console.log(err);
      this.inProcces = false;
    });
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
  updateCampaignIntegrations() {
    this.integrations = [];
     // Checking Active Platforms For Integrations
     if (this.platform.ActiveChat) {
      this.integrations.push('ActiveChat');
    }
    if (this.platform.ManyChat) {
      this.integrations.push('ManyChat');
    }
    if (this.platform.Offline) {
      this.integrations.push('Offline');
    }
    // Updating Campaign With Selected Integrations
    console.log(this.integrations);
    this.inProcces = true;
    this.campaignService.updateСampaign(this.id, { 'integrations': this.integrations}).subscribe(result => {
      console.log(result);
      this.integrations = [];
      this.getCampaignDetails();
      this.mainService.showToastrSuccess.emit({text: 'Integration saved'});
      this.inProcces = false;
    }, err => {
      console.log(err);
      this.integrations = [];
      this.inProcces = false;
    });
  }
}
