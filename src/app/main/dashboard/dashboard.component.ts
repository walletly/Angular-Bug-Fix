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

  colors = [ 'rgb(255,99,132)', 'rgb(54,162,235)', 'rgb(255,206,86)', 'rgb(153,102,255)', 'rgb(75,192,192)',
             'rgb(255,159,188)', 'rgb(255,159,64)', 'rgb(3,252,188)', 'rgb(226,197,255)', 'rgb(0,128,59)'];
  blurColors = [ 'rgb(255,99,132, 0.5)', 'rgb(54,162,235, 0.5)', 'rgb(255,206,86, 0.5)', 'rgb(153,102,255, 0.5)', 'rgb(75,192,192, 0.5)',
                 'rgb(255,159,188, 0.5)', 'rgb(255,159,64, 0.5)', 'rgb(3,252,188, 0.5)', 'rgb(226,197,255, 0.5)', 'rgb(0,128,59, 0.5)'];

  brandCampaings;
  stackedChart = { labels: [], data1: [], data2: [], backgroundColor1: this.colors, backgroundColor2: this.blurColors };
  earningCampaignsChart = { labels: [], data: [], backgroundColor: this.colors }
  

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
    this.reportService.reportBrand(JSON.parse(localStorage.currentBrand)['brand_id']).subscribe( result =>{
      if (!result['data'].campaignsStats.summary){
        this.showGraph = 2;
        return;
      }
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
      
      const len = this.earningCampaignsChart.backgroundColor.length;
      for (var i = len; i < this.earningCampaignsChart.data.length; i++){
        const randomColor1 = "rgb(0, 0, 0)".replace(/0/g, function () {
          return String(Math.floor(Math.random() * 255));
        });
        const randomColor2 = randomColor1.replace( `)` , `, 0.5)` );
        this.earningCampaignsChart.backgroundColor[i] = randomColor1;
        this.stackedChart.backgroundColor1[i] = randomColor1;        
        this.stackedChart.backgroundColor2[i] = randomColor2;
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
    var ctx1 = document.getElementById('myChart1');
    var ctx2 = document.getElementById('myChart2');
    var ctx3 = document.getElementById('myChart3');
    
    var stackedChart = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: this.stackedChart.labels,
        datasets: [{
          type: 'bar',
          label: 'Total Redeems',
          backgroundColor: this.stackedChart.backgroundColor1,
          borderColor: this.stackedChart.backgroundColor1,
          data: this.stackedChart.data1,
          borderWidth: 1
        },
        {
          type: 'bar',
          label: 'Total Unredeemed',
          backgroundColor: this.stackedChart.backgroundColor2,
          borderColor: this.stackedChart.backgroundColor1,
          data: this.stackedChart.data2,
          borderWidth: 1,
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
    var redeemedChart = new Chart(ctx2, {
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
    var earningCampaignsChart = new Chart(ctx3, {
      type: 'pie',
      data: {
        labels: this.earningCampaignsChart.labels,
        datasets: [{
          label: 'spendings',
          data: this.earningCampaignsChart.data,
          backgroundColor: this.earningCampaignsChart.backgroundColor,
          borderColor: this.earningCampaignsChart.backgroundColor,
          borderWidth: 1
        }]
      },
      options: {
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
