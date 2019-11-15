import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import * as localForage from 'localforage';


@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"]
})
export class PagesComponent implements OnInit {
  defaultColumns = ["Page Name", "Copoun Issue", "Copoun Redeem", "Type", "Industry", "Created Date", "Country"];
  source;
  constructor(
    private router: Router
  ) {
  }

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

  async ngOnInit() {
    const user = await localForage.getItem('user');
    if (user['user_type'] !== 4){
      this.router.navigate(['/main/dashboard']);
    }
  }
}
