import { Component, OnInit } from '@angular/core';
import { CompaignService } from 'src/app/shared/services/compaign.service';

@Component({
  selector: 'app-campaing',
  templateUrl: './campaing.component.html',
  styleUrls: ['./campaing.component.scss']
})
export class CampaingComponent implements OnInit {
  showActions;
  defaultColumns = ['Type', 'Campaign Name', 'Description', 'Walletly Card', 'Start Date', 'End Date', 'Status', 'Action'];
  allColumns = this.defaultColumns;
  campaigns;
  searchText;

  data;
  filteredData = [];
  // this.data = [
  //   {
  //     data: { 'Type': { name: 'Coupon in $' }, 'Campaign Name': { name: 'My First Campaign' }, 'Description': { name: '50% discount coup..' }, 'Walletly Card': { name: 'My First Template' }, 'Start Date': { name: '23/10/2019' }, 'End Date': { name: '23/11/2019' }, 'Status': { name: 'true' }, 'Action': { name: '' } },
  //   },
  //   {
  //     data: { 'Type': { name: 'Coupon in $' }, 'Campaign Name': { name: 'My First Campaign' }, 'Description': { name: '50% discount coup..' }, 'Walletly Card': { name: 'My First Template' }, 'Start Date': { name: '23/10/2019' }, 'End Date': { name: '23/11/2019' }, 'Status': { name: 'false' }, 'Action': { name: '' } },
  //   },
  // ];

  constructor(private campaignService: CompaignService) {
    this.getCampaigns();
  }

  ngOnInit() {
  }

  getCampaigns() {
    this.campaignService.getСampaignsBrands(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(data => {
      this.data = [];
      console.log(data);
      this.campaigns = data['data'];

      this.campaigns.forEach(element => {
        let type;
        switch (element.campaign_type) {
          case 1:
            type = 'Coupon in %';
            break;

          case 2:
            type = 'Coupon in $';
            break;

          case 3:
            type = 'Birthday Coupon';
            break;

          case 4:
            type = 'Referral Coupon';
            break;

          default:
            break;
        }
        this.data.push({
          data: {
            'Type': { name: type },
            'Campaign Name': { name: element.campaign_name },
            'Description': { name: element.description },
            'Walletly Card': { name: element.campaign_name },
            'Start Date': { name: element.start_date },
            'End Date': { name: element.end_date },
            'Status': { name: element.is_active },
            'Action': { name: '' },
            'Id': { name: element.id}
          }
        });
        console.log(this.data);
      });

      this.filteredData = this.data;

    }, err => {
      console.log(err);
      this.data = [];
    });
  }

  delete(id) {
    console.log({campaign_id: id});
    this.campaignService.deleteСampaign({campaign_id: id}).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.getCampaigns();
      }
    });
  }

  filterCampaigns() {

    this.filteredData['data'] = this.data.filter(element => {
      console.log(element);
      console.log(element.data['Campaign Name']);
      if (element.data['Campaign Name'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
        return true;
      }
    });
    console.log(this.filteredData);
  }
}
