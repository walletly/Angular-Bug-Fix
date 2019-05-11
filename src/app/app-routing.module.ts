import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { TemplatesComponent } from './main/templates/templates.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ConnectPageComponent } from './main/connect-page/connect-page.component';
import { CampaingComponent } from './main/campaign-main/campaing/campaing.component';
import { CreateCampaingComponent } from './main/campaign-main/create-campaing/create-campaing.component';
import { CreateCardsComponent } from './main/templates/create-cards/create-cards.component';
import { CreateCouponsComponent } from './main/templates/create-coupons/create-coupons.component';
import { ReviewCampaingComponent } from './main/campaign-main/review-campaing/review-campaing.component';
import { WalletlyCardsComponent } from './main/templates/walletly-cards/walletly-cards.component';
import { BusinessComponent } from './main/business/business.component';
import { BusinessPageComponent } from './main/business/business-page/business-page.component';
import { CreateBusinessComponent } from './main/business/create-business/create-business.component';
import { BotsStoreComponent } from './main/bots-store/bots-store.component';
import { BotsListComponent } from './main/bots-store/bots-list/bots-list.component';
import { BotsDetailsComponent } from './main/bots-store/bots-details/bots-details.component';
import { BotQrComponent } from './main/bot-qr/bot-qr.component';
import { SettingsComponent } from './main/settings/settings.component';
import { DashboardInfoComponent } from './main/dashboard-info/dashboard-info.component';
import { ProfileComponent } from './main/profile/profile.component';
import { AudienceComponent } from './main/audience/audience.component';
import { AuthGuard } from './shared/services/guard/auth.guard';
import { ForgetPassComponent } from './auth/forget-pass/forget-pass.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'dashboard-info', component: DashboardInfoComponent, canActivate: [AuthGuard] },
      { path: 'bot-qr', component: BotQrComponent, canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
      {
        path: 'templates',
        component: TemplatesComponent,
        children: [
          { path: 'create-cards', component: CreateCardsComponent, canActivate: [AuthGuard] },
          { path: 'create-coupon', component: CreateCouponsComponent, canActivate: [AuthGuard] },
          { path: 'create-coupon/:id', component: CreateCouponsComponent, canActivate: [AuthGuard] },
          { path: 'walletly-cards', component: WalletlyCardsComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'campaign-main',
        component: TemplatesComponent,
        children: [
          { path: 'campaign', component: CampaingComponent, canActivate: [AuthGuard] },
          { path: 'create-campaign', component: CreateCampaingComponent, canActivate: [AuthGuard] },
          { path: 'review-campaing', component: ReviewCampaingComponent, canActivate: [AuthGuard] },
        ]
      },
      {
        path: 'business',
        component: BusinessComponent,
        children: [
          { path: 'business-page', component: BusinessPageComponent, canActivate: [AuthGuard] },
          { path: 'create-business', component: CreateBusinessComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'bots-store',
        component: BotsStoreComponent,
        children: [
          { path: 'bots-list', component: BotsListComponent, canActivate: [AuthGuard] },
          { path: 'bots-details', component: BotsDetailsComponent, canActivate: [AuthGuard] }
        ]
      },
      { path: 'audience', component: AudienceComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'connect', component: ConnectPageComponent, canActivate: [AuthGuard] },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forget-password', component: ForgetPassComponent },
      { path: 'reset-password', component: ResetPasswordComponent }
    ]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'main', redirectTo: 'main/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
