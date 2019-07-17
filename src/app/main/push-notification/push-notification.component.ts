import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { MainService } from 'src/app/shared/services/main.service';

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

  campaigns = [];


  constructor(private mainService: MainService, private campaignService: CompaignService, private formBuilder: FormBuilder) {
    this.getCampaigns(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']);
    this.myForm = formBuilder.group({
      campaign: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });
  }

  ngOnInit() {
  }

  getCampaigns(brand_id){
    this.campaignService.getСampaignsBrands(brand_id).subscribe(data => {
      this.campaigns = data['data'];
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
        if(result['success']){
          this.mainService.showToastrSuccess.emit({text: result['message']});
        }else{
          this.mainService.showToastrSuccess.emit({text: result['message']});
        }
      }, error =>{
        console.log(error);
        this.inProcces = false;
        this.notificationError = true;
      });
    }
  }

}
