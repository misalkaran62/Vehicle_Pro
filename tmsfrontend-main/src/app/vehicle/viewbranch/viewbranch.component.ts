import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch.service';
import { Toast } from 'src/app/services/sweetalert';
import { BranchComponent } from '../branch/branch.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-viewbranch',
  templateUrl: './viewbranch.component.html',
  styleUrls: ['./viewbranch.component.css']
})
export class ViewbranchComponent implements OnInit {
  searchTerm: string = ''
  allBranch: any[] = []; 
  data: any;
  page: number=1;
  currentUser: any;

  constructor(private router: Router, private branchService: BranchService,private dialog:MatDialog,private authsser:AuthService,private userService: UserService,) { }
  ngOnInit(): void {
    this.findCurrerntUserProfile();
    this.getAllBranch();
   

  }

 
  getAllBranch() {
    this.branchService.getBranches().subscribe((response: any) => {
      console.log(response);
      this.allBranch = [...response]; // Keep a copy of all users for filtering
      this.data = response;
    }, (error: any) => {
      console.log(error)
    })
  }
  addBranch() {
    this.router.navigate(['/dashboard/branch'])
  }


  openDialog(): void {
   const MatDialogRef= this.dialog.open(BranchComponent, {
      width: '400px',// specify the width or other configurations
      disableClose:true
      // data: { name: 'Angular User' }, // pass data to the dialog if needed
    });

    MatDialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        // Only call getAllBranch if the result is successful
        this.getAllBranch();
      }
    });
    // 
  }

  openUpdateDialog(item: any): void {
    const dialogRef = this.dialog.open(BranchComponent, {
      width: '400px',
      data: item ,// Pass the user object for updating
      disableClose:true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        // Only call getAllBranch if the result is successful
        this.getAllBranch();
      }
    });
  
  }


  updateVehicle(item: any) {
    alert("click on update branc")
    // console.log(item)
    this.router.navigate(['/dashboard/vehicle/updatebranch/', item])
  }

  deleteVehicle(vehicleId: number) {
    // Implement the delete vehicle logic
    this.branchService.getDeleteBranchId(vehicleId).subscribe((res: any) => {
        Toast.fire({
          icon:'success',
          title: res.message
          
        })
      if(res.status){
        this.getAllBranch()
      }
    })
  }

  searchBranch() {
    const term = this.searchTerm.toLowerCase().trim();
     console.log(term)
    if (term) {
      this.data = this.allBranch.filter((user: any) =>
        user.branchContactPerson.toLowerCase().includes(term) ||
        user.branchName.toLowerCase().includes(term) ||
        (user.branchLocation || '').toLowerCase().includes(term) ||
     
       
        JSON.stringify((user.branchContactPersonMobile || '')).includes(term)
      );
    } else {
      this.data = [...this.allBranch]; // Reset to full user list if search is cleared
    }
  }
  findCurrerntUserProfile() {
    this.userService.findCurrentLoginUser().subscribe(
      (response: any) => {
        console.log("ye hai current user",response);
        
        this.currentUser = response;
      },
      (error: any) => {
        console.log("Error fetching current user:", error);
      }
    );
  }
}
