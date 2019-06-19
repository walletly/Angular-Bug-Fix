import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { BusinessService } from 'src/app/shared/services/business.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.scss']
})
export class BusinessPageComponent implements OnInit {

  showBlink;
  // defaultColumns = ['Check', 'First Name', 'Last Name', 'Email Address', 'Phone Number', 'Permission', 'Invite', 'Action'];
  defaultColumns = ['Check', 'Full Name', 'Email Address', 'Phone Number', 'Permission', 'Invite', 'Action'];
  secretNumbersArr;
  secretNumber = '123456';
  topArea = '';
  botArea =
    `Have fun and enjoy the service!

  Walletly
  Business
  `;

  allColumns = this.defaultColumns;
  checkAll;

  data = [];
  fullData = [];
  showActions;
  showLoader;

  constructor(private mainService: MainService, private business: BusinessService, private router: Router) {
    // this.mainService.showLoader.emit(true);
    this.showLoader = true;
    this.getBusiness();
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));

    this.topArea = `Hi,
    ${user.firstname} ${user.lastname}
    this a is dummy messsge to send busniesss for
    Secret code
      `;
    this.secretNumbersArr = Array(this.secretNumber.length).fill(0).map((x, i) => i);
  }

  getBusiness() {
    this.business.getUsers(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.fullData = result['brand_users'];
        this.data = result['brand_users'].map(elem => {
          return {
            data: {
              'Check': '',
              // 'First Name': elem.firstname,
              // 'Last Name': elem.lastname,
              'Full Name' : `${elem.firstname} ${elem.lastname}`,
              'Email Address': elem.email,
              'Phone Number': elem.phone,
              'Permission': elem.permission ? 'YES' : 'NO',
              'Invite': elem.invite,
              'Action': '',
              'id': elem.id
            }
          };
        });
      }
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    }, err => {
      this.data = [];
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    });
  }

  invite(email) {
    console.log(email);

    const message = {
      recepient: email,
      subject: 'email subject',
      message: 'Email message body'
    };

    this.business.sendEmail([message]).subscribe(result => {
      console.log(result);
      this.mainService.showToastrSuccess.emit({text: 'The invitation has been sent'});
      this.getBusiness();
    });
  }

  inviteAll() {
    const messages = this.fullData.map(element => {
      return {
        recepient: element.email,
        subject: 'email subject',
        message: 'Email message body'
      };
    });

    this.business.sendEmail(messages).subscribe(result => {
      console.log(result);
      this.mainService.showToastrSuccess.emit({text: 'The invitations has been sent'});
    });
  }

  secretNumberChanged() {
    this.secretNumbersArr = Array(this.secretNumber.length).fill(0).map((x, i) => i);
  }

  edit(id) {
    this.showActions = null;
    this.router.navigate(['/main/business/create-business/' + id]);
  }

  delete(id) {
    // this.mainService.showLoader.emit(true);
    this.showLoader = true;

    this.showActions = null;
    console.log(id);
    this.business.deleteBusiness(id).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.mainService.showToastrSuccess.emit({text: 'User deleted'});
        this.getBusiness();
      }
      // this.mainService.showLoader.emit(false);
    }, err => {
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    });
  }

}
