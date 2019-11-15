import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NbCalendarRange, NbDateService } from '@nebular/theme';
import chart from 'tui-chart';
import { Router } from '@angular/router';
import { ReportService } from 'src/app/shared/services/masterAdmin/report.service';
import * as localForage from 'localforage';


@Component({
  selector: 'app-dashboard-info-admin',
  templateUrl: './dashboard-info-admin.component.html',
  styleUrls: ['./dashboard-info-admin.component.scss']
})
export class DashboardInfoAdminComponent implements OnInit {
  range: NbCalendarRange<Date>;
  total_coupons;
  total_brands;
  total_marketeers;
  total_audiences;

  constructor(private reportService: ReportService, protected dateService: NbDateService<Date>, private router: Router) {
  }
  
  async start(){
    const user = await localForage.getItem('user');
    if (user['user_type'] !== 4){
      this.router.navigate(['/main/dashboard']);
    }
    this.reportService.getStats().subscribe(result => {
      this.total_coupons = result['data'].total_coupons;
      this.total_brands = result['data'].total_brands;
      this.total_marketeers = result['data'].total_marketeers;
      this.total_audiences = result['data'].total_audiences;
    });
  }

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }

  get monthEnd(): Date {
    return this.dateService.getMonthEnd(new Date());
  }
  accountSignedDate;
  pagesByIndustriesDate;
  pagesByWeekDate;
  marketerByWeekDate;
  growthDate;

  showAccountSignedDate;
  showPagesByIndustriesDate;
  showPagesByWeekDate;
  showMarketerByWeekDate;
  showGrowthDate;

  ngOnInit() {
    setTimeout(() => {
      const container = document.getElementById('chart-area');
      const width = document.getElementById('chart-area').offsetWidth;
      const height = document.getElementById('chart-area').offsetHeight;

      const data = {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'],
        series: [
          {
            name: 'Budget',
            data: [5000, 3000, 5000, 7000, 6000, 4000, 1000]
          }
        ]
      };
      const options = {
        chart: {
          width: width,
          height: height,
          format: '1,000'
        },
        yAxis: {
          min: 0,
          max: 9000
        },
        legend: {
          align: 'top'
        }
      };
      const theme = {
        series: {
          colors: [
            '#83b14e', '#458a3f', '#295ba0', '#2a4175', '#289399',
            '#289399', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
          ]
        }
      };
      // For apply theme
      // tui.chart.registerTheme('myTheme', theme);
      // options.theme = 'myTheme';
      chart.columnChart(container, data, options);

      const container2 = document.getElementById('chart-area2');
      const width2 = document.getElementById('chart-area2').offsetWidth;
      const height2 = document.getElementById('chart-area2').offsetHeight;
      const data2 = {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'],
        series: [
          {
            name: 'Budget',
            data: [5000, 3000, 5000, 7000, 6000, 4000, 1000]
          }
        ]
      };
      const options2 = {
        chart: {
          width: width2,
          height: height2,
          format: '1,000'
        },
        yAxis: {
          min: 0,
          max: 9000
        },
        legend: {
          align: 'top'
        }
      };
      const theme2 = {
        series: {
          colors: [
            '#83b14e', '#458a3f', '#295ba0', '#2a4175', '#289399',
            '#289399', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
          ]
        }
      };
      // For apply theme
      // tui.chart.registerTheme('myTheme', theme);
      // options.theme = 'myTheme';
      chart.columnChart(container2, data2, options2);

      const container3 = document.getElementById('chart-area3');
      const width3 = document.getElementById('chart-area3').offsetWidth;
      const height3 = document.getElementById('chart-area3').offsetHeight;

      const data3 = {
        categories: ['June', 'July', 'Aug', 'Sep', 'Oct', 'Nov'],
        series: [
          {
            name: 'Basic',
            data: [1, 2, 3, 4, 10, 6, 15, 20, 25, 50, 20, 27, 27, 27, 27, 27, 23, 30, 41, 25, 57, 50, 45, 61, 55, 60, 63, 65, 75, 80]
          },
          {
            name: 'Pro',
            data: [1, 2, 3, 4, 11, 5, 17, 18, 23, 52, 18, 25, 25, 23, 21, 25, 24, 21, 31, 15, 47, 45, 21, 45, 41, 60, 61, 71, 69, 78]
          },
          {
            name: 'Unlimited',
            data: [1, 5, 9, 4, 10, 11, 10, 15, 17, 19, 15, 21, 25, 29, 12, 17, 19, 25, 1, 12, 19, 25, 29, 35, 30, 21, 45, 49, 47, 76]
          }
        ]
      };
      const options3 = {
        chart: {
          width: width3,
          height: height3,
        },
        series: {
          spline: true,
          showDot: false
        },
        tooltip: {
          // suffix: '°C'
        }
      };
      const theme3 = {
        series: {
          colors: [
            '#83b14e', '#458a3f', '#295ba0', '#2a4175', '#289399',
            '#289399', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
          ]
        }
      };

      // For apply theme

      // tui.chart.registerTheme('myTheme', theme);
      // options.theme = 'myTheme';

      chart.lineChart(container3, data3, options3);

      const container4 = document.getElementById('chart-area4');
      const width4 = document.getElementById('chart-area4').offsetWidth;
      const height4 = document.getElementById('chart-area4').offsetHeight;

      const data4 = {
        categories: ['Browser'],
        series: [
          {
            name: 'Chrome',
            data: 46.02
          },
          {
            name: 'Safari',
            data: 5.45
          },
          {
            name: 'Opera',
            data: 3.10
          }
        ]
      };
      const options4 = {
        chart: {
          width: width4,
          height: height4,
        },
        tooltip: {
          suffix: '%'
        }
      };
      const theme4 = {
        series: {
          colors: [
            '#83b14e', '#458a3f', '#295ba0', '#2a4175', '#289399',
            '#289399', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
          ]
        }
      };

      // For apply theme

      // tui.chart.registerTheme('myTheme', theme);
      // options.theme = 'myTheme';

      chart.pieChart(container4, data4, options4);

      const container5 = document.getElementById('chart-area5');
      const width5 = document.getElementById('chart-area5').offsetWidth;
      const height5 = document.getElementById('chart-area5').offsetHeight;

      const data5 = {
        categories: ['Browser'],
        series: [
          {
            name: 'Chrome',
            data: 46.02
          },
          {
            name: 'Safari',
            data: 5.45
          },
          {
            name: 'Opera',
            data: 3.10
          }
        ]
      };
      const options5 = {
        chart: {
          width: width5,
          height: height5,
        },
        tooltip: {
          suffix: '%'
        }
      };
      const theme5 = {
        series: {
          colors: [
            '#83b14e', '#458a3f', '#295ba0', '#2a4175', '#289399',
            '#289399', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
          ]
        }
      };

      // For apply theme

      // tui.chart.registerTheme('myTheme', theme);
      // options.theme = 'myTheme';

      chart.pieChart(container5, data5, options5);
    }, 1000);
  }

  accountSignedDateChange() {
    setTimeout(() => {
      this.accountSignedDate =
        moment(this.range.start).format('YYYY-MM-DD') +
        ' - ' +
        moment(this.range.end).format('YYYY-MM-DD');
      if (this.range.end) {
        this.showAccountSignedDate = false;
      }
    }, 100);
  }
  pagesByIndustriesDateChange() {
    setTimeout(() => {
      this.pagesByIndustriesDate =
        moment(this.range.start).format('YYYY-MM-DD') +
        ' - ' +
        moment(this.range.end).format('YYYY-MM-DD');
      if (this.range.end) {
        this.showPagesByIndustriesDate = false;
      }
    }, 100);
  }
  pagesByWeekDateChange() {
    setTimeout(() => {
      this.pagesByWeekDate =
        moment(this.range.start).format('YYYY-MM-DD') +
        ' - ' +
        moment(this.range.end).format('YYYY-MM-DD');
      if (this.range.end) {
        this.showPagesByWeekDate = false;
      }
    }, 100);
  }
  marketerByWeekDateChange() {
    setTimeout(() => {
      this.marketerByWeekDate =
        moment(this.range.start).format('YYYY-MM-DD') +
        ' - ' +
        moment(this.range.end).format('YYYY-MM-DD');
      if (this.range.end) {
        this.showMarketerByWeekDate = false;
      }
    }, 100);
  }
  growthDateChange() {
    setTimeout(() => {
      this.growthDate =
        moment(this.range.start).format('YYYY-MM-DD') +
        ' - ' +
        moment(this.range.end).format('YYYY-MM-DD');
      if (this.range.end) {
        this.showGrowthDate = false;
      }
    }, 100);
  }
}
