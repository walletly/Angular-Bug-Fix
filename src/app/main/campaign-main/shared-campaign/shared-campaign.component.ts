import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BrandService } from "../../../shared/services/brand.service";

@Component({
  selector: 'app-shared-campaign',
  templateUrl: './shared-campaign.component.html',
  styleUrls: ['./shared-campaign.component.scss']
})
export class SharedCampaignComponent implements OnInit {

  myForm: FormGroup;
  showLoader;
  campaignCode;
  invalidCampaign;
  campaign;
  campaignType;
  cardType;
  customValidation = true;
  inProcess;
  data;
  errorMessage = null;
  successMessage = null;
  successUrl = null;
  errorUrl = null;
  brand_logo;
  brand_name;


  constructor(
    private activeRout: ActivatedRoute,
    private campaignService: CompaignService,
    private brandService: BrandService,
    private formBuilder: FormBuilder,
  ) { 

    this.myForm = formBuilder.group({
      firstname: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern("^[+]{0,1}[0-9]+[-\s\/0-9]*$")]],
      members: ["", []],
    });


    this.campaignCode = this.activeRout.snapshot.paramMap.get('campaign_code');
    this.showLoader = true;
    this.campaignService.getСampaignByCode(this.campaignCode).subscribe(data => {
      this.campaign = data['data'][0];
      this.brandService.getBrandName(this.campaign.brand_id).subscribe(result =>{
        this.brand_logo = result['brand_logo'];
        this.brand_name = result['brand_name'];
        this.showLoader = false;
        this.invalidCampaign = false;
      },err =>{
        this.showLoader = false;
        this.invalidCampaign = true;
      }); 
      this.campaignType = this.campaign.campaign_type;
      this.selectCardType(this.campaignType);
    }, error=>{
      this.showLoader = false;
      this.invalidCampaign = true;
    })
  }

  ngOnInit() {
    this.data = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      members: '',
      brand_id: '',
      campaign_code: ''
    };
  }

  selectCardType(type){
    if(type <= 4){
      this.cardType = 'coupon';
    }else if(type <= 5){
      this.cardType = 'loyaltyCard';
    }else if(type <= 6){
      this.cardType = 'stampCard';
    }else if(type <= 7){
      this.cardType = 'card';
    }else if(type <= 9){
      this.cardType = 'ticket'
      if(type == 8){
        this.myForm.get('members').setValidators([Validators.required, Validators.min(1)]);
        this.myForm.get('members').updateValueAndValidity();
      }
    }
  }

  getCard(){
    if(this.myForm.valid){
      this.inProcess = true;
      this.customValidation = true;
      this.data.brand_id = this.campaign.brand_id;
      this.data.campaign_code = this.campaign.campaign_code;
      this.campaignService.postCampaignCard(this.cardType, this.campaign.brand_apiKey, this.data).subscribe(result => {
        this.inProcess = false;
        if (result['success']){
          this.successMessage = result['message'];
          this.successUrl = result['data'].coupon_url || result['data'].card_url || result['data'].ticket_url || result['data'].loyaltyCard_url || result['data'].stampCard_url;
          window.location.href = this.successUrl;
          this.inProcess = false;
        }else{
          this.errorMessage = result['message'];
          this.errorUrl = result['data'].coupon_url || result['data'].card_url || result['data'].ticket_url || result['data'].loyaltyCard_url || result['data'].stampCard_url;
          window.location.href = this.errorUrl;
          this.inProcess = false;
        }
      }, error => {
        this.errorMessage = error['error'].error;
        this.errorUrl = error['data'].coupon_url || error['data'].card_url || error['data'].ticket_url || error['data'].loyaltyCard_url || error['data'].stampCard_url;
        window.location.href = this.errorUrl;
        this.inProcess = false;
      });
    }else{
      this.customValidation = false;
    }
  }

}
