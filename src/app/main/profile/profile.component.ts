import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  defaultColumns = ['Name', 'Subscription', 'Date Created', 'Status'];
  allColumns = this.defaultColumns;
  userDrb;

  data = [
    {
      data: { 'Name': { name: 'Litle Merimad', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png' }, 'Subscription': { name: 'free' }, 'Date Created': { name: '23/4/2019' }, 'Status': { name: 'connected' } },
    },
    {
      data: { 'Name': { name: 'Litle Merimad', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png' }, 'Subscription': { name: 'pro' }, 'Date Created': { name: '23/4/2019' }, 'Status': { name: 'connected' } },
    },
  ];

  constructor() { }

  ngOnInit() {
  }
  photo = 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png';

  uploadCover(file: File) {
    const reader = new FileReader();

    reader.onloadend = () => {
      const img = document.createElement('img');
      img.src = reader.result as string;

      img.onload = () => {
          this.photo = reader.result as string;
      };
    };

    reader.readAsDataURL(file[0]);
  }

  deleteImg() {
    this.photo = null;
  }


}
