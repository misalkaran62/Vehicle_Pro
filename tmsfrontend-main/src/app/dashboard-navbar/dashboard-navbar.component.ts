import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.css']
})
export class DashboardNavbarComponent implements OnInit {
  constructor(
    private active: ActivatedRoute,
    private rout: Router
  ) { }
  async ngOnInit(): Promise<void> {
    // if(await this.rout.navigate(['/dashboard/vehicle/notification'])){
      
    // }

  }

  toggleClass() {
    let toggleCls = document.querySelector('.A')
    let mainclass = document.querySelector('.main-content')

    if (toggleCls) {
      toggleCls.classList.toggle('activetoggle')
    }
    if (mainclass) {
      mainclass.classList.toggle('mainsection')
    }
  }

  usertoggle() {
    let user = document.querySelector('.users')
    let img = document.querySelector('.emimg')
    let mainclass = document.querySelector('.main-contente-box')
    if (user) {
      user.classList.toggle('userlist')
    }
    if (img) {
      img.classList.toggle('timg')
    }
    if (mainclass) {
      mainclass.classList.toggle('mainuser')
    }

  }

  logout() {
    
    localStorage.removeItem('token')
    this.rout.navigate(['/auth'])

  }
}
