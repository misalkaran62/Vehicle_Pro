import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FitnessService } from 'src/app/services/documentService/fitness.service';

import { PermitService } from 'src/app/services/documentService/permit.service';
import { PucService } from 'src/app/services/documentService/puc.service';
import { RoadtaxService } from 'src/app/services/documentService/roadtax.service';
import { InsuranceService } from 'src/app/services/insurance.service';
import { Toast } from 'src/app/services/sweetalert';
import { FileUploadService } from '../file-upload.service';
import { PartchangeService } from 'src/app/services/partchange.service';
import { PartmappingService } from 'src/app/services/partmapping.service';

@Component({
  selector: 'app-add-document-dialog',
  templateUrl: './add-document-dialog.component.html',
  styleUrls: ['./add-document-dialog.component.css'],
})
export class AddDocumentDialogComponent {
  formGroup!: FormGroup;
  selectedFiles: {
    insuranceReceipt?: File;
    rcReceipt?: File;
    financeReceipt?: File;
    fitnessReceipt?: File;
    pucReceipt?: File;
    taxReceipt?: File;
    permitReceipt?: File;
  } = {};

  financeTypeData = ['loan', 'purchase', 'cash']; // Example options

  isFileSelected: boolean = false;
  dynamicData: any[] = [];
  allparts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string; vehicleId: number },
    private insuranceService: InsuranceService,
    private pucService: PucService,
    private toadTaxService: RoadtaxService,
    private fitnessService: FitnessService,
    private premitService: PermitService,
    private fileUploadService: FileUploadService,
    private partapi: PartchangeService,
    private partMappingService: PartmappingService
  ) {
    this.initializeForm();
    this.showVehiclePart();
    console.log(data);
  }

  // Initialize the form based on the type
  private initializeForm(): void {
    if (this.data.type === 'permit') {
      this.formGroup = this.fb.group({
        permitReceiptNo: ['', Validators.required],
        permitType: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
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
    } else if (this.data.type === 'roadTax') {
      this.formGroup = this.fb.group({
        roadTaxReceiptNo: ['', Validators.required],
        taxType: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: [''],
        taxReceiptName: [''],
      });
    } else if (this.data.type === 'puc') {
      this.formGroup = this.fb.group({
        pucReceiptNo: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        pucReceiptName: [''],
      });
    } else if (this.data.type === 'partMapping') {
      this.formGroup = this.fb.group({
        serialNumber: ['', Validators.required],
        vendorName: ['', Validators.required],
        dateOfPurchase: [''],
        dateOfValidity: [''],
        vehicleKm: [''],
        partChangeId:['']
      });

    }
  }

  onFileSelected(event: any, fileType: string) {
    const file: File = event.target.files[0];
    if (file) {
      console.log(this.selectedFiles);
      if (fileType === 'insuranceReceipt') {
        this.isFileSelected = true;
        this.selectedFiles.insuranceReceipt = file;
      } else if (fileType === 'pucReceipt') {
        this.isFileSelected = true;
        this.selectedFiles.pucReceipt = file;
      } else if (fileType === 'taxReceipt') {
        this.isFileSelected = true;
        this.selectedFiles.taxReceipt = file;
      } else if (fileType === 'fitnessReceipt') {
        this.isFileSelected = true;
        this.selectedFiles.fitnessReceipt = file;
      } else if (fileType === 'permitReceipt') {
        this.isFileSelected = true;
        this.selectedFiles.permitReceipt = file;
      }
    }
  }




  uploadFileIntoFolder(docType: string) {
    let file;

    // Check if a file exists for the selected docType
    switch (docType) {
      case 'permit':
        file = this.selectedFiles.permitReceipt;
        break;
      case 'insurance':
        file = this.selectedFiles.insuranceReceipt;
        break;
      case 'fitness':
        file = this.selectedFiles.fitnessReceipt;
        break;
      case 'roadTax':
        file = this.selectedFiles.taxReceipt;
        break;
      case 'puc':
        file = this.selectedFiles.pucReceipt;
        break;
      default:
        console.error('Invalid document type');
        return;
    }

    if (!file) {
      console.error(`No file selected for ${docType} upload.`);
      return;
    }

    // Upload the file
    this.uploadFile(file);
  }

  private uploadFile(file: File) {
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


  // Submit form data
  submit(): void {
    console.log('Form Submitted:', this.formGroup.value);
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      // Add one day to the startDate and endDate before submitting the form
      if (formData.startDate) {
        formData.startDate = this.addOneDayToDate(new Date(formData.startDate));
      }
      if (formData.endDate) {
        formData.endDate = this.addOneDayToDate(new Date(formData.endDate));
      }

      const convertedData = formData
      // Switch case to handle form submission based on 'data.type'
      console.log('Form Submitted:', convertedData);
      switch (this.data.type) {
        case 'permit':
          const formDatas = new FormData();

          formDatas.append(
            'vehiclePermit',
            new Blob([JSON.stringify(convertedData)], {
              type: 'application/json',
            })
          );
          if (this.selectedFiles.permitReceipt) {
            formDatas.append('file', this.selectedFiles.permitReceipt);
          }

          this.premitService
            .addNewPermit(formDatas, this.data.vehicleId)
            .subscribe(
              (response: any) => {
                if (response.status) {
                  Toast.fire({ icon: 'success', title: response.message });
                }
                this.dialogRef.close(true);
              },
              (error: any) => {
                Toast.fire({ icon: 'error', title: error.error.message });
                console.log(error.error.message);
              }
            );

          break;
        // this for the adding new insurance detail
        case 'insurance':
          // this.uploadFileIntoFolder('insurance')
          const formDatainsurance = new FormData();
          console.log(this.selectedFiles.insuranceReceipt);
          formDatainsurance.append(
            'vehicleInsurance',
            new Blob([JSON.stringify(convertedData)], {
              type: 'application/json',
            })
          );
          if (this.selectedFiles.insuranceReceipt) {
            formDatainsurance.append(
              'file',
              this.selectedFiles.insuranceReceipt
            );
          }

          this.insuranceService
            .addNewInsurance(formDatainsurance, this.data.vehicleId)
            .subscribe(
              (response: any) => {
                if (response.status) {
                  Toast.fire({ icon: 'success', title: response.message });
                  this.dialogRef.close(true);
                }
              },
              (error: any) => {
                Toast.fire({ icon: 'error', title: error.error.message });
                console.log(error.error.message);
              }
            );

          break;

        case 'fitness':
          // Handle 'fitness' specific logic (if needed)
          // this.uploadFileIntoFolder('fitness')

          const formDatafitness = new FormData();
          console.log(this.selectedFiles.fitnessReceipt);
          formDatafitness.append(
            'vehicleFitness',
            new Blob([JSON.stringify(convertedData)], {
              type: 'application/json',
            })
          );
          if (this.selectedFiles.fitnessReceipt) {
            formDatafitness.append('file', this.selectedFiles.fitnessReceipt);
          }

          this.fitnessService
            .addNewFitness(formDatafitness, this.data.vehicleId)
            .subscribe(
              (response: any) => {
                if (response.status) {
                  Toast.fire({ icon: 'success', title: response.message });
                  this.dialogRef.close(true);
                }
              },
              (error: any) => {
                Toast.fire({ icon: 'error', title: error.error.message });
                console.log(error.error.message);
              }
            );

          break;

        case 'roadTax':
          // Handle 'roadTax' specific logic
          // If 'LIFETIME' is selected, exclude 'endDate' or set it to null
          // this.uploadFileIntoFolder('roadTax')
          const formDataRoadTax = new FormData();
          console.log(this.selectedFiles.taxReceipt);
          formDataRoadTax.append(
            'vehicleRoadTax',
            new Blob([JSON.stringify(convertedData)], {
              type: 'application/json',
            })
          );
          if (this.selectedFiles.taxReceipt) {
            formDataRoadTax.append('file', this.selectedFiles.taxReceipt);
          }

          this.toadTaxService
            .addNewRoadTax(formDataRoadTax, this.data.vehicleId)
            .subscribe(
              (response: any) => {
                if (response.status) {
                  Toast.fire({ icon: 'success', title: response.message });
                  this.dialogRef.close(true);
                }
              },
              (error: any) => {
                Toast.fire({ icon: 'error', title: error.error.message });
                console.log(error.error.message);
              }
            );

          break;

        case 'puc':
          // Handle 'puc' specific logic (if needed)
          // this.uploadFileIntoFolder('puc')
          const formDatapuc = new FormData();
          console.log(this.selectedFiles.pucReceipt);
          formDatapuc.append(
            'vehiclePUC',
            new Blob([JSON.stringify(convertedData)], {
              type: 'application/json',
            })
          );
          if (this.selectedFiles.pucReceipt) {
            formDatapuc.append('file', this.selectedFiles.pucReceipt);
          }

          this.pucService.addNewPUC(formDatapuc, this.data.vehicleId).subscribe(
            (response: any) => {
              if (response.status) {
                Toast.fire({ icon: 'success', title: response.message });
              }
              this.dialogRef.close(true);
            },
            (error: any) => {
              Toast.fire({ icon: 'error', title: error.error.message });
              console.log(error.error.message);
            }
          );

          break;

        case 'partMapping':


        const partchangdate={
     
          "serialNumber": this.formGroup.value.serialNumber,
          "vendorName": this.formGroup.value.vendorName,
          "vehiclekm": 0,
          "dateOfPurchase":this.addOneDayToDate(this.formGroup.value.dateOfPurchase),
          "dateOfValidity":this.addOneDayToDate( this.formGroup.value.dateOfValidity),
          "partChange": {
            "id": this.formGroup.value.partChangeId
            
          }
        }

        console.log("send data to server",partchangdate)
          console.log("partchang data", this.formGroup.value);


          this.partMappingService
            .createPartMapping(partchangdate, this.data.vehicleId)
            .subscribe(
              (response: any) => {
                if (response.status) {
                  Toast.fire({ icon: 'success', title: response.message });
                }
                this.dialogRef.close(true);
              },
              (error: any) => {
                Toast.fire({ icon: 'error', title: error.error.message });
                console.log(error);
              }
            );

          break;
        // this for the adding new insurance detail

        default:
          // Default case if no specific type is matched (optional)
          console.log('Unknown form type');
          this.dialogRef.close({ type: 'unknown', data: formData });
          break;
      }
    } else {
      console.log('Form is invalid');
      this.dialogRef.close(false);
    }
  }

  // showVehiclePart() {
  //   this.partapi.showParts().subscribe((res: any) => {
  //     console.log('list of parts', res);
  //     this.allparts=res;
  //   })
  // }
  showVehiclePart(): void {
    this.partapi.showParts().subscribe(
      (res: any) => {
        // console.log('List of parts', res);
        this.allparts = res;
        // console.log(this.allparts);
      },
      (error) => {
        console.error('Error fetching parts:', error);
      }
    );
  }
  close(){
    this.dialogRef.close(true)
  }
}
