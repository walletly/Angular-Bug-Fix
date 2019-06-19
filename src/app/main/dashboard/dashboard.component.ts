import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private mainService: MainService) {
    if (mainService.changeBrandBool) {
      window.location.reload();
    }
  }

  ngOnInit() {
  }

}
