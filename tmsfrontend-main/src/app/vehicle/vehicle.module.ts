import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VehicleRoutingModule } from './vehicle-routing.module';

import { VehicleregisterComponent } from './vehicleregister/vehicleregister.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsuranceComponent } from './insurance/insurance.component';
import { NewinsuranceComponent } from './newinsurance/newinsurance.component';
import { NotificationComponent } from './notification/notification.component';
import { ViewdriverComponent } from './viewdriver/viewdriver.component';
import { DriverComponent } from './driver/driver.component';
import { NewnotificationComponent } from './newnotification/newnotification.component';
import { TripComponent } from './trip/trip/trip.component';
import { BranchComponent } from './branch/branch.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewtripsComponent } from './viewtrips/viewtrips.component';
import { RouteComponent } from './route/route.component';
import { ViewvehicleComponent } from './viewvehicle/viewvehicle.component';
import { ViewbranchComponent } from './viewbranch/viewbranch.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { ViewmorevehicleComponent } from './viewmorevehicle/viewmorevehicle.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ViewmoretripComponent } from './viewmoretrip/viewmoretrip.component';
import { MatIconModule } from '@angular/material/icon';
import { UpdatevehicleComponent } from './updatevehicle/updatevehicle.component';
import { MatMenuModule } from '@angular/material/menu';
import { AddDocumentDialogComponent } from './add-document-dialog/add-document-dialog.component';
import { UpdateDocumentDialogComponent } from './update-document-dialog/update-document-dialog.component';
import { ViewdocumentComponent } from './viewdocument/viewdocument.component';
import { SafePipe } from './pipe/safe.pipe';
import { UpdatetripComponent } from './updatetrip/updatetrip.component';

import { UpdatetripendandstartkmComponent } from './updatetripendandstartkm/updatetripendandstartkm.component';
import { ViewrouteComponent } from './viewroute/viewroute.component';
import { AddrouteComponent } from './addroute/addroute.component';
import { DriverdetailsComponent } from './driverdetails/driverdetails.component';
import { UpdaterouteComponent } from './updateroute/updateroute.component';





@NgModule({
  declarations: [
    VehicleregisterComponent,
    InsuranceComponent,
    NewinsuranceComponent,
    DriverComponent,
    ViewdriverComponent,
    NotificationComponent,
    TripComponent,
    BranchComponent,
    NewnotificationComponent,
    ViewtripsComponent,
    RouteComponent,
    ViewvehicleComponent,
    ViewbranchComponent,
    ViewuserComponent,
    ViewmorevehicleComponent,
    ViewmoretripComponent,
    UpdatevehicleComponent,
    AddDocumentDialogComponent,
    UpdateDocumentDialogComponent,
    ViewdocumentComponent,
    SafePipe,
    UpdatetripComponent,
  
    UpdatetripendandstartkmComponent,
    ViewrouteComponent,
    AddrouteComponent,
    DriverdetailsComponent,
    UpdaterouteComponent



  ],
  imports: [
    CommonModule,
    RouterModule,
    VehicleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatDatepickerModule,
    MatIconModule,
    MatMenuModule



  ]
})
export class VehicleModule { }
