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
  showActions;
  checkAllcoupons = true;
  checkAlltickets = true;
  checkAllStampCards = true;
  checkAllLoyaltyCards = true;
  checkAllMembershipCards = true;
  showLoader;
  couponColumns = ['Check', 'Name', 'Email Address', 'Days Left', 'Status', 'Finance', 'Device'];
  eventColumns = ['Check', 'Name', 'Email Address', 'Days Left', 'Members', 'Check in', 'Device'];
  stampCardColumns = ['Check', 'Name', 'Email Address', 'Issue Date', 'Stamps', 'Redeem Count', 'Finance', 'Device'];
  loyaltyCardColumns = ['Check', 'Name', 'Email Address', 'Issue Date', 'Points', 'Redeem Count', 'Finance', 'Device'];
  membershipCardColumns = ['Check', 'Name', 'Email Address', 'Issue Date', 'Redeem Count', 'Status', 'Device'];
  // cardColumns = ['Check', 'Campaign Name', 'Type', 'Issue Date', 'Stamps/Points', 'Email Address', 'Redeem Count'];
  allCouponColumns = this.couponColumns;
  alleventColumns = this.eventColumns;
  allstampCardColumns = this.stampCardColumns;
  allLoyaltyCardColumns = this.loyaltyCardColumns;
  allMembershipCardColumns = this.membershipCardColumns;
  // allCardColumns = this.cardColumns;

  data = [];
  type = 'coupons';
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
  selectedAudience = [];
  campaignNames = [];
  campaignName;

  currentUser;
  currentBrand;


  constructor(private brandService: BrandService, private mainService: MainService) {
    this.showLoader = true;
    this.getCouponAudience();
  }

  ngOnInit() {
  }

  async getCouponAudience() {
    this.currentUser = await localForage.getItem("user");
    this.currentBrand = await localForage.getItem('currentBrand');
    if (this.currentUser.user_type !== 4) {
      this.brandService.getBrandCouponAudience(this.currentBrand.brand_id).subscribe(result => {
        this.CouponAudience = [];
        console.log(result);
        let audiences;

        if (result['success']) {
          audiences = result['data']['coupons'];

          audiences.forEach(element => {
            // tslint:disable-next-line: max-line-length
            let daysLeft
            if(new Date(element.endDateFormatted).getTime() > new Date().getTime()){
              daysLeft = Math.floor((new Date(element.endDateFormatted).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            } else {
              daysLeft = 'Expired';
            }

          this.CouponAudience.push({
            data: {
              'Check': { name: true },
              'Name' : {name : element.firstName ? `${element.firstName} ${element.lastName}` : ''},
              'Email Address': { name: element.email },
              'Campaign Name': { name: element.campaign_name },
              'Type': {
                name: element.campaign_type_formatted,
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
              'Days Left': { name: daysLeft },
              'Status': { name:  element.is_redeemed ? 'Used' : 'Unused' },
              'Finance': { name: element.amount_spent ? element.amount_spent : '' },
              'Device': { name: element.is_wallet ? element.deviceType ? element.deviceType : 'Apple' : '' },
            }
          });

        });
        this.filterCouponAudience = this.CouponAudience;
        this.getCampaign();
        this.addSelect()
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

  async getTicketAudience() {
    this.currentUser = await localForage.getItem("user");
    this.currentBrand = await localForage.getItem('currentBrand');
    if (this.currentUser.user_type !== 4) {
      this.brandService.getBrandTicketAudience(this.currentBrand.brand_id).subscribe(result =>{
        this.TicketAudience = []
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['tickets'];

          audiences.forEach(element => {

            let daysLeft

            if(new Date(element.startDateFormatted).getTime() > new Date().getTime()){
              daysLeft = Math.floor((new Date(element.startDateFormatted).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            } else {
              daysLeft = 'Expired';
            }

            this.TicketAudience.push({
              data: {
              'Check': { name: true },
              'Name': { name: `${element.firstName} ${element.lastName}`},
              'Email Address': { name: element.email },
              'Campaign Name': { name: element.campaign_name },
              'Type': {
                name: element.campaign_type_formatted,
                icon:
                (element.campaign_type_formatted == 'Event Tickets') ?
                'assets/img/eventTickets.png' :
                (element.campaign_type_formatted == 'Webinar Event') ?
                'assets/img/webinarIcon.png' :
                ''
              },
              'Days Left': { name: daysLeft },
              'Members': {
                name:
                (element.members) ?
                element.members :
                ''
              },
              'Check in': { name: element.is_redeemed },
              'Device': { name: element.is_wallet ? element.deviceType ? element.deviceType : 'Apple' : '' }
              }
            });
          });
          this.filterTicketAudience = this.TicketAudience;
          this.getCampaign();
          this.addSelect()

        }
        this.showLoader = false;
      }, err => {
        console.log(err);
        this.TicketAudience = [];
        this.showLoader = false;
      });
    }
  }

  async getStampCardAudience() {
    this.currentUser = await localForage.getItem("user");
    this.currentBrand = await localForage.getItem('currentBrand');
    if (this.currentUser.user_type !== 4) {
      this.brandService.getBrandStampCardAudience(this.currentBrand.brand_id).subscribe(result => {
        this.stampCardAudience = []
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['stampCards'];

          audiences.forEach(element => {
            this.stampCardAudience.push({
              data: {
              'Check': { name: true },
              'Name': { name: `${element.firstName} ${element.lastName}` },
              'Email Address': { name: element.email },
              'Campaign Name': { name: element.campaign_name },
              'Issue Date': { name: element.createDateFormatted },
              'Stamps': { name: element.stamps },
              'Redeem Count': { name: element.redeem_count },
              'Finance': { name: element.amount_spent ? element.amount_spent : '' },
              'Device': {  name: element.is_wallet ? element.deviceType ? element.deviceType : 'Apple' : '' }
              }
            });
          });
          this.filterstampCardAudience = this.stampCardAudience;
          this.getCampaign();
          this.addSelect()

        }
        this.showLoader = false;
      }, err => {
        console.log(err);
        this.stampCardAudience = [];
        this.showLoader = false;
      });
    }
  }

  async getLoyaltyCardAudience() {
    this.currentUser = await localForage.getItem("user");
    this.currentBrand = await localForage.getItem('currentBrand');
    if (this.currentUser.user_type !== 4) {
      this.brandService.getBrandLoyaltyCardAudience(this.currentBrand.brand_id).subscribe(result => {
        this.loyaltyCardAudience = [];
        console.log(result);
        let audiences;
        if (result['success']) {
          audiences = result['data']['loyaltyCards'];

          audiences.forEach(element => {
            this.loyaltyCardAudience.push({
              data: {
              'Check': { name: true },
              'Name': { name: `${element.firstName} ${element.lastName}` },
              'Email Address': { name: element.email },
              'Campaign Name': { name: element.campaign_name },
              'Issue Date': { name: element.createDateFormatted },
              'Points': { name: element.points },
              'Redeem Count': { name: element.redeem_count },
              'Finance': { name: element.amount_spent ? element.amount_spent : '' },
              'Device': {  name: element.is_wallet ? element.deviceType ? element.deviceType : 'Apple' : '' }
              }
            });
          });
          this.filterloyaltyCardAudience = this.loyaltyCardAudience;
          this.getCampaign();
          this.addSelect()

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
    this.currentUser = await localForage.getItem("user");
    this.currentBrand = await localForage.getItem('currentBrand');
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
              'Check' : { name: true },
              'Name': { name: `${element.firstName} ${element.lastName}` },
              'Email Address': { name: element.email },
              'Campaign Name': { name: element.campaign_name },
              'Issue Date': { name: element.createDateFormatted },
              'Redeem Count': { name: element.redeem_count },
              'Status': {name: element.is_active},
              'Device': { name: element.is_wallet ? element.deviceType ? element.deviceType : 'Apple' : '' },
              'Id': { name: element.id }
              }
            });
          });
          this.filterMembershipCardAudience = this.membershipCardAudience;
          this.getCampaign();
          this.addSelect()

        }
        this.showLoader = false;
      }, err => {
        console.log(err);
        this.membershipCardAudience = [];
        this.showLoader = false;
      });
    }
  }

  refresh() {
    this.showLoader = true;
    if(this.type === 'coupons'){
      this.CouponAudience = [];
      this.getCouponAudience();
    } else if (this.type === 'tickets'){
      this.TicketAudience = [];
      this.getTicketAudience();
    } else if (this.type === 'stamp_cards'){
      this.stampCardAudience = [];
      this.getStampCardAudience();
    } else if (this.type === 'loyalty_cards'){
      this.loyaltyCardAudience = [];
      this.getLoyaltyCardAudience();
    } else if (this.type === 'membership_cards'){
      this.membershipCardAudience = [];
      this.getMembershipCardAudience();
    }
  }

  onChangeTab() {
    this.selectedAudience = [];
    this.campaignNames = [];
    this.checkAllcoupons = true;
    this.checkAlltickets = true;
    this.checkAllStampCards = true;
    this.checkAllLoyaltyCards = true;
    this.checkAllMembershipCards = true;
    if (this.type === 'coupons') {
      this.showLoader = true;
      this.getCouponAudience();
    } else if (this.type === 'tickets') {
      this.showLoader = true;
      this.getTicketAudience();
    } else if (this.type === 'stamp_cards'){
      this.showLoader = true;
      this.getStampCardAudience();
    } else if (this.type === 'loyalty_cards'){
      this.showLoader = true;
      this.getLoyaltyCardAudience();
    } else if (this.type === 'membership_cards'){
      this.showLoader = true;
      this.getMembershipCardAudience();
    }
  }

  filterCampaigns() {
    if (this.type === 'coupons') {
      this.filterCouponAudience = this.CouponAudience.filter(element => {

        if (element.data['Campaign Name'].name.includes(this.campaignName)) {
          return true;
        }
      });
      console.log(this.filterCouponAudience);
      this.addSelect();
    } else if (this.type === 'tickets') {
      this.filterTicketAudience = this.TicketAudience.filter(element => {
        console.log(element);
        console.log(element.data['Campaign Name']);
        if (element.data['Campaign Name'].name.includes(this.campaignName)) {
          return true;
        }
      });
      console.log(this.filterTicketAudience);
      this.addSelect();
    } else if (this.type === 'loyalty_cards') {
      this.filterloyaltyCardAudience = this.loyaltyCardAudience.filter(element => {
        console.log(element);
        console.log(element.data['Campaign Name']);
        if (element.data['Campaign Name'].name.includes(this.campaignName)) {
          return true;
        }
      });
      console.log(this.filterloyaltyCardAudience);
      this.addSelect();
    } else if (this.type === 'stamp_cards') {
      this.filterstampCardAudience = this.stampCardAudience.filter(element => {
        console.log(element);
        console.log(element.data['Campaign Name']);
        if (element.data['Campaign Name'].name.includes(this.campaignName)) {
          return true;
        }
      });
      console.log(this.filterstampCardAudience);
      this.addSelect();
    } else if (this.type === 'membership_cards') {
      this.filterMembershipCardAudience = this.membershipCardAudience.filter(element => {
        console.log(element);
        console.log(element.data['Campaign Name']);
        if (element.data['Campaign Name'].name.includes(this.campaignName)) {
          return true;
        }
      });
      console.log(this.filterMembershipCardAudience);
      this.addSelect();
    }
  }

  download() {
    if(this.type === 'coupons'){
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Coupons Audience',
        useBom: false,
        noDownload: false,
        headers: ['Name', 'Email Address', 'Campaign Name', 'Type', 'Days Left', 'Status', 'Device']
      };
      const coupons = [];
      this.selectedAudience.forEach(result => {
        coupons.push({
          'Name': result['data']['Name'].name,
          'Email Address': result['data']['Email Address'].name,
          'Campaign Name':  result['data']['Campaign Name'].name,
          'Type': result['data']['Type'].name,
          'Days Left': result['data']['Days Left'].name,
          'Status': result['data']['Status'].name,
          'Device': result['data']['Device'].name
        });
      });
      // tslint:disable-next-line: no-unused-expression
      new ngxCsv(coupons, 'Coupons Audience', options);
    } else if (this.type === 'tickets') {
        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          title: 'Tickets Audience',
          useBom: false,
          noDownload: false,
          headers: ['Name', 'Email Address', 'Campaign Name', 'Type', 'Days Left', 'Members', 'Check in', 'Device']
        };
      const check = [];
      this.selectedAudience.forEach(result => {
        check.push({
          'Name': result['data']['Name'].name,
          'Email Address': result['data']['Name'].name,
          'Campaign Name':  result['data']['Campaign Name'].name,
          'Type': result['data']['Type'].name,
          'Days Left': result['data']['Days Left'].name,
          'Members': result['data']['Members'].name,
          'Check in': result['data']['Check in'].name ? 'Yes' : 'No',
          'Device': result['data']['Device'].name
        });
      });
      new ngxCsv(check, 'Tickets Audience', options);
    } else if (this.type === 'stamp_cards'){
        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          title: 'Stamp Cards Audience',
          useBom: false,
          noDownload: false,
          headers: ['Name', 'Email Address', 'Campaign Name', 'Issue Date', 'Stamps', 'Redeem Count', 'Device']
        };
      const check = [];
      this.selectedAudience.forEach(result => {
        check.push({
          'Name': result['data']['Name'].name,
          'Email Address': result['data']['Name'].name,
          'Campaign Name':  result['data']['Campaign Name'].name,
          'Issue Date': result['data']['Issue Date'].name,
          'Stamps': result['data']['Stamps'].name,
          'Redeem Count': result['data']['Redeem Count'].name,
          'Device': result['data']['Device'].name
        });
      });
      new ngxCsv(check, 'Stamps Cards Audience', options);
    } else if (this.type === 'loyalty_cards') {
        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          title: 'Loyalty Cards Audience',
          useBom: false,
          noDownload: false,
          headers: ['Name', 'Email Address', 'Campaign Name', 'Issue Date', 'Points', 'Redeem Count', 'Device']
        };
      const check = [];
      this.selectedAudience.forEach(result => {
        check.push({
          'Name': result['data']['Name'].name,
          'Email Address': result['data']['Email Address'].name,
          'Campaign Name':  result['data']['Campaign Name'].name,
          'Issue Date': result['data']['Issue Date'].name,
          'Points': result['data']['Points'].name,
          'Redeem Count': result['data']['Redeem Count'].name,
          'Device': result['data']['Device'].name
        });
      });
      new ngxCsv(check, 'Loyalty Cards Audience', options);
    } else if (this.type === 'membership_cards'){
        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          title: 'Membership Cards Audience',
          useBom: false,
          noDownload: false,
          headers: ['Name', 'Email Address', 'Campaign Name', 'Issue Date', 'Redeem Count', 'Status', 'Device']
        };
      const check = [];
      this.selectedAudience.forEach(result => {
        check.push({
          'Name': result['data']['Name'].name,
          'Email Address': result['data']['Email Address'].name,
          'Campaign Name':  result['data']['Campaign Name'].name,
          'Issue Date': result['data']['Issue Date'].name,
          'Redeem Count': result['data']['Redeem Count'].name,
          'Status': result['data']['Status'].name ? 'Active' : 'Inactive',
          'Device': result['data']['Device'].name
        });
      });
      new ngxCsv(check, 'Membership Cards Audience', options);
    }
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

  select(){
    if(this.type === 'coupons'){
      this.checkAllcoupons = true;
      this.filterCouponAudience.forEach(element => {
        if(!element.data.Check.name){
          this.checkAllcoupons = false;
        }
      })
      this.addSelect()
    } else if (this.type === 'tickets'){
      this.checkAlltickets = true;
      this.filterTicketAudience.forEach(element => {
        if(!element.data.Check.name){
          this.checkAlltickets = false;
        }
      })
      this.addSelect()
    } else if (this.type === 'stamp_cards'){
      this.checkAllStampCards = true;
      this.filterstampCardAudience.forEach(element => {
        if(!element.data.Check.name){
          this.checkAllStampCards = false;
        }
      })
      this.addSelect()
    } else if (this.type === 'loyalty_cards'){
      this.checkAllLoyaltyCards = true;
      this.filterloyaltyCardAudience.forEach(element => {
        if(!element.data.Check.name){
          this.checkAllLoyaltyCards = false;
        }
      })
      this.addSelect()
    } else if (this.type === 'membership_cards'){
      this.checkAllMembershipCards = true;
      this.filterMembershipCardAudience.forEach(element => {
        if(!element.data.Check.name){
          this.checkAllMembershipCards = false;
        }
      })
      this.addSelect()
    }
  }

  selectAll() {
    if(this.type === 'coupons'){
      if(this.checkAllcoupons){
        this.filterCouponAudience.forEach(element => {
          element.data.Check.name = true;
        })
        this.addSelect();
      } else {
        this.filterCouponAudience.forEach(element => {
          element.data.Check.name = false;
        })
        this.addSelect();
      }
    } else if (this.type === 'tickets'){
      if(this.checkAlltickets){
        this.filterTicketAudience.forEach(element => {
          element.data.Check.name = true;
        })
        this.addSelect();
      } else {
        this.filterTicketAudience.forEach(element => {
          element.data.Check.name = false;
        })
        this.addSelect();
      }
    } else if (this.type === 'stamp_cards'){
      if(this.checkAllStampCards){
        this.filterstampCardAudience.forEach(element => {
          element.data.Check.name = true;
        })
        this.addSelect();
      } else {
        this.filterstampCardAudience.forEach(element => {
          element.data.Check.name = false;
        })
        this.addSelect();
      }
    } else if (this.type === 'loyalty_cards'){
      if(this.checkAllLoyaltyCards){
        this.filterloyaltyCardAudience.forEach(element => {
          element.data.Check.name = true;
        })
        this.addSelect();
      } else {
        this.filterloyaltyCardAudience.forEach(element => {
          element.data.Check.name = false;
        })
        this.addSelect();
      }
    } else if (this.type === 'membership_cards'){
      if(this.checkAllMembershipCards){
        this.filterMembershipCardAudience.forEach(element => {
          element.data.Check.name = true;
        })
        this.addSelect();
      } else {
        this.filterMembershipCardAudience.forEach(element => {
          element.data.Check.name = false;
        })
        this.addSelect();
      }
    }
  }

  addSelect() {
    if(this.type === 'coupons'){
      this.selectedAudience = this.filterCouponAudience.filter(element => {
        if(element.data.Check.name){
          return true;
        }
      })
      console.log(this.selectedAudience);
    } else if (this.type === 'tickets'){
      this.selectedAudience = this.filterTicketAudience.filter(element => {
        if(element.data.Check.name){
          return true
        }
      })
      console.log(this.selectedAudience);
    } else if (this.type === 'stamp_cards'){
      this.selectedAudience = this.filterstampCardAudience.filter(element => {
        if(element.data.Check.name){
          return true
        }
      })
      console.log(this.selectedAudience);
    } else if (this.type === 'loyalty_cards'){
      this.selectedAudience = this.filterloyaltyCardAudience.filter(element => {
        if(element.data.Check.name){
          return true
        }
      })
      console.log(this.selectedAudience);
    } else if (this.type === 'membership_cards'){
      this.selectedAudience = this.filterMembershipCardAudience.filter(element => {
        if(element.data.Check.name){
          return true
        }
      })
      console.log(this.selectedAudience);
    }
  }

  getCampaign() {
    this.campaignNames = [];
      if(this.type === 'coupons'){
        this.CouponAudience.forEach(element => {
          if(this.campaignNames.indexOf(element['data']['Campaign Name'].name) === -1){
            this.campaignNames.push(element['data']['Campaign Name'].name)
          }
        })
        this.campaignName = this.campaignNames[0];
        this.filterCampaigns();
    } else if (this.type === 'tickets'){
      this.TicketAudience.forEach(element => {
        if(this.campaignNames.indexOf(element['data']['Campaign Name'].name) === -1){
          this.campaignNames.push(element['data']['Campaign Name'].name)
        }
      })
      this.campaignName = this.campaignNames[0];
      this.filterCampaigns();
    } else if (this.type === 'stamp_cards'){
      this.stampCardAudience.forEach(element => {
        if(this.campaignNames.indexOf(element['data']['Campaign Name'].name) === -1){
          this.campaignNames.push(element['data']['Campaign Name'].name)
        }
      })
      this.campaignName = this.campaignNames[0];
      this.filterCampaigns();
    } else if (this.type === 'loyalty_cards'){
      this.loyaltyCardAudience.forEach(element => {
        if(this.campaignNames.indexOf(element['data']['Campaign Name'].name) === -1){
          this.campaignNames.push(element['data']['Campaign Name'].name)
        }
      })
      this.campaignName = this.campaignNames[0];
      this.filterCampaigns();
    } else if (this.type === 'membership_cards') {
      this.membershipCardAudience.forEach(element => {
        if(this.campaignNames.indexOf(element['data']['Campaign Name'].name) === -1){
          this.campaignNames.push(element['data']['Campaign Name'].name)
        }
      })
      this.campaignName = this.campaignNames[0];
      this.filterCampaigns();
    }
  }

}
