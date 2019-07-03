import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { QrcodeService } from 'src/app/shared/services/qrcode.service';

@Component({
  selector: 'app-bot-qr',
  templateUrl: './bot-qr.component.html',
  styleUrls: ['./bot-qr.component.scss']
})
export class BotQrComponent implements OnInit {

  @ViewChild('select') select;

  selectedItem = 1;
  myForm: FormGroup;
  customValidation = true;

  chatBotQr = {
    botRefURL: '',
    backgroundImage: '',
    size: '',
    margin: false,
    color: false
  };

  constructor(private formBuilder: FormBuilder, private qrCodeService: QrcodeService) {
    this.myForm = formBuilder.group({
      botRefURL: ["", [Validators.required]],
      backgroundImage: ["", [Validators.required]],
      size: ["", [Validators.required]],
    });
  }

  generate() {
    if (this.myForm.valid) {
      this.customValidation = true;
    } else {
      this.customValidation = false;
    }
  }

  clear() {
    this.myForm.reset();
    this.select.reset();

    this.chatBotQr = {
      botRefURL: '',
      backgroundImage: '',
      size: '',
      margin: false,
      color: false
    };
  }

  ngOnInit() {
  }

  click() {
    this.qrCodeService.addChatbotQR({
      "ref_url": "example.com",
      "backgroundImageUrl": "https://media.wired.com/photos/5cdefc28b2569892c06b2ae4/master/w_1500,c_limit/Culture-Grumpy-Cat-487386121-2.jpg",
      "size": "200x200",
      "brand_id": "22222222222",
      "user_id": "sdsdasdasdad",
      "extraOptions": "white margin"
    }).subscribe(res => {
      console.log(res);

    });
  }
}
