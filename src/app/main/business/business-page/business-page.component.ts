import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.scss']
})
export class BusinessPageComponent implements OnInit {
  constructor(private mainService: MainService) { }


  defaultColumns = ['Check', 'First Name', 'Last Name', 'Email Address', 'Phone Number', 'Permission', 'Invite', 'Action'];

  allColumns = this.defaultColumns;
  checkAll;

  data = [];
  showActions;
  ngOnInit() {

    this.data = this.mainService.businessData.map(elem => {
      return {
        data: {
          'Check': '',
          'First Name': elem.firstName,
          'Last Name': elem.lastName,
          'Email Address': elem.emailAddress,
          'Phone Number': elem.phoneNumber,
          'Permission': elem.permission,
          'Invite': 'invite',
          'Action': ''
        }
      }
    });

    console.log(this.data);
    console.log(this.mainService.businessData);
  }

}
