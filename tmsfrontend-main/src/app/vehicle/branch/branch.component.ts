import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch.service';
import { Toast } from 'src/app/services/sweetalert';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  isUpdate: boolean = false;
  id: any;
  branch = {
    id: '',
    branchName: '',
    branchContactPerson: '',
    branchContactPersonMobile: '',
    branchLocation: ''
  };

  constructor(private branchService: BranchService, private activeRoute: ActivatedRoute, private router: Router,private dialogRef: MatDialogRef<BranchComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    console.log(this.data)
    this.id =this.data;
    if (this.data != undefined && this.data != null) {
      this.isUpdate=true;
      this.branchService.getBranchbyid(Number(this.data)).subscribe((response: any) => {
        this.branch = response;
      })
    }

  }
  onSubmit() {
    if (this.id) {
      this.branchService.updateBranch(this.branch).subscribe(
        response => {
          // Handle successful response
          console.log("we going to updates branch",response);
          

    
            Toast.fire({
              icon: "success",
              title: response.message
            });
            setTimeout(() => {
              this.router.navigate(['/dashboard/viewbranch'])
            }, 2000)
            this.branch = {
              id: '',
              branchName: '',
              branchContactPerson: '',
              branchContactPersonMobile: '',
              branchLocation: ''
            };
            this.close('success');
        },
        error => {
          // Handle error response
          Toast.fire({
            icon: "success",
            title: error.message
          });
          console.error('Error creating branch', error);
        }
      );
    }
    else if (this.isValid()) {
      this.branchService.createBranch(this.branch).subscribe(
        response => {
          // Handle successful response
          console.log('response ',response);
          
          console.log("we going to updates save",response);
            Toast.fire({
              icon: "success",
              title: response.message
            });
           

            if(response.status){
              this.branch = {
                id: '',
                branchName: '',
                branchContactPerson: '',
                branchContactPersonMobile: '',
                branchLocation: ''
              };
              this.close('success');
            }
          
        },
        error => {
          // Handle error response
          console.error('Error creating branch', error);
           // Handle error response
           Toast.fire({
            icon: "success",
            title: error.message
          });
        }
      );
    }
  }

  isValid() {
    // Add validation logic if needed, currently it's just a placeholder
    return true;
  }

  close(status:any): void {
    this.dialogRef.close(status);
  }
}
