
import { RouteService } from 'src/app/services/route.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationComponent } from 'src/app/auth/registration/registration.component';
import { Toast } from 'src/app/services/sweetalert';
import { DriverComponent } from '../driver/driver.component';
import Swal from 'sweetalert2';
import { ViewdocumentComponent } from '../viewdocument/viewdocument.component';
import { DriverService } from 'src/app/services/driver.service';
import { Router } from '@angular/router';
import { AddrouteComponent } from '../addroute/addroute.component';
import { UpdatetripComponent } from '../updatetrip/updatetrip.component';
import { UpdaterouteComponent } from '../updateroute/updateroute.component';
import { RouteComponent } from '../route/route.component';

@Component({
  selector: 'app-viewroute',
  templateUrl: './viewroute.component.html',
  styleUrls: ['./viewroute.component.css']
})
export class ViewrouteComponent implements OnInit {
 
  allroute: any[] = [];
  item: any;
  dialogRef: any;
  trip: any;
  page: number = 1;
  data: any;
  searchTerm: string = ''; // Holds the current search term
  routes: any[] = []; // Stores all the routes
  filteredRoutes: any[] = [];
  filteredallroute: any[]=[];




  constructor(
    private router: Router,
    private RouteService: RouteService,
    private dialog: MatDialog,
   
  )
   {

   
   }



  ngOnInit(): void {
    this.showAllRoute();
    
   

  }
  addRoute(part: any = null) {
    const dialogRef = this.dialog.open(RouteComponent, {
      width: '500px',
      disableClose: true,
      data: { part },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.showAllRoute();// Refresh the list after success
      }
    });
    
  }
  updater(part: any = null) {

    const dialogRef = this.dialog.open(UpdaterouteComponent, {
      width: '500px',
      disableClose: true,
      data: { part }, // Pass part data if editing, null if creating
    });

    dialogRef.afterClosed().subscribe((result) => {
       console.log(result)
      if (result === 'success') {
        this.showAllRoute();// Refresh the list after success
      }
    });

  }



  close(status: any): void {
    this.dialogRef.close(status);
  }

 



 






  showAllRoute() {
    this.RouteService.showAllRoute().subscribe((response: any) => {
      this.allroute = response;
      this.filteredallroute = this.allroute; 
    });
  }


  searchRoute() {
    const term = this.searchTerm.toLowerCase().trim();
    console.log('Filtered search term:', term); // Log search term

    // Log each user's route to ensure it's populated
    this.allroute.forEach((user: any) => {
        console.log('User route:', user.route); // Log individual user route
    });

    if (term) {
        this.filteredallroute = this.allroute.filter((user: any) =>
            user.route?.toLowerCase().includes(term)
        );
        console.log('Filtered allroute:', this.filteredallroute); // Log filtered allroute
    } else {
        this.filteredallroute = [...this.allroute];
        console.log('Showing all allroute:', this.filteredallroute);
    }

    this.page = 1; // Reset pagination
}


 
}

