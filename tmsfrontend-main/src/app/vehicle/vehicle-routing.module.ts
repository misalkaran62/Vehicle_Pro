import { ViewdriverComponent } from './viewdriver/viewdriver.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleregisterComponent } from './vehicleregister/vehicleregister.component';
import { ViewvehicleComponent } from './viewvehicle/viewvehicle.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { NewinsuranceComponent } from './newinsurance/newinsurance.component';
import { NotificationComponent } from './notification/notification.component';
import { DriverComponent } from './driver/driver.component';
import { NewnotificationComponent } from './newnotification/newnotification.component';
import { TripComponent } from './trip/trip/trip.component';
import { BranchComponent } from './branch/branch.component';
import { ViewtripsComponent } from './viewtrips/viewtrips.component';
import { RouteComponent } from './route/route.component';
import { ViewbranchComponent } from './viewbranch/viewbranch.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ViewmoretripComponent } from './viewmoretrip/viewmoretrip.component';
import { ViewmorevehicleComponent } from './viewmorevehicle/viewmorevehicle.component';
import { RoleGuard } from '../guards/role.guard';
import { DriverdetailsComponent } from './driverdetails/driverdetails.component';
import { ViewrouteComponent } from './viewroute/viewroute.component';


const routes: Routes = [
  {
    path: '', component: VehicleregisterComponent,
    canActivate: [RoleGuard],
    data: { roles: ['SUPERADMIN'] },
  },
  {
    path: 'updatevehicle/:id', component: VehicleregisterComponent,
    canActivate: [RoleGuard],
    data: { roles: ['SUPERADMIN'] },
  },
  {
    path: 'viewuser', component: ViewuserComponent,
    canActivate: [RoleGuard],
    data: { roles: ['RegionalManager', 'SUPERADMIN'] },
  },
  {
    path: 'view-vehicle', component: ViewvehicleComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
  },
  {
    path: 'insurance', component: InsuranceComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },

  },
  {
    path: 'updateinsurance/:id', component: NewinsuranceComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
  },
  {
    path: 'newinsurance', component: NewinsuranceComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
  },
  {
    path: 'driver', component: DriverComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
  },
  {
    path: 'updateUser/:id', component: RegistrationComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'SUPERADMIN'] },
  },

  {
    path: 'trip', component: TripComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'SUPERADMIN'] },
  },
  {
    path: 'updateTrip/:id', component: TripComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'SUPERADMIN'] },
  },
  {
    path: 'notification', component: NotificationComponent,
    // canActivate:[RoleGuard],
    // data: { roles: ['Manager','SUPERADMIN'] },
  },
  {
    path: 'newno', component: NewnotificationComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'SUPERADMIN'] },
  },
  {
    path: 'viewtrips', component: ViewtripsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Driver', 'Manager', 'RegionalManager', 'SUPERADMIN'] },
  },
  {
    path: 'route', component: RouteComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'SUPERADMIN'] },
  },
  {
    path: 'viewdriver', component: ViewdriverComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
  },
  {
    path: 'driverdetails/:id', component: DriverdetailsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'SUPERADMIN'] }
  },
  {
    path: 'updatebranch/:id', component: BranchComponent,
    canActivate: [RoleGuard],
    data: { roles: ['SUPERADMIN'] },
  },
  {
    path: 'viewmorevehicle/:id', component: ViewmorevehicleComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
  },
  {
    path: 'viewmoretrip/:id', component: ViewmoretripComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
  },
  // {
  //   path: 'dashboard/vehicle/viewtrips', component: ViewtripsComponent,
  //   canActivate: [RoleGuard],
  //   data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
  // },
  {
    path: 'viewroute', component: ViewrouteComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Manager','SUPERADMIN'] },
  }






];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
