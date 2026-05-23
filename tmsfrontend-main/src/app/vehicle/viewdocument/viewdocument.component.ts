import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FinanceServiceService } from 'src/app/services/documentService/finance-service.service';
import { FitnessService } from 'src/app/services/documentService/fitness.service';
import { PermitService } from 'src/app/services/documentService/permit.service';
import { PucService } from 'src/app/services/documentService/puc.service';
import { RcbookService } from 'src/app/services/documentService/rcbook.service';
import { RoadtaxService } from 'src/app/services/documentService/roadtax.service';
import { DriverService } from 'src/app/services/driver.service';
import { InsuranceService } from 'src/app/services/insurance.service';
import { ServicingService } from 'src/app/services/servicing.service';
import { UserService } from 'src/app/services/user.service';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-viewdocument',
  templateUrl: './viewdocument.component.html',
  styleUrls: ['./viewdocument.component.css'],
})
export class ViewdocumentComponent implements OnInit {
  pdfUrl: string | null = null;
  showDownload: boolean = true; // Store the object URL for the PDF
  @ViewChild('iframe') iframeRef?: ElementRef<HTMLIFrameElement>;
  img: any;
  pdfType: any;
  str = `${this.datas.docType}-${this.datas.documnetId}`;

  constructor(
    private userService: UserService, 
    private servicing: ServicingService,
    private permitService: PermitService,
    private insuranceService: InsuranceService,
    private fitnessService: FitnessService,
    private roadTaxService: RoadtaxService,
    private pucService: PucService,
    private financeService: FinanceServiceService,
    private driverservice: DriverService,
    private vehicleService: VehicleService,
    private rcbookService: RcbookService,

    @Inject(MAT_DIALOG_DATA) public datas: any,
    private dialogRef: MatDialogRef<ViewdocumentComponent>
  ) { }
  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }

  ngOnInit(): void {
    console.log(this.str);
    console.log('hiii',this.datas);

    this.updateData(this.datas.docType, this.datas.documnetId);
  }

  updateData(doucumetType: string, documentId: number) {
    console.log(this.pdfType);

    // Switchcase to handle form submission
    if (documentId && doucumetType != undefined && doucumetType != null) {
      switch (doucumetType) {
        case 'rcbook':
          this.rcbookService.findDocument(documentId).subscribe({
            next: (data: Blob) => {
              this.pdfType = data
              console.log(data);
              const objectURL = URL.createObjectURL(data);
              this.pdfUrl = objectURL; // Use this in your HTML
              // this.pdfUrlExtension = this.pdfUrl.endsWith()
            },
            error: (err) => {
              console.error('Error loading document image', err);
            },
          });
          break;
        case 'repaymentSchedule':
          this.financeService
            .findDocumentByVehicleFinance(documentId, 'repaymentSchedule')
            .subscribe({
              next: (data: Blob) => {
                this.pdfType = data
                console.log(data);
                const objectURL = URL.createObjectURL(data);
                this.pdfUrl = objectURL; // Use this in your HTML
                // this.pdfUrlExtension = this.pdfUrl.endsWith()
              },
              error: (err) => {
                console.error('Error loading document image', err);
              },
            });
          break;
        case 'sanctionLetter':
          this.financeService
            .findDocumentByVehicleFinance(documentId, 'sanctionLetter')
            .subscribe({
              next: (data: Blob) => {
                this.pdfType = data
                console.log(data);
                const objectURL = URL.createObjectURL(data);
                this.pdfUrl = objectURL; // Use this in your HTML
                // this.pdfUrlExtension = this.pdfUrl.endsWith()
              },
              error: (err) => {
                console.error('Error loading document image', err);
              },
            });
          break;
        case 'permit':
          this.permitService.findDocumentByPermitId(documentId).subscribe({
            next: (data: Blob) => {
              this.pdfType = data
              console.log(data);
              const objectURL = URL.createObjectURL(data);
              this.pdfUrl = objectURL; // Use this in your HTML
              // this.pdfUrlExtension = this.pdfUrl.endsWith()
            },
            error: (err) => {
              console.error('Error loading document image', err);
            },
          });
          break;

        case 'insurance':
          this.insuranceService
            .findDocumentByInsuranceId(documentId)
            .subscribe({
              next: (data: Blob) => {
                this.pdfType = data
                console.log(data);
                const objectURL = URL.createObjectURL(data);
                this.pdfUrl = objectURL; // Use this in your HTML
                // this.pdfUrlExtension = this.pdfUrl.endsWith()
              },
              error: (err) => {
                console.error('Error loading document image', err);
              },
            });
          break;

        case 'fitness':
          this.fitnessService.findDocumentByFitnessId(documentId).subscribe({
            next: (data: Blob) => {
              this.pdfType = data
              console.log(data);
              const objectURL = URL.createObjectURL(data);
              this.pdfUrl = objectURL; // Use this in your HTML
              // this.pdfUrlExtension = this.pdfUrl.endsWith()
            },
            error: (err) => {
              console.error('Error loading document image', err);
            },
          });
          break;

        case 'roadtaxes':
          this.roadTaxService.findDocumentByRoadTaxId(documentId).subscribe({
            next: (data: Blob) => {
              this.pdfType = data
              const objectURL = URL.createObjectURL(data);
              this.pdfUrl = objectURL; // Use this in your HTML
              // this.pdfUrlExtension = this.pdfUrl.endsWith()
              console.log(this.pdfType);

              console.log(data);
              console.log(this.pdfUrl);
              // this.pdfUrlExtension = this.pdfUrl.endsWith()
            },
            error: (err) => {
              console.error('Error loading document image', err);
            },
          });
          break;

        case 'pucs':
          this.pucService.findDocumentByPucId(documentId).subscribe({
            next: (data: Blob) => {
              this.pdfType = data
              console.log(data);
              const objectURL = URL.createObjectURL(data);
              this.pdfUrl = objectURL; // Use this in your HTML
              console.log(this.pdfType.type);
              // this.pdfUrlExtension = this.pdfUrl.endsWith()
            },
            error: (err) => {
              console.error('Error loading document image', err);
            },
          });

          break;

        case 'aadharcard':
          this.driverservice
            .findByIdImage(documentId, this.datas.docType)
            .subscribe({
              next: (data: Blob) => {
                this.pdfType = data
                console.log(data);
                const objectURL = URL.createObjectURL(data);
                this.pdfUrl = objectURL; // Use this in your HTML
                // this.pdfUrlExtension = this.pdfUrl.endsWith()
              },
              error: (err) => {
                console.error('Error loading document image', err);
              },
            });

          break;
        case 'pancard':
          this.driverservice
            .findByIdImage(documentId, this.datas.docType)
            .subscribe({
              next: (data: Blob) => {
                this.pdfType = data
                console.log(data);
                const objectURL = URL.createObjectURL(data);
                this.pdfUrl = objectURL; // Use this in your HTML
                // this.pdfUrlExtension = this.pdfUrl.endsWith()
              },
              error: (err) => {
                console.error('Error loading document image', err);
              },
            });

          break;
        case 'drivinglicense':
          this.driverservice
            .findByIdImage(documentId, this.datas.docType)
            .subscribe({
              next: (data: Blob) => {
                this.pdfType = data
                console.log(data);
                const objectURL = URL.createObjectURL(data);
                this.pdfUrl = objectURL; // Use this in your HTML
                // this.pdfUrlExtension = this.pdfUrl.endsWith()
              },
              error: (err) => {
                console.error('Error loading document image', err);
              },
            });

          break;

        case 'vehicle':
          this.vehicleService
            .findVehicleImageById(documentId, this.datas.docType)
            .subscribe({
              next: (data: Blob) => {
                this.pdfType = data
                console.log(data);
                const objectURL = URL.createObjectURL(data);
                this.pdfUrl = objectURL; // Use this in your HTML
                // this.pdfUrlExtension = this.pdfUrl.endsWith()
              },
              error: (err: any) => {
                console.error('Error loading document image', err);
              },
            });

          break;
        case 'payment':
          this.servicing.findByIdImage(documentId, this.datas.docType)
            .subscribe({
              next: (data: Blob) => {
                this.pdfType = data
                console.log(data);
                const objectURL = URL.createObjectURL(data);
                this.pdfUrl = objectURL; // Use this in your HTML
                // this.pdfUrlExtension = this.pdfUrl.endsWith()
                if (this.pdfType && this.pdfType.type) {
                  console.log(this.pdfType.type); // This will prevent errors if pdfType is undefined or doesn't have a type
                } else {
                  console.error('pdfType or pdfType.type is undefined');
                }
              },
              error: (err) => {
                console.error('Error loading document image', err);
              },
            });
          break;
        case 'partChange':
          this.servicing
            .findByIdImage(documentId, this.datas.docType)
            .subscribe({
              next: (data: Blob) => {
                this.pdfType = data
                console.log(data);
                const objectURL = URL.createObjectURL(data);
                this.pdfUrl = objectURL; // Use this in your HTML
                // this.pdfUrlExtension = this.pdfUrl.endsWith()
              },
              error: (err) => {
                console.error('Error loading document image', err);
              },
            });
          break;
        default:
          console.error('Unknown document type');
          break;
      }
    }
  }

  downloadImage() {
    if (this.pdfUrl) {
      const fileExtension = this.pdfUrl.endsWith('.pdf') ? 'pdf' : 'jpg';

      const link = document.createElement('a');
      link.href = this.pdfUrl;

      link.download = `${this.datas.docType}-${this.datas.documnetId}.${fileExtension}`;
      // this.file
      link.click();

      URL.revokeObjectURL(this.pdfUrl);
    } else {
      console.error('Something went wrong: PDF URL is null or undefined.');
    }
  }
}

// downloadImage() {
//   if (this.pdfUrl) {
//     const fileExtensionMatch = this.pdfUrl.match(/\.(\w+)$/);
//     const fileExtension = fileExtensionMatch ? fileExtensionMatch[1] : 'unknown';

//     if (fileExtension !== 'unknown') {
//       const link = document.createElement('a');
//       link.href = this.pdfUrl;

//       link.download = `${this.datas.docType}-${this.datas.documnetId}.${fileExtension}`;

//       link.click();

//       // Revoke the object URL if it's created dynamically
//       URL.revokeObjectURL(this.pdfUrl);
//     } else {
//       console.error("Invalid file extension detected in the URL.");
//     }
//   } else {
//     console.error("Something went wrong: PDF URL is null or undefined.");
//   }
// }

// ngOnInit(): void {
//   console.log('Datas:', this.datas);

//   if (this.datas.docType) {
//     // User API
//     this.userService.findByIdImage(this.datas.driverId, this.datas.docType).subscribe({
//       next: (data: Blob) => {
//         console.log('PDF Data:', data);
//         const objectURL = URL.createObjectURL(data);
//         this.pdfUrl = objectURL; // Store the object URL for the PDF
//       },
//       error: (err) => {
//         console.error('Error loading document image', err);
//       }
//     });
//   } else {
//     // Service API
//     this.servicing.findByIdImage(this.datas.servicingId, this.datas.imgTypeSW).subscribe({
//       next: (data: Blob) => {
//         console.log('Image Data:', data);
//         const objectURL = URL.createObjectURL(data);
//         this.pdfUrl = objectURL; // Store the object URL for the PDF/image
//         console.log(this.pdfUrl);
//       },
//       error: (err) => {
//         console.error('Error loading document image', err);
//       }
//     });
//   }
// }

// ngAfterViewInit(): void {
//   const iframe = this.iframeRef?.nativeElement;
//   if (iframe) {
//     iframe.onload = () => {
//       this.applyStylesToIframe(iframe);
//     };
//   }
// }

// applyStylesToIframe(iframe: HTMLIFrameElement): void {
//   const iframeDocument = iframe.contentDocument;
//   if (iframeDocument) {
//     const img = iframeDocument.querySelector('img');
//     if (img) {
//       img.style.width = '100%';
//       img.style.height = '100%';
//       img.style.objectFit = 'contain'; // Example style
//       img.style.display = 'block';
//     }
//   }
// }

// ngOnDestroy(): void {
//   if (this.pdfUrl) {
//     URL.revokeObjectURL(this.pdfUrl);
//   }
// }
