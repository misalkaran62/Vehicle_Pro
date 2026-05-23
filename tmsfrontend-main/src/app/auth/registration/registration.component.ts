import { formatPercent } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';
import { BranchService } from 'src/app/services/branch.service';
import { Toast } from 'src/app/services/sweetalert';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  usid: any;
  selectedFiles: { aadhaar?: File, pan?: File, drivingLicense?: File } = {};
  data: any[] = []
  updateData: any;
  formdata!: FormGroup;
  branches!: any[];
  ispassvisible: boolean = false;
  selectedBranches: any[] = [];
  selectedBranchIds: number[] = [];
  showDropdown:boolean=false;
  aadhaarFileError: string = '';
  panFileError: string = '';
  drivingLicenseFileError: string = '';
  isDriver: boolean = false;
  isUpdate: boolean = false;
  // branches = [
  //   { id: 1, branchName: 'Nanded' },
  //   { id: 2, branchName: 'Pune' },
  //   { id: 3, branchName: 'Mumbai' },
  //   { id: 4, branchName: 'Nagpur' }
  // ]
  roleOption = [
    { id: 1, branchName: 'Super Admin', branchVal: 'SUPERADMIN' },
    { id: 2, branchName: 'Driver', branchVal: 'Driver' },
    { id: 3, branchName: 'Manager', branchVal: 'Manager' },
  ]
  firstName: any;
  lastName: any;
  isCreateMode: boolean = true;
  // isShow: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private branch: BranchService,
    private active: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public datas: any
    , private dialogRef: MatDialogRef<RegistrationComponent>) {
    this.formdata = this.fb.group({
      firstName: [
        '',
        [
          Validators.required, // Equivalent to @NotBlank        
          Validators.pattern('[a-zA-z]+'), // Equivalent to @Pattern
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z]+$'), // Ensures only alphabetic characters
        ],
      ],
      userNname: [''],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z]+\\.[a-z]{2,3}')
        ]
      ],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) // Must be 8+ characters, with letters & numbers
      ]],
      confirmPassword: ['', Validators.required],
      roles: ['', Validators.required],
      mobileNo: ['', Validators.required],
      status: [false],
      drivingLicense: [''],
      // branch: this.fb.group({
      //   id: 1 // Ensure the default value is null or an actual number
      // })
      branches: [[], Validators.required],
    });

  }

  ngOnInit(): void {
    this.fetchData();


    let path = this.active.snapshot.routeConfig?.path;

    this.usid = this.datas; // Get the ID from route params

    if (this.usid?.lastName) {
      this.isCreateMode = false; // Switch to update mode if data is present
    }

    if (this.usid) {
      // this.isShow = false
      this.isUpdate = true;
      console.log('User ID found:', this.usid);
      this.userService.findById(this.usid).subscribe((res) => {
        console.log('User Data:', res); // Log the response object
        this.usid = res; // Store the response in a new variable for later use
        this.formdata.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          userNname: res.userNname,
          email: res.email,
          password: res.password,
          confirmPassword: res.confirmPassword,
          roles: res.roles[0], // Assuming roles is an array with at least one item
          mobileNo: res.mobileNo,
          status: res.status,
          drivingLicense: res.drivingLicense,
          //branch: { id: res.branches[0]?.id }
          // branches: res.branches.map((branch: any) => branch.id), // Handle multiple branches
          branches: res.roles.includes('Manager') 
          ? res.branches[0]?.id  // Set single branch for Manager
          : res.branches.map((branch: any) => branch.id), // Handle multiple branches for Regional Manager
        });

     
       // Populate selectedBranches for Regional Manager role
       if (res.roles.includes('RegionalManager')) {
        this.selectedBranches = res.branches;
      }
      },
        (error: any) => {
          console.error('Error fetching insurance data:', error); // Handle any errors
        });
    }
    else {
      console.log('Not in new registration mode.');
      // this.isShow = true;
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  
  toggleBranchSelection(branch: any) {
    const index = this.selectedBranches.findIndex(b => b.id === branch.id);
    if (index === -1) {
      // Add branch to selected list
      this.selectedBranches.push(branch);
    } else {
      // Remove branch from selected list
      this.selectedBranches.splice(index, 1);
    }
    this.updateFormControl();
  }

  

  isBranchSelected(branch: any) {
    return this.selectedBranches.some(b => b.id === branch.id);
  }
 
  addNewBranch() {
    this.router.navigate(['/dashboard/branch']);
  }

  
  onRoleChange(): void {
    const role = this.formdata.get('roles')?.value;
  
    if (role === 'Manager') {
      this.branch.getUniqueBranches(true).subscribe((res) => {
        console.log('Branches for Manager:', res);
        this.branches = res;
      });
    } else if (role === 'RegionalManager') { 
      this.branch.getUniqueBranches(false).subscribe((res) => {
        console.log('Branches for Regional Manager:', res);
        this.branches = res;
      });
    } else {
      this.branches = []; // Clear branches for other roles if necessary
    }
  }

  fetchData(): void {
    this.branch.getBranches().subscribe(
      (data: any[]) => {
        this.branches = data; // Store the branch data in the component
      },
      error => {
        console.error('Error fetching branches:', error);
      }
    );
  }

  // Handle file selection
  onFileSelected(event: any, fileType: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (fileType === 'aadhaar') {
        this.selectedFiles.aadhaar = file;
      } else if (fileType === 'pan') {
        this.selectedFiles.pan = file;
      } else if (fileType === 'drivingLicense') {
        this.selectedFiles.drivingLicense = file;
      }
    }
  }

  onSubmit(): void {
    const branchesData = Array.isArray(this.formdata.value.branches)
    ? this.formdata.value.branches.map((branchId: number) => ({ id: branchId }))
    : [{ id: this.formdata.value.branches }];
    console.log("branchesData",branchesData);
    

  const data = {
    id: this.datas,
    userNname: this.formdata.value.userNname,
    password: this.formdata.value.password,
    email: this.formdata.value.email,
    firstName: this.formdata.value.firstName,
    lastName: this.formdata.value.lastName,
    status: this.formdata.value.status,
    mobileNo: this.formdata.value.mobileNo,
    roles: [this.formdata.value.roles],
    branches: branchesData,
  };

    console.log(data)


    if (this.isUpdate) {
      const formData = new FormData();

      // Append form fields
      formData.append('user', new Blob([JSON.stringify(data)], { type: 'application/json' }));

      // Append selected files if available
      if (this.selectedFiles.aadhaar) {
        formData.append('aadharCard', this.selectedFiles.aadhaar);
      }
      if (this.selectedFiles.pan) {
        formData.append('panCard', this.selectedFiles.pan);
      }
      if (this.selectedFiles.drivingLicense) {
        formData.append('driverLicense', this.selectedFiles.drivingLicense);
      }
      console.log("Hiiiiiiiiii")
      // Updating trip if isUpdate is true
      this.userService.updateUser(formData).subscribe(
        (response: any) => {
          console.log("status reponse ka ",response.status);
          
          if (response.status) {
            Toast.fire({
              icon: "success",
              title: response.message
            });
            this.close('success');
            this.formdata.reset();
          } else {
            Toast.fire({
              icon: "error",
              title: response.message
            });
            
          }
                  
        },
        error => {
          console.error('Error updating user', error);
        }
      );
    } else {
      //we are callinig here register user method
      console.log("register here")
      this.userRegister(data, this.selectedFiles as File);

    }

  }

  userRegister(formValue: any, file: File) {
    if (file) {
      const formData = new FormData();

      // Append form fields
      formData.append('user', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));

      // Append selected files if available
      if (this.selectedFiles.aadhaar) {
        formData.append('aadharCard', this.selectedFiles.aadhaar);
      }
      if (this.selectedFiles.pan) {
        formData.append('panCard', this.selectedFiles.pan);
      }
      if (this.selectedFiles.drivingLicense) {
        formData.append('driverLicense', this.selectedFiles.drivingLicense);
      }

      this.userService.userRegistration(formData).subscribe(
        (response: any) => {
          console.log(response);
          
          if (response.status) {
            Toast.fire({
              icon: "success",
              title: response.message
            });
            this.close('success');
            this.formdata.reset();
          } else {
            Toast.fire({
              icon: "error",
              title: response.message
            });
            
          }
        },
        error => {
          console.error('Error updating user', error);
        }
      );
    } else {
      alert('No file selected');
    }
  }

  close(status: any): void {
    this.dialogRef.close(status);
  }

  passtoggle() {
    this.ispassvisible = !this.ispassvisible;
  }

  onBranchSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
  
    // Get the selected branch IDs
    const selectedBranchIds = Array.from(selectElement.selectedOptions).map(option =>  parseInt(option.value.substring(3)));
  
    // Filter out branches that are already in the selectedBranches array
    const newBranches = selectedBranchIds
      .filter(branchId => !this.selectedBranches.some(branch => branch.id === branchId))
      .map(branchId => this.branches.find(branch => branch.id === branchId));
  
    // Append the new branches to the selectedBranches array
    this.selectedBranches = [...this.selectedBranches, ...newBranches];
  
    // Update the form control value with all selected branch IDs
    this.formdata.get('branches')?.setValue(this.selectedBranches.map(branch => branch.id));
  
    console.log('Updated selected branches:', this.selectedBranches);
  }
  


  removeBranch(branch: any) {
    const index = this.selectedBranches.findIndex(b => b.id === branch.id);
    if (index !== -1) {
      this.selectedBranches.splice(index, 1);
      this.updateFormControl();
    }
  }

  updateFormControl() {
    const branchIds = this.selectedBranches.map(b => b.id);
    this.formdata.get('branches')?.setValue(branchIds);
  }
  
  
}
  
