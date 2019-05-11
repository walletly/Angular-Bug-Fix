import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NbSidebarService, NbMenuItem } from '@nebular/theme';
import { NbMenuService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../shared/services/main.service';
import { BrandService } from '../shared/services/brand.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('menu') menu;
  @Input() menuItem = <NbMenuItem>null;

  headerTitle;

  items = [
    {
      icon: 'icon-menu test-sunny icon-brand-menu',
      title: 'SunnyMeats',
      expanded: true,
      pathMatch: 'prefix',
      children: [
        {
          title: 'Dashboard',
          icon: 'icon-menu dashboard',
          link: ['dashboard'],
          pathMatch: 'prefix',
        },
        {
          icon: 'icon-menu templates',
          title: 'Templates',
          link: ['templates/walletly-cards'],
        },
        {
          icon: 'icon-menu campaign',
          title: 'Campaign',
          link: ['campaign-main/campaign'],
        },
        {
          icon: 'icon-menu business',
          title: 'Business',
          link: ['business/business-page'],
        },
        {
          icon: 'icon-menu bots-store',
          title: 'Bots Store',
          link: ['bots-store/bots-list'],
        },
        {
          icon: 'icon-menu audience',
          title: 'Audience',
          link: ['audience'],
        },
        {
          icon: 'icon-menu qr',
          title: 'Chat Bot QR',
          link: ['bot-qr'],
        },
        {
          icon: 'icon-menu settings',
          title: 'Settings',
          link: ['settings'],
        },
      ],
    },
  ];

  selectedItem;
  showSearchBox = false;

  brands = [];
  filteredBrands;
  searchBrandText = '';

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private roter: Router,
    private activatedRoute: ActivatedRoute,
    private mainService: MainService,
    private brandService: BrandService,
    private authService: AuthService
    ) {

    setTimeout(() => {
      if (localStorage.getItem('currentBrand')) {
        this.setBrand();
      }
    }, 200);

    this.getSelectedItem();
    this.brandService.getUsersBrands(localStorage.getItem('userID')).subscribe(result => {
      console.log(result);
      this.brands = result['data']['brands'];
      this.filteredBrands = this.brands;
    });

    this.roter.events.subscribe((val) => {
      let crumps = this.roter.url.split('/');
      let crumpValue1 = crumps[2];
      let crumpValue2 = ' ' + '>' + ' ' + crumps[3];
      if (this.roter.url === '/main/templates/walletly-cards') {
        crumpValue2 = '';
      } else if (this.roter.url === '/main/templates/walletly-cards') {
        crumpValue1 = 'Campaign';
        crumpValue2 = '';
      } else if (this.roter.url === '/main/business/business-page') {
        crumpValue1 = 'Business';
        crumpValue2 = '';
      } else if (this.roter.url === '/main/business/business-page') {
        crumpValue1 = 'bots-store';
        crumpValue2 = '';
      } else if (this.roter.url === '/main/bot-qr') {
        crumpValue1 = 'Chat Bot QR';
        crumpValue2 = '';
      } else if (this.roter.url === '/main/audience') {
        crumpValue1 = 'Audience';
        crumpValue2 = '';
      } else if (this.roter.url === '/main/settings') {
        crumpValue1 = 'Settings';
        crumpValue2 = '';
      } else if (this.roter.url === '/main/campaign-main/campaign') {
        crumpValue1 = 'Campaign';
        crumpValue2 = '';
      } else if (this.roter.url === '/main/bots-store/bots-list') {
        crumpValue1 = 'Bots Store';
        crumpValue2 = '';
      }
      if (crumps[2] === 'campaign-main') {
        crumpValue1 = 'Campaign';
      } else if (crumps[2] === 'bots-store') {
        crumpValue1 = 'Bots Store';
      }
      if (crumps[3] === 'bots-details') {
        crumpValue2 = 'Chat Templates';
      }
      if (this.roter.url === '/main/dashboard') {
        this.headerTitle = `Welcome back ${JSON.parse(localStorage.getItem('user'))['displayName']}`;
      } else {
        if (this.roter.url.split('/').length = 3) {
          this.headerTitle = JSON.parse(localStorage.getItem('currentBrand'))['brand_name'] + ' >' + ' ' + crumpValue1;
        }
        if (this.roter.url.split('/').length = 4) {
          this.headerTitle = JSON.parse(localStorage.getItem('currentBrand'))['brand_name'] + ' >' + ' ' + crumpValue1 + crumpValue2;
        }
      }

    });

  }

  ngOnInit() {

    switch (this.roter.url) {
      case '/main':
        this.roter.navigate(['/main/dashboard']);
        break;
      case '/main/templates':
        this.roter.navigate(['/main/templates/walletly-cards']);
        break;
      case '/main/campaign-main':
        this.roter.navigate(['/main/campaign-main/campaign']);
        break;
      case '/main/business':
        this.roter.navigate(['/main//main/business/business-page']);
        break;
      case '/main/bots-store':
        this.roter.navigate(['/main/bots-store/bots-list']);
        break;
      default:
        break;
    }

    this.getToogleItem();
    this.getSelectedItem();
    this.showSearchBox = false;
    let menuItems;

    setTimeout(() => {
      if (this.items[0] && this.items[0].children) {
        menuItems = document.querySelector("nb-menu .menu-item>.menu-items").children;
      }
      for (const menu in menuItems) {

        if (!isNaN(+menu)) {

          if (this.roter.url.includes(this.items[0].children[menu].link[0].split('/')[0])) {
            menuItems[menu].classList.add('active');
          } else {
            menuItems[menu].classList.remove('active');
          }
        }
      }
    }, 200);

    this.roter.events.subscribe((val) => {
      setTimeout(() => {
        if (this.items[0] && this.items[0].children) {
          menuItems = document.querySelector("nb-menu .menu-item>.menu-items").children;
        }
        for (const menu in menuItems) {

          if (!isNaN(+menu)) {

            if (this.roter.url.includes(this.items[0].children[menu].link[0].split('/')[0])) {
              menuItems[menu].classList.add('active');
            } else {
              menuItems[menu].classList.remove('active');
            }
          }
        }
      }, 200);
    });

    if (this.roter.url === '/main/dashboard') {
      this.headerTitle = `Welcome back ${JSON.parse(localStorage.getItem('user'))['displayName']}`;
    }
  }

  goToUpgade() {
    this.roter.navigate(['/main/settings']);
    setTimeout(() => {
      this.mainService.goToPro.emit('');
    }, 100);
  }

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  getSelectedItem() {
    this.menuService.onItemClick().subscribe(data => {
      let menuItems = document.querySelector("nb-menu .menu-item>.menu-items").children;
      for (const menu in menuItems) {
        setTimeout(() => {
          for (const menu in menuItems) {

            if (!isNaN(+menu)) {
              if (this.roter.url.includes(this.items[0].children[menu].link[0].split('/')[0])) {
                menuItems[menu].classList.add('active')
              } else {
                menuItems[menu].classList.remove('active')
              }
            }
          };
        }, 200);
      };
    });
  }

  getToogleItem() {
    this.menuService.onSubmenuToggle()
      .subscribe((menuBag) => {
        if (menuBag.tag === 'mainMenu') {
          this.showSearchBox = !this.showSearchBox;
        }
      });
  }

  setBrand() {
    if (localStorage.getItem('currentBrand')) {
      console.log(JSON.parse(localStorage.getItem('currentBrand')));
      this.items[0].title = JSON.parse(localStorage.getItem('currentBrand'))['brand_name'];
      let myElement = document.getElementsByClassName('icon-brand-menu')[0] as HTMLElement;
      myElement.style.backgroundImage = `url(${JSON.parse(localStorage.getItem('currentBrand'))['brand_logo']})`;
    }
  }

  searchBrand() {
    this.filteredBrands = this.brands.filter(brand => {
      if (brand['brand_name'].toLowerCase().includes(this.searchBrandText.toLowerCase())) {
        return true;
      }
    });
  }

  changeBrand(brandId) {
    console.log(brandId);
    this.authService.updateUser(localStorage.getItem('userID'), {activeBrand: brandId}).subscribe(result => {
      if (result['success']) {
        this.brandService.getBrandById(brandId).subscribe(brand => {
          localStorage.setItem('currentBrand', JSON.stringify(brand['brand']));
          this.setBrand();
        });
      }
    });
    // this.setBrand()
  }
}
