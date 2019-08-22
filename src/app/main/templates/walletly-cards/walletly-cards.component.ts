import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { CardService } from 'src/app/shared/services/card.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-walletly-cards',
  templateUrl: './walletly-cards.component.html',
  styleUrls: ['./walletly-cards.component.scss']
})
export class WalletlyCardsComponent implements OnInit {
  data;
  showLoader;
  constructor(private mainService: MainService, private cardService: CardService, private router: Router) { }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('currentBrand'))) {
      // this.mainService.showLoader.emit(true);
      this.showLoader = true;
      this.cardService.getBrandsCards(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(result => {
        console.log(result);
        this.data = result['data'];
        // this.mainService.showLoader.emit(false);
        this.showLoader = false;
      }, err => {
        console.log(err.error.message);
        // this.mainService.showLoader.emit(false);
        this.showLoader = false;
      });
    }
  }

  addToCampaign(brandId, cardId, cardType) {
    this.mainService.dataCampaign = {
      name: '',
      description: '',
      card_id: cardId,
      discount: '',
      selectedCustomField: "",
      startDate: '',
      endDate: '',
      campaign_type: '',
      brand_id: brandId,
      coupon_validity: '',
      currency: '',
      event_name: '',
      venue: '',
      time: '',
      cardType: cardType,
      points: ''
    };
    this.router.navigate(['/main/campaign-main/create-campaign']);
  }

}
