import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  cardType;
  cardTypeId;
  changeBrandBool = false;

  goToPro = new EventEmitter;

  showLoader = new EventEmitter;
  showToastr = new EventEmitter;
  showToastrSuccess = new EventEmitter;

  couponsData = [];
  businessData = [];
  dataCampaign = {
    name: '',
    description: '',
    card_id: '', // template
    discount: '',
    selectedCustomField: "",
    startDate: '',
    endDate: '',
    brand_id: '',
    campaign_type: '',
    coupon_validity: '',
    currency: '',
    event_name: '',
    venue: '',
    time: '',
    cardType: '',
    points: ''
  };

  addBusiness(item) {
    this.businessData.push(item);
  }

  constructor() {}
}
