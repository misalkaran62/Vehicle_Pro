import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { DashboardDirective } from './dashboard.directive';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardNavbarComponent } from './dashboard-navbar/dashboard-navbar.component';
import { AsidebarComponent } from './asidebar/asidebar.component';
import { ChartModule } from 'primeng/chart';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'

import { MyInterceptorInterceptor } from './services/my-interceptor.interceptor';
import { SettingComponent } from './setting/setting.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TripComponent } from './vehicle/trip/trip/trip.component';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { ServicingComponent } from './servicing/servicing.component';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';




import { AddServicingComponent } from './add-servicing/add-servicing.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FeedbackComponent } from './feedback/feedback.component';
import { CreateServicngComponent } from './create-servicng/create-servicng.component';
import { ServicingPrintComponent } from './servicing-print/servicing-print.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ServicingListComponent } from './servicing-list/servicing-list.component';
import { AddPartComponent } from './add-part/add-part.component';
import { CreateVehiclePartComponent } from './create-vehicle-part/create-vehicle-part.component';
import { AddrouteComponent } from './vehicle/addroute/addroute.component';
import { DriverdetailsComponent } from './vehicle/driverdetails/driverdetails.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardDirective,
    DashboardComponent,
    DashboardNavbarComponent,
    AsidebarComponent,
    SettingComponent,
    ServicingComponent,
    AddServicingComponent,
    FeedbackComponent,
    CreateServicngComponent,
    ServicingPrintComponent,
    ChangePasswordComponent,
    UnauthorizedComponent,
      ServicingListComponent,
      AddPartComponent,
      CreateVehiclePartComponent,
    ServicingListComponent,
    
   
    


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule,
    ChartModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    NgxUiLoaderModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,

    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,


    NgxUiLoaderHttpModule.forRoot({
      showForeground: true
    }),
    BrowserAnimationsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatIconModule




  ],

  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: MyInterceptorInterceptor, multi: true },
  { provide: LocationStrategy, useClass: HashLocationStrategy },
  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
