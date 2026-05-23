import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch.service';
import { Toast } from 'src/app/services/sweetalert';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  usid: any;
  selectedFiles: { aadhaar?: File, pan?: File, drivingLicense?: File } = {};
  data: any[] = []
  updateData: any;
  formdata!: FormGroup;
  branches!: any[];
  ispassvisible: boolean = false;

  previousFiles = {
    aadhaar: '',
    pan: '',
    drivingLicense: ''
  };

  selectedLicenseType: string = '';
  aadhaarFileError: string = '';
  panFileError: string = '';
  drivingLicenseFileError: string = '';
  isDriver: boolean = false;
  isUpdate: boolean = false;
  content: any;
  roleOption = [
    { id: 1, branchName: 'Super Admin', branchVal: 'SUPERADMIN' },
    { id: 2, branchName: 'Driver', branchVal: 'Driver' },
    { id: 3, branchName: 'Manager', branchVal: 'Manager' },
  ]
  currentUser: any;
  selectedDate: any;
  users: any;

  // firstName: any;


  // isShow: boolean = true;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private branch: BranchService,
    private active: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public datas: any
    , private dialogRef: MatDialogRef<DriverComponent>) {
    this.formdata = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userNname: ['', Validators.required],
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
      confirmPassword: ['',],
      roles: ['Driver'],
      mobileNo: ['', Validators.required, Validators.pattern('^[0-9]{10}$')],
      status: [false],
      aadharCardName: [''],
      panCardName: [''],
      driverLicenseName: [''],
      branch: this.fb.group({
        id: ''// Ensure the default value is null or an actual number
      }),
      drivingLicenseNumber: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{15}$/)
      ]],
      licenseType: [''],
      expiryDate: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.findCurrentUserProfile();
    this.fetchData();
    let path = this.active.snapshot.routeConfig?.path;
    this.usid = this.datas;// Get the ID from route params


    console.log(this.usid);

    if (this.usid) {
      // this.isShow = false
      this.isUpdate = true;
      console.log('User ID found:', this.usid);
      this.userService.findById(this.usid).subscribe((res) => {
        console.log('User Data:', res); // Log the response object
        this.usid = res; // Store the response in a new variable for later use
        console.log('user name', res.firstName)

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
          driverLicenseName: res.driverLicenseName,
          aadharCardName: res.aadharCardName,
          panCardName: res.panCardName,
          branch: { id: res.branches[0]?.id },
          drivingLicenseNumber: res.drivingLicenseNumber,
          licenseType: res.licenseType,
          expiryDate: res.expiryDate
            ? `${res.expiryDate[0]}-${String(res.expiryDate[1]).padStart(2, '0')}-${String(res.expiryDate[2]).padStart(2, '0')}`
            : null

        });
        console.log('Branch ID set:', res.branches[0]?.id);
        console.log("Form dataaa:", this.formdata.value)
      },
        (error: any) => {
          console.error('Error fetching driver data:', error); // Handle any errors
        });
      console.log(this.formdata.value.expiryDate);

    }

    else {
      this.isUpdate = false;

      console.log('Not in new registration mode.');
      // this.isShow = true;
    }


  }


  addNewBranch() {
    this.router.navigate(['/dashboard/branch']);
  }


  onRoleChange(): void {
    const role = this.formdata.get('roles')?.value;
    if (role === 'Driver') {
      this.isDriver = true;
      this.formdata.get('drivingLicense')?.setValidators([Validators.required]);  // Driving License required for Driver
    } else {
      this.isDriver = false;
      this.formdata.get('drivingLicense')?.clearValidators();  // Remove Driving License validators for other roles
    }
    this.formdata.get('drivingLicense')?.updateValueAndValidity();  // Update validation status
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

      if (this.usid) {
        const data = {
          "id": this.datas,
          "userNname": this.formdata.value.userNname,
          "email": this.formdata.value.email,
          "firstName": this.formdata.value.firstName,
          "lastName": this.formdata.value.lastName,
          "status": this.formdata.value.status,
          "mobileNo": this.formdata.value.mobileNo,
          "driverLicenseName": this.formdata.value.driverLicenseName,
          "panCardName": this.formdata.value.panCardName,
          "aadharCardName": this.formdata.value.aadharCardName,
          "roles": [
            this.formdata.value.roles
          ],
          "branches": [{
            "id": this.formdata.value.branch.id,
          }],
          "drivingLicenseNumber": this.formdata.value.drivingLicenseNumber,
          "licenseType": this.formdata.value.licenseType,
          "expiryDate": this.formdata.value.expiryDate
        }
        this.updateUser(data, this.selectedFiles as File)
      } else {
        // create User
        const data = {
  
          "id": this.datas,
  
          "userNname": this.formdata.value.userNname,
          "password": this.formdata.value.password,
          "email": this.formdata.value.email,
          "firstName": this.formdata.value.firstName,
          "lastName": this.formdata.value.lastName,
          "status": this.formdata.value.status,
          "mobileNo": this.formdata.value.mobileNo,
  
          "roles": [
            this.formdata.value.roles
          ],
          "branches": [{
            "id": this.formdata.value.branch.id,
          }],
          "drivingLicenseNumber": this.formdata.value.drivingLicenseNumber,
          "licenseType": this.formdata.value.licenseType,
          "expiryDate": this.formdata.value.expiryDate
        }
        console.log(data);
  
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
  
          // Updating trip if isUpdate is true
          this.userService.updateUser(data).subscribe(
            (response: any) => {
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
              this.userService.findAllDriver();
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
        (error: any) => {
          alert(error.message);
          console.log(error.message);
        }
      );
    } else {
      alert('No file selected');
    }
  }

  updateUser(formValue: any, file: File) {

    if (file) {
      console.log('update Value : ', formValue);

      console.log('File Selected : ', file);

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

      this.userService.updateUser(formData).subscribe(
        (response: any) => {
          Toast.fire({
            icon: "success",
            title: response.message
          });
          this.close('success');
          this.formdata.reset();
        },
        (error: any) => {
          alert(error.message);
          console.log(error.message);
        }
      );
    } else {
      alert('No file selected');
    }
  }

  close(status: any): void {
    this.dialogRef.close(status);
  }

  findCurrentUserProfile() {
    this.userService.findCurrentLoginUser().subscribe((response: any) => {
      this.currentUser = response;

      console.log("ye hai current user", this.currentUser);

    })
  }

  passtoggle() {
    this.ispassvisible = !this.ispassvisible;
  }

  filterByDate() {
    console.log("selected date", this.selectedDate);

    this.userService.findDateDriver(this.selectedDate).subscribe((res: any) => {
      console.log("finding date", res);
      this.users = res;

    })
  }


}
// blank commit