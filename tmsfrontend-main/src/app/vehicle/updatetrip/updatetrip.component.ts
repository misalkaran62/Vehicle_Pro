import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch.service';
import { RouteService } from 'src/app/services/route.service';
import { Toast } from 'src/app/services/sweetalert';
import { TripService } from 'src/app/services/trip.service';
import { UserService } from 'src/app/services/user.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { RouteComponent } from '../route/route.component';

@Component({
  selector: 'app-updatetrip',
  templateUrl: './updatetrip.component.html',
  styleUrls: ['./updatetrip.component.css']
})
export class UpdatetripComponent {
  tripForm!: FormGroup;
  trip: any[] = []
  drivers: any[] = [];

  vehicles: any[] = [];
  branches: any[] = [];
  routes: any[] = [];
  curUser: any
  branchId: any
  tripId: any
  isUpdate: boolean = false;
  currentUser: any;
  formdata: any;
  firstName: any
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
    , private dialogRef: MatDialogRef<UpdatetripComponent>

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
    this.tripId = this.datas;
    if (this.tripId) {
      this.isUpdate = true;
      this.loadTripDetails(this.tripId);

    }

    this.fetchData();
    this.getRoutes();


    this.findCurrentUserProfile();

    // console.log("im in onit ", this.datas);

    this.userService.findCurrentLoginUser().subscribe((response => {
      this.curUser = response

      if (this.currentUser?.roles == 'Manager') {
        this.tripForm.get('branch.id')?.valueChanges.subscribe(branchId => {
          if (branchId) {
            console.log("Selected branch ID: ", branchId);
            this.getDriver(branchId);
            this.getVehicle(this.branchId);
          }
        });
      } else {
        // console.log("im in else ");

        // if(this.curUser?.roles=='SUPERADMIN'){
        this.tripForm.get('branch.id')?.valueChanges.subscribe(branchId => {
          if (branchId) {
            console.log("branch id", branchId)
            // console.log("Selected branch ID: " + branchId);
            this.getDriver(branchId); // Fetch drivers for the selected branch
            this.getVehicle(branchId); // Fetch vehicles for the selected branch
          }
        });


      }

    }))

  



  }

  loadTripDetails(id: number) {
    this.tripService.findById(id).subscribe((response: any) => {
      if (response) {
        // Patch the trip details to the form, making sure to match the structure of each nested group
        this.tripForm.patchValue({
          tripDescription: response.trip.tripDescription || '',
          route: { id: response.trip.route?.id || '' },
          branch: { id: response.trip.branch?.id || '' },
          driver: { id: response.trip.user?.id || '' },
          vehicle: { vehicleId: response.trip.vehicle.vehicleId || '' },
          notes: response.trip.tripDescription || ''
  
        }
        );

        // Fetch drivers and vehicles dynamically if the branch ID exists
        if (response.branch?.id) {
          console.log("response.branch?.id", response.branch?.id);

          this.getDriver(response.trip.branch.id);
          this.getVehicle(response.trip.branch.id);
        }

        this.userService.findById(response.trip.user?.id).subscribe((response) => {
          // console.log("currently on trip user", response);
          this.drivers.push(response)
          // console.log("all available user ", this.drivers)

        })

    
        this.vehicleService.findByVehicleId(response.trip.vehicle.vehicleId).subscribe((resp: any) => {
          console.log("current trip on ", resp);
          this.vehicles.push(resp)
          console.log("all vehicle", this.vehicles)

        })
      }

    });

    
   
  }

  getRoutes() {

    this.route.showAllRoute().subscribe(
      (response: any) => {
        this.routes = response;
        // console.log(response);
      },
      (error: any) => {
        // console.log(error.message);
      }
    );
    this.route.routeUpdated$.subscribe((updatedRoutes: any) => {
      // console.log('Received updated routes:', updatedRoutes);
      this.routes = updatedRoutes;
    });
  }


  getDriver(branchId: number) {
    this.userService.findAllActiveDriver(branchId).subscribe(
      (drivers: any[]) => {
        this.drivers = drivers;
        console.log("Drivers for branch ID " + branchId + ": ", this.drivers);
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
    const tripData = {
      tripDescription: formData.notes,
      user: { id: formData.driver.id },
      vehicle: { vehicleId: formData.vehicle.vehicleId },
      branch: { id: formData.branch.id },
      route: { id: formData.route.id }
    };

    if (this.isUpdate) {
      // Updating trip if isUpdate is true
      const tripData = {
        tripId: this.datas,
        tripDescription: formData.notes,
        user: { id: formData.driver.id },
        vehicle: { vehicleId: formData.vehicle.vehicleId },
        branch: { id: formData.branch.id },
        route: { id: formData.route.id }
      };
      this.tripService.updateManager(tripData).subscribe(
        (response: any) => {
          Toast.fire({
            icon: "success",
            title: response.message
          });
          this.close('success');
          this.tripForm.reset();
        },
        error => {
          console.error('Error updating trip', error);
        }
      );
    } else {
      // Creating a new trip if isUpdate is false


      console.log("this trip date", tripData)
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
  }
  UpdateTrip(formValue: any) {
    this.tripService.updatetrip(formValue).subscribe(
      (response: any) => {
        alert(response.message)
        if (response.status) {

          this.formdata.reset();
        }
      },
      (error: any) => {
        alert(error.message);
        console.log(error.message);
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

