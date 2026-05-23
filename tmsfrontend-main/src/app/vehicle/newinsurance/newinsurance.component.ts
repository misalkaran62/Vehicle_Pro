import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { InsuranceCompanyService } from 'src/app/services/insurance-company.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toast } from 'src/app/services/sweetalert';

@Component({
  selector: 'app-newinsurance',
  templateUrl: './newinsurance.component.html',
  styleUrls: ['./newinsurance.component.css']
})
export class NewinsuranceComponent implements OnInit {

  id: any
  data: any[] = []
  updateData: any;
  insuranceData: any = {
    companyName: '',
    contactNumber: '',
    contactPersonName: '',
    contactPersonNumber: '',


  }
  formdata !: FormGroup;
  constructor(
    private route: Router,
    private insuranceCompanyService: InsuranceCompanyService,
    private active: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.id = this.active.snapshot.params['id']
    console.log(this.id);

    if (this.id != null && this.id != undefined) {
      this.insuranceCompanyService.findById(this.id).subscribe((res) => {
        console.log("findby id id", res);
        this.insuranceData = res;

      })
    }
    this.formdata = this.fb.group({
      companyName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      contactPersonName: ['', Validators.required],
      contactPersonNumber: ['', Validators.required]


    });




    // this.insuranceCompanyService.findById(this.id).subscribe((res)=>{
    //   console.log(res);

    // })

    let path = this.active.snapshot.routeConfig?.path

    if (path === "updateinsurance/:id") {
      this.id = this.active.snapshot.params['id']; // Get the ID from route params

      this.insuranceCompanyService.findById(this.id).subscribe((res) => {
        console.log('Insurance Data:', res); // Log the response object
        this.id = res; // Store the response in a new variable for later use
      },
        (error) => {
          console.error('Error fetching insurance data:', error); // Handle any errors
        });
    }


  }

  backArrow() {
    this.route.navigate(['/dashboard/vehicle/insurance'])
  }

  submitCompanyDetails(updateId: any) {

    console.log(this.insuranceData)

    this.insuranceCompanyService.createInsuranceCompany(this.insuranceData).subscribe(

      (response: any) => {

        Toast.fire({
          icon: 'success',
          title: response.message
        });


      
        this.formdata.reset(); // Reset the form
        if (response.status) {
          this.route.navigate(['/dashboard/vehicle/insurance']);

        }
      },
      (error) => {
        Toast.fire({
          icon: 'success',
          title: error.message
        });

      }
    );
    this.formdata.reset();
    this.insuranceCompanyService.updateInsuranceCompany(this.updateData.value, updateId).subscribe((res) => {
      console.log(res);

      this.route.navigate(['/dashboard/vehicle/insurance']);
    });



    // clearForm() {
    //   this.companyName = '';
    //   this.contactNumber = '';
    //   this.contactPersonName = '';
    //   this.contactPersonNumber = '';
    // }
  }

}
