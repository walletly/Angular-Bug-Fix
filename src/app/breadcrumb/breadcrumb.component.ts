import { Component, OnInit, Input } from "@angular/core";
import * as localForage from 'localforage';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  Params,
  PRIMARY_OUTLET
} from "@angular/router";

interface IBreadcrumb {
  label: string;
  params?: Params;
  url: string;
}

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"]
})
export class BreadcrumbComponent implements OnInit {
  @Input() name;

  public breadcrumbs: IBreadcrumb[];

  currentBrand;
  currentUser;
  brand;

  show;
  userAdmin;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.breadcrumbs = [];
  }

  async ngOnInit() {
    this.currentUser = await localForage.getItem("user");
    if (this.currentUser.user_type === 4) {
      this.userAdmin = true;
    } else {
      this.userAdmin = false;
    }
    this.currentBrand = await localForage.getItem('currentBrand');
    this.brand = this.currentBrand ? this.currentBrand.brand_name : '';
    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";
    let root: ActivatedRoute = this.activatedRoute.root;
    this.breadcrumbs = this.getBreadcrumbs(root);
    this.hideBreadCrumps();
    //subscribe to the NavigationEnd event
    this.router.events.subscribe(event => {
      this.breadcrumbs = this.getBreadcrumbs(root);
      this.hideBreadCrumps();
      console.log(this.breadcrumbs);
    });
  }

  hideBreadCrumps() {
    this.breadcrumbs.forEach(element => {
      if (element.label === "hiddenBreadcrumb") {
        this.show = false;
      } else {
        this.show = true;
      }
    });
  }

  private getBreadcrumbs(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: IBreadcrumb[] = []
  ): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

    //get the child routes
    let children: ActivatedRoute[] = route.children;

    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      //get the route's URL segment
      let routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join("/");

      //append route URL to URL
      url += `/${routeURL}`;

      //add breadcrumb
      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    //we should never get here, but just in case
    return breadcrumbs;
  }
}
