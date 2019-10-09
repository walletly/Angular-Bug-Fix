import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { ReportService } from 'src/app/shared/services/report.service';
import * as moment from 'moment';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  showGraph = 1;
  showCouponGraph = 1;
  showTicketsGraph = 1;
  showCardsGraph = 1;
  showPassesGraph = 1;

  selectedItem;

  brandSubscribers;

  coupon_created = 0;
  coupon_redeemed = 0;
  coupon_unredeemed = 0;
  avg_coupon_redeems = '0' ;
  ticket_created = 0 ;
  eventTicket_created = 0 ;
  eventTicket_redeemed = 0 ;
  eventTicket_unredeemed = 0 ;
  avg_eventTicket_redeems = '0' ;
  webinarTicket_created = 0 ;
  loyaltyCard_created = 0 ;
  stampCard_created = 0 ;
  membershipCard_created = 0 ;

  colors = [ 'rgb(255,99,132)', 'rgb(54,162,235)', 'rgb(255,206,86)', 'rgb(153,102,255)', 'rgb(75,192,192)',
             'rgb(255,159,188)', 'rgb(255,159,64)', 'rgb(3,252,188)', 'rgb(226,197,255)', 'rgb(0,128,59)'];
  blurColors = [ 'rgb(255,99,132, 0.5)', 'rgb(54,162,235, 0.5)', 'rgb(255,206,86, 0.5)', 'rgb(153,102,255, 0.5)', 'rgb(75,192,192, 0.5)',
                 'rgb(255,159,188, 0.5)', 'rgb(255,159,64, 0.5)', 'rgb(3,252,188, 0.5)', 'rgb(226,197,255, 0.5)', 'rgb(0,128,59, 0.5)'];

  couponCampaings;
  ticketCampaings;
  loyaltyCardCampaings;
  stampCardCampaings;
  membershipCardCampaings;
  cardsCampaigns;

  couponsByCampaignsChart = { labels: [], data1: [], data2: [], backgroundColor1: this.colors, backgroundColor2: this.blurColors };
  ticketsByCampaignsChart = { labels: [], data1: [], data2: [], backgroundColor1: this.colors, backgroundColor2: this.blurColors };
  couponsEarningCampaignsChart = { labels: [], data: [], backgroundColor: this.colors }
  cardsEarningCampaignsChart = { labels: [], data: [], backgroundColor: this.colors }
  applePassesChart = { labels: ['Coupons', 'LoyatyCards', 'StampCards', 'MembershipCards', 'Tickets'], data: [], backgroundColor: this.colors }
  androidPassesChart = { labels: ['Coupons', 'LoyatyCards', 'StampCards', 'MembershipCards', 'Tickets'], data: [], backgroundColor: this.colors }
  
  dateStart = new Date();
  dateEnd = new Date();
  startDate;
  endDate;
  showDatePickerStart;
  showDatePickerEnd;

  constructor(private mainService: MainService, private reportService: ReportService) {
    if (mainService.changeBrandBool) {
      window.location.reload();
    }
    this.reportService.reportBrandSubscribers(JSON.parse(localStorage.currentBrand)['brand_id']).subscribe(result => {
      this.brandSubscribers = result['data'].brand_subscribers;
      this.applePassesChart.data.push(result['data'].appleCoupons);
      this.applePassesChart.data.push(result['data'].appleLoyaltyCards);
      this.applePassesChart.data.push(result['data'].appleStampCards);
      this.applePassesChart.data.push(result['data'].appleMembershipCards);
      this.applePassesChart.data.push(result['data'].appleTickets);
      this.androidPassesChart.data.push(result['data'].androidCoupons);
      this.androidPassesChart.data.push(result['data'].androidLoyaltyCards);
      this.androidPassesChart.data.push(result['data'].androidStampCards);
      this.androidPassesChart.data.push(result['data'].androidMembershipCards);
      this.androidPassesChart.data.push(result['data'].androidTickets);
      if(result['data'].appleCoupons > 0 || result['data'].appleLoyaltyCards > 0 || result['data'].appleStampCards > 0 || result['data'].appleMembershipCards > 0 || result['data'].appleTickets > 0 ||
        result['data'].androidCoupons > 0 || result['data'].androidLoyaltyCards > 0 || result['data'].androidStampCards > 0 || result['data'].androidMembershipCards > 0 || result['data'].androidTickets > 0){
        this.showPassesGraph = 3;
      }else{
        this.showPassesGraph = 2;
      }
    }, err => {
      console.log('subscribers error',err);
      this.showPassesGraph = 2;
      this.brandSubscribers = 0;
    })
    this.reportService.reportBrand(JSON.parse(localStorage.currentBrand)['brand_id']).subscribe( result =>{
      this.showGraph = 3;
      this.coupon_created = result['data'].brandData.coupon_created || 0;
      this.coupon_redeemed = result['data'].brandData.coupon_redeemed || 0;
      this.coupon_unredeemed = result['data'].brandData.coupon_unredeemed || 0;
      this.avg_coupon_redeems = ((this.coupon_redeemed * 100) / this.coupon_created).toFixed(2) + '%' || '0';
      this.ticket_created = result['data'].brandData.ticket_created || 0;
      this.loyaltyCard_created = result['data'].brandData.loyaltyCard_created || 0;
      this.stampCard_created = result['data'].brandData.stampCard_created || 0;
      this.membershipCard_created = result['data'].brandData.membershipCard_created || 0;

      if (result['data'].campaignsStats.couponCampaignsSummary.length > 0){
        this.showCouponGraph = 3;
      }else{
        this.showCouponGraph = 2;
      }
      if (result['data'].campaignsStats.ticketCampaignsSummary.length > 0){
        this.showTicketsGraph = 3;
      }else{
        this.showTicketsGraph = 2;
      }
      if (result['data'].campaignsStats.loyaltyCardCampaignsSummary.length > 0 || 
          // result['data'].campaignsStats.membershipCardCampaignsSummary.length > 0 ||
          result['data'].campaignsStats.stampCardCampaignsSummary.length > 0){
        this.showCardsGraph = 3;
      }else{
        this.showCardsGraph = 2;
      }

      if(this.showCouponGraph == 2 && this.showTicketsGraph == 2 && this.showCardsGraph == 2){
        this.showGraph = 2;
      }
      
      this.couponCampaings = result['data'].campaignsStats.couponCampaignsSummary;
      this.couponCampaings.forEach(campaign => {
        if(campaign.campaign_name && campaign.coupons_created > 0){
          this.couponsByCampaignsChart.labels.push(campaign.campaign_name);
          this.couponsByCampaignsChart.data1.push(campaign.coupons_redeemed);
          this.couponsByCampaignsChart.data2.push(campaign.coupons_created - campaign.coupons_redeemed);
          this.couponsEarningCampaignsChart.labels.push(campaign.campaign_name);
          this.couponsEarningCampaignsChart.data.push(campaign.campaign_net_amount);
        }
      });
      this.ticketCampaings = result['data'].campaignsStats.ticketCampaignsSummary;
      this.ticketCampaings.forEach(campaign => {
        if(campaign.campaign_name && campaign.coupons_created > 0){
          this.ticketsByCampaignsChart.labels.push(campaign.campaign_name);
          this.ticketsByCampaignsChart.data1.push(campaign.coupons_redeemed);
          this.ticketsByCampaignsChart.data2.push(campaign.coupons_created - campaign.coupons_redeemed);
          if(campaign.campaign_type == 8){
            this.eventTicket_created = this.eventTicket_created + campaign.coupons_created;
            this.eventTicket_redeemed = this.eventTicket_redeemed + campaign.coupons_redeemed;
            this.eventTicket_unredeemed = this.eventTicket_created - this.eventTicket_redeemed;
            this.avg_eventTicket_redeems = ((this.eventTicket_redeemed * 100) / this.eventTicket_created).toFixed(2) + '%' || '0';
          }else if(campaign.campaign_type == 9){
            this.webinarTicket_created = this.webinarTicket_created + campaign.coupons_created;
          }
        }
      });
      this.loyaltyCardCampaings = result['data'].campaignsStats.loyaltyCardCampaignsSummary;
      this.stampCardCampaings = result['data'].campaignsStats.stampCardCampaignsSummary;
      this.membershipCardCampaings = result['data'].campaignsStats.membershipCardCampaignsSummary;

      this.cardsCampaigns = this.loyaltyCardCampaings.concat(this.stampCardCampaings);
      this.cardsCampaigns.forEach(campaign => {
        if(campaign.campaign_name && campaign.coupons_created > 0){
          this.cardsEarningCampaignsChart.labels.push(campaign.campaign_name);
          this.cardsEarningCampaignsChart.data.push(campaign.campaign_net_amount);
        }
      });
      if(this.couponsByCampaignsChart.labels.length < 1){
        this.showCouponGraph = 2;
      }else{
        while(this.couponsByCampaignsChart.labels.length < 8){
          this.couponsByCampaignsChart.labels.push('');
        }
      }
      if(this.ticketsByCampaignsChart.labels.length < 1){
        this.showTicketsGraph = 2;
      }else{
        while(this.ticketsByCampaignsChart.labels.length < 8){
          this.ticketsByCampaignsChart.labels.push('');
        }
      }
      if(this.cardsEarningCampaignsChart.labels.length < 1){
        this.showCardsGraph = 2;
      }
      
      const couponlen = this.couponsEarningCampaignsChart.backgroundColor.length;
      for (var i = couponlen; i < this.couponsEarningCampaignsChart.data.length; i++){
        const randomColor1 = "rgb(0, 0, 0)".replace(/0/g, function () {
          return String(Math.floor(Math.random() * 255));
        });
        const randomColor2 = randomColor1.replace( `)` , `, 0.5)` );
        this.couponsEarningCampaignsChart.backgroundColor[i] = randomColor1;
        this.couponsByCampaignsChart.backgroundColor1[i] = randomColor1;        
        this.couponsByCampaignsChart.backgroundColor2[i] = randomColor2;
      }
      const ticketlen = this.ticketsByCampaignsChart.backgroundColor1.length;
      for (var i = ticketlen; i < this.ticketsByCampaignsChart.data1.length; i++){
        const randomColor1 = "rgb(0, 0, 0)".replace(/0/g, function () {
          return String(Math.floor(Math.random() * 255));
        });
        const randomColor2 = randomColor1.replace( `)` , `, 0.5)` );
        this.ticketsByCampaignsChart.backgroundColor1[i] = randomColor1;        
        this.ticketsByCampaignsChart.backgroundColor2[i] = randomColor2;
      }
      const cardslen = this.cardsEarningCampaignsChart.backgroundColor.length;
      for (var i = cardslen; i < this.cardsEarningCampaignsChart.data.length; i++){
        const randomColor1 = "rgb(0, 0, 0)".replace(/0/g, function () {
          return String(Math.floor(Math.random() * 255));
        });
        this.cardsEarningCampaignsChart.backgroundColor[i] = randomColor1;        
      }

      setTimeout(() => {
        this.generateGraphs();
      }, 200);
    }, error =>{
      this.showGraph = 2;
    });
  }

  ngOnInit() {
  }

  generateGraphs() {
    var ctx1 = document.getElementById('myChart1');
    var ctx2 = document.getElementById('myChart2');
    var ctx3 = document.getElementById('myChart3');
    var ctx4 = document.getElementById('myChart4');
    var ctx5 = document.getElementById('myChart5');
    var ctx6 = document.getElementById('myChart6');

    if(this.showCouponGraph == 3){
      var couponsByCampaignsChart = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: this.couponsByCampaignsChart.labels,
          datasets: [{
            type: 'bar',
            label: 'Total Redeems',
            backgroundColor: this.couponsByCampaignsChart.backgroundColor1,
            borderColor: this.couponsByCampaignsChart.backgroundColor1,
            data: this.couponsByCampaignsChart.data1,
            borderWidth: 1
          },
          {
            type: 'bar',
            label: 'Total Unredeemed',
            backgroundColor: this.couponsByCampaignsChart.backgroundColor2,
            borderColor: this.couponsByCampaignsChart.backgroundColor1,
            data: this.couponsByCampaignsChart.data2,
            borderWidth: 1,
          }
        ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                display: true
              },
              stacked: true,
            }],
            xAxes: [{
              maxBarThickness: 50,
              gridLines: {
                display: false
              },
              stacked: true,
            }]
          },
          legend: {
            display: false
          },
        }
      });
      var couponsEarningCampaignsChart = new Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: this.couponsEarningCampaignsChart.labels,
          datasets: [{
            label: 'spendings',
            data: this.couponsEarningCampaignsChart.data,
            backgroundColor: this.couponsEarningCampaignsChart.backgroundColor,
            borderWidth: 2
          }]
        },
        options: {
          legend: {
            display: false
          },
        }
      });
    }

    if(this.showTicketsGraph == 3){
      var ticketsByCampaignsChart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: this.ticketsByCampaignsChart.labels,
          datasets: [{
            type: 'bar',
            label: 'Total Redeems',
            backgroundColor: this.ticketsByCampaignsChart.backgroundColor1,
            borderColor: this.ticketsByCampaignsChart.backgroundColor1,
            data: this.ticketsByCampaignsChart.data1,
            borderWidth: 1
          },
          {
            type: 'bar',
            label: 'Total Unredeemed',
            backgroundColor: this.ticketsByCampaignsChart.backgroundColor2,
            borderColor: this.ticketsByCampaignsChart.backgroundColor1,
            data: this.ticketsByCampaignsChart.data2,
            borderWidth: 1,
          }
        ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                display: true
              },
              stacked: true,
            }],
            xAxes: [{
              maxBarThickness: 50,
              gridLines: {
                display: false
              },
              stacked: true,
            }]
          },
          legend: {
            display: false
          },
        }
      });
    }

    if(this.showCardsGraph == 3){
      var cardsEarningCampaignsChart = new Chart(ctx4, {
        type: 'doughnut',
        data: {
          labels: this.cardsEarningCampaignsChart.labels,
          datasets: [{
            label: 'spendings',
            data: this.cardsEarningCampaignsChart.data,
            backgroundColor: this.cardsEarningCampaignsChart.backgroundColor,
            borderWidth: 2,
          }]
        },
        options: {
          legend: {
            display: false
          },
        }
      });
    }

    if(this.showPassesGraph == 3){
      var applePassesChart = new Chart(ctx5, {
        type: 'bar',
        data: {
          labels: this.applePassesChart.labels,
          datasets: [{
            type: 'bar',
            label: 'Apple Wallet Passes',
            backgroundColor: this.applePassesChart.backgroundColor,
            borderColor: this.applePassesChart.backgroundColor,
            data: this.applePassesChart.data,
            borderWidth: 1
          }
        ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                display: true
              },
              stacked: false,
            }],
            xAxes: [{
              maxBarThickness: 50,
              gridLines: {
                display: false
              },
              stacked: false,
            }]
          },
          legend: {
            display: false
          },
        }
      });

      var androidPassesChart = new Chart(ctx6, {
        type: 'bar',
        data: {
          labels: this.androidPassesChart.labels,
          datasets: [{
            type: 'bar',
            label: 'Android Wallet Passes',
            backgroundColor: this.androidPassesChart.backgroundColor,
            borderColor: this.androidPassesChart.backgroundColor,
            data: this.androidPassesChart.data,
            borderWidth: 1
          }
        ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                display: true
              },
              stacked: false,
            }],
            xAxes: [{
              maxBarThickness: 50,
              gridLines: {
                display: false
              },
              stacked: false,
            }]
          },
          legend: {
            display: false
          },
        }
      });
    }
    
    // var redeemedChart = new Chart(ctx2, {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['Redeemed', 'Unredeemed'],
    //     datasets: [{
    //       label: 'No. of Coupons',
    //       data: [this.coupon_redeemed, this.coupon_unredeemed],
    //       backgroundColor: [
    //         '#9966ff',
    //         '#ff6384'
    //       ],
    //       borderColor: [
    //         '#9966ff',
    //         '#ff6384'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //   }
    // });
   
  }

  dateStartChange(event) {
    this.startDate = moment(event).format('YYYY-MM-DD');
    const compare = this.compare(event, this.dateEnd);
    if (compare === 1 || compare === 0) {
      this.endDate = null;
    }
    console.log(this.compare(event, this.dateEnd));
    console.log(this.startDate);
    this.showDatePickerStart = false;
  }

  dateEndChange(event) {
    this.endDate = moment(event).format('YYYY-MM-DD');
    const compare = this.compare(this.dateStart, event);
    if (compare === 1 || (compare === 0 && this.dateStart)) {
      this.startDate = null;
    }
    console.log(this.compare(this.dateStart, event));
    console.log(this.endDate);
    this.showDatePickerEnd = false;
  }

  compare(dateTimeA, dateTimeB) {
    const momentA = moment(dateTimeA, 'YYYY-MM-DD');
    const momentB = moment(dateTimeB, 'YYYY-MM-DD');
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
  }
  
}
