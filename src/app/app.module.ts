import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from './banner/banner.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { RestaurantComponent } from './layout/restaurant/restaurant.component';
import { ProductComponent } from './layout/product/product.component';
import { DeliveryboysComponent } from './layout/deliveryboys/deliveryboys.component';
import { OrdersComponent } from './layout/orders/orders.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ReportComponent } from './layout/report/report.component';
import { OfflineMessageComponent } from './offline-message/offline-message.component';
import { CommonPageComponent } from './layout/common-page/common-page.component';
import { OnlyNumber } from './validations/OnlyNumber';
import { OnlyNumberWithDecimal } from './validations/OnlyNumberWithDecimal';
import {MatMenuModule} from '@angular/material/menu';
import { AllRestaurantComponent } from './layout/all-restaurant/all-restaurant.component';
import { PaginationComponent } from './pagination/pagination.component'
import { NgxSpinnerModule } from 'ngx-spinner';
import { ComplaintComponent } from './layout/complaint/complaint.component';
import { PartnerReportComponent } from './layout/partner-report/partner-report.component';
import { RiderReportComponent } from './layout/rider-report/rider-report.component';
import { WipComponent } from './wip/wip.component';
import { CustomerComponent } from './layout/customer/customer.component';
import { RevenueComponent } from './layout/revenue/revenue.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    BannerComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    RestaurantComponent,
    ProductComponent,
    DeliveryboysComponent,
    OrdersComponent,
    ReportComponent,
    OfflineMessageComponent,
    CommonPageComponent,
    OnlyNumber,
    OnlyNumberWithDecimal,
    AllRestaurantComponent,
    PaginationComponent,
    ComplaintComponent,
    PartnerReportComponent,
    RiderReportComponent,
    WipComponent,
    CustomerComponent,
    RevenueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatMenuModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
