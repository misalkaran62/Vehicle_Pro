import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Toast } from 'src/app/services/sweetalert';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent {
  forgotPasswordForm!: any;

  constructor(private fb: FormBuilder,private authservice:AuthService, private router:Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      console.log('Submitted email:', email);

      // Here, make an HTTP request to send the email to your backend.
      // Example:

      this.authservice.forgetPassword(email).subscribe((response:any)=>{
        Toast.fire({
          icon:"success",
          title:response.message
        })
        if(response.status){
          this.router.navigate(['/'])
        }
      })

    } else {
      console.log('Form is invalid');
    }
  }
}
