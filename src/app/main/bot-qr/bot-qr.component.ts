import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
  }

  constructor(private formBuilder: FormBuilder) {
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
    }
  }

  ngOnInit() {
  }

}
