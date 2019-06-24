import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {

  @ViewChild('select') select;

  myForm: FormGroup;
  customValidation = true;

  campaigns = ['Campaign 1', 'Campaign 2', 'Campaign 3', 'Campaign 4'];


  constructor(private formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      campaign: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });
  }

  ngOnInit() {
  }

  send(){
    if(this.myForm.invalid){
      this.customValidation=false;
    }
    else{
      this.customValidation=true;
    }
  }

}
