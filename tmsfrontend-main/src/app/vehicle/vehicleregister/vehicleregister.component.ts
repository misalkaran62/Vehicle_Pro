import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BranchService } from 'src/app/services/branch.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Toast } from 'src/app/services/sweetalert';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicleregister',
  templateUrl: './vehicleregister.component.html',
  styleUrls: ['./vehicleregister.component.css']
})

export class VehicleregisterComponent implements OnInit {

  uploadedInsuranceFiles: File[][] = []; // Tracks uploaded insurance files
  uploadedPermitFiles: File[][] = []; // Tracks uploaded permit files

  isUpdate: boolean = false;
  vehicleForm: any;
  vehicleFinances: any;
  vehicleTypes: string[] = ['LMV', 'HMV', 'HGMV', 'HTV'];
  selectedFiles: { vehicleImage?: File, rcReceipt?: File, repaymentSchedule?: File, sanctionLetter?: File, fitnessReceipt?: File, pucReceipt?: File, taxReceipt?: File } = {};
  branches: any = [];
  financeTypeData = ['cash', 'loan']
  colorOptions = ['White', 'Black', 'Gray', 'Silver', 'Blue', 'Red', 'Brown', 'Green', 'Beige', 'Yellow', 'Gold', 'Orange', 'Purple', 'Pink', 'Maroon', 'Turquoise', 'Bronze', 'Copper', 'Navy', 'Charcoal', 'Teal', 'Lime', 'Burgundy', 'Magenta', 'Ivory'];
  fuelTypes: string[] = ['PETROL', 'DIESEL', 'POWER_PETROL', 'CNG', 'PETROL_CNG', 'DIESEL_CNG', 'POWER_PETROL_CNG'];
  fuelMeasurements: string[] = ['LITERS', 'KILOGRAM', 'LITERS_KILOGRAM'];
  vehicleId: number = 0;
  existingData:any;
vehicleData:any;
  constructor(private fb: FormBuilder, private branchSer: BranchService, private vehicleService: VehicleService, private route: ActivatedRoute, private router: Router) {
    this.getActiveBranch();

    this.vehicleForm = this.fb.group({
      vehicleInfo: this.fb.group({
        vehicleType: ['', Validators.required],
        vehicleBrand: [''],
        vehicleModel: [''],
        branch: ['', Validators.required],
        manufacturingYear: [''],
        color: [''],
        vehicleImage: [''],
        registrationNumber: ['', Validators.required],
        engineNumber: [''],
        chasisNumber: [''],
        fuelType: ['', Validators.required],
        fuelMeasurement: ['', Validators.required],
        truckUsages: ['', Validators.required],
        secondaryMeter: [false],
        ownerType: ['',Validators.required],
        startDate: [''],
        rcbookName: [''],
        rcBookReceiptNo: [''],
        id: ['']
        // formFillStatus: [''],


      }),

      vehicleFinances: this.fb.group({
        finance_id: [''],
        financeType: ['',],
        purchaseAmount: ['',[Validators.min(0)]],
        purchaseDate: [''],
        financeName: [''],
        startDate: [''],
        endDate: [''],
        emiAmount: [''],
        rateOfInterest: [''],
        emiDate: [''],
        forceClosureAmount: [''],
        forceClosureDate: [''],
        nocReceiptName: ['']

      }),



      vehicleFitnesses: this.fb.group({
        fitnessId: [],
        fitnessReceiptNO: ['',],
        startDate: [''],
        endDate: [''],
        fitnessReceiptName: ['']
      }),
      vehicleInsurances: this.fb.array([this.createFormGroup('insurance')]),
      vehiclePermits: this.fb.array([this.createFormGroup('permit')]),


      vehiclePUCs: this.fb.group({
        pucId: [''],
        pucReceiptNo: [''],
        startDate: [''],
        endDate: [''],
        pucReceiptName: ['']
      }),
      vehicleRoadTaxes: this.fb.group({
        roadTaxId: [''],
        roadTaxReceiptNo: [''],
        taxType: [''],
        startDate: [''],
        endDate: [''],
        taxReceiptName: ['']
      }),
      vehicleServicings: this.fb.group({
        servicingId: [''],
        nextKmServicing: ['', [Validators.required,Validators.min(0)]],
        servicingVendor: [''],
        servicingType: ['REGULAR'],
        servicingDate: ['', Validators.required],
        servicingDescription: ['']
      })
    });
  }

  ngOnInit() {

    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.vehicleId = id ? +id : NaN; // If 'id' is null, return NaN
    if (id !== null && id !== undefined) {
      this.findVehicleById(this.vehicleId);
      this.isUpdate = true;

    }

    console.log("vehicle patch value", this.vehicleForm)
  }


  //  this for the getting all branch


  getActiveBranch() {
    this.branchSer.getBranches().subscribe((response: any) => {
      this.branches = response;
    });
  }



  // this for the find vehicle by id
  findVehicleById(id: number) {
    this.vehicleService.findByVehicleId(id).subscribe((response: any) => {
      console.log(response)
      if (!response) {
        return;
      }

      this.existingData=response;
    const vehicleData = response;
      const patchData: any = {
        // Basic information
        vehicleInfo: {
          vehicleType: vehicleData.vehicleType,
          vehicleBrand: vehicleData.vehicleBrand,
          vehicleModel: vehicleData.vehicleModel,
          branch: vehicleData.branch?.id,
          manufacturingYear: vehicleData.vehicleDescription?.manufacturingYear,
          color: vehicleData.vehicleDescription?.color,
          vehicleImage: vehicleData.vehicleImageName,
          registrationNumber: vehicleData.vehicleDescription?.registrationNumber,
          engineNumber: vehicleData.vehicleDescription?.engineNumber,
          chasisNumber: vehicleData.vehicleDescription?.chasisNumber,
          fuelType: vehicleData.vehicleDescription?.fuelType,
          fuelMeasurement: vehicleData.vehicleDescription?.fuelMeasurement,
          truckUsages: vehicleData.vehicleDescription?.truckUsages,
          secondaryMeter: vehicleData.vehicleDescription?.secondaryMeter,
          ownerType: vehicleData.vehicleRCBook?.ownerType,
          startDate: vehicleData.vehicleRCBook?.startDate ? this.formatDate(vehicleData.vehicleRCBook.startDate) : null,
          rcbookName: vehicleData.vehicleRCBook?.rcbookName,
          rcBookReceiptNo: vehicleData.vehicleRCBook?.rcBookReceiptNo,
          id: vehicleData.vehicleRCBook?.id
        },
      };

      // Conditional patching for vehicle finances
      if (vehicleData.vehicleFinances?.length > 0) {
        patchData.vehicleFinances = {
          finance_id: vehicleData.vehicleFinances[0]?.finance_id,
          financeType: vehicleData.vehicleFinances[0]?.financeType,
          purchaseAmount: vehicleData.vehicleFinances[0]?.purchaseAmount,
          purchaseDate: vehicleData.vehicleFinances[0]?.purchaseDate ? this.formatDate(vehicleData.vehicleFinances[0]?.purchaseDate) : null,
          financeName: vehicleData.vehicleFinances[0]?.financeName,
          startDate: vehicleData.vehicleFinances[0]?.startDate ? this.formatDate(vehicleData.vehicleFinances[0]?.startDate) : null,
          endDate: vehicleData.vehicleFinances[0]?.endDate ? this.formatDate(vehicleData.vehicleFinances[0]?.endDate) : null,
          emiAmount: vehicleData.vehicleFinances[0]?.emiAmount,
          rateOfInterest: vehicleData.vehicleFinances[0]?.rateOfInterest,
          emiDate: vehicleData.vehicleFinances[0]?.emiDate ,
          forceClosureAmount: vehicleData.vehicleFinances[0]?.forceClosureAmount,
          nocReceiptName: vehicleData.vehicleFinances[0]?.nocReceiptName,
          forceClosureDate: vehicleData.vehicleFinances[0]?.forceClosureDate ? this.formatDate(vehicleData.vehicleFinances[0]?.forceClosureDate) : null,
        };
      }

      // Conditional patching for vehicle fitnesses
      if (vehicleData.vehicleFitnesses?.length > 0) {
        patchData.vehicleFitnesses = {
          fitnessId: vehicleData.vehicleFitnesses[0]?.fitnessId,
          fitnessReceiptNO: vehicleData.vehicleFitnesses[0]?.fitnessReceiptNO,
          startDate: vehicleData.vehicleFitnesses[0]?.startDate ? this.formatDate(vehicleData.vehicleFitnesses[0]?.startDate) : null,
          endDate: vehicleData.vehicleFitnesses[0]?.endDate ? this.formatDate(vehicleData.vehicleFitnesses[0]?.endDate) : null,
          fitnessReceiptName: vehicleData.vehicleFitnesses[0]?.fitnessReceiptName,
        };
      }

      // Conditional patching for vehicleRoadTaxes
      if (vehicleData.vehicleRoadTaxes?.length > 0 && Object.values(vehicleData.vehicleRoadTaxes[0]).some(val => val)) {
        patchData.vehicleRoadTaxes = {
          roadTaxId: vehicleData.vehicleRoadTaxes[0]?.roadTaxId,
          roadTaxReceiptNo: vehicleData.vehicleRoadTaxes[0]?.roadTaxReceiptNo,
          taxType: vehicleData.vehicleRoadTaxes[0]?.taxType,
          taxReceiptName: vehicleData.vehicleRoadTaxes[0]?.taxReceiptName,
          startDate: vehicleData.vehicleRoadTaxes[0]?.startDate ? this.formatDate(vehicleData.vehicleRoadTaxes[0]?.startDate) : null,
          endDate: vehicleData.vehicleRoadTaxes[0]?.endDate ? this.formatDate(vehicleData.vehicleRoadTaxes[0]?.endDate) : null,
        };
      }

      // Conditional patching for vehicleServicings
      if (vehicleData.vehicleServicings?.length > 0 && Object.values(vehicleData.vehicleServicings[0]).some(val => val)) {
        patchData.vehicleServicings = {
          servicingId: vehicleData.vehicleServicings[0]?.servicingId,
          nextKmServicing: vehicleData.vehicleServicings[0]?.nextKmServicing,
          servicingVendor: vehicleData.vehicleServicings[0]?.servicingVendor,
          servicingDate: vehicleData.vehicleServicings[0]?.servicingDate ? this.formatDate(vehicleData.vehicleServicings[0]?.servicingDate) : null,
          servicingDescription: vehicleData.vehicleServicings[0]?.servicingDescription,
        };
      }
      if (vehicleData.vehiclePUCs?.length > 0 && Object.values(vehicleData.vehiclePUCs[0]).some(val => val)) {
        patchData.vehiclePUCs = {
          pucId: vehicleData.vehiclePUCs[0]?.pucId,
          pucReceiptNo: vehicleData.vehiclePUCs[0]?.pucReceiptNo,
          pucReceiptName: vehicleData.vehiclePUCs[0]?.pucReceiptName,
          startDate: vehicleData.vehiclePUCs[0]?.startDate ? this.formatDate(vehicleData.vehiclePUCs[0]?.startDate) : null,
          endDate: vehicleData.vehiclePUCs[0]?.endDate ? this.formatDate(vehicleData.vehiclePUCs[0]?.endDate) : null,
        };
      }

      // Patch the collected data into the form
      this.vehicleForm.patchValue(patchData);

      // Handle vehicle insurances
      if (vehicleData.vehicleInsurances?.length > 0) {
        this.patchVehicleInsurances(vehicleData.vehicleInsurances);
      }


      // Handle vehicle permits
      if (vehicleData.vehiclePermits?.length > 0) {
        this.patchVehiclePermits(vehicleData.vehiclePermits);
      }
    });
  }

  // create form group for multiple form like that insurance and permit

  createFormGroup(type: string): FormGroup {
    const groupConfig: { [key: string]: any } = {
      insurance: {
        insuranceId: [''],
        insuranceType: [''],
        insuranceCompany: [''],
        insuranceNumber: [''],
        startDate: [''],
        endDate: [''],
        insuranceReceiptName: ['']
      },
      permit: {
        permitId: [],
        permitReceiptNo: [''],
        permitType: [''],
        startDate: [''],
        endDate: [''],
        permitReceiptName: ['']
      }

    };
    return this.fb.group(groupConfig[type]); // TypeScript won't complain because `groupConfig` is indexed with strings
  }


  // this for the all vehicle info group data
  get vehicleInfo(): FormGroup {
    return this.vehicleForm.get('vehicleInfo') as FormGroup;
  }


  get vehicleInsurances(): FormArray {
    return this.vehicleForm.get('vehicleInsurances') as FormArray;
  }
  get vehiclePermits(): FormArray {
    return this.vehicleForm.get('vehiclePermits') as FormArray;
  }

  // this for the fetching data form the insurance 

  patchVehicleInsurances(vehicleInsurancesData: any[]) {
    const vehicleInsurancesArray = this.vehicleInsurances;
    vehicleInsurancesArray.clear();  // Clear any existing form controls

    // If no insurance data exists, add one empty form group
    if (!vehicleInsurancesData || vehicleInsurancesData.length === 0) {
      vehicleInsurancesArray.push(this.createFormGroup('insurance'));
    } else {
      // Add new insurance data to the form array
      vehicleInsurancesData.forEach((insurance) => {
        const insuranceFormGroup = this.createFormGroup('insurance');
        insuranceFormGroup.patchValue({
          insuranceId: insurance.insuranceId,
          insuranceType: insurance.insuranceType,
          insuranceNumber: insurance.insuranceNumber,
          insuranceCompany: insurance.insuranceCompany,
          insuranceReceiptName: insurance.insuranceReceiptName,
          startDate: insurance.startDate ? this.formatDate(insurance.startDate) : null,
          endDate: insurance.endDate ? this.formatDate(insurance.endDate) : null,
        });
        vehicleInsurancesArray.push(insuranceFormGroup);
      });
    }
  }


  // this for the fetching data from permit
  patchVehiclePermits(vehiclePermitsData: any[]) {
    const vehiclePermitsArray = this.vehiclePermits;
    vehiclePermitsArray.clear(); // Clear any existing form controls

    // If no permit data exists, add one empty form group
    if (!vehiclePermitsData || vehiclePermitsData.length === 0) {
      vehiclePermitsArray.push(this.createFormGroup('permit'));
    } else {
      // Add new permit data to the form array
      vehiclePermitsData.forEach((permit) => {
        const permitFormGroup = this.createFormGroup('permit');
        permitFormGroup.patchValue({
          permitId: permit?.permitId,
          permitReceiptNo: permit?.permitReceiptNo,
          permitType: permit?.permitType,
          permitReceiptName: permit?.permitReceiptName,
          startDate: permit.startDate ? this.formatDate(permit.startDate) : null,
          endDate: permit.endDate ? this.formatDate(permit.endDate) : null,
        });
        vehiclePermitsArray.push(permitFormGroup);
      });
    }
  }

  // Add and add form controls dynamically
  addGroup(type: string): void {
    const group = this.createFormGroup(type);
    const arrayName = this.getArrayName(type);
    (this.vehicleForm.get(arrayName) as FormArray).push(group);
  }
  // Add and remove form controls dynamically
  removeGroup(type: string, index: number): void {
    const arrayName = this.getArrayName(type);
    const formArray = this.vehicleForm.get(arrayName) as FormArray;
    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
  }








  getArrayName(type: string): string {
    switch (type) {
      case 'finance': return 'vehicleFinances';
      case 'fitness': return 'vehicleFitnesses';
      case 'insurance': return 'vehicleInsurances';
      case 'permit': return 'vehiclePermits';
      case 'puc': return 'vehiclePUCs';
      case 'roadTax': return 'vehicleRoadTaxes';
      case 'servicing': return 'vehicleServicings';
      default: return '';
    }
  }

  onTaxTypeChange() {
    // You can add custom logic if needed when taxType changes
    // For example, reset the end date when switching between LIFETIME and LIMITED
    const taxType = this.vehicleForm.get('vehicleRoadTaxes?.taxType')?.value;

    if (taxType === 'LIFETIME') {
      // If it's LIFETIME, you can clear the end date or do anything else if necessary
      this.vehicleForm.get('vehicleRoadTaxes?.endDate')?.reset();
    }
  }

  // date convert converts
  formatDate(dateStr: any): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  // this for the convert object as per backend object

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

    // Function to format fields and exclude empty objects
    const formatFields: any = (fields: any): any[] | null => {
      if (Array.isArray(fields) && fields.length > 0) {
        // Map and filter to exclude empty objects
        const formattedFields = fields
          .map((field: any) => ({
            ...field,
            startDate: field.startDate ? formatDate(field.startDate) : null,
            endDate: field.endDate ? formatDate(field.endDate) : null,
            purchaseDate: field.purchaseDate ? formatDate(field.purchaseDate) : null,
            forceClosureDate: field.forceClosureDate ? formatDate(field.forceClosureDate) : null,
          }))
          .filter((field: any) => Object.values(field).some((value) => value !== null && value !== ''));

        return formattedFields.length > 0 ? formattedFields : null;
      } else if (fields && typeof fields === 'object' && Object.keys(fields).length > 0) {
        // Format single object and check for valid values
        const formattedField = {
          ...fields,
          startDate: fields.startDate ? formatDate(fields.startDate) : null,
          endDate: fields.endDate ? formatDate(fields.endDate) : null,
          purchaseDate: fields.purchaseDate ? formatDate(fields.purchaseDate) : null,
          forceClosureDate: fields.forceClosureDate ? formatDate(fields.forceClosureDate) : null,
          servicingDate: fields.servicingDate ? formatDate(fields.servicingDate) : null,
        };

        return Object.values(formattedField).some((value) => value !== null && value !== '')
          ? [formattedField]
          : null;
      }

      return null; // Return null if fields are invalid or empty
    };

    // Main object creation with conditional inclusion
    const result: any = {
      vehicleReg: formData.vehicleInfo?.registrationNumber,
      vehicleType: formData.vehicleInfo?.vehicleType,
      vehicleBrand: formData.vehicleInfo?.vehicleBrand,
      vehicleModel: formData.vehicleInfo?.vehicleModel,
      branch: formData.vehicleInfo?.branch ? { id: formData.vehicleInfo.branch } : null,
      vehicleDescription: {
        manufacturingYear: formData.vehicleInfo?.manufacturingYear,
        color: formData.vehicleInfo?.color,
        registrationNumber: formData.vehicleInfo?.registrationNumber,
        engineNumber: formData.vehicleInfo?.engineNumber,
        chasisNumber: formData.vehicleInfo?.chasisNumber,
        fuelType: formData.vehicleInfo?.fuelType,
        fuelMeasurement: formData.vehicleInfo?.fuelMeasurement,
        truckUsages: formData.vehicleInfo?.truckUsages,
        secondaryMeter: formData.vehicleInfo?.secondaryMeter,
      },
    };

    // Add vehicleRCBook only if it has valid data
    if (
      formData.vehicleInfo?.ownerType ||
      formData.vehicleInfo?.startDate ||
      formData.vehicleInfo?.rcbookName
    ) {
      result.vehicleRCBook = {

        id: formData.vehicleInfo.id,
        ownerType: formData.vehicleInfo.ownerType,
        startDate: formatDate(formData.vehicleInfo.startDate),
        rcbookName: formData.vehicleInfo.rcbookName,
        rcBookReceiptNo: formData.vehicleInfo.rcBookReceiptNo,

      };
    }

    // Optional fields processing
    const optionalFields = {
      vehicleFinances: formatFields(formData.vehicleFinances),
      vehicleFitnesses: formatFields(formData.vehicleFitnesses),
      vehicleInsurances: formatFields(formData.vehicleInsurances),
      vehiclePermits: formatFields(formData.vehiclePermits),
      vehiclePUCs: formatFields(formData.vehiclePUCs),
      vehicleRoadTaxes: formatFields(formData.vehicleRoadTaxes),
      vehicleServicings: formatFields(formData.vehicleServicings),
    };

    // Add optional fields only if they contain valid data
    Object.entries(optionalFields).forEach(([key, value]) => {
      if (value !== null) {
        result[key] = value;
      }
    });

    return result;
  }


  // Handle file selection
  onFileSelected(event: any, fileType: string) {
    const file: File = event.target.files[0];
    if (file) {
      console.log(this.selectedFiles)
      if (fileType === 'vehicleImage') {

        this.selectedFiles.vehicleImage = file;
      } else if (fileType === 'rcReceipt') {
        this.selectedFiles.rcReceipt = file;
      } else if (fileType === 'repaymentSchedule') {
        this.selectedFiles.repaymentSchedule = file;
      } else if (fileType === 'sanctionLetter') {
        this.selectedFiles.sanctionLetter = file;
      } else if (fileType === 'pucReceipt') {
        this.selectedFiles.pucReceipt = file;
      } else if (fileType === 'taxReceipt') {
        this.selectedFiles.taxReceipt = file;
      }
      else if (fileType === 'fitnessReceipt') {
        this.selectedFiles.fitnessReceipt = file;
      }
    }
  }

  // this for the multiple file select when we select insurance and permit
  onFileSelecteds(event: any, type: 'insurance' | 'permit', index: number) {
    const file: File = event.target.files[0];  // Only get the first file

    if (type === 'insurance') {
      if (!this.uploadedInsuranceFiles[index]) {
        this.uploadedInsuranceFiles[index] = [];
      }
      // Clear the existing array and add the new file
      this.uploadedInsuranceFiles[index] = [file];
    } else if (type === 'permit') {
      if (!this.uploadedPermitFiles[index]) {
        this.uploadedPermitFiles[index] = [];
      }
      // Clear the existing array and add the new file
      this.uploadedPermitFiles[index] = [file];
    }

  }

  onSubmit() {
  

     
    
    console.log(typeof this.vehicleForm.value.vehicleFinances.purchaseAmount)
    // here is check is form valid
    if (this.vehicleForm.valid) {
      const formData = this.vehicleForm.value;

      //there we convert form value in to date formate and as per backend object
      const convertedData = this.formatFormData(formData);
      console.log("FOMRATAED DATA", convertedData)


      // if we select update is execute
      if (this.isUpdate) {
        const formDatas = new FormData();
        convertedData.vehicleId = this.vehicleId;
        console.log("update data", convertedData)
        // Append form fields
        formDatas.append('vehicle', new Blob([JSON.stringify(convertedData)], { type: 'application/json' }));

        // Append selected files if available
        if (this.selectedFiles.vehicleImage) {
          formDatas.append('vehicleImage', this.selectedFiles.vehicleImage);
        }
        if (this.selectedFiles.rcReceipt) {
          formDatas.append('rcReceipt', this.selectedFiles.rcReceipt);
        }
        if (this.selectedFiles.repaymentSchedule) {
          formDatas.append('repaymentSchedule', this.selectedFiles.repaymentSchedule);
        }
        if (this.selectedFiles.sanctionLetter) {
          formDatas.append('sanctionLetter', this.selectedFiles.sanctionLetter);
        }
        // Append uploaded insurance files array
        if (this.uploadedInsuranceFiles && this.uploadedInsuranceFiles.length > 0) {
          this.uploadedInsuranceFiles.forEach((files, index) => {
            if (files.length > 0) {
              files.forEach((file) => {
                formDatas.append(`insuranceReceipts`, file, file.name);
              });
            }
          });
        }

        // Append uploaded permit files array
        if (this.uploadedPermitFiles && this.uploadedPermitFiles.length > 0) {
          this.uploadedPermitFiles.forEach((files, index) => {
            if (files.length > 0) {
              files.forEach((file) => {
                formDatas.append(`permitReceipts`, file, file.name);
              });
            }
          });
        }

        if (this.selectedFiles.pucReceipt) {
          formDatas.append('pucReceipt', this.selectedFiles.pucReceipt);
        }

        if (this.selectedFiles.taxReceipt) {
          formDatas.append('taxReceipt', this.selectedFiles.taxReceipt);
        }
        if (this.selectedFiles.fitnessReceipt) {
          formDatas.append('fitnessReceipt', this.selectedFiles.fitnessReceipt);
        }


        this.vehicleService.updateVehicle(formDatas).subscribe((response: any) => {

          if (response.status) {
            Toast.fire({ icon: 'success', title: response.message });
            this.vehicleForm.reset();
            this.router.navigate(['/dashboard/vehicle/view-vehicle'])
          }
          else {
            Toast.fire({ icon: 'error', title: response.message });
          }

        }, (error: any) => {
          Toast.fire({ icon: 'error', title: error.error.message });
          console.log(error.error.message)
        });
      } else {




        const formDatas = new FormData();

        // Append form fields
        formDatas.append('vehicle', new Blob([JSON.stringify(convertedData)], { type: 'application/json' }));

        if (this.selectedFiles.vehicleImage) {
          formDatas.append('vehicleImage', this.selectedFiles.vehicleImage);
        }
        if (this.selectedFiles.rcReceipt) {
          formDatas.append('rcReceipt', this.selectedFiles.rcReceipt);
        }
        if (this.selectedFiles.repaymentSchedule) {
          formDatas.append('repaymentSchedule', this.selectedFiles.repaymentSchedule);
        }
        if (this.selectedFiles.sanctionLetter) {
          formDatas.append('sanctionLetter', this.selectedFiles.sanctionLetter);
        }
        // Append uploaded insurance files array
        if (this.uploadedInsuranceFiles && this.uploadedInsuranceFiles.length > 0) {
          this.uploadedInsuranceFiles.forEach((files, index) => {
            if (files.length > 0) {
              files.forEach((file) => {
                formDatas.append(`insuranceReceipts`, file);
              });
            }
          });
        }

        // Append uploaded permit files array
        if (this.uploadedPermitFiles && this.uploadedPermitFiles.length > 0) {
          this.uploadedPermitFiles.forEach((files, index) => {
            if (files.length > 0) {
              files.forEach((file) => {
                formDatas.append(`permitReceipts`, file);
              });
            }
          });
        }

        if (this.selectedFiles.pucReceipt) {
          formDatas.append('pucReceipt', this.selectedFiles.pucReceipt);
        }

        if (this.selectedFiles.taxReceipt) {
          formDatas.append('taxReceipt', this.selectedFiles.taxReceipt);
        }
        if (this.selectedFiles.fitnessReceipt) {
          formDatas.append('fitnessReceipt', this.selectedFiles.fitnessReceipt);
        }

        this.vehicleService.registerVehicle(formDatas
        ).subscribe((response: any) => {

          if (response.status) {
            Toast.fire({ icon: 'success', title: response.message });
            this.vehicleForm.reset();
            this.router.navigate(['/dashboard/vehicle/view-vehicle'])
          }
          else {
            Toast.fire({ icon: 'error', title: response.message });
          }
        }, (error: any) => {
          Toast.fire({ icon: 'error', title: error.error.message });
          console.log(error.error.message)
        }
        )
      }
    } else {
      Toast.fire({ icon: 'error', title: 'Something went wrong' });
    }
  }




}
