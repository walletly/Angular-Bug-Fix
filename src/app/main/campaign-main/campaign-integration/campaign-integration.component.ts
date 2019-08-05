import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { SERVER_API_URL } from '../../../../environments/environment';
import { MainService } from 'src/app/shared/services/main.service';



@Component({
  selector: 'app-campaign-integration',
  templateUrl: './campaign-integration.component.html',
  styleUrls: ['./campaign-integration.component.scss']
})
export class CampaignIntegrationComponent implements OnInit {
  toolTipStatus = 'Copy';
  inProcces;
  showLoader;
  integrations = [];
  id;
  campaign;
  campaignType;
  platform: { 'ManyChat': false, 'ActiveChat': false, 'Offline': false };

  url;
  constructor(
    private activeRout: ActivatedRoute,
    private campaignService: CompaignService,
    private router: Router,
    private mainService: MainService
  ) {
    this.id = this.activeRout.snapshot.paramMap.get('id');
    console.log(this.id);

    this.showLoader = true;

    this.campaignService.getСampaignById(this.id).subscribe(data => {
      console.log(data);
      this.campaign = data['data'];

      if (this.campaign.campaign_type <= 1) {
        this.url = SERVER_API_URL + 'coupon';
      } else if (this.campaign.campaign_type <= 7) {
        this.url = SERVER_API_URL + 'card';
      } else if (this.campaign.campaign_type >= 8) {
        this.url = SERVER_API_URL + 'ticket';
      }
      this.showLoader = false;
    });

    this.platform = { 'ManyChat': false, 'ActiveChat': false, 'Offline': false };
  }

  ngOnInit() {
  }

  updateCampaign() {
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
    console.log(this.id);
    this.inProcces =  true;
    this.campaignService.updateСampaign(this.id, { 'integrations': this.integrations}).subscribe(result => {
      console.log(result);
      this.integrations = [];
      this.mainService.showToastrSuccess.emit({text: 'Integration saved'});
      this.inProcces = false;
      this.router.navigate(['/main/campaign-main/campaign/']);
    }, err => {
      console.log(err);
      this.integrations = [];
      this.inProcces = false;
    });

  }

  mouseMove() {
    this.toolTipStatus = 'Copy';
  }

  copyApi() {
    this.toolTipStatus = 'Copied';
  }

}
