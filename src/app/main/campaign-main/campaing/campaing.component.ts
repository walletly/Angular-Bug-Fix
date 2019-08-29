import { Component, OnInit } from '@angular/core';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { Router } from '@angular/router';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-campaing',
  templateUrl: './campaing.component.html',
  styleUrls: ['./campaing.component.scss']
})
export class CampaingComponent implements OnInit {
  showActions;
  defaultColumns = ['Type', 'Campaign', 'Integrations', 'Issued', 'Redeemed', 'Start Date', 'End Date', 'Status', 'Action'];
  //  defaultColumns = ['Campaign Name', 'Description', 'Template', 'Issued', 'Redeemed', 'Start Date', 'End Date', 'Status', 'Action'];
  allColumns = this.defaultColumns;
  campaigns;
  inChangeStatus = '';
  searchText;

  data;
  filteredData = [];
  showLoader;

  constructor(private campaignService: CompaignService, private router: Router, private mainService: MainService) {
    if (JSON.parse(localStorage.getItem('user'))['user_type'] !== 4) {
      this.showLoader = true;
      this.getCampaigns();
    }
  }

  ngOnInit() {
  }

  getCampaigns() {
    // this.mainService.showLoader.emit(true);

    this.campaignService.getСampaignsBrands(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(data => {
      this.data = [];
      console.log(data);
      this.campaigns = data['data'];

      this.campaigns.forEach(element => {
        // let type;
        // switch (element.campaign_type) {
        //   case 1:
        //     type = 'Coupon in %';
        //     break;

        //   case 2:
        //     type = 'Coupon in $';
        //     break;

        //   case 3:
        //     type = 'Birthday Coupon';
        //     break;

        //   case 4:
        //     type = 'Referral Coupon';
        //     break;

        //   default:
        //     break;
        // }
        if(element.campaign_type == 5 || element.campaign_type == 6){
          this.data.unshift({
            data: {
              'Type': { name: this.getTypeImage(element.campaign_type) },
              'Campaign': { name: element.campaign_name },
              'Integrations': { name: element.integrations },
              // 'Template': { name: element.campaign_type_formatted },
              'Issued': { name: element.coupons_created },
              'Redeemed': { name: element.total_redeems },
              'Start Date': { name: element.startDateFormatted },
              'End Date': { name: element.endDateFormatted },
              'Status': { name: element.is_active },
              'Action': { name: '' },
              'Id': { name: element.id },
              'Brand_Id': { name: element.brand_id }
            }
          });
        }else{
          this.data.push({
            data: {
              'Type': { name: this.getTypeImage(element.campaign_type) },
              'Campaign': { name: element.campaign_name },
              'Integrations': { name: element.integrations },
              // 'Template': { name: element.campaign_type_formatted },
              'Issued': { name: element.coupons_created },
              'Redeemed': { name: element.total_redeems },
              'Start Date': { name: element.startDateFormatted },
              'End Date': { name: element.endDateFormatted },
              'Status': { name: element.is_active },
              'Action': { name: '' },
              'Id': { name: element.id },
              'Brand_Id': { name: element.brand_id }
            }
          });
        }
        console.log(this.data);
      });

      this.filteredData = this.data;
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    }, err => {
      console.log(err);
      this.data = [];
      // this.mainService.showLoader.emit(false);
      this.filteredData = [];
      this.showLoader = false;
    });
  }

  changeStatus(label, input, id, status, event) {
    event.stopPropagation();
    this.inChangeStatus = id;
    label.classList.add('disable');
    this.campaignService.updateСampaign(id, { is_active: !status }).subscribe(result => {
      console.log(result);
      const msg = (!status) ? 'activated' : 'deactivated';
      this.mainService.showToastrSuccess.emit({text: `Campaign has been ${msg}`});
      this.getCampaigns();
      (document.getElementById(input) as HTMLInputElement).checked = !((document.getElementById(input) as HTMLInputElement).checked);
      label.classList.remove('disable');
      this.inChangeStatus = '';
    }, err => {
      console.log(err);
      label.classList.remove('disable');
      this.inChangeStatus = '';
    });
  }

  edit(id, event) {
    event.stopPropagation();

    this.router.navigate(['/main/campaign-main/create-campaign/' + id.name]);
  }

  delete(id, brand_id, event) {
    event.stopPropagation();

    console.log({ campaign_id: id });
    this.campaignService.deleteСampaign({ campaign_id: id, brand_id: brand_id }).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.mainService.showToastrSuccess.emit({text: 'Campaign deleted'});
        this.getCampaigns();
      }
    });
  }

  filterCampaigns() {
    this.filteredData = this.data.filter(element => {
      console.log(element);
      console.log(element.data['Campaign']);
      if (element.data['Campaign'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
        return true;
      }
    });
    console.log(this.filteredData);
  }

  goToDetails(id) {
    this.router.navigate(['/main/campaign-main/details/' + id]);
  }

  showShared(row, event) {
    event.stopPropagation();
    this.showActions = row;
  }

  refresh() {
    this.showLoader = true;
    this.getCampaigns();
  }

  addCampaign(){
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
      event_name: '',
      venue: '',
      time: '',
      cardType: '',
      points: ''
    };
    this.router.navigate(['/main/campaign-main/create-campaign']);
  }

  getTypeImage(type){
    switch (type){
      case 1:{
        return 'assets/img/Coupon.png';
      }
      case 2:{
        return 'assets/img/Coupon-in-$.png';
      }
      case 3:{
        return 'assets/img/Birthday-Coupon.png';
      }
      case 4:{
        return 'assets/img/Referral-Coupon.png';
      }
      case 5:{
        return 'assets/img/LoyaltyCard.png';
      }
      case 6:{
        return 'assets/img/stampCard.png';
      }
      case 7:{
        return 'assets/img/membershipCard.png';
      }
      case 8:{
        return 'assets/img/eventTickets.png';
      }
      case 9:{
        return 'assets/img/webinarIcon.png';
      }
    }
  }
}
