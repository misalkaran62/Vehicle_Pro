import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ViewdocumentComponent } from '../viewdocument/viewdocument.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-driverdetails',
  templateUrl: './driverdetails.component.html',
  styleUrls: ['./driverdetails.component.css']
})

export class DriverdetailsComponent implements OnInit {
  driverData: any;
  driverId: number = 0;
  imageUrl: string = '';

  constructor(private userService: UserService,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.driverId = Number(this.activeRoute.snapshot.paramMap.get('id'));


    if (this.driverId !== null && this.driverId != undefined) {
      this.userService.findById(this.driverId).subscribe((response: any) => {
        console.log("driver data", response)
        this.driverData = response;
      })
    }

  }
  viewDocument(docType: string, driverId: number) {
    console.log("viewdocument mai userid", driverId);
    const matref = this.dialog.open(ViewdocumentComponent, {
      width: '140vh',
      // height: '50vh',
      data: { docType: docType, documnetId: driverId },
    });

    matref.afterClosed().subscribe((result: string) => {
      if (result === 'success') {
        this.showData();
      }
    });
  }

  showData() {
    console.log("Data refreshed!");
  }

  downloadImage(docType: string, driverId: number) {
    this.userService.findByIdImage(driverId, docType).subscribe((response: Blob) => {
      console.log('Blob response received:', response);

      const blobUrl = URL.createObjectURL(response);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${docType}-${driverId}.jpg`; // Set the file name
      link.click(); // Trigger the download

      URL.revokeObjectURL(blobUrl);
    }, error => {
      console.error('Error while fetching the file:', error);
    });
  }

}
