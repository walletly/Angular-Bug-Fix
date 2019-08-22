import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { CardService } from 'src/app/shared/services/card.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-cards',
  templateUrl: './create-cards.component.html',
  styleUrls: ['./create-cards.component.scss']
})
export class CreateCardsComponent implements OnInit {

  isLoyalty = false;

  constructor(private mainServise: MainService, private cardService: CardService, private router: Router) { 

    this.cardService.getBrandsCards(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(result => {
      console.log(result);
      // this.mainService.showLoader.emit(false);
      for (let i in result['data']){
        if(result['data'][i].card_type == 4){
          this.isLoyalty = true;
        }
      }
    }, err => {
      console.log(err);
      // this.mainService.showLoader.emit(false);
    });
  }

  ngOnInit() {
  }

  getType(type) {
    this.mainServise.cardType = type;
    switch (type) {
      case 'coupons':
        this.mainServise.cardTypeId = 1;
        break;
      case 'cards':
        this.mainServise.cardTypeId = 2;
        break;
      case 'tickets':
        this.mainServise.cardTypeId = 3;
        break;
      case 'loyalty':
          this.mainServise.cardTypeId = 4;
          break;
      default:
        break;
    }
    this.router.navigate(['/main/templates/create-coupon']);
  }

}
