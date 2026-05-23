import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { ServicingService } from '../services/servicing.service';
import { FormBuilder } from '@angular/forms';
import { Toast } from '../services/sweetalert';

@Component({
  selector: 'app-servicing-list',
  templateUrl: './servicing-list.component.html',
  styleUrls: ['./servicing-list.component.css']
})
export class ServicingListComponent implements OnInit {
  vv:any;
  totalAmount: number = 0;
  servicingList: any
  list:any;
  vehicle:any;
  totalCost: number = 0;
  @Output() approvedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  itemsPerPage = 10;
  page = 1;
  searchTerm: string = ''
  servicingAllData: any;
  allBranch: any[] = [];
  newServicingData: any;
  isPartChangeVisible: boolean = false;

  statusOptions: string[] = ['SERVICING_RAISED', 'ON_SERVICING', 'SERVICING_COMPLETED'];

  flattenedData: any[] = [];
  selectedDate: string = '';
  vehicleid:any;

  constructor(
    private fb: FormBuilder,
    private active: ActivatedRoute,
    private vehicleapi: VehicleService,
    private servicingapi: ServicingService,
    private rout: Router,
   
  ) {
  
  }
  ngOnInit(): void {

    this.vehicleid = this.active.snapshot.params['id']
    console.log("vehicleid id", this.vehicleid);
    // this.showAllServicingData();
    this.showvehicleservicing();
    this.updateTotalCost();
   
  }

  showvehicleservicing(){
this.vehicleapi.findByVehicleId(this.vehicleid).subscribe((res)=>{
  console.log('new data vewhicle',res);
  this.list = res.vehicleServicings || [];
  this.vehicle=res
  console.log('servicing list',res);
  this.isPartChangeVisible = this.list.some(
    (item: any) => item.servicingType === 'PART_CHANGE' || item.servicingType === 'ACCIDENT'
  );  this.calculateTotalAmount(); 

})



  }


  showAllServicingData() {
    this.vehicleapi.showAllVehicle().subscribe((result) => {
      this.servicingAllData = result
      console.log('serviicng data', result);


      this.flattenedData = this.flattenServicingData(); // Populate flattened data
      console.log("Flattened servicing data", this.flattenedData);

      console.log("servicing data", this.servicingAllData);

      this.allBranch = Object.values(result);
      console.log("vehicle plus servicing details", result)
      console.log('servicing data..current..', this.servicingAllData);

      this.isPartChangeVisible = this.servicingAllData.some((item: { vehicleServicings: any[] }) =>
        item.vehicleServicings.some(
          (servicing: any) => servicing.servicingType === 'PART_CHANGE' || servicing.servicingType === 'ACCIDENT'
        )
      );
    })
    
  }




  // Generate a unique servicing ID
  generateNewServicingId(): string {
    return `serv-${Math.random().toString(36).substr(2, 9)}`;
  }


  updateTotalCost() {
    this.vv=this.list[0].cost+this.totalCost
     console.log('vvvv',this.vv);
     
     
  }

  deleteServicingRow(servicingId: number) {
    this.servicingapi.deleteOneServicingRow(servicingId).subscribe((result) => {
      Toast.fire({ icon: 'success', title: result.message })
      console.log(result);
      this.showAllServicingData()
    })
  }
  sendOneServicingRow(servicingId: number) {


    this.rout.navigate(['/dashboard/updateservicing/', servicingId], { queryParams: { mode: 'edit' } });

    console.log('servicing id in servicing', servicingId);

  }




  // Assuming the 'approved' field is part of 'items'
  onApprovedChange(items: any): void {
    this.approvedChange.emit(items.approved);
    console.log("approved status=", items.approved);
    this.servicingapi.updateServicingStatus(items.servicingId, items.approved).subscribe((res) => {
      console.log("coming updates", res);

    })

  }
  oneService(servicingId: number) {
 
    this.rout.navigate(['/dashboard/servicingPrint/', servicingId]);
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
  }



  search() {
    console.log("searching servicing", this.searchTerm);
    const termtrim = this.searchTerm.toLowerCase().trim();
    console.log(termtrim);

    if (termtrim) {
      this.servicingAllData = this.allBranch.filter((user: any) => {
        // Check if vehicleReg matches
        const vehicleRegMatch = user.vehicleReg?.toLowerCase().includes(termtrim);

        // Check if any servicingType in vehicleServicings matches
        const servicingTypeMatch = user.vehicleServicings?.some((servicing: any) =>
          servicing.servicingType?.toLowerCase().includes(termtrim)
        );

        // Return true if either matches
        return vehicleRegMatch || servicingTypeMatch;
      });
    } else {
      this.servicingAllData = [...this.allBranch]; // Reset to original data
    }

  }

  onStatusChange(item: any) {
    console.log('Servicing status changed:', item.servicingStatus);
    // Handle servicing status update logic here
  }




  filterByDate() {
    console.log("Selected date:", this.selectedDate);
    this.servicingapi.findDateService(this.selectedDate).subscribe((res: any) => {
      console.log("Filtered data for the selected date:", res);

      this.servicingAllData.vehicleServicings = res.map((item: any) => {
        return {
          servicingId: item.servicingId,
          // createdAt: item.createdAt,
          servicingDate: item.servicingDate,
          completionStatus: item.completionStatus,
          servicingType: item.servicingType,

        };
      });

      console.log("Updated servicingAllData after filtering:", this.servicingAllData.vehicleServicings);
      this.page = 1
      console.log('');

    });

  }

  flattenServicingData(): any[] {
    return this.servicingAllData.flatMap((item: { vehicleServicings: any[]; vehicleReg: any; }) =>
      item.vehicleServicings.map((servicing: any) => ({
        vehicleReg: item.vehicleReg,  // Include parent-level properties
        ...servicing
      }))
    );
  }
  calculateTotalAmount(): void {
    this.totalAmount = this.list?.reduce((sum: any, item: { cost: any; }) => sum + (item.cost || 0), 0) || 0;
    console.log('Total Servicing Amount:', this.totalAmount);
  }
}

