import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any;
  showAlert: boolean = false;
  ispassvisible: boolean = false;
  currentUser: any;
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private userapi: UserService,
    private authapi:AuthService
  ) { }
  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldpass: ['', [Validators.required, Validators.minLength(8), Validators.pattern('')]],
      newpass: ['', [Validators.required, Validators.minLength(8), Validators.pattern('')]],
    })
    
    
    this.userapi.findCurrentLoginUser().subscribe((res) => {
      console.log("current user", res);
      this.currentUser = res
      console.log("current user email", this.currentUser.email);
    })

  }
  changepass() {
   
    if (this.changePasswordForm.valid) {
      console.log("chjangew paess", this.changePasswordForm.value.oldpass);

this.authapi.changepassword(this.currentUser.email,this.changePasswordForm.value.oldpass,this.changePasswordForm.value.newpass).subscribe((res)=>{
console.log("kishori pawar",res);
Swal.fire({
  icon: 'success',
  title: 'Password Changed!',
  text: 'Your password has been updated successfully.',
  confirmButtonText: 'OK'
});

this.showAlert = true;

})


     
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please make sure all fields are filled out correctly.',
        confirmButtonText: 'Try Again'
      });
    }



  }
  passtoggle() {
    this.ispassvisible = !this.ispassvisible;
  }

}
