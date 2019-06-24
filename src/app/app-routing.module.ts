import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { DashboardComponent } from "./main/dashboard/dashboard.component";
import { TemplatesComponent } from "./main/templates/templates.component";
import { AuthComponent } from "./auth/auth.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { ConnectPageComponent } from "./main/connect-page/connect-page.component";
import { CampaingComponent } from "./main/campaign-main/campaing/campaing.component";
import { CreateCampaingComponent } from "./main/campaign-main/create-campaing/create-campaing.component";
import { CreateCardsComponent } from "./main/templates/create-cards/create-cards.component";
import { CreateCouponsComponent } from "./main/templates/create-coupons/create-coupons.component";
import { ReviewCampaingComponent } from "./main/campaign-main/review-campaing/review-campaing.component";
import { WalletlyCardsComponent } from "./main/templates/walletly-cards/walletly-cards.component";
import { BusinessComponent } from "./main/business/business.component";
import { BusinessPageComponent } from "./main/business/business-page/business-page.component";
import { CreateBusinessComponent } from "./main/business/create-business/create-business.component";
import { BotsStoreComponent } from "./main/bots-store/bots-store.component";
import { BotsListComponent } from "./main/bots-store/bots-list/bots-list.component";
import { BotsDetailsComponent } from "./main/bots-store/bots-details/bots-details.component";
import { BotQrComponent } from "./main/bot-qr/bot-qr.component";
import { SettingsComponent } from "./main/settings/settings.component";
import { DashboardInfoComponent } from "./main/dashboard-info/dashboard-info.component";
import { ProfileComponent } from "./main/profile/profile.component";
import { AudienceComponent } from "./main/audience/audience.component";
import { AuthGuard } from "./shared/services/guard/auth.guard";
import { ForgetPassComponent } from "./auth/forget-pass/forget-pass.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { FbConnectComponent } from "./auth/fb-connect/fb-connect.component";
import { FbLoginComponent } from "./auth/fb-login/fb-login.component";
import { CampaignDetailsComponent } from "./main/campaign-main/campaign-details/campaign-details.component";
import { PagesComponent } from './main/pages/pages.component';
import { MarketersComponent } from './main/marketers/marketers.component';
import { CampaignTemplatesComponent } from './main/campaign-main/campaign-templates/campaign-templates.component';
import { CampaignTypeComponent } from './main/campaign-main/campaign-type/campaign-type.component';
import { DashboardInfoAdminComponent } from './main/dashboard-info-admin/dashboard-info-admin.component';
import { PushNotificationComponent } from './main/push-notification/push-notification.component';

const routes: Routes = [
  {
    path: "main",
    component: MainComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "" },
    children: [
      {
        path: "dashboard",
        // component: DashboardComponent,
        component: DashboardInfoComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "hiddenBreadcrumb" }
      },
      {
        path: "dashboard-info",
        component: DashboardInfoComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "hiddenBreadcrumb" }
      },
      {
        path: "dashboard-info-admin",
        component: DashboardInfoAdminComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "hiddenBreadcrumb" }
      },
      {
        path: "bot-qr",
        component: BotQrComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "Chat Bot QR" }
      },
      {
        path: "push-notification",
        component: PushNotificationComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "Push Notification" }
      },
      {
        path: "settings",
        component: SettingsComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "settings" }
      },
      {
        path: "pages",
        component: PagesComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "pages" }
      },
      {
        path: "marketers",
        component: MarketersComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "marketers" }
      },
      {
        path: "templates",
        component: TemplatesComponent,
        data: { breadcrumb: "Templates" },
        children: [
          {
            path: "create-cards",
            component: CreateCardsComponent,
            canActivate: [AuthGuard]
          },
          {
            path: "create-coupon",
            component: CreateCouponsComponent,
            canActivate: [AuthGuard],
            data: { breadcrumb: "Coupons" }
          },
          {
            path: "create-coupon/:id",
            component: CreateCouponsComponent,
            canActivate: [AuthGuard],
            data: { breadcrumb: "Coupons" }
          },
          {
            path: "walletly-cards",
            component: WalletlyCardsComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: "campaign-templates",
        component: CampaignTemplatesComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "templates" }
      },
      {
        path: "campaign-type",
        component: CampaignTypeComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "campaign" }
      },
      {
        path: "campaign-main",
        component: TemplatesComponent,
        data: { breadcrumb: "campaign" },
        children: [
          {
            path: "details/:id",
            component: CampaignDetailsComponent,
            canActivate: [AuthGuard],
            data: { breadcrumb: "Details" }
          },
          {
            path: "campaign",
            component: CampaingComponent,
            canActivate: [AuthGuard]
          },
          {
            path: "create-campaign",
            component: CreateCampaingComponent,
            canActivate: [AuthGuard],
            data: { breadcrumb: "Create" }
          },
          {
            path: "create-campaign/:id",
            component: CreateCampaingComponent,
            canActivate: [AuthGuard],
            data: { breadcrumb: "Edit" }
          },
          {
            path: "review-campaign",
            component: ReviewCampaingComponent,
            canActivate: [AuthGuard],
            data: { breadcrumb: "review" }
          },
          {
            path: "review-campaign/:id",
            component: ReviewCampaingComponent,
            canActivate: [AuthGuard],
            data: { breadcrumb: "review" }
          }
        ]
      },
      {
        path: "business",
        component: BusinessComponent,
        data: { breadcrumb: "Business" },
        children: [
          {
            path: "business-page",
            component: BusinessPageComponent,
            canActivate: [AuthGuard]
          },
          {
            path: "create-business",
            component: CreateBusinessComponent,
            canActivate: [AuthGuard]
          },
          {
            path: "create-business/:id",
            component: CreateBusinessComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: "bots-store",
        component: BotsStoreComponent,
        data: { breadcrumb: "Bots Store" },
        children: [
          {
            path: "bots-list",
            component: BotsListComponent,
            canActivate: [AuthGuard],
          },
          {
            path: "bots-details",
            component: BotsDetailsComponent,
            canActivate: [AuthGuard],
            data: { breadcrumb: "ManyChat" },
          }
        ]
      },
      {
        path: "audience",
        component: AudienceComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: "audience" },
      }
    ]
  },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: "connect",
    component: ConnectPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "auth",
    component: AuthComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "sign-up", component: SignUpComponent },
      { path: "forget-password", component: ForgetPassComponent },
      { path: "reset-password", component: ResetPasswordComponent }
    ]
  },
  {
    path: "fb-connect",
    component: FbConnectComponent,
    canActivate: [AuthGuard]
  },
  { path: "fb-login", component: FbLoginComponent },
  { path: "", redirectTo: "main/dashboard", pathMatch: "full" },
  { path: "main", redirectTo: "main/dashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
