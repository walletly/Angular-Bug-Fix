import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  cardType;
  cardTypeId;

  goToPro = new EventEmitter;

  couponsData = [];
  businessData = [];
  dataCoupon = {
    name: '',
    desription: '',
    template: '',
    discount: '',
    startDate: '',
    endDate: '',
    card_id: '',
    brand_id: ''
  };

  addBusiness(item) {
    this.businessData.push(item);
  }

  constructor() { }
}
