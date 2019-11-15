import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as localForage from 'localforage';


@Component({
  selector: 'app-marketers',
  templateUrl: './marketers.component.html',
  styleUrls: ['./marketers.component.scss']
})
export class MarketersComponent implements OnInit {
  defaultColumns = ["First Name", "Last Name", "Email Adreesss", "Phone Number", "Pages", "Join Date", "Last Login", "Country"];
  source;
  constructor(
    private router: Router
  ) {
  }

  data = [
    {
      data: {
        "First Name": "Rashid",
        "Last Name": "Khan",
        "Email Adreesss": "rashid@gmail.com",
        "Phone Number": "+61 232 234 43",
        "Pages": "234",
        "Join Date": "23/10/2019",
        "Last Login": "12: 30 23/10/2019",
        "Country": "Austrila"
      }
    },
    {
      data: {
        "First Name": "Rashid",
        "Last Name": "Khan",
        "Email Adreesss": "rashid@gmail.com",
        "Phone Number": "+61 232 234 43",
        "Pages": "234",
        "Join Date": "23/10/2019",
        "Last Login": "12: 30 23/10/2019",
        "Country": "Austrila"
      }
    }
   
  ];

  async ngOnInit() {
    const user = await localForage.getItem('user');
    if (user['user_type'] !== 4){
      this.router.navigate(['/main/dashboard']);
    } 
  }
}
