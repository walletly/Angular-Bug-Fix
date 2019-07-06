import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/shared/services/brand.service';
import * as moment from 'moment';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  defaultColumns = ['Name', 'Subscription', 'Date Created', 'Status'];
  allColumns = this.defaultColumns;
  userDrb;
  fullname;
  newName;
  user;

  showLogoUploader = false;
  fileImg;
  uploadType;

  data;
  // data = [
  //   {
  //     data: { 'Name': { name: 'Litle Merimad', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png' }, 'Subscription': { name: 'free' }, 'Date Created': { name: '23/4/2019' }, 'Status': { name: 'connected' } },
  //   },
  //   {
  //     data: { 'Name': { name: 'Litle Merimad', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png' }, 'Subscription': { name: 'pro' }, 'Date Created': { name: '23/4/2019' }, 'Status': { name: 'connected' } },
  //   },
  // ];

  photo = 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png';
  newPhoto;
  showLoader;
  
  constructor(
    private brandService: BrandService,
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private mainService: MainService
  ) {
    this.newPhoto = this.photo;

    this.user = JSON.parse(localStorage.getItem('user'));
    this.fullname = `${this.user['firstname']} ${this.user['lastname']}`;
    this.newName = this.fullname;
    if (this.user['avatar']) {
      this.photo = this.user['avatar'];
      this.newPhoto = this.photo;
    }
    this.showLoader = true;
    // this.mainService.showLoader.emit(true);
    brandService.getUsersBrands(localStorage.getItem('userID')).subscribe(data => {
      if (data['success']) {
        this.data = [];
        console.log(data['data']['brands']);
        data['data']['brands'].forEach(element => {
          this.data.push(
            {
              data: {
                'Name': { name: element.brand_name, icon: element.brand_logo },
                'Subscription': { name: element.plan_details.plan_name },
                'Date Created': { name: moment(element.created_at._seconds * 1000).format('DD/MM/YYYY') },
                'Status': { name: 'connected' }
              }
            }
          );
        });
      }
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    }, err => {
      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    });
  }

  ngOnInit() {
  }

  uploadCover(file: File) {
    // const reader = new FileReader();

    // reader.onloadend = () => {
    //   const img = document.createElement('img');
    //   img.src = reader.result as string;

    //   img.onload = () => {
    //     this.photo = reader.result as string;
    //   };
    // };

    // reader.readAsDataURL(file[0]);

    this.fileImg = file;
    this.uploadType = 'logo';
    this.showLogoUploader = true;
  }

  deleteImg() {
    this.newPhoto = null;
  }

  showDrb() {
    setTimeout(() => {
      this.userDrb = true;
    }, 100);
  }

  save() {
    const name = this.newName.split(' ');
    console.log(name);
    this.authService.updateUser(this.user.user_id, { firstname: name[0], lastname: name[1] ? name[1] : '', avatar: this.newPhoto }).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.user = result['data'];
        this.fullname = `${this.user['firstname']} ${this.user['lastname']}`;
        this.newName = this.fullname;
        if (this.newPhoto) {
          this.photo = this.newPhoto;
        }
        localStorage.setItem('user', JSON.stringify(this.user));
        this.userDrb = false;
      }
    });
  }

  logout() {
    this.firebaseAuth.auth.signOut().then(() => {
      localStorage.clear();
      localStorage.setItem('loggedOut', 'true');
      this.router.navigate(['/fb-login']);
    });
  }
}
