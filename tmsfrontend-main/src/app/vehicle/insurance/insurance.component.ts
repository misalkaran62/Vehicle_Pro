import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceCompanyService } from 'src/app/services/insurance-company.service';
import { InsuranceService } from 'src/app/services/insurance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  data: any;
  page: number = 1;
  filteredTableData: any[] = [];
  filterText: string = '';

  constructor(
    private route: Router,
    private api: InsuranceCompanyService
  ) { }
  ngOnInit(): void {
    this.displaydata();

   
    
  }

  onFilterChange() {
    if (this.data) {
      this.filteredTableData = this.data.filter((item: {
        companyName: string; contactPersonName: string;
      }) =>
        item.companyName.toLowerCase().includes(this.filterText.toLowerCase()) || item.contactPersonName.toLowerCase().includes(this.filterText.toLowerCase())
      );
     
      

    } else {
      this.filteredTableData = this.data
    }
    this.page = 1
  }

  newinsurance() {
    this.route.navigate(['/dashboard/vehicle/newinsurance'])
  }

  displaydata() {
    this.api.findAll().subscribe((res) => {
      this.data = res;
      console.log(res);
    this.onFilterChange()

    })
  }
  updateInsurance(id: any) {
    this.route.navigate(['/dashboard/vehicle/updateinsurance', id])
  }
  

  deleteInsurance(id: any) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the insurance data permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3498db',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed with deletion
        this.api.deleteInsuranceCompany(id).subscribe(
          (res) => {
            // Show success message
            Swal.fire(
              'Deleted!',
              'The insurance data has been deleted successfully.',
              'success'
            );
            // Navigate to another page and refresh data
            this.route.navigate(['/dashboard/vehicle/insurance']);
            this.displaydata();
          },
          (error) => {
            // Handle error (optional)
            Swal.fire(
              'Error!',
              'There was a problem deleting the insurance data.',
              'error'
            );
          }
        );
      } else {
        // If cancelled, show cancellation message (optional)
        Swal.fire('Cancelled', 'The insurance data is safe.', 'info');
      }
      this.displaydata()
    });
  }

  
}
