import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbButtonModule, NbSidebarModule, NbMenuModule, NbInputModule, NbCardModule, NbAccordionModule, NbCheckboxModule, NbStepperModule, NbTooltipModule, NbTabsetModule, NbTreeGridModule, NbSelectModule, NbCalendarModule, NbAlertModule, NbRadioModule } from '@nebular/theme';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { TemplatesComponent } from './main/templates/templates.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthComponent } from './auth/auth.component';
import { ConnectPageComponent } from './main/connect-page/connect-page.component';
import { ClipboardModule } from 'ngx-clipboard';
import { WalletlyCardsComponent } from './main/templates/walletly-cards/walletly-cards.component';
import { CreateCardsComponent } from './main/templates/create-cards/create-cards.component';
import { CreateCouponsComponent } from './main/templates/create-coupons/create-coupons.component';
import { CreateCampaingComponent } from './main/campaign-main/create-campaing/create-campaing.component';
import { ReviewCampaingComponent } from './main/campaign-main/review-campaing/review-campaing.component';
import { CampaingComponent } from './main/campaign-main/campaing/campaing.component';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { BusinessComponent } from './main/business/business.component';
import { BusinessPageComponent } from './main/business/business-page/business-page.component';
import { CreateBusinessComponent } from './main/business/create-business/create-business.component';
import { BotsStoreComponent } from './main/bots-store/bots-store.component';
import { BotsListComponent } from './main/bots-store/bots-list/bots-list.component';
import { BotsDetailsComponent } from './main/bots-store/bots-details/bots-details.component';
import { BotQrComponent } from './main/bot-qr/bot-qr.component';
import { SettingsComponent } from './main/settings/settings.component';
import { DashboardInfoComponent } from './main/dashboard-info/dashboard-info.component';
import { CampaignMainComponent } from './main/campaign-main/campaign-main.component';
import { ProfileComponent } from './main/profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogUploadImageComponent } from './shared/components/dialog-upload-image/dialog-upload-image.component';
import { AudienceComponent } from './main/audience/audience.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard} from './shared/services/guard/auth.guard';
import { ForgetPassComponent } from './auth/forget-pass/forget-pass.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

export const firebaseConfig = {
  apiKey: "AIzaSyC04TYllR0_M31tvfnPE2vKPcABKVBo-XU",
  authDomain: "walletly-brands.firebaseapp.com",
  databaseURL: "https://walletly-brands.firebaseio.com",
  projectId: "walletly-brands",
  storageBucket: "walletly-brands.appspot.com",
  messagingSenderId: "995578197270",
  appId: "1:995578197270:web:52fc6c6c3506cef5"
};

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    TemplatesComponent,
    LoginComponent,
    SignUpComponent,
    AuthComponent,
    ConnectPageComponent,
    WalletlyCardsComponent,
    CreateCardsComponent,
    CreateCouponsComponent,
    CreateCampaingComponent,
    ReviewCampaingComponent,
    CampaingComponent,
    ClickOutsideDirective,
    BusinessComponent,
    BusinessPageComponent,
    CreateBusinessComponent,
    BotsStoreComponent,
    BotsListComponent,
    BotsDetailsComponent,
    BotQrComponent,
    SettingsComponent,
    DashboardInfoComponent,
    CampaignMainComponent,
    ProfileComponent,
    DialogUploadImageComponent,
    AudienceComponent,
    ForgetPassComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbLayoutModule,
    NbButtonModule,
    NbInputModule,
    NbCardModule,
    NbAccordionModule,
    FormsModule,
    NbCheckboxModule,
    NbStepperModule,
    NbTooltipModule,
    ClipboardModule,
    NbTabsetModule,
    NbTreeGridModule,
    NbSelectModule,
    NbCalendarModule,
    NbRadioModule,
    NbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
