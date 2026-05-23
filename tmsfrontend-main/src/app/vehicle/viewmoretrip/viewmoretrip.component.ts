import { MatDialog } from '@angular/material/dialog';
import { GeolocationService } from './../../services/geolocation.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from 'src/app/services/sweetalert';
import { TripService } from 'src/app/services/trip.service';
import Swal from 'sweetalert2';
import { UpdatetripendandstartkmComponent } from '../updatetripendandstartkm/updatetripendandstartkm.component';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-viewmoretrip',
  templateUrl: './viewmoretrip.component.html',
  styleUrls: ['./viewmoretrip.component.css']
})
export class ViewmoretripComponent implements OnInit {
  longitude: number | any;
  errorMessage: string | null = null;
  position: any;
  latitude: number | any;
  statusOptions: string[] = ['CREATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  @ViewChild('startKmInput', { static: false }) startKmInput!: ElementRef;
  StartForm: any;
  trip: any;
  isPopupVisible: boolean = false;
  fileName: string = '';
  startKmPhoto: any;
  endKmPhoto: any;
  startKmImageUrl: any;
  endKmImageUrl: any;
  file: any;
  img: any;
  showImages: boolean = false;
  startImages: any;
  endImages: any;
  showModal: boolean = false;
  tripId: any;
  canclepage: any;
  tripDes: any;
  selectedFile: any;
  cancelReason: any;
  showSratkmModal: any;

  isEditable: boolean = false;
  isDisable: boolean = false;

  @Input() tripStatus: string = 'Start'; // Set default or receive from parent
  startKm: any;
  locationLink: any;
  currentUser: any;
  error: any;


  constructor(
    private activeRoute: ActivatedRoute,
    private tripService: TripService,
    private geolocationService: GeolocationService,
    private router: Router,
    private dilog: MatDialog,
    private userService: UserService,
  ) {

  }

  ngOnInit(): void {
    // console.log(this.trip);
    this.getCurrentLocation();


    this.tripId = this.activeRoute.snapshot.params['id'];
    this.loadTripData(this.tripId);
    this.findCurrerntUserProfile()

  }


  // Fetch current user profile
  findCurrerntUserProfile() {
    this.userService.findCurrentLoginUser().subscribe(
      (response: any) => {
        this.currentUser = response;
        // console.log("current user ",this.currentUser.roles[0]);

      },
      (error: any) => {
        // console.log(error);
      }
    );
  }
  getCurrentLocation(): void {

    this.geolocationService
      .getCurrentLocation()
      .then((coords) => {
        this.latitude = coords.latitude;
        this.longitude = coords.longitude;
        this.error = null;
      })
      .catch((err) => {
        this.error = err;
      });

  }




  // Enable editing mode
  onEditStartKm(): void {
    this.isDisable = true;
    // console.log(this.isDisable);

    // Focus on the input field after DOM update
    setTimeout(() => {
      if (this.startKmInput) {
        this.startKmInput.nativeElement.focus();
      }
    });
  }

  loadTripData(tripId: any) {
    // console.log('trip ID : ', tripId);

    this.tripService.findById(tripId).subscribe((response: any) => {
      this.trip = response.trip;
      this.img = response;
      //console.log(this.img);

      // console.log("trip data for me", this.trip);
    });
  }
  // Determine the current step based on trip status
  getCurrentStep(): number {
    switch (this.trip.tripStatus) {
      case 'CREATED': return 0;
      case 'IN_PROGRESS': return 1;
      case 'COMPLETED': return 2;
      case 'CANCELLED':
      default: return 0;
    }
  }
  submitStartForm(form: any) {
    this.getCurrentLocation();
    // console.log(this.trip,"this is trip data");
    console.log(this.latitude);
    console.log(this.longitude);
    this.trip.startLoc = this.latitude + ',' + this.longitude;
    // console.log(this.trip,"this is after add location ordianteat");

    if (!this.trip.startKm || !this.startKmPhoto) {
      Swal.fire({
        icon: 'error',
        title: 'Please fill all required fields!',
        text: 'Start Km and Start Km Photo are required.',
      });
      return;
    }


    // console.log("trip data",this.startKmPhoto);

    const formData = new FormData();
    formData.append("tripUpdateRequest", new Blob([JSON.stringify(this.trip)], { type: 'application/json' }));
    formData.append('startPhoto', this.startKmPhoto);


    this.tripService.update(formData).subscribe(
      (response: any) => {
        if (response.status) {
          Toast.fire({
            icon: 'success',
            title: 'Start Km updated successfully!'
          });
          this.isDisable = false; // Disable editing mode
          this.loadTripData(this.tripId); // Reload updated data
        }
        this.router.navigate(['/dashboard/vehicle/viewtrips']);
      },
      (error) => {
        console.error("Error updating trip status:", error);

        // SweetAlert2 toast for error
        Swal.fire({
          icon: 'error',
          title: 'Failed to update trip status',
          text: error.error ? error.error : 'Something went wrong. Please try again!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
    );
  }

  async cancelledTrip(data: { value: { tripDes: string } }) {
    const tripCancelled = 'CANCELLED';
    const formData = new FormData();

    formData.append('tripStatus', tripCancelled);
    formData.append('cancellationReason', data.value.tripDes);
    formData.append('tripId', this.tripId);

    // Log the FormData contents
    formData.forEach((value, key) => {
      // console.log(`${key}: ${value}`);
    });

    try {
      const response = await this.tripService.update(formData).toPromise();
      // console.log(`Trip completed successfully:`, response);
      this.loadTripData(this.tripId);
    } catch (error) {
      console.error(`Error updating trip status:`, error);
      // Optionally notify the user here
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  closePopup() {
    this.isPopupVisible = false;
    // console.log("cancel");
  }

  cancletrip() {
    this.canclepage = true;
  }

  cancellationReasonData(): void {
    const obj = {
      tripStatus: 'CANCELLED',
      cancellationReason: this.cancelReason,
      tripId: this.tripId
    };

    this.tripService.tripCancelled(obj).subscribe(
      (res) => {
        // console.log(res);
        this.loadTripData(this.tripId);
        this.router.navigate(['/dashboard/vehicle/viewtrips']);
      });
    // Close modal
    this.showModal = false;
  }


  openModal() {
    this.showModal = true;

  }
  closestartModal() {
    // console.log("we are goinng to close statmodel")
    this.showSratkmModal = false;
  }
  openPopup() {
    this.isPopupVisible = true;
  }
  openStartkmModal() {
    this.showSratkmModal = true;
  }

  startKmimg(): string {
    if (!this.img?.startKmPhoto) {
      return ''; // Return empty string if no image data
    }
    return `data:image/jpeg;base64,${this.img.startKmPhoto}`;
  }

  endKmimg(): string {
    if (!this.img?.endKmPhoto) {
      return ''; // Return empty string if no image data is available
    }
    return `data:image/jpeg;base64,${this.img.endKmPhoto}`;
  }


  submitEndForm(form: any): void {
    console.log('Trip end atitude:', this.latitude);
    console.log('Trip end longitude :', this.longitude);
    this.trip.endLoc = this.latitude + ',' + this.longitude;
    const formData = new FormData();
    formData.append("tripUpdateRequest", new Blob([JSON.stringify(this.trip)], { type: 'application/json' }));
    // console.log('End KM Photo:', this.endKmPhoto);
    formData.append('startPhoto', this.startKmPhoto);
    if (this.endKmPhoto) {
      formData.append("endPhoto", this.endKmPhoto);
      // formData.append("file", this.startKmPhoto);
    }

    //// console.log(this.calculateTotalKm());
    if (this.trip.endKm != null) {
      if (this.calculateTotalKm() <= 0) {
        Toast.fire({
          icon: 'error',
          title: 'please check end km distance'
        })
        return;
      }
    }
    this.tripService.update(formData).subscribe(
      (response: any) => {
        if (response.status) {
          this.loadTripData(this.tripId);
          // Only navigate after data is loaded
          this.router.navigate(['/dashboard/vehicle/viewtrips']);
        } else {
          // Handle the failure case
          console.error('Failed to update trip');
        }
      },
      (error) => {
        console.error('Error updating trip:', error);
      }
    );
  }


  // Submit start and end data as needed
  onKmEntered(action: 'start' | 'end'): void {
    const formData = new FormData();
    formData.append("trip", new Blob([JSON.stringify(this.trip)], { type: 'application/json' }));
    const photo = this.startKmPhoto
    if (photo) {
      formData.append("file", photo);
    }
    this.tripService.update(formData).subscribe(
      response => {
        // console.log(`Trip ${action} status updated successfully:`, response);
      },
      error => {
        console.error(`Error updating trip ${action} status:`, error);
      }
    );
  }
  generateTripLink(startLocation: string, endLocation: string): string {
    const baseUrl = "https://www.google.com/maps/dir/";
    return `${baseUrl}${startLocation}/${endLocation}`;
  }
  // Logic to calculate total kilometers
  calculateTotalKm(): number | any {
    return this.trip.startKm && this.trip.endKm ? this.trip.endKm - this.trip.startKm : null;
  }

  getFormattedStartKmPhoto(): string | any {
    if (!this.startKmPhoto) return 'Start KM Image';
    if (this.startKmPhoto.name.length === 10) return this.startKmPhoto.name;
    if (this.startKmPhoto.name.length > 17) return this.startKmPhoto.name.substring(0, 10) + '...';
    return this.startKmPhoto.name;

    //// console.log(this.startKmPhoto);
  }
  getFormattedEndKmPhoto(): string {
    if (!this.endKmPhoto) return 'End KM Image'; // Placeholder if no file is selected
    const name = this.endKmPhoto.name;
    if (name.length > 17) return `${name.substring(0, 14)}...`; // Truncate if the name is too long
    return name; // Return the name if it fits within the limit
  }


  // Handle Start KM Image Change
  onStartKmImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.startKmPhoto = file;
      const reader = new FileReader();
      reader.onload = () => this.startKmImageUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  // Handle End KM Image Change
  onEndKmImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.endKmPhoto = file;
      const reader = new FileReader();
      reader.onload = () => this.endKmImageUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  // Determine if step 1 is visible
  isStep1Visible(): boolean {
    return ['CREATED', 'COMPLETED', 'Complete', 'Received', 'Submit'].includes(this.trip.tripStatus);
  }

  // Determine if step 1 is completed
  isStep1Completed(): boolean | any {

    return this.trip.startKm != null || ['Complete', 'Received', 'Submit'].includes(this.trip.tripStatus);
  }

  // Step 1 Label
  getStep1Label(): string {
    return this.trip.tripStatus === 'CREATED' || this.trip.tripStatus === 'COMPLETED' ? 'Trip Start' : 'INITIALIZED';
  }

  // Step 1 Initialization Check
  isStep1Initialized(): boolean {
    return ['Complete', 'Received', 'Submit'].includes(this.trip.tripStatus);
  }

  // Step 2: Trip End visibility check
  isStep2Visible(): boolean {
    return ['IN_PROGRESS', 'Complete', 'Received', 'Submit'].includes(this.trip.tripStatus);
  }

  // Step 2 Completion Check
  isStep2Completed(): boolean {
    return this.trip.endKm != null || ['Complete', 'Received', 'Submit'].includes(this.trip.tripStatus);
  }

  // Step 2 Label
  getStep2Label(): string {
    return this.trip.tripStatus === 'IN_PROGRESS' ? 'In Progress' : 'COMPLETED';
  }

  // Step 2 Initialization Check
  isStep2Initialized(): boolean {
    return ['Complete', 'Received', 'Submit'].includes(this.trip.tripStatus);
  }

  // Step 3: Trip Completed visibility check
  isStep3Visible(): boolean {
    return ['COMPLETED', 'Received', 'Submit'].includes(this.trip.tripStatus);
  }

  // Step 3 Label
  getStep3Label(): string {
    return this.trip.tripStatus === 'COMPLETED' ? 'Trip Complete' : 'IN_PROGRESS';
  }

  // Step 3 In Progress Check
  isStep3InProgress(): boolean {
    return ['Received', 'Submit'].includes(this.trip.tripStatus);
  }

  // Step 4: Trip Cancelled visibility check
  isStep4Visible(): boolean | any {
    //// console.log(['CANCELLED'].includes(this.trip.tripStatus));
    return ['CANCELLED'].includes(this.trip.tripStatus);
  }

  // Handle file input change
  onFileChange(event: any): void {
    const file = event.target.files[0];
    // console.log(this.file);

    if (file) {
      this.fileName = file.name.length > 17 ? file.name.substring(0, 17) + '...' : file.name;
    }
  }
  updateTrips(item: any) {
    // console.log(item ,"trip id")
    const dialogRef = this.dilog.open(UpdatetripendandstartkmComponent, {
      width: '500px',
      data: item,
      // disableClose: true

    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.loadTripData(this.tripId);// Refresh the user list after successful registration
      }
    });
  }
  // ------------------------download StartKMPhoto and EndKMPhoto-----------------------------------------//
  downloadstartkmimg(startKmimg: string, tripid: number) {
    const link = document.createElement('a');
    link.href = this.startKmimg();
    link.download = `${startKmimg}-${tripid}.jpg`;
    link.click();
  }
  downloadendkmimg(endKmimg: string, tripid: number) {
    const link = document.createElement('a');
    link.href = this.endKmimg();
    link.download = `${endKmimg}-${tripid}.jpg`;
    link.click();
  }

}
