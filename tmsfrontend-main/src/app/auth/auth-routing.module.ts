import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { IsnotloginGuard } from '../services/isnotlogin.guard';


const routes: Routes = [
  {
    path:"", component:LoginComponent ,canActivate:[IsnotloginGuard]
  },
  {
    path:"register",component:RegistrationComponent
  },
 
  {
    path:"forgot",component:ForgetpasswordComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
