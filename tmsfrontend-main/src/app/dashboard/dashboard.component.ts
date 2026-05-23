import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { TripService } from '../services/trip.service';
import { VehicleService } from '../services/vehicle.service';
import { DashboardService } from '../services/dashboard.service';
import { ServicingService } from '../services/servicing.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  linegraph: any;
  trip: any[]= [];
  lineoptions: any;
  vehicles: any;
  data: any;
  servicing: any;
  options: any;
  filterText: string = '';
  tableData: any[] = []; // To hold the original data
  filterData: any;
  currentUser: any;
  isSuperAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private tripapi: TripService,
    private dashboard: DashboardService,
    private vehicleser: VehicleService,
    private servingapi: ServicingService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize charts and styles
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.linegraph = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          backgroundColor: documentStyle.getPropertyValue('--light-blue'),
          borderColor: documentStyle.getPropertyValue('--light-blue'),
          data: [65, 59, 80, 81, 56, 55, 40, 80, 90, 70, 60, 50],
          borderRadius: 15
        }
      ]
    };

    this.lineoptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColor
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColor
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.showtripdata();
    this.countvehicle();
    this.servicingdata();
    this.findCurrerntUserProfile();
  }

  // Navigate to different views
  showUser() {
    this.router.navigate(['/dashboard/vehicle/notification']);
  }

  showVehicle() {
    this.router.navigate(['/dashboard/vehicle/view-vehicle']);
  }

  showTrip() {
    this.router.navigate(['/dashboard/vehicle/viewtrips']);
  }
  trips(id:any){
    // console.log("trip id",id);
  
    this.router.navigate(['/dashboard/vehicle/viewmoretrip',id])
  }
 
  showtripdata() {
    this.tripapi.findAll().subscribe((res) => {
      this.tableData = res;
      this.trip = res;
      console.log("All trip details:", this.trip);
      
      this.getTodayTrips(); // Filter only today's trips
    });
  }

  // Filter trips for today's date
  getTodayTrips() {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    this.trip = this.tableData.filter((trip: any) => {
      const tripDate = new Date(trip.startDate); // Ensure correct date parsing
      return tripDate >= todayStart && tripDate <= todayEnd; // Filter for today
    });

    // console.log("Today's trips:", this.trip);
  }

  // Fetch vehicle count
  countvehicle() {
    this.dashboard.showAllVehicle().subscribe((res) => {
      this.vehicles = res;
      console.log("Vehicle details:", this.vehicles);
    });
  }

  onFilterChange() {
    const filterTextTrimmed = this.filterText.toLowerCase().trim();
     console.log("filterd data",filterTextTrimmed)
    if (filterTextTrimmed) {
      this.trip = this.trip.filter((trips: any) =>
        trips.user.firstName.toLowerCase().includes(filterTextTrimmed) 
      );
    } else {
      this.trip = [...this.trip]; // Reset to full user list if search is cleared
    }

  }


  // Fetch servicing data
  servicingdata() {
    const now = new Date();
  
    // Calculate start and end of the current week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Set to Sunday
    startOfWeek.setHours(0, 0, 0, 0);
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Saturday
    endOfWeek.setHours(23, 59, 59, 999);
  
    this.vehicleser.showAllVehicle().subscribe((res: any) => {
      // Filter servicing data for each vehicle and retain the structure
      const updatedVehicles = res.map((vehicle:any) => {
        const filteredServicings = vehicle.vehicleServicings.filter((servicing: any) => {
          if (servicing.servicingDate) {
            // Convert `servicingDate` array to a valid Date object
            const [year, month, day] = servicing.servicingDate;
            const servicingDate = new Date(year, month - 1, day); // Month is 0-based
            return servicingDate >= startOfWeek && servicingDate <= endOfWeek;
          }
          return false;
        });
  
        // Return the updated vehicle object with filtered servicing data
        return {
          ...vehicle,
          vehicleServicings: filteredServicings,
        };
      });
  
      this.servicing = updatedVehicles; // Update the component's servicing property
      console.log("Vehicles with current week's servicing data:", this.servicing);
    });
  }
  
  // Fetch current user profile
  findCurrerntUserProfile() {
    this.userService.findCurrentLoginUser().subscribe(
      (response: any) => {
        this.currentUser = response;
        this.isSuperAdmin = this.currentUser?.roles === 'SUPERADMIN';
        console.log("User role:", this.currentUser?.roles);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
