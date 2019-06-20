import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { NbCalendarRange, NbDateService } from "@nebular/theme";
import chart from 'tui-chart';

@Component({
  selector: "app-dashboard-info-admin",
  templateUrl: "./dashboard-info-admin.component.html",
  styleUrls: ["./dashboard-info-admin.component.scss"]
})
export class DashboardInfoAdminComponent implements OnInit {
  range: NbCalendarRange<Date>;

  constructor(protected dateService: NbDateService<Date>) {}

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

  ngOnInit() {}

  accountSignedDateChange() {
    setTimeout(() => {
      this.accountSignedDate =
        moment(this.range.start).format("YYYY-MM-DD") +
        " - " +
        moment(this.range.end).format("YYYY-MM-DD");
      if (this.range.end) {
        this.showAccountSignedDate = false;
      }
    }, 100);
  }
  pagesByIndustriesDateChange() {
    setTimeout(() => {
      this.pagesByIndustriesDate =
        moment(this.range.start).format("YYYY-MM-DD") +
        " - " +
        moment(this.range.end).format("YYYY-MM-DD");
      if (this.range.end) {
        this.showPagesByIndustriesDate = false;
      }
    }, 100);
  }
  pagesByWeekDateChange() {
    setTimeout(() => {
      this.pagesByWeekDate =
        moment(this.range.start).format("YYYY-MM-DD") +
        " - " +
        moment(this.range.end).format("YYYY-MM-DD");
      if (this.range.end) {
        this.showPagesByWeekDate = false;
      }
    }, 100);
  }
  marketerByWeekDateChange() {
    setTimeout(() => {
      this.marketerByWeekDate =
        moment(this.range.start).format("YYYY-MM-DD") +
        " - " +
        moment(this.range.end).format("YYYY-MM-DD");
      if (this.range.end) {
        this.showMarketerByWeekDate = false;
      }
    }, 100);
  }
  growthDateChange() {
    setTimeout(() => {
      this.growthDate =
        moment(this.range.start).format("YYYY-MM-DD") +
        " - " +
        moment(this.range.end).format("YYYY-MM-DD");
      if (this.range.end) {
        this.showGrowthDate = false;
      }
    }, 100);
  }

  container = document.getElementById("chart-area");
  data = {
    categories: [
      "June, 2015",
      "July, 2015",
      "August, 2015",
      "September, 2015",
      "October, 2015",
      "November, 2015",
      "December, 2015"
    ],
    series: [
      {
        name: "Budget",
        data: [5000, 3000, 5000, 7000, 6000, 4000, 1000]
      },
      {
        name: "Income",
        data: [8000, 1000, 7000, 2000, 6000, 3000, 5000]
      },
      {
        name: "Expenses",
        data: [4000, 4000, 6000, 3000, 4000, 5000, 7000]
      },
      {
        name: "Debt",
        data: [6000, 3000, 3000, 1000, 2000, 4000, 3000]
      }
    ]
  };
  options = {
    chart: {
      width: 1160,
      height: 650,
      title: "Monthly Revenue",
      format: "1,000"
    },
    yAxis: {
      title: "Amount",
      min: 0,
      max: 9000
    },
    xAxis: {
      title: "Month"
    },
    legend: {
      align: "top"
    }
  };
  theme = {
    series: {
      colors: [
        "#83b14e",
        "#458a3f",
        "#295ba0",
        "#2a4175",
        "#289399",
        "#289399",
        "#617178",
        "#8a9a9a",
        "#516f7d",
        "#dddddd"
      ]
    }
  };
}
