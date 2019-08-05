import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { DashboardComponent } from "./main/dashboard/dashboard.component";
import { TemplatesComponent } from "./main/templates/templates.component";
import { LoginComponent } from "./auth/login/login.component";
import { AuthComponent } from "./auth/auth.component";
import { ForgetPassComponent } from "./auth/forget-pass/forget-pass.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
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
import { ProfileComponent } from "./main/profile/profile.component";
import { AudienceComponent } from "./main/audience/audience.component";
import { AuthGuard } from "./shared/services/guard/auth.guard";
import { PageGuard } from "./shared/services/guard/page.guard";
import { FbConnectComponent } from "./auth/fb-connect/fb-connect.component";
import { FbLoginComponent } from "./auth/fb-login/fb-login.component";
import { CampaignDetailsComponent } from "./main/campaign-main/campaign-details/campaign-details.component";
import { CampaignIntegrationComponent } from './main/campaign-main/campaign-integration/campaign-integration.component';
import { PagesComponent } from './main/pages/pages.component';
import { MarketersComponent } from './main/marketers/marketers.component';
import { CampaignTemplatesComponent } from './main/campaign-main/campaign-templates/campaign-templates.component';
import { CampaignTypeComponent } from './main/campaign-main/campaign-type/campaign-type.component';
import { DashboardInfoAdminComponent } from './main/dashboard-info-admin/dashboard-info-admin.component';
import { PushNotificationComponent } from './main/push-notification/push-notification.component';
import { HelpComponent } from './main/help/help.component';

const routes: Routes = [
  {
    path: "main",
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { breadcrumb: "" },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [PageGuard],
        data: { breadcrumb: "hiddenBreadcrumb" }
      },
      {
        path: "dashboard-info-admin",
        component: DashboardInfoAdminComponent,
        canActivate: [PageGuard],
        data: { breadcrumb: "hiddenBreadcrumb" }
      },
      {
        path: "bot-qr",
        component: BotQrComponent,
        data: { breadcrumb: "Chat Bot QR" }
      },
      {
        path: "push-notification",
        component: PushNotificationComponent,
        data: { breadcrumb: "Push Notification" }
      },
      {
        path: "settings",
        component: SettingsComponent,
        data: { breadcrumb: "settings" }
      },
      {
        path: "brands",
        component: PagesComponent,
        data: { breadcrumb: "brands" }
      },
      {
        path: "marketers",
        component: MarketersComponent,
        data: { breadcrumb: "marketers" }
      },
      {
        path: "templates",
        component: TemplatesComponent,
        data: { breadcrumb: "Templates" },
        children: [
          {
            path: '',
            redirectTo: 'walletly-cards',
            pathMatch: 'full'
          },
          {
            path: "create-cards",
            component: CreateCardsComponent,
          },
          {
            path: "create-coupon",
            component: CreateCouponsComponent,
            data: { breadcrumb: "Coupons" }
          },
          {
            path: "create-coupon/:id",
            component: CreateCouponsComponent,
            data: { breadcrumb: "Coupons" }
          },
          {
            path: "walletly-cards",
            component: WalletlyCardsComponent,
          }
        ]
      },
      {
        path: "create-templates",
        component: CampaignTemplatesComponent,
        data: { breadcrumb: "templates" }
      },
      {
        path: "campaign-type",
        component: CampaignTypeComponent,
        data: { breadcrumb: "campaign" }
      },
      {
        path: "campaign-main",
        component: TemplatesComponent,
        data: { breadcrumb: "campaign" },
        children: [
          {
            path: '',
            redirectTo: 'campaign',
            pathMatch: 'full'
          },
          {
            path: "details/:id",
            component: CampaignDetailsComponent,
            data: { breadcrumb: "Details" }
          },
          {
            path: "campaign",
            component: CampaingComponent,
          },
          {
            path: "create-campaign",
            component: CreateCampaingComponent,
            data: { breadcrumb: "Create" }
          },
          {
            path: "create-campaign/:id",
            component: CreateCampaingComponent,
            data: { breadcrumb: "Edit" }
          },
          {
            path: "review-campaign",
            component: ReviewCampaingComponent,
            data: { breadcrumb: "review" }
          },
          {
            path: "review-campaign/:id",
            component: ReviewCampaingComponent,
            data: { breadcrumb: "review" }
          },
          {
            path: "campaign-integration/:id",
            component: CampaignIntegrationComponent,
            data: { breadcrumb: "Integration" }
          }
        ]
      },
      {
        path: "business",
        component: BusinessComponent,
        data: { breadcrumb: "Business" },
        children: [
          {
            path: '',
            redirectTo: 'business-page',
            pathMatch: 'full'
          },
          {
            path: "business-page",
            component: BusinessPageComponent,
          },
          {
            path: "create-business",
            component: CreateBusinessComponent,
          },
          {
            path: "create-business/:id",
            component: CreateBusinessComponent,
          }
        ]
      },
      {
        path: "bots-store",
        component: BotsStoreComponent,
        data: { breadcrumb: "Bots Store" },
        children: [
          {
            path: '',
            redirectTo: 'bots-list',
            pathMatch: 'full'
          },
          {
            path: "bots-list",
            component: BotsListComponent,
          },
          {
            path: "bots-details",
            component: BotsDetailsComponent,
            data: { breadcrumb: "ManyChat" },
          }
        ]
      },
      {
        path: "audience",
        component: AudienceComponent,
        data: { breadcrumb: "audience" },
      },
      { path: "help", component: HelpComponent, data: { breadcrumb: "help" } },
    ]
  },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  // {
  //   path: "connect",
  //   component: ConnectPageComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: "auth",
  //   component: AuthComponent,
  //   children: [
  //     { path: 'sign-up', component: SignUpComponent },
  //     { path: 'forget-password', component: ForgetPassComponent },
  //     { path: 'reset-password', component: ResetPasswordComponent }
  //   ]
  // },
  { path: 'master-admin', component: LoginComponent },
  {
    path: "fb-connect",
    component: FbConnectComponent,
    canActivate: [AuthGuard, PageGuard]
  },
  { path: "fb-login", component: FbLoginComponent },
  { path: "", redirectTo: "main/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "main/dashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
