import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/shared/services/brand.service';
import { MainService } from 'src/app/shared/services/main.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as localForage from 'localforage';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss']
})
export class AudienceComponent implements OnInit {
  currentUser;
  currentBrand;
  showActions;
  checkAllcoupons;
  checkAlltickets;
  checkAllLoyaltyCards;
  checkAllStampCards;
  checkAllMembershipCards;
  showLoader;
  // defaultColumns = ['First Name', 'Last Name', 'Email Address', 'Type', 'Campaign Name', 'Issue Date', 'Expiry', 'Status'];
  couponColumns = ['Check', 'Campaign Name', 'Type', 'Issue Date', 'Expiry', 'Email Address', 'Status'];
  // cardColumns = ['Check', 'Campaign Name', 'Type', 'Issue Date', 'Stamps/Points', 'Email Address', 'Redeem Count'];
  stampCardColumns = ['Check', 'Campaign Name', 'Issue Date', 'Stamps', 'Email Address', 'Redeem Count'];
  loyaltyCardColumns = ['Check', 'Campaign Name', 'Issue Date', 'Points', 'Email Address', 'Redeem Count'];
  membershipCardColumns = ['Check', 'Campaign Name', 'Issue Date', 'Email Address', 'Redeem Count', 'Status'];
  eventColumns = ['Check', 'Campaign Name', 'Type', 'Start Date', 'Members', 'Email Address', 'Check in'];
  allCouponColumns = this.couponColumns;
  // allCardColumns = this.cardColumns;
  allLoyaltyCardColumns = this.loyaltyCardColumns;
  allMembershipCardColumns = this.membershipCardColumns;
  allstampCardColumns = this.stampCardColumns;
  alleventColumns = this.eventColumns;

  data = [];
  type;
  searchText;
  CouponAudience = [];
  TicketAudience = [];
  loyaltyCardAudience = [];
  membershipCardAudience = [];
  stampCardAudience = [];
  filterCouponAudience = [];
  filterTicketAudience = [];
  filterloyaltyCardAudience = [];
  filterMembershipCardAudience = [];
  filterstampCardAudience = [];

  // data = [
  //   {
  //     data: { 'First Name': { name: 'Rashid' }, 'Last Name': { name: 'Sharif' }, 'Email Address': { name: 'rashid.gd@msn.com' }, 'Type': { name: 'Coupon in %', icon: 'assets/img/Coupon.png' }, 'Campaign Name': { name: 'My First Campaign' }, 'Issue Date': { name: '23/10/2019' }, 'Expiry': { name: '21/11/2019' }, 'Status': { name: 'Used' } },
  //   },
  //   {
  //     data: { 'First Name': { name: 'Rashid' }, 'Last Name': { name: 'Sharif' }, 'Email Address': { name: 'rashid.gd@msn.com' }, 'Type': { name: 'Coupon in %', icon: 'assets/img/Coupon-in-$.png' }, 'Campaign Name': { name: 'My First Campaign' }, 'Issue Date': { name: '23/10/2019' }, 'Expiry': { name: '21/11/2019' }, 'Status': { name: 'Unused' } },
  //   },
  //   {
  //     data: { 'First Name': { name: 'Rashid' }, 'Last Name': { name: 'Sharif' }, 'Email Address': { name: 'rashid.gd@msn.com' }, 'Type': { name: 'Coupon in %', icon: 'assets/img/Birthday-Coupon.png' }, 'Campaign Name': { name: 'My First Campaign' }, 'Issue Date': { name: '23/10/2019' }, 'Expiry': { name: '21/11/2019' }, 'Status': { name: 'Expired' } },
  //   },
  // ];

  constructor(private brandService: BrandService, private mainService: MainService) {
    this.showLoader = true;
  }

  ngOnInit() {
  }

  async getCouponAudience() {
    this.currentUser = await localForage.getItem('user');
    this.currentBrand = await localForage.getItem('currentBrand');
    if (this.currentUser.user_type !== 4) {
      this.brandService.getBrandCouponAudience(this.currentBrand.brand_id).subscribe(result => {
        console.log(result);
        let audiences;

        if (result['success']) {
          audiences = result['data']['coupons'];

          audiences.forEach(element => {

          this.CouponAudience.push({
            data: {
              'First Name' : {name : element.firstName},
              'Last Name' : {name : element.lastName},
              'Phone': {name: element.phone || ''},
              'Email Address': { name: element.email },
              'Join Date' : {name: element.createDateFormatted},
              'Source' : {name: ''},
              'Campaign Name': { name: element.campaign_name },
              'Type': {
                name: element.campaign_type_formatted ||
                // (element.campaign_type == 1) ?
                // 'Coupon in %' :
                // (element.campaign_type == 2) ?
                // 'Coupon in $' :
                // (element.campaign_type == 3) ?
                // 'Birthday Coupon' :
                // (element.campaign_type == 4) ?
                // 'ReferralCoupon' :
                // (element.campaign_type == 5) ?
                // 'Loyalty Card' :
                // (element.campaign_type == 6) ?
                // 'Stamp Card' :
                // (element.campaign_type == 7) ?
                // 'Membership Card' :
                // (element.campaign_type == 8) ?
                // 'Event Ticket' :
                // (element.campaign_type == 9) ?
                // 'Webinar Ticket' :
                ''
                ,
                icon:
                (element.campaign_type_formatted == 'Coupon in %') ?
                'assets/img/Coupon.png' :
                (element.campaign_type_formatted == 'Coupon in $') ?
                'assets/img/Coupon-in-$.png' :
                (element.campaign_type_formatted == 'Birthday Coupon') ?
                'assets/img/Birthday-Coupon.png' :
                (element.campaign_type_formatted == 'ReferralCoupon') ?
                'assets/img/Referral-Coupon.png' :
                // (element.campaign_type == 5) ?
                // 'assets/img/LoyaltyCard.png' :
                // (element.campaign_type == 6) ?
                // 'assets/img/stampCard.png' :
                // (element.campaign_type == 7) ?
                // 'assets/img/membershipCard.png' :
                // (element.campaign_type == 8) ?
                // 'assets/img/eventTickets.png' :
                // (element.campaign_type == 9) ?
                // 'assets/img/webinarIcon.png' :
                ''
              },
              'Issue Date': { name: element.createDateFormatted },
              'Expiry': { name: element.endDateFormatted },
              'Status': { name:  element.status },

              'Joining Date' : { name: element.createDateFormatted },
              'Lifetime': { name: element.endDateFormatted },
              'Action' : { name: '' },

              'Start Date' : { name: element.createDateFormatted },
              'Members' : { name: '' },
              'Check in' : { name: '' }
            }
          });

        });
        this.filterCouponAudience = this.CouponAudience;
      }
      this.showLoader = false;
    }, err => {
      this.CouponAudience = [];
      this.showLoader = false;
    });
  } else {
    this.data = [];
    this.showLoader = false;
  }
  }

  async getStampCardAudience() {
    if (this.currentUser.user_type !== 4) {
      this.brandService.getBrandStampCardAudience(this.currentBrand.brand_id).subscribe(result => {
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['stampCards'];

          audiences.forEach(element => {
            this.stampCardAudience.push({
              data: {
              'First Name' : {name : element.firstName},
              'Last Name' : {name : element.lastName},
              'Phone': {name: element.phone || ''},
              'Check' : { name: '' },
              'Campaign Name': { name: element.campaign_name },
              'Issue Date': { name: element.createDateFormatted },
              'Stamps': { name: element.stamps },
              'Email Address': { name: element.email },
              'Redeem Count': { name: element.redeem_count }
              }
            });
          });
          this.filterstampCardAudience = this.stampCardAudience;
        }
        this.showLoader = false;
      }, err => {
        console.log(err);
        this.stampCardAudience = [];
        this.showLoader = false;
      });
    }
  }

  async getTicketAudience() {
    if (this.currentUser.user_type !== 4) {
      this.brandService.getBrandTicketAudience(this.currentBrand.brand_id).subscribe(result =>{
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['tickets'];

          audiences.forEach(element => {
            this.TicketAudience.push({
              data: {
              'First Name' : {name : element.firstName},
              'Last Name' : {name : element.lastName},
              'Phone': {name: element.phone || ''},
              'Check' : { name: '' },
              'Campaign Name': { name: element.campaign_name },
              'Type': {
                name: element.campaign_type_formatted ||
                // (element.campaign_type == 8) ?
                // 'Event Ticket' :
                // (element.campaign_type == 9) ?
                // 'Webinar Ticket' :
                ''
                ,
                icon:
                (element.campaign_type_formatted == 'Event Tickets') ?
                'assets/img/eventTickets.png' :
                (element.campaign_type_formatted == 'Webinar Event') ?
                'assets/img/webinarIcon.png' :
                ''
              },
              'Start Date' : { name: element.createDateFormatted },
              'Members' : {
                name:
                (element.members) ?
                element.members :
                ''
              },
              'Email Address': { name: element.email },
              'Check in' : { name: element.is_redeemed }
              }
            });
          });
          this.filterTicketAudience = this.TicketAudience;
        }
        this.showLoader = false;
      }, err => {
        console.log(err);
        this.TicketAudience = [];
        this.showLoader = false;
      });
    }
  }

  async getLoyaltyCardAudience() {
    if (this.currentUser.user_type !== 4) {
      this.brandService.getBrandLoyaltyCardAudience(this.currentBrand.brand_id).subscribe(result => {
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['loyaltyCards'];

          audiences.forEach(element => {
            this.loyaltyCardAudience.push({
              data: {
              'First Name' : {name : element.firstName},
              'Last Name' : {name : element.lastName},
              'Phone': {name: element.phone || ''},
              'Check' : { name: '' },
              'Campaign Name': { name: element.campaign_name },
              'Issue Date': { name: element.createDateFormatted },
              'Points': { name: element.points },
              'Email Address': { name: element.email },
              'Redeem Count': { name: element.redeem_count }
              }
            });
          });
          this.filterloyaltyCardAudience = this.loyaltyCardAudience;
        }
        this.showLoader = false;
      }, err => {
        console.log(err);
        this.loyaltyCardAudience = [];
        this.showLoader = false;
      });
    }
  }

  async getMembershipCardAudience() {
    if (this.currentUser.user_type !== 4) {
      this.brandService.getBrandMembershipCardAudience(this.currentBrand.brand_id).subscribe(result => {
        this.membershipCardAudience = [];
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['membershipCards'];

          audiences.forEach(element => {
            this.membershipCardAudience.push({
              data: {
              'First Name' : {name : element.firstName},
              'Last Name' : {name : element.lastName},
              'Phone': {name: element.phone || ''},
              'Check' : { name: '' },
              'Campaign Name': { name: element.campaign_name },
              'Issue Date': { name: element.createDateFormatted },
              'Email Address': { name: element.email },
              'Redeem Count': { name: element.redeem_count },
              'Status': {name: element.is_active},
              'Id': { name: element.id }
              }
            });
          });
          this.filterMembershipCardAudience = this.membershipCardAudience;
          if(this.searchText && this.searchText != ''){
            this.filterCampaigns(this.type);
          }
        }
        this.showLoader = false;
      }, err => {
        console.log(err);
        this.membershipCardAudience = [];
        this.showLoader = false;
      });
    }
  }

  refreshCoupons() {
    this.showLoader = true;
    this.searchText = '';
    this.CouponAudience = [];
    this.getCouponAudience();
  }
  refreshTickets() {
    this.showLoader = true;
    this.searchText = '';
    this.TicketAudience = [];
    this.getTicketAudience();
  }
  refreshStampCards() {
    this.showLoader = true;
    this.searchText = '';
    this.stampCardAudience = [];
    this.getStampCardAudience();
  }
  refreshLoyaltyCards() {
    this.showLoader = true;
    this.searchText = '';
    this.loyaltyCardAudience = [];
    this.getLoyaltyCardAudience();
  }
  refreshMembershipCards() {
    this.showLoader = true;
    this.searchText = '';
    this.membershipCardAudience = [];
    this.getMembershipCardAudience();
  }

  onChangeTab(event) {
    console.log(event);
    this.searchText = '';
    this.filterCampaigns(this.type);
    if (event.tabTitle === 'Coupons') {
      this.type = 'Coupons';
      if(this.CouponAudience.length == 0){
        this.showLoader = true;
        this.getCouponAudience();
      }
    } else if (event.tabTitle === 'Tickets') {
      this.type = 'Tickets';
      if(this.TicketAudience.length == 0){
        this.showLoader = true;
        this.getTicketAudience();
      }
    } else if (event.tabTitle === 'Loyalty Cards') {
      this.type = 'Loyalty Cards';
      if(this.loyaltyCardAudience.length == 0){
        this.showLoader = true;
        this.getLoyaltyCardAudience();
      }
    } else if (event.tabTitle === 'Stamp Cards') {
      this.type = 'Stamp Cards';
      if(this.stampCardAudience.length == 0){
        this.showLoader = true;
        this.getStampCardAudience();
      }
    }else if (event.tabTitle === 'Membership Cards') {
      this.type = 'Membership Cards';
      if(this.membershipCardAudience.length == 0){
        this.showLoader = true;
        this.getMembershipCardAudience();
      }
    }

  }

  filterCampaigns(type) {
    if (type === 'Coupons') {
      this.filterCouponAudience = this.CouponAudience.filter(element => {
        console.log(element);
        console.log(element.data['Campaign Name']);
        if (element.data['Campaign Name'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
          return true;
        }
      });
      console.log(this.filterCouponAudience);
    } else if (type === 'Tickets') {
      this.filterTicketAudience = this.TicketAudience.filter(element => {
        console.log(element);
        console.log(element.data['Campaign Name']);
        if (element.data['Campaign Name'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
          return true;
        }
      });
      console.log(this.filterTicketAudience);
    } else if (type === 'Loyalty Cards') {
      this.filterloyaltyCardAudience = this.loyaltyCardAudience.filter(element => {
        console.log(element);
        console.log(element.data['Campaign Name']);
        if (element.data['Campaign Name'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
          return true;
        }
      });
      console.log(this.filterloyaltyCardAudience);
    } else if (type === 'Stamp Cards') {
      this.filterstampCardAudience = this.stampCardAudience.filter(element => {
        console.log(element);
        console.log(element.data['Campaign Name']);
        if (element.data['Campaign Name'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
          return true;
        }
      });
      console.log(this.filterstampCardAudience);
    } else if (type === 'Membership Cards') {
      this.filterMembershipCardAudience = this.membershipCardAudience.filter(element => {
        console.log(element);
        console.log(element.data['Campaign Name']);
        if (element.data['Campaign Name'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
          return true;
        }
      });
      console.log(this.filterloyaltyCardAudience);
    } 
  }


  downloadCoupons() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Coupons Audience',
      useBom: false,
      noDownload: false,
      headers: ['First Name', 'Last Name', 'Phone', 'Campaign Name', 'Type', 'Issue Date', 'Expiry', 'Email Address']
    };
    const coupons = [];
    this.filterCouponAudience.forEach(result => {
      coupons.push({
        'First Name': result['data']['First Name'].name,
        'Last Name': result['data']['Last Name'].name,
        'Phone': result['data']['Phone'].name,
        'Campaign Name':  result['data']['Campaign Name'].name,
        'Type': result['data']['Type'].name,
        'Issue Date': result['data']['Issue Date'].name,
        'Expiry': result['data']['Expiry'].name,
        'Email Address': result['data']['Email Address'].name
      });
    });

    // tslint:disable-next-line: no-unused-expression
    new ngxCsv(coupons, 'Coupons Audience', options);
  }

  downloadStampCards() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Stamp Cards Audience',
      useBom: false,
      noDownload: false,
      headers: ['First Name', 'Last Name', 'Phone', 'Campaign Name', 'Issue Date', 'Stamps', 'Email Address', 'Redeem Count']
    };
    const check = [];
    this.filterstampCardAudience.forEach(result => {
      check.push({
        'First Name': result['data']['First Name'].name,
        'Last Name': result['data']['Last Name'].name,
        'Phone': result['data']['Phone'].name,
        'Campaign Name':  result['data']['Campaign Name'].name,
        'Issue Date': result['data']['Issue Date'].name,
        'Stamps': result['data']['Stamps'].name,
        'Email Address': result['data']['Email Address'].name,
        'Redeem Count': result['data']['Redeem Count'].name
      });
    });
    new ngxCsv(check, 'Stamps Cards Audience', options);
  }

  downloadLoyaltyCards() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Loyalty Cards Audience',
      useBom: false,
      noDownload: false,
      headers: ['First Name', 'Last Name', 'Phone', 'Campaign Name', 'Issue Date', 'Points', 'Email Address', 'Redeem Count']
    };
    const check = [];
    this.filterloyaltyCardAudience.forEach(result => {
      check.push({
        'First Name': result['data']['First Name'].name,
        'Last Name': result['data']['Last Name'].name,
        'Phone': result['data']['Phone'].name,
        'Campaign Name':  result['data']['Campaign Name'].name,
        'Issue Date': result['data']['Issue Date'].name,
        'Points': result['data']['Points'].name,
        'Email Address': result['data']['Email Address'].name,
        'Redeem Count': result['data']['Redeem Count'].name
      });
    });
    new ngxCsv(check, 'Loyalty Cards Audience', options);
  }

  downloadMembershipCards() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Membership Cards Audience',
      useBom: false,
      noDownload: false,
      headers: ['First Name', 'Last Name', 'Phone', 'Campaign Name', 'Issue Date', 'Email Address', 'Redeem Count', 'Status']
    };
    const check = [];
    this.filterMembershipCardAudience.forEach(result => {
      check.push({
        'First Name': result['data']['First Name'].name,
        'Last Name': result['data']['Last Name'].name,
        'Phone': result['data']['Phone'].name,
        'Campaign Name':  result['data']['Campaign Name'].name,
        'Issue Date': result['data']['Issue Date'].name,
        'Email Address': result['data']['Email Address'].name,
        'Redeem Count': result['data']['Redeem Count'].name,
        'Status': result['data']['Status'].name ? 'Active' : 'Inactive',
      });
    });
    new ngxCsv(check, 'Membership Cards Audience', options);
  }

  downloadTickets() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Tickets Audience',
      useBom: false,
      noDownload: false,
      headers: ['First Name', 'Last Name', 'Phone', 'Campaign Name', 'Type', 'Start Date', 'Members', 'Email Address']
    };
    const check = [];
    this.filterTicketAudience.forEach(result => {
      check.push({
        'First Name': result['data']['First Name'].name,
        'Last Name': result['data']['Last Name'].name,
        'Phone': result['data']['Phone'].name,
        'Campaign Name':  result['data']['Campaign Name'].name,
        'Type': result['data']['Type'].name,
        'Start Date': result['data']['Start Date'].name,
        'Members': result['data']['Members'].name,
        'Email Address': result['data']['Email Address'].name
      });
    });
    // const data = [
    //   {
    //     name: 'Test 1',
    //     age: 13,
    //     average: 8.2,
    //     approved: true,
    //     description: 'using "Content here, content here" '
    //   },
    // ];
    // tslint:disable-next-line: no-unused-expression
    new ngxCsv(check, 'Tickets Audience', options);
  }

  changeMembershipCardStatus(label, input, id, event) {
    event.stopPropagation();
    label.classList.add('disable');
    this.brandService.changeMembershipCardStatus(id).subscribe(result => {
      this.mainService.showToastrSuccess.emit({text: `Membership Card is now ${result['data'].updated_status}`});
      this.getMembershipCardAudience();
      (document.getElementById(input) as HTMLInputElement).checked = !((document.getElementById(input) as HTMLInputElement).checked);
      label.classList.remove('disable');
    }, err => {
      console.log(err);
      label.classList.remove('disable');
    });
  }

}
