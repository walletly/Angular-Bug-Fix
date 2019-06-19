import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toastr',
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
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss']
})
export class ToastrComponent implements OnInit {

  data = [];
  constructor(private mainService: MainService, private router: Router) {
    this.mainService.showToastr.subscribe(data => {
      console.log(data);
      if (this.data.length >= 2) {
        this.data.splice(this.data.length - 1, 1);
        this.data.unshift(data);
      } else {
        this.data.unshift(data);
      }
    });
  }

  close(index) {
    this.data.splice(index, 1);
  }

  goToUpgade(index) {
    this.data.splice(index, 1);
    this.router.navigate(['/main/settings']);
    setTimeout(() => {
      this.mainService.goToPro.emit('');
    }, 300);
  }

  ngOnInit() {
  }

}
