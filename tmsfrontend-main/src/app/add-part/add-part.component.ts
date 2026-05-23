import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateVehiclePartComponent } from '../create-vehicle-part/create-vehicle-part.component';
import { PartchangeService } from '../services/partchange.service';
import { Toast } from '../services/sweetalert';

@Component({
  selector: 'app-add-part',
  templateUrl: './add-part.component.html',
  styleUrls: ['./add-part.component.css']
})
export class AddPartComponent implements OnInit {
  allparts: any[]=[];
  filteredParts = [];
   itemsPerPage = 5;
  page = 1;
  searchTerm: string = ''
  
  constructor(
    private partapi: PartchangeService,
    private rout: Router,
    private dilog: MatDialog
  ) { }
  ngOnInit(): void {
    this.showVehiclePart();
  }

  addPart(part: any = null) {
    const dialogRef = this.dilog.open(CreateVehiclePartComponent, {
      width: '500px',
      disableClose: true,
      data: { part}, // Pass part data if editing, null if creating
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.showVehiclePart();
      }
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
  }

  search(){
    const term = this.searchTerm.toLowerCase();
    this.allparts = this.allparts.filter((item) =>
      item.partName.toLowerCase().includes(term)
    );
    }
    
  showVehiclePart() {
    this.partapi.showParts().subscribe((res) => {
      console.log('list of parts', res);
      this.allparts=res;
    })
  }

  deletePart(id:number){
    console.log('part id',id);
    this.partapi.removepart(id).subscribe((result:any)=>{
      if (result.status) {
        Toast.fire({ icon: 'success', title: result.message })
      }
      else{
        Toast.fire({ icon: 'error', title: result.message })
      }
   
      this.showVehiclePart();
    })
  }
}
