import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-templates",
  templateUrl: "./templates.component.html",
  styleUrls: ["./templates.component.scss"]
})
export class TemplatesComponent implements OnInit {
  constructor(private router: Router) {
    if (router.url === "/main/templates") {
      router.navigate(["/main/templates/walletly-cards"]);
    }
  }

  ngOnInit() {}
}
