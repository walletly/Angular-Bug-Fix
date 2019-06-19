import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toastr-success',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('300ms', style({ transform: 'translateX(100%)', opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: './toastr-success.component.html',
  styleUrls: ['./toastr-success.component.scss']
})
export class ToastrSuccessComponent implements OnInit {

  data = [];
  constructor(private mainService: MainService, private router: Router) {
    this.mainService.showToastrSuccess.subscribe(data => {
      console.log(data);
      if (this.data.length >= 2) {
        this.data.splice(this.data.length - 1, 1);
        this.data.unshift(data);
      } else {
        this.data.unshift(data);
      }
      setTimeout(() => {
        this.data = [];
      }, 2000);
    });
  }

  close(index) {
    this.data.splice(index, 1);
  }

  ngOnInit() {
  }

}