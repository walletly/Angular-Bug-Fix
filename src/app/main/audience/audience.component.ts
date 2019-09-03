import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/shared/services/brand.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { error } from 'util';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss']
})
export class AudienceComponent implements OnInit {
  showActions;
  checkAllcoupons;
  checkAlltickets;
  checkAllLoyaltyCards;
  checkAllStampCards;
  showLoader;
  // defaultColumns = ['First Name', 'Last Name', 'Email Address', 'Type', 'Campaign Name', 'Issue Date', 'Expiry', 'Status'];
  couponColumns = ['Check', 'Campaign Name', 'Type', 'Issue Date', 'Expiry', 'Email Address', 'Status'];
  // cardColumns = ['Check', 'Campaign Name', 'Type', 'Issue Date', 'Stamps/Points', 'Email Address', 'Redeem Count'];
  stampCardColumns = ['Check', 'Campaign Name', 'Issue Date', 'Stamps', 'Email Address', 'Redeem Count'];
  loyaltyCardColumns = ['Check', 'Campaign Name', 'Issue Date', 'Points', 'Email Address', 'Redeem Count'];
  eventColumns = ['Check', 'Campaign Name', 'Type', 'Start Date', 'Members', 'Email Address', 'Check in'];
  allCouponColumns = this.couponColumns;
  // allCardColumns = this.cardColumns;
  allLoyaltyCardColumns = this.loyaltyCardColumns;
  allstampCardColumns = this.stampCardColumns;
  alleventColumns = this.eventColumns;

  data = [];
  type;
  searchText;
  CouponAudience = [];
  TicketAudience = [];
  loyaltyCardAudience = [];
  stampCardAudience = [];
  filterCouponAudience = [];
  filterTicketAudience = [];
  filterloyaltyCardAudience = [];
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

  constructor(private brandService: BrandService) {
    this.showLoader = true;
  }

  ngOnInit() {
  }

  getCouponAudience() {
    if (JSON.parse(localStorage.getItem("user"))["user_type"] !== 4) {
      this.brandService.getBrandCouponAudience(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(result => {
        console.log(result);
        let audiences;

        if (result['success']) {
          audiences = result['data']['coupons'];

          audiences.forEach(element => {

          this.CouponAudience.push({
            data: {
              'First Name' : {name : element.firstName},
              'Last Name' : {name : element.lastName},
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

  getStampCardAudience() {
    if (JSON.parse(localStorage.getItem('user'))['user_type'] !== 4) {
      this.brandService.getBrandStampCardAudience(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(result => {
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['stampCards'];

          audiences.forEach(element => {
            this.stampCardAudience.push({
              data: {
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

  getTicketAudience() {
    if (JSON.parse(localStorage.getItem('user'))['user_type'] !== 4) {
      this.brandService.getBrandTicketAudience(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(result =>{
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['tickets'];

          audiences.forEach(element => {
            this.TicketAudience.push({
              data: {
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

  getLoyaltyCardAudience() {
    if (JSON.parse(localStorage.getItem('user'))['user_type'] !== 4) {
      this.brandService.getBrandLoyaltyCardAudience(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(result => {
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['loyaltyCards'];

          audiences.forEach(element => {
            this.loyaltyCardAudience.push({
              data: {
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

  refreshCoupons() {
    this.showLoader = true;
    this.CouponAudience = [];
    this.getCouponAudience();
  }
  // refreshCards() {
  //   this.showLoader = true;
  //   this.getCardAudience();
  // }
  refreshTickets() {
    this.showLoader = true;
    this.TicketAudience = [];
    this.getTicketAudience();
  }
  refreshStampCards() {
    this.showLoader = true;
    this.stampCardAudience = [];
    this.getStampCardAudience();
  }

  refreshLoyaltyCards() {
    this.showLoader = true;
    this.loyaltyCardAudience = [];
    this.getLoyaltyCardAudience();
  }

  onChangeTab(event) {
    console.log(event);
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
      headers: ['Campaign Name', 'Type', 'Issue Date', 'Expiry', 'Email Address']
    };
    const coupons = [];
    this.filterCouponAudience.forEach(result => {
      coupons.push({
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
      headers: ['Campaign Name', 'Issue Date', 'Stamps', 'Email Address', 'Redeem Count']
    };
    const check = [];
    this.filterstampCardAudience.forEach(result => {
      check.push({
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
      headers: ['Campaign Name', 'Issue Date', 'Points', 'Email Address', 'Redeem Count']
    };
    const check = [];
    this.filterloyaltyCardAudience.forEach(result => {
      check.push({
        'Campaign Name':  result['data']['Campaign Name'].name,
        'Issue Date': result['data']['Issue Date'].name,
        'Points': result['data']['Points'].name,
        'Email Address': result['data']['Email Address'].name,
        'Redeem Count': result['data']['Redeem Count'].name
      });
    });
    new ngxCsv(check, 'Loyalty Cards Audience', options);
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
      headers: ['Campaign Name', 'Type', 'Start Date', 'Members', 'Email Address']
    };
    const check = [];
    this.filterTicketAudience.forEach(result => {
      check.push({
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

}
