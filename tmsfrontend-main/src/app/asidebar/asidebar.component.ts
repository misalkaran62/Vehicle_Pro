import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { BranchService } from '../services/branch.service';
import Swal from 'sweetalert2';
import { Toast } from '../services/sweetalert';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-asidebar',
  templateUrl: './asidebar.component.html',
  styleUrls: ['./asidebar.component.css']
})
export class AsidebarComponent implements OnInit, AfterViewInit {
  
  id: any
  isSidebarOpen: any;
  data: any;
  currentUser: any;
  isSuperAdmin: boolean = false;  // Flag to check if the user is SUPERADMIN
  notificationCount: any;
  private allSideMenu!: NodeListOf<HTMLAnchorElement>;
  private menuBar!: HTMLElement | null;
  private sidebar!: HTMLElement | null;
  private upper!: HTMLElement | null;
  private sidebox!: HTMLElement | null;
  private searchButton!: HTMLButtonElement | null;
  private searchButtonIcon!: HTMLElement | null;
  private searchForm!: HTMLFormElement | null;
  private searchMainForm!: HTMLFormElement | null;


  constructor(
    private router: Router,
    private api: BranchService,
    private active: ActivatedRoute,
    private notificationService:NotificationService,
 
    private userService: UserService
  ) { }

  ngOnInit(): void {
    console.log("Asidebar ngonit");
    this.fetchNotification();
    this.findCurrerntUserProfile();
    this.setupMenuClick();
    
  }

  ngAfterViewInit(): void {
    this.allSideMenu = document.querySelectorAll('#sidebar .side-menu li .side1');
    this.menuBar = document.querySelector('#content nav .fa.fa-bars');
    this.sidebar = document.getElementById('sidebar');
    this.sidebox = document.getElementById('sidebox');
    this.searchButton = document.querySelector('#content nav form .form-input button');
    this.searchButtonIcon = document.querySelector('#content nav form .form-input button .fa');
    this.searchForm = document.querySelector('#content nav form');
    this.searchMainForm = document.querySelector('#content');
    this.upper = document.querySelector('.upper-text');
    this.init();
  }

  private init(): void {
    this.setupMenuClick();
    this.setupSidebarToggle();
    this.handleWindowResize();
    this.setupSearchButton();
  }

  private setupMenuClick(): void {
    const activeMenuKey = 'activeMenu';
    const savedActiveMenu = localStorage.getItem(activeMenuKey);
    this.allSideMenu.forEach((item) => {
      const li = item.parentElement;
      if (li && li.getAttribute('routerLink') === savedActiveMenu) {
        li.classList.add('active');
      }

      item.addEventListener('click', () => {
        this.allSideMenu.forEach((i) => i.parentElement?.classList.remove('active'));
        li?.classList.add('active');
        localStorage.setItem(activeMenuKey, li?.getAttribute('routerLink') || '');
      });
    });
  }

  private setupSidebarToggle(): void {
    this.menuBar?.addEventListener('click', () => {
      this.sidebar?.classList.toggle('hide');
      this.sidebar?.classList.toggle('responsive-side');
      this.upper?.classList.toggle('pad');
      this.searchMainForm?.classList.toggle('activeHide');
      this.searchMainForm?.classList.toggle('return-side');
    });
  }

  private handleWindowResize(): void {
    if (window.innerWidth < 768) {
      this.sidebar?.classList.add('hide');
    }
  }

  private setupSearchButton(): void {
    this.searchButton?.addEventListener('click', (e: MouseEvent) => {
      if (window.innerWidth < 576) {
        e.preventDefault();
        const isFormVisible = this.searchForm?.classList.toggle('show') ?? false;
        if (isFormVisible) {
          this.searchButtonIcon?.classList.replace('fa-search', 'fa-x');
        } else {
          this.searchButtonIcon?.classList.replace('fa-x', 'fa-search');
        }
      }
    });
  }

  findCurrerntUserProfile() {
    this.userService.findCurrentLoginUser().subscribe((response: any) => {
      this.currentUser = response;
      console.log("user role", this.currentUser?.roles);
      // Set isSuperAdmin flag based on role
      this.isSuperAdmin = this.currentUser?.roles === 'SUPERADMIN';
    }, (error: any) => {
      console.log(error);
    });
  }

  logout() {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out'
    }).then((result) => {
      if (result.isConfirmed) {
      
        this.router.navigate(['/auth'])
        sessionStorage.removeItem('token');
     
        Toast.fire({
          icon:"success",
          title:"You have been logged out successfully"
         })
       
      }
    });
  }

  usertoggle()
  {
    let user=document.querySelector('.users')
    let img=document.querySelector('.emimg')
    let mainclass=document.querySelector('.main-contente-box')
    if(user)
    {
      user.classList.toggle('userlist')
    }
    if(img)
      {
        img.classList.toggle('timg')
      }
      if (mainclass) {
        mainclass.classList.toggle('mainuser')
      }

  }
  fetchNotification(){
    let todayDate = new Date().toISOString().split('T')[0];  
    this.notificationService.findNotificationByDate(todayDate).subscribe((res:any)=>{
      
      this.notificationCount=res.length;
      
      
    })
  }
 
}
