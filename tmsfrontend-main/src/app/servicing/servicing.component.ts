import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicingService } from '../services/servicing.service';
import { VehicleService } from '../services/vehicle.service';
import { Toast } from '../services/sweetalert';
import { CreateServicngComponent } from '../create-servicng/create-servicng.component';
import { MatDialog } from '@angular/material/dialog';
import { ServicingListComponent } from '../servicing-list/servicing-list.component';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-servicing',
  templateUrl: './servicing.component.html',
  styleUrls: ['./servicing.component.css']
})
export class ServicingComponent implements OnInit {
  @Output() approvedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  itemsPerPage = 5;
  page = 1;
  searchTerm: string = ''
  servicingAllData: any;
  servicingDataNotVehicleData:any[]=[];
  allBranch: any[] = [];
  newServicingData: any;
  isPartChangeVisible: boolean = false;

  statusOptions: string[] = ['SERVICING_RAISED', 'ON_SERVICING', 'SERVICING_COMPLETED'];

  flattenedData: any[] = [];
  selectedDate: string = '';
 
  filteredServicingData: any[] = [];

  constructor(
    private vehicleapi: VehicleService,
    private servicingapi: ServicingService,
    private rout: Router,
    private dilog: MatDialog
  ) { }

  ngOnInit(): void {


    this.showAllServicingData();


  }

  showAllServicingData() {
    this.vehicleapi.showAllVehicle().subscribe((result) => {
      this.servicingAllData = result
console.log('serviicng data',result);

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



  addServicing() {

    const MatDialogRef = this.dilog.open(CreateServicngComponent, {
      width: '850px',
      disableClose: true
    })
    MatDialogRef.afterClosed().subscribe((res) => {
      this.showAllServicingData(); // Refresh the user list
    });


    const newServicing = {
      vehicleReg: this.newServicingData.vehicleReg,  // Vehicle registration from user input
      lastServicing: this.newServicingData.lastServicing,  // Last servicing date
      servicingVendor: this.newServicingData.servicingVendor,
      servicingId: this.generateNewServicingId(),  // Generate a unique servicing ID
      servicingType: this.newServicingData.servicingType,
      servicingDate: this.newServicingData.servicingDate,
      servicingDescription: this.newServicingData.servicingDescription,
      status: this.newServicingData.status,
      approved: this.newServicingData.approved,
      completionStatus: this.newServicingData.completionStatus || 'SERVICING_RAISED'
    };

    // Find if the vehicle already exists in servicingAllData
    let vehicle = this.servicingAllData.find((item: { vehicleReg: any }) => item.vehicleReg === newServicing.vehicleReg);

    // If the vehicle exists
    if (vehicle) {
      // Check if the servicingId already exists in the vehicle's servicing list
      let servicingExists = vehicle.vehicleServicings.some((existingServicing: any) => existingServicing.servicingId === newServicing.servicingId);

      // If servicing already exists, show an error or message
      if (servicingExists) {
        Toast.fire({ icon: 'error', title: 'This servicing already exists for this vehicle!' });
        return;
      }

      // If no existing servicing found, add the new servicing to the vehicle's servicing list
      vehicle.vehicleServicings.push(newServicing);

    } else {
      // If the vehicle doesn't exist in the servicingAllData array, create a new vehicle entry with the new servicing
      this.servicingAllData.push({
        vehicleReg: newServicing.vehicleReg,
        vehicleServicings: [newServicing]
      });
    }

    // Optionally clear form fields or update the UI
    // this.clearServicingForm();  // Uncomment this if you want to clear the form after creating
  }

  // Generate a unique servicing ID
  generateNewServicingId(): string {
    return `serv-${Math.random().toString(36).substr(2, 9)}`;
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
  oneService(vehicleId:number) {
    console.log('hiii am servicng list');
    

    this.rout.navigate(['/dashboard/servicinglist/', vehicleId]);

    console.log('vehicle id in servicing', vehicleId);
    // const MatDialogRef = this.dilog.open(ServicingListComponent, {
    //   width: '850px',
    //   disableClose: true,
    //   data: { vehicleId: vehicleId }


    // })
    // MatDialogRef.afterClosed().subscribe((res) => {

    //   this.showAllServicingData(); // Refresh the user list

    // });

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
        const vehicleRegMatch = user.vehicleReg?.toLowerCase().includes(termtrim);

        const servicingTypeMatch = user.vehicleServicings?.some((servicing: any) =>
          servicing.servicingType?.toLowerCase().includes(termtrim)
        );
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
    if (this.selectedDate) {
      const selectedDateObj = new Date(this.selectedDate);
     
      
      this.filteredServicingData = this.servicingAllData.filter((item: any) =>
        item.vehicleServicings.some((servicing: any) => {
          const servicingDate = new Date(servicing.servicingDate);
          return (
            servicingDate.toDateString() === selectedDateObj.toDateString()
          );
        })
        
      );
      console.log('filterde',this.filteredServicingData);
    } else {
      this.filteredServicingData = [...this.servicingAllData]; // Reset to all data
    }
  }



 flattenServicingData(): any[] {
  return this.servicingAllData.flatMap((item: { vehicleServicings: any[]; vehicleReg: any; }) =>
    item.vehicleServicings.map((servicing: any) => ({
      vehicleReg: item.vehicleReg,  
      ...servicing,
      servicingDate: new Date(servicing.servicingDate[0], servicing.servicingDate[1] - 1, servicing.servicingDate[2])
    }))
  );
}

// Method to get the most recent "ON_SERVICING" servicing





// Method to get the latest servicing date-wise
// Method to get the latest servicing date-wise
getLatestServicing(item: any) {
  // Ensure vehicleServicings is an array and not null/undefined
  if (!item?.vehicleServicings || !Array.isArray(item.vehicleServicings)) {
    return null; // Return null if the array is empty or not available
  }

  // Sort the vehicleServicings by 'servicingDate' (most recent first)
  const sorted = item.vehicleServicings.sort(
    (a: any, b: any) => {
      // Ensure servicingDate exists and is a valid array with 3 elements (year, month, day)
      const dateA = a.servicingDate && a.servicingDate.length === 3 
        ? new Date(a.servicingDate[0], a.servicingDate[1] - 1, a.servicingDate[2]) 
        : new Date(0); // Fallback to a very early date if invalid
      const dateB = b.servicingDate && b.servicingDate.length === 3 
        ? new Date(b.servicingDate[0], b.servicingDate[1] - 1, b.servicingDate[2]) 
        : new Date(0); // Fallback to a very early date if invalid

      return dateB.getTime() - dateA.getTime(); // Sorting in descending order (most recent first)
    }
  );

  // Return the latest servicing (the first one after sorting)
  return sorted.length > 0 ? sorted[0] : null; // If no servcings, return null
}
exportToExcel(): void {
  const excludeColumns = new Set(['partChangeNames','paymentReceiptName','lastServicing','servicingDate','createdAt','oldPartMappings','newPartMappings']);

  for (let i = 0; i < this.servicingAllData.length; i++) {
    for (let j = 0; j < this.servicingAllData[i].vehicleServicings.length; j++) {
      this.servicingDataNotVehicleData.push(this.servicingAllData[i].vehicleServicings[j])
    }
  }
    const servicingDataNotVehicleData = this.servicingDataNotVehicleData.map(obj => {

    const newObj = { 
      ...obj,
      "Old part serial no": obj.oldPartMappings[0]!=null?obj.oldPartMappings[0].serialNumber:  "N/A",
      "New part serial no": obj.newPartMappings[0]!=null?obj.newPartMappings[0].serialNumber:  "N/A",
      "Creation Date": obj.createdAt!=null?obj.createdAt[0]+"-"+obj.createdAt[1]+"-"+obj.createdAt[2] : "N/A",
      "Servicing Date":obj.servicingDate[0]+"-"+obj.servicingDate[1]+"-"+obj.servicingDate[2] || "N/A",
      "Last Servicing Date":obj.lastServicing!=null?obj.lastServicing[0]+"-"+obj.lastServicing[1]+"-"+obj.lastServicing[2] : "N/A",
     };
     excludeColumns.forEach(col => delete newObj[col]);
     return newObj;
  })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(servicingDataNotVehicleData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    XLSX.writeFile(wb, 'servicing_data.xlsx');
  }
}
