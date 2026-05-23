import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicingService } from '../services/servicing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { Toast } from 'src/app/services/sweetalert';
import { MatStepper } from '@angular/material/stepper';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { ViewdocumentComponent } from '../vehicle/viewdocument/viewdocument.component';
import { MatDialog } from '@angular/material/dialog';
import { PartchangeService } from '../services/partchange.service';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-add-servicing',
  templateUrl: './add-servicing.component.html',
  styleUrls: ['./add-servicing.component.css']
})
export class AddServicingComponent implements OnInit {



  @ViewChild(MatStepper) stepper!: MatStepper;
  selectedServicingType: string | undefined;
  isAccident: boolean = false;
  isFile: boolean = false;
  pageForm: any
  pagedata: any;
  allparts: any;
  currentServiceData: any;
  updateForm: any;
  servicingForm: any;
  rowid: any;
  formData: any;
  vehicleId: any;
  vehicleData: any;
  allvehicleid: any;
  isUpdate: boolean = false;
  isPartChange: boolean = false;
  servicingTypes = ['REGULAR', 'PART_CHANGE', 'ACCIDENT'];

  servicingTypess = ['REGULAR', 'PART_CHANGE'];

  accident_servicing = ['ACCIDENT', 'PART_CHANGE']

  // completionStatus: string[] = ['SERVICING_RAISED', 'ON_SERVICING', 'SERVICING_COMPLETED'];
  onServicing = "ON_SERVICING";
  servicingComplete = "SERVICING_COMPLETED"
  filteredOptions: string[] = [];
  // is_approved: boolean = false;
  status: string = 'waiting';
  selectedFiles: { changepartimg?: File, paymentReceipt?: File } = {};
  forupdate: any;
  isCreateMode: boolean = true;
  paymentDetails: any = {};
  showAlert: boolean = false;
  changepartimg: any;
  commanpart: any;
  comman: any;

  processedData: any = null;  // Variable to hold the processed data
  selectedIndex: number = -1; // To track the selected index
  fileURL: any;
  imageURLs:any;
  partmapping: any;
  oldpart: any;

  constructor(
    private fb: FormBuilder,
    private active: ActivatedRoute,
    private service_api: ServicingService,
    private vehicleapi: VehicleService,
    private router: Router,
    private partapi: PartchangeService,
    private dialog: MatDialog) { }

  ngOnInit() {
     this.showparts();
    
    this.updateForm = this.fb.group({
      vehicleReg: ['', Validators.required],
      servicingType: [this.selectedServicingType, Validators.required],
      servicingVendor: ['', Validators.required],
      servicingDate: ['', Validators.required],
      lastServicing: [''],
      servicingAmount: [''],
      servicingDescription: [''],
      status: [''],
      servicingId: [''],
      is_approved: [''],
      // cost: ['', Validators.required],
      completionStatus: ['SERVICING_RAISED'],
      nextKmServicing: ['',[Validators.required, Validators.min(0)]],
      withGST: [0],
      withoutGST: [0],
      cost: [{ value: 0 }, Validators.required],
      oldPartMappings: this.fb.array([
        this.fb.group({
          id: [''],
          serialNumber: ['', Validators.required],
          vendorName: ['', Validators.required],
          dateOfPurchase: ['', Validators.required],
          dateOfValidity: ['', Validators.required],
          partChange: this.fb.group({
            id: [''],
            partName: ['', Validators.required],
            brandName: ['', Validators.required],
            remark: [''],
          }),
        }),
      ]),
      newPartMappings: this.fb.array([
        this.fb.group({
          serialNumber: ['', Validators.required],
          vendorName: ['', Validators.required],
          dateOfPurchase: ['', Validators.required],
          dateOfValidity: ['', Validators.required],
          partChange: this.fb.group({
            id: [''],
            partName: ['', Validators.required],
            brandName: ['', Validators.required],
            remark: [''],
          }),
        }),
      ]),
    });
 
   
    this.updateForm.get('servicingType')?.valueChanges.subscribe((selectedType: string) => {
      this.updateFilteredOptions(selectedType);
      this.isAccident = selectedType === 'ACCIDENT';
    });

    this.rowid = this.active.snapshot.params['id']
    const numericId: number = this.rowid ? +this.rowid : NaN; // If 'id' is null, return NaN
    if (this.rowid !== null && this.rowid !== undefined) {
      this.findbyId(numericId);
      console.log("numericId:", numericId);
      this.rowid = numericId
      console.log("on ngonit ...rowid", this.rowid);
      this.isUpdate = true;
    }
    console.log("vehicle patch value", this.updateForm.value);
    // -----------------servicing id get -------------------
    this.service_api.getvehicleid(this.rowid).subscribe((res) => {
      console.log("vehicle id", res);
      this.vehicleId = res;
      this.getVehicleId(this.vehicleId);
    })

    // ---------------------vehicle id---------------
    this.vehicleapi.showAllVehicle().subscribe(params => {
      console.log('shoiwallvehicle', params);
      this.allvehicleid = params
      console.log('shoiwallvehicle allvehicle ', this.allvehicleid);
    });
    this.findImage();
  }
  findbyId(id: number) {
    this.service_api.getOneServicing(id).subscribe((res) => {
      console.log("updated data by id ", res);
      this.forupdate = res
      this.selectedServicingType = res.servicingType
      if (res) {
        const servicingData = res;

        this.currentServiceData = res;
        console.log("current servicing data", this.currentServiceData);

        this.updateForm.patchValue({
          servicingId: servicingData?.servicingId,
          servicingType: servicingData?.servicingType,
          servicingVendor: servicingData?.servicingVendor,
          is_approved: servicingData?.approved,

          servicingDate: servicingData?.servicingDate ? this.formatDate(servicingData.servicingDate) : null,
          lastServicing: servicingData?.lastServicing ? this.formatDate(servicingData.lastServicing) : null,
          status: servicingData?.status,
          cost: servicingData?.cost,
          nextKmServicing: servicingData?.nextKmServicing,
          completionStatus: 'SERVICING_RAISED',
          servicingDescription: servicingData?.servicingDescription,

        })
        console.log("pact values...... value", this.updateForm.value);
        console.log('service type yaha hai ; ', this.selectedServicingType);

      }
    })

  }
  getVehicleId(id: number) {
    this.vehicleapi.findByVehicleId(id).subscribe((res) => {
      // console.log("vehicle data=",res);
      if (res) {
        this.vehicleData = res;
        this.partmapping=res.partMappings;
console.log('part mapping data',this.partmapping);

        console.log("vehicle data", this.vehicleData);

        console.log("vehicle dataaaaaaaa", this.vehicleData)
        this.updateForm.patchValue({
          vehicleReg: this.vehicleData?.vehicleReg,
        })
      }
    })


    // here is we will find all part change image


  }

  onServicingTypeChange() {
    this.selectedServicingType = this.updateForm.value;
    this.formData = this.updateForm.value;
    // console.log("formdataaaaa onssubmit", this.formData)
    this.isAccident = this.updateForm.get('servicingType')?.value === 'ACCIDENT';
    console.log(this.selectedServicingType);
  }

    // ------NgOnit-----------------/
    showparts() {
      this.partapi.showParts().subscribe((res) => {
        console.log('showparts..', res);
        this.allparts = res;
      })
    }

    onOldPartSelected(selectedPart: any): void {
      if (selectedPart) {
        console.log('Selected part:', selectedPart);
        this.oldpart = selectedPart;
        // Access the FormArray
        const oldPartMappings = this.updateForm.get('oldPartMappings') as FormArray;
        // Clear the FormArray to reset it (only pushing selected part)
        oldPartMappings.clear();
        // Push the selected part into the FormArray
        oldPartMappings.push(
          this.fb.group({
            id: [selectedPart.id || ''],
            serialNumber: [selectedPart.serialNumber || '', Validators.required],
            vendorName: [selectedPart.vendorName || '', Validators.required],
            dateOfPurchase: [selectedPart.dateOfPurchase || '', Validators.required],
            dateOfValidity: [selectedPart.dateOfValidity || '', Validators.required],
            partChange: this.fb.group({
              id: [selectedPart.partChange?.id || ''],
              partName: [selectedPart.partChange?.partName || '', Validators.required],
              brandName: [selectedPart.partChange?.brandName || '', Validators.required],
              remark: [selectedPart.partChange?.remark || ''],
            }),
          })
        );
        console.log('Pushed selected part to oldPartMappings:', oldPartMappings.value);
      }
    }

    newPart(): FormArray {
      return this.updateForm.get('newPartMappings') as FormArray;
    }
    onPartChange(event: MatSelectChange, index: number) {
      console.log('Selection Event:', event);
      const selectedPartId = event.value;
      const selectedPart = this.allparts.find((part: { id: any }) => part.id === selectedPartId);
      if (selectedPart) {
        console.log('Selected Part Details:', selectedPart);
        // Get the form array and specific part mapping form group
        const newParts = this.updateForm.get('newPartMappings') as FormArray;
        const partFormGroup = newParts.at(index) as FormGroup;
        console.log('Before update - newParts:', newParts.value);
        // Update form values correctly
        partFormGroup.patchValue({
          serialNumber: selectedPart.serialNumber || '',
          vendorName: selectedPart.vendorName || '',
          dateOfPurchase: selectedPart.dateOfPurchase || '',
          dateOfValidity: selectedPart.dateOfValidity || '',
          partChange: {
            id: selectedPart.id || '',
            partName: selectedPart.partName || '',
            brandName: selectedPart.brandName || '',
            remark: partFormGroup.get('partChange.remark')?.value || '' // Preserve existing remark
          }
        });
        console.log('After update - newParts:', newParts.value);
      } else {
        console.warn('Selected Part not found in allparts!');
      }
    }

  findImage(){
    // alert(this.currentServiceData);
    console.log('find image ',this.currentServiceData.partChangeNames);
    for (let i = 0; i < this.currentServiceData.partChangeNames.length; i++) {
      const fileName = this.currentServiceData.partChangeNames[i];
      console.log(`Processing file ${i + 1}: ${fileName}`);
      this.processFile(this.rowid,i);
  }
  }

  processFile(servicingid: number, index: number): void {
    console.log(`Processing file: ${servicingid}, index: ${index}`);
    this.selectedIndex = index;  // Track the selected index
    // Initialize the array to store image URLs
    this.imageURLs = [];  // Clear the previous images before fetching new ones
    // Call the service method to fetch related data (multiple images in this case)
    this.service_api.findByIdImage(servicingid, index).subscribe({
      next: (data: any) => {
            const objectURL = URL.createObjectURL(data);
            this.imageURLs.push(objectURL);  // Add each image URL to the array
      },
      error: (err) => {
        console.error('Error loading document images', err);
      },
    });
  }
  
  get servicingmethod(): FormGroup {
    return this.updateForm.get('vehicleInfo') as FormGroup;
  }

  formatDate(dateStr: any): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    console.log("coverted day..", day);
    return `${year}-${month}-${day}`;
  }
  formatFormData(formData: any): any {
    // Helper function to format date
    const formatDate = (dateStr: any): string | null => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatFields = (fields: any): any[] => {
      if (Array.isArray(fields)) {
        return fields.map((field: any) => ({
          ...field,
          servicingDate: field.servicingDate ? formatDate(field.servicingDate) : null,
          lastServicing: field.lastServicing ? formatDate(field.lastServicing) : null,
        }));
      } else if (fields && typeof fields === 'object') {
        return [{
          ...fields,
          servicingDate: fields.servicingDate ? formatDate(fields.servicingDate) : null,
          lastServicing: fields.lastServicing ? formatDate(fields.lastServicing) : null
        }];
      } else {
        console.warn('Expected an object or array of fields, but got:', fields);
        return [];
      }
    };

    return {
      approved: formData.is_approved,
      servicingVendor: formData.servicingVendor,
      servicingType: formData.servicingType,
      servicingDate: formData.servicingDate,
      lastServicing: formData.lastServicing,
      status: formData.is_approved ? true : false,
      cost: formData.cost,
      nextKmServicing: formData.nextKmServicing,
      completionStatus: formData.completionStatus,
      servicingDescription: formData.servicingDescription,
       oldPartMappings: formData.oldPartMappings
      ? {
          serialNumber: formData.oldPartMappings.serialNumber || '',
          vendorName: formData.oldPartMappings.vendorName || '',
          dateOfPurchase: formData.oldPartMappings.dateOfPurchase || '',
          dateOfValidity: formData.oldPartMappings.dateOfValidity || '',
          partChange: {
            id: formData.oldPartMappings.partChange?.id || '',
            partName: formData.oldPartMappings.partChange?.partName || '',
            brandName: formData.oldPartMappings.partChange?.brandName || '',
          },
        }
      : null, // Set to `null` if `oldPartMappings` is missing

    newPartMappings: formData.newPartMappings
      ? {
          serialNumber: formData.newPartMappings.serialNumber || '',
          vendorName: formData.newPartMappings.vendorName || '',
          dateOfPurchase: formData.newPartMappings.dateOfPurchase || '',
          dateOfValidity: formData.newPartMappings.dateOfValidity || '',
          partChange: {
            id: formData.newPartMappings.partChange?.id || '',
            partName: formData.oldPartMappings.partChange?.partName || '',
            brandName: formData.oldPartMappings.partChange?.brandName || '',
          },
        }
      : null,
    };
  }

  onFileSelected(event: any, fileType: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (fileType === 'changepartimg') {
        this.selectedFiles.changepartimg = file;
      } else if (fileType === 'paymentReceipt') {
        this.selectedFiles.paymentReceipt = file;
      }
    }
  }
  // --------------------------------------------------
  editServicing(data?:any) {
    console.log('printing upcomming data',data);
    
    const formData = data;
    // const convertedData = this.formatFormData(data);
    // console.log('coverted data... today',convertedData);
    if (this.isUpdate) {
      data.servicingId = this.rowid;
      const submitdata = new FormData();
      console.log('coverted  submited data... today', submitdata);
      submitdata.append('vehicleServicing', new Blob([JSON.stringify(data)], { type: 'application/json' }));
      console.log('SELECTED FILE', this.selectedFiles.paymentReceipt
      )
      if (this.selectedFiles.paymentReceipt) {
        submitdata.append('paymentReceipt', this.selectedFiles.paymentReceipt)
      }
      if (this.selectedFiles.changepartimg) {
        submitdata.append('partChange', this.selectedFiles.changepartimg)
      }
      console.log('updatinggg process', submitdata);
      this.service_api.updateServicing(submitdata).subscribe((response: any) => {
        Toast.fire({ icon: 'success', title: response.message });
        console.log("update ho na", response);
        console.log("check", response)
        if (response.status) {
          this.updateForm.reset();
          this.router.navigate(['/dashboard/servicing'])
        }
      });
    } else {
      this.service_api.insertdata(data).subscribe((response: any) => {
        Toast.fire({ icon: 'success', title: response.message });
        if (response.status) {
          this.updateForm.reset();
          this.router.navigate(['/dashboard/servicing'])
        }
      });
    }
  }
  // submitpage() {
  //   this.editServicing();
  // }
  sendToServicng(stype: any) {
    console.log("stype", stype.servicingType);
    // console.log(`Sending servicing type: ${type}`);
    this.service_api.servicingMode(this.rowid, this.onServicing,).subscribe((res:any) => {
      console.log("mode change", res);
      Toast.fire({
        icon:"success",
        title:res.message
      })
      this.updateForm.patchValue({
        completionStatus: this.onServicing
      });
      console.log("servicing mod check");
      this.router.navigate(['/dashboard/servicing']);
    })
    if (stype.servicingType === 'PART_CHANGE') {
      Swal.fire({
        title: 'Waiting for Approval',
        text: 'Approval is required to proceed with PART_CHANGE servicing.',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateForm.patchValue({
            completionStatus: this.onServicing
          });
          this.editServicing();
        }
      });
    } else {
      this.updateForm.patchValue({
        completionStatus: this.onServicing
      });
      this.editServicing();
    }
  }
  updateFilteredOptions(selectedType: string) {
    if (selectedType === 'REGULAR') {
      this.filteredOptions = ['REGULAR', 'PART_CHANGE'];
    } else if (selectedType === 'ACCIDENT') {
      this.filteredOptions = ['ACCIDENT'];
    } else {
      this.filteredOptions = [];
    }
  }

  approveServicing() {
    Swal.fire({
      title: 'Waiting for Approval',
      text: 'Approval is required to proceed with Accident servicing.',
      icon: 'warning',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the editServicing method after user clicks "OK"
        this.editServicing();
      }
    })
  }
  backbutton() {
    this.router.navigate(['/dashboard/servicing'])
  }
  // -------------------------------------------
  accidentServicing(stype: any) {
    this.service_api.servicingMode(this.rowid, this.onServicing,).subscribe((res) => {
      console.log("mode change", res);
      this.updateForm.patchValue({
        completionStatus: this.onServicing
      });
    })
    if (stype.servicingType === 'PART_CHANGE') {
      Swal.fire({
        title: 'Waiting for Approval',
        text: 'Approval is required to proceed with PART_CHANGE servicing.',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateForm.patchValue({
            completionStatus: this.onServicing
          });
          this.editServicing();
        }
      });
    }
  }

  isFileUploadStep(): boolean {
    const servicingType = this.updateForm.get('servicingType')?.value;
    return servicingType === 'PART_CHANGE' || servicingType === 'ACCIDENT';
  }
  updateTotalAmount() {
    const withGST = +this.updateForm.get('withGST')!.value || 0;
    const withoutGST = +this.updateForm.get('withoutGST')!.value || 0;
    const totalAmount = withGST + withoutGST;
    this.updateForm.patchValue({ cost: totalAmount });
  }
  onSubmit() {
    console.log('this.updateForm for partmaping',this.updateForm.value);
   console.log("servcing close object",this.servicingComplete)
   this.editServicing(this.updateForm.value);
   console.log('stufiing');
   this.service_api.servicingMode(this.rowid, this.servicingComplete,).subscribe((res) => {
     this.updateForm.patchValue({ completionStatus: this.servicingComplete });
   })
 }

}