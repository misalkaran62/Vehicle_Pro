import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Toast } from 'src/app/services/sweetalert';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-updatetripendandstartkm',
  templateUrl: './updatetripendandstartkm.component.html',
  styleUrls: ['./updatetripendandstartkm.component.css']
})
export class UpdatetripendandstartkmComponent implements OnInit {
  formGroup: FormGroup | any;
  isUpdate = true;
  isFileSelected: boolean = false;
  selectedFiles: {
    EndKm?: File;
    startKm?: File;

  } = {};
  trip: any;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdatetripendandstartkmComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private tripService: TripService

  ) {
    console.log('Data received in dialog:', this.data); // Log this
  }
  ngOnInit(): void {
    this.formGroup = this.fb.group({
      startKm: ['', Validators.required],
      endKm: ['', Validators.required],
      endKmPhotoName: ['', Validators.required],
      startKmPhotoName: ['', Validators.required],
    })
    this.loadTripData(this.data);
  }

  loadTripData(tripId: any) {
    console.log('trip ID : ', tripId);

    this.tripService.findById(tripId).subscribe((response: any) => {
      this.trip = response.trip;

      // Populate the form with fetched trip data
      this.formGroup.patchValue({
        startKm: this.trip.startKm, // Adjust these keys to match your API response
        endKm: this.trip.endKm,
        endKmPhotoName: this.trip.endKmPhotoName,
        startKmPhotoName: this.trip.startKmPhotoName
      });
      console.log("trip data for me", this.trip);
    });
  }

  onFileSelected(event: any, fileType: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (fileType === 'startKm') {
        this.isFileSelected = true
        this.selectedFiles.startKm = file;
      } else if (fileType === 'EndKm') {
        this.isFileSelected = true;
        this.selectedFiles.EndKm = file;
      }
    }
  }
  close(status: any): void {
    this.dialogRef.close(status);
  }
  // Logic to calculate total kilometers
  calculateTotalKm(): number | any {
    return this.trip.startKm && this.trip.endKm ? this.trip.endKm - this.trip.startKm : null;
  }
  updateData() {
    const Formdata = new FormData();
    //  console.log(this.formGroup.value)
    const formData = this.formGroup.value;
    console.log(formData)

    // Update the `trip` object with form values
    this.trip = {

      tripId: this.data,
      startKm: formData.startKm,
      endKm: formData.endKm
    };

    console.log("Updated trip object:", this.trip);

    Formdata.append("tripUpdateRequest", new Blob([JSON.stringify(this.trip)], { type: 'application/json' }));
    if (this.selectedFiles.startKm) {
      Formdata.append('startPhoto', this.selectedFiles.startKm);
    }

    if (this.selectedFiles.EndKm) {
      Formdata.append("endPhoto", this.selectedFiles.EndKm);
      // formData.append("file", this.startKmPhoto);
    }

    // console.log(this.calculateTotalKm());
    if (this.trip.endKm != null) {
      if (this.calculateTotalKm() <= 0) {
        Toast.fire({
          icon: 'error',
          title: 'please check end km distance'
        })
        return;
      }
    }
    this.tripService.update(Formdata).subscribe(
      (response: any) => {
        if (response.status) {
          Toast.fire({
            icon: 'success',
            title: 'trip updated successfully'
          })
          this.close('success');
        } else {
          // Handle the failure case
          console.error('Failed to update trip');
          this.close('error');
        }
      },
      (error) => {
        console.error('Error updating trip:', error);
      }
    );

  }





}
