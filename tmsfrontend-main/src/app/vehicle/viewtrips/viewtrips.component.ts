import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TripComponent } from '../trip/trip/trip.component';
import Swal from 'sweetalert2';
import { Toast } from 'src/app/services/sweetalert';
import { UserService } from 'src/app/services/user.service';
import { UpdatetripComponent } from '../updatetrip/updatetrip.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-viewtrips',
  templateUrl: './viewtrips.component.html',
  styleUrls: ['./viewtrips.component.css']
})
export class ViewtripsComponent implements OnInit {



  trips: any[] = []; // Array to hold trip data
  allTrips: any[] = [];
  // statusOptions: string[] = ['Planned', 'In Progress', 'Completed', 'Cancelled']; // Status options
  myGroup: FormGroup; // Define the FormGroup
  page: number = 1;
  statusOptions: string[] = ['CREATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  searchTerm: string = '';
  currentUser: any;

  
  selectedDate: string = '';

  constructor(private tripService: TripService, private router: Router, private dilog: MatDialog, private userService: UserService

  ) {
    // Initialize the FormGroup
    this.myGroup = new FormGroup({
      companyName: new FormControl('') // Define the form control
    });
  }

  ngOnInit(): void {
    console.log("I'm in the onInit, going to fetch trips");
    this.fetchTrips(); // Fetch trips on component initialization
  }

  Trip() {
    this.router.navigate(['/dashboard/vehicle/trip']); // Navigate to the trip creation page
  }

  fetchTrips() {
    console.log("Fetching trips...");
    this.tripService.findByWeek().subscribe((response) => {
      console.log('Trip fetched successfully:', response);
      this.allTrips = [...response]; // Save the full list to allUsers

      this.trips = response; // Assign response to trips
    });
  }

  updateTripStatus(trip: any) {
    this.tripService.updateTripStatus(trip.tripId, trip.tripStatus).subscribe(
      response => {
        console.log('Trip status updated successfully:', response);
      },
      error => {
        console.error('Error updating trip status:', error);
      }
    );
  }

  createTrip() {
    const MatDialogRef = this.dilog.open(TripComponent, {
      width: '850px',
      disableClose: true


    })
    MatDialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.fetchTrips(); // Refresh the user list
      }
    });
  }

  updateTrip(item: any) {

    this.dilog.open(UpdatetripComponent, {
      width: '850px',
      data: item,
      disableClose: true

    })
   
  }

  searchTrip() {
    console.log("Searching:", this.searchTerm);

    // Perform filtering based on searchTerm
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();

      this.trips = this.allTrips.filter((trip: any) =>
        trip.user.firstName.toLowerCase().includes(term) ||
        trip.branch.branchName.toLowerCase().includes(term) ||
        trip.tripStatus.toLowerCase().includes(term) ||
        trip.branch.branchName.toLowerCase().includes(term) ||
        trip.vehicle.vehicleReg.toLowerCase().includes(term)
      );
    } else {
      // If searchTerm is empty, reset to show all users
      this.trips = [...this.allTrips];
    }
  }

  viewmore(tripId: any) {
    console.log("trip id", tripId)
    this.router.navigate(['dashboard/vehicle/viewmoretrip', tripId])
  }


  deleteTrip(tripId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.tripService.delete(tripId).subscribe((response: any) => {
          Toast.fire({
            icon: "success",
            title: response.message
          });
          this.fetchTrips();
        });
      }
    });
  }
  // to fetch current user and disable driver to create trip
  getCurrentUser() {
    this.userService.findCurrentLoginUser().subscribe((response: any) => {
      this.currentUser = response;
    });
  }

  filterByDate() {
    console.log("selected date", this.selectedDate);

    this.tripService.findDateDriver(this.selectedDate).subscribe((res: any) => {
      console.log("finding date", res);
      this.trips = res;

    })
  }
  allTrip(){
     this.tripService.findAll().subscribe((response:any)=>{
      console.log(response);
      
      this.trips=response;
     })
    
  }
    exportToExcel(): void {
      const excludeColumns = new Set(['route','startDate','endDate','tripDescription','vehicle','branch','user','startLocation','endLocation','endKmPhotoName','startKmPhotoName']);
      const filteredData = this.trips.map(obj => {

        const newObj = { 
          ...obj,
          "Branch Name": obj?.branch.branchName || "N/A",
          "vehicleReg": obj.vehicle?.vehicleReg || "N/A",
          "Route": obj?.route?.route || "N/A",
          "Driver": obj?.user.firstName+" "+ obj?.user.lastName || "N/A",
        
         };
         excludeColumns.forEach(col => delete newObj[col]);
         return newObj;
      })
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
    
        XLSX.writeFile(wb, 'trips_data.xlsx');
      }
}
