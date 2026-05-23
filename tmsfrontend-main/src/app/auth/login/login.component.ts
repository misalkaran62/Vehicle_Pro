import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Toast } from 'src/app/services/sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logindata: FormGroup;
  errorMesseage: string = '';
  ispassvisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.logindata = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void { }

  login_submit() {
    if (this.logindata.valid) {
      // हा तुझा मूळ कोड आहे जो खऱ्या बॅकएंडला कॉल करतो
      this.authService.login(this.logindata.value).subscribe({
        next: (response: any) => {
          if (response.jwtToken) {
            sessionStorage.setItem('token', response.jwtToken); // टोकन सेव्ह करणे
            this.router.navigate(['/dashboard']);
            Toast.fire({
              icon: "success",
              title: "Login successful!"
            });
          } else {
            Toast.fire({
              icon: "error",
              title: response.message || "Login failed!"
            });
          }
        },
        error: (error: any) => {
          this.errorMesseage = "Invalid credentials";
          console.error("Login Error", error.error);
          Toast.fire({
            icon: "error",
            title: "Invalid Username or Password!"
          });
        }
      });
    } else {
      Toast.fire({
        icon: "warning",
        title: "Please enter valid details."
      });
    }
  }

  passtoggle() {
    this.ispassvisible = !this.ispassvisible;
  }
}