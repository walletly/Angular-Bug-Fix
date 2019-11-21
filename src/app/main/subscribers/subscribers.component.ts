import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/shared/services/brand.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as localForage from 'localforage';


@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})
export class SubscribersComponent implements OnInit {

  currentBrand;
  showLoader;
  searchText;
  pageSize = 10;
  checkAllSubscribers = true;
  subscribers = [];
  filterSubscribers = [];
  selectedSubscribers = [];

  subscribersColumn = ['Check', 'Avatar', 'Name', 'Email', 'Phone', 'Gender', 'Status', 'Subscribed'];
  allSubscribersColumn = this.subscribersColumn;

  constructor(
    private brandService: BrandService
  ) {
    this.showLoader = true;
    this.getSubscribers();
  }

  ngOnInit() {
  }

  async getSubscribers() {
    this.currentBrand = await localForage.getItem('currentBrand');
    this.brandService.getBrandSubscribers(this.currentBrand.brand_id).subscribe(res => {
      console.log(res);
      if(res['data']){
        this.showLoader = false;
        let i = 0;
        res['data'].forEach(element => {
          let createdAt = new Date(element.created_at._seconds*1000).toDateString().slice(4).split(' ');
          createdAt = [createdAt[1], createdAt[0], createdAt[2]]
          const subscribe = createdAt.join('-');

          this.subscribers.push({
            data: {
              'Check': {name: true },
              'Avatar': { name: element.avatar },
              'Name': { name:  element.firstname ? `${element.firstname} ${element.lastname}` : ''},
              'Email': { name: element.email },
              'Phone': { name: element.phone },
              'Gender': { name: element.gender },
              'Status': { name: element.status },
              'Subscribed': { name: subscribe }
            }
          })
          i ++;
        });
        this.filterSubscribers = this.subscribers;
        this.selectedSubscribers = this.subscribers;
      }
    }, err => {
      this.showLoader = false;
      console.log(err);
    });
  }

  filterSubscriberFun() {
    this.filterSubscribers = this.subscribers.filter(element => {
      // tslint:disable-next-line: forin
      for (var i in element.data){
        console.log(i);
        if(i !== 'Check' && element.data[i].name){
          if(element.data[i].name.toLowerCase().includes(this.searchText.toLowerCase())){
            return true
          }
        }
      }
    })
  }

  downloadSubscribersData() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Subscribers Data',
      useBom: false,
      noDownload: false,
      headers: ['Name', 'Email', 'Phone', 'Gender', 'Status', 'Subscribed']
    };
    const subscribersData = [];
    this.selectedSubscribers.forEach(result => {
      subscribersData.push({
        'Name':  result['data']['Name'].name,
        'Email': result['data']['Email'].name,
        'Phone': result['data']['Phone'].name,
        'Gender': result['data']['Gender'].name,
        'Status': result['data']['Status'].name,
        'Subscribed': result['data']['Subscribed'].name
      });
    });

    // tslint:disable-next-line: no-unused-expression
    new ngxCsv(subscribersData, 'Subscribers Data', options);
  }

  selectAll(){
    if(this.checkAllSubscribers){
      this.filterSubscribers.forEach(element => {
        element.data.Check.name = true;
      })
      this.addSubscribers();
    } else {
      this.filterSubscribers.forEach(element => {
        element.data.Check.name = false;
      })
      this.addSubscribers();
    }
  }

  selectSubscribers(){
    this.checkAllSubscribers = true;
    this.filterSubscribers.forEach(element => {
      if(!element.data.Check.name){
        this.checkAllSubscribers = false;
      }
    })
    this.addSubscribers();
  }

  addSubscribers(){
    this.selectedSubscribers = this.filterSubscribers.filter(element => {
      if(element.data.Check.name){
        return true;
      }
    })
    console.log(this.selectedSubscribers);
  }

}
