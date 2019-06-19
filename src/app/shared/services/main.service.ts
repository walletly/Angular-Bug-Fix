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
  dataCoupon = {
    name: '',
    desription: '',
    card_id: '', // template
    discount: '',
    startDate: '',
    endDate: '',
    brand_id: '',
    campaign_type: ''
  };

  addBusiness(item) {
    this.businessData.push(item);
  }

  constructor() {}
}
