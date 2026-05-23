import { Component, OnInit } from '@angular/core';
import { ServicingService } from '../services/servicing.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewdocumentComponent } from '../vehicle/viewdocument/viewdocument.component';

@Component({
  selector: 'app-servicing-print',
  templateUrl: './servicing-print.component.html',
  styleUrls: ['./servicing-print.component.css']
})
export class ServicingPrintComponent implements OnInit {
  rowid: any;
  isImageDivVisible: boolean = false;
  servicingData: any; // Updated servicingData as an empty array for dynamic data.

  displayedColumns: string[] = [
    'approved',
    'cost',
    'lastServicing',
    'servicingVendor',
    'servicingType',
    'servicingDate',
    'status',
    'viewDocuments',
  ];
  selectedIndex: any;
  imageURLs: any;
  paymentURLs: any;
  paymentisImageDivVisible: boolean=false;
  constructor(
    private servicingseri: ServicingService,
    private active: ActivatedRoute, private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.rowid = this.active.snapshot.params['id'];
    console.log('Row ID:', this.rowid);
    this.loadServicingData();
  }

  loadServicingData() {
    this.servicingseri.getOneServicing(this.rowid).subscribe((res: any) => {
      // Check if `res` is an array; if not, wrap it into one
      const servicingItems = Array.isArray(res) ? res : [res];

      this.servicingData = servicingItems.map((item) => ({
        ...item,
        lastServicing: this.parseDate(item.lastServicing),
        servicingDate: this.parseDate(item.servicingDate),
      }));

      console.log('Loaded servicing data:', this.servicingData);
    });
  }


  /**
   * Safely parses a date from an array of numbers.
   * @param dateArray Array of numbers representing a date.
   * @returns A JavaScript Date object or `null` if input is invalid.
   */
  parseDate(dateArray: any): Date | null {
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return new Date(year, month - 1, day); // Month is 0-indexed
    }
    return null; // Return null if the input is not a valid date array
  }



  // viewDocument(docType: string,documnetId:number) {


  //   console.log("viewdocument mai userid", docType);
  //   console.log("imga id userid", documnetId);
  //   const matref = this.dialog.open(ViewdocumentComponent, {
  //     width: '850px',
  //      data: { docType: docType, documnetId: documnetId }
  //   });


  //   matref.afterClosed().subscribe((result) => {
  //     if (result === 'success') {
  //       this.loadServicingData();
  //     }
  //   });
  // // }
  // viewPayment(docType: string, id: any){


  //     console.log("viewdocument mai userid of payment", id);

  //     const matref = this.dialog.open(ViewdocumentComponent, {
  //       width: '850px',
  //       data: { documnetId: id, docType: docType }
  //     });


  //     matref.afterClosed().subscribe((result) => {
  //       if (result === 'success') {
  //         this.loadServicingData();
  //       }
  //     });
  //   }


  findImage() {
    if (!this.servicingData[0]?.partChangeNames?.length) {
      console.log('No part change images available.');
      this.isImageDivVisible = true;
      return;
    }

    this.isImageDivVisible = !this.isImageDivVisible; // Toggle the visibility of the div
    // alert(this.currentServiceData);
    console.log('find image ', this.servicingData[0].
      partChangeNames);

    for (let i = 0; i < this.servicingData[0].partChangeNames.length; i++) {
      const fileName = this.servicingData[0].partChangeNames[i];
      console.log(`Processing file ${i + 1}: ${fileName}`);

      this.processFile(this.rowid, i);

    }
  }

  processFile(servicingid: number, index: number): void {
    console.log(`Processing file: ${servicingid}, index: ${index}`);
    this.selectedIndex = index;  // Track the selected index
    // Initialize the array to store image URLs
    this.imageURLs = [];  // Clear the previous images before fetching new ones
    // Call the service method to fetch related data (multiple images in this case)
    this.servicingseri.findByIdImage(servicingid, index).subscribe({
      next: (data: any) => {
        const objectURL = URL.createObjectURL(data);
        this.imageURLs.push(objectURL);  // Add each image URL to the array
      },
      error: (err) => {
        console.error('Error loading document images', err);
      },
    });
  }


  findpayment(): void {
    console.log('Fetching payment receipt image...');
    // Get the payment receipt name
    const fileName = this.servicingData[0]?.paymentReceiptName;
    if (fileName) {
      console.log(`Processing payment receipt file: ${fileName}`);
      // Process the single payment receipt file
      this.processpaymentFile(this.rowid);
      this.paymentisImageDivVisible = true; // Show the image div
    } else {
      console.log('No payment receipt image available.');
      this.paymentisImageDivVisible = false; // Hide the image div
    }
  }

  processpaymentFile(servicingid: number): void {
    console.log(`Processing file for servicing ID: ${servicingid}`);
    this.paymentURLs = []; // Clear the previous images before fetching a new one
    this.servicingseri.findByIdpayment(servicingid).subscribe({
      next: (data: any) => {
        const objectURL = URL.createObjectURL(data);
        this.paymentURLs.push(objectURL); // Push the single image URL to the array
      },
      error: (err) => {
        console.error('Error loading payment receipt image', err);
      },
    });
  }


  downloadImage(type: 'image' | 'payment', index?: number): void {
    let url: any;
  
    if (type === 'image') {
      // For imageURLs, index is required
      if (index === undefined || !this.imageURLs[index]) {
        console.error(`No image URL available for download at index ${index}`);
        return;
      }
      url = this.imageURLs[index];
    } else if (type === 'payment') {
      // For paymentURLs, no index is required
      url = this.paymentURLs[0];
      if (!url) {
        console.error('No payment URL available for download');
        return;
      }
    }
  
    // Create a link to download the file
    const link = document.createElement('a');
    link.href =url;
  
    // Set the filename dynamically based on the type
    const fileName = type === 'image' ? `Image-${(index ?? 0) + 1}.jpg` : 'PaymentReceipt.jpg';
    link.download = fileName;
    link.click();
  
    console.log(`Downloaded: ${fileName}`);
    URL.revokeObjectURL(url); // Clean up
  }

}

