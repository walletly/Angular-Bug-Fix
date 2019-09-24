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
    memCard_status_customField: '',
    event_name: '',
    venue: '',
    venue_coordinates: null,
    time: '',
    cardType: '',
    points: ''
  };

  addBusiness(item) {
    this.businessData.push(item);
  }

  constructor() {}
}
