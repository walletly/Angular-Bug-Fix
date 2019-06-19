import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NbSidebarService, NbMenuItem } from "@nebular/theme";
import { NbMenuService } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { MainService } from "../shared/services/main.service";
import { BrandService } from "../shared/services/brand.service";
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  @ViewChild("menu") menu;
  @Input() menuItem = <NbMenuItem>null;

  headerTitle;
  avatar;

  items = [
    {
      icon: "icon-menu test-sunny icon-brand-menu",
      title: "SunnyMeats",
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
          icon: "icon-menu pages",
          title: "Pages",
          link: ["pages"]
        },
        {
          icon: "icon-menu marketers",
          title: "Marketers",
          link: ["marketers"]
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
          title: "Business",
          link: ["business/business-page"]
        },
        {
          icon: "icon-menu bots-store",
          title: "Bots Store",
          link: ["bots-store/bots-list"]
        },
        {
          icon: "icon-menu audience",
          title: "Audience",
          link: ["audience"]
        },
        {
          icon: "icon-menu qr",
          title: "Chat Bot QR",
          link: ["bot-qr"]
        },
        {
          icon: "icon-menu settings",
          title: "Settings",
          link: ["settings"]
        }
      ]
    }
  ];

  brandName;

  selectedItem;
  showSearchBox = false;

  user;
  username;

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
    private authService: AuthService
  ) {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.username = {
      firstName: this.user["firstname"],
      lastName: this.user["lastname"]
    };
    setTimeout(() => {
      this.mainService.showLoader.subscribe(event => {
        this.showLoader = event;
      });
    }, 200);

    setTimeout(() => {
      if (localStorage.getItem("currentBrand")) {
        this.setBrand();
      }
    }, 200);

    this.avatar = JSON.parse(localStorage.getItem("user"))["avatar"];
    console.log(this.avatar);

    this.getSelectedItem();
    this.brandService
      .getUsersBrands(localStorage.getItem("userID"))
      .subscribe(result => {
        console.log(result);
        this.brands = result["data"]["brands"];
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
      } else if (crumps[2] === "dashboard-info") {
        crumpValue2 = "";
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
      } else if (this.roter.url === "/main/dashboard-info") {
        this.headerTitle = `Welcome back ${this.username.firstName} ${
          this.username.lastName
        }`;
        this.brandName = null;
      } else {
        if ((this.roter.url.split("/").length = 3)) {
          const currentBrand = JSON.parse(localStorage.getItem("currentBrand"));
          if (currentBrand) {
            this.brandName = currentBrand["brand_name"] + " >" + " ";
          }
          this.headerTitle = crumpValue1;
        }
        if ((this.roter.url.split("/").length = 4)) {
          const currentBrand = JSON.parse(localStorage.getItem("currentBrand"));
          if (currentBrand) {
            this.brandName = currentBrand["brand_name"] + " >" + " ";
          }
          this.headerTitle = crumpValue1 + crumpValue2;
        }
      }
    });
  }

  ngOnInit() {
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
      for (const menu in menuItems) {
        if (!isNaN(+menu)) {
          if (
            this.roter.url.includes(
              this.items[0].children[menu].link[0].split("/")[0]
            )
          ) {
            menuItems[menu].classList.add("active");
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
        for (const menu in menuItems) {
          if (!isNaN(+menu)) {
            if (
              this.roter.url.includes(
                this.items[0].children[menu].link[0].split("/")[0]
              )
            ) {
              menuItems[menu].classList.add("active");
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
          for (const menu in menuItems) {
            if (!isNaN(+menu)) {
              if (
                this.roter.url.includes(
                  this.items[0].children[menu].link[0].split("/")[0]
                )
              ) {
                menuItems[menu].classList.add("active");
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

  setBrand() {
    if (localStorage.getItem("currentBrand")) {
      console.log(JSON.parse(localStorage.getItem("currentBrand")));
      this.items[0].title = JSON.parse(localStorage.getItem("currentBrand"))[
        "brand_name"
      ];
      let myElement = document.getElementsByClassName(
        "icon-brand-menu"
      )[0] as HTMLElement;
      myElement.style.backgroundImage = `url(${
        JSON.parse(localStorage.getItem("currentBrand"))["brand_logo"]
      })`;
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

  changeBrand(brandId) {
    console.log(brandId);
    this.mainService.showLoader.emit(true);
    this.authService
      .updateUser(localStorage.getItem("userID"), { activeBrand: brandId })
      .subscribe(
        result => {
          if (result["success"]) {
            this.brandService.getBrandById(brandId).subscribe(
              brand => {
                localStorage.setItem(
                  "currentBrand",
                  JSON.stringify(brand["brand"])
                );
                // this.setBrand();
                this.mainService.changeBrandBool = true;
                this.mainService.showLoader.emit(false);

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
}
