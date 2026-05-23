import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddDocumentDialogComponent } from '../add-document-dialog/add-document-dialog.component';
import { InsuranceService } from 'src/app/services/insurance.service';
import { PucService } from 'src/app/services/documentService/puc.service';
import { RoadtaxService } from 'src/app/services/documentService/roadtax.service';
import { FitnessService } from 'src/app/services/documentService/fitness.service';
import { PermitService } from 'src/app/services/documentService/permit.service';
import { Toast } from 'src/app/services/sweetalert';
import { FileUploadService } from '../file-upload.service';
import { PartmappingService } from 'src/app/services/partmapping.service';
import { PartchangeService } from 'src/app/services/partchange.service';

@Component({
  selector: 'app-update-document-dialog',
  templateUrl: './update-document-dialog.component.html',
  styleUrls: ['./update-document-dialog.component.css'],
})
export class UpdateDocumentDialogComponent implements OnInit {
  formGroup: FormGroup | any;
  isFileSelected: boolean = false;
  allparts: any[] = [];
  selectedFiles: {
    insuranceReceipt?: File;
    rcReceipt?: File;
    financeReceipt?: File;
    fitnessReceipt?: File;
    pucReceipt?: File;
    taxReceipt?: File;
    permitReceipt?: File;

  } = {};
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      [x: string]: any;
      type: string;
      vehicleId: number;
      existingData: any;
    },
    private insuranceService: InsuranceService,
    private pucService: PucService,
    private toadTaxService: RoadtaxService,
    private fitnessService: FitnessService,
    private premitService: PermitService,
    private fileUploadService: FileUploadService,
    private mappingService: PartmappingService,
    private partChangeService: PartchangeService
  ) {
    this.showVehiclePart();
    console.log('Data received in dialog:', this.data); // Log this
  }
  ngOnInit(): void {
    this.initializeForm();
    if (this.data.existingData) {
      const existingData = {
        ...this.data.existingData,
        startDate: this.parseDateWithoutTimeZone(this.data.existingData.startDate)
          ? new Date(this.data.existingData.startDate)
          : null,
        endDate: this.parseDateWithoutTimeZone(this.data.existingData.endDate)
          ? new Date(this.data.existingData.endDate)
          : null,
        dateOfPurchase: this.parseDateWithoutTimeZone(this.data.existingData.dateOfPurchase)
          ? new Date(this.data.existingData.dateOfPurchase)
          : null,
        dateOfValidity: this.parseDateWithoutTimeZone(this.data.existingData.dateOfValidity)
          ? new Date(this.data.existingData.dateOfValidity)
          : null,
      };
      // Patch the partChangeId in the form

      // Assign the fitness receipt file directly
      if (this.data.existingData.fitnessReceiptName) {
        this.selectedFiles.fitnessReceipt = this.data.existingData.fitnessReceiptName;
      }
      console.log('Fitness Receipt : ', this.selectedFiles);
      // Patch the partChangeId in the form
      if (this.data.existingData.partChange && this.data.existingData.partChange.id) {
        this.formGroup.patchValue({
          partChangeId: this.data.existingData.partChange.id,
        });
      }
      console.log(existingData);
      this.formGroup.patchValue(existingData);
    }
  }

  private parseDateWithoutTimeZone(date: string | Date): Date | null {
    if (!date) return null;
    const parsedDate = new Date(date);
    return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  }

  private initializeForm(): void {
    if (this.data.type === 'permits') {
      this.formGroup = this.fb.group({
        permitReceiptNo: ['', Validators.required],
        permitType: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        permitReceiptName: [''],
      });
    } else if (this.data.type === 'insurance') {
      this.formGroup = this.fb.group({
        insuranceType: ['', Validators.required],
        insuranceCompany: ['', Validators.required],
        insuranceNumber: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        insuranceReceiptName: [''],
      });
    } else if (this.data.type === 'fitness') {
      this.formGroup = this.fb.group({
        fitnessReceiptNO: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        fitnessReceiptName: [''],
      });
    } else if (this.data.type === 'road taxes') {
      this.formGroup = this.fb.group({
        roadTaxReceiptNo: ['', Validators.required],
        taxType: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: [''],
        taxReceiptName: [''],
      });
    } else if (this.data.type === 'pucs') {
      this.formGroup = this.fb.group({
        pucReceiptNo: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        pucReceiptName: [''],
      });
    }
    else if (this.data.type === 'part mapping') {
      this.formGroup = this.fb.group({
        serialNumber: ['', Validators.required],
        vendorName: ['', Validators.required],
        dateOfPurchase: [''],
        dateOfValidity: [''],
        vehicleKm: [''],
        partChangeId: ['']
      });
    }

  }

  onFileSelected(event: any, fileType: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (fileType === 'insuranceReceipt') {
        this.isFileSelected = true
        this.selectedFiles.insuranceReceipt = file;
      } else if (fileType === 'pucReceipt') {
        this.isFileSelected = true;
        this.selectedFiles.pucReceipt = file;
      } else if (fileType === 'taxReceipt') {
        this.isFileSelected = true
        this.selectedFiles.taxReceipt = file;
      } else if (fileType === 'fitnessReceipt') {
        this.isFileSelected = true
        this.selectedFiles.fitnessReceipt = file;
      } else if (fileType === 'permitReceipt') {
        this.isFileSelected = true;
        this.selectedFiles.permitReceipt = file;
      }
    }
  }

  uploadFitnessReceipt() {
    if (!this.selectedFiles.fitnessReceipt) {
      console.error('No file selected for upload.');
      return;
    }

    const file = this.selectedFiles.fitnessReceipt;

    this.fileUploadService.uploadFile(file).subscribe(
      (response) => {
        console.log('Upload response:', response);
      },
      (error) => {
        console.error('Upload error:', error);
      }
    );
  }

  // Helper function to add one day to the provided date
  private addOneDayToDate(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Adds one day
    return newDate;
  }


  updateData() {
    if (this.formGroup.valid) {

      const formData = this.formGroup.value;

      if (formData.startDate) {
        formData.startDate = this.formatDateToISO(formData.startDate);
      }
      if (formData.endDate) {
        formData.endDate = this.formatDateToISO(formData.endDate);
      }

      // Switchcase to handle form submission
      switch (this.data.type) {
        case 'permits':
          const formDatasPermits = new FormData();
          formData.vehicleId = this.data.vehicleId;
          formData.permitId = this.data.existingData.permitId;

          formDatasPermits.append(
            'vehiclePermit',
            new Blob([JSON.stringify(formData)], { type: 'application/json' })
          );

          if (this.selectedFiles.permitReceipt) {
            formDatasPermits.append('file', this.selectedFiles.permitReceipt);

          }


          this.premitService.updatePermit(formDatasPermits).subscribe((response: any) => {
            if (response.status) {
              Toast.fire({ icon: 'success', title: response.message })
            }
          }, (error: any) => {
            Toast.fire({ icon: 'error', title: error.error.message })
            console.log(error.error.message);
          })
          this.dialogRef.close(true)
          break;

        case 'insurance':
          console.log("in insurance");

          const formDatasInsurance = new FormData();
          formData.vehicleId = this.data.vehicleId;
          formData.insuranceId = this.data.existingData.insuranceId;

          formDatasInsurance.append(
            'vehicleInsurance',
            new Blob([JSON.stringify(formData)], { type: 'application/json' })
          );

          // if (this.selectedFiles.insuranceReceipt || this.formGroup.value.insuranceReceiptName) {
          //   const file = this.selectedFiles.insuranceReceipt ?? new Blob([], { type: 'text/plain' }); // Default Blob or fallback value
          //   formDatasInsurance.append('file', file);
          // }

          if (this.selectedFiles.insuranceReceipt) {
            formDatasInsurance.append('file', this.selectedFiles.insuranceReceipt);
          }
          this.insuranceService.updateInsurance(formDatasInsurance).subscribe((response: any) => {
            if (response.status) {
              Toast.fire({ icon: 'success', title: response.message })
            }
          }, (error: any) => {
            Toast.fire({ icon: 'error', title: error.error.message })
            console.log(error.error.message);
          })
          this.dialogRef.close(true)
          break;

        case 'fitness':
          this.uploadFitnessReceipt()
          const formDatasFitness = new FormData();
          formData.vehicleId = this.data.vehicleId;
          formData.fitnessId = this.data.existingData.fitnessId;

          formDatasFitness.append(
            'vehicleFitness',
            new Blob([JSON.stringify(formData)], { type: 'application/json' })
          );

          if (this.selectedFiles.fitnessReceipt) {
            console.log('Fitness Receipt : ', this.selectedFiles.fitnessReceipt);
            formDatasFitness.append('file', this.selectedFiles.fitnessReceipt);
          }

          this.fitnessService.updateFitness(formDatasFitness).subscribe((response: any) => {
            if (response.status) {
              Toast.fire({ icon: 'success', title: response.message })
            }
          }, (error: any) => {
            Toast.fire({ icon: 'error', title: error.error.message })
          })
          this.dialogRef.close(true)
          break;

        case 'road taxes':
          const formDatasRoadTaxes = new FormData();
          formData.vehicleId = this.data.vehicleId;
          formData.roadTaxId = this.data.existingData.roadTaxId;

          formDatasRoadTaxes.append(
            'vehicleRoadTax',
            new Blob([JSON.stringify(formData)], { type: 'application/json' })
          );

          // if (this.selectedFiles.taxReceipt || this.formGroup.value.taxReceiptName) {
          //   const file = this.selectedFiles.taxReceipt ?? new Blob([], { type: 'text/plain' }); // Default Blob or fallback value
          //   formDatasRoadTaxes.append('file', file);
          // }


          if (this.selectedFiles.taxReceipt) {
            formDatasRoadTaxes.append('file', this.selectedFiles.taxReceipt);
          }

          this.toadTaxService.updateRoadTax(formDatasRoadTaxes).subscribe((response: any) => {
            if (response.status) {
              Toast.fire({ icon: 'success', title: response.message })
            }
          }, (error: any) => {
            Toast.fire({ icon: 'error', title: error.error.message })
            console.log(error.error.message);
          })
          this.dialogRef.close(true)

          break;

        case 'pucs':
          const formDatasPucs = new FormData();
          formData.vehicleId = this.data.vehicleId;
          formData.pucId = this.data.existingData.pucId;

          formDatasPucs.append(
            'vehiclePUC',
            new Blob([JSON.stringify(formData)], { type: 'application/json' })
          );
          if (this.selectedFiles.pucReceipt) {
            formDatasPucs.append('file', this.selectedFiles.pucReceipt);
          }


          this.pucService.updatePUC(formDatasPucs).subscribe((response: any) => {
            if (response.status) {
              Toast.fire({ icon: 'success', title: response.message })
            }
          }, (error: any) => {
            Toast.fire({ icon: 'error', title: error.error.message })
            console.log(error.error.message);
          })
          this.dialogRef.close(true)

          break;

        case 'part mapping':


          const partchangdate = {
            "id": this.data.existingData.id,
            "serialNumber": this.formGroup.value.serialNumber,
            "vendorName": this.formGroup.value.vendorName,
            "vehiclekm": 0,
            "dateOfPurchase": this.addOneDayToDate(this.formGroup.value.dateOfPurchase),
            "dateOfValidity": this.addOneDayToDate(this.formGroup.value.dateOfValidity),
            "partChange": {
              "id": this.formGroup.value.partChangeId

            }
          }

          console.log("update part", partchangdate)


          this.mappingService.update(partchangdate).subscribe((response: any) => {
            if (response.status) {
              Toast.fire({ icon: 'success', title: response.message })
            }
          }, (error: any) => {
            Toast.fire({ icon: 'error', title: error.error.message })
            console.log(error.error.message);
          })
          this.dialogRef.close(true)

          break;

        default:
          console.error('Unknown document type');
          break;
      }
    } else {
      console.log('Form is invalid');
      this.dialogRef.close({ type: this.data.type, data: null });
    }
  }

  private formatDateToISO(date: string | Date): string {
    const parsedDate = new Date(date);
    return `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')}`;
  }

  closeDialog(): void {
    this.dialogRef.close(false)
  }
  showVehiclePart(): void {
    this.partChangeService.showParts().subscribe((res: any) => {
      console.log('List of parts', res);
      this.allparts = res;
      console.log(this.allparts);

    }, error => {
      console.error('Error fetching parts:', error);
    });
  }
}
