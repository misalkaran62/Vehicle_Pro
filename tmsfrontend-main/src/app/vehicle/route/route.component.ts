import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouteService } from 'src/app/services/route.service';
import { Toast } from 'src/app/services/sweetalert';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  newRoute: string = ''; // New route input
  description: string='';
  routes: { id: number, route: string }[] = []; // Array to hold existing routes
  currentPage: number = 1; // Current page number
  routesPerPage: number = 5; // Routes per page
  route={
    id: '',
    route: '',
    description: '',
    date:'', // Default date from your JSON
    createBy: '',
  };
  constructor(private http: HttpClient, private routeService: RouteService, @Inject(MAT_DIALOG_DATA) public datas: any
    , private dialogRef: MatDialogRef<RouteComponent>) {
    
     }

  ngOnInit() {
    // Fetch routes dynamically from the server (commented out for now)

    this.fetchAllRoutes()
  }

  

  fetchAllRoutes() {
    this.routeService.showAllRoute()
      .subscribe((response: any) => {
        console.log('all routes:', response.message);
        this.routes = response
        console.log(this.routes);

        this.routeService.emitRouteUpdate(this.routes);

      }, error => {
        console.error('Error adding route:', error);
      });
  }

  get totalPages(): number {
    return Math.ceil(this.routes.length / this.routesPerPage);
  }

  get paginatedRoutes(): { id: number, route: string }[] {
    const startIndex = (this.currentPage - 1) * this.routesPerPage;
    return this.routes.slice(startIndex, startIndex + this.routesPerPage);
  }
  submitRoute() {
    
    // Check if newRoute has a value
    if (this.route.route.trim()) {
       
      console.log('Route to be submitted:', this.route); // Log the route object

      // Send the route to the server using the routeService
      this.routeService.addNewRoute(this.route)
        .subscribe((response: any) => {
          console.log('Route added:', response.message);
          if (response.status) {
            this.dialogRef.close('success');
            Toast.fire({
              icon: "success",
              title: response.message
            });
           
          } else {
            Toast.fire({
              icon: "error",
              title: response.message
            });
          }

          // Optionally, clear the input after submission
          this.newRoute = '';
          this.routeService.emitRouteUpdate(this.routes);

          this.fetchAllRoutes()
        }, error => {
          console.error('Error adding route:', error);
        });
    } else {
      console.error('Route input is empty. Please enter a valid route.');
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  close(status: any): void {
    this.dialogRef.close(status);
  }
}
