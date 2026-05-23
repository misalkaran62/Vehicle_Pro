import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AddDocumentDialogComponent } from '../add-document-dialog/add-document-dialog.component';
import { InsuranceService } from 'src/app/services/insurance.service';
import { PucService } from 'src/app/services/documentService/puc.service';
import { RoadtaxService } from 'src/app/services/documentService/roadtax.service';
import { FitnessService } from 'src/app/services/documentService/fitness.service';
import { PermitService } from 'src/app/services/documentService/permit.service';
import { UpdateDocumentDialogComponent } from '../update-document-dialog/update-document-dialog.component';
import { Toast } from 'src/app/services/sweetalert';
import Swal from 'sweetalert2';
import { ViewdocumentComponent } from '../viewdocument/viewdocument.component';
import { FinanceServiceService } from 'src/app/services/documentService/finance-service.service';

@Component({
  selector: 'app-viewmorevehicle',
  templateUrl: './viewmorevehicle.component.html',
  styleUrls: ['./viewmorevehicle.component.css']
})
export class ViewmorevehicleComponent implements OnInit {
  selectedTable: string = '';
  img: any;
  data: any;
  router: any;
  renewalDue: string = '';
  finance: any;
  constructor(
    private veh: VehicleService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private insuranceService: InsuranceService,
    private pucService: PucService,
    private toadTaxService: RoadtaxService,
    private fitnessService: FitnessService,
    private premitService: PermitService,
    private vehicleServicingService: VehicleService,
    private financesService: FinanceServiceService,

  ) { }

  vehicle: any
  vehicleId: any;

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.vehicleId = id ? +id : NaN; // If 'id' is null, return NaN
    this.findData()

  }

  findData() {
    this.veh.findByVehicleId(this.vehicleId).subscribe(
      (data) => {
        console.log(data);
        this.vehicle = data
        this.renewalDue = data.renewalDue;
        console.log('renewal due', this.renewalDue);
        console.log(this.vehicle)

      })
  }

  openDialog(documentType: string): void {
    const dialogRef = this.dialog.open(AddDocumentDialogComponent, {
      width: '500px',
      data: { type: documentType, vehicleId: this.vehicleId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result (e.g., add the new document to the table)
        this.findData()
        console.log(`${documentType} added`, result);
      }
    });
  }

  // Switch to show the desired table
  showTable(tableName: any) {
    this.selectedTable = tableName || null;
  }





  deleteRow(fitnessID: number, fitnessType: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform the deletion based on fitnessType
        let fitnessTypeData = fitnessType.toLowerCase();

        switch (fitnessTypeData) {
          case 'finances':
            this.financesService.deleteVehicleFinanceById(fitnessID).subscribe(() => {
              this.findData(); // Perform relevant actions for finances
              Toast.fire({ icon: 'success', title: 'Deleted successfully!' });
            })
            break;

          case 'fitness':
            this.fitnessService.deleteFitnessById(fitnessID).subscribe(() => {
              this.findData(); // Refresh data after successful deletion
              Toast.fire({ icon: 'success', title: 'Deleted successfully!' });
            });
            break;

          case 'permits':
            this.premitService.deletePermitById(fitnessID).subscribe(() => {
              this.findData();
              Toast.fire({ icon: 'success', title: 'Deleted successfully!' });
            });
            break;

          case 'insurance':
            this.insuranceService.deleteInsuranceById(fitnessID).subscribe(() => {
              this.findData();
              Toast.fire({ icon: 'success', title: 'Deleted successfully!' });
            });
            break;

          case 'vehiclepucs':
            this.pucService.deletePUCById(fitnessID).subscribe(() => {
              this.findData();
              Toast.fire({ icon: 'success', title: 'Deleted successfully!' });
            });
            break;

          case 'roadtaxes':
            this.toadTaxService.deleteRoadTaxById(fitnessID).subscribe(() => {
              this.findData();
              Toast.fire({ icon: 'success', title: 'Deleted successfully!' });
            });
            break;

          case 'vehicleservicings':
            this.vehicleServicingService.deleteVehicleById(fitnessID).subscribe(() => {
              this.findData();
              Toast.fire({ icon: 'success', title: 'Deleted successfully!' });
            });
            break;

          default:
            console.error('Unknown fitness type:', fitnessType);
        }
      }
    });
  }






  openDialogForUpdate(documentID: number, documentType: string, data: any): void {
    console.log('Data being passed to dialog:', { documentID, documentType, data }); // Log this
    const dialogRef = this.dialog.open(UpdateDocumentDialogComponent, {
      width: '500px',
      data: { type: documentType.toLowerCase(), vehicleId: documentID, existingData: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result (e.g., add the new document to the table)
        this.findData()
        console.log(`${documentType} added`, result);
      }
    });
  }

  openVehicleDetails(docType: string, id: any) {
    console.log("viewdocument mai userid", id);

    const matref = this.dialog.open(ViewdocumentComponent, {
      width: '850px',
      data: { documnetId: id, docType: docType }
    });


    matref.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.showData(); // Refresh the user list
      }
    });
  }
  showData() { }

  downloadimage(docType: string, driverId: number) {
    const documentUrls: { [docType: string]: string } = {
      repaymentSchedule: this.finance.repaymentScheduleFileName,
      sanctionLetter: this.finance.sanctionLetterFileName
    };
    const imageUrl = documentUrls[docType];
    if (!imageUrl) {
      console.error(`Image URL for ${docType} is not available!`);
      return;
    }
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${docType}-${driverId}.jpg`;
    link.click();
  }
}
