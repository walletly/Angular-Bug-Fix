import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbButtonModule, NbSidebarModule, NbMenuModule, NbInputModule, NbCardModule, NbAccordionModule, NbCheckboxModule, NbStepperModule, NbTooltipModule, NbTabsetModule, NbTreeGridModule, NbSelectModule, NbCalendarModule, NbAlertModule, NbRadioModule, NbCalendarRangeModule, NbDialogModule } from '@nebular/theme';
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
import { CampaignMainComponent } from './main/campaign-main/campaign-main.component';
import { ProfileComponent } from './main/profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogUploadImageComponent } from './shared/components/dialog-upload-image/dialog-upload-image.component';
import { AudienceComponent } from './main/audience/audience.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/services/guard/auth.guard';
import { ForgetPassComponent } from './auth/forget-pass/forget-pass.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DialogUpgradeComponent } from './shared/components/dialog-upgrade/dialog-upgrade.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FbConnectComponent } from './auth/fb-connect/fb-connect.component';
import { FbLoginComponent } from './auth/fb-login/fb-login.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrComponent } from './shared/components/toastr/toastr.component';
import { CampaignDetailsComponent } from './main/campaign-main/campaign-details/campaign-details.component';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrSuccessComponent } from './shared/components/toastr-success/toastr-success.component';
import { BreadcrumbModule } from 'angular-crumbs';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ModalMemberComponent } from './shared/components/modal-member/modal-member.component';
import { PagesComponent } from './main/pages/pages.component';
import { MarketersComponent } from './main/marketers/marketers.component';
import { CampaignTypeComponent } from './main/campaign-main/campaign-type/campaign-type.component';
import { CampaignTemplatesComponent } from './main/campaign-main/campaign-templates/campaign-templates.component';
import { DashboardInfoAdminComponent } from './main/dashboard-info-admin/dashboard-info-admin.component';
import { PushNotificationComponent } from './main/push-notification/push-notification.component';
import { HelpComponent } from './main/help/help.component';
import { CampaignIntegrationComponent } from './main/campaign-main/campaign-integration/campaign-integration.component';

export const firebaseConfig = {
  apiKey: "AIzaSyB_f_r3DPfN5tZ6x0olJaGCjSogT9rWapM",
  authDomain: "walletly-dev3.firebaseapp.com",
  databaseURL: "https://walletly-dev3.firebaseio.com",
  projectId: "walletly-dev3",
  storageBucket: "walletly-dev3.appspot.com",
  messagingSenderId: "1044334423585",
  appId: "1:1044334423585:web:a2ed86cb0ba66c34"

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
    CampaignMainComponent,
    ProfileComponent,
    DialogUploadImageComponent,
    AudienceComponent,
    ForgetPassComponent,
    ResetPasswordComponent,
    DialogUpgradeComponent,
    FbLoginComponent,
    FbConnectComponent,
    ToastrComponent,
    CampaignDetailsComponent,
    ToastrSuccessComponent,
    BreadcrumbComponent,
    ModalMemberComponent,
    PagesComponent,
    MarketersComponent,
    CampaignTypeComponent,
    CampaignTemplatesComponent,
    DashboardInfoAdminComponent,
    PushNotificationComponent,
    HelpComponent,
    CampaignIntegrationComponent,
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
    AngularFireAuthModule,
    ImageCropperModule,
    AngularFireDatabaseModule,
    NgxMaskModule.forRoot(),
    BreadcrumbModule,
    NbCalendarRangeModule,
    NbDialogModule.forRoot(),
  ],
  providers: [
    AuthService,
    AuthGuard,
    AngularFirestore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
