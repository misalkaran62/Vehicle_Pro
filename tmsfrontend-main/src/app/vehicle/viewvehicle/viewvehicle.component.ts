
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { ViewmorevehicleComponent } from '../viewmorevehicle/viewmorevehicle.component';
import { MatDialog } from '@angular/material/dialog';
import { Toast } from 'src/app/services/sweetalert';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-viewvehicle',
  templateUrl: './viewvehicle.component.html',
  styleUrls: ['./viewvehicle.component.css']
})
export class ViewvehicleComponent implements OnInit {

  currentUser: any;
  originalData: any[] = [];
  selectedDate: string = ''; // Store the original data for resetting purposes
  constructor(private router: Router,
    private vehicleService: VehicleService,
    private userService: UserService, private mat: MatDialog

  ) { }
  ViewExpiry(_t64: any) {
    throw new Error('Method not implemented.');
  }
  View(_t42: any) {
    throw new Error('Method not implemented.');
  }
  editForm(_t42: any) {
    throw new Error('Method not implemented.');
  }
  viewForm(_t42: any) {
    throw new Error('Method not implemented.');
  }


  data: any;
  page: number = 1;
  searchTerm: string = '';

  ngOnInit() {
    // Example data; replace with your actual data fetching logic
    this.displayData();
    this.findCurrerntUserProfile();
    // Update status based on forms
    // this.data.forEach((vehicle: any) => {
    //   vehicle.status = this.computeStatus(vehicle.forms);
    // });
  }

  // Function to compute status based on forms
  computeStatus(forms: any[]): string {
    return forms.some(form => form.status === 'pending') ? 'pending' : 'filled';
  }

  // Function to toggle accordion


  filterVehicles() {
    // Implement your search logic here
  }

  registerVehicle() {
    this.router.navigate(['/dashboard/vehicle']);
  }

  viewDetails(item: any) {
    // Implement the view details logic
  }

  updateVehicle(item: any) {

    console.log(item)
    this.router.navigate(['/dashboard/vehicle/updatevehicle', item]);
  }

  deleteVehicle(vehicleId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.vehicleService.deleteVehicleById(vehicleId).subscribe((response: any) => {
          Toast.fire({
            icon: "success",
            title: response.message
          });
          this.displayData();
        });
      }
    });
  }

  toggleAccordion(item: any) {
    item.isAccordionOpen = !item.isAccordionOpen;
  }


  displayData() {
    console.log("we are going to fetch vechile");
    
    // this.vehicleService.findWithoutDate().subscribe((res: any) => {

    //   this.data = res;
    //   this.originalData = [...res];
    //   console.log("vehile", res);

    // })
    this.vehicleService.showAllVehicle().subscribe((res: any) => {

      this.data = res;
      this.originalData = [...res];
      console.log("vehile", res);

    })
  }
  toggleExpiryAccordion(item: any) {
    item.isExpiryAccordionOpen = !item.isExpiryAccordionOpen;
  }



  calculateDaysRemaining(endDate: string): number {
    const currentDate = new Date();
    const expiryDate = new Date(endDate);
    const timeDiff = expiryDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  isModalOpen: boolean = false;
  selectedItem: any;

  openModal(item: any) {
    this.selectedItem = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  findCurrerntUserProfile() {
    this.userService.findCurrentLoginUser().subscribe((response: any) => {
      this.currentUser = response.roles[0];

    }, (error: any) => {

      console.log(error)
    })
  }


  // Updated searchVehicles method
  searchVehicles() {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      // Perform filtering based on searchTerm
      this.data = this.originalData.filter((vehicle: any) =>
        vehicle.vehicleReg.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        JSON.stringify((vehicle.vehicleStatus || '')).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.branch?.branchName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      console.log("Filtered data", this.data);
    } else {
      // If searchTerm is empty, reset to the original data
      this.data = [...this.originalData];
    }
  }

  
  openVehicleDetails(id: any) {
    this.router.navigate(['/dashboard/vehicle/viewmorevehicle/', id])
  }
  filterByDate() {
    console.log("selected date", this.selectedDate);

    this.vehicleService.findDateDriver(this.selectedDate).subscribe((res: any) => {
      console.log("finding date", res);
      this.data = res;

    })
  }
  allVehicle(){
     this.vehicleService.showAllVehicle().subscribe((response:any)=>{
      this.data=response
     })
  }
  exportToExcel(): void {
    const excludeColumns = new Set(['vehicleFinances', 'vehicleFitnesses', 'vehicleInsurances','vehiclePermits','vehiclePUCs','vehicleRCBook','vehicleRoadTaxes','vehicleServicings','partMappings','createdAt','renewalDue','vehicleImageName','supplier','vehicleDescription']);
  
    const filteredData = this.originalData.map(obj => {
      const latestInsurance = this.getLatestDocument(obj.vehicleInsurances);
      const latestPUC = this.getLatestDocument(obj.vehiclePUCs);
      const latestPermit = this.getLatestDocument(obj.vehiclePermits);
      const latestFitness = this.getLatestDocument(obj.vehicleFitnesses);
      const latestRoadTax=this.getLatestDocument(obj.vehicleRoadTaxes);
      const latestRCBook = obj.vehicleRCBook; // Assuming only one RC book per vehicle
      const vehicleDesc = obj.vehicleDescription;
  
      const newObj = { 
        ...obj,
        "Manufacturing Year": vehicleDesc?.manufacturingYear || "N/A",
        "Color": vehicleDesc?.color || "N/A",
        "Fuel Type": vehicleDesc?.fuelType || "N/A",
        "Engine Number": vehicleDesc?.engineNumber || "N/A",
        "Chassis Number": vehicleDesc?.chasisNumber || "N/A",
        "Insurance Receipt No": latestInsurance?.insuranceNumber || "N/A",
        "Insurance Start Date":latestInsurance?.startDate[0]+"-"+latestInsurance?.startDate[1]+"-"+latestInsurance?.startDate[2]||"N/A",
        "Insurance End Date":latestInsurance?.endDate[0]+"-"+latestInsurance?.endDate[1]+"-"+latestInsurance?.endDate[2]||"N/A",
        "PUC Receipt No": latestPUC?.pucReceiptNo || "N/A",
        "PUC Start Date":latestPUC?.startDate[0]+"-"+latestPUC?.startDate[1]+"-"+latestPUC?.startDate[2]||"N/A",
        "PUC End Date":latestPUC?.endDate[0]+"-"+latestPUC?.endDate[1]+"-"+latestPUC?.endDate[2]||"N/A",
        "Permit Receipt No": latestPermit?.permitReceiptNo || "N/A",
        "Permit Start Date":latestPermit?.startDate[0]+"-"+latestPermit?.startDate[1]+"-"+latestPermit?.startDate[2]||"N/A",
        "Permit End Date":latestPermit?.endDate[0]+"-"+latestPermit?.endDate[1]+"-"+latestPermit?.endDate[2]||"N/A",
        "Fitness Receipt No": latestFitness?.fitnessReceiptNO || "N/A",
        "Fitness Start Date":latestFitness?.startDate[0]+"-"+latestFitness?.startDate[1]+"-"+latestFitness?.startDate[2]||"N/A",
        "Fitness End Date":latestFitness?.endDate[0]+"-"+latestFitness?.endDate[1]+"-"+latestFitness?.endDate[2]||"N/A",
        "Road Tax Receipt No":latestRoadTax?.roadTaxReceiptNo || "N/A",
        "Road Tax Start Date":latestRoadTax?.startDate[0]+"-"+latestRoadTax?.startDate[1]+"-"+latestRoadTax?.startDate[2]||"N/A",
        "Road Tax End Date":(latestRoadTax.endDate!=null)?(latestRoadTax?.endDate[0]+"-"+latestRoadTax?.endDate[1]+"-"+latestRoadTax?.endDate[2]):"N/A",
        "RC Book Receipt No": latestRCBook?.rcBookReceiptNo || "N/A"
       };
  
      // Exclude unwanted columns
      excludeColumns.forEach(col => delete newObj[col]);
  
      // Extract specific attributes from nested objects
      if (newObj.branch) {
        newObj.branchName = newObj.branch.branchName; // Example: Extract `registrationNumber`
        delete newObj.branch; // Remove nested object after extracting required field
      }
  
    console.log(newObj);
    
  
      return newObj;
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
  
    XLSX.writeFile(wb, 'vehicle_data.xlsx');
  }
  getLatestDocument(documents: any[]): any {
    if (!documents || documents.length === 0) return null;
    return documents.reduce((latest, doc) => {
      return new Date(doc.endDate) > new Date(latest.endDate) ? doc : latest;
    }, documents[0]);
  }
  
  
}
