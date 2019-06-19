import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"]
})
export class PagesComponent implements OnInit {
  defaultColumns = ["Page Name", "Copoun Issue", "Copoun Redeem", "Type", "Industry", "Created Date", "Country"];
  source;
  constructor() {}

  data = [
    {
      data: {
        "Page Name": "sunnymeat",
        "Copoun Issue": "8000",
        "Copoun Redeem": "600",
        "Type": "PRO",
        "Industry": "Restaurants",
        "Created Date": "23/10/2019",
        "Country": "Austrila"
      }
    },
    {
      data: {
        "Page Name": "sunnymeat",
        "Copoun Issue": "8000",
        "Copoun Redeem": "600",
        "Type": "PRO",
        "Industry": "Restaurants",
        "Created Date": "23/10/2019",
        "Country": "Austrila"
      }
    },
    {
      data: {
        "Page Name": "sunnymeat",
        "Copoun Issue": "8000",
        "Copoun Redeem": "600",
        "Type": "PRO",
        "Industry": "Restaurants",
        "Created Date": "23/10/2019",
        "Country": "Austrila"
      }
    },
  ];

  ngOnInit() {
  }
}
