import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UploadService } from 'src/app/shared/services/upload.service';
import { Router } from '@angular/router';
import * as localForage from 'localforage';


@Component({
  selector: 'app-campaign-type',
  templateUrl: './campaign-type.component.html',
  styleUrls: ['./campaign-type.component.scss']
})
export class CampaignTypeComponent implements OnInit {
  myForm: FormGroup;
  customValidation = true;
  defaultColumns = [
    "Name",
    "Image",
    "Tempalte",
    "Status",
    "Action"
  ];

  dataTable = [
    {
      data: {
        Name: "Coupon in $",
        Image: "assets/img/Coupon-in-$.png",
        Tempalte: "Coupon",
        Status: "Active",
        Action: ""
      }
    },
    {
      data: {
        Name: "Coupon in %",
        Image: "assets/img/Coupon.png",
        Tempalte: "Coupon",
        Status: "Inactive",
        Action: ""
      }
    },
    
  ];
  iconImage;
  fileImg;
  uploadType;
  showLogoUploader;
  showActions;
  iconName;
  photoIcon;

  constructor(
    private uploadService: UploadService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.myForm = formBuilder.group({
      selectTempalte: ["", [Validators.required]],
      name: ["", [Validators.required]],
      iconImage: ["", [Validators.required]]
    });
  }
  add(){
    if (this.myForm.invalid){
      this.customValidation = false;
    } else {
      this.customValidation = true;
    }
  }
  uploadIcon(file: File) {
    console.log(file);
    this.fileImg = file;
    this.uploadType = 'logo';
    this.showLogoUploader = true;
  }

  showShared(row, event) {
    console.log(row);
    event.stopPropagation();
    this.showActions = row;
  }

  uploadPhoto(event, fileType) {
    let name;
    let folder;
    switch (fileType) {
      case 'icon':
        name = this.iconName;
        folder = 'icon';
        break;
      default:
        break;
    }

    const formData = new FormData();
    formData.append('image', event, name);

    // this.uploadService.uploadPhoto(formData, this.fbId + '_' + folder).subscribe(result => {
    //   if (result['success']) {
    //     switch (fileType) {
    //       case 'icon':
    //         this.photoIcon = result['data'].url;
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    // });
  }

  async ngOnInit() {
    const user = await localForage.getItem('user');
    if (user['user_type'] !== 4){
      this.router.navigate(['/main/dashboard']);
    } 
  }
}
