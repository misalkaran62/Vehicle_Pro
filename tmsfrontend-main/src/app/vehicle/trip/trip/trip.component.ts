import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LogarithmicScale } from 'chart.js';
import { RegistrationComponent } from 'src/app/auth/registration/registration.component';
import { BranchService } from 'src/app/services/branch.service';
import { RouteService } from 'src/app/services/route.service';
import { Toast } from 'src/app/services/sweetalert';
import { TripService } from 'src/app/services/trip.service';
import { UserService } from 'src/app/services/user.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { RouteComponent } from '../../route/route.component';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  tripForm!: FormGroup;
  trip: any[] = []
  drivers: any[] = [];
  vehicles: any[] = [];
  branches: any[] = [];
  routes: any[] = [];

  branchId: any
  tripId: any
  isUpdate: boolean = false;
  currentUser: any;
  formdata: any;
  firstName:any
  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private router: Router,
    private branch: BranchService,
    private vehicleService: VehicleService,
    private userService: UserService,
    private route: RouteService,
    private activate: ActivatedRoute,
    private mat: MatDialog,
    @Inject(MAT_DIALOG_DATA) public datas: any
    , private dialogRef: MatDialogRef<TripComponent>

  ) {
    // Initialize the form with validations
    this.tripForm = this.fb.group({
      tripDescription: ['', Validators.required],
      route: this.fb.group({
        id: ['', Validators.required]
      }),
      branch: this.fb.group({
        id: ['', Validators.required]
      }),
      driver: this.fb.group({
        id: ['', Validators.required]
      }),
      vehicle: this.fb.group({
        vehicleId: ['', Validators.required]
      }),
      notes: ['']
    });
  }


  ngOnInit(): void {
    this.findCurrentUserProfile();
    console.log("im in onit ", this.datas);

    this.fetchData();
    this.getRoutes();


    
   

    this.userService.findCurrentLoginUser().subscribe((response => {
      this.currentUser = response
      console.log("the current user " + this.currentUser.roles);
      if (this.currentUser?.roles == 'Manager') {
        this.getDriverr();
        this.getVehiclee();
        this.tripForm.get('branch.id')?.valueChanges.subscribe(branchId => {
          if (branchId) {
            console.log("Selected branch ID: ", branchId);
            this.getDriver(this.branchId);
            this.getVehicle(this.branchId);
          }
          else{
            console.log("in else in if");
            
            
          }
        });
      } else {
        console.log("im in else ");

        // if(this.curUser?.roles=='SUPERADMIN'){
        this.tripForm.get('branch.id')?.valueChanges.subscribe(branchId => {
          if (branchId) {

            console.log("Selected branch ID: " + branchId);
            this.getDriver(branchId); // Fetch drivers for the selected branch
            this.getVehicle(branchId); // Fetch vehicles for the selected branch
          }
        });


      }

    }))


    // Listen for changes to the branch selection

  }

  getRoutes() {

    this.route.showAllRoute().subscribe(
      (response: any) => {
        this.routes = response;
        console.log(response);
      },
      (error: any) => {
        console.log(error.message);
      }
    );
    this.route.routeUpdated$.subscribe((updatedRoutes: any) => {
      console.log('Received updated routes:', updatedRoutes);
      this.routes = updatedRoutes;
    });
  }

 
  getDriver(branchId: number) {
    this.userService.findAllActiveDriver(branchId).subscribe(
      (drivers: any[]) => {
        console.log(drivers);
        
        this.drivers = drivers;
        console.log("Drivers for branch ID " + branchId + ": ", this.drivers);
        
        // Log a specific driver's details if needed
        if (this.drivers.length > 0) {
          console.log("First driver's details: ",this.drivers[0]?.trip?.user?.firstName);
        } else {
          console.log("No active drivers found for branch ID " + branchId);
        }
        
      },
      (error) => {
        console.error('Error fetching active drivers:', error);
      }
    );
  }
  getDriverr() {
    this.userService.findAllActiveDriver().subscribe(
      (drivers: any[]) => {
        console.log(drivers);
        
        this.drivers = drivers;
        // console.log("Drivers for branch ID " + branchId + ": ", this.drivers);
        
        // Log a specific driver's details if needed
        if (this.drivers.length > 0) {
          console.log("First driver's details: ",this.drivers[0]?.trip?.user?.firstName);
        } else {
          // console.log("No active drivers found for branch ID " + branchId);
        }
        
      },
      (error) => {
        console.error('Error fetching active drivers:', error);
      }
    );
  }


  getVehicle(branchId: number) {
    console.log("branch id", branchId);

    this.vehicleService.findAllVehiclesByBranch(branchId).subscribe( // Ensure you have this method in your service
      (vehicles) => {
        this.vehicles = vehicles;
        console.log("Available vehicles: ", this.vehicles);
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }
  getVehiclee() {
    // console.log("branch id", branchId);

    this.vehicleService.findAllVehiclesByBranch().subscribe( // Ensure you have this method in your service
      (vehicles) => {
        this.vehicles = vehicles;
        console.log("Available vehicles: ", this.vehicles);
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  fetchData(): void {
    this.branch.getBranches().subscribe(
      (response: any) => {
        this.branches = response;
      },
      (error: any) => {
        console.error('Error fetching branches:', error);
      }
    );
  }



  onSubmit(): void {
    const formData = this.tripForm.value;

  console.log("forma ",formData)
    const tripData = {
      tripDescription: formData.notes,
      user: { id: formData.driver.id },
      vehicle: { vehicleId: formData.vehicle.vehicleId },
      branch: { id: formData.branch.id },
      route: { id: formData.route.id }
    };
    
      this.tripService.create(tripData).subscribe(
        (response: any) => {
          Toast.fire({
            icon: "success",
            title: response.message
          });
          this.close('success');
          this.tripForm.reset();
        },
        error => {
          console.error('Error creating trip', error);
        }
      );
    
  }

  Route() {
    const matRouteRef = this.mat.open(RouteComponent, {
      width: '500px',
      disableClose: true

    })

    matRouteRef.afterClosed().subscribe((result) => {
      if (result == 'success') {
        this.getRoutes(); // Refresh the routes list after successful registration
      }
    });

    // matRouteRef.close();
    // this.router.navigate(['/dashboard/vehicle/route']);
  }
  close(status: any): void {
    this.dialogRef.close(status);
  }
  findCurrentUserProfile() {
    this.userService.findCurrentLoginUser().subscribe((response: any) => {
      this.currentUser = response;

      console.log("ye hai current user", this.currentUser);

    })
  }


}
