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
  sharingUrl;

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

      this.sharingUrl = SERVER_API_URL + 'campaign/shared/' + this.campaign.campaign_code;
      if (this.campaign.campaign_type <= 4) {
        this.url = SERVER_API_URL + 'coupon';
      } else if (this.campaign.campaign_type == 5) {
        this.url = SERVER_API_URL + 'loyaltyCard';
      }else if (this.campaign.campaign_type == 6) {
        this.url = SERVER_API_URL + 'stampCard';
      } else if (this.campaign.campaign_type <= 9) {
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

  downloadQR(){
    const qrCode = document.getElementById('qrCode') as HTMLElement;
    const img = qrCode.children[1];
    qrCode.innerHTML = qrCode.innerHTML + `<a download='${this.campaign.campaign_code}' id='downloadQR' href='${img['src']}' style="display: none;">DownloadQR</a>`;
    const a = document.getElementById('downloadQR') as HTMLElement;
    a.click();
    a.parentNode.removeChild(a);
  }

}
