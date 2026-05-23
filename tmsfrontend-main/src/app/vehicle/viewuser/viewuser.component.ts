import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegistrationComponent } from 'src/app/auth/registration/registration.component';
import { Toast } from 'src/app/services/sweetalert';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css']
})
export class ViewuserComponent implements OnInit {
  selectedUserType: string | null = null; 
  users: any[] = [];
  allUsers: any[] = []; 
  filteredUsers:any[]=[];
  currentView: 'currentWeek' | 'allUsers' = 'currentWeek'; // To track the current view
  searchTerm: string = '';
  branchName: string = 'pune';
  page: number = 0;
  itemsPerPage: number = 6; 
  currentUser: any;
  branches: any;
  selectedDate:any;

  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.findCurrerntUserProfile();
  }

  toggleBranches(user: any) {
    user.showBranches = !user.showBranches; 
  }

  onSearchInputChange(event: Event) {
    const term = (event.target as HTMLInputElement).value.trim();
    if (!term) {
      this.clearSearch(); // Call clearSearch when the input is cleared
    } else {
      this.searchUser();
    }
  }


  getAllUsers() {
    this.userService.findUserWeekly().subscribe((response: any) => {
      // this.users = response;
      // this.allUsers = [...response]; // Keep a copy of all users for filtering
      this.filteredUsers = response;
      this.filteredUsers = [...this.filteredUsers]; // Set filteredUsers to the initial list
      this.page = 1; // Reset to first page
      this.updatePaginatedUsers();
      console.log("All users loaded:", response);
    });
  }

  updatePaginatedUsers() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.users = this.filteredUsers.slice(startIndex, endIndex); // Slice filtered users, not all users
  }
  registerUser() {
    this.router.navigate(['/dashboard/register']);
  }


  searchUser() {
    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      console.log(term)
      // Filter users from allUsers (not from currently displayed users)
      this.filteredUsers = this.allUsers.filter((user: any) =>
        user.username?.toLowerCase().includes(term) ||
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        (user.branch?.branchName || '').toLowerCase().includes(term) ||
        JSON.stringify((user.mobileNo || '')).includes(term)
      );
    } else {
      // Reset filtered users to all users if search term is cleared
      this.filteredUsers = [...this.allUsers];
    }

    this.page = 1; // Reset to page 1 when the user searches
    this.updatePaginatedUsers();
  }

  clearSearch() {
    this.searchTerm = ''; // Clear search input
    this.filteredUsers = [...this.allUsers]; // Reset filtered users to full list
    this.page = 1; // Reset to page 1
    this.updatePaginatedUsers(); // Update users for pagination
  }

  pageChange(newPage: number) {
    this.page = newPage;
    this.updatePaginatedUsers();
  }

  onCompanyChange(event: Event): void {
    const selectedCompany = (event.target as HTMLSelectElement).value;
    this.branchName = selectedCompany;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RegistrationComponent, {
      width: '660px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.getAllUsers(); // Refresh the user list after successful registration
      }
    });
  }
  allUser(){
  //  alert('we are finding all user')
    
   this.userService.findAllUsers().subscribe((res:any)=>{
  
    this.allUsers = res; // Store all users in the master list
    
    this.users = [...this.allUsers]; // Display all users initially
    
  })
  }
  updateUserDialog(data: any): void {
    const dialogRef = this.dialog.open(RegistrationComponent, {
      width: '660px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.getAllUsers(); // Refresh the user list after updating
      }
    });
  }

  deleteUser(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteuserdata(id).subscribe((res) => {
          console.log("User deleted:", res);
          this.getAllUsers(); // Refresh data after deletion
          Swal.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          );
        });
      } else {
        Swal.fire('Cancelled', 'User data is safe.', 'info');
      }
    });
  }

  findCurrerntUserProfile() {
    this.userService.findCurrentLoginUser().subscribe(
      (response: any) => {
        this.currentUser = response;
      },
      (error: any) => {
        console.log("Error fetching current user:", error);
      }
    );
  }

  filterByDate() {
    console.log("selected date",this.selectedDate);
    
        this.userService.findUserByDate(this.selectedDate).subscribe((res:any)=>{
          console.log("finding date",res);
          this.users=res;
          
        })
      }
     

  toggleStatus(user: any): void {
    user.status = !user.status;
    this.userService.updateUserStatus(user.id, user.status).subscribe(
      (response: any) => {
        Toast.fire({
          icon: 'success',
          title: response.message
        });
      },
      (error) => {
        console.error('Error updating user status:', error);
        user.status = !user.status;
      }
    );
  }
}
