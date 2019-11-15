import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MainService } from 'src/app/shared/services/main.service';
import { BusinessService } from 'src/app/shared/services/business.service';
import { BrandService } from 'src/app/shared/services/brand.service';
import { Router } from '@angular/router';
import * as localForage from 'localforage';


declare var addHyphens: any;

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
  currentBrand;

  data = [];
  fullData = [];
  showActions;
  showLoader;
  deleteId;
  inProcces = false;

  ibeacon;
  customValidationiBeacon = true;
  myFormiBeacon: FormGroup;

  constructor(private formBuilder: FormBuilder,private brandService: BrandService,private mainService: MainService, private business: BusinessService, private router: Router) {
    // this.mainService.showLoader.emit(true);
    this.showLoader = true;
    this.getBusiness();
    this.myFormiBeacon = formBuilder.group({
      ibeacon_uuid: [""],
      ibeacon_major: [""],
      ibeacon_minor: [""],
      ibeacon_notificationtext: ["", [Validators.required]]
    });
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
      this.myFormiBeacon.get('ibeacon_uuid').setValidators([]);
      this.myFormiBeacon.get('ibeacon_uuid').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_major').setValidators([]);
      this.myFormiBeacon.get('ibeacon_major').updateValueAndValidity();
      this.myFormiBeacon.get('ibeacon_minor').setValidators([]);
      this.myFormiBeacon.get('ibeacon_minor').updateValueAndValidity();
    }
  }

  ibeaconUUIDInput(e){
    if(e.data){
      if(this.myFormiBeacon.get('ibeacon_uuid').value.length > 36){
        (document.getElementById('ibeaconUUID') as HTMLInputElement).value = this.myFormiBeacon.get('ibeacon_uuid').value.slice(0,36);
        this.myFormiBeacon.get('ibeacon_uuid').setValue(
          (document.getElementById('ibeaconUUID') as HTMLInputElement).value
        )
        return;
      }
      if(e.inputType == 'insertText'){
        addHyphens(document.getElementById('ibeaconUUID'), e.data, false);
        this.myFormiBeacon.get('ibeacon_uuid').setValue(
          (document.getElementById('ibeaconUUID') as HTMLInputElement).value
        )
      }
    }else{
      if(this.myFormiBeacon.get('ibeacon_uuid').value.length > 36){
        (document.getElementById('ibeaconUUID') as HTMLInputElement).value = this.myFormiBeacon.get('ibeacon_uuid').value.slice(0,36);
        this.myFormiBeacon.get('ibeacon_uuid').setValue(
          (document.getElementById('ibeaconUUID') as HTMLInputElement).value
        )
        return;
      }
      if(e.inputType == 'insertFromPaste'){
        addHyphens(document.getElementById('ibeaconUUID'), e.data, true);
        setTimeout(() => {
          this.myFormiBeacon.get('ibeacon_uuid').setValue(
            (document.getElementById('ibeaconUUID') as HTMLInputElement).value
          )
        }, 100);
      }
    }
  }

  async updateiBeacon(){
    this.currentBrand = await localForage.getItem('currentBrand');

    if (this.myFormiBeacon.valid) {
      let data;
      this.inProcces = true;
      if(this.ibeacon=='no'){
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
          'ibeacon_uuid': this.currentBrand.ibeacon.ibeacon_uuid,
          'ibeacon_major': this.currentBrand.ibeacon.ibeacon_major,
          'ibeacon_minor': this.currentBrand.ibeacon.ibeacon_minor,
          'ibeacon_notificationtext': this.myFormiBeacon.get('ibeacon_notificationtext').value
        }
      }
      let brand_id = this.currentBrand.brand_id;
      this.customValidationiBeacon = true;
      this.brandService.updateIbeacon(brand_id, data).subscribe(result => {
        console.log(result);
        this.brandService.getBrandById(brand_id).subscribe(async data => {
          await localForage.setItem('currentBrand', data['brand']);
          this.inProcces = false;
          this.mainService.showToastrSuccess.emit({text: 'iBeacon settings updated'});
        });
      });
    } else {
      this.customValidationiBeacon = false;
    }
  }

  async ngOnInit() {
    this.currentBrand = await localForage.getItem('currentBrand');
    this.ibeacon = (this.currentBrand.ibeacon.ibeacon == 1) ? 'no' : 'yes';
    this.myFormiBeacon.controls['ibeacon_uuid'].setValue(this.currentBrand.ibeacon.ibeacon_uuid);
    this.myFormiBeacon.controls['ibeacon_minor'].setValue(this.currentBrand.ibeacon.ibeacon_minor);
    this.myFormiBeacon.controls['ibeacon_major'].setValue(this.currentBrand.ibeacon.ibeacon_major);
    this.myFormiBeacon.controls['ibeacon_notificationtext'].setValue(this.currentBrand.ibeacon.ibeacon_notificationtext);
    const user = await localForage.getItem('user');

    this.topArea = `Hi,
    ${user['firstname']} ${user['lastname']}
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

  async getBusiness() {
    this.currentBrand = await localForage.getItem('currentBrand');
    this.business.getUsers(this.currentBrand.brand_id).subscribe(result => {
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
              'Invite': elem.is_password_change ? -1 : elem.invite,
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

  async invite(email) {
    this.currentBrand = await localForage.getItem('currentBrand');
    console.log(email);

    const message = {
      recepient: email,
      subject: 'email subject',
      message: 'Email message body',
      brand_id: this.currentBrand.brand_id,
    };

    this.business.sendEmail([message]).subscribe(result => {
      console.log(result);
      this.mainService.showToastrSuccess.emit({text: 'The invitation has been sent'});
      this.getBusiness();
    });
  }

  async inviteAll() {
    this.currentBrand = await localForage.getItem('currentBrand');
    const messages = this.fullData.map(element => {
      return {
        recepient: element.email,
        subject: 'email subject',
        message: 'Email message body',
        brand_id: this.currentBrand.brand_id,
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

  openDeleteBox(id){
    this.showActions = null;
    this.deleteId = id;
    (document.getElementById('myModal') as HTMLDivElement).style.display = 'block';
  }

  closeDeleteBox(event){
    console.log((event.target as HTMLElement).className);
    if((event.target as HTMLElement).className == 'modal-content'){
      return;
    }
    this.deleteId = null;
    (document.getElementById('myModal') as HTMLDivElement).style.display = 'none';
  }

  async delete() {
    this.currentBrand = await localForage.getItem('currentBrand');
    (document.getElementById('myModal') as HTMLDivElement).style.display = 'none';
    // this.mainService.showLoader.emit(true);
    this.showLoader = true;

    this.showActions = null;
    console.log(this.deleteId);
    this.business.deleteBusinessUser(this.deleteId, this.currentBrand.brand_id).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.mainService.showToastrSuccess.emit({text: 'User deleted'});
        this.getBusiness();
        this.showLoader = false;
      }
      // this.mainService.showLoader.emit(false);
    }, err => {
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    });
  }

  refresh(){
    this.showLoader = true;
    this.getBusiness();
  }

  async changePermission(id, permission){
    this.currentBrand = await localForage.getItem('currentBrand');

    let data;
    if(permission == 'YES'){
      data = false;
    }else{
      data = true;
    }

    this.business.changeUserAccess(id, this.currentBrand.brand_id, { permission: data } ).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.mainService.showToastrSuccess.emit({text: 'User permission updated'});
        this.getBusiness();
      }
    }, err => {
      console.log(err);
    });
  }

}
