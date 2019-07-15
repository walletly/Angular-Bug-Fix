import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CardService } from 'src/app/shared/services/card.service';
import { UploadService } from 'src/app/shared/services/upload.service';

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
  showLogoUploader = false;
  showBrandUploader = false;
  fileImg;
  uploadType;
  showLoader;

  logoName;
  coverName;

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private route: Router,
    private activeRout: ActivatedRoute,
    private cardService: CardService,
    private uploadService: UploadService
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
      phone: ["", [Validators.pattern("^[+]{0,1}[0-9]+[-\s\/0-9]*$")]],
      email: ["", [Validators.required, Validators.email]],
      website: ["", [Validators.required]],
      facebook: ["www.facebook.com/", [Validators.required, Validators.pattern("((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}")]],
    });

  }

  ngOnInit() {
    // this.mainService.showLoader.emit(true);
    this.showLoader = true;

    if (this.mainService.cardType) {
      this.type = this.mainService.cardType;
      this.typeId = this.mainService.cardTypeId;
    } else {
      this.type = 'coupons';
      this.typeId = 1;
    }

    this.id = this.activeRout.snapshot.paramMap.get('id');
    console.log(this.id);
    if (this.id) {
      this.cardService.getCardById(this.id).subscribe(result => {
        console.log(result);
        this.card = result['data'];
        this.createDataCard();
        this.photoLogo = this.dataCard.brandLogo;
        this.photoCover = this.dataCard.coverImage;
        // this.mainService.showLoader.emit(false);
        this.showLoader = false;
        setTimeout(() => {
          if (this.accordionFront) {
            this.accordionFront.open();
          }
        }, 200);

      }, err => {
        // this.mainService.showLoader.emit(false);
        this.showLoader = false;
        setTimeout(() => {
          if (this.accordionFront) {
            this.accordionFront.open();
          }
        }, 200);

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
        const currentBrand = JSON.parse(localStorage.getItem('currentBrand'));
        console.log(currentBrand);

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
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
      setTimeout(() => {
        if (this.accordionFront) {
          this.accordionFront.open();
        }
      }, 200);
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
          this.dataCard[key] = '';
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
          this.dataCard[key] = '';
        }
      }
    }
  }

  create() {
    console.log(this.dataCard);
    this.inProcces = true;
    if (this.dataCard.brandLogo) {
      this.myFormFront.controls['brandLogo'].setErrors(null);
    }
    if (this.dataCard.coverImage) {
      this.myFormFront.controls['coverImage'].setErrors(null);
    }
    if (this.myFormFront.valid && this.myFormBack.valid) {
      this.customValidationFront = true;
      this.customValidationBack = true;
      this.createCard();
      this.cardService.createCard(this.card).subscribe(result => {
        console.log(result);
        if (result['success']) {
          this.mainService.showToastrSuccess.emit({text: 'Tempalte created'});
          this.route.navigate(['/main/templates/walletly-cards']);
          this.inProcces = false;
        }
      }, err => {
        this.messError = 'Error at creation';
        this.inProcces = false;
      });
    } else {
      this.customValidationFront = false;
      this.customValidationBack = false;
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
    if (this.dataCard.brandLogo) {
      this.myFormFront.controls['brandLogo'].setErrors(null);
    }
    if (this.dataCard.coverImage) {
      this.myFormFront.controls['coverImage'].setErrors(null);
    }

    if (this.myFormFront.valid && this.myFormBack.valid) {
      this.customValidationFront = true;
      this.customValidationBack = true;

      this.createCard();
      this.cardService.updateCard(this.id, this.card).subscribe(result => {
        console.log(result);
        if (result['success']) {
          this.mainService.showToastrSuccess.emit({text: 'Tempalte updated'});
          this.route.navigate(['/main/templates/walletly-cards']);
          this.inProcces = false;
        }
      }, err => {
        this.messError = 'Error at update';
        this.inProcces = false;
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
    console.log(file);
    this.logoName = file['srcElement'].files[0].name;
    this.fileImg = file;
    this.uploadType = 'logo';
    this.showLogoUploader = true;
  }

  uploadCover(file: File) {
    this.coverName = file['srcElement'].files[0].name;
    this.fileImg = file;
    this.uploadType = 'brand';
    this.showBrandUploader = true;
  }

  uploadPhoto(event, fileType) {
    let name;
    let folder;
    switch (fileType) {
      case 'logo':
        name = this.logoName;
        folder = 'logo';
        break;
      case 'cover':
        name = this.coverName;
        folder = 'cover';
        break;
      default:
        break;
    }

    const formData = new FormData();
    formData.append('image', event, name);

    this.uploadService.uploadPhoto(formData, folder).subscribe(result => {
      if (result['success']) {
        switch (fileType) {
          case 'logo':
            this.photoLogo = result['data'].url;
            this.dataCard.brandLogo = result['data'].url;
            break;
          case 'cover':
            this.photoCover = result['data'].url;
            this.dataCard.coverImage = result['data'].url;
            break;
          default:
            break;
        }
      }
    });
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
      card_logo: this.dataCard.brandLogo,
      card_cover: this.dataCard.coverImage,
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
    console.log(this.card);
  }

  createDataCard() {
    this.dataCard = {
      templateName: this.card.template_name,
      brandName: this.card.brand_name,
      brandLogo: this.card.card_logo,
      coverImage: this.card.card_cover,
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
    console.log(this.dataCard);

  }
}
