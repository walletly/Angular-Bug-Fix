import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MainService } from 'src/app/shared/services/main.service';
import { BusinessService } from 'src/app/shared/services/business.service';
import { BrandService } from 'src/app/shared/services/brand.service';
import { Router } from '@angular/router';

declare var addHyphens: any;
declare var inputEventListener: any;

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.scss']
})
export class BusinessPageComponent implements OnInit, AfterViewInit {

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

  ibeacon;
  customValidationiBeacon = true;
  myFormiBeacon: FormGroup;
  eventsAdded = false;
  currentbrand;

  constructor(private formBuilder: FormBuilder,private brandService: BrandService,private mainService: MainService, private business: BusinessService, private router: Router) {
    // this.mainService.showLoader.emit(true);
    this.showLoader = true;
    this.getBusiness();
    this.currentbrand = JSON.parse(localStorage.getItem('currentBrand'));
    this.myFormiBeacon = formBuilder.group({
      ibeacon_uuid: [""],
      ibeacon_major: [""],
      ibeacon_minor: [""],
      ibeacon_notificationtext: ["", [Validators.required]]
    });
    this.ibeacon = (this.currentbrand['ibeacon'].ibeacon == 1) ? 'yes' : 'no';
    this.myFormiBeacon.controls['ibeacon_uuid'].setValue(this.currentbrand['ibeacon'].ibeacon_uuid);
    this.myFormiBeacon.controls['ibeacon_minor'].setValue(this.currentbrand['ibeacon'].ibeacon_minor);
    this.myFormiBeacon.controls['ibeacon_major'].setValue(this.currentbrand['ibeacon'].ibeacon_major);
    this.myFormiBeacon.controls['ibeacon_notificationtext'].setValue(this.currentbrand['ibeacon'].ibeacon_notificationtext);
    console.log(this.ibeacon, this.currentbrand);
  }

  ngAfterViewInit() {
    if (this.ibeacon=='yes'){
      this.ibeacon='yes';
      this.myFormiBeacon.get('ibeacon_uuid').setValidators([Validators.required,
        Validators.pattern("^(?!00)[0-9a-f]{8}[-]{1}(?!00)[0-9a-f]{4}[-]{1}(?!00)[0-9a-f]{4}[-]{1}(?!00)[0-9a-f]{4}[-]{1}(?!00)[0-9a-f]{12}$")]);
      this.myFormiBeacon.get('ibeacon_uuid').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_major').setValidators([Validators.required, Validators.min(0), Validators.max(65535)]);
      this.myFormiBeacon.get('ibeacon_major').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_minor').setValidators([Validators.required, Validators.min(0), Validators.max(65535)]);
      this.myFormiBeacon.get('ibeacon_minor').updateValueAndValidity();
    }else{
      this.ibeacon='no';
      this.myFormiBeacon.get('ibeacon_uuid').setValidators([]);
      this.myFormiBeacon.get('ibeacon_uuid').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_major').setValidators([]);
      this.myFormiBeacon.get('ibeacon_major').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_minor').setValidators([]);
      this.myFormiBeacon.get('ibeacon_minor').updateValueAndValidity();
    }
  }

  ibeaconToggle(toggle){
    if (toggle=='yes'){
      this.ibeacon='yes';
      this.myFormiBeacon.get('ibeacon_uuid').setValidators([Validators.required,
        Validators.pattern("^(?!00)[0-9a-f]{8}[-]{1}(?!00)[0-9a-f]{4}[-]{1}(?!00)[0-9a-f]{4}[-]{1}(?!00)[0-9a-f]{4}[-]{1}(?!00)[0-9a-f]{12}$")]);
      this.myFormiBeacon.get('ibeacon_uuid').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_major').setValidators([Validators.required, Validators.min(0), Validators.max(65535)]);
      this.myFormiBeacon.get('ibeacon_major').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_minor').setValidators([Validators.required, Validators.min(0), Validators.max(65535)]);
      this.myFormiBeacon.get('ibeacon_minor').updateValueAndValidity();
    }else{
      this.ibeacon='no';
      this.eventsAdded = false;
      this.myFormiBeacon.get('ibeacon_uuid').setValidators([]);
      this.myFormiBeacon.get('ibeacon_uuid').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_major').setValidators([]);
      this.myFormiBeacon.get('ibeacon_major').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_minor').setValidators([]);
      this.myFormiBeacon.get('ibeacon_minor').updateValueAndValidity();
    }
  }

  ibeaconUUIDInput(e){
    console.log("ibeaconUUIDInput",e,e.data);
    return
    if(!this.eventsAdded){
      this.eventsAdded = true;
      addHyphens(document.getElementById('ibeaconUUID'));
    }
    if(e.data){
      console.log('e.data')
      inputEventListener(document.getElementById('ibeaconUUID'),e.data);
    }
    // this.myFormiBeacon.get('ibeacon_uuid').setValue(
    //   (document.getElementById('ibeaconUUID') as HTMLInputElement).value
    // );
  }

  updateiBeacon(){
    if (this.myFormiBeacon.valid) {
      let data;
      if(this.ibeacon=='yes'){
        data={
          'ibeacon': 1,
          'ibeacon_uuid': this.myFormiBeacon.get('ibeacon_uuid').value,
          'ibeacon_major': this.myFormiBeacon.get('ibeacon_major').value,
          'ibeacon_minor': this.myFormiBeacon.get('ibeacon_minor').value,
          'ibeacon_notificationtext': this.myFormiBeacon.get('ibeacon_notificationtext').value
        }
      }else{
        data={
          'ibeacon': 2,
          'ibeacon_uuid': this.currentbrand['ibeacon'].ibeacon_uuid,
          'ibeacon_major': this.currentbrand['ibeacon'].ibeacon_major,
          'ibeacon_minor': this.currentbrand['ibeacon'].ibeacon_minor,
          'ibeacon_notificationtext': this.myFormiBeacon.get('ibeacon_notificationtext').value
        }
      }
      let brand_id = JSON.parse(localStorage.getItem('currentBrand'))['brand_id'];
      this.customValidationiBeacon = true;
      this.brandService.updateIbeacon(brand_id, data).subscribe(result => {
        console.log(result);
        this.brandService.getBrandById(brand_id).subscribe(data => {
          localStorage.setItem('currentBrand', JSON.stringify(data['brand']));
          this.mainService.showToastrSuccess.emit({text: 'Settings updated'});
        });
      });
    } else {
      this.customValidationiBeacon = false;
    }
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));

    this.topArea = `Hi,
    ${user.firstname} ${user.lastname}
    this a is dummy messsge to send busniesss for
    Secret code
      `;
    this.secretNumbersArr = Array(this.secretNumber.length).fill(0).map((x, i) => i);
    // setTimeout(() => {
    //   if(this.ibeacon == 'yes'){
    //     (document.getElementById('ibeaconYes') as HTMLInputElement).checked = true;
    //   } else{
    //     (document.getElementById('ibeaconNo') as HTMLInputElement).checked = true;
    //   }
    // }, 4000);
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
