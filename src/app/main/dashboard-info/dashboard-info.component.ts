import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-dashboard-info',
  templateUrl: './dashboard-info.component.html',
  styleUrls: ['./dashboard-info.component.scss']
})
export class DashboardInfoComponent implements OnInit {
  selectedItem;

  dateStart = new Date();
  dateEnd = new Date();
  startDate;
  endDate;
  showDatePickerStart;
  showDatePickerEnd;
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      var ctx = document.getElementById('myChart');
      var ctx2 = document.getElementById('myChart2');
      var ctx3 = document.getElementById('myChart3');
      var ctx4 = document.getElementById('myChart4');
      var ctx5 = document.getElementById('myChart5');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 10, 3, 5, 6, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                display: false
              },
            }],
            xAxes: [{
              gridLines: {
                display: false
              } 
            }]
          },
          legend: {
            display: false
          },
        }
      });
      var myChart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 10, 3, 5, 4, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                display: false
              },
            }],
            xAxes: [{
              gridLines: {
                display: false
              } 
            }]
          },
          legend: {
            display: false
          },
        }
      });
      var myChart = new Chart(ctx3, {
        type: 'pie',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 10, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          // scales: {
          //   yAxes: [{
          //     ticks: {
          //       beginAtZero: true
          //     }
          //   }]
          // },
          legend: {
            display: false
          },
        }
      });
      var myChart = new Chart(ctx4, {
        type: 'pie',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 10, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          // scales: {
          //   yAxes: [{
          //     ticks: {
          //       beginAtZero: true
          //     }
          //   }]
          // },
          legend: {
            display: false
          },
        }
      });
      var myChart = new Chart(ctx5, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange','Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 10, 3, 5, 13, 3, 12, 10, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                display: false
              },
            }],
            xAxes: [{
              gridLines: {
                display: false
              } 
            }]
          },
          legend: {
            display: false
          },
        }
      });
     
    }, 2000);
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
