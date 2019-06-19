import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/shared/services/brand.service';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss']
})
export class AudienceComponent implements OnInit {
  showActions;
  // defaultColumns = ['First Name', 'Last Name', 'Email Address', 'Type', 'Campaign Name', 'Issue Date', 'Expiry', 'Status'];
  defaultColumns = ['Full Name', 'Email Address', 'Type', 'Campaign Name', 'Issue Date', 'Expiry', 'Status'];
  allColumns = this.defaultColumns;

  data;

  // data = [
  //   {
  //     data: { 'First Name': { name: 'Rashid' }, 'Last Name': { name: 'Sharif' }, 'Email Address': { name: 'rashid.gd@msn.com' }, 'Type': { name: 'Coupon in %', icon: 'assets/img/Coupon.png' }, 'Campaign Name': { name: 'My First Campaign' }, 'Issue Date': { name: '23/10/2019' }, 'Expiry': { name: '21/11/2019' }, 'Status': { name: 'Used' } },
  //   },
  //   {
  //     data: { 'First Name': { name: 'Rashid' }, 'Last Name': { name: 'Sharif' }, 'Email Address': { name: 'rashid.gd@msn.com' }, 'Type': { name: 'Coupon in %', icon: 'assets/img/Coupon-in-$.png' }, 'Campaign Name': { name: 'My First Campaign' }, 'Issue Date': { name: '23/10/2019' }, 'Expiry': { name: '21/11/2019' }, 'Status': { name: 'Unused' } },
  //   },
  //   {
  //     data: { 'First Name': { name: 'Rashid' }, 'Last Name': { name: 'Sharif' }, 'Email Address': { name: 'rashid.gd@msn.com' }, 'Type': { name: 'Coupon in %', icon: 'assets/img/Birthday-Coupon.png' }, 'Campaign Name': { name: 'My First Campaign' }, 'Issue Date': { name: '23/10/2019' }, 'Expiry': { name: '21/11/2019' }, 'Status': { name: 'Expired' } },
  //   },
  // ];

  constructor(private brandService: BrandService) {
    brandService.getBrandAudience(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(result => {
      console.log(result);
      this.data = [];
      let audiences;

      if (result['success']) {
        audiences = result['data']['coupons'];
        audiences.forEach(element => {

          this.data.push({
            data: {
              // 'First Name': { name: element.firstName },
              // 'Last Name': { name: element.lastName },
              'Full Name' : {name : `${element.firstName} ${element.lastName}`},
              'Email Address': { name: element.email },
              'Type': { name: element.campaign_type, icon: 'assets/img/Coupon.png' },
              'Campaign Name': { name: element.campaign_name },
              'Issue Date': { name: element.createDateFormatted },
              'Expiry': { name: element.endDateFormatted },
              'Status': { name:  element.status }
            }
          });
        });
      }
    }, err => {
      this.data = [];
    });
  }

  ngOnInit() {
  }

}
