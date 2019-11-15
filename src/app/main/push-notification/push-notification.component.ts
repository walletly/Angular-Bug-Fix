import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { MainService } from 'src/app/shared/services/main.service';
import * as localForage from 'localforage';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {

  @ViewChild('select') select;

  myForm: FormGroup;
  customValidation = true;
  inProcces = false;
  notificationError = false;
  notificationErrorMessage;
  totalSubscriber;

  campaigns = [];

  historyColumns = ['Post', 'Processed', 'Sent(Total)', 'Apple', 'Android', 'Failed'];
  locationColumns = ['PASS TYPE', 'AVAILABLE TRIGGERS', 'LOCATION RADIUS', 'DATE WINDOW', 'APPLE WALLET', 'GOOGLE PAY'];
  logLocationColumns = ['Date', 'Message', 'Location'];
  logiBeaconColumns = ['Date', 'Message'];
  allHistoryColumns = this.historyColumns;
  allLocationColumns = this.locationColumns;
  allLogLocationColumns = this.logLocationColumns;
  allLogiBeaconColumns = this.logiBeaconColumns;

  history = [
      {
        data: {
          'Post': { name: 'Your coupon expires on Sunday…' },
          'Processed': { name: '19 Sep 2019 20:40' },
          'Sent(Total)': { name: '500' },
          'Apple': { name: '238' },
          'Android': { name: '123' },
          'Failed': { name: '34' }
        },
      }
  ];


  logLocation = [
    {
      data: {
        'Date': { name: '19 Sep 2019' },
        'Message': { name: 'You are near to store would like to avail offer.' },
        'Location': { name: '50 Wakefield St Woombye QLD 4559' }
      }
    }
];

  logiBeacon = [
    {
      data: {
        'Date': { name: '19 Sep 2019' },
        'Message': { name: 'You are near to store would like to avail offer.' },
      }
    }
  ];

  location = [
    {
      data: {
        'PASS TYPE': { name: 'Loyalty' },
        'AVAILABLE TRIGGERS': { name: 'Location' },
        'LOCATION RADIUS': { name: 'Small (100m)' },
        'DATE WINDOW': { name: '' },
        'APPLE WALLET': { name: true },
        'GOOGLE PAY': { name: true }
      },
    },
    {
      data: {
      'PASS TYPE': { name: 'Member card' },
      'AVAILABLE TRIGGERS': { name: 'Date and Location1' },
      'LOCATION RADIUS': { name: 'Small (100m)' },
      'DATE WINDOW': { name: true },
      'APPLE WALLET': { name: true },
      'GOOGLE PAY': { name: true }
      }
    },
    {
      data: {
      'PASS TYPE': { name: 'Event ticket' },
      'AVAILABLE TRIGGERS': { name: 'Date and Location1' },
      'LOCATION RADIUS': { name: 'Large (1,000m)' },
      'DATE WINDOW': { name: true },
      'APPLE WALLET': { name: true },
      'GOOGLE PAY': { name: '' }
      }
    }
];

  constructor(private mainService: MainService, private campaignService: CompaignService, private formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      campaign: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });
  }
  
  async ngOnInit() {
    const currentBrand = await localForage.getItem('currentBrand');
    this.getCampaigns(currentBrand['brand_id']);
  }

  getCampaigns(brand_id){
    this.campaignService.getСampaignsBrands(brand_id, {}).subscribe(campaigns => {
      campaigns['data'].forEach(campaign => {
        if (campaign.campaign_status != 'expired' && campaign.campaign_status != 'inactive'){
          this.campaigns.push(campaign);
        }
      });;
    });
  }

  send(){
    if(this.myForm.invalid){
      this.customValidation=false;
    }
    else{
      this.notificationError = false;
      this.inProcces = true;
      this.customValidation=true;
      const body = {
        campaign_message: this.myForm.get('message').value,
      };
      const campaign_id = this.myForm.get('campaign').value;
      this.campaignService.sendCampaignNotification(campaign_id, body).subscribe(result => {
        console.log(result);
        this.inProcces = false;
        this.notificationError = false;
        this.mainService.showToastrSuccess.emit({text: result['message']});
      }, error =>{
        console.log(error);
        this.inProcces = false;
        this.notificationError = true;
        this.notificationErrorMessage = error['error'].message
      });
    }
  }

  checkSubs(id) {
    this.campaignService.getСampaignById(id).subscribe(res => {
      console.log(res);
      if (res['data']) {
        if (res['data'].cards_created > 0) {
          this.totalSubscriber = res['data'].cards_created;
        } else if (res['data'].coupons_created > 0) {
          this.totalSubscriber = res['data'].coupons_created;
        } else if (res['data'].tickets_created > 0) {
          this.totalSubscriber = res['data'].tickets_created;
        } else {
          console.log('No Subscriber');
          this.totalSubscriber = 'No Subscriber Yet';
        }
      }
    }, err => {
      console.log(err);
    });
  }

}
