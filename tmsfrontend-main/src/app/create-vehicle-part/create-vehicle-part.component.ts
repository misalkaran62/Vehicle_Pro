import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartchangeService } from '../services/partchange.service';
import { Toast } from '../services/sweetalert';

@Component({
  selector: 'app-create-vehicle-part',
  templateUrl: './create-vehicle-part.component.html',
  styleUrls: ['./create-vehicle-part.component.css']
})
export class CreateVehiclePartComponent implements OnInit{
  partForm:any;
  isEdit: boolean = false;
  constructor(
    private fb:FormBuilder,
    private partapi:PartchangeService,
    
      @Inject(MAT_DIALOG_DATA) public data: any
        , private dialogRef: MatDialogRef<CreateVehiclePartComponent>
  ){}

  
  ngOnInit(): void {
    this.isEdit = !!this.data?.part;
    this.partForm=this.fb.group({
      
      // partName:[''],
      // brandName:[''],
      // remark:['']
      
      id: [this.data?.part?.id || null],
      partName: [this.data?.part?.partName || ''],
      brandName: [this.data?.part?.brandName || ''],
      remark: [this.data?.part?.remark || '']
    })
    
    
  }

  close(status: any): void {
    this.dialogRef.close(status);
  }
  onSubmit(){
  //   console.log('this.partchange',this.partForm.value);
  //   this.partapi.createPart(this.partForm.value).subscribe((res)=> {

  //     console.log('creating part',res);
  //       Toast.fire({ icon: 'success', title: res.message });
  //             this.dialogRef.close('success');
      
  //   },
  //   (error) => {
  //     console.error('Error:', error);
  //   }
  // )
  if (this.isEdit) {
    this.updatePart();
  } else {
    this.createPart();
  }
  }



  createPart(): void {
    this.partapi.createPart(this.partForm.value).subscribe(
      (res) => {
        Toast.fire({ icon: 'success', title: 'Part created successfully!' });
        this.dialogRef.close('success'); // Close dialog and refresh the parent
      },
      (error) => {
        console.error('Error creating part:', error);
      }
    );
  }


 



  private updatePart(): void {
    const updatedData = this.partForm.value; // Includes `id`, `partName`, `brandName`, and `remark`
  
    this.partapi.updatepart(updatedData).subscribe(
      (res) => {
        Toast.fire({ icon: 'success', title: 'Part updated successfully!' });
        this.dialogRef.close('success');
      },
      (error) => {
        console.error('Error updating part:', error);
      }
    );
  }
  }

