import { Component, OnInit, AfterViewInit, ViewChild, Input } from "@angular/core";
import { NbSidebarService, NbMenuItem } from "@nebular/theme";
import { NbMenuService } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { MainService } from "../shared/services/main.service";
import { BrandService } from "../shared/services/brand.service";
import { AuthService } from "../shared/services/auth.service";
import { AngularFireAuth } from "angularfire2/auth";
import * as localForage from 'localforage';


@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild("menu") menu;
  @Input() menuItem = <NbMenuItem>null;

  headerTitle;
  avatar;
  helpPage = false;
  brandPlan;

  items = [
    {
      icon: "icon-menu test-sunny icon-brand-menu",
      title: "",
      expanded: true,
      pathMatch: "prefix",
      children: [
        {
          title: "Dashboard",
          icon: "icon-menu dashboard",
          link: ["dashboard"],
          pathMatch: "prefix"
        },
        {
          icon: "icon-menu templates",
          title: "Templates",
          link: ["templates/walletly-cards"]
        },
        {
          icon: "icon-menu campaign",
          title: "Campaign",
          link: ["campaign-main/campaign"]
        },
        {
          icon: "icon-menu business",
          title: "WalletScan",
          link: ["business/business-page"]
        },
        {
          icon: "icon-menu insight",
          title: "Insights",
          link: ["audience"]
        },
        {
          icon: "icon-menu audience",
          title: "Subscribers",
          link: ["subscribers"]
        },
        {
          icon: "icon-menu pushnotification",
          title: "Notification Center",
          link: ["push-notification"]
        },
        {
          icon: "icon-menu bots-store",
          title: "Bots Store",
          link: ["bots-store/bots-list"]
        },
        // {
        //   icon: "icon-menu qr",
        //   title: "Chat Bot QR",
        //   link: ["bot-qr"]
        // },
        {
          icon: "icon-menu settings",
          title: "Settings",
          link: ["settings"]
        }
      ]
    }
  ];

  brandName;

  currentUser;
  currentBrand;

  selectedItem;
  showSearchBox = false;

  username;
  userAdmin;

  brands = [];
  filteredBrands;
  searchBrandText = "";
  showLoader;
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private roter: Router,
    private activatedRoute: ActivatedRoute,
    private mainService: MainService,
    private brandService: BrandService,
    private authService: AuthService,
    private firebaseAuth: AngularFireAuth
  ) {
    this.startMain();
  }

  async startMain(){
    this.currentUser = await localForage.getItem("user");
    this.currentBrand = await localForage.getItem("currentBrand");
    if (this.currentUser.user_type === 4) {
      this.items = [];
      this.items = [
        {
          icon: "icon-menu test-sunny icon-brand-menu",
          title: "",
          expanded: true,
          pathMatch: "prefix",
          children: [
            {
              title: "Dashboard",
              icon: "icon-menu dashboard",
              link: ["dashboard-info-admin"],
              pathMatch: "prefix"
            },
            {
              icon: "icon-menu pages",
              title: "Brands",
              link: ["brands"]
            },
            {
              icon: "icon-menu marketers",
              title: "Marketers",
              link: ["marketers"]
            },
            {
              icon: "icon-menu audience",
              title: "Audience",
              link: ["audience"]
            },
            {
              icon: "icon-menu templates",
              title: "Templates",
              link: ["create-templates"]
            },
            {
              icon: "icon-menu campaign",
              title: "Campaign",
              link: ["campaign-type"]
            },
            {
              icon: "icon-menu settings",
              title: "Settings",
              link: ["settings"]
            }
          ]
        }
      ];
    }
    if (this.currentUser.user_type === 4) {
      this.userAdmin = true;
    } else {
      this.userAdmin = false;
    }
    this.username = {
      firstName: this.currentUser.firstname,
      lastName: this.currentUser.lastname
    };
    setTimeout(() => {
      this.mainService.showLoader.subscribe(event => {
        this.showLoader = event;
      });
    }, 200);

    setTimeout(async () => {
      if (this.currentBrand) {
        this.setBrand();
        this.brandPlan = this.currentBrand.plan_details.plan_name;
      }
    }, 200);

    this.avatar = this.currentUser.avatar;

    this.getSelectedItem();
    this.brandService
      .getUsersBrands(await localForage.getItem("userID"))
      .subscribe(result => {
        this.brands = [];
        result["data"]["brands"].forEach(brand => {
          if(this.currentBrand.brand_id != brand.brand_id){
            this.brands.push(brand);
          }
        });
        this.filteredBrands = this.brands;
      });

    this.roter.events.subscribe(val => {
      let crumps = this.roter.url.split("/");
      let crumpValue1 = crumps[2];
      let crumpValue2 = " " + ">" + " " + crumps[3];
      if (this.roter.url === "/main/templates/walletly-cards") {
        crumpValue2 = "";
      } else if (this.roter.url === "/main/templates/walletly-cards") {
        crumpValue1 = "Campaign";
        crumpValue2 = "";
      } else if (this.roter.url === "/main/business/business-page") {
        crumpValue1 = "Business";
        crumpValue2 = "";
      } else if (this.roter.url === "/main/bot-qr") {
        crumpValue1 = "Chat Bot QR";
        crumpValue2 = "";
      }else if (this.roter.url === "/main/push-notification") {
        crumpValue1 = "Push Notification";
        crumpValue2 = "";
      } else if (this.roter.url === "/main/audience") {
        crumpValue1 = "Audience";
        crumpValue2 = "";
      } else if (this.roter.url === "/main/settings") {
        crumpValue1 = "Settings";
        crumpValue2 = "";
      } else if (this.roter.url === "/main/campaign-main/campaign") {
        crumpValue1 = "Campaign";
        crumpValue2 = "";
      } else if (this.roter.url === "/main/bots-store/bots-list") {
        crumpValue1 = "Bots Store";
        crumpValue2 = "";
      } else if (this.roter.url === "/main/templates/create-cards") {
        crumpValue2 = "";
      }

      if (crumps[2] === "campaign-main") {
        crumpValue1 = "Campaign";
      } else if (crumps[2] === "bots-store") {
        crumpValue1 = "Bots Store";
      }

      if (crumps[3] === "bots-details") {
        crumpValue2 = " " + "> ManyChat";
      } else if (crumps[3] === "create-coupon") {
        crumpValue2 = " " + "> Coupons";
      } else if (
        crumps[3] === "create-campaign" ||
        crumps[3] === "review-campaign"
      ) {
        crumpValue2 = " " + "> Create";
      } else if (crumps[3] === "create-business") {
        crumpValue2 = "";
      }

      if (this.roter.url === "/main/dashboard") {
        this.brandName = null;
        this.headerTitle = `Welcome back ${this.username.firstName} ${
          this.username.lastName
        }`;
      } else {
        if ((this.roter.url.split("/").length = 3)) {
          const currentBrand = this.currentBrand;
          if (currentBrand) {
            this.brandName = currentBrand["brand_name"] + " >" + " ";
          }
          this.headerTitle = crumpValue1;
        }
        if ((this.roter.url.split("/").length = 4)) {
          const currentBrand = this.currentBrand;
          if (currentBrand) {
            this.brandName = currentBrand["brand_name"] + " >" + " ";
          }
          this.headerTitle = crumpValue1 + crumpValue2;
        }
      }
    });
  }

  async ngOnInit() {
    this.currentUser = await localForage.getItem("user");
    this.currentBrand = await localForage.getItem("currentBrand");
    this.username = {
      firstName: this.currentUser.firstname,
      lastName: this.currentUser.lastname
    };
    switch (this.roter.url) {
      case "/main":
        this.roter.navigate(["/main/dashboard"]);
        break;
      case "/main/templates":
        this.roter.navigate(["/main/templates/walletly-cards"]);
        break;
      case "/main/campaign-main":
        this.roter.navigate(["/main/campaign-main/campaign"]);
        break;
      case "/main/business":
        this.roter.navigate(["/main//main/business/business-page"]);
        break;
      case "/main/bots-store":
        this.roter.navigate(["/main/bots-store/bots-list"]);
        break;
      default:
        break;
    }
    if (this.roter.url === "/main/templates") {
      this.roter.navigate(["/main/templates/walletly-cards"]);
    }
    if (this.roter.url === "/main/campaign-main") {
      this.roter.navigate(["/main/campaign-main/campaign"]);
    }
    if (this.roter.url === "/main/business") {
      this.roter.navigate(["/main/business/business-page"]);
    }

    this.getToogleItem();
    this.getSelectedItem();
    this.showSearchBox = false;
    let menuItems;

    setTimeout(() => {
      if (this.items[0] && this.items[0].children) {
        menuItems = document.querySelector("nb-menu .menu-item>.menu-items")
          .children;
      }
      if(this.roter.url.includes('help')){
        this.helpPage = true;
      }
      for (const menu in menuItems) {
        if (!isNaN(+menu)) {
          if (
            this.roter.url.includes(
              this.items[0].children[menu].link[0].split("/")[0]
            )
          ) {
            menuItems[menu].classList.add("active");
            this.helpPage = false;
          } else {
            menuItems[menu].classList.remove("active");
          }
        }
      }
    }, 200);

    this.roter.events.subscribe(val => {
      setTimeout(() => {
        if (this.items[0] && this.items[0].children) {
          if (
            this.roter.url !== "/fb-connect" &&
            this.roter.url !== "/profile"
          ) {
            if (document.querySelector("nb-menu .menu-item>.menu-items")) {
              menuItems = document.querySelector(
                "nb-menu .menu-item>.menu-items"
              ).children;
            }
          }
        }
        if(this.roter.url.includes('help')){
          this.helpPage = true;
        }
        for (const menu in menuItems) {
          if (!isNaN(+menu)) {
            if (
              this.roter.url.includes(
                this.items[0].children[menu].link[0].split("/")[0]
              )
            ) {
              menuItems[menu].classList.add("active");
              this.helpPage = false;
            } else {
              menuItems[menu].classList.remove("active");
            }
          }
        }
        switch (this.roter.url) {
          case "/main":
            this.roter.navigate(["/main/dashboard"]);
            break;
          case "/main/templates":
            this.roter.navigate(["/main/templates/walletly-cards"]);
            break;
          case "/main/campaign-main":
            this.roter.navigate(["/main/campaign-main/campaign"]);
            break;
          case "/main/business":
            this.roter.navigate(["/main//main/business/business-page"]);
            break;
          case "/main/bots-store":
            this.roter.navigate(["/main/bots-store/bots-list"]);
            break;
          default:
            break;
        }
        if (this.roter.url === "/main/templates") {
          this.roter.navigate(["/main/templates/walletly-cards"]);
        }
        if (this.roter.url === "/main/campaign-main") {
          this.roter.navigate(["/main/campaign-main/campaign"]);
        }
        if (this.roter.url === "/main/business/") {
          this.roter.navigate(["/main/business/business-page"]);
        }
      }, 200);
    });

    if (this.roter.url === "/main/dashboard") {
      this.headerTitle = `Welcome back ${this.username.firstName} ${
        this.username.lastName
      }`;
    }

  }

  ngAfterViewInit() {
    this.getSVG();
    // if (!this.userAdmin) {
    //   let item = document.getElementsByClassName('menu-item')[8] as HTMLSpanElement;
    //   item.setAttribute("style", `pointer-events: none;`);

    //   let title = document.getElementsByClassName('menu-title')[8] as HTMLSpanElement;
    //   title.setAttribute("style",
    //     `background-image: url('assets/img/lockIcon.png');
    //     background-repeat: no-repeat;
    //     background-position: right;`
    //   );
    // }
  }

  refreshPage() {
    window.location.reload();
  }

  goToUpgade() {
    this.roter.navigate(["/main/settings"]);
    setTimeout(() => {
      this.mainService.goToPro.emit("");
    }, 300);
  }

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  getSelectedItem() {
    this.menuService.onItemClick().subscribe(data => {
      let menuItems = document.querySelector("nb-menu .menu-item>.menu-items")
        .children;
      for (const menu in menuItems) {
        setTimeout(() => {
          if(this.roter.url.includes('help')){
            this.helpPage = true;
          }
          for (const menu in menuItems) {
            if (!isNaN(+menu)) {
              if (
                this.roter.url.includes(
                  this.items[0].children[menu].link[0].split("/")[0]
                )
              ) {
                menuItems[menu].classList.add("active");
                this.helpPage = false;
              } else {
                menuItems[menu].classList.remove("active");
              }
            }
          }
        }, 200);
      }
    });
  }

  getToogleItem() {
    this.menuService.onSubmenuToggle().subscribe(menuBag => {
      if (menuBag.tag === "mainMenu") {
        this.showSearchBox = !this.showSearchBox;
      }
    });
  }

  async setBrand() {
    this.currentBrand = await localForage.getItem("currentBrand");

    if (this.currentBrand) {
      this.items[0].title = this.currentBrand.brand_name;
      let splitName = this.currentBrand.brand_name.split(' ');
      let myElement = document.getElementsByClassName(
        "icon-brand-menu"
      )[0] as HTMLElement;

      if(this.currentBrand.brand_logo){

        if(this.currentBrand.brand_logo.includes('https://scontent.xx.fbcdn')){
          for (var name in splitName){
            if(name > '1'){
              break
            }
            myElement.innerText = myElement.innerText + splitName[name][0]
            myElement.style.backgroundColor = '#2bbeea';

          }
        } else {
          myElement.style.backgroundImage = `url(${
            this.currentBrand.brand_logo
          })`;
          myElement.style.backgroundColor = 'transparent';
        }

      } else {

          for (var name in splitName){
            if(name > '1'){
              break
            }
            myElement.innerText = myElement.innerText + splitName[name][0]
          }

      }


    }
  }

  searchBrand() {
    this.filteredBrands = this.brands.filter(brand => {
      if (
        brand["brand_name"]
          .toLowerCase()
          .includes(this.searchBrandText.toLowerCase())
      ) {
        return true;
      }
    });
  }

  async changeBrand(brandId) {
    console.log(brandId);
    this.mainService.showLoader.emit(true);
    this.authService
      .updateUser(await localForage.getItem("userID"), { activeBrand: brandId })
      .subscribe(
        result => {
          if (result["success"]) {
            this.brandService.getBrandById(brandId).subscribe(
              async brand => {
                await localForage.setItem(
                  "currentBrand",
                  brand["brand"]
                );
                // this.setBrand();
                this.mainService.changeBrandBool = true;
                this.mainService.showLoader.emit(false);

                // window.location.reload();
                if (this.roter.url.includes("/main/dashboard")) {
                  window.location.reload();
                }
                this.roter.navigate(["/main/dashboard"]);
              },
              error => {
                this.mainService.showLoader.emit(false);
              }
            );
          }
        },
        err => {
          this.mainService.showLoader.emit(false);
        }
      );
    // this.setBrand()
  }

  async logout() {
    this.firebaseAuth.auth.signOut().then(async () => {
      await localForage.clear();
      await localForage.setItem('loggedOut', true);
      this.roter.navigate(['/master-admin']);
    });
  }

  getSVG(){
    var iconsElement = document.getElementsByClassName('icon-menu');
    for (let i = 0; i < iconsElement.length; i++) {
      if(iconsElement[i].className.includes('dashboard')){
        iconsElement[i].innerHTML = this.mainService.svgIcons.dashboard;
      } else if (iconsElement[i].className.includes('template')){
        iconsElement[i].innerHTML = this.mainService.svgIcons.template;
      } else if(iconsElement[i].className.includes('campaign')){
        iconsElement[i].innerHTML = this.mainService.svgIcons.campaign;
      } else if (iconsElement[i].className.includes('business')){
        iconsElement[i].innerHTML = this.mainService.svgIcons.walletscan;
      } else if (iconsElement[i].className.includes('insight')){
        iconsElement[i].innerHTML = this.mainService.svgIcons.insights;
      } else if (iconsElement[i].className.includes('audience')){
        iconsElement[i].innerHTML = this.mainService.svgIcons.subscribers;
      } else if (iconsElement[i].className.includes('pushnotification')){
        iconsElement[i].innerHTML = this.mainService.svgIcons.notification;
      } else if (iconsElement[i].className.includes('bots-store')){
        iconsElement[i].innerHTML = this.mainService.svgIcons.botstore;
      } else if (iconsElement[i].className.includes('settings')){
        iconsElement[i].innerHTML = this.mainService.svgIcons.settings;
      }
    }
  }
}
