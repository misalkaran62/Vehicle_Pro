import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { RegistrationComponent } from 'src/app/auth/registration/registration.component';
import { Toast } from 'src/app/services/sweetalert';
import { DriverComponent } from '../driver/driver.component';
import Swal from 'sweetalert2';
import { ViewdocumentComponent } from '../viewdocument/viewdocument.component';
import { DriverService } from 'src/app/services/driver.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-viewdriver',
  templateUrl: './viewdriver.component.html',
  styleUrls: ['./viewdriver.component.css'],
})
export class ViewdriverComponent implements OnInit {
  selectedUserType: string | null = null; // Initialize as null to handle unselected state
  data: any;
  Driver: any[] = [];
  allUsers: any[] = [];

  filteredDriver: any[] = [];
  searchTerm: string = '';
  branchName: string = '';
  showModal: any;
  img: any;
  page: number = 1;
  driverId: any;
  itemPerPage: number = 6;

  alldate: any[] = [];
  filteredNotifications: any[] = [];
  selectedDate: string = '';

  constructor(
    private router: Router,
    private driverService: DriverService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showData();
  }

  showData() {
    this.driverService.gettingByDate().subscribe((response: any) => {
      this.filteredDriver = response;
      this.filteredDriver = [...this.filteredDriver]; // Set filteredUsers to the initial list
    });
  }

  registerUser() {
    const MatDialogRef = this.dialog.open(DriverComponent, {
      width: '850px',
      disableClose: true,
    });
    MatDialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.showData(); // Refresh the user list
      }
    });
  }

  searchDriver() {
    const term = this.searchTerm.toLowerCase().trim();
    console.log(term);

    console.log(this.Driver);

    if (term) {
      console.log(term);
      // Filter users from allUsers (not from currently displayed users)
      this.filteredDriver = this.Driver.filter(
        (user: any) =>
          user.username?.toLowerCase().includes(term) ||
          user.firstName?.toLowerCase().includes(term) ||
          user.lastName?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          (user.branch?.branchName || '').toLowerCase().includes(term) ||
          JSON.stringify(user.mobileNo || '').includes(term)
      );
    } else {
      // Reset filtered users to all users if search term is cleared
      this.filteredDriver = [...this.Driver];
    }
  }

  onCompanyChange(event: Event): void {
    const selectedCompany = (event.target as HTMLSelectElement).value;
    this.branchName = selectedCompany;
  }

  updateUser(user: any) {
    const matref = this.dialog.open(DriverComponent, {
      width: '850px',
      data: user,
    });

    matref.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.showData(); // Refresh the user list
      }
    });
  }

  deleteDriver(userId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.driverService
          .deleteDriverdata(userId)
          .subscribe((response: any) => {
            Toast.fire({
              icon: 'success',
              title: response.message,
            });
            this.showData();
          });
      }
    });
  }

  toggleStatus(user: any): void {
    user.status = !user.status; // Toggle the status
    this.driverService.updateDriverStatus(user.id, user.status).subscribe(
      (response: any) => {
        Toast.fire({
          icon: 'success',
          title: response.message,
        });
      },
      (error) => {
        console.error('Error updating user status', error);
        // Revert the status in case of an error
        user.status = !user.status;
      }
    );
  }

  loadDocumentImage(docType: string): void {
    this.driverService.findByIdImage(this.driverId, docType).subscribe({
      next: (data: Blob) => {
        console.log(data);
        const objectURL = URL.createObjectURL(data);
        this.img = objectURL; // Use this in your HTML
      },
      error: (err) => {
        console.error('Error loading document image', err);
      },
    });
  }

  viewDocument(docType: string, driverId: number) {
    console.log('viewdocument mai userid', driverId);

    const matref = this.dialog.open(ViewdocumentComponent, {
      width: '600px',
      height: '400px',
      // height: '368px',
      data: { docType: docType, documnetId: driverId },
    });
    matref.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.showData(); // Refresh the user list
      }
    });
  }

  allDriver() {
    this.driverService.findAllDriver().subscribe((response: any) => {
      this.filteredDriver = response; // Store all users in the master list
      console.log(this.filteredDriver);

      this.Driver = [...this.filteredDriver]; // Display all users initially
    });
  }

  driverdetails(id: any) {
    this.router.navigate(['/dashboard/vehicle/driverdetails', id]);
  }

  filterByDate() {
    this.driverService
      .findDateDriver(this.selectedDate)
      .subscribe((res: any) => {
        console.log('finding date', res);
        this.filteredDriver = res;
      });
  }

  exportToExcel(): void {
    const excludeColumns = new Set([
      'createdAt',
      'updatedAt',
      'authorities',
      'roles',
      'password',
      'branches',
      'driverLicenseName',
      'aadharCardName',
      'panCardName',
      'expiryDate',
      'accountNonExpired',
      'credentialsNonExpired',
      'enabled',
      'accountNonLocked'

    ]);

    const filteredData = this.filteredDriver.map((driver) => {
      return {
        ...Object.fromEntries(
          Object.entries(driver).filter(([key]) => !excludeColumns.has(key))
        ),
        branchName: driver.branches?.[0]?.branchName || '', // Extract first branch name if available
        licenseExpiryDate:driver.expiryDate[0]+"-"+driver.expiryDate[1]+"-"+driver.expiryDate[2],
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    XLSX.writeFile(wb, 'driver_data.xlsx');
  }
}
