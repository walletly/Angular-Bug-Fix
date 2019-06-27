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

  showGraph;

  selectedItem;

  total_coupons_created;
  total_redeems;
  unredeemed;
  avg_coupon_redeems;

  colors = ['#ff6384', '#36a2eb', '#ffce56', '#ff9fbc', '#4bc0c0',
            '#9966ff', '#ff9f40', '#03fcbc', '#e2c5ff', '#00803b'];

  brandCampaings;
  stackedChart = { labels: [], data1: [], data2: [] };
  earningCampaignsChart = { labels: [], data: [], backgroundColor: this.colors, borderColor: this.colors }
  

  campign

  dateStart = new Date();
  dateEnd = new Date();
  startDate;
  endDate;
  showDatePickerStart;
  showDatePickerEnd;

  constructor(private mainService: MainService, private reportService: ReportService) {
    this.showGraph = 1;
    if (mainService.changeBrandBool) {
      window.location.reload();
    }
    this.reportService.reportBrand(JSON.parse(localStorage.currentBrand)['brand_id']).subscribe(result =>{
      this.showGraph = 3;
      this.total_coupons_created = result['data'].brandData.total_coupons_created;
      this.total_redeems = result['data'].brandData.total_redeems;
      this.unredeemed = result['data'].brandData.unredeemed;
      this.avg_coupon_redeems = ((this.total_redeems * 100) / this.total_coupons_created).toFixed(2) + '%';
      this.brandCampaings = result['data'].campaignsStats.summary;
      this.brandCampaings.forEach(campaign => {
        if(campaign.campaign_name){
          this.stackedChart.labels.push(campaign.campaign_name);
          this.stackedChart.data1.push(campaign.coupons_redeemed);
          this.stackedChart.data2.push(campaign.coupons_created - campaign.coupons_redeemed);
          this.earningCampaignsChart.labels.push(campaign.campaign_name),
          this.earningCampaignsChart.data.push(campaign.campaign_net_amount);
        }
      });
      while(this.stackedChart.labels.length < 8){
        this.stackedChart.labels.push('');
      }
      while(this.earningCampaignsChart.backgroundColor.length < this.earningCampaignsChart.data.length){
        let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        this.earningCampaignsChart.backgroundColor.push(randomColor);
        this.earningCampaignsChart.borderColor.push(randomColor);
      }
      setTimeout(() => {
        this.generateGraphs();
      }, 50);
    }, error =>{
      this.showGraph = 2;
    });
  }

  ngOnInit() {
  }

  generateGraphs() {
    // var ctx = document.getElementById('myChart');
    // var ctx2 = document.getElementById('myChart2');
    var ctx3 = document.getElementById('myChart3');
    var ctx4 = document.getElementById('myChart4');
    var ctx5 = document.getElementById('myChart5');
    // var myChart = new Chart(ctx, {
    //   type: 'bar',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 10, 3, 5, 6, 3],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderColor: [
    //         'rgba(255, 99, 132, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1,
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           display: false
    //         },
    //       }],
    //       xAxes: [{
    //         gridLines: {
    //           display: false
    //         } 
    //       }]
    //     },
    //     legend: {
    //       display: false
    //     },
    //   }
    // });
    // var myChart = new Chart(ctx2, {
    //   type: 'bar',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 10, 3, 5, 4, 3],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderColor: [
    //         'rgba(255, 99, 132, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           display: false
    //         },
    //       }],
    //       xAxes: [{
    //         gridLines: {
    //           display: false
    //         } 
    //       }]
    //     },
    //     legend: {
    //       display: false
    //     },
    //   }
    // });
    var myChart = new Chart(ctx3, {
      type: 'doughnut',
      data: {
        labels: ['Redeemed', 'Unredeemed'],
        datasets: [{
          label: 'No. of Coupons',
          data: [this.total_redeems, this.unredeemed],
          backgroundColor: [
            '#9966ff',
            '#ff6384'
          ],
          borderColor: [
            '#9966ff',
            '#ff6384'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
      }
    });
    var earningCampaignsChart = new Chart(ctx4, {
      type: 'pie',
      data: {
        labels: this.earningCampaignsChart.labels,
        datasets: [{
          label: 'spendings',
          data: this.earningCampaignsChart.data,
          backgroundColor: this.earningCampaignsChart.backgroundColor,
          borderColor: this.earningCampaignsChart.borderColor,
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
      }
    });
    var stackedChart = new Chart(ctx5, {
      type: 'bar',
      data: {
        labels: this.stackedChart.labels,
        datasets: [{
          type: 'bar',
          label: 'Total Redeems',
          backgroundColor: "#007BFF",
          data: this.stackedChart.data1,
          borderWidth: 1
        },
        {
          type: 'bar',
          label: 'Total Unredeemed',
          backgroundColor: "#B2D7FF",
          data: this.stackedChart.data2,
          borderWidth: 1
        }
      ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              display: false
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
