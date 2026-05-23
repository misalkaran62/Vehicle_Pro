// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// import { AuthModule } from './auth/auth.module';
// import { RegistrationComponent } from './auth/registration/registration.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { DashboardNavbarComponent } from './dashboard-navbar/dashboard-navbar.component';
// import { AsidebarComponent } from './asidebar/asidebar.component';
// import { IsLoginGuard } from './services/is-login.guard';
// import { SettingComponent } from './setting/setting.component';
// import { BranchComponent } from './vehicle/branch/branch.component';
// import { ServicingComponent } from './servicing/servicing.component';
// import { ViewbranchComponent } from './vehicle/viewbranch/viewbranch.component';
// import { ViewmoretripComponent } from './vehicle/viewmoretrip/viewmoretrip.component';
// import { AddServicingComponent } from './add-servicing/add-servicing.component';
// import { FeedbackComponent } from './feedback/feedback.component';
// import { CreateServicngComponent } from './create-servicng/create-servicng.component';
// import { ServicingPrintComponent } from './servicing-print/servicing-print.component';

// const routes: Routes = [

//   {
//     path: 'dashboard', component: AsidebarComponent, canActivate: [IsLoginGuard],
//     children: [
//       {
//         path: '', component: DashboardComponent,


//       },
//       {
//         path: 'vehicle',
//         loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule)
//       },
//       {
//         path: 'setting', component: SettingComponent,
//       }
//       ,
//       {
//         path: 'register/:id', component: RegistrationComponent, // <-- Register as child of dashboard
//       },
//       {
//         path: 'register', component: RegistrationComponent, // <-- Register as child of dashboard
//       },
//       {
//         path: 'newregister/:id', component: RegistrationComponent,
//       },
//       {
//         path: 'branch', component: BranchComponent
//       },
//       {
//         path: 'viewbranch', component: ViewbranchComponent
//       },

//       {
//         path: 'servicing', component: ServicingComponent
//       },
//       {
//         path: 'createservicng', component: CreateServicngComponent
//       },
//       {
//         path: 'addservicing', component: AddServicingComponent
//       },
//       {
//         path: 'updateservicing/:id', component: AddServicingComponent
//       },
//       {
//         path: 'feedback', component: FeedbackComponent
//       },
//       {
//         path: 'servicingPrint/:id', component: ServicingPrintComponent
//       },

//     ]
//   },
//   {
//     path: 'auth',
//     loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
//   },



// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import your components
import { RegistrationComponent } from './auth/registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AsidebarComponent } from './asidebar/asidebar.component';
import { IsLoginGuard } from './services/is-login.guard';
import { SettingComponent } from './setting/setting.component';
import { BranchComponent } from './vehicle/branch/branch.component';
import { ServicingComponent } from './servicing/servicing.component';
import { ViewbranchComponent } from './vehicle/viewbranch/viewbranch.component';
import { ViewmoretripComponent } from './vehicle/viewmoretrip/viewmoretrip.component';
import { AddServicingComponent } from './add-servicing/add-servicing.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { CreateServicngComponent } from './create-servicng/create-servicng.component';
import { ServicingPrintComponent } from './servicing-print/servicing-print.component';
import { RoleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ServicingListComponent } from './servicing-list/servicing-list.component';
import { AddPartComponent } from './add-part/add-part.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AsidebarComponent,
    canActivate: [IsLoginGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'vehicle',
        loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule),
        // canActivate: [RoleGuard],
        // data: { roles: [ 'RegionalManager', 'SUPERADMIN'] }, // Example roles
      },
      {
        path: 'setting',
        component: SettingComponent,
       
      },
      {
        path: 'register/:id',
        component: RegistrationComponent,
        canActivate: [RoleGuard],
        data: { roles: ['SUPERADMIN', 'RegionalManager'] }, // Example roles
      },
      {
        path: 'register',
        component: RegistrationComponent,
        canActivate: [RoleGuard],
        data: { roles: ['SUPERADMIN', 'Manager'] }, // Example roles
      },
      {
        path: 'newregister/:id',
        component: RegistrationComponent,
        canActivate: [RoleGuard],
        data: { roles: ['SUPERADMIN', 'Manager'] }, // Example roles
      },
      {
        path: 'branch',
        component: BranchComponent,
        canActivate: [RoleGuard],
        data: { roles: [ 'RegionalManager', 'SUPERADMIN'] },
      },
      {
        path: 'viewbranch',
        component: ViewbranchComponent,
        canActivate: [RoleGuard],
        data: { roles: [ 'RegionalManager', 'SUPERADMIN'] },
      },
      {
        path: 'servicing',
        component: ServicingComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
      },
      {
        path: 'createservicng',
        component: CreateServicngComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
      },
      {
        path: 'addservicing',
        component: AddServicingComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
      },
      {
        path: 'updateservicing/:id',
        component: AddServicingComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'RegionalManager', 'SUPERADMIN'] },
      },
      {
        path: 'changepass', component: ChangePasswordComponent
      },
      {
        path: 'servicingPrint/:id', component: ServicingPrintComponent
      },
      {
        path:'servicinglist/:id',component:ServicingListComponent
      },
      {
        path:'addpart',component:AddPartComponent
      },



    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
