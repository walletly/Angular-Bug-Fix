import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss']
})
export class AudienceComponent implements OnInit {
  showActions;
  defaultColumns = ['First Name', 'Last Name', 'Email Address', 'Type', 'Campaign Name', 'Issue Date', 'Expiry', 'Status'];
  allColumns = this.defaultColumns;

  data = [
    {
      data: { 'First Name': { name: 'Rashid' }, 'Last Name': { name: 'Sharif' }, 'Email Address': { name: 'rashid.gd@msn.com' }, 'Type': { name: 'Coupon in %', icon: 'assets/img/Coupon.png' }, 'Campaign Name': { name: 'My First Campaign' }, 'Issue Date': { name: '23/10/2019' }, 'Expiry': { name: '21/11/2019' }, 'Status': { name: 'Used' } },
    },
    {
      data: { 'First Name': { name: 'Rashid' }, 'Last Name': { name: 'Sharif' }, 'Email Address': { name: 'rashid.gd@msn.com' }, 'Type': { name: 'Coupon in %', icon: 'assets/img/Coupon-in-$.png' }, 'Campaign Name': { name: 'My First Campaign' }, 'Issue Date': { name: '23/10/2019' }, 'Expiry': { name: '21/11/2019' }, 'Status': { name: 'Unused' } },
    },
    {
      data: { 'First Name': { name: 'Rashid' }, 'Last Name': { name: 'Sharif' }, 'Email Address': { name: 'rashid.gd@msn.com' }, 'Type': { name: 'Coupon in %', icon: 'assets/img/Birthday-Coupon.png' }, 'Campaign Name': { name: 'My First Campaign' }, 'Issue Date': { name: '23/10/2019' }, 'Expiry': { name: '21/11/2019' }, 'Status': { name: 'Expired' } },
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
