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
  constructor(private mainService: MainService, private cardService: CardService, private router: Router) { }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('currentBrand'))) {
      this.cardService.getBrandsCards(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(result => {
        console.log(result);
        this.data = result['data'];
      }, err => {
        console.log(err.error.message);
      });
    }
  }

  addToCampaign(brandId, cardId) {
    this.mainService.dataCoupon.brand_id = brandId;
    this.mainService.dataCoupon.card_id = cardId;
    this.router.navigate(['/main/campaign-main/create-campaign']);
  }

}
