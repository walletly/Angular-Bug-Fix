import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CardService } from 'src/app/shared/services/card.service';

@Component({
  selector: 'app-create-coupons',
  templateUrl: './create-coupons.component.html',
  styleUrls: ['./create-coupons.component.scss']
})
export class CreateCouponsComponent implements OnInit {

  id;
  type;
  typeId;

  dataCard;
  card;
  photoLogo;
  photoCover;
  coverSizeValidation = true;
  brandSizeValidation = true;
  
  myFormFront: FormGroup;
  myFormBack: FormGroup;

  customValidationFront = true;
  customValidationBack = true;

  messError;
  inProcces = false;

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private route: Router,
    private activeRout: ActivatedRoute,
    private cardService: CardService
  ) {
    this.fieldValidation();
  }

  @ViewChild('accordionFront') accordionFront;
  @ViewChild('accordionBack') accordionBack;

  fieldValidation() {

    this.myFormFront = this.formBuilder.group({
      TemplateName: ["", [Validators.required]],
      brandName: ["", [Validators.required]],
      brandLogo: ["", [Validators.required]],
      coverImage: ["", [Validators.required]],
    });

    this.myFormBack = this.formBuilder.group({
      description: ["", [Validators.required]],
      moreInfo: ["", [Validators.required]],
      location: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      website: ["", [Validators.required, Validators.pattern("http(s?):\/\/[a-zA-Z0-9.]+[\/]*[a-zA-Z0-9.]*[\/]*")]],
      facebook: ["www.facebook.com/", [Validators.required, Validators.pattern("((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}")]],
    });

  }

  ngOnInit() {
    if (this.mainService.cardType) {
      this.type = this.mainService.cardType;
      this.typeId = this.mainService.cardTypeId;
    } else {
      this.type = 'coupons';
      this.typeId = 1;
    }
    this.accordionFront.open();

    this.id = this.activeRout.snapshot.paramMap.get("id");
    if (this.id) {
      this.cardService.getCardById(this.id).subscribe(result => {
        console.log(result);
        this.card = result['data'];
        this.createDataCard();
        this.photoLogo = this.dataCard.brandLogo;
        this.photoCover = this.dataCard.coverImage;
      });
    } else {

      this.dataCard = {
        templateName: '',
        brandName: '',
        brandLogo: '',
        coverImage: '',
        description: ``,
        moreInfo: ``,
        location: '',
        phone: '',
        email: '',
        website: '',
        facebook: 'www.facebook.com/',
        cardType: this.typeId,
        id: ''
      };
      if (localStorage.getItem('currentBrand')) {
        let currentBrand = JSON.parse(localStorage.getItem('currentBrand'));
        this.dataCard = {
          templateName: '',
          brandName: currentBrand.brand_name,
          brandLogo: currentBrand.brand_logo,
          coverImage: currentBrand.brand_cover,
          description: currentBrand.description,
          moreInfo: currentBrand.more_info,
          location: currentBrand.location,
          phone: currentBrand.phone,
          email: currentBrand.email,
          website: currentBrand.website,
          facebook: 'www.facebook.com/' + currentBrand.facebook_page_id,
          cardType: this.typeId,
          id: ''
        };
        this.photoLogo = this.dataCard.brandLogo;
        this.photoCover = this.dataCard.coverImage;
      }
    }
  }

  clear() {

    let flag;
    if (this.accordionFront.expanded) {
      flag = 'front';
      this.myFormFront.reset();
    } else if (this.accordionBack.expanded) {
      flag = 'back';
      this.myFormBack.reset();
    }

    this.customValidationFront = true;
    this.customValidationBack = true;

    for (let key in this.dataCard) {
      if (flag === 'front') {
        console.log(flag);
        if (
          key !== 'id' &&
          key !== 'cardType' &&
          key !== 'description' &&
          key !== 'moreInfo' &&
          key !== 'location' &&
          key !== 'phone' &&
          key !== 'email' &&
          key !== 'website' &&
          key !== 'facebook'
        ) {
          this.dataCard[key] = "";
        }
      } else {
        console.log(flag);
        if (
          key !== 'id' &&
          key !== 'cardType' &&
          key !== 'templateName' &&
          key !== 'brandName' &&
          key !== 'brandLogo' &&
          key !== 'coverImage'
        ) {
          this.dataCard[key] = "";
        }
      }
    }
  }

  create() {
    console.log(this.dataCard);
    this.inProcces = true;
    if (this.photoLogo && this.photoCover) {
      this.myFormFront.controls['brandLogo'].setErrors(null);
      this.myFormFront.controls['coverImage'].setErrors(null);
    }
    if (this.myFormFront.valid && this.myFormBack.valid) {
      this.customValidationFront = true;
      this.customValidationBack = true;
      this.createCard();
      this.cardService.createCard(this.card).subscribe(result => {
        console.log(result);
        if (result['success']) {
          this.route.navigate(['/main/templates/walletly-cards']);
          this.inProcces = false;
        }
      }, err => {
        this.messError = err.error.error;
      });
    } else {
      this.customValidationFront = false;
      this.customValidationBack = false;
      this.messError = 'Validation Error';
      this.inProcces = false;

      if (this.myFormFront.valid && this.myFormBack.invalid) {
        this.accordionBack.open();
        this.accordionFront.close();
        this.inProcces = false;
      } else if (this.myFormFront.invalid && this.myFormBack.valid) {
        this.accordionFront.open();
        this.accordionBack.close();
        this.inProcces = false;
      } else if (this.myFormFront.invalid && this.myFormBack.invalid) {
        this.accordionFront.open();
        this.accordionBack.close();
        this.inProcces = false;
      }
    }
  }

  update() {
    this.inProcces = true;
    console.log(this.id);
    this.myFormFront.controls['brandLogo'].setErrors(null);
    this.myFormFront.controls['coverImage'].setErrors(null);

    if (this.myFormFront.valid && this.myFormBack.valid) {
      this.customValidationFront = true;
      this.customValidationBack = true;

      this.createCard();
      this.cardService.updateCard(this.id, this.card).subscribe(result => {
        console.log(result);
        if (result['success']) {
          this.route.navigate(['/main/templates/walletly-cards']);
          this.inProcces = false;
        }
      });
    } else {
      if (this.myFormFront.valid && this.myFormBack.invalid) {
        this.accordionBack.open();
        this.customValidationFront = true;
        this.customValidationBack = false;
        this.inProcces = false;
      } else if (this.myFormFront.invalid && this.myFormBack.valid) {
        this.accordionFront.open();
        this.customValidationFront = false;
        this.customValidationBack = true;
        this.inProcces = false;
      } else if (this.myFormFront.invalid && this.myFormBack.invalid) {
        this.accordionFront.open();
        this.customValidationFront = false;
        this.customValidationBack = false;
        this.inProcces = false;
      }
    }
  }

  uploadLogo(file: File) {
    if (file[0].size / 1024 / 1024 <= 1) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = document.createElement('img');
        img.src = reader.result as string;
        this.brandSizeValidation = true;

        img.onload = () => {
          if ((img.naturalWidth <= 110 && img.naturalHeight <= 110) && (img.naturalWidth >= 55 && img.naturalHeight >= 55)) {
            this.photoLogo = reader.result as string;
            this.dataCard.brandLogo = this.photoLogo;
            this.brandSizeValidation = true;
          } else {
            this.brandSizeValidation = false;
          }
        };
      };

      reader.readAsDataURL(file[0]);
    } else {
      this.brandSizeValidation = false;
    }
  }

  uploadCover(file: File) {
    if (file[0].size / 1024 / 1024 <= 4) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = document.createElement('img');
        img.src = reader.result as string;
        this.coverSizeValidation = true;

        img.onload = () => {
          if ((img.naturalWidth <= 750 && img.naturalHeight <= 294) && (img.naturalWidth >= 375 && img.naturalHeight >= 147)) {
            this.photoCover = reader.result as string;
            this.dataCard.coverImage = this.photoCover;
            this.coverSizeValidation = true;
          } else {
            this.coverSizeValidation = false;
          }
        };
      };

      reader.readAsDataURL(file[0]);
    } else {
      this.coverSizeValidation = false;
    }
  }

  deleteImg(name) {
    if (name === 'photoCover') {
      this.myFormFront.controls.coverImage.reset();
      this.photoCover = null;
      this.dataCard.coverImage = '';
    }
    if (name === 'photoLogo') {
      this.myFormFront.controls.brandLogo.reset();
      this.photoLogo = null;
      this.dataCard.brandLogo = '';
    }
  }

  createCard() {
    this.card = {
      template_name: this.dataCard.templateName,
      brand_name: this.dataCard.brandName,
      brand_logo: this.dataCard.brandLogo,
      brand_cover: this.dataCard.coverImage,
      description: this.dataCard.description,
      about: this.dataCard.moreInfo,
      location_url: this.dataCard.location,
      card_type: this.dataCard.cardType,
      phone: this.dataCard.phone,
      email: this.dataCard.email,
      website_url: this.dataCard.website,
      facebook_page_url: this.dataCard.facebook,
      brand_id: JSON.parse(localStorage.getItem('currentBrand'))['brand_id'],
      user_id: localStorage.getItem('userID')
    };
  }

  createDataCard() {
    this.dataCard = {
      templateName: this.card.template_name,
      brandName: this.card.brand_name,
      brandLogo: this.card.brand_logo,
      coverImage: this.card.brand_cover,
      description: this.card.description,
      moreInfo: this.card.about,
      location: this.card.location_url,
      cardType: this.card.card_type,
      phone: this.card.phone,
      email: this.card.email,
      website: this.card.website_url,
      facebook: this.card.facebook_page_url,
      id: this.card.brand_id
    };
  }
}
