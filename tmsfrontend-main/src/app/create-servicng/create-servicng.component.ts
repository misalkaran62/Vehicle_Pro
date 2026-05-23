import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { ServicingService } from '../services/servicing.service';
import { VehicleService } from '../services/vehicle.service';
import { Toast } from '../services/sweetalert';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartchangeService } from '../services/partchange.service';
@Component({
  selector: 'app-create-servicng',
  templateUrl: './create-servicng.component.html',
  styleUrls: ['./create-servicng.component.css']
})
export class CreateServicngComponent implements OnInit {

  updateForm: any;
  servicingForm: any;
  rowid: any;
  formData: any;
  vehicleId: any;
  vehicleData: any;
  allvehicleid: any;
  isUpdate: boolean = false;
  isPartChange: boolean = false;
  servicingTypes = ['PART_CHANGE', 'REGULAR', 'ACCIDENT'];
  // is_approved: boolean = false;
  status: string = 'waiting';
  selectedFiles: { changepartimg?: File[]; paymentReceipt?: File } = {};
  paymentDetails: any = {};
  isCreateMode: boolean = true;
  stepper: any;
  vehicleReg: any;
  allparts: any;
  // selected: File[] = [];
  constructor(
    private fb: FormBuilder,
    private active: ActivatedRoute,
    private partapi:PartchangeService,
    private service_api: ServicingService,
    private vehicleapi: VehicleService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public datas: any
    , private dialogRef: MatDialogRef<CreateServicngComponent>
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group({
      vehicleReg: [''],
      servicingType: ['', Validators.required],
      servicingVendor: ['', Validators.required],
      servicingDate: ['', Validators.required],
      lastServicing: [''],
      servicingDescription: [''],
      servicingAmount: [''],
      status: [''],
      servicingId: [''],
      is_approved: [''],
     
      // vehicleRegNumber: [''],
     
      
      
      
      // approved: [false, Validators.requiredTrue]
    });

    

    this.vehicleapi.showAllVehicle().subscribe(res => {
      console.log('shoiwallvehicle', res);
      this.allvehicleid = res
      console.log('shoiwallvehicle allvehicle ', this.allvehicleid);
    });
    
  }

  removeFile(index: number): void {
    if (this.selectedFiles.changepartimg) {
      this.selectedFiles.changepartimg.splice(index, 1); // Remove the file at the given index
    }
  }

  giveid() {

    this.vehicleId = this.updateForm.get('vehicleReg')?.value;
    console.log("sercing current id", this.vehicleId);
  }

  // -------------------------------------------------------

  onSubmit() {
    console.log('this.updatedataform',this.updateForm.value); 
    const submitData = new FormData();
    submitData.append(
      'vehicleServicing',
      new Blob([JSON.stringify(this.updateForm.value)], { type: 'application/json' })
    );

    if (this.selectedFiles.changepartimg?.length) {
      this.selectedFiles.changepartimg.forEach((file) => {
        submitData.append('partChangeFiles', file);
      });
    }

    this.service_api.createservicing(this.updateForm.value.vehicleReg, submitData).subscribe(
      (response:any) => {
        Toast.fire({ icon: 'success', title: response.message });
        this.dialogRef.close('success');
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }



  close(status: any): void {
    this.dialogRef.close(status);
  }

  isFileUploadStep(): boolean {
    const servicingType = this.updateForm.get('servicingType')?.value;
    return servicingType === 'PART_CHANGE' || servicingType === 'ACCIDENT';
  }


  // onFileSelected(event: any, fileType: string) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     if (fileType === 'changepartimg') {
  //       this.selectedFiles.changepartimg = file;
  //     } 
  //   }
  // }
  onFileSelected(event: any, fileType: string) {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      if (fileType === 'changepartimg') {
        this.selectedFiles.changepartimg = this.selectedFiles.changepartimg || [];
        Array.from(files).forEach((file) => {
          this.selectedFiles.changepartimg?.push(file);
        });
      }
    }
  }

  get selectedFileNames(): string {
    if (this.selectedFiles.changepartimg?.length) {
      return this.selectedFiles.changepartimg.map((file) => file.name).join(', ');
    }
    return 'SELECT FILE';
  }

 


}


// -----------------servicing id get -------------------



